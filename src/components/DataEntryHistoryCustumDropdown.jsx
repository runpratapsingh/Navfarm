import {Dropdown} from 'react-native-element-dropdown';
import {Text, View, ActivityIndicator, StyleSheet} from 'react-native';

const CustomDropdown = ({
  label,
  selectedValue,
  onValueChange,
  options,
  loading,
}) => {
  return (
    <View style={styles.dropdownContainer}>
      <Text style={styles.label}>{label} *</Text>
      {loading ? (
        <ActivityIndicator size="small" color="#0000ff" />
      ) : (
        <Dropdown
          style={styles.dropdown}
          data={options}
          labelField="name"
          valueField="id"
          placeholder="Select"
          value={selectedValue}
          onChange={item => onValueChange(item.id)}
        />
      )}
    </View>
  );
};

export default CustomDropdown;

const styles = StyleSheet.create({
  dropdownContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    paddingBottom: 5,
  },
  dropdown: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    padding: 10,
  },
});
