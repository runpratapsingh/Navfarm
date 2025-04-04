import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {COLORS} from '../../../theme/theme';
import HeaderWithBtn from '../../../components/HeaderWithBackBtn';

const BatchCreation = () => {
  return (
    <>
      <HeaderWithBtn title="Batch Creation" />
      <View style={styles.comingSoonContainer}>
        <Icon name="rocket" size={60} color={COLORS.SecondaryColor} />
        <Text style={styles.comingSoonTitle}>Coming Soon</Text>
        <Text style={styles.comingSoonMessage}>
          We're working hard to bring this feature to you!
        </Text>

        <TouchableOpacity
          style={styles.notifyButton}
          onPress={() => console.log('Notify clicked')}>
          <Text style={styles.notifyButtonText}>Notify Me</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  comingSoonContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 20,
  },
  comingSoonTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.SecondaryColor,
    marginTop: 20,
  },
  comingSoonMessage: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 10,
  },
  notifyButton: {
    marginTop: 20,
    backgroundColor: COLORS.SecondaryColor,
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 30,
  },
  notifyButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default BatchCreation;
