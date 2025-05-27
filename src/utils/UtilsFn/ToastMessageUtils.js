import {showMessage} from 'react-native-flash-message';
import {Platform, Dimensions} from 'react-native';
import {FONTFAMILY} from '../../theme/theme';

const {width} = Dimensions.get('window');

export const displayMessage = (message, type = 'success') => {
  showMessage({
    message,
    type,
    icon: type,
    duration: 3000,
    textStyle: {
      fontFamily: FONTFAMILY.regular,
      fontSize: 12,
      color: '#fff',
    },
    style: {
      width: Platform.OS === 'android' ? width * 0.92 : null,
      borderRadius: Platform.OS === 'android' ? 5 : null,
      margin: Platform.OS === 'android' ? 15 : null,
      alignItems: Platform.OS === 'android' ? 'center' : null,
    },
  });
};
