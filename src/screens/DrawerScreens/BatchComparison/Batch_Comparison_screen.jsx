import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  Dimensions,
} from 'react-native';
import {Calendar} from 'react-native-calendars';
import api from '../../../Apiconfig/ApiconfigWithInterceptor';
import {API_ENDPOINTS} from '../../../Apiconfig/Apiconfig';
import {appStorage} from '../../../utils/services/StorageHelper';
import CustomDropdown from '../../../components/DataEntryHistoryCustumDropdown';
import Header from '../../../components/HeaderComp';
import {useNavigation} from '@react-navigation/native';
import {COLORS} from '../../../theme/theme';
import {FONTFAMILY} from '../../../theme/theme';
import StatusModal from '../../../components/CustumModal';
import TableComponent from '../../../components/TableComponent';
import DynamicBatchComparisonChart from '../../../components/Batch_Chart';
const {width} = Dimensions.get('window');

const BatchComparison = () => {
  const [nature, setNature] = useState('');
  const [line, setLine] = useState('');
  const [batch, setBatch] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [responseMessage, setResponseMessage] = useState('');
  const [modalType, setModalType] = useState('');
  const [visible, setVisible] = useState(false);
  const [isFormVisible, setIsFormVisible] = useState(false);

  const [natureOptions, setNatureOptions] = useState([]);
  const [lineOptions, setLineOptions] = useState([]);
  const [batchOptions, setBatchOptions] = useState([]);
  const [templatesOptions, setTemplates] = useState([]);
  const [loadingNature, setLoadingNature] = useState(true);
  const [loadingLine, setLoadingLine] = useState(false);
  const [loadingBatch, setLoadingBatch] = useState(false);
  const [loadingTemplates, setLoadingTemplates] = useState(false);
  const [loadingSearchedData, setLoadingSearchedData] = useState(false);
  const [errorVisible, setErrorVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // State for date handling
  const [data, setData] = useState([]);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [showFromCalendar, setShowFromCalendar] = useState(false);
  const [showToCalendar, setShowToCalendar] = useState(false);

  const [isTableView, setIsTableView] = useState(true);

  const navigation = useNavigation();

  useEffect(() => {
    fetchNatureOfBusiness();
  }, []);

  const formatDate = dateString => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const day = date.getDate();
    const monthNames = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

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
      if (response.data.status === 'success') {
        const lobData = response?.data?.data?.linE_OF_BUSNINESS;
        const customizedData =
          lobData && lobData.map(item => ({id: item.value, name: item.text}));
        setLineOptions(customizedData || []);
      }
    } catch (error) {
      console.log('Error fetching line of business:', error);
    } finally {
      setLoadingLine(false);
    }
  };

  const fetchLocations = async () => {
    try {
      setLoadingTemplates(true);
      const userData = await appStorage.getUserData();
      const response = await api.get(API_ENDPOINTS.Location_Dropdown_Data, {
        params: {
          company_id: userData.companY_ID,
        },
      });
      if (response.data.status === 'success') {
        const templateData = response?.data?.data?.location;
        const customizedData =
          templateData &&
          templateData.map(item => ({id: item.value, name: item.text}));
        setTemplates(customizedData || []);
      }
    } catch (error) {
      console.log('Error fetching templates:', error);
    } finally {
      setLoadingTemplates(false);
    }
  };

  const fetchBatchNumbers = async (templateId, location) => {
    try {
      setLoadingBatch(true);
      const userData = await appStorage.getUserData();
      const response = await api.get(
        API_ENDPOINTS.Batches_getByLocation_Dropdown_Data,
        {
          params: {
            Lob_Id: templateId,
            company_id: userData.companY_ID,
            loc_id: location,
          },
        },
      );
      if (response.data.status === 'success') {
        const batchData = response?.data?.data;
        const customizedData =
          batchData &&
          batchData.map(item => ({id: item.value, name: item.text}));
        setBatchOptions(customizedData || []);
      } else {
        setBatchOptions([]);
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
      const userData = await appStorage.getUserData();
      const modifiedBatch = Array.isArray(batch) ? batch.join(',') : '';
      const response = await api.get(
        API_ENDPOINTS.Batch_Comparison_DataEntrySearchedDetails,
        {
          params: {
            company_id: userData.companY_ID,
            Lob_Id: line,
            Location_Id: selectedTemplate || '0',
            Batch_Id: modifiedBatch,
            From_Date: formatDate(fromDate) || '',
            To_Date: formatDate(toDate) || '',
          },
        },
      );
      console.log('Data history searched details:', response.data);

      if (response.data.status === 'success') {
        setIsFormVisible(true);
        const values = JSON.parse(response.data.data.values);
        setData(values);
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
      fetchDataHistorySearchedDetails();
    } catch (error) {
      console.log('Error during search:', error);
    }
  };

  const onDayPressFrom = day => {
    setFromDate(day.dateString);
    setShowFromCalendar(false);
  };

  const onDayPressTo = day => {
    setToDate(day.dateString);
    setShowToCalendar(false);
  };

  return (
    <>
      <Header
        title="Batch Comparison"
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
                setSelectedTemplate('');
                fetchLocations(value);
                fetchBatchNumbers(value, 0);
              }}
              options={lineOptions}
              loading={loadingLine}
            />
          </View>
        </View>

        <View style={styles.dropdownRowContainer}>
          <View style={styles.dropdownWrapper}>
            <CustomDropdown
              label="Location (Optional)"
              selectedValue={selectedTemplate}
              onValueChange={value => {
                setSelectedTemplate(value);
                setBatch('');
                fetchBatchNumbers(line, value);
              }}
              options={templatesOptions}
              loading={loadingTemplates}
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
        <View style={styles.dropdownRowContainer}>
          <View style={styles.dropdownWrapper}>
            <View style={styles.dateInputContainer}>
              <Text style={styles.label}>From Date</Text>
              <TouchableOpacity
                onPress={() => setShowFromCalendar(true)}
                style={styles.dateInput}>
                <Text style={styles.selectedTextDate}>
                  {formatDate(fromDate) || 'Select From Date'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.dropdownWrapper}>
            <View style={styles.dateInputContainer}>
              <Text style={styles.label}>To Date</Text>
              <TouchableOpacity
                onPress={() => setShowToCalendar(true)}
                style={styles.dateInput}>
                <Text style={styles.selectedTextDate}>
                  {formatDate(toDate) || 'Select To Date'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <Modal
          animationType="fade"
          transparent={true}
          visible={showFromCalendar || showToCalendar}
          onRequestClose={() => {
            setShowFromCalendar(false);
            setShowToCalendar(false);
          }}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Calendar
                style={{
                  width: width * 0.85,
                }}
                theme={{
                  arrowColor: COLORS.SecondaryColor,
                }}
                onDayPress={showFromCalendar ? onDayPressFrom : onDayPressTo}
                markedDates={
                  showFromCalendar
                    ? {
                        [fromDate]: {
                          selected: true,
                          selectedColor: COLORS.SecondaryColor,
                          selectedTextColor: '#fff',
                        },
                      }
                    : {
                        [toDate]: {
                          selected: true,
                          selectedColor: COLORS.SecondaryColor,
                          selectedTextColor: '#fff',
                        },
                      }
                }
              />
              <TouchableOpacity
                style={styles.buttonClose}
                theme={{
                  arrowColor: COLORS.SecondaryColor,
                }}
                onPress={() => {
                  setShowFromCalendar(false);
                  setShowToCalendar(false);
                }}>
                <Text style={styles.textStyle}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

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

        {isFormVisible && (
          <>
            <View style={styles.toggleContainer}>
              <TouchableOpacity
                onPress={() => setIsTableView(true)}
                style={[
                  styles.toggleOption,
                  isTableView && styles.activeToggleOption,
                ]}>
                <Text
                  style={[
                    styles.toggleText,
                    isTableView && styles.activeToggleText,
                  ]}>
                  📋 Table View
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setIsTableView(false)}
                style={[
                  styles.toggleOption,
                  !isTableView && styles.activeToggleOption,
                ]}>
                <Text
                  style={[
                    styles.toggleText,
                    !isTableView && styles.activeToggleText,
                  ]}>
                  📊 Chart View
                </Text>
              </TouchableOpacity>
            </View>
            {isTableView ? (
              <TableComponent data={data} />
            ) : (
              <DynamicBatchComparisonChart batches={data} />
            )}
          </>
        )}
      </ScrollView>
      <StatusModal
        visible={visible}
        onClose={() => setVisible(false)}
        message={responseMessage}
        type={modalType}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#F8F9FA',
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
  selectedTextDate: {
    fontFamily: FONTFAMILY.regular,
  },
  dateInputContainer: {
    marginBottom: 15,
  },
  label: {
    marginBottom: 5,
    fontSize: 14,
    color: '#000',
    fontFamily: FONTFAMILY.regular,
  },
  dateInput: {
    borderColor: COLORS.primaryColor,
    borderWidth: 1,
    borderRadius: 5,
    paddingVertical: 5,
    paddingHorizontal: 10,
    height: 40,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    // alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonClose: {
    backgroundColor: COLORS.SecondaryColor,
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginTop: 15,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontFamily: FONTFAMILY.regular,
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: '#E0E0E0',
    borderRadius: 30,
    padding: 4,
    alignSelf: 'center',
    marginTop: 20,
  },
  toggleOption: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 30,
  },
  activeToggleOption: {
    backgroundColor: COLORS.SecondaryColor,
  },
  toggleText: {
    fontFamily: FONTFAMILY.regular,
    color: '#333',
    fontSize: 14,
  },
  activeToggleText: {
    color: '#FFF',
    fontFamily: FONTFAMILY.semibold,
  },
});

export default BatchComparison;
