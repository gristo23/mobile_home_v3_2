import { View, Text, Switch, StyleSheet } from 'react-native';
import React from 'react';
import { useTheme } from '../context/ThemeContext';

export default function SettingsScreen () {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <View style={[styles.container, isDark && styles.containerDark]}>
      <Text style={[styles.title, isDark && styles.textDark]}>Seaded</Text>
      
      <View style={styles.settingRow}>
        <Text style={[styles.text, isDark && styles.textDark]}>Tume režiim</Text>
        <Switch
          value={isDark}
          onValueChange={toggleTheme}
          trackColor={{ false: '#767577', true: '#81b0ff' }}
          thumbColor={isDark ? '#007AFF' : '#f4f3f4'}
        />
      </View>
      
      <Text style={[styles.infoText, isDark && styles.textDark]}>
        Praegune teema: {theme === 'dark' ? 'Tume' : 'Hele'}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  containerDark: {
    backgroundColor: '#1a1a1a',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    color: '#000',
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    marginBottom: 16,
  },
  text: { 
    fontSize: 16,
    color: '#000',
  },
  textDark: {
    color: '#fff',
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
  },
});