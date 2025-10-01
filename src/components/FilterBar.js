import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const FilterBar = ({ currentFilter, onFilterChange, recruitedCount, totalCount }) => {
  const filters = [
    { key: 'all', label: 'Todos', icon: 'people' },
    { key: 'available', label: 'Disponíveis', icon: 'person-add' },
    { key: 'recruited', label: 'Recrutados', icon: 'check-circle' },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>📊 Filtros</Text>
        <Text style={styles.stats}>
          {recruitedCount}/{totalCount} recrutados
        </Text>
      </View>
      
      <View style={styles.filters}>
        {filters.map((filter) => (
          <TouchableOpacity
            key={filter.key}
            style={[
              styles.filterButton,
              currentFilter === filter.key && styles.activeFilter
            ]}
            onPress={() => onFilterChange(filter.key)}
          >
            <MaterialIcons
              name={filter.icon}
              size={16}
              color={currentFilter === filter.key ? '#fff' : '#7f8c8d'}
            />
            <Text
              style={[
                styles.filterText,
                currentFilter === filter.key && styles.activeFilterText
              ]}
            >
              {filter.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    margin: 16,
    marginBottom: 8,
    padding: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  stats: {
    fontSize: 14,
    color: '#7f8c8d',
    fontWeight: '500',
  },
  filters: {
    flexDirection: 'row',
    gap: 8,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  activeFilter: {
    backgroundColor: '#3498db',
    borderColor: '#3498db',
  },
  filterText: {
    marginLeft: 6,
    fontSize: 14,
    color: '#7f8c8d',
    fontWeight: '500',
  },
  activeFilterText: {
    color: '#fff',
  },
});

export default FilterBar;