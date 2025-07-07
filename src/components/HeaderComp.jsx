import React, {useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {COLORS, FONTFAMILY} from '../theme/theme';
import CustomDropdown from './DataEntryHistoryCustumDropdown';

const Header = ({onFilterPress, title}) => {
  return (
    <View style={styles.headerContainer}>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <TouchableOpacity onPress={onFilterPress}>
          {/* <Icon name="filter" size={20} color="white" style={{ marginRight: 10 }} /> */}
          <Icon name="bars" size={20} color="white" style={{marginRight: 10}} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>{title || ''}</Text>
      </View>

      <TouchableOpacity>
        <Icon name="bell" size={20} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: COLORS.primaryColor,
    borderBottomWidth: 1,
    borderBottomColor: '#000',
  },
  headerTitle: {
    fontSize: 18,
    color: 'white',
    fontFamily: FONTFAMILY.semibold,
  },
});

export default Header;
