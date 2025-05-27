import React from 'react';
import {View, StyleSheet, StatusBar} from 'react-native';
import HeaderWithBtn from '../../../../components/HeaderWithBackBtn';
import CustomInput from '../../../../components/CustumInputField';
import {SafeAreaView} from 'react-native-safe-area-context';
import {FONTFAMILY} from '../../../../theme/theme';

const LineDetailScreen = ({route}) => {
  const {lineItem} = route.params;

  return (
    <>
      <SafeAreaView style={{flex: 1, backgroundColor: '#2E313F'}}>
        <StatusBar barStyle="light-content" backgroundColor="#2E313F" />
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
      </SafeAreaView>
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
    fontFamily: FONTFAMILY.bold,
    marginBottom: 16,
    color: '#333',
  },
  lineItemContainer: {},
});

export default LineDetailScreen;
