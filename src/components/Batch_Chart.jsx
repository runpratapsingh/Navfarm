// import React, {memo} from 'react';
// import {View, Text, ScrollView, Dimensions, StyleSheet} from 'react-native';
// import {BarChart} from 'react-native-gifted-charts';
// import {CHART_COLORS} from '../utils/JSON/ChartColors';

// const COLORS = CHART_COLORS;

// const UserFriendlyBatchComparisonChart = ({batches}) => {
//   if (!batches || batches.length === 0) {
//     return <Text>No data available</Text>;
//   }

//   const screenWidth = Dimensions.get('window').width - 32;
//   const numericFields = React.useMemo(() => {
//     return Object.keys(batches[0]).filter(
//       key => typeof batches[0][key] === 'number',
//     );
//   }, [batches]);

//   return (
//     <ScrollView style={styles.scrollView}>
//       <View style={styles.legendContainer}>
//         {batches.map((batch, index) => (
//           <View key={index} style={styles.legendItem}>
//             <View
//               style={[
//                 styles.legendColor,
//                 {backgroundColor: COLORS[index % COLORS.length]},
//               ]}
//             />
//             <Text>{batch.BATCH_NO}</Text>
//           </View>
//         ))}
//       </View>

//       {numericFields.map(field => {
//         const maxValue = Math.max(...batches.map(b => b[field])) + 10;

//         return (
//           <View key={field} style={styles.chartContainer}>
//             <Text style={styles.fieldText}>{field}</Text>
//             <BarChart
//               width={screenWidth}
//               height={140}
//               noOfSections={4}
//               barBorderRadius={8}
//               barWidth={Math.max(20, screenWidth / (batches.length * 2))}
//               maxValue={maxValue}
//               data={batches.map((batch, index) => ({
//                 value: batch[field],
//                 frontColor: COLORS[index % COLORS.length],
//                 label: batch.BATCH_NO,
//                 spacing: 12,
//                 barWidth: 28,
//                 topLabelComponent: () => (
//                   <Text style={styles.topLabel}>{batch[field]}</Text>
//                 ),
//               }))}
//               xAxisLabelTextStyle={styles.xAxisLabel}
//               yAxisTextStyle={styles.yAxisLabel}
//             />
//           </View>
//         );
//       })}
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   scrollView: {
//     paddingVertical: 16,
//   },
//   legendContainer: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     marginVertical: 5,
//   },
//   legendItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginRight: 12,
//     marginBottom: 6,
//   },
//   legendColor: {
//     width: 12,
//     height: 12,
//     marginRight: 6,
//   },
//   chartContainer: {
//     marginBottom: 30,
//   },
//   fieldText: {
//     fontWeight: '600',
//     marginBottom: 6,
//   },
//   topLabel: {
//     fontSize: 10,
//     textAlign: 'center',
//   },
//   xAxisLabel: {
//     fontSize: 10,
//   },
//   yAxisLabel: {
//     fontSize: 10,
//   },
// });

// export default memo(UserFriendlyBatchComparisonChart);

import React, {useState} from 'react';
import {
  ScrollView,
  View,
  Text,
  Dimensions,
  StyleSheet,
  Switch,
} from 'react-native';
import {BarChart} from 'react-native-gifted-charts';
import {CHART_COLORS} from '../utils/JSON/ChartColors';

const screenWidth = Dimensions.get('window').width;

const generateGroupedBars = (batches, selectedMetrics) => {
  const colors = CHART_COLORS;
  const groupedBars = [];

  selectedMetrics.forEach(({key, label}) => {
    batches.forEach((batch, index) => {
      const value = batch[key];
      const color = colors[index % colors.length];
      const bar = {
        value: typeof value === 'string' ? parseFloat(value) : value,
        frontColor: color,
        gradientColor: color + '88',
      };

      if (index === 0) {
        bar.label = label;
        bar.spacing = 4;
      }
      groupedBars.push(bar);
    });
  });

  return groupedBars;
};

const metricOptions = [
  {key: 'Age_in_WK', label: 'Age in Weeks'},
  {key: 'Mortality', label: 'Mortality'},
  {key: 'Age_in_days', label: 'Age in Days'},
  {key: 'PBFC', label: 'PBFC'},
  {key: 'Livability%', label: 'Livability'},
  {key: 'TOTAL_CULLS', label: 'Total Culls'},
  {key: 'FEED_COST', label: 'Feed Cost'},
  {key: 'Feed_Consumption', label: 'FCR'},
];

export default function BeautifulGroupedBarChart({batches}) {
  const [selectedMetrics, setSelectedMetrics] = useState([
    {key: 'Age_in_WK', label: 'Age in Weeks'},
    {key: 'Mortality', label: 'Mortality'},
  ]);

  console.log('batches', batches);

  const toggleMetric = metric => {
    setSelectedMetrics(prevSelectedMetrics => {
      if (prevSelectedMetrics.some(m => m.key === metric.key)) {
        return prevSelectedMetrics.filter(m => m.key !== metric.key);
      } else {
        return [...prevSelectedMetrics, metric];
      }
    });
  };

  const groupedBars = generateGroupedBars(batches, selectedMetrics);

  return (
    <ScrollView contentContainerStyle={styles.scrollViewContainer}>
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>🐣 Batch Performance Comparison</Text>

        <View style={styles.metricsContainer}>
          {metricOptions.map(metric => (
            <View key={metric.key} style={styles.metricToggle}>
              <Text>{metric.label}</Text>
              <Switch
                value={selectedMetrics.some(m => m.key === metric.key)}
                onValueChange={() => toggleMetric(metric)}
              />
            </View>
          ))}
        </View>

        <View style={styles.dividerStyle}></View>

        <View style={styles.legendContainer}>
          {batches.map((batch, index) => (
            <View key={index} style={styles.legendItem}>
              <View
                style={[
                  styles.legendColor,
                  {backgroundColor: CHART_COLORS[index % CHART_COLORS.length]},
                ]}
              />
              <Text>{batch.BATCH_NO}</Text>
            </View>
          ))}
        </View>

        <BarChart
          data={groupedBars}
          barWidth={26}
          width={screenWidth - 60}
          spacing={40}
          isAnimated
          labelWidth={90}
          stepHeight={30}
          yAxisThickness={1}
          xAxisThickness={1}
          barMarginBottom={1}
          yAxisTextStyle={styles.yAxisText}
          xAxisLabelTextStyle={styles.xAxisLabelText}
          showValuesAsTopLabel={true}
          topLabelTextStyle={{color: 'black', fontSize: 8}}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollViewContainer: {
    flex: 1,
    paddingBottom: 40,
  },
  chartContainer: {
    // minWidth: screenWidth,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginVertical: 10,
    textAlign: 'center',
  },
  metricsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  metricToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,
    // marginBottom: 10,
  },
  yAxisText: {
    color: '#555',
    fontSize: 12,
  },
  xAxisLabelText: {
    color: '#777',
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'left',
  },
  legendContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: screenWidth - 32,
    marginBottom: 10,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,
    marginBottom: 10,
  },
  legendColor: {
    width: 14,
    height: 14,
    borderRadius: 4,
    marginRight: 6,
  },

  dividerStyle: {
    height: 1,
    backgroundColor: '#ccc',
    marginBottom: 10,
  },
});
