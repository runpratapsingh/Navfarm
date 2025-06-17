import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet, FlatList} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {COLORS} from '../theme/theme';
import CustomInput from './CustumInputField';
import CustomDropdown from './DataEntryHistoryCustumDropdown';

const LineDetailsComponent = ({
  groupedData,
  expandedBatches,
  expandedParameters,
  toggleBatch,
  toggleParameter,
  updateGroupedData,
  handleEyePress,
}) => {
  const decimalRegex = /^\d*\.?\d{0,3}$/;

  const renderLineItem = ({item, index}, batchNo, type) => {
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
                updateGroupedData(batchNo, type, index, 'actuaL_VALUE', text);
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
                updateGroupedData(batchNo, type, index, 'uniT_COST', text);
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
          {item.parameteR_TYPE === 'Descriptive' ? (
            item.parameter_input_type === 'input' ? (
              <CustomInput
                label="Descriptive"
                value={item.parameter_input_value}
                onChangeText={text =>
                  updateGroupedData(
                    batchNo,
                    type,
                    index,
                    'parameter_input_value',
                    text,
                  )
                }
                placeholder="Enter descriptive value"
                containerStyle={{width: '100%'}}
              />
            ) : item.parameter_input_type === 'dropdown' ? (
              <CustomDropdown
                label="Descriptive"
                selectedValue={item.parameter_input_value}
                onValueChange={text =>
                  updateGroupedData(
                    batchNo,
                    type,
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

  const renderParameterType = (batchNo, type, data) => (
    <View key={`${batchNo}-${type}`} style={styles.parameterSection}>
      <TouchableOpacity
        onPress={() => toggleParameter(batchNo, type)}
        style={styles.sectionTitleHeader}>
        <Text style={styles.sectionTitle1}>{type}</Text>
        <Icon
          name={expandedParameters[`${batchNo}-${type}`] ? 'minus' : 'plus'}
          size={20}
          color={COLORS.primaryColor}
        />
      </TouchableOpacity>
      {expandedParameters[`${batchNo}-${type}`] && (
        <FlatList
          data={data}
          renderItem={({item, index}) =>
            renderLineItem({item, index}, batchNo, type)
          }
          keyExtractor={(item, index) => `${batchNo}-${type}-${index}`}
        />
      )}
    </View>
  );

  return (
    <View style={styles.lineDetail}>
      {groupedData.map(batch => (
        <View key={batch.batchNo} style={styles.section1}>
          <TouchableOpacity
            onPress={() => toggleBatch(batch.batchNo)}
            style={styles.sectionTitleHeader}>
            <Text style={styles.sectionTitle1}>{batch.batchNo}</Text>
            <Icon
              name={expandedBatches[batch.batchNo] ? 'minus' : 'plus'}
              size={20}
              color={COLORS.primaryColor}
            />
          </TouchableOpacity>
          {expandedBatches[batch.batchNo] &&
            Object.keys(batch.LineData).map(type =>
              renderParameterType(batch.batchNo, type, batch.LineData[type]),
            )}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  lineDetail: {
    paddingTop: 16,
  },
  section: {
    marginBottom: 10,
  },
  section1: {
    marginBottom: 20,
    borderBottomColor: '#ddd',
    borderBottomWidth: 1,
  },
  parameterSection: {
    marginLeft: 5,
    // backgroundColor: 'red',
    marginBottom: 5,
    borderTopColor: '#ddd',
    borderTopWidth: 1,
    paddingTop: 5,
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
