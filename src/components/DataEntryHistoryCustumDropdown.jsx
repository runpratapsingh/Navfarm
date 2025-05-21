import {Dropdown} from 'react-native-element-dropdown';
import {Text, View, ActivityIndicator, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {COLORS} from '../theme/theme';

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
        <ActivityIndicator size="small" color={COLORS.SecondaryColor} />
      ) : (
        <Dropdown
          style={styles.dropdown}
          data={options}
          labelField="name"
          valueField="id"
          placeholder="Select"
          value={selectedValue}
          onChange={item => onValueChange(item.id)}
          renderRightIcon={visible => (
            <Icon name={visible ? 'chevron-up' : 'chevron-down'} />
          )}
        />
      )}
    </View>
  );
};

export default CustomDropdown;

const styles = StyleSheet.create({
  dropdownContainer: {
    // marginBottom: 15,
    width: '100%',
  },
  label: {
    fontSize: 14,
    paddingBottom: 5,
    color: '#555',
  },
  dropdown: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    paddingVertical: 5,
    paddingHorizontal: 10,
    height: 35,
  },
});
