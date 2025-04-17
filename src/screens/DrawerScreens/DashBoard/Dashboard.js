import React, {useEffect, useCallback, useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  Dimensions,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import {PieChart} from 'react-native-chart-kit';
import Header from '../../../components/HeaderComp';
import {useNavigation} from '@react-navigation/native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withDelay,
} from 'react-native-reanimated';
import {appStorage} from '../../../utils/services/StorageHelper';
import api from '../../../Apiconfig/ApiconfigWithInterceptor';
import {API_ENDPOINTS} from '../../../Apiconfig/Apiconfig';
import {CHART_COLORS} from '../../../utils/JSON/ChartColors';

const screenWidth = Dimensions.get('window').width;

// Function to get a unique color
const getUniqueColor = index => CHART_COLORS[index % CHART_COLORS.length];

// Memoized Card component
const MetricCard = React.memo(({item, index, delay}) => {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(20);

  useEffect(() => {
    // Stagger animation based on index
    opacity.value = withDelay(
      delay + index * 100,
      withTiming(1, {duration: 400}),
    );
    translateY.value = withDelay(
      delay + index * 100,
      withTiming(0, {duration: 400}),
    );
  }, [opacity, translateY, index, delay]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{translateY: translateY.value}],
  }));

  return (
    <Animated.View style={[styles.card, animatedStyle]}>
      <Text style={styles.cardTitle}>{item.label}</Text>
      <Text style={styles.cardValue}>{item.value}</Text>
      <View
        style={{
          height: 1,
          backgroundColor: '#FFFFFF',
          width: '100%',
          marginTop: 6,
        }}
      />
    </Animated.View>
  );
});

// Legend component
const Legend = ({data}) => {
  return (
    <View style={styles.legendContainer}>
      {data.map((item, index) => (
        <View key={index} style={styles.legendItem}>
          <View style={[styles.legendDot, {backgroundColor: item.color}]} />
          <Text style={styles.legendLabel}>{item.name}</Text>
        </View>
      ))}
    </View>
  );
};

// Memoized PieChart component
const AnimatedPieChart = React.memo(({title, data, delay}) => {
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.8);

  useEffect(() => {
    opacity.value = withDelay(delay, withTiming(1, {duration: 500}));
    scale.value = withDelay(
      delay,
      withSequence(
        withTiming(1.05, {duration: 300}),
        withTiming(1, {duration: 200}),
      ),
    );
  }, [opacity, scale, delay]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{scale: scale.value}],
  }));

  const [isLoaded, setIsLoaded] = React.useState(false);

  // Simulate chart loading
  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <View>
      <Text style={styles.chartTitle}>{title}</Text>
      {isLoaded ? (
        <Animated.View style={animatedStyle}>
          <PieChart
            data={data}
            width={screenWidth - 20}
            height={250}
            chartConfig={chartConfig}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="15"
            absolute
            hasLegend={false}
          />
          <Legend data={data} /> {/* Render the legend below the chart */}
        </Animated.View>
      ) : (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#16a085" />
        </View>
      )}
    </View>
  );
});

const DashboardScreen = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [metrics, setMetrics] = useState([]);
  const [runningCostData, setRunningCostData] = useState([]);
  const [outputData, setOutputData] = useState([]);
  const [dataLoaded, setDataLoaded] = useState(false);

  const handleFilterPress = useCallback(() => {
    navigation.openDrawer();
  }, [navigation]);

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

      const response = await api.get(API_ENDPOINTS.DASHBOARD_DATA, {
        params: {
          company_id: userData.companY_ID,
          Nature_Id: selectedData.value,
          user_id: userData.useR_ID,
        },
      });

      console.log('response1111', response.data);
      if (response.data.status === 'success') {
        const apiData = response.data.data[0].data[0];
        const newMetrics = apiData.labels.map((label, index) => ({
          label,
          value: apiData.values[index],
        }));
        setMetrics(newMetrics);
      } else {
        // Handle error
      }
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getDashboardLocationRunningData = async () => {
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

      const response = await api.get(API_ENDPOINTS.LocationRunningCostGraph, {
        params: {
          company_id: userData.companY_ID,
          Nature_Id: selectedData.value,
          user_id: userData.useR_ID,
        },
      });

      console.log('Running graph data', response.data);
      if (response.data.status === 'success') {
        const runningData = JSON.parse(response.data.data.result);
        const newRunningCostData = runningData.map((item, index) => ({
          name: item.LOCATION_NAME,
          population: item.RUNNING_COST,
          color: getUniqueColor(index),
          legendFontColor: '#7F7F7F',
          legendFontSize: 12,
        }));
        setRunningCostData(newRunningCostData);
      } else {
        // Handle error
      }
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getDashboardLocationOutputData = async () => {
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

      const response = await api.get(API_ENDPOINTS.LocationOutputGraph, {
        params: {
          company_id: userData.companY_ID,
          Nature_Id: selectedData.value,
          user_id: userData.useR_ID,
        },
      });

      console.log('Output graph data', response.data);
      if (response.data.status === 'success') {
        const outputData = JSON.parse(response.data.data.result);
        const newOutputData = outputData.map((item, index) => ({
          name: item.LOCATION_NAME,
          population: item.OUT_PUT,
          color: getUniqueColor(index),
          legendFontColor: '#7F7F7F',
          legendFontSize: 12,
        }));
        setOutputData(newOutputData);
        setDataLoaded(true); // Set dataLoaded to true after data is fetched
      } else {
        // Handle error
      }
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const fetchData = async () => {
    try {
      await Promise.all([
        getDashboardData(),
        getDashboardLocationRunningData(),
        getDashboardLocationOutputData(),
      ]);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <Header title="Dashboard" onFilterPress={handleFilterPress} />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <View style={styles.cardsContainer}>
          {metrics.map((item, index) => (
            <MetricCard
              key={item.label}
              item={item}
              index={index}
              delay={dataLoaded ? 0 : 1000}
            />
          ))}
        </View>

        <AnimatedPieChart
          title="Location wise Running Cost"
          data={runningCostData}
          delay={dataLoaded ? metrics.length * 100 + 200 : 1000} // After cards
        />

        <AnimatedPieChart
          title="Location wise Output"
          data={outputData}
          delay={dataLoaded ? metrics.length * 100 + 400 : 1000} // Slightly after first chart
        />
      </ScrollView>
    </>
  );
};

const chartConfig = {
  backgroundGradientFrom: '#fff',
  backgroundGradientTo: '#fff',
  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  labelColor: () => '#333',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#F2F2F2',
  },
  scrollContent: {
    paddingBottom: 20,
  },
  cardsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: '48%',
    backgroundColor: '#20B2AA',
    padding: 15,
    marginVertical: 6,
  },
  cardTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  cardValue: {
    color: '#000',
    fontSize: 18,
    fontWeight: '600',
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 25,
    marginBottom: 10,
    paddingHorizontal: 5,
  },
  loaderContainer: {
    height: 220,
    justifyContent: 'center',
    alignItems: 'center',
  },
  legendContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 10,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 5,
    marginVertical: 2,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 5,
  },
  legendLabel: {
    fontSize: 12,
    color: '#333',
  },
});

export default DashboardScreen;
