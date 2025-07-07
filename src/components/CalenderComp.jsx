import React, {useState} from 'react';
import {
  View,
  Modal,
  StyleSheet,
  TouchableOpacity,
  Text,
  Dimensions,
} from 'react-native';
import {Calendar} from 'react-native-calendars';
import Icon from 'react-native-vector-icons/FontAwesome';
import {TextInput} from 'react-native';
import {COLORS, FONTFAMILY} from '../theme/theme';

const {width} = Dimensions.get('window');

// Calendar Component
const CalendarComponent = ({
  postingDate,
  onDateChange,
  postingStatus,
  ...props
}) => {
  const [calendarVisible, setCalendarVisible] = useState(false);

  return (
    <>
      <Text
        style={{fontSize: 14, color: '#555', fontFamily: FONTFAMILY.regular}}>
        Posting Date
      </Text>
      <TouchableOpacity
        style={styles.inputWithIcon}
        onPress={() => setCalendarVisible(true)}>
        <TextInput
          style={styles.input}
          placeholder="Posting Date"
          value={postingDate}
          editable={false}
        />
        <Icon name="calendar" size={15} color="#000" style={styles.icon} />
      </TouchableOpacity>

      {/* Calendar Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={calendarVisible}
        onRequestClose={() => setCalendarVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Calendar
              style={{width: width * 0.85}}
              theme={{
                arrowColor: COLORS.SecondaryColor,
              }}
              initialDate={postingDate}
              onDayPress={day => {
                onDateChange(day.dateString);
                setCalendarVisible(false);
              }}
              markedDates={{
                [postingDate]: {
                  selected: true,
                  disableTouchEvent: true,
                  selectedColor: COLORS.SecondaryColor,
                },
              }}
              {...props}
            />
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setCalendarVisible(false)}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  inputWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 5,
    marginVertical: 5,
    height: 40,
  },
  input: {
    flex: 1,
    fontSize: 14,
    fontFamily: FONTFAMILY.regular,
  },
  icon: {
    marginLeft: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '93%',
    backgroundColor: 'white',
    borderRadius: 10,
    marginHorizontal: 10,
    paddingBottom: 10,
    alignItems: 'center',
  },
  closeButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: COLORS.SecondaryColor,
    borderRadius: 5,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: FONTFAMILY.regular,
  },
});

export default CalendarComponent;
