import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Modal} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {FONTFAMILY} from '../theme/theme';

const ConfirmLogoutAndExitModal = ({
  visible,
  onClose,
  onConfirm,
  message,
  title,
  buttonText,
}) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Icon
            name="exclamation-circle"
            size={40}
            color="#ff4c4c"
            style={styles.modalIcon}
          />
          <Text style={styles.modalTitle}>{title}</Text>
          <Text style={styles.modalText}>{message}</Text>
          <View style={styles.modalButtons}>
            <TouchableOpacity
              activeOpacity={0.8}
              style={[styles.modalButton, styles.cancelButton]}
              onPress={onClose}>
              <Text style={styles.modalButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.8}
              style={[styles.modalButton, styles.confirmButton]}
              onPress={onConfirm}>
              <Text style={[styles.modalButtonText, styles.confirmText]}>
                {buttonText}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  modalIcon: {
    marginBottom: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: FONTFAMILY.semibold,
    color: '#333',
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    textAlign: 'center',
    fontFamily: FONTFAMILY.regular,
    color: '#555',
    marginBottom: 25,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 5,
    borderWidth: 1,
  },
  cancelButton: {
    backgroundColor: '#f0f0f0',
    borderColor: '#ccc',
  },
  confirmButton: {
    backgroundColor: '#ff4c4c',
    borderColor: '#ff4c4c',
  },
  modalButtonText: {
    fontSize: 16,
    fontFamily: FONTFAMILY.semibold,
  },
  confirmText: {
    color: '#fff',
  },
});

export default ConfirmLogoutAndExitModal;
