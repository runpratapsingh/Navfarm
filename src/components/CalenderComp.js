import React, {useState} from 'react';
import {View, Modal, StyleSheet, TouchableOpacity, Text} from 'react-native';
import {Calendar} from 'react-native-calendars';
import Icon from 'react-native-vector-icons/FontAwesome';
import {TextInput} from 'react-native';
import {COLORS} from '../theme/theme';

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
      <Text style={{fontSize: 14, color: '#555'}}>Posting Date</Text>
      <TouchableOpacity
        style={styles.inputWithIcon}
        onPress={() => setCalendarVisible(true)}>
        <TextInput
          style={styles.input}
          placeholder="Posting Date"
          value={postingDate}
          editable={false}
        />
        <Icon name="calendar" size={20} color="#000" style={styles.icon} />
      </TouchableOpacity>

      {/* Calendar Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={calendarVisible}
        onRequestClose={() => setCalendarVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Calendar
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
  },
  input: {
    flex: 1,
    fontSize: 16,
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
    width: '70%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
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
  },
});

export default CalendarComponent;
