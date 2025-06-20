import React, {memo} from 'react';
import {View, Text, ScrollView, Dimensions, StyleSheet} from 'react-native';
import {BarChart} from 'react-native-gifted-charts';
import {CHART_COLORS} from '../utils/JSON/ChartColors';

const COLORS = CHART_COLORS;

const UserFriendlyBatchComparisonChart = ({batches}) => {
  if (!batches || batches.length === 0) {
    return <Text>No data available</Text>;
  }

  const screenWidth = Dimensions.get('window').width - 32;
  const numericFields = React.useMemo(() => {
    return Object.keys(batches[0]).filter(
      key => typeof batches[0][key] === 'number',
    );
  }, [batches]);

  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.legendContainer}>
        {batches.map((batch, index) => (
          <View key={index} style={styles.legendItem}>
            <View
              style={[
                styles.legendColor,
                {backgroundColor: COLORS[index % COLORS.length]},
              ]}
            />
            <Text>{batch.BATCH_NO}</Text>
          </View>
        ))}
      </View>

      {numericFields.map(field => {
        const maxValue = Math.max(...batches.map(b => b[field])) + 10;

        return (
          <View key={field} style={styles.chartContainer}>
            <Text style={styles.fieldText}>{field}</Text>
            <BarChart
              width={screenWidth}
              height={140}
              noOfSections={4}
              barBorderRadius={8}
              barWidth={Math.max(20, screenWidth / (batches.length * 2))}
              maxValue={maxValue}
              data={batches.map((batch, index) => ({
                value: batch[field],
                frontColor: COLORS[index % COLORS.length],
                label: batch.BATCH_NO,
                spacing: 12,
                barWidth: 28,
                topLabelComponent: () => (
                  <Text style={styles.topLabel}>{batch[field]}</Text>
                ),
              }))}
              xAxisLabelTextStyle={styles.xAxisLabel}
              yAxisTextStyle={styles.yAxisLabel}
            />
          </View>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    paddingVertical: 16,
  },
  legendContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: 5,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
    marginBottom: 6,
  },
  legendColor: {
    width: 12,
    height: 12,
    marginRight: 6,
  },
  chartContainer: {
    marginBottom: 30,
  },
  fieldText: {
    fontWeight: '600',
    marginBottom: 6,
  },
  topLabel: {
    fontSize: 10,
    textAlign: 'center',
  },
  xAxisLabel: {
    fontSize: 10,
  },
  yAxisLabel: {
    fontSize: 10,
  },
});

export default memo(UserFriendlyBatchComparisonChart);
