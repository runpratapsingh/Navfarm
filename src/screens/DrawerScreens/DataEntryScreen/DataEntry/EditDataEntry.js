import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  FlatList,
  Modal,
  TextInput,
  StatusBar,
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
import CustomDropdown from '../../../../components/DataEntryHistoryCustumDropdown';
import StatusModal from '../../../../components/CustumModal';
import {Calendar} from 'react-native-calendars';
import CalendarComponent from '../../../../components/CalenderComp';
import {SafeAreaView} from 'react-native-safe-area-context';

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
    nob_id: 0,
    lob_id: 0,
    template_id: 0,
    location: 0,
    CREATED_BY: 0,
    DataEntryId: 0,
    Remark: '',
    postingStatus: '',
  });
  const [lineData, setLineData] = useState([]);
  const [groupedData, setGroupedData] = useState({});
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [responseMessage, setResponseMessage] = useState('');
  const [modalType, setModalType] = useState('error');
  const [calendarVisible, setCalendarVisible] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState({});
  const [isFormVisible, setIsFormVisible] = useState(false);

  const formatDateForCalendar = dateStr => {
    const [day, month, year] = dateStr.split('-');
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
    const monthIndex = monthNames.indexOf(month);
    return `${year}-${String(monthIndex + 1).padStart(2, '0')}-${day.padStart(
      2,
      '0',
    )}`;
  };

  const formatDateForDisplay = dateStr => {
    const [year, month, day] = dateStr.split('-');
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
    const monthName = monthNames[parseInt(month, 10) - 1];
    return `${day}-${monthName}-${year}`;
  };

  const handleSubmit = async status => {
    try {
      setLoading(true);

      // Validation checks header
      if (!formState.nob_id) {
        setModalType('error');
        setResponseMessage("Please 'Select Nature of Business'");
        setVisible(true);
        return;
      }
      if (!formState.lob_id) {
        setModalType('error');
        setResponseMessage("Please select 'Line of Business'");
        setVisible(true);
        return;
      }
      if (!formState.remainingQty) {
        setModalType('error');
        setResponseMessage("'Remaining Quantity' can not be blank");
        setVisible(true);
        return;
      }
      if (!formState.breedName) {
        setModalType('error');
        setResponseMessage("'Breed Name' can not be blank");
        setVisible(true);
        return;
      }
      if (!formState.templateName) {
        setModalType('error');
        setResponseMessage("'Template' can not be blank");
        setVisible(true);
        return;
      }
      if (!formState.subLocationName) {
        setModalType('error');
        setResponseMessage("'Location Name' can not be blank");
        setVisible(true);
        return;
      }
      if (!formState.postingDate) {
        setModalType('error');
        setResponseMessage("'Posting Date' can not be blank");
        setVisible(true);
        return;
      }
      if (!formState.openingQuantity) {
        setModalType('error');
        setResponseMessage("'Opening Quantity' can not be blank");
        setVisible(true);
        return;
      }
      if (!formState.startDate) {
        setModalType('error');
        setResponseMessage("'Start Date' can not be blank");
        setVisible(true);
        return;
      }
      if (!formState.runningCost) {
        setModalType('error');
        setResponseMessage("'Running Cost' can not be blank");
        setVisible(true);
        return;
      }

      // Validation checks for lineData
      for (const item of lineData) {
        console.log('item', item);

        if (!item.actuaL_VALUE?.toString()) {
          setModalType('error');
          setResponseMessage("'Actual Value' & 'Unit Cost' can not be blank");
          setVisible(true);
          return;
        }
        if (!item.uniT_COST?.toString()) {
          setModalType('error');
          setResponseMessage("'Actual Value' & 'Unit Cost' can not be blank");
          setVisible(true);
          return;
        }
      }

      const userDataString = await appStorage.getUserData();
      const userData = userDataString;

      console.log('User data----------------->', userData);

      if (!userData.companY_ID) {
        console.error('Company ID is missing from user data');
        return;
      }

      const header = {
        DATAENTRY_ID: formState.DataEntryId,
        NOB_ID: parseInt(formState.nob_id),
        NATURE_OF_BUSINESS: formState.natureOfBusiness,
        LOB_ID: parseInt(formState.lob_id),
        LINE_OF_BUSINESS: formState.lineOfBusiness,
        BATCH_ID: batch_id?.toString(),
        BATCH_NO: formState.batch_No,
        BREED_NAME: formState.breedName,
        TEMPLATE_NAME: formState.templateName,
        TEMPLATE_ID: parseInt(formState.template_id),
        LOCATION_NAME: formState.subLocationName,
        POSTING_DATE: formatDateForDisplay(formState.postingDate),
        AGE_DAYS: formState.ageDays.toString(),
        AGE_WEEK: formState.ageWeek.toString(),
        OPENING_QTY: formState.openingQuantity.toString(),
        START_DATE: formState.startDate,
        RUNNING_COST: formState.runningCost.toString(),
        CREATED_BY: userData.useR_ID || 0,
        company_id: userData.companY_ID?.toString(),
        status: status,
        LOCATION: formState.location?.toString(),
        ENTRY_FROM: 'Web',
        CURRENT_LOCATION: '',
        CHK_in_lat: '',
        CHK_in_long: '',
        REMARK: formState.Remark,
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
        livestock: [],
      };

      console.log('Saving data:----------------->', updatedData, {
        BATCH_ID: batch_id?.toString(),
        BATCH_NO: formState.batch_No,
      });

      const response = await api.post(
        API_ENDPOINTS.SaveAndPostDataEntry,
        updatedData,
      );
      if (response.data?.status === 'success') {
        getDataEntryDetails();
        console.log('Data saved successfully:', response.data);
        setResponseMessage(response.data?.message || 'Operation successful.');
        setVisible(true);
        setModalType('success');
      } else {
        console.error('Failed to save data:', response.data);
        setResponseMessage(response.data?.message || 'Something went wrong');
        setVisible(true);
        setModalType('error');
      }
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

      console.log(
        'response---------------',
        response.data,
        batch_id,
        response.data?.data?.line,
      );

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
          postingDate: formatDateForCalendar(header.p_DATE) || '',
          subLocationName: header.locatioN_NAME || '',
          ageDays: header.agE_DAYS?.toString() || '',
          ageWeek: header.agE_WEEK?.toString() || '',
          openingQuantity: header.openinG_QTY?.toString() || '',
          startDate: header.s_DATE || '',
          runningCost: header.runninG_COST?.toString() || '',
          batch_No: header.batcH_NO || '',
          nob_id: header.noB_ID || 0,
          lob_id: header.loB_ID || 0,
          template_id: header.templatE_ID || 0,
          location: header.locatioN_ID || 0,
          batch_id: header.batcH_ID?.toString(),
          CREATED_BY: header.createD_BY?.toString(),
          Remark: header.remark || '',
          DataEntryId: header.dataentrY_ID || 0,
          postingStatus: header.status || '',
        }));

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
      } else {
        setResponseMessage(response.data?.message || 'Something went wrong');
        setModalType('error');
        setVisible(true);
      }
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  };

  useEffect(() => {
    getDataEntryDetails();
  }, []);

  const toggleGroup = group => {
    setExpandedGroups(prevState => ({
      ...prevState,
      [group]: !prevState[group],
    }));
  };

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
        value={item.actuaL_VALUE?.toString()}
        onChangeText={text => updateLineData(index, 'actuaL_VALUE', text)}
      />
      <CustomInput
        label="Cost Per Unit"
        value={item.uniT_COST?.toString()}
        onChangeText={text => updateLineData(index, 'uniT_COST', text)}
        editable={item.parameteR_NAME === 'Descriptive' ? false : true}
      />
      {item.parameteR_TYPE == 'Descriptive' ? (
        item.parameter_input_type == 'input' ? (
          <CustomInput
            label="Descriptive"
            value={item.parameter_input_value}
            onChangeText={text =>
              updateLineData(index, 'parameter_input_value', text)
            }
            placeholder="Enter descriptive value"
          />
        ) : item.parameteR_TYPE == 'Descriptive' ? (
          <CustomDropdown
            label="Descriptive"
            selectedValue={item.parameter_input_value}
            onValueChange={value => {
              updateLineData(index, 'parameter_input_value', value);
            }}
            options={[
              {id: '', name: 'Select'},
              ...item.parameter_input_format
                .split(',')
                .map(opt => ({id: opt.trim(), name: opt.trim()})),
            ]}
          />
        ) : null
      ) : null}
    </View>
  );

  const getCalendarConstraints = () => {
    const today = new Date();
    const todayFormatted = `${today.getFullYear()}-${String(
      today.getMonth() + 1,
    ).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

    console.log('asjfksafgjaagjfgaghj', formState.postingDate, todayFormatted);

    if (formState.postingStatus === 'draft') {
      return {
        minDate: formState.postingDate,
        maxDate: formState.postingDate,
      };
    } else if ('posted' === 'posted') {
      return {
        minDate: formState.postingDate,
        maxDate: todayFormatted,
      };
    } else return {};
  };

  return (
    <>
      <SafeAreaView style={{flex: 1, backgroundColor: '#2E313F'}}>
        <StatusBar barStyle="light-content" backgroundColor="#2E313F" />
        <HeaderWithBtn title="Data Entry" />
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={styles.container}>
          <TouchableOpacity
            onPress={() =>
              updateFormState('isHeaderVisible', !formState.isHeaderVisible)
            }
            style={styles.headerContainer}>
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
          </TouchableOpacity>

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
              <CalendarComponent
                postingStatus="sss"
                postingDate={formState.postingDate}
                onDateChange={day => {
                  updateFormState('postingDate', day);
                }}
                {...getCalendarConstraints()}
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
              <CustomInput
                label="Remark"
                value={formState.Remark}
                onChangeText={text => updateFormState('Remark', text)}
                multiline
                numberOfLines={4}
                placeholder="Enter your remark here..."
              />
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

          <DataEntryAddLine
            isFormVisible={isFormVisible}
            setIsFormVisible={setIsFormVisible}
          />
          {isFormVisible && (
            <View style={styles.lineDetail}>
              {Object.keys(groupedData).map(group => (
                <View key={group} style={styles.section1}>
                  <TouchableOpacity
                    onPress={() => toggleGroup(group)}
                    style={styles.sectionTitleHeader}>
                    <Text style={styles.sectionTitle1}>{group}</Text>
                    <Icon
                      name={expandedGroups[group] ? 'minus' : 'plus'}
                      size={20}
                      color={COLORS.primaryColor}
                    />
                  </TouchableOpacity>
                  {expandedGroups[group] && (
                    <FlatList
                      data={groupedData[group]}
                      renderItem={renderLineItem}
                      keyExtractor={(item, index) => index.toString()}
                    />
                  )}
                </View>
              ))}
            </View>
          )}

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => handleSubmit('draft')}>
              <Text style={styles.buttonText}>
                {loading ? 'Saving' : 'Save'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={() => handleSubmit('posted')}>
              <Text style={styles.buttonText}>Post</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
        <StatusModal
          visible={visible}
          onClose={() => setVisible(false)}
          message={responseMessage}
          type={modalType}
        />
      </SafeAreaView>
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
  section1: {
    marginBottom: 20,
    borderBottomColor: '#ddd',
    borderBottomWidth: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.SecondaryColor,
  },
  sectionTitle1: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primaryColor,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    marginHorizontal: 16,
    paddingBottom: 20,
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
  inputWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 5,
    marginVertical: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
  },
  icon: {
    marginLeft: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '70%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  closeButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: COLORS.SecondaryColor,
    borderRadius: 5,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default EditDataEntry;
