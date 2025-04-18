import NetInfo from '@react-native-community/netinfo';

export const checkNetworkStatus = callback => {
  NetInfo.fetch().then(state => {
    callback(state.isConnected);
  });
};

export const subscribeToNetworkChanges = callback => {
  return NetInfo.addEventListener(state => {
    callback(state.isConnected);
  });
};
