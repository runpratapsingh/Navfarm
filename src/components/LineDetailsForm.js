import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet, FlatList} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {COLORS} from '../theme/theme';
import CustomInput from './CustumInputField';
import CustomDropdown from './DataEntryHistoryCustumDropdown';

const LineDetailsComponent = ({
  groupedData,
  expandedGroups,
  toggleGroup,
  updateGroupedData,
  handleEyePress,
}) => {
  const renderLineItem = ({item, index}) => {
    const decimalRegex = /^\d*\.?\d{0,3}$/;

    return (
      <View style={styles.section} key={index}>
        <View style={styles.textParameterNameContainer}>
          <Text style={styles.sectionTitle}>{item.parameteR_NAME || ''}</Text>
        </View>
        <View style={styles.row}>
          <CustomInput
            label="Total Units"
            value={item.actuaL_VALUE?.toString()}
            onChangeText={text => {
              if (decimalRegex.test(text)) {
                updateGroupedData(
                  item.parameteR_TYPE,
                  index,
                  'actuaL_VALUE',
                  text,
                );
              }
            }}
            keyboardType="numeric"
            containerStyle={styles.inputWrapper1}
          />
          <CustomInput
            label="Cost Per Unit"
            value={item.uniT_COST?.toString()}
            onChangeText={text => {
              if (decimalRegex.test(text)) {
                updateGroupedData(
                  item.parameteR_TYPE,
                  index,
                  'uniT_COST',
                  text,
                );
              }
            }}
            editable={item.parameteR_NAME === 'Descriptive' ? false : true}
            containerStyle={styles.inputWrapper1}
          />
          <View style={styles.sectionTitleHeader1}>
            <TouchableOpacity onPress={() => handleEyePress(item)}>
              <Icon name="eye" size={20} color="#000" />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.row}>
          {item.parameteR_TYPE == 'Descriptive' ? (
            item.parameter_input_type == 'input' ? (
              <CustomInput
                label="Descriptive"
                value={item.parameter_input_value}
                onChangeText={text =>
                  updateGroupedData(
                    item.parameteR_TYPE,
                    index,
                    'parameter_input_value',
                    text,
                  )
                }
                placeholder="Enter descriptive value"
                containerStyle={{width: '100%'}}
              />
            ) : item.parameteR_TYPE == 'Descriptive' ? (
              <CustomDropdown
                label="Descriptive"
                selectedValue={item.parameter_input_value}
                onValueChange={text =>
                  updateGroupedData(
                    item.parameteR_TYPE,
                    index,
                    'parameter_input_value',
                    text,
                  )
                }
                options={[
                  {id: '', name: 'Select'},
                  ...item.parameter_input_format
                    .split(',')
                    .map(opt => ({id: opt.trim(), name: opt.trim()})),
                ]}
                containerStyle={styles.inputWrapper}
              />
            ) : null
          ) : null}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.lineDetail}>
      {Object.keys(groupedData).map(group => (
        <View key={group} style={styles.section1}>
          <TouchableOpacity
            onPress={() => toggleGroup(group)}
            style={styles.sectionTitleHeader}>
            <Text style={styles.sectionTitle1}>{group}</Text>
            <Icon
              name={expandedGroups[group] ? 'minus' : 'plus'}
              size={20}
              color={COLORS.primaryColor}
            />
          </TouchableOpacity>
          {expandedGroups[group] && (
            <FlatList
              data={groupedData[group]}
              renderItem={renderLineItem}
              keyExtractor={(item, index) => index.toString()}
            />
          )}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  lineDetail: {
    marginBottom: 20,
    padding: 16,
  },
  section: {},
  section1: {
    marginBottom: 20,
    borderBottomColor: '#ddd',
    borderBottomWidth: 1,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '400',
    color: COLORS.SecondaryColor,
  },
  sectionTitle1: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primaryColor,
  },
  sectionTitleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitleHeader1: {
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  inputWrapper: {
    width: '48%',
  },
  inputWrapper1: {
    width: '44%',
  },
  textParameterNameContainer: {
    width: '100%',
    justifyContent: 'center',
    marginBottom: 5,
  },
});

export default LineDetailsComponent;
