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

const StatusModal = ({visible, onClose, message, type = 'success'}) => {
  const isSuccess = type === 'success';

  const iconName = isSuccess ? 'check-circle' : 'exclamation-circle';
  const iconColor = isSuccess ? '#52c41a' : '#ff4d4f';
  const titleText = isSuccess ? 'Success!' : 'Oops! Something went wrong';
  const buttonColor = isSuccess ? '#52c41a' : COLORS.SecondaryColor;
  const buttonText = isSuccess ? 'Okay' : 'Dismiss';

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
              <Icon name={iconName} size={50} color={iconColor} />
            </View>
            <Text style={[styles.title, {color: iconColor}]}>{titleText}</Text>
            <Text style={styles.message}>
              {message ||
                (isSuccess
                  ? 'Operation completed successfully.'
                  : 'Unknown error occurred.')}
            </Text>

            <TouchableOpacity
              style={[styles.closeButton, {backgroundColor: buttonColor}]}
              onPress={onClose}>
              <Text style={styles.closeButtonText}>{buttonText}</Text>
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
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 30,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default StatusModal;
