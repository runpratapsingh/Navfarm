import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  StatusBar,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {useNavigation} from '@react-navigation/native';
import Header from '../../../components/HeaderComp';
import {COLORS} from '../../../theme/theme';
import {appStorage} from '../../../utils/services/StorageHelper';
import api from '../../../Apiconfig/ApiconfigWithInterceptor';
import {API_ENDPOINTS} from '../../../Apiconfig/Apiconfig';
import {navigate} from '../../../utils/services/NavigationService';

const mainTabs = ['Data Entry', 'Data Entry History'];

const DataEntryScreen = () => {
  const navigation = useNavigation();
  const [activeMainTab, setActiveMainTab] = useState('Data Entry');
  const [expanded, setExpanded] = useState(null);
  const [loading, setLoading] = useState(false);
  const [batchData, setBatchData] = useState([]);

  const getDashboardData = async () => {
    try {
      setLoading(true);
      const userDataString = await appStorage.getUserData();
      const commonDetails = await appStorage.getCommonDetails();

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
          nature_id: commonDetailsData.naturE_ID,
          Location_Id: commonDetailsData.locatioN_ID,
        },
      });

      console.log('response1111', response.data.data.summarry);
      setBatchData(response.data.data.summarry);
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getDashboardData();
  }, []);

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
                  <Icon name="edit" size={16} color="blue" />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Status Bar */}
      <StatusBar
        barStyle="light-content"
        backgroundColor={COLORS.primaryColor}
      />

      {/* Header Component */}
      <Header onFilterPress={() => navigation.openDrawer()} />
      {/* Main Tabs */}
      <View style={styles.tabsContainer}>
        {mainTabs.map(tab => (
          <TouchableOpacity key={tab} onPress={() => setActiveMainTab(tab)}>
            <Text
              style={[styles.tab, activeMainTab === tab && styles.activeTab]}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {activeMainTab === 'Data Entry' && (
        <FlatList
          data={batchData}
          renderItem={renderBatchItem}
          keyExtractor={item => item.lob_id.toString()}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#fff'},
  tabsContainer: {
    backgroundColor: COLORS.primaryColor,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  tab: {padding: 10, fontSize: 16, color: '#fff'},
  activeTab: {
    borderBottomWidth: 3,
    borderBottomColor: COLORS.SecondaryColor,
    color: '#fff',
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
    borderWidth: 1,
    borderColor: '#ccc',
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
});

export default DataEntryScreen;
