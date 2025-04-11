import React from 'react';
import {View, Text, ScrollView, Dimensions, StyleSheet} from 'react-native';
import {PieChart} from 'react-native-chart-kit';
import Header from '../../../components/HeaderComp';
import {useNavigation} from '@react-navigation/native';

const screenWidth = Dimensions.get('window').width;

const metrics = [
  {label: 'CB Output', value: '0'},
  {label: 'Egg Cost', value: '0.00'},
  {label: 'M DOC Cost', value: '0.00'},
  {label: 'F DOC Cost', value: '0.00'},
  {label: 'LA. FCR', value: '0.00'},
  {label: 'CB. FCR', value: '0.00'},
  {label: 'Bird Cost', value: '0.00'},
  {label: 'Mortality', value: '0'},
  {label: 'CULL', value: '1100'},
  {label: 'Feed (Kg)', value: '42.00'},
  {label: 'Running Cost (K)', value: '2862'},
  {label: 'Sales (K)', value: '111.00'},
];

const runningCostData = [
  {
    name: 'delhi A',
    population: 105200,
    color: '#A5F2A8',
    legendFontColor: '#7F7F7F',
    legendFontSize: 12,
  },
  {
    name: 'delhi B',
    population: 300000,
    color: '#FFA726',
    legendFontColor: '#7F7F7F',
    legendFontSize: 12,
  },
  {
    name: 'Noida 01',
    population: 2502000,
    color: '#42A5F5',
    legendFontColor: '#7F7F7F',
    legendFontSize: 12,
  },
  {
    name: 'NOIDA2',
    population: 0,
    color: '#EC407A',
    legendFontColor: '#7F7F7F',
    legendFontSize: 12,
  },
];

const outputData = [
  {
    name: 'delhi A',
    population: 10,
    color: '#A5F2A8',
    legendFontColor: '#7F7F7F',
    legendFontSize: 12,
  },
  {
    name: 'Noida 01',
    population: 141,
    color: '#42A5F5',
    legendFontColor: '#7F7F7F',
    legendFontSize: 12,
  },
];

const DashboardScreen = () => {
  const navigation = useNavigation();
  return (
    <>
      <Header title="Dashboard" onFilterPress={() => navigation.openDrawer()} />
      <ScrollView style={styles.container}>
        <View style={styles.cardsContainer}>
          {metrics.map((item, index) => (
            <View key={index} style={styles.card}>
              <Text style={styles.cardTitle}>{item.label}</Text>
              <Text style={styles.cardValue}>{item.value}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.chartTitle}>Location wise Running Cost</Text>
        <PieChart
          data={runningCostData}
          width={screenWidth - 20}
          height={220}
          chartConfig={chartConfig}
          accessor="population"
          backgroundColor="transparent"
          paddingLeft="15"
          absolute
        />

        <Text style={styles.chartTitle}>Location wise Output</Text>
        <PieChart
          data={outputData}
          width={screenWidth - 20}
          height={220}
          chartConfig={chartConfig}
          accessor="population"
          backgroundColor="transparent"
          paddingLeft="15"
          absolute
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
  cardsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: '48%',
    backgroundColor: '#16a085',
    padding: 15,
    borderRadius: 10,
    marginVertical: 6,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  cardTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  cardValue: {
    color: '#fff',
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
});

export default DashboardScreen;
