import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import api from '../../../Apiconfig/ApiconfigWithInterceptor';
import {API_ENDPOINTS} from '../../../Apiconfig/Apiconfig';
import {appStorage} from '../../../utils/services/StorageHelper';
import CustomDropdown from '../../../components/DataEntryHistoryCustumDropdown';
import Header from '../../../components/HeaderComp';
import {useNavigation} from '@react-navigation/native';
import LineDetailsComponent from '../../../components/LineDetailsForm';
import {checkNetworkStatus} from '../../../services/NetworkServices/Network';
import {COLORS} from '../../../theme/theme';
import DataEntryAddLine from '../DataEntryScreen/DataEntry/DataEntry_AddLine';
import {navigate} from '../../../utils/services/NavigationService';
import {FONTFAMILY} from '../../../theme/theme';

const DailyDataEntry = () => {
  const [nature, setNature] = useState('');
  const [line, setLine] = useState('');
  const [batch, setBatch] = useState('');
  const [loading, setLoading] = useState(false);
  const [responseMessage, setResponseMessage] = useState('');
  const [modalType, setModalType] = useState('');
  const [visible, setVisible] = useState(false);
  const [lineData, setLineData] = useState([]);
  const navigation = useNavigation();
  const [groupedData, setGroupedData] = useState({});
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isbatchIdVisible, setisbatchIdVisible] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState({});

  const [natureOptions, setNatureOptions] = useState([]);
  const [lineOptions, setLineOptions] = useState([]);
  const [batchOptions, setBatchOptions] = useState([]);

  const [loadingNature, setLoadingNature] = useState(true);
  const [loadingLine, setLoadingLine] = useState(false);
  const [loadingBatch, setLoadingBatch] = useState(false);

  const [searchedData, setSearchedData] = useState(null);
  const [loadingSearchedData, setLoadingSearchedData] = useState(false);

  const [errorVisible, setErrorVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    fetchNatureOfBusiness();
  }, []);

  const fetchNatureOfBusiness = async () => {
    const selectedData = await appStorage.getSelectedCategory();
    if (selectedData) {
      const data = [];
      data.push({id: selectedData.value, name: selectedData.label});
      setNatureOptions(data);
      setLoadingNature(false);
    }
  };

  const fetchLineOfBusiness = async natureId => {
    try {
      setLoadingLine(true);
      const userData = await appStorage.getUserData();
      const response = await api.get(API_ENDPOINTS.LOB_Dropdown_Data, {
        params: {
          Nature_Id: natureId,
          company_id: userData.companY_ID,
        },
      });
      console.log('Line of Business:-----', response.data);
      if (response.data.status === 'success') {
        const lobData = response?.data?.data?.linE_OF_BUSNINESS;
        const custumizeData =
          lobData &&
          lobData.map(item => ({
            id: item.value,
            name: item.text,
          }));
        console.log('custumizeData', custumizeData);

        setLineOptions(custumizeData || []);
      }
    } catch (error) {
      console.log('Error fetching line of business:', error);
    } finally {
      setLoadingLine(false);
    }
  };

  const fetchBatchNumbers = async lineId => {
    try {
      setLoadingBatch(true);
      let data = [];
      const userData = await appStorage.getUserData();
      const response = await api.get(API_ENDPOINTS.BATCH_Dropdown_Data, {
        params: {
          Lob_Id: lineId,
          company_id: userData.companY_ID,
        },
      });
      console.log('Batch Numbers:', response.data.data);
      if (response.data.status === 'success') {
        const batchData = response?.data?.data;
        const custumizeData =
          batchData &&
          batchData.map(item => ({
            id: item.value,
            name: item.text,
          }));

        setBatchOptions(custumizeData || []);
      }
    } catch (error) {
      console.log('Error fetching batch numbers:', error);
    } finally {
      setLoadingBatch(false);
    }
  };

  const fetchDataHistorySearchedDetails = async () => {
    setLoadingSearchedData(true);
    console.log('Fetching data history searched details for batch:', batch);

    try {
      const response = await api.get(API_ENDPOINTS.DataEntrySearchedDetails, {
        params: {
          batch_id: batch[0],
        },
      });

      if (response.data.status === 'success') {
        console.log('Data history searched details:', response.data);
        setSearchedData(response.data.data);
        getDataEntryDetails();
      } else {
        setErrorVisible(true);
        setErrorMessage(response.data.message);
      }
    } catch (error) {
      console.log('Error fetching data history searched details:', error);
    } finally {
      setLoadingSearchedData(false);
    }
  };

  const handleSearch = async () => {
    try {
      console.log('Nature:', nature, 'Line:', line, 'Batch:', batch);
      fetchDataHistorySearchedDetails();
    } catch (error) {
      console.log('Error during search:', error);
    }
  };

  const updateGroupedData = (type, index, key, value) => {
    const updatedGrouped = {...groupedData};
    console.log('kjhkjkkhhjjjkjkjkjkkj', updatedGrouped);

    const parsedValue =
      key === 'uniT_COST' || key === 'actuaL_VALUE'
        ? value.toString() || ''
        : value.toString();

    // Update groupedData
    const updatedItems = [...updatedGrouped[type]];
    console.log('kjhkjkkhhjjjkjkjkjkkj1111', updatedItems);
    updatedItems[index] = {
      ...updatedItems[index],
      [key]: parsedValue,
    };
    updatedGrouped[type] = updatedItems;

    // Set groupedData
    setGroupedData(updatedGrouped);

    // Flatten and update lineData
    const flattened = Object.values(updatedGrouped).flat();
    setLineData(flattened);
    console.log('Updated lineData:', flattened);
  };

  const toggleGroup = group => {
    setExpandedGroups(prevState => ({
      ...prevState,
      [group]: !prevState[group],
    }));
  };

  const handleEyePress = item => {
    navigate('LineDetailScreen', {lineItem: item});
  };

  const getDataEntryDetails = async () => {
    try {
      const userDataString = await appStorage.getUserData();
      const commonDetails = await appStorage.getCommonDetails();

      if (!userDataString || !commonDetails) {
        setResponseMessage('No user data or common details found');
        setModalType('error');
        setVisible(true);
        return;
      }

      const userData = userDataString;
      const commonDetailsData = commonDetails;

      if (!userData.companY_ID || !commonDetailsData.naturE_ID) {
        setResponseMessage('Company ID or natureId is missing');
        setModalType('error');
        setVisible(true);
        return;
      }

      const params = {
        Company_Id: userData.companY_ID,
        batch_id: batch[0],
      };

      let response;

      const checkNetworkStatusAsync = () =>
        new Promise(resolve => {
          checkNetworkStatus(resolve);
        });

      const isConnected = await checkNetworkStatusAsync();
      console.log('kahsdjasdhjahdakjs', isConnected);
      if (isConnected) {
        response = await api.get(API_ENDPOINTS.DataEntryDetails, {
          params: params,
        });

        console.log(
          'response--------------- online',
          response.data,
          response.data?.data?.line,
        );
        response = response.data;
      } else {
        Alert.alert(
          'No Internet Connection',
          'Please check your internet connection and try again.',
        );
        return;
      }

      console.log(
        'Fetched data:fdsfsfsfsdfsdfds',
        response,
        'batch_id:',
        batch,
      );

      if (response.status === 'success') {
        const header = response.data?.header?.[0] || {};
        const line = response.data?.line || [];

        // Group the line data by parameteR_TYPE
        const grouped = line.reduce((acc, item) => {
          const type = item.parameteR_TYPE;
          if (!acc[type]) {
            acc[type] = [];
          }
          acc[type].push(item);
          return acc;
        }, {});

        setGroupedData(grouped);
        setExpandedGroups(
          Object.keys(grouped).reduce((acc, key) => {
            acc[key] = false;
            return acc;
          }, {}),
        );
        console.log('`groupedData:', grouped);
        // setIsFormVisible(true);
        setisbatchIdVisible(true);
      }
    } catch (error) {
      console.error('Error fetching batch details:', error.message);
    }
  };

  return (
    <>
      <Header
        title="Daily Data Entry"
        onFilterPress={() => navigation.openDrawer()}
      />
      <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
        <View style={styles.dropdownRowContainer}>
          <View style={styles.dropdownWrapper}>
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
          </View>
          <View style={styles.dropdownWrapper}>
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
          </View>
        </View>

        <View style={styles.dropdownRowContainer}>
          <View style={styles.dropdownWrapper}>
            <CustomDropdown
              label="Templates"
              selectedValue={line}
              // onValueChange={value => {
              //   setLine(value);
              //   setBatch('');
              //   fetchBatchNumbers(value);
              // }}
              options={lineOptions}
              loading={loadingLine}
            />
          </View>
          <View style={styles.dropdownWrapper}>
            <CustomDropdown
              label="Batch Number"
              selectedValue={batch}
              onValueChange={setBatch}
              options={batchOptions}
              loading={loadingBatch}
              multiSelect={true}
            />
          </View>
        </View>

        <TouchableOpacity
          disabled={batch === '' || loadingSearchedData}
          onPress={handleSearch}
          style={[
            styles.searchButton,
            {opacity: batch === '' || loadingSearchedData ? 0.5 : 1},
          ]}>
          <Text style={styles.searchText}>
            {loadingSearchedData ? 'Loading' : 'Search'}
          </Text>
        </TouchableOpacity>
        {/* {isFormVisible && (
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.button}
              // onPress={() => handleSubmit('draft')}
              disabled={loading}>
              <Text style={styles.buttonText}>
                {loading ? 'Saving' : 'Save'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              // onPress={() => handleSubmit('posted')}
              disabled={loading}>
              <Text style={styles.buttonText}>Post</Text>
            </TouchableOpacity>
          </View>
        )} */}
        {isbatchIdVisible && (
          <View style={{paddingTop: 10}}>
            <DataEntryAddLine
              isFormVisible={isFormVisible}
              setIsFormVisible={setIsFormVisible}
              isDailyDataEntry={true}
            />
          </View>
        )}

        {isFormVisible && (
          <>
            <LineDetailsComponent
              groupedData={groupedData}
              expandedGroups={expandedGroups}
              toggleGroup={toggleGroup}
              updateGroupedData={updateGroupedData}
              handleEyePress={handleEyePress}
            />
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.button}
                // onPress={() => handleSubmit('draft')}
                disabled={loading}>
                <Text style={styles.buttonText}>
                  {loading ? 'Saving' : 'Save'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.button}
                // onPress={() => handleSubmit('posted')}
                disabled={loading}>
                <Text style={styles.buttonText}>Post</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#F8F9FA',
  },
  title: {
    fontSize: 18,
    fontFamily: FONTFAMILY.bold,
    marginBottom: 10,
  },
  dropdownContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    fontFamily: FONTFAMILY.semibold,
  },
  dropdown: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    padding: 10,
  },
  searchButton: {
    backgroundColor: COLORS.SecondaryColor,
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  searchText: {
    color: '#FFF',
    fontSize: 16,
    fontFamily: FONTFAMILY.semibold,
  },
  SearchedItemContainer: {
    marginTop: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    paddingBottom: 25,
    marginTop: 20,
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
    fontFamily: FONTFAMILY.semibold,
    textAlign: 'center',
  },
  sectionTitleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  dropdownRowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  dropdownWrapper: {
    flex: 1,
    marginHorizontal: 5,
  },
});

export default DailyDataEntry;
