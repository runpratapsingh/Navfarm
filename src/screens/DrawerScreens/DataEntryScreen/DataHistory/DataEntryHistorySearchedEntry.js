import React, {useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {COLORS} from '../../../../theme/theme';
import CustomInput from '../../../../components/CustumInputField';

const DataEntryHistorySearchedEntry = () => {
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
  });

  const [tableData, setTableData] = useState([
    {postingDate: '2023-10-01', feed: 'Feed A', remark: 'IN0002'},
    {postingDate: '2023-10-02', feed: 'Feed B', remark: 'IN0003'},
    {postingDate: '2023-10-03', feed: 'Feed C', remark: 'IN0004'},
    // Add more data for testing pagination
    ...Array.from({length: 20}, (_, i) => ({
      postingDate: `2023-10-${String(i + 4).padStart(2, '0')}`,
      feed: `Feed ${String.fromCharCode(65 + i)}`,
      remark: `IN${String(1004 + i).padStart(4, '0')}`,
    })),
  ]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const updateFormState = (key, value) => {
    setFormState(prevState => ({
      ...prevState,
      [key]: value,
    }));
  };

  const totalPages = Math.ceil(tableData.length / itemsPerPage);

  const handlePageChange = page => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const getPaginatedData = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return tableData.slice(startIndex, startIndex + itemsPerPage);
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(
        <TouchableOpacity
          key={i}
          style={[
            styles.pageNumber,
            currentPage === i && styles.activePageNumber,
          ]}
          onPress={() => handlePageChange(i)}>
          <Text
            style={[
              styles.pageNumberText,
              currentPage === i && styles.activePageNumberText,
            ]}>
            {i}
          </Text>
        </TouchableOpacity>,
      );
    }
    return pageNumbers;
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
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
      </View>

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
          <CustomInput
            label="Posting Date"
            value={formState.postingDate}
            onChangeText={text => updateFormState('postingDate', text)}
            editable={false}
            style={styles.disabledInput}
          />
          {formState.showAdditionalFields && (
            <>
              <CustomInput
                label="Sub Location Name"
                value={formState.subLocationName}
                onChangeText={text => updateFormState('subLocationName', text)}
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
                onChangeText={text => updateFormState('openingQuantity', text)}
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

      {/* Table Section */}
      <View style={styles.tableContainer}>
        <View style={[styles.tableRow, styles.tableHeaderRow]}>
          <Text style={styles.tableHeader}>Posting Date</Text>
          <Text style={styles.tableHeader}>Feed</Text>
          <Text style={styles.tableHeader}>Remark</Text>
        </View>
        {getPaginatedData().map((item, index) => (
          <View
            style={[
              styles.tableRow,
              index % 2 === 0 ? styles.tableRowEven : styles.tableRowOdd,
            ]}
            key={index}>
            <Text style={styles.tableCell}>{item.postingDate}</Text>
            <Text style={styles.tableCell}>{item.feed}</Text>
            <Text style={styles.tableCell}>{item.remark}</Text>
          </View>
        ))}
      </View>

      {/* Pagination Controls */}
      <View style={styles.paginationContainer}>
        <TouchableOpacity
          style={[
            styles.paginationButton,
            currentPage === 1 && styles.disabledPaginationButton,
          ]}
          onPress={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}>
          <Text
            style={[
              styles.pageNumberText1,
              currentPage === 1 && styles.disabledPageNumberText,
            ]}>
            Previous
          </Text>
        </TouchableOpacity>
        <View style={styles.pageNumbersContainer}>{renderPageNumbers()}</View>
        <TouchableOpacity
          style={[
            styles.paginationButton,
            currentPage === totalPages && styles.disabledPaginationButton,
          ]}
          onPress={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}>
          <Text
            style={[
              styles.pageNumberText1,
              currentPage === totalPages && styles.disabledPageNumberText,
            ]}>
            Next
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    paddingBottom: 50,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 16,
  },
  headerText: {
    fontSize: 18,
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
    borderRadius: 8,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 16,
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
  tableContainer: {
    marginTop: 20,
    borderRadius: 8,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  tableHeaderRow: {
    backgroundColor: COLORS.SecondaryColor,
  },
  tableHeader: {
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
    color: '#fff',
  },
  tableCell: {
    flex: 1,
    textAlign: 'center',
  },
  tableRowEven: {
    backgroundColor: '#fff',
  },
  tableRowOdd: {
    backgroundColor: '#f9f9f9',
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  paginationButton: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: COLORS.SecondaryColor,
    borderWidth: 1,
    color: '#fff',
  },
  disabledPaginationButton: {
    opacity: 0.5,
  },
  pageNumbersContainer: {
    flexDirection: 'row',
  },
  pageNumber: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginHorizontal: 2,
    borderRadius: 5,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  activePageNumber: {
    backgroundColor: COLORS.SecondaryColor,
    borderColor: COLORS.SecondaryColor,
  },
  pageNumberText: {
    fontSize: 16,
    color: COLORS.SecondaryColor,
  },
  pageNumberText1: {
    fontSize: 16,
    color: '#fff',
  },
  disabledPageNumberText: {
    fontSize: 16,
    color: COLORS.SecondaryColor,
  },
  activePageNumberText: {
    fontSize: 16,
    color: '#fff',
  },
});

export default DataEntryHistorySearchedEntry;
