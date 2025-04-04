import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import CustomInput from '../../../components/CustumInputField';
import HeaderWithBtn from '../../../components/HeaderWithBackBtn';

const LineDetailScreen = ({route}) => {
  const {lineItem} = route.params;

  return (
    <>
      <HeaderWithBtn title="Line details" />
      <View style={styles.container}>
        <View style={styles.lineItemContainer}>
          <CustomInput
            label="Parameter Type"
            value={lineItem.parameteR_TYPE || ''}
            editable={false}
          />
          <CustomInput
            label="Parameter Name"
            value={lineItem.parameteR_NAME || ''}
            editable={false}
          />
          <CustomInput
            label="Total Units"
            value={lineItem.uniT_COST?.toString() || ''}
            editable={false}
          />
          {/* <CustomInput
            label="Cost Per Unit"
            value={lineItem.costPerUnit?.toString() || ''}
            editable={false}
          /> */}
          <CustomInput
            label="Data Entry Type"
            value={lineItem.dataentrY_TYPE || ''}
            editable={false}
          />
          <CustomInput
            label="Item Name"
            value={lineItem.iteM_NAME || ''}
            editable={false}
          />
          <CustomInput
            label="UOM"
            value={lineItem.dataentrY_UOM || ''}
            editable={false}
          />
          {/* <CustomInput
            label="Descriptive"
            value={lineItem.descriptive || ''}
            editable={false}
          /> */}
          <CustomInput
            label="Stock"
            value={lineItem.stock?.toString() || ''}
            editable={false}
          />
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f8f9fa',
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  lineItemContainer: {},
});

export default LineDetailScreen;
