import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  StatusBar,
  Animated,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import Header from '../../../components/HeaderComp';
import {COLORS, FONTFAMILY} from '../../../theme/theme';
import {appStorage} from '../../../utils/services/StorageHelper';
import {API_ENDPOINTS} from '../../../Apiconfig/Apiconfig';
import {navigate} from '../../../utils/services/NavigationService';
import LinkedDropdowns from './DataHistory/DataEntryHistory';
import {SafeAreaView} from 'react-native-safe-area-context';
import StatusModal from '../../../components/CustumModal';
import {
  fetchDataEntryDetails,
  fetchData,
} from '../../../services/ApiServices/DataEntryAPiserviceForOffline';
import {checkNetworkStatus} from '../../../services/NetworkServices/Network';

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

  const preFetchBatchDetails = async (batchData, baseParams) => {
    try {
      for (const batchGroup of batchData) {
        for (const batch of batchGroup.batches) {
          const params = {
            ...baseParams,
            batch_id: batch.batch_id,
          };
          await fetchDataEntryDetails(
            API_ENDPOINTS.DataEntryDetails,
            params,
            batch.batch_id,
          );
        }
      }
    } catch (error) {
      console.error('Error pre-fetching batch details:', error.message);
    }
  };

  const getDashboardData = async () => {
    try {
      setLoading(true);
      const userDataString = await appStorage.getUserData();
      const commonDetails = await appStorage.getCommonDetails();
      const selectedData = await appStorage.getSelectedCategory();

      if (!selectedData) {
        setResponseMessage('No selected data found');
        setModalType('error');
        setVisible(true);
        return;
      }

      if (!userDataString) {
        setResponseMessage('No user data found');
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
        nature_id: selectedData.value,
        Location_Id: commonDetailsData.locatioN_ID,
      };

      const data = await fetchData(API_ENDPOINTS.DataEntryList, params);

      if (data.status === 'success') {
        checkNetworkStatus(async isConnected => {
          if (isConnected) {
            await preFetchBatchDetails(data.data.summarry, params);
          }
        });
        console.log('Data fetched successfully:', data.data.summarry);

        setBatchData(data.data.summarry);
      } else {
        setResponseMessage(data?.message || 'Something went wrong');
        setModalType('error');
        setVisible(true);
        setBatchData([]);
      }
    } catch (error) {
      console.error('Error fetching data entry list:', error.message);
      setResponseMessage(
        error.message === 'No cached data available'
          ? 'No data available offline. Please connect to the internet.'
          : 'Failed to load data. Showing cached data if available.',
      );
      setModalType('warning');
      setVisible(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isFocused) {
      getDashboardData();
    }
  }, [isFocused]);

  const renderBatchItem = ({item}) => {
    const formatDate = dateStr => {
      if (!dateStr) return '';
      const parts = dateStr.split('-'); // ["01", "Feb", "2023"]
      if (parts.length !== 3) return dateStr;
      const [day, month, year] = parts;
      return `${day}/${month}/${year.slice(2)}`; // "01/Feb/23"
    };

    return (
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
                    <Text style={styles.rowText}>
                      {section.batch_no.slice(0, 6)}
                    </Text>
                    <Text style={styles.rowText}>
                      {formatDate(section.start_date)}
                    </Text>
                    <Text style={styles.rowText}>
                      {formatDate(section.last_entry_date)}
                    </Text>

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
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#2E313F'}}>
      <Animated.View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#2E313F" />
        <Header
          title="Data Entry Summary"
          onFilterPress={() => navigation.openDrawer()}
        />
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
              ListEmptyComponent={
                loading ? (
                  <Text style={styles.loadingText}>Loading...</Text>
                ) : (
                  <Text style={styles.emptyText}>No data available</Text>
                )
              }
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
  tab: {
    padding: 10,
    fontSize: 16,
    fontFamily: FONTFAMILY.semibold,
    color: '#fff',
    textAlign: 'center',
  },
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
  accordionTitle: {
    fontSize: 18,
    fontFamily: FONTFAMILY.bold
  },
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
  headerText: {
    fontFamily: FONTFAMILY.bold,
    flex: 1,
    textAlign: 'center'
  },
  tableRow: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rowText: {
    flex: 1,
    fontSize: 13,
    fontFamily: FONTFAMILY.regular,
    textAlign: 'center',
  },
  flatListContainer: {
    flexGrow: 1,
  },
  loadingText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#333',
    fontFamily: FONTFAMILY.regular,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#333',
    fontFamily: FONTFAMILY.regular,
  },
});

export default DataEntryScreen;
