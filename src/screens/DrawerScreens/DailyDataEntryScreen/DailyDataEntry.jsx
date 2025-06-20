import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
} from 'react-native';
import api from '../../../Apiconfig/ApiconfigWithInterceptor';
import {API_ENDPOINTS} from '../../../Apiconfig/Apiconfig';
import {appStorage} from '../../../utils/services/StorageHelper';
import CustomDropdown from '../../../components/DataEntryHistoryCustumDropdown';
import Header from '../../../components/HeaderComp';
import {useNavigation} from '@react-navigation/native';
import LineDetailsComponent from '../../../components/LineDetailsForm';
import {COLORS} from '../../../theme/theme';
import DataEntryAddLine from '../DataEntryScreen/DataEntry/DataEntry_AddLine';
import {navigate} from '../../../utils/services/NavigationService';
import {FONTFAMILY} from '../../../theme/theme';
import StatusModal from '../../../components/CustumModal';

const DailyDataEntry = () => {
  const [nature, setNature] = useState('');
  const [line, setLine] = useState('');
  const [batch, setBatch] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [loading, setLoading] = useState(false);
  const [responseMessage, setResponseMessage] = useState('');
  const [modalType, setModalType] = useState('');
  const [visible, setVisible] = useState(false);
  const navigation = useNavigation();
  const [groupedData, setGroupedData] = useState({});
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isbatchIdVisible, setisbatchIdVisible] = useState(false);
  const [expandedBatches, setExpandedBatches] = useState({});
  const [expandedParameters, setExpandedParameters] = useState({});

  const [natureOptions, setNatureOptions] = useState([]);
  const [lineOptions, setLineOptions] = useState([]);
  const [batchOptions, setBatchOptions] = useState([]);
  const [templatesOptions, setTemplates] = useState([]);

  const [loadingNature, setLoadingNature] = useState(true);
  const [loadingLine, setLoadingLine] = useState(false);
  const [loadingBatch, setLoadingBatch] = useState(false);
  const [loadingTemplates, setLoadingTemplates] = useState(false);
  const [loadingType, setLoadingType] = useState(null);

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

  const fetchTemplates = async lineId => {
    try {
      setLoadingTemplates(true);
      const userData = await appStorage.getUserData();
      const response = await api.get(API_ENDPOINTS.Template_Dropdown_Data, {
        params: {
          Lob_Id: lineId,
          company_id: userData.companY_ID,
        },
      });
      if (response.data.status === 'success') {
        const templateData = response?.data?.data;
        const customizedData =
          templateData &&
          templateData.map(item => ({
            id: item.templatE_ID,
            name: item.templatE_NAME,
          }));
        setTemplates(customizedData || []);
      }
    } catch (error) {
      console.log('Error fetching templates:', error);
    } finally {
      setLoadingTemplates(false);
    }
  };

  const fetchBatchNumbers = async templateId => {
    try {
      setLoadingBatch(true);
      const userData = await appStorage.getUserData();
      const response = await api.get(
        API_ENDPOINTS.TemplateBatches_Dropdown_Data,
        {
          params: {
            Template_id: templateId,
            company_id: userData.companY_ID,
          },
        },
      );
      if (response.data.status === 'success') {
        const batchData = response?.data?.data;
        const customizedData =
          batchData &&
          batchData.map(item => ({id: item.batcH_ID, name: item.batcH_NO}));
        setBatchOptions(customizedData || []);
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
        API_ENDPOINTS.Daily_DataEntrySearchedDetails,
        {
          params: {
            company_id: userData.companY_ID,
            lob_id: line,
            location_id: '0',
            posting_date: '',
            template_id: selectedTemplate,
            template_batches: modifiedBatch,
          },
        },
      );

      if (response.data.status === 'success') {
        const groupedByBatch = {};
        response.data.data.line.forEach(entry => {
          const batchNo = entry.batch_No;
          if (!groupedByBatch[batchNo]) {
            groupedByBatch[batchNo] = {batchNo, LineData: []};
          }
          groupedByBatch[batchNo].LineData.push(entry);
        });

        const finalResult = Object.values(groupedByBatch).map(batch => {
          const groupedByParameterType = batch.LineData.reduce((acc, item) => {
            const type = item.parameteR_TYPE || 'Unknown';
            if (!acc[type]) {
              acc[type] = [];
            }
            acc[type].push(item);
            return acc;
          }, {});

          return {batchNo: batch.batchNo, LineData: groupedByParameterType};
        });
        setIsFormVisible(true);
        setGroupedData(finalResult);
        setExpandedBatches(
          finalResult.reduce(
            (acc, batch) => ({...acc, [batch.batchNo]: false}),
            {},
          ),
        );
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

  const updateGroupedData = (batchNo, type, index, key, value) => {
    setGroupedData(prevGroupedData => {
      const updatedGroupedData = prevGroupedData.map(batch => {
        if (batch.batchNo === batchNo) {
          const updatedLineData = {...batch.LineData};
          const updatedItems = [...updatedLineData[type]];
          updatedItems[index] = {...updatedItems[index], [key]: value};
          updatedLineData[type] = updatedItems;
          return {...batch, LineData: updatedLineData};
        }
        return batch;
      });
      return updatedGroupedData;
    });
  };

  const toggleBatch = batchNo => {
    setExpandedBatches(prevState => ({
      ...prevState,
      [batchNo]: !prevState[batchNo],
    }));
  };

  const toggleParameter = (batchNo, type) => {
    setExpandedParameters(prevState => ({
      ...prevState,
      [`${batchNo}-${type}`]: !prevState[`${batchNo}-${type}`],
    }));
  };

  const handleEyePress = item => {
    navigate('LineDetailScreen', {lineItem: item});
  };

  const handleSave = async () => {
    try {
      console.log('Saving data:', groupedData);
      const transformedData = groupedData.map(batch => {
        const header = {
          DATAENTRY_ID: 0,
          NATURE_OF_BUSINESS: '',
          LINE_OF_BUSINESS: '',
          BATCH_NO: batch.batchNo,
          BREED_NAME: '',
          TEMPLATE_NAME: '',
          TEMPLATE_ID: 0,
          LOCATION_NAME: batch.LineData.Consumption[0].location_name,
          POSTING_DATE: batch.LineData.Consumption[0].posting_date,
          AGE_DAYS: 0,
          AGE_WEEK: 0,
          OPENING_QTY: 0,
          START_DATE: batch.LineData.Consumption[0].posting_date,
          RUNNING_COST: 0,
          status: 'posted',
          CURRENT_LOCATION: '',
          CHK_in_lat: '',
          CHK_in_long: '',
          REMARK: '',
          NOB_ID: 3,
          LOB_ID: '3',
          BATCH_ID: batch.LineData.Consumption[0].batch_ID,
        };

        const lines = Object.values(batch.LineData)
          .flat()
          .map(line => ({
            BATCH_ID: line.batch_ID,
            PARAMETER_TYPE_ID: line.parameteR_TYPE_ID,
            PARAMETER_TYPE: line.parameteR_TYPE,
            PARAMETER_NAME: line.parameteR_NAME,
            ACTUAL_VALUE: line.actuaL_VALUE,
            UNIT_COST: line.uniT_COST,
            DATAENTRY_TYPE_ID: line.dataentrY_TYPE_ID,
            DATAENTRY_TYPE: line.dataentrY_TYPE,
            ITEM_NAME: line.iteM_NAME,
            DATAENTRY_UOM: line.dataentrY_UOM,
            OCCURRENCE: line.occurrence,
            FREQUENCY_START_DATE: line.frequencY_START_DATE,
            FREQUENCY_END_DATE: line.frequencY_END_DATE,
            PARAMETER_ID: line.parameteR_ID,
            FORMULA_FLAG: line.formulA_FLAG,
            LINE_AMOUNT: line.linE_AMOUNT,
            ITEM_ID: line.iteM_ID,
          }));

        return {header, lines, livestock: []};
      });

      console.log(JSON.stringify(transformedData, null, 2), 'jhkjhjhjkhjkhjk');
    } catch (error) {
      console.log('Error saving data:', error);
    }
  };

  // const handleSubmit = async status => {
  //   try {
  //     setLoading(true);
  //     setLoadingType(status);
  //     const commonDetails = await appStorage.getCommonDetails();
  //     const userDetails = await appStorage.getUserData();
  //     console.log('Common Details:', commonDetails, userDetails);

  //     const transformedData = groupedData.map(batch => {
  //       const header = {
  //         DATAENTRY_ID: 0,
  //         NATURE_OF_BUSINESS: '',
  //         LINE_OF_BUSINESS: '',
  //         BATCH_NO: batch.batchNo,
  //         BREED_NAME: '',
  //         TEMPLATE_NAME: '',
  //         TEMPLATE_ID: 0,
  //         LOCATION_NAME: '',
  //         POSTING_DATE: '01-Jan-1999',
  //         AGE_DAYS: 0,
  //         AGE_WEEK: 0,
  //         OPENING_QTY: 0,
  //         START_DATE: '01-Jan-1999',
  //         RUNNING_COST: 0,
  //         status: 'posted',
  //         CURRENT_LOCATION: '',
  //         CHK_in_lat: '',
  //         CHK_in_long: '',
  //         REMARK: '',
  //         NOB_ID: 3,
  //         LOB_ID: '3',
  //         BATCH_ID: 0,
  //         Company_id: userDetails.companY_ID,
  //         Location: commonDetails.locatioN_ID,
  //         Created_by: userDetails.useR_ID,
  //         Entry_from: 'Mobile',
  //       };

  //       const lines = Object.values(batch.LineData)
  //         .flat()
  //         .map(line => ({
  //           BATCH_ID: line.batch_ID,
  //           PARAMETER_TYPE_ID: line.parameteR_TYPE_ID,
  //           PARAMETER_TYPE: line.parameteR_TYPE,
  //           PARAMETER_NAME: line.parameteR_NAME,
  //           ACTUAL_VALUE: line.actuaL_VALUE,
  //           UNIT_COST: line.uniT_COST,
  //           DATAENTRY_TYPE_ID: line.dataentrY_TYPE_ID,
  //           DATAENTRY_TYPE: line.dataentrY_TYPE,
  //           ITEM_NAME: line.iteM_NAME,
  //           DATAENTRY_UOM: line.dataentrY_UOM,
  //           OCCURRENCE: line.occurrence,
  //           FREQUENCY_START_DATE: line.frequencY_START_DATE,
  //           FREQUENCY_END_DATE: line.frequencY_END_DATE,
  //           PARAMETER_ID: line.parameteR_ID,
  //           FORMULA_FLAG: line.formulA_FLAG,
  //           LINE_AMOUNT: line.linE_AMOUNT,
  //           ITEM_ID: line.iteM_ID,
  //         }));

  //       return {header, lines, livestock: []};
  //     });

  //     // Iterate over each batch in transformedData
  //     transformedData.forEach(batch => {
  //       const lineData = batch.lines;

  //       // Validation checks for lineData
  //       for (const item of lineData) {
  //         if (!item.ACTUAL_VALUE?.toString()) {
  //           setModalType('error');
  //           setResponseMessage("'Actual Value' & 'Unit Cost' can not be blank");
  //           setVisible(true);
  //           return;
  //         }
  //         if (!item.UNIT_COST?.toString()) {
  //           setModalType('error');
  //           setResponseMessage("'Actual Value' & 'Unit Cost' can not be blank");
  //           setVisible(true);
  //           return;
  //         }
  //       }
  //     });

  //     const response = await api.post(
  //       API_ENDPOINTS.DailyDataEntry_Save_And_Post,
  //       {
  //         data: transformedData[0],
  //       },
  //     );

  //     console.log('daily data entry response', response.data);

  //     console.log(transformedData[0]);
  //   } catch (error) {
  //     console.error('Error saving data:', error.message);
  //   } finally {
  //     setLoading(false);
  //     setLoadingType(null);
  //   }
  // };

  const handleSubmit = async status => {
    try {
      setLoading(true);
      setLoadingType(status);

      const commonDetails = await appStorage.getCommonDetails();
      const userDetails = await appStorage.getUserData();

      if (!commonDetails || !userDetails) {
        throw new Error('Common details or user details are not available.');
      }

      const transformedData = groupedData
        .map(batch => {
          if (!batch) {
            console.error('Batch is undefined or null');
            return null;
          }

          const header = {
            DATAENTRY_ID: 0,
            NATURE_OF_BUSINESS: '',
            LINE_OF_BUSINESS: '',
            BATCH_NO: batch.batchNo,
            BREED_NAME: '',
            TEMPLATE_NAME: '',
            TEMPLATE_ID: 0,
            LOCATION_NAME: '',
            POSTING_DATE: '01-Jan-1999',
            AGE_DAYS: 0,
            AGE_WEEK: 0,
            OPENING_QTY: 0,
            START_DATE: '01-Jan-1999',
            RUNNING_COST: 0,
            status: status,
            CURRENT_LOCATION: '',
            CHK_in_lat: '',
            CHK_in_long: '',
            REMARK: '',
            NOB_ID: 3,
            LOB_ID: '3',
            BATCH_ID: 0,
            Company_id: userDetails.companY_ID,
            Location: commonDetails.locatioN_ID,
            Created_by: userDetails.useR_ID,
            Entry_from: 'Mobile',
          };

          if (!batch.LineData) {
            console.error('LineData is undefined or null');
            return {header, lines: [], livestock: []};
          }

          const lines = Object.values(batch.LineData)
            .flat()
            .map(line => {
              if (!line) {
                console.error('Line is undefined or null');
                return null;
              }
              return {
                BATCH_ID: line.batch_ID,
                PARAMETER_TYPE_ID: line.parameteR_TYPE_ID,
                PARAMETER_TYPE: line.parameteR_TYPE,
                PARAMETER_NAME: line.parameteR_NAME,
                ACTUAL_VALUE: line.actuaL_VALUE,
                UNIT_COST: line.uniT_COST,
                DATAENTRY_TYPE_ID: line.dataentrY_TYPE_ID,
                DATAENTRY_TYPE: line.dataentrY_TYPE,
                ITEM_NAME: line.iteM_NAME,
                DATAENTRY_UOM: line.dataentrY_UOM,
                OCCURRENCE: line.occurrence,
                FREQUENCY_START_DATE: line.frequencY_START_DATE,
                FREQUENCY_END_DATE: line.frequencY_END_DATE,
                PARAMETER_ID: line.parameteR_ID,
                FORMULA_FLAG: line.formulA_FLAG,
                LINE_AMOUNT: line.linE_AMOUNT,
                ITEM_ID: line.iteM_ID,
              };
            })
            .filter(line => line !== null);

          return {header, lines, livestock: []};
        })
        .filter(batch => batch !== null);

      for (const batch of transformedData) {
        for (const item of batch.lines) {
          if (!item.ACTUAL_VALUE?.toString() || !item.UNIT_COST?.toString()) {
            setModalType('error');
            setResponseMessage("'Actual Value' & 'Unit Cost' cannot be blank");
            setVisible(true);
            return;
          }
        }
      }

      if (transformedData.length === 0) {
        throw new Error('No valid data to post.');
      }

      const response = await api.post(
        API_ENDPOINTS.DailyDataEntry_Save_And_Post,
        transformedData[0],
      );

      if (response.data.status === 'success') {
        setResponseMessage(response.message || 'Data saved successfully');
        setModalType('success');
        setVisible(true);
      } else {
        setResponseMessage(response.message || 'Failed to save data');
        setModalType('error');
        setVisible(true);
      }

      console.log('Daily data entry response:', response.data);
    } catch (error) {
      console.error('Error saving data:', error.message);
      setModalType('error');
      setResponseMessage(error.message);
      setVisible(true);
    } finally {
      setLoading(false);
      setLoadingType(null);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container1}>
      <>
        <Header
          title="Daily Data Entry"
          onFilterPress={() => navigation.openDrawer()}
        />
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={styles.container}>
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
                  fetchTemplates(value);
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
                selectedValue={selectedTemplate}
                onValueChange={value => {
                  setSelectedTemplate(value);
                  setBatch('');
                  fetchBatchNumbers(value);
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
                expandedBatches={expandedBatches}
                expandedParameters={expandedParameters}
                toggleBatch={toggleBatch}
                toggleParameter={toggleParameter}
                updateGroupedData={updateGroupedData}
                handleEyePress={handleEyePress}
              />
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => handleSubmit('draft')}
                  disabled={loading}>
                  <Text style={styles.buttonText}>
                    {loadingType === 'draft' ? 'Saving...' : 'Save'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => handleSubmit('posted')}
                  disabled={loading}>
                  <Text style={styles.buttonText}>
                    {loadingType === 'posted' ? 'Posting...' : 'Post'}
                  </Text>
                </TouchableOpacity>
              </View>
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
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#F8F9FA',
  },
  container1: {
    flex: 1,
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
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 20,
    gap: 10,
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
});

export default DailyDataEntry;
