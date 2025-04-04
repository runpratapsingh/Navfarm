import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  StatusBar,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {COLORS} from '../theme/theme';

const {width} = Dimensions.get('window');

const ErrorModal = ({visible, onClose, message}) => {
  return (
    <>
      {visible && (
        <StatusBar barStyle="light-content" backgroundColor="rgba(0,0,0,0.6)" />
      )}
      <Modal
        transparent
        animationType="slide"
        visible={visible}
        onRequestClose={onClose}>
        <View style={styles.overlay}>
          <View style={styles.modalContent}>
            <View style={styles.iconContainer}>
              <Icon name="exclamation-circle" size={50} color="#ff4d4f" />
            </View>
            <Text style={styles.title}>Oops! Something went wrong</Text>
            <Text style={styles.message}>
              {message || 'Unknown error occurred.'}
            </Text>

            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeButtonText}>Dismiss</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: width * 0.9,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
    elevation: 10,
  },
  iconContainer: {
    marginBottom: 15,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.SecondaryColor,
    marginBottom: 10,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  closeButton: {
    backgroundColor: COLORS.SecondaryColor,
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 30,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default ErrorModal;
