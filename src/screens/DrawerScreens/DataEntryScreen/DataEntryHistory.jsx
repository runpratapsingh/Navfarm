import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import CustomDropdown from '../../../components/DataEntryHistoryCustumDropdown';

const LinkedDropdowns = () => {
  const [nature, setNature] = useState('');
  const [line, setLine] = useState('');
  const [batch, setBatch] = useState('');

  const [natureOptions, setNatureOptions] = useState([]);
  const [lineOptions, setLineOptions] = useState([]);
  const [batchOptions, setBatchOptions] = useState([]);

  const [loadingNature, setLoadingNature] = useState(true);
  const [loadingLine, setLoadingLine] = useState(false);
  const [loadingBatch, setLoadingBatch] = useState(false);

  useEffect(() => {
    fetchNatureOfBusiness();
  }, []);

  const fetchNatureOfBusiness = () => {
    const data = [
      {id: '1', name: 'Retail'},
      {id: '2', name: 'Manufacturing'},
      {id: '3', name: 'IT Services'},
    ];
    setNatureOptions(data);
    setLoadingNature(false);
  };

  const fetchLineOfBusiness = natureId => {
    setLoadingLine(true);
    let data = [];
    if (natureId === '1')
      data = [
        {id: '101', name: 'Grocery'},
        {id: '102', name: 'Clothing'},
      ];
    if (natureId === '2')
      data = [
        {id: '201', name: 'Electronics'},
        {id: '202', name: 'Furniture'},
      ];
    if (natureId === '3')
      data = [
        {id: '301', name: 'Software Development'},
        {id: '302', name: 'Consulting'},
      ];
    setLineOptions(data);
    setLoadingLine(false);
  };

  const fetchBatchNumbers = lineId => {
    setLoadingBatch(true);
    let data = [];
    if (lineId === '101')
      data = [
        {id: '1001', name: 'Batch A'},
        {id: '1002', name: 'Batch B'},
      ];
    if (lineId === '201')
      data = [
        {id: '2001', name: 'Batch X'},
        {id: '2002', name: 'Batch Y'},
      ];
    if (lineId === '301')
      data = [
        {id: '3001', name: 'Batch Alpha'},
        {id: '3002', name: 'Batch Beta'},
      ];
    setBatchOptions(data);
    setLoadingBatch(false);
  };

  return (
    <View style={styles.container}>
      <CustomDropdown
        label="Nature of Business"
        selectedValue={nature}
        onValueChange={value => {
          setNature(value);
          setLine('');
          setBatch('');
          fetchLineOfBusiness(value);
        }}
        options={natureOptions}
        loading={loadingNature}
      />

      <CustomDropdown
        label="Line of Business"
        selectedValue={line}
        onValueChange={value => {
          setLine(value);
          setBatch('');
          fetchBatchNumbers(value);
        }}
        options={lineOptions}
        loading={loadingLine}
      />

      <CustomDropdown
        label="Batch Number"
        selectedValue={batch}
        onValueChange={setBatch}
        options={batchOptions}
        loading={loadingBatch}
      />

      <TouchableOpacity style={styles.searchButton}>
        <Text style={styles.searchText}>Search</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#F8F9FA',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  dropdownContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
  },
  dropdown: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    padding: 10,
  },
  searchButton: {
    backgroundColor: '#D9534F',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  searchText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default LinkedDropdowns;
