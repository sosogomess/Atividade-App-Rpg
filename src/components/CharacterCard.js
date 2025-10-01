import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const CharacterCard = ({ character, onRecruit, onRemove, showConfirmModal }) => {
  const handleRecruit = () => {
    if (showConfirmModal) {
      showConfirmModal(
        'Recrutar Personagem',
        `Deseja recrutar ${character.name}?`,
        () => onRecruit(character.id)
      );
    } else {
      onRecruit(character.id);
    }
  };

  const handleRemove = () => {
    if (showConfirmModal) {
      showConfirmModal(
        'Remover Personagem',
        `Deseja remover ${character.name} da guilda?`,
        () => onRemove(character.id)
      );
    } else {
      onRemove(character.id);
    }
  };

  return (
    <View style={[styles.card, character.recruited && styles.recruitedCard]}>
      <View style={styles.header}>
        <Text style={styles.name}>{character.name}</Text>
        <View style={styles.statusContainer}>
          {character.recruited && (
            <MaterialIcons name="check-circle" size={20} color="#27ae60" />
          )}
        </View>
      </View>
      
      <View style={styles.info}>
        <Text style={styles.class}>🏷️ {character.class}</Text>
        <Text style={styles.level}>⭐ Nível {character.level}</Text>
      </View>
      
      <View style={styles.actions}>
        {!character.recruited ? (
          <TouchableOpacity style={styles.recruitButton} onPress={handleRecruit}>
            <MaterialIcons name="person-add" size={16} color="#fff" />
            <Text style={styles.recruitButtonText}>Recrutar</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.removeButton} onPress={handleRemove}>
            <MaterialIcons name="person-remove" size={16} color="#fff" />
            <Text style={styles.removeButtonText}>Remover</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    margin: 8,
    padding: 16,
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderLeftWidth: 4,
    borderLeftColor: '#3498db',
  },
  recruitedCard: {
    borderLeftColor: '#27ae60',
    backgroundColor: '#f8fff9',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    flex: 1,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  info: {
    marginBottom: 12,
  },
  class: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 4,
  },
  level: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  recruitButton: {
    backgroundColor: '#3498db',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  recruitButtonText: {
    color: '#fff',
    marginLeft: 4,
    fontWeight: '600',
  },
  removeButton: {
    backgroundColor: '#e74c3c',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  removeButtonText: {
    color: '#fff',
    marginLeft: 4,
    fontWeight: '600',
  },
});

export default CharacterCard;