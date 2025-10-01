import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const AddCharacterForm = ({ onAdd, showConfirmModal, showToast }) => {
  const [name, setName] = useState('');
  const [characterClass, setCharacterClass] = useState('');
  const [level, setLevel] = useState('');

  const classes = ['Guerreiro', 'Mago', 'Arqueiro', 'Ladino', 'Clérigo', 'Paladino'];

  const handleAdd = () => {
    if (!name.trim() || !characterClass.trim() || !level.trim()) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos!');
      return;
    }

    const levelNumber = parseInt(level);
    if (isNaN(levelNumber) || levelNumber < 1 || levelNumber > 100) {
      Alert.alert('Erro', 'O nível deve ser um número entre 1 e 100!');
      return;
    }

    const newCharacter = {
      name: name.trim(),
      class: characterClass.trim(),
      level: levelNumber,
      recruited: false,
    };

    if (showConfirmModal) {
      showConfirmModal(
        'Adicionar Personagem',
        `Deseja adicionar ${newCharacter.name} (${newCharacter.class}, Nível ${newCharacter.level})?`,
        () => {
          onAdd(newCharacter);
          setName('');
          setCharacterClass('');
          setLevel('');
          if (showToast) {
            showToast(`${newCharacter.name} foi adicionado à lista!`, 'success');
          }
        }
      );
    } else {
      onAdd(newCharacter);
      setName('');
      setCharacterClass('');
      setLevel('');
      if (showToast) {
        showToast(`${newCharacter.name} foi adicionado à lista!`, 'success');
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🆕 Adicionar Novo Personagem</Text>
      
      <View style={styles.inputContainer}>
        <MaterialIcons name="person" size={20} color="#7f8c8d" style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder="Nome do personagem"
          value={name}
          onChangeText={setName}
          placeholderTextColor="#bdc3c7"
        />
      </View>

      <View style={styles.inputContainer}>
        <MaterialIcons name="shield" size={20} color="#7f8c8d" style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder="Classe (ex: Guerreiro, Mago...)"
          value={characterClass}
          onChangeText={setCharacterClass}
          placeholderTextColor="#bdc3c7"
        />
      </View>

      <View style={styles.inputContainer}>
        <MaterialIcons name="star" size={20} color="#7f8c8d" style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder="Nível (1-100)"
          value={level}
          onChangeText={setLevel}
          keyboardType="numeric"
          placeholderTextColor="#bdc3c7"
        />
      </View>

      <TouchableOpacity style={styles.addButton} onPress={handleAdd}>
        <MaterialIcons name="add" size={20} color="#fff" />
        <Text style={styles.addButtonText}>Adicionar Personagem</Text>
      </TouchableOpacity>

      <View style={styles.suggestion}>
        <Text style={styles.suggestionTitle}>💡 Classes sugeridas:</Text>
        <Text style={styles.suggestionText}>{classes.join(', ')}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 20,
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 16,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    marginBottom: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: '#2c3e50',
  },
  addButton: {
    backgroundColor: '#27ae60',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  suggestion: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#f1f3f4',
    borderRadius: 8,
  },
  suggestionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 4,
  },
  suggestionText: {
    fontSize: 12,
    color: '#7f8c8d',
    lineHeight: 18,
  },
});

export default AddCharacterForm;