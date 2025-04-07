import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  FlatList,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {COLORS} from '../../../../theme/theme';
import CustomInput from '../../../../components/CustumInputField';
import HeaderWithBtn from '../../../../components/HeaderWithBackBtn';
import {appStorage} from '../../../../utils/services/StorageHelper';
import {API_ENDPOINTS} from '../../../../Apiconfig/Apiconfig';
import api from '../../../../Apiconfig/ApiconfigWithInterceptor';
import DataEntryAddLine from './DataEntry_AddLine';
import {navigate} from '../../../../utils/services/NavigationService';
import ErrorModal from '../../../../components/CustumModal';

const EditDataEntry = ({route}) => {
  const {batch_id} = route.params;
  const [formState, setFormState] = useState({
    isHeaderVisible: false,
    isLineVisible: true,
    showAdditionalFields: false,
    natureOfBusiness: '',
    lineOfBusiness: '',
    remainingQty: '',
    breedName: '',
    templateName: '',
    postingDate: '',
    subLocationName: '',
    ageDays: '',
    ageWeek: '',
    openingQuantity: '',
    startDate: '',
    runningCost: '',
    batch_No: '',
    nob_id: 0, // Add default values for new fields
    lob_id: 0,
    template_id: 0,
    location: 0,
    CREATED_BY: 0,
  });
  const [lineData, setLineData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorVisible, setErrorVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSave = async () => {
    try {
      setLoading(true);
      const userDataString = await appStorage.getUserData();
      const userData = userDataString;

      if (!userData.companY_ID) {
        console.error('Company ID is missing from user data');
        return;
      }

      const header = {
        DATAENTRY_ID: 0,
        NOB_ID: parseInt(formState.nob_id),
        NATURE_OF_BUSINESS: formState.natureOfBusiness,
        LOB_ID: parseInt(formState.lob_id),
        LINE_OF_BUSINESS: formState.lineOfBusiness,
        BATCH_ID: formState.batch_id?.toString(),
        BATCH_NO: formState.batch_No,
        BREED_NAME: formState.breedName,
        TEMPLATE_NAME: formState.templateName,
        TEMPLATE_ID: parseInt(formState.template_id),
        LOCATION_NAME: formState.subLocationName,
        POSTING_DATE: formState.postingDate,
        AGE_DAYS: formState.ageDays.toString(),
        AGE_WEEK: formState.ageWeek.toString(),
        OPENING_QTY: formState.openingQuantity.toString(),
        START_DATE: formState.startDate,
        RUNNING_COST: formState.runningCost.toString(),
        CREATED_BY: parseInt(formState.CREATED_BY) || 0,
        company_id: userData.companY_ID?.toString(),
        status: 'posted',
        LOCATION: formState.location?.toString(),
        ENTRY_FROM: 'Web',
        CURRENT_LOCATION: '',
        CHK_in_lat: '',
        CHK_in_long: '',
        REMARK: '',
      };

      const lines = lineData.map(item => ({
        PARAMETER_TYPE: item.parameteR_TYPE,
        PARAMETER_TYPE_ID: parseInt(item.parameteR_TYPE_ID),
        PARAMETER_NAME: item.parameteR_NAME,
        ACTUAL_VALUE: item.actuaL_VALUE?.toString() || '0',
        UNIT_COST: item.uniT_COST?.toString() || '0',
        DATAENTRY_TYPE_ID: parseInt(item.dataentrY_TYPE_ID),
        DATAENTRY_TYPE: item.dataentrY_TYPE,
        DATAENTRY_UOM: item.dataentrY_UOM,
        OCCURRENCE: item.occurrence,
        FREQUENCY_START_DATE: item.frequencY_START_DATE?.toString() || '0',
        FREQUENCY_END_DATE: item.frequencY_END_DATE?.toString() || '0',
        ITEM_NAME: item.iteM_NAME,
        LINE_AMOUNT: parseFloat(item.linE_AMOUNT) || 0.0,
        PARAMETER_ID: parseInt(item.parameteR_ID),
        FORMULA_FLAG: item.formulA_FLAG || '',
        ITEM_ID: parseInt(item.iteM_ID),
        Parameter_input_type: item.parameter_input_type || '',
        Parameter_input_format: item.parameter_input_format || '',
        Parameter_input_value: item.parameter_input_value || '',
      }));

      const updatedData = {
        header,
        lines,
        livestock: [], // Assuming livestock is not used in this case
      };

      // const updatedData = {
      //   header: {
      //     DATAENTRY_ID: 0,
      //     NOB_ID: 1,
      //     NATURE_OF_BUSINESS: 'Poultry',
      //     LOB_ID: 3,
      //     LINE_OF_BUSINESS: 'Commercial Broiler',
      //     BATCH_ID: '2658',
      //     BATCH_NO: 'B00002',
      //     BREED_NAME: 'KarakNath',
      //     TEMPLATE_NAME: 'CB.Test',
      //     TEMPLATE_ID: 534,
      //     LOCATION_NAME: 'Delhi 1 Sub Location M',
      //     POSTING_DATE: '10-Aug-2023',
      //     AGE_DAYS: '3',
      //     AGE_WEEK: '0',
      //     OPENING_QTY: '1',
      //     START_DATE: '07-Aug-2023',
      //     RUNNING_COST: '40',
      //     CREATED_BY: 762,
      //     company_id: '261',
      //     status: 'posted',
      //     LOCATION: '1',
      //     ENTRY_FROM: 'Web',
      //     CURRENT_LOCATION: '',
      //     CHK_in_lat: '',
      //     CHK_in_long: '',
      //     REMARK: '',
      //   },
      //   lines: [
      //     {
      //       PARAMETER_TYPE: 'Consumption',
      //       PARAMETER_TYPE_ID: 1,
      //       PARAMETER_NAME: 'Test7Sep',
      //       ACTUAL_VALUE: '0',
      //       UNIT_COST: '20',
      //       DATAENTRY_TYPE_ID: 290,
      //       DATAENTRY_TYPE: 'Mortality',
      //       DATAENTRY_UOM: 'NOS',
      //       OCCURRENCE: 'Daily',
      //       FREQUENCY_START_DATE: '0',
      //       FREQUENCY_END_DATE: '30',
      //       ITEM_NAME: 'bird1 - IN0001',
      //       LINE_AMOUNT: 0.0,
      //       PARAMETER_ID: 1922,
      //       FORMULA_FLAG: '',
      //       ITEM_ID: 37752,
      //       Parameter_input_type: '',
      //       Parameter_input_format: '',
      //       Parameter_input_value: '',
      //     },
      //     {
      //       PARAMETER_TYPE: 'Direct/Indirect Cost',
      //       PARAMETER_TYPE_ID: 2,
      //       PARAMETER_NAME: 'Labour Expense',
      //       ACTUAL_VALUE: '0',
      //       UNIT_COST: '0',
      //       DATAENTRY_TYPE_ID: 287,
      //       DATAENTRY_TYPE: 'Blank',
      //       DATAENTRY_UOM: 'HRS',
      //       OCCURRENCE: 'Daily',
      //       FREQUENCY_START_DATE: '0',
      //       FREQUENCY_END_DATE: '30',
      //       ITEM_NAME: 'Labour Expense - RC0001',
      //       LINE_AMOUNT: 0.0,
      //       PARAMETER_ID: 1826,
      //       FORMULA_FLAG: '',
      //       ITEM_ID: 15,
      //       Parametr_input_type: '',
      //       Parameter_input_format: '',
      //       Parameter_input_value: '',
      //     },
      //   ],
      //   livestock: [],
      // };
      console.log('Saving data:----------------->', updatedData);

      // Uncomment the following lines when ready to test the API call
      const response = await api.post(
        API_ENDPOINTS.SaveAndPostDataEntry,
        updatedData,
      );
      if (response.data?.status === 'success') {
        console.log('Data saved successfully:', response.data);
      } else {
        console.error('Failed to save data:', response.data);
      }
    } catch (error) {
      console.error('API Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePost = async () => {
    try {
      setLoading(true);
      const userDataString = await appStorage.getUserData();
      const userData = userDataString;

      if (!userData.companY_ID) {
        console.error('Company ID is missing from user data');
        return;
      }

      const updatedData = {
        ...formState,
        lineData,
        batch_id,
        company_id: userData.companY_ID,
      };

      console.log('Posting data:', updatedData);

      // const response = await api.post(API_ENDPOINTS.PostDataEntry, updatedData);

      // if (response.data?.status === 'success') {
      //   console.log('Data posted successfully:', response.data);
      // } else {
      //   console.error('Failed to post data:', response.data);
      // }
    } catch (error) {
      console.error('API Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEyePress = item => {
    navigate('LineDetailScreen', {lineItem: item});
  };

  const updateFormState = (key, value) => {
    setFormState(prevState => ({
      ...prevState,
      [key]: value,
    }));
  };

  const updateLineData = (index, key, value) => {
    setLineData(prevData =>
      prevData.map((item, i) => (i === index ? {...item, [key]: value} : item)),
    );
  };

  const getDataEntryDetails = async () => {
    try {
      setLoading(true);
      const userDataString = await appStorage.getUserData();
      const commonDetails = await appStorage.getCommonDetails();

      if (!userDataString || !commonDetails) {
        console.error('No user data or common details found');
        return;
      }

      const userData = userDataString;
      const commonDetailsData = commonDetails;

      if (!userData.companY_ID || !commonDetailsData.naturE_ID) {
        console.error('Company ID and natureId is missing from user data');
        return;
      }

      const response = await api.get(API_ENDPOINTS.DataEntryDetails, {
        params: {
          Company_Id: userData.companY_ID,
          batch_id: batch_id,
        },
      });

      console.log('response---------------', response.data);

      if (response.data?.status === 'success') {
        const header = response.data?.data?.header?.[0];
        const line = response.data?.data?.line || [];
        setLineData(line);
        setFormState(prevState => ({
          ...prevState,
          natureOfBusiness: header.naturE_OF_BUSINESS || '',
          lineOfBusiness: header.linE_OF_BUSINESS || '',
          remainingQty: header.remaininG_QTY?.toString() || '',
          breedName: header.breeD_NAME || '',
          templateName: header.templatE_NAME || '',
          postingDate: header.p_DATE || '',
          subLocationName: header.locatioN_NAME || '',
          ageDays: header.agE_DAYS?.toString() || '',
          ageWeek: header.agE_WEEK?.toString() || '',
          openingQuantity: header.openinG_QTY?.toString() || '',
          startDate: header.s_DATE || '',
          runningCost: header.runninG_COST?.toString() || '',
          batch_No: header.batcH_NO || '',
          nob_id: header.noB_ID || 0, // Set the new fields
          lob_id: header.loB_ID || 0,
          template_id: header.templatE_ID || 0,
          location: header.locatioN_ID || 0,
          batch_id: header.batcH_ID?.toString(),
          CREATED_BY: header.createD_BY?.toString(),
        }));
      } else {
        setErrorMessage(response.data?.message || 'Something went wrong');
        setErrorVisible(true);
      }
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getDataEntryDetails();
  }, []);

  const renderLineItem = ({item, index}) => (
    <View style={styles.section} key={index}>
      <View style={styles.sectionTitleHeader}>
        <Text style={styles.sectionTitle}>{item.parameteR_NAME || ''}</Text>
        <TouchableOpacity onPress={() => handleEyePress(item)}>
          <Icon name="eye" size={20} color="#000" />
        </TouchableOpacity>
      </View>
      <CustomInput
        label="Item Name"
        value={item.iteM_NAME}
        onChangeText={text => updateLineData(index, 'iteM_NAME', text)}
        editable={false}
      />
      <CustomInput
        label="Total Units"
        value={item.actuaL_VALUE?.toString()} // Ensure the value is a string
        onChangeText={text => updateLineData(index, 'actuaL_VALUE', text)}
      />
      <CustomInput
        label="Cost Per Unit"
        value={item.uniT_COST?.toString()} // Ensure the value is a string
        onChangeText={text => updateLineData(index, 'uniT_COST', text)}
        editable={item.parameteR_NAME === 'Descriptive' ? false : true}
      />
    </View>
  );

  return (
    <>
      <HeaderWithBtn title="Data Entry" />
      <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>HEADER ({formState.batch_No})</Text>
          <TouchableOpacity
            style={styles.toggleButton}
            onPress={() =>
              updateFormState('isHeaderVisible', !formState.isHeaderVisible)
            }>
            <Icon
              name={formState.isHeaderVisible ? 'minus' : 'plus'}
              size={16}
              color="#fff"
            />
          </TouchableOpacity>
        </View>

        {formState.isHeaderVisible && (
          <View style={styles.headerDetails}>
            <CustomInput
              label="Nature Of Business"
              value={formState.natureOfBusiness}
              onChangeText={text => updateFormState('natureOfBusiness', text)}
              editable={false}
              style={styles.disabledInput}
            />
            <CustomInput
              label="Line Of Business"
              value={formState.lineOfBusiness}
              onChangeText={text => updateFormState('lineOfBusiness', text)}
              editable={false}
              style={styles.disabledInput}
            />
            <CustomInput
              label="Remaining Qty"
              value={formState.remainingQty}
              onChangeText={text => updateFormState('remainingQty', text)}
              editable={false}
              style={styles.disabledInput}
            />
            <CustomInput
              label="Breed Name"
              value={formState.breedName}
              onChangeText={text => updateFormState('breedName', text)}
              editable={false}
              style={styles.disabledInput}
            />
            <CustomInput
              label="Template Name"
              value={formState.templateName}
              onChangeText={text => updateFormState('templateName', text)}
              editable={false}
              style={styles.disabledInput}
            />
            <CustomInput
              label="Posting Date"
              value={formState.postingDate}
              onChangeText={text => updateFormState('postingDate', text)}
              editable={false}
              style={styles.disabledInput}
            />
            {formState.showAdditionalFields && (
              <>
                <CustomInput
                  label="Sub Location Name"
                  value={formState.subLocationName}
                  onChangeText={text =>
                    updateFormState('subLocationName', text)
                  }
                  editable={false}
                  style={styles.disabledInput}
                />
                <CustomInput
                  label="Age (Days)"
                  value={formState.ageDays}
                  onChangeText={text => updateFormState('ageDays', text)}
                  editable={false}
                  style={styles.disabledInput}
                />
                <CustomInput
                  label="Age (Week)"
                  value={formState.ageWeek}
                  onChangeText={text => updateFormState('ageWeek', text)}
                  editable={false}
                  style={styles.disabledInput}
                />
                <CustomInput
                  label="Opening Quantity"
                  value={formState.openingQuantity}
                  onChangeText={text =>
                    updateFormState('openingQuantity', text)
                  }
                  editable={false}
                  style={styles.disabledInput}
                />
                <CustomInput
                  label="Start Date"
                  value={formState.startDate}
                  onChangeText={text => updateFormState('startDate', text)}
                  editable={false}
                  style={styles.disabledInput}
                />
                <CustomInput
                  label="Running Cost"
                  value={formState.runningCost}
                  onChangeText={text => updateFormState('runningCost', text)}
                  editable={false}
                  style={styles.disabledInput}
                />
              </>
            )}
            <View style={styles.sectionTitleHeader}>
              <Text style={styles.sectionTitle}></Text>
              <TouchableOpacity
                onPress={() =>
                  updateFormState(
                    'showAdditionalFields',
                    !formState.showAdditionalFields,
                  )
                }>
                <Icon
                  name={formState.showAdditionalFields ? 'eye-slash' : 'eye'}
                  size={20}
                  color="#000"
                />
              </TouchableOpacity>
            </View>
          </View>
        )}

        <DataEntryAddLine />
        <View style={styles.lineDetail}>
          <FlatList
            data={lineData}
            renderItem={renderLineItem}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={handleSave}>
            <Text style={styles.buttonText}>Save</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handlePost}>
            <Text style={styles.buttonText}>Post</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <ErrorModal
        visible={errorVisible}
        onClose={() => setErrorVisible(false)}
        message={errorMessage}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  headerText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.SecondaryColor,
  },
  toggleButton: {
    backgroundColor: COLORS.SecondaryColor,
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerDetails: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  formContainer: {
    flex: 1,
    padding: 16,
  },
  lineDetail: {
    marginBottom: 20,
    padding: 16,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    marginHorizontal: 16,
    paddingBottom: 20,
  },
  button: {
    backgroundColor: COLORS.SecondaryColor,
    padding: 10,
    borderRadius: 5,
    flex: 1,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  sectionTitleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  disabledInput: {
    backgroundColor: '#f0f0f0',
  },
});

export default EditDataEntry;
