import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  FlatList,
  StatusBar,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {COLORS} from '../../../theme/theme';
import CustomInput from '../../../components/CustumInputField';
import HeaderWithBtn from '../../../components/HeaderWithBackBtn';
import {appStorage} from '../../../utils/services/StorageHelper';
import {API_ENDPOINTS} from '../../../Apiconfig/Apiconfig';
import api from '../../../Apiconfig/ApiconfigWithInterceptor';
import DataEntryAddLine from './DataEntry_AddLine';
import {navigate} from '../../../utils/services/NavigationService';
import ErrorModal from '../../../components/CustumModal';

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

      const updatedData = {
        ...formState,
        lineData,
        batch_id,
        company_id: userData.companY_ID,
      };

      console.log('Saving data:', updatedData);

      // const response = await api.post(API_ENDPOINTS.SaveDataEntry, updatedData);

      // if (response.data?.status === 'success') {
      //   console.log('Data saved successfully:', response.data);
      // } else {
      //   console.error('Failed to save data:', response.data);
      // }
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
