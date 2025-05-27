import React, {useState, useEffect, useMemo, useCallback} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {COLORS} from '../../../../theme/theme';
import CustomInput from '../../../../components/CustumInputField';

const {height, width} = Dimensions.get('window');
const DataEntryHistorySearchedEntry = ({data}) => {
  const [formState, setFormState] = useState({
    isHeaderVisible: false,
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

  const [tableData, setTableData] = useState([]);
  const [tableHeaders, setTableHeaders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: 'ascending',
  });
  const itemsPerPage = 10;

  useEffect(() => {
    if (data?.result?.length > 0) {
      const header = data.header[0];
      setFormState(prevState => ({
        ...prevState,
        natureOfBusiness: header?.naturE_OF_BUSINESS || '',
        lineOfBusiness: header?.linE_OF_BUSINESS || '',
        remainingQty: header?.remaininG_QTY?.toString() || '',
        breedName: header?.breeD_NAME || '',
        templateName: header?.templatE_NAME || '',
        postingDate: header?.p_DATE || '',
        subLocationName: header?.locatioN_NAME || '',
        ageDays: header?.agE_DAYS?.toString() || '',
        ageWeek: header?.agE_WEEK?.toString() || '',
        openingQuantity: header?.openinG_QTY?.toString() || '',
        startDate: header?.s_DATE || '',
        runningCost: header?.runninG_COST?.toString() || '',
        batch_No: header?.batcH_NO || '',
      }));

      const parsedTableData = JSON.parse(data.result);
      const headers = Object.keys(parsedTableData[0]).map(key => ({
        key,
        label: key,
      }));

      setTableHeaders(headers);
      setTableData(parsedTableData);
    }
  }, [data]);

  const updateFormState = useCallback((key, value) => {
    setFormState(prevState => ({
      ...prevState,
      [key]: value,
    }));
  }, []);

  const totalPages = useMemo(
    () => Math.ceil(tableData.length / itemsPerPage),
    [tableData.length],
  );

  const handlePageChange = useCallback(
    page => {
      if (page >= 1 && page <= totalPages) {
        setCurrentPage(page);
      }
    },
    [totalPages],
  );

  const handleSort = useCallback(
    key => {
      let direction = 'ascending';
      if (sortConfig.key === key && sortConfig.direction === 'ascending') {
        direction = 'descending';
      }
      setSortConfig({key, direction});
    },
    [sortConfig],
  );

  const sortedData = useMemo(() => {
    if (!sortConfig.key) return tableData;

    const sorted = [...tableData].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });

    return sorted;
  }, [tableData, sortConfig]);

  const getPaginatedData = useMemo(() => {
    if (sortedData.length === 0) {
      return [];
    }
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedData.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedData, currentPage]);

  const renderPageNumbers = useMemo(() => {
    return Array.from({length: totalPages}, (_, i) => (
      <TouchableOpacity
        key={i + 1}
        style={[
          styles.pageNumber,
          currentPage === i + 1 && styles.activePageNumber,
        ]}
        onPress={() => handlePageChange(i + 1)}>
        <Text
          style={[
            styles.pageNumberText,
            currentPage === i + 1 && styles.activePageNumberText,
          ]}>
          {i + 1}
        </Text>
      </TouchableOpacity>
    ));
  }, [totalPages, currentPage, handlePageChange]);

  return (
    <View style={styles.container}>
      {data && (
        <TouchableOpacity
          onPress={() =>
            updateFormState('isHeaderVisible', !formState.isHeaderVisible)
          }
          style={styles.headerContainer}>
          <Text style={styles.headerText}>HEADER</Text>
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
        </TouchableOpacity>
      )}

      {formState.isHeaderVisible && (
        <View style={styles.headerDetails}>
          <View style={styles.row}>
            <CustomInput
              label="Nature Of Business"
              value={formState.natureOfBusiness}
              onChangeText={text => updateFormState('natureOfBusiness', text)}
              editable={false}
              style={styles.disabledInput}
              containerStyle={styles.inputWrapper}
            />
            <CustomInput
              label="Line Of Business"
              value={formState.lineOfBusiness}
              onChangeText={text => updateFormState('lineOfBusiness', text)}
              editable={false}
              style={styles.disabledInput}
              containerStyle={styles.inputWrapper}
            />
          </View>
          <View style={styles.row}>
            <CustomInput
              label="Remaining Qty"
              value={formState.remainingQty}
              onChangeText={text => updateFormState('remainingQty', text)}
              editable={false}
              style={styles.disabledInput}
              containerStyle={styles.inputWrapper}
            />
            <CustomInput
              label="Breed Name"
              value={formState.breedName}
              onChangeText={text => updateFormState('breedName', text)}
              editable={false}
              style={styles.disabledInput}
              containerStyle={styles.inputWrapper}
            />
          </View>
          <View style={styles.row}>
            <CustomInput
              label="Template Name"
              value={formState.templateName}
              onChangeText={text => updateFormState('templateName', text)}
              editable={false}
              style={styles.disabledInput}
              containerStyle={styles.inputWrapper}
            />
            <CustomInput
              label="Posting Date"
              value={formState.postingDate}
              onChangeText={text => updateFormState('postingDate', text)}
              editable={false}
              style={styles.disabledInput}
              containerStyle={styles.inputWrapper}
            />
          </View>
          {formState.showAdditionalFields && (
            <>
              <View style={styles.row}>
                <CustomInput
                  label="Sub Location Name"
                  value={formState.subLocationName}
                  onChangeText={text =>
                    updateFormState('subLocationName', text)
                  }
                  editable={false}
                  style={styles.disabledInput}
                  containerStyle={styles.inputWrapper}
                />
                <CustomInput
                  label="Age (Days)"
                  value={formState.ageDays}
                  onChangeText={text => updateFormState('ageDays', text)}
                  editable={false}
                  style={styles.disabledInput}
                  containerStyle={styles.inputWrapper}
                />
              </View>
              <View style={styles.row}>
                <CustomInput
                  label="Age (Week)"
                  value={formState.ageWeek}
                  onChangeText={text => updateFormState('ageWeek', text)}
                  editable={false}
                  style={styles.disabledInput}
                  containerStyle={styles.inputWrapper}
                />
                <CustomInput
                  label="Opening Quantity"
                  value={formState.openingQuantity}
                  onChangeText={text =>
                    updateFormState('openingQuantity', text)
                  }
                  editable={false}
                  style={styles.disabledInput}
                  containerStyle={styles.inputWrapper}
                />
              </View>
              <View style={styles.row}>
                <CustomInput
                  label="Start Date"
                  value={formState.startDate}
                  onChangeText={text => updateFormState('startDate', text)}
                  editable={false}
                  style={styles.disabledInput}
                  containerStyle={styles.inputWrapper}
                />
                <CustomInput
                  label="Running Cost"
                  value={formState.runningCost}
                  onChangeText={text => updateFormState('runningCost', text)}
                  editable={false}
                  style={styles.disabledInput}
                  containerStyle={styles.inputWrapper}
                />
              </View>
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

      <ScrollView horizontal style={styles.tableContainer}>
        <View>
          <View style={[styles.tableRow, styles.tableHeaderRow]}>
            {tableHeaders.map((header, index) => (
              <TouchableOpacity
                key={index}
                style={styles.tableHeaderCell}
                onPress={() => handleSort(header.key)}>
                <Text style={styles.tableHeader}>
                  {header.label}
                  {sortConfig.key === header.key &&
                    (sortConfig.direction === 'ascending' ? ' ↑' : ' ↓')}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <View>
            {getPaginatedData.map((item, rowIndex) => (
              <View
                style={[
                  styles.tableRow,
                  rowIndex % 2 === 0 ? styles.tableRowEven : styles.tableRowOdd,
                ]}
                key={rowIndex}>
                {tableHeaders.map((header, colIndex) => (
                  <View style={styles.tableCellContainer} key={colIndex}>
                    <Text style={styles.tableCell}>{item[header.key]}</Text>
                  </View>
                ))}
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {data && (
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
          <View style={styles.pageNumbersContainer}>{renderPageNumbers}</View>
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
      )}
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
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  tableHeaderRow: {
    backgroundColor: COLORS.SecondaryColor,
  },
  tableHeaderCell: {
    flex: 1,
    paddingHorizontal: 10,
    width: width * 0.3,
  },
  tableHeader: {
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#fff',
  },
  tableCellContainer: {
    flex: 1,
    paddingHorizontal: 10,
    width: width * 0.3,
  },
  tableCell: {
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
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    // marginBottom: 10,
  },
  inputWrapper: {
    width: '48%',
  },
});

export default DataEntryHistorySearchedEntry;
