import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import {useState, useEffect} from 'react';
import {Picker} from '@react-native-picker/picker';
import {useNavigation} from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import SimpleTrialBalanceTable from '../components/SimpleTrialBalanceTable';
import DetailedTrialBalanceTable from '../components/DetailedTrialBalanceTable';
import {COLORS, MaterialCommunityIcons, FONTS} from '../constants';

const TrialBalance = () => {
  const navigation = useNavigation();

  const initialFormData = {
    fromDate: new Date(),
    toDate: new Date(),
    viewMode: null,
    validationError: '',
  };
  // const [viewMode, setViewMode] = useState(null);
  const [formData, setFormData] = useState(initialFormData);
  const [buttonLabel, setButtonLabel] = useState('Create Report');
  const [showFromDatePicker, setShowFromDatePicker] = useState(false);
  const [showToDatePicker, setShowToDatePicker] = useState(false);

  const viewModeOptions = [
    {value: 'simple', label: 'Simple View'},
    {value: 'detailed', label: 'Detailed View'},
  ];

  const handleViewModeChange = itemValue => {
    console.log('itemValue: ' + itemValue);
    if (itemValue === 'simple') {
      console.log('Entered simple');
      setFormData(prevFormData => ({
        ...prevFormData,
        viewMode: {value: 'simple', label: 'Simple View'},
      }));
    } else if (itemValue === 'detailed') {
      setFormData(prevFormData => ({
        ...prevFormData,
        viewMode: {value: 'detailed', label: 'Detailed View'},
      }));
    } else {
      setFormData(prevFormData => ({
        ...prevFormData,
        viewMode: null,
      }));
    }
  };

  const onClickBtn = () => {
    console.log('formData: ' + JSON.stringify(formData));
    if (!formData.fromDate || !formData.toDate || !formData.viewMode) {
      setFormData({
        ...formData,
        validationError: 'Please Select All',
      });
    } else {
      setFormData({
        ...formData,
        validationError: '',
      });
      buttonLabel === 'Create Report'
        ? setButtonLabel('Back')
        : setButtonLabel('Create Report');
    }
  };

  const handleFromDateChange = (event, selectedDate) => {
    setShowFromDatePicker(false);
    if (selectedDate) {
      setFormData({...formData, fromDate: selectedDate});
    }
  };

  const handleToDateChange = (event, selectedDate) => {
    setShowToDatePicker(false);
    if (selectedDate) {
      setFormData({...formData, toDate: selectedDate});
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons
            name="keyboard-backspace"
            size={22}
            color={COLORS.black}
          />
        </TouchableOpacity>
        <Text style={styles.headerText}>
          Trial Balance {formData.viewMode ? formData.viewMode.label : ''}
        </Text>
      </View>

      {buttonLabel === 'Create Report' && (
        <View style={{margin: 10}}>
          <View style={{padding: 10}}>
            <TouchableOpacity
              style={styles.dateButton}
              onPress={() => setShowFromDatePicker(true)}>
              <Text style={styles.dateButtonText}>Select From Date</Text>
            </TouchableOpacity>
            {showFromDatePicker && (
              <DateTimePicker
                value={formData.fromDate}
                mode="date"
                display="default"
                onChange={handleFromDateChange}
              />
            )}
          </View>
          <View style={{padding: 10}}>
            <TouchableOpacity
              style={[styles.dateButton, {backgroundColor: COLORS.red}]}
              onPress={() => setShowToDatePicker(true)}>
              <Text style={styles.dateButtonText}>Select To Date</Text>
            </TouchableOpacity>
            {showToDatePicker && (
              <DateTimePicker
                value={formData.toDate}
                mode="date"
                display="default"
                onChange={handleToDateChange}
              />
            )}
          </View>
          <View style={styles.pickercontain}>
            <Picker
              selectedValue={formData.viewMode ? formData.viewMode.value : null}
              onValueChange={itemValue => handleViewModeChange(itemValue)}
              style={{color: COLORS.black}}>
              <Picker.Item label="Select View Mode" value={null} />
              {viewModeOptions.map(option => (
                <Picker.Item
                  key={option.value}
                  label={option.label}
                  value={option.value}
                />
              ))}
            </Picker>
          </View>
        </View>
      )}
      <TouchableOpacity onPress={onClickBtn} style={styles.button}>
        <Text style={styles.btnText}>{buttonLabel}</Text>
      </TouchableOpacity>
      <Text style={styles.validationError}>{formData.validationError}</Text>
      {buttonLabel === 'Back' && formData.viewMode.value === 'simple' && (
        <SimpleTrialBalanceTable formData={formData} />
      )}
      {buttonLabel === 'Back' && formData.viewMode.value === 'detailed' && (
        <DetailedTrialBalanceTable formData={formData} />
      )}
    </View>
  );
};

export default TrialBalance;

const styles = StyleSheet.create({
  container: {
    margin: 15,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  pickercontain: {
    marginTop: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  btnText: {
    color: COLORS.white,
    fontFamily: FONTS.body4.fontFamily,
    letterSpacing: 0.5,
    fontSize: 16,
  },
  dateButton: {
    backgroundColor: COLORS.emerald,
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateButtonText: {
    color: COLORS.white,
    fontSize: 16,
    textTransform: 'capitalize',
    fontFamily: FONTS.body1.fontFamily,
    letterSpacing: 0.5,
  },
  headerText: {
    fontSize: 16,
    fontFamily: FONTS.body5.fontFamily,
    color: COLORS.black,
    marginLeft: 20,
    fontWeight: '700',
  },
  button: {
    alignItems: 'center',
    backgroundColor: COLORS.emerald,
    borderRadius: 5,

    padding: 10,
    marginTop: 20,
  },
  validationError: {
    color: 'red',
    textAlign: 'center',
    marginTop: 10,
  },
});
