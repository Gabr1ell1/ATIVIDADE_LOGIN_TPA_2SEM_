import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  card: {
    
      maxWidth: 400, 
    width: '100%',  
    alignSelf: 'center',

    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    gap: 16,

    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,

    elevation: 4, 
  },
});