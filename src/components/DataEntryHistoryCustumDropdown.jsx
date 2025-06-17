import {Dropdown, MultiSelect} from 'react-native-element-dropdown';
import {Text, View, ActivityIndicator, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {COLORS, FONTFAMILY} from '../theme/theme';

const CustomDropdown = ({
  label,
  selectedValue,
  onValueChange,
  options,
  loading,
  multiSelect = false,
}) => {
  return (
    <View style={styles.dropdownContainer}>
      <Text style={styles.label}>{label} *</Text>
      {loading ? (
        <ActivityIndicator size="small" color={COLORS.SecondaryColor} />
      ) : multiSelect ? (
        <MultiSelect
          style={styles.dropdown}
          data={options}
          labelField="name"
          activeColor={COLORS.SecondaryColor}
          selectedTextStyle={{
            color: COLORS.SecondaryColor,
            fontFamily: FONTFAMILY.regular,
          }}
          placeholderStyle={{color: '#555', fontFamily: FONTFAMILY.regular}}
          valueField="id"
          placeholder={
            selectedValue.length > 0
              ? `${selectedValue.length} batch${
                  selectedValue.length > 1 ? 's' : ''
                } selected`
              : 'Select'
          }
          value={selectedValue} // array of ids
          onChange={onValueChange}
          selectedStyle={styles.selectedStyle}
          renderRightIcon={() => (
            <Icon name="chevron-down" color="#555" size={14} />
          )}
        />
      ) : (
        <Dropdown
          style={styles.dropdown}
          data={options}
          labelField="name"
          valueField="id"
          placeholder="Select"
          selectedTextStyle={{
            fontFamily: FONTFAMILY.regular,
          }}
          placeholderStyle={{color: '#555', fontFamily: FONTFAMILY.regular}}
          value={selectedValue} // single id
          onChange={item => onValueChange(item.id)}
          renderRightIcon={visible => (
            <Icon name={visible ? 'chevron-up' : 'chevron-down'} />
          )}
          itemTextStyle={{fontFamily: FONTFAMILY.regular, color: '#555'}}
        />
      )}
    </View>
  );
};

export default CustomDropdown;

const styles = StyleSheet.create({
  dropdownContainer: {
    width: '100%',
    marginBottom: 10,
  },
  label: {
    fontSize: 14,
    paddingBottom: 5,
    color: '#000',
    fontFamily: FONTFAMILY.regular,
  },
  dropdown: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    paddingVertical: 5,
    paddingHorizontal: 10,
    height: 40,
  },
  selectedStyle: {
    display: 'none',
    borderRadius: 8,
    backgroundColor: COLORS.SecondaryColor + '20',
    padding: 5,
  },
});
