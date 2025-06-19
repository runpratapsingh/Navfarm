import React, {useState, useMemo} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {COLORS, FONTFAMILY} from '../theme/theme';

const TableComponent = ({data}) => {
  console.log('shjhfjkshfkjahfjkasf', data);

  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: 'ascending',
  });
  const itemsPerPage = 10;

  const tableHeaders =
    data.length > 0 ? Object.keys(data[0]).map(key => ({key, label: key})) : [];

  const handleSort = key => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({key, direction});
  };

  const sortedData = useMemo(() => {
    if (!sortConfig.key) return data;

    return [...data].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });
  }, [data, sortConfig]);

  const totalPages = Math.ceil(sortedData.length / itemsPerPage);

  const getPaginatedData = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedData.slice(startIndex, startIndex + itemsPerPage);
  };

  const handlePageChange = page => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView horizontal>
        <View>
          <View style={[styles.tableRow, styles.tableHeaderRow]}>
            {tableHeaders.map((header, index) => (
              <TouchableOpacity
                key={index}
                style={styles.tableHeaderCell}
                onPress={() => handleSort(header.key)}>
                <Text style={styles.tableHeaderText}>
                  {header.label}{' '}
                  {sortConfig.key === header.key &&
                    (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          {getPaginatedData().map((row, rowIndex) => (
            <View
              key={rowIndex}
              style={[
                styles.tableRow,
                rowIndex % 2 === 0 ? styles.evenRow : styles.oddRow,
              ]}>
              {tableHeaders.map((header, colIndex) => (
                <View key={colIndex} style={styles.tableCell}>
                  <Text style={styles.tableCellText}>{row[header.key]}</Text>
                </View>
              ))}
            </View>
          ))}
        </View>
      </ScrollView>
      <View style={styles.paginationContainer}>
        <TouchableOpacity
          style={[
            styles.paginationButton,
            currentPage === 1 && styles.paginationButtonDisabled,
          ]}
          onPress={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}>
          <Text style={styles.paginationButtonText}>Previous</Text>
        </TouchableOpacity>
        <Text style={styles.paginationText}>
          Page {currentPage} of {totalPages}
        </Text>
        <TouchableOpacity
          style={[
            styles.paginationButton,
            currentPage === totalPages && styles.paginationButtonDisabled,
          ]}
          onPress={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}>
          <Text style={styles.paginationButtonText}>Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 16,
  },
  tableRow: {
    flexDirection: 'row',
  },
  tableHeaderRow: {
    backgroundColor: COLORS.SecondaryColor,
  },
  tableHeaderCell: {
    width: 140,
    padding: 10,
  },
  tableHeaderText: {
    fontFamily: FONTFAMILY.semibold,
    textAlign: 'center',
    color: '#fff',
  },
  tableCell: {
    width: 140,
    padding: 10,
  },
  tableCellText: {
    textAlign: 'center',
    fontFamily: FONTFAMILY.regular,
  },
  evenRow: {
    backgroundColor: '#fff',
  },
  oddRow: {
    backgroundColor: `${COLORS.SecondaryColor}20`,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginVertical: 16,
  },
  paginationButton: {
    padding: 8,
    marginHorizontal: 8,
    backgroundColor: COLORS.SecondaryColor,
    borderRadius: 4,
  },
  paginationButtonDisabled: {
    backgroundColor: '#ccc', // Change this to your desired disabled color
    borderWidth: 1,
    borderColor: '#999', // Change this to your desired border color
  },
  paginationButtonText: {
    color: '#000',
    fontFamily: FONTFAMILY.semibold,
  },
  paginationText: {
    marginHorizontal: 8,
    fontFamily: FONTFAMILY.regular,
  },
});

export default TableComponent;
