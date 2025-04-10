import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import CustomDropdown from '../../../../components/DataEntryHistoryCustumDropdown';
import DataEntryHistorySearchedEntry from './DataEntryHistorySearchedEntry';
import api from '../../../../Apiconfig/ApiconfigWithInterceptor';
import {API_ENDPOINTS} from '../../../../Apiconfig/Apiconfig';
import {appStorage} from '../../../../utils/services/StorageHelper';
import StatusModal from '../../../../components/CustumModal';

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
      console.log('Line of Business:', response.data.data);
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
    try {
      const response = await api.get(API_ENDPOINTS.DataEntrySearchedDetails, {
        params: {
          batch_id: batch,
        },
      });

      if (response.data.status === 'success') {
        console.log('Data history searched details:', response.data);
        setSearchedData(response.data.data);
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

  // useEffect(() => {
  //   fetchDataHistorySearchedDetails();
  // }, []);

  return (
    <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
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
      <View style={styles.SearchedItemContainer}>
        {loadingSearchedData === false && (
          <DataEntryHistorySearchedEntry data={searchedData} />
        )}
      </View>
      <StatusModal
        visible={errorVisible}
        onClose={() => setErrorVisible(false)}
        message={errorMessage}
        type="error"
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
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
  SearchedItemContainer: {
    marginTop: 20,
  },
});

export default LinkedDropdowns;
