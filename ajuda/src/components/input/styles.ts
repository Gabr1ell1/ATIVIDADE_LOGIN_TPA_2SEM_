import { StyleSheet, Platform } from 'react-native';

export const styles = StyleSheet.create({
  input: {
    width: '100%',
    height: Platform.OS === 'web' ? 40 : 52,
    borderRadius: Platform.OS === 'ios' ? 12 : 8,
    borderWidth: Platform.OS === 'android' ? 2 : 1,
    borderColor:
      Platform.OS === 'android'
        ? '#3DDC84' // verde Android 🤖
        : Platform.OS === 'ios'
        ? '#007AFF' // azul iOS 🍎
        : '#ac1db1', // web
    padding: 12,
    fontSize: 16,
  },
});