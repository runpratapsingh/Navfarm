import React, {useEffect, useState, useRef} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  StatusBar,
  Animated,
} from 'react-native';
import {PanGestureHandler} from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import Header from '../../../components/HeaderComp';
import {COLORS} from '../../../theme/theme';
import {appStorage} from '../../../utils/services/StorageHelper';
import api from '../../../Apiconfig/ApiconfigWithInterceptor';
import {API_ENDPOINTS} from '../../../Apiconfig/Apiconfig';
import {navigate} from '../../../utils/services/NavigationService';
import LinkedDropdowns from './DataHistory/DataEntryHistory';
import {SafeAreaView} from 'react-native-safe-area-context';
import StatusModal from '../../../components/CustumModal';

const mainTabs = ['Data Entry', 'Data Entry History'];

const DataEntryScreen = () => {
  const navigation = useNavigation();
  const [activeMainTab, setActiveMainTab] = useState('Data Entry');
  const [expanded, setExpanded] = useState(null);
  const [loading, setLoading] = useState(false);
  const [batchData, setBatchData] = useState([]);
  const isFocused = useIsFocused();
  const [visible, setVisible] = useState(false);
  const [responseMessage, setResponseMessage] = useState('');
  const [modalType, setModalType] = useState('error');

  const getDashboardData = async () => {
    try {
      setLoading(true);
      const userDataString = await appStorage.getUserData();
      const commonDetails = await appStorage.getCommonDetails();
      const selectedData = await appStorage.getSelectedCategory();
      console.log('selectedData', selectedData);

      if (!selectedData) {
        console.error('No Selected data found in Found');
        return;
      }

      if (!userDataString) {
        console.error('No user data found in Found');
        return;
      }

      const userData = userDataString;
      const commonDetailsData = commonDetails;
      console.log('userData', userData);
      console.log('commonDetailsData', commonDetailsData);

      if (!userData.companY_ID || !commonDetailsData.naturE_ID) {
        console.error('Company ID and natureId is missing from user data');
        return;
      }

      const response = await api.get(API_ENDPOINTS.DataEntryList, {
        params: {
          Company_Id: userData.companY_ID,
          nature_id: selectedData.value,
          Location_Id: commonDetailsData.locatioN_ID,
        },
      });

      console.log('response1111', response.data);
      if (response.data.status == 'success') {
        setBatchData(response.data.data.summarry);
      } else {
        setResponseMessage(response.data?.message || 'Something went wrong');
        setVisible(true);
        setModalType('error');
        setBatchData([]);
      }
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isFocused) {
      getDashboardData();
    }
  }, [isFocused]);

  const renderBatchItem = ({item}) => (
    <View>
      <TouchableOpacity
        style={styles.accordionHeader}
        onPress={() =>
          setExpanded(expanded === item.lob_id ? null : item.lob_id)
        }>
        <Text style={styles.accordionTitle}>{item.line_of_business}</Text>
        <Icon
          name={expanded === item.lob_id ? 'chevron-up' : 'chevron-down'}
          size={16}
          color="black"
          style={styles.icon}
        />
      </TouchableOpacity>
      {expanded === item.lob_id && (
        <View>
          <View style={styles.tableHeader}>
            <Text style={styles.headerText}>Batch No.</Text>
            <Text style={styles.headerText}>Start Date</Text>
            <Text style={styles.headerText}>Last Entry Date</Text>
            <Text style={styles.headerText}>Status</Text>
          </View>
          {item.batches.map(section => (
            <View key={section.batch_id} style={styles.tableContainer}>
              <TouchableOpacity
                onPress={() =>
                  navigate('editDataEntry', {
                    batch_id: section.batch_id,
                  })
                }>
                <View style={styles.tableRow}>
                  <Text style={styles.rowText}>{section.batch_no}</Text>
                  <Text style={styles.rowText}>{section.start_date}</Text>
                  <Text style={styles.rowText}>{section.last_entry_date}</Text>
                  <Text style={styles.rowText}>{section.status}</Text>
                  <TouchableOpacity
                    onPress={() =>
                      navigate('editDataEntry', {
                        batch_id: section.batch_id,
                      })
                    }>
                    <Icon
                      name="chevron-right"
                      size={16}
                      color={COLORS.SecondaryColor}
                    />
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}
    </View>
  );

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#2E313F'}}>
      <Animated.View style={styles.container}>
        {/* Status Bar */}
        <StatusBar barStyle="light-content" backgroundColor="#2E313F" />

        {/* Header Component */}
        <Header
          title="Data Entry Summary"
          onFilterPress={() => navigation.openDrawer()}
        />
        {/* Main Tabs */}
        <View style={styles.tabsContainer}>
          {mainTabs.map(tab => (
            <TouchableOpacity
              style={styles.tabContainer}
              key={tab}
              onPress={() => setActiveMainTab(tab)}>
              <Text
                style={[styles.tab, activeMainTab === tab && styles.activeTab]}>
                {tab}
              </Text>
              {activeMainTab === tab && <View style={styles.activeTabBorder} />}
            </TouchableOpacity>
          ))}
        </View>
        <View style={{flex: 1}}>
          {activeMainTab === 'Data Entry' && (
            <FlatList
              contentContainerStyle={styles.flatListContainer}
              data={batchData}
              renderItem={renderBatchItem}
              keyExtractor={item => item.lob_id.toString()}
            />
          )}
          {activeMainTab === 'Data Entry History' && <LinkedDropdowns />}
        </View>
      </Animated.View>
      <StatusModal
        visible={visible}
        onClose={() => setVisible(false)}
        message={responseMessage}
        type={modalType}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#fff'},
  tabsContainer: {
    backgroundColor: COLORS.primaryColor,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  tabContainer: {
    width: '50%',
    alignItems: 'center',
    paddingVertical: 10,
    position: 'relative',
  },
  tab: {padding: 10, fontSize: 16, color: '#fff', textAlign: 'center'},
  activeTab: {
    color: COLORS.SecondaryColor,
  },
  activeTabBorder: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: COLORS.SecondaryColor,
  },
  accordionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#eee',
    padding: 10,
    marginTop: 10,
  },
  accordionTitle: {fontSize: 18, fontWeight: 'bold'},
  icon: {marginLeft: 10},
  tableContainer: {
    marginTop: 10,
    borderRadius: 5,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#ddd',
    padding: 10,
    justifyContent: 'space-between',
  },
  headerText: {fontWeight: 'bold', flex: 1, textAlign: 'center'},
  tableRow: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rowText: {flex: 1, textAlign: 'center'},
  flatListContainer: {
    flexGrow: 1,
  },
});

export default DataEntryScreen;
