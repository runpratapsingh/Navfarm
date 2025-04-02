import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  ScrollView,
  StyleSheet,
  StatusBar,
} from 'react-native';
import {Dropdown} from 'react-native-element-dropdown';
import Icon from 'react-native-vector-icons/FontAwesome';
import {COLORS} from '../../../theme/theme';

// Define parameter types for the dropdown
const parameterTypes = [
  {label: 'Consumption', value: 'Consumption'},
  {label: 'Production', value: 'Production'},
];

// Define parameter names based on selected parameter type
const parameterNames = {
  Consumption: [
    {label: 'Culls', value: 'Culls'},
    {label: 'Feed Finisher', value: 'Feed Finisher'},
  ],
  Production: [{label: 'Eggs', value: 'Eggs'}],
};

// Define data entry types
const dataEntryTypes = [
  {label: 'Mortality-F', value: 'Mortality-F'},
  {label: 'Feed-Male', value: 'Feed-Male'},
  {label: 'Feed-Female', value: 'Feed-Female'},
];

// Define item names
const itemNames = [
  {label: 'Brickets', value: 'Brickets'},
  {label: 'Broiler Breeder Male', value: 'Broiler Breeder Male'},
  {label: 'Broiler Breeder Lay 1', value: 'Broiler Breeder Lay 1'},
];

// Define units of measurement
const uoms = [
  {label: 'TON', value: 'TON'},
  {label: 'KG', value: 'KG'},
];

export default function DataEntryScreen({entries, setEntries}) {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [selectedParameterType, setSelectedParameterType] = useState(null);
  const [selectedParameterName, setSelectedParameterName] = useState(null);
  const [totalUnits, setTotalUnits] = useState('');
  const [costPerUnit, setCostPerUnit] = useState('');
  const [selectedDataEntryType, setSelectedDataEntryType] = useState(null);
  const [selectedItemName, setSelectedItemName] = useState(null);
  const [selectedUOM, setSelectedUOM] = useState(null);

  const addEntry = () => {
    if (!selectedParameterType || !selectedParameterName || !selectedUOM)
      return;

    const newEntry = {
      parameterType: selectedParameterType,
      parameterName: selectedParameterName,
      totalUnits,
      costPerUnit,
      dataEntryType: selectedDataEntryType,
      itemName: selectedItemName,
      uom: selectedUOM,
      stock: 0,
    };

    setEntries([...entries, newEntry]);
    setTotalUnits('');
    setCostPerUnit('');
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={COLORS.primaryColor}
      />
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Line</Text>
        <TouchableOpacity
          style={styles.toggleButton}
          onPress={() => setIsFormVisible(!isFormVisible)}>
          <Icon
            name={isFormVisible ? 'minus' : 'plus'}
            size={20}
            color="#fff"
          />
        </TouchableOpacity>
      </View>
      {isFormVisible && (
        <View style={{padding: 16}}>
          <Dropdown
            style={styles.dropdown}
            data={parameterTypes}
            labelField="label"
            valueField="value"
            placeholder="Select Parameter Type"
            value={selectedParameterType}
            onChange={item => {
              setSelectedParameterType(item.value);
              setSelectedParameterName(null);
            }}
          />
          <Dropdown
            style={styles.dropdown}
            data={
              selectedParameterType ? parameterNames[selectedParameterType] : []
            }
            labelField="label"
            valueField="value"
            placeholder="Select Parameter Name"
            value={selectedParameterName}
            onChange={item => setSelectedParameterName(item.value)}
          />
          <TextInput
            style={styles.input}
            placeholder="Total Units"
            keyboardType="numeric"
            value={totalUnits}
            onChangeText={setTotalUnits}
          />
          <TextInput
            style={styles.input}
            placeholder="Cost Per Unit"
            keyboardType="numeric"
            value={costPerUnit}
            onChangeText={setCostPerUnit}
          />
          <Dropdown
            style={styles.dropdown}
            data={dataEntryTypes}
            labelField="label"
            valueField="value"
            placeholder="Select Data Entry Type"
            value={selectedDataEntryType}
            onChange={item => setSelectedDataEntryType(item.value)}
          />
          <Dropdown
            style={styles.dropdown}
            data={itemNames}
            labelField="label"
            valueField="value"
            placeholder="Select Item Name"
            value={selectedItemName}
            onChange={item => setSelectedItemName(item.value)}
          />
          <Dropdown
            style={styles.dropdown}
            data={uoms}
            labelField="label"
            valueField="value"
            placeholder="Select UOM"
            value={selectedUOM}
            onChange={item => setSelectedUOM(item.value)}
          />
          <TouchableOpacity style={styles.button} onPress={addEntry}>
            <Text style={styles.buttonText}>Add Line</Text>
          </TouchableOpacity>
        </View>
      )}
      {entries.length > 0 && (
        <ScrollView
          style={{
            flex: 1,
            marginHorizontal: 16,
            marginVertical: 10,
            borderLeftWidth: 1,
            borderRightWidth: 1,
            borderColor: '#ddd',
          }}
          horizontal>
          <View>
            <View style={styles.tableHeader}>
              {[
                'Parameter Type',
                'Parameter Name',
                'Total Units',
                'Cost Per Unit',
                'Data Entry Type',
                'Item Name',
                'UOM',
                'Stock',
              ].map((header, index) => (
                <Text key={index} style={styles.tableHeaderText}>
                  {header}
                </Text>
              ))}
            </View>
            <FlatList
              data={entries}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({item}) => (
                <View style={styles.tableRow}>
                  {[
                    item.parameterType,
                    item.parameterName,
                    item.totalUnits,
                    item.costPerUnit,
                    item.dataEntryType,
                    item.itemName,
                    item.uom,
                    item.stock,
                  ].map((data, index) => (
                    <Text key={index} style={styles.tableCell}>
                      {data}
                    </Text>
                  ))}
                </View>
              )}
            />
          </View>
        </ScrollView>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1},
  headerContainer: {
    paddingBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    alignItems: 'center',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  header: {fontSize: 18, fontWeight: 'bold', color: COLORS.SecondaryColor},
  dropdown: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  button: {
    backgroundColor: COLORS.SecondaryColor,
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {color: '#fff', fontWeight: 'bold'},
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#ddd',
    padding: 10,
  },
  tableHeaderText: {fontWeight: 'bold', width: 100, textAlign: 'center'},
  tableRow: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  tableCell: {width: 100, textAlign: 'center'},
  toggleButton: {
    backgroundColor: COLORS.SecondaryColor,
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
