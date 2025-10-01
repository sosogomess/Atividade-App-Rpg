import React, { useState, useRef, useEffect } from 'react';
import { 
  SafeAreaView, 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  FlatList, 
  StyleSheet, 
  Alert,
  Modal,
  LayoutAnimation,
  Platform,
  UIManager,
  Animated
} from 'react-native';
import { StatusBar } from 'expo-status-bar';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function App() {
  const [characters, setCharacters] = useState([
    { id: 1, name: 'Aragorn', class: 'Guerreiro', level: 15, recruited: false },
    { id: 2, name: 'Gandalf', class: 'Mago', level: 50, recruited: true },
    { id: 3, name: 'Legolas', class: 'Arqueiro', level: 12, recruited: false },
    { id: 4, name: 'Gimli', class: 'Guerreiro', level: 10, recruited: true },
  ]);
  
  const [name, setName] = useState('');
  const [characterClass, setCharacterClass] = useState('');
  const [level, setLevel] = useState('');
  const [nextId, setNextId] = useState(5);
  
  const [filter, setFilter] = useState('all');
  const [modalVisible, setModalVisible] = useState(false);
  const [modalAction, setModalAction] = useState(null);
  
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(-100)).current;

  const addCharacter = () => {
    if (!name.trim() || !characterClass.trim() || !level.trim()) {
      showToast('Preencha todos os campos!', 'error');
      return;
    }

    const levelNum = parseInt(level);
    if (isNaN(levelNum) || levelNum < 1 || levelNum > 100) {
      showToast('Nível deve ser entre 1 e 100!', 'error');
      return;
    }

    const newCharacter = {
      id: nextId,
      name: name.trim(),
      class: characterClass.trim(),
      level: levelNum,
      recruited: false,
    };

    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    
    setCharacters(prev => [...prev, newCharacter]);
    setNextId(prev => prev + 1);
    setName('');
    setCharacterClass('');
    setLevel('');
    
    showToast(`${newCharacter.name} foi adicionado com sucesso!`, 'success');
  };

  const recruitCharacter = (id) => {
    const character = characters.find(char => char.id === id);
    
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    
    setCharacters(prev =>
      prev.map(char =>
        char.id === id ? { ...char, recruited: true } : char
      )
    );
    
    if (character) {
      showToast(`${character.name} foi recrutado para a guilda!`, 'success');
    }
  };

  const removeCharacter = (id) => {
    const character = characters.find(char => char.id === id);
    
    Alert.alert(
      'Confirmar Remoção',
      `Deseja remover ${character?.name} da guilda?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Remover',
          style: 'destructive',
          onPress: () => {
            LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
            
            setCharacters(prev => prev.filter(char => char.id !== id));
            showToast(`${character.name} foi removido da guilda!`, 'error');
          }
        }
      ]
    );
  };

  const getFilteredCharacters = () => {
    switch (filter) {
      case 'recruited':
        return characters.filter(char => char.recruited);
      case 'available':
        return characters.filter(char => !char.recruited);
      default:
        return characters;
    }
  };

  const renderCharacter = ({ item }) => (
    <View style={[styles.card, item.recruited && styles.recruitedCard]}>
      <View style={styles.cardHeader}>
        <Text style={styles.characterName}>{item.name}</Text>
        {item.recruited && <Text style={styles.recruitedBadge}>Recrutado</Text>}
      </View>
      
      <Text style={styles.characterInfo}>Classe: {item.class}</Text>
      <Text style={styles.characterInfo}>Nível: {item.level}</Text>
      
      <View style={styles.cardActions}>
        {!item.recruited ? (
          <TouchableOpacity 
            style={styles.recruitButton} 
            onPress={() => recruitCharacter(item.id)}
          >
            <Text style={styles.buttonText}>Recrutar</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity 
            style={styles.removeButton} 
            onPress={() => removeCharacter(item.id)}
          >
            <Text style={styles.buttonText}>Remover</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  const recruitedCount = characters.filter(char => char.recruited).length;

  const showToast = (message, type = 'success') => {
    setToastMessage(message);
    setToastType(type);
    setToastVisible(true);
    
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();

    setTimeout(() => {
      hideToast();
    }, 3000);
  };

  const hideToast = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: -100,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setToastVisible(false);
      fadeAnim.setValue(0);
      slideAnim.setValue(-100);
    });
  };

  const Toast = () => {
    if (!toastVisible) return null;

    const toastStyle = toastType === 'success' ? styles.successToast : 
                      toastType === 'error' ? styles.errorToast : styles.warningToast;

    return (
      <Animated.View
        style={[
          styles.toast,
          toastStyle,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <Text style={styles.toastText}>{toastMessage}</Text>
      </Animated.View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      <View style={styles.header}>
        <Text style={styles.title}>Atividade RPG</Text>
        <Text style={styles.subtitle}>Gerencie sua guilda de aventureiros</Text>
      </View>
      
      <View style={styles.form}>
        <Text style={styles.formTitle}>Adicionar Novo Personagem</Text>
        
        <TextInput
          style={styles.input}
          placeholder="Nome do personagem"
          value={name}
          onChangeText={setName}
        />
        
        <TextInput
          style={styles.input}
          placeholder="Classe (ex: Guerreiro, Mago...)"
          value={characterClass}
          onChangeText={setCharacterClass}
        />
        
        <TextInput
          style={styles.input}
          placeholder="Nível (1-100)"
          value={level}
          onChangeText={setLevel}
          keyboardType="numeric"
        />
        
        <TouchableOpacity style={styles.addButton} onPress={addCharacter}>
          <Text style={styles.addButtonText}>Adicionar Personagem</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.filterContainer}>
        <Text style={styles.filterTitle}>
          Filtros - {recruitedCount}/{characters.length} recrutados
        </Text>
        
        <View style={styles.filterButtons}>
          <TouchableOpacity 
            style={[styles.filterButton, filter === 'all' && styles.activeFilter]}
            onPress={() => setFilter('all')}
          >
            <Text style={[styles.filterText, filter === 'all' && styles.activeFilterText]}>
              Todos
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.filterButton, filter === 'available' && styles.activeFilter]}
            onPress={() => setFilter('available')}
          >
            <Text style={[styles.filterText, filter === 'available' && styles.activeFilterText]}>
              Disponíveis
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.filterButton, filter === 'recruited' && styles.activeFilter]}
            onPress={() => setFilter('recruited')}
          >
            <Text style={[styles.filterText, filter === 'recruited' && styles.activeFilterText]}>
              Recrutados
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <FlatList
        data={getFilteredCharacters()}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderCharacter}
        style={styles.list}
        showsVerticalScrollIndicator={false}
      />
      
      <Toast />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#facee0',
  },
  header: {
    backgroundColor: '#b24572',
    padding: 20,
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#b24572',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#bdc3c7',
  },
  form: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 20,
    borderRadius: 12,
    elevation: 4,
    shadowColor: '#b24572',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: '#facee0',
  },
  formTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#dfa792',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
    backgroundColor: '#fff',
    elevation: 1,
    shadowColor: '#b24572',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  addButton: {
    backgroundColor: '#b24572',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
    elevation: 2,
    shadowColor: '#b24572',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  filterContainer: {
    backgroundColor: '#fff',
    margin: 16,
    marginBottom: 8,
    padding: 16,
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#b24572',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.12,
    shadowRadius: 3,
    borderWidth: 1,
    borderColor: '#facee0',
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 12,
  },
  filterButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#dfa792',
    elevation: 1,
  },
  activeFilter: {
    backgroundColor: '#b24572',
    borderColor: '#b24572',
  },
  filterText: {
    fontSize: 14,
    color: '#7f8c8d',
    fontWeight: '500',
  },
  activeFilterText: {
    color: '#fff',
  },
  list: {
    flex: 1,
  },
  card: {
    backgroundColor: '#fff',
    margin: 8,
    marginHorizontal: 16,
    padding: 16,
    borderRadius: 12,
    elevation: 4,
    shadowColor: '#b24572',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    borderLeftWidth: 4,
    borderLeftColor: '#dfa792',
    borderWidth: 1,
    borderColor: '#facee0',
  },
  recruitedCard: {
    borderLeftColor: '#b24572',
    backgroundColor: '#fff',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  characterName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    flex: 1,
  },
  recruitedBadge: {
    fontSize: 12,
    color: '#b24572',
    fontWeight: '600',
    backgroundColor: '#facee0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  characterInfo: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 4,
  },
  cardActions: {
    marginTop: 12,
    alignItems: 'flex-end',
  },
  recruitButton: {
    backgroundColor: '#dfa792',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    elevation: 2,
  },
  removeButton: {
    backgroundColor: '#b24572',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    elevation: 2,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
  toast: {
    position: 'absolute',
    top: 60,
    left: 16,
    right: 16,
    padding: 16,
    borderRadius: 8,
    elevation: 6,
    shadowColor: '#b24572',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    zIndex: 1000,
  },
  successToast: {
    backgroundColor: '#dfa792',
  },
  errorToast: {
    backgroundColor: '#b24572',
  },
  warningToast: {
    backgroundColor: '#facee0',
  },
  toastText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});