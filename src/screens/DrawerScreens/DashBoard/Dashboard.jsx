import React, {useEffect, useCallback, useState, useRef} from 'react';
import {
  View,
  Text,
  ScrollView,
  Dimensions,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
// import {PieChart} from 'react-native-chart-kit';
import {BarChart, LineChart, PieChart} from 'react-native-gifted-charts';

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
import {API_ENDPOINTS} from '../../../Apiconfig/Apiconfig';
import {CHART_COLORS} from '../../../utils/JSON/ChartColors';
import {fetchData} from '../../../services/ApiServices/Apiservice';
import {COLORS, FONTFAMILY} from '../../../theme/theme';
import CustomDropdown from '../../../components/DataEntryHistoryCustumDropdown';

const screenWidth = Dimensions.get('window').width;

// Function to get a unique color
const getUniqueColor = index => CHART_COLORS[index % CHART_COLORS.length];

// Memoized Card component
const MetricCard = React.memo(({item, index, delay}) => {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(20);

  useEffect(() => {
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

// Legend Component
const Legend = ({data, onLegendPress}) => (
  <View style={styles.legendContainer}>
    {data.map((item, index) =>
      item.population !== 0 ? (
        <TouchableOpacity
          key={index}
          style={styles.legendItem}
          onPress={() => onLegendPress(index)}>
          <View style={[styles.legendDot, {backgroundColor: item.color}]} />
          <Text style={styles.legendLabel}>
            {`${item.name} (${item.population})`}
          </Text>
        </TouchableOpacity>
      ) : null,
    )}
  </View>
);

// Function to determine which abbreviations are used in the chart data
const determineUsedAbbreviations = data => {
  let hasK = false,
    hasM = false,
    hasB = false;

  console.log('Data for abbreviation check:', data);

  data.forEach(item => {
    const value = item.value;

    if (value >= 1_000_000_000) hasB = true;
    else if (value >= 1_000_000) hasM = true;
    else if (value >= 1_000) hasK = true;
  });

  return {hasK, hasM, hasB};
};

// Legend component that conditionally renders based on used abbreviations
const AbbreviationLegend = ({hasK, hasM, hasB}) => (
  <View style={styles.abbreviationLegendContainer}>
    {hasK && <Text style={styles.abbreviationLegendText}>K - Thousand</Text>}
    {hasM && <Text style={styles.abbreviationLegendText}>M - Million</Text>}
    {hasB && <Text style={styles.abbreviationLegendText}>B - Billion</Text>}
  </View>
);

// AnimatedPieChart Component
const AnimatedPieChart = React.memo(({title, data, delay}) => {
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.8);

  const pieData = data.map(item => ({
    value: item.population,
    color: item.color,
    tooltipText: `${item.name} (${item.population})`,
  }));

  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(undefined);
  const [tooltipSelectedIndex, setTooltipSelectedIndex] = useState(undefined);

  const timeoutRef = useRef(null);

  useEffect(() => {
    opacity.value = withDelay(delay, withTiming(1, {duration: 500}));
    scale.value = withDelay(
      delay,
      withSequence(
        withTiming(1.05, {duration: 300}),
        withTiming(1, {duration: 200}),
      ),
    );
  }, [delay]);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{scale: scale.value}],
  }));

  const handleLegendPress = index => {
    setSelectedIndex(index);
    setTooltipSelectedIndex(index);

    // Reset any previous timer
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    // Remove focus + tooltip after 10s
    timeoutRef.current = setTimeout(() => {
      setSelectedIndex(undefined);
      setTooltipSelectedIndex(undefined);
    }, 10000);
  };
  // Transforming data for line chart
  const lineData = data.map(item => ({
    value: item.population,
    label: item.name,
  }));

  const {hasK, hasM, hasB} = determineUsedAbbreviations(lineData);

  return (
    <View>
      <Text style={styles.chartTitle}>{title}</Text>
      <AbbreviationLegend hasK={hasK} hasM={hasM} hasB={hasB} />

      {isLoaded ? (
        <Animated.View style={[animatedStyle, styles.chartContainer]}>
          {/* <PieChart
            data={pieData}
            showText
            textColor="black"
            radius={150}
            textSize={8}
            focusOnPress
            selectedIndex={selectedIndex}
            setSelectedIndex={setSelectedIndex}
            tooltipSelectedIndex={tooltipSelectedIndex}
            setTooltipSelectedIndex={setTooltipSelectedIndex}
            showTooltip
            showValuesAsTooltipText
            tooltipDuration={10000} // Match with legend timeout
            tooltipBackgroundColor="#eee"
            tooltipBorderRadius={10}
          /> */}
          {/* <LineChart
            data={lineData}
            showText
            textColor="black"
            width={screenWidth - 40} // Adjust width as necessary
            height={220}
            hideRules
            hideYAxisText
            isAnimated
            yAxisLabelSuffix="k"
            color="#000"
          /> */}
          <BarChart
            data={lineData}
            // barWidth={50}
            width={screenWidth - 70}
            spacing={30}
            // isAnimated
            // labelWidth={90}
            stepHeight={35}
            maxValue={Math.max(...lineData.map(item => item.value))}
            yAxisThickness={1}
            xAxisThickness={1}
            yAxisTextStyle={styles.yAxisText}
            xAxisLabelTextStyle={styles.xAxisLabelText}
            showValuesAsTopLabel={true}
            topLabelTextStyle={{color: 'black', fontSize: 8}}
            frontColor="#20B2AA"
            formatYLabel={value => {
              if (value >= 1_000_000_000)
                return `${(value / 1_000_000_000).toFixed(1)}B`;
              if (value >= 1_000_000)
                return `${(value / 1_000_000).toFixed(1)}M`;
              if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`;
              return value.toString();
            }}
            yAxisLabelWidth={40}
          />
          {/* <Legend data={data} onLegendPress={handleLegendPress} /> */}
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
  const [singleSelectedValue, setSingleSelectedValue] = useState('1');

  const options = [
    {id: '1', name: 'Hatching'},
    {id: '2', name: 'Feed'},
    {id: '3', name: 'C. Broiler'},
    {id: '4', name: 'B & L'},
  ];

  const handleFilterPress = useCallback(() => {
    navigation.openDrawer();
  }, [navigation]);

  const getDashboardData = async () => {
    try {
      setLoading(true);
      const userDataString = await appStorage.getUserData();
      const commonDetails = await appStorage.getCommonDetails();
      const selectedData = await appStorage.getSelectedCategory();

      if (!selectedData) {
        console.error('No selected data found');
        return;
      }

      if (!userDataString) {
        console.error('No user data found');
        return;
      }

      const userData = userDataString;
      const commonDetailsData = commonDetails;

      if (!userData.companY_ID || !commonDetailsData.naturE_ID) {
        console.error('Company ID or natureId is missing');
        return;
      }

      const params = {
        company_id: userData.companY_ID,
        Nature_Id: selectedData.value,
        user_id: userData.useR_ID,
      };

      const data = await fetchData(API_ENDPOINTS.DASHBOARD_DATA, params);
      console.log('jhdajkhdjhdk', data.status, data.status == 'success');

      if (data.status == 'success') {
        const apiData = data.data[0].data[0];
        const newMetrics = apiData.labels.map((label, index) => ({
          label,
          value: apiData.values[index],
        }));
        setMetrics(newMetrics);
      } else {
        console.error('API response status not success');
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error.message);
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

      if (!selectedData) {
        console.error('No selected data found');
        return;
      }

      if (!userDataString) {
        console.error('No user data found');
        return;
      }

      const userData = userDataString;
      const commonDetailsData = commonDetails;

      if (!userData.companY_ID || !commonDetailsData.naturE_ID) {
        console.error('Company ID or natureId is missing');
        return;
      }

      const params = {
        company_id: userData.companY_ID,
        Nature_Id: selectedData.value,
        user_id: userData.useR_ID,
      };

      const data = await fetchData(
        API_ENDPOINTS.LocationRunningCostGraph,
        params,
      );

      console.log('jhdajkhdjhdk11111', data, data.status == 'success');

      if (data.status === 'success') {
        const runningData = JSON.parse(data.data.result);
        const newRunningCostData = runningData.map((item, index) => ({
          name: item.LOCATION_NAME,
          population: item.RUNNING_COST,
          color: getUniqueColor(index),
          legendFontColor: '#7F7F7F',
          legendFontSize: 12,
        }));
        setRunningCostData(newRunningCostData);
      } else {
        console.error('API response status not success');
      }
    } catch (error) {
      console.error('Error fetching running cost data:', error.message);
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

      if (!selectedData) {
        console.error('No selected data found');
        return;
      }

      if (!userDataString) {
        console.error('No user data found');
        return;
      }

      const userData = userDataString;
      const commonDetailsData = commonDetails;

      if (!userData.companY_ID || !commonDetailsData.naturE_ID) {
        console.error('Company ID or natureId is missing');
        return;
      }

      const params = {
        company_id: userData.companY_ID,
        Nature_Id: selectedData.value,
        user_id: userData.useR_ID,
      };

      const data = await fetchData(API_ENDPOINTS.LocationOutputGraph, params);
      console.log('jhdajkhdjhdk22222', data, data.status == 'success');

      if (data.status === 'success') {
        const outputData = JSON.parse(data.data.result);
        const newOutputData = outputData.map((item, index) => ({
          name: item.LOCATION_NAME,
          population: item.OUT_PUT,
          color: getUniqueColor(index),
          legendFontColor: '#7F7F7F',
          legendFontSize: 12,
        }));
        setOutputData(newOutputData);
        setDataLoaded(true);
      } else {
        console.error('API response status not success');
      }
    } catch (error) {
      console.error('Error fetching output data:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllData = async () => {
    try {
      await Promise.all([
        getDashboardData(),
        getDashboardLocationRunningData(),
        getDashboardLocationOutputData(),
      ]);
    } catch (error) {
      console.error('Error fetching all data:', error);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  return (
    <>
      <Header title="Dashboard" onFilterPress={handleFilterPress} />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {loading && (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color="#16a085" />
          </View>
        )}

        <View style={{width: '100%', alignItems: 'flex-end', marginTop: 5}}>
          <View style={{width: '48%'}}>
            <CustomDropdown
              label="Select an option"
              selectedValue={singleSelectedValue}
              onValueChange={value => setSingleSelectedValue(value)}
              options={options}
              loading={false}
              showLabel={false}
            />
          </View>
        </View>

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

        <View>
          <AnimatedPieChart
            title="Location wise Running Cost"
            data={runningCostData}
            delay={dataLoaded ? metrics.length * 100 + 200 : 1000}
          />
        </View>

        <View>
          <AnimatedPieChart
            title="Location wise Output"
            data={outputData}
            delay={dataLoaded ? metrics.length * 100 + 400 : 1000}
          />
        </View>
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
    marginBottom: 5,
    fontFamily: FONTFAMILY.semibold,
  },
  cardValue: {
    color: '#000',
    fontSize: 14,
    fontFamily: FONTFAMILY.extraBold,
  },
  chartTitle: {
    fontSize: 18,
    fontFamily: FONTFAMILY.bold,
    marginTop: 25,
    marginBottom: 10,
    paddingHorizontal: 5,
    textAlign: 'left',
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
    fontFamily: FONTFAMILY.regular,
  },
  chartContainer: {
    alignItems: 'center',
  },
  yAxisText: {
    color: '#555',
    fontSize: 10,
  },
  xAxisLabelText: {
    color: '#777',
    fontSize: 10,
    fontWeight: '500',
    textAlign: 'left',
    paddingHorizontal: 5,
  },
  abbreviationLegendContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10, // Adjust as needed
    paddingHorizontal: 10,
  },
  abbreviationLegendText: {
    fontSize: 12,
    color: '#333',
    fontFamily: FONTFAMILY.regular,
  },
});

export default DashboardScreen;
