import {View, Text, TouchableOpacity, SafeAreaView} from 'react-native';
import {useState} from 'react';
import {COLORS, MaterialCommunityIcons} from '../constants';
import styles from './ReportItemStyles';
import {useNavigation} from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import StockTransferItemWise from '../components/StockTransferItemWise';
import SearchProductForStockMenu from '../components/SearchProductForStockMenu';
import CustomStyles from '../components/AddEditModalStyles';
import {Appbar, TextInput, IconButton} from 'react-native-paper';

export default function StockTransferItemWiseReport() {
  const navigation = useNavigation();
  const initialFormData = {
    fromDate: new Date(),
    toDate: new Date(),
    product_code: '',
    validationError: '',
  };

  const [formData, setFormData] = useState(initialFormData);
  const [buttonLabel, setButtonLabel] = useState('Create Report');
  const [showFromDatePicker, setShowFromDatePicker] = useState(false);
  const [showToDatePicker, setShowToDatePicker] = useState(false);

  const onClickBtn = () => {
    if (!formData.fromDate || !formData.toDate) {
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
    <View style={CustomStyles.safeContainer}>
      <Appbar.Header style={CustomStyles.appHeader}>
        <Appbar.BackAction
          onPress={() => {
            navigation.goBack();
          }}
          color={COLORS.white}
        />
        <Appbar.Content
          title="Stock Transfer Item Wise Report"
          titleStyle={CustomStyles.titleStyle}
        />
      </Appbar.Header>
      {buttonLabel === 'Create Report' && (
        <View style={{margin: 10}}>
          <View style={CustomStyles.row}>
            <TextInput
              style={{margin: 10, flex: 8}}
              mode="outlined"
              label="From Date"
              placeholderTextColor={COLORS.black}
              activeUnderlineColor={COLORS.primary}
              value={
                formData.fromDate !== ''
                  ? new Date(formData.fromDate).toLocaleDateString('ta-IN')
                  : ''
              }
              placeholder="From Date"
              editable={false}
            />
            <IconButton
              icon="calendar"
              size={40}
              onPress={() => setShowFromDatePicker(true)}
              style={{margin: 10, flex: 1}}
              iconColor={COLORS.emerald}
            />
            {showFromDatePicker && (
              <DateTimePicker
                value={new Date(formData.fromDate)}
                mode="date"
                display="default"
                onChange={handleFromDateChange}
              />
            )}
          </View>
          <View style={CustomStyles.row}>
            <TextInput
              style={{margin: 10, flex: 8}}
              mode="outlined"
              label="To Date"
              placeholderTextColor={COLORS.black}
              activeUnderlineColor={COLORS.primary}
              value={
                formData.toDate !== ''
                  ? new Date(formData.toDate).toLocaleDateString('ta-IN')
                  : ''
              }
              placeholder="To Date"
              editable={false}
            />
            <IconButton
              icon="calendar"
              size={40}
              onPress={() => setShowToDatePicker(true)}
              style={{margin: 10, flex: 1}}
              iconColor={COLORS.emerald}
            />
            {showToDatePicker && (
              <DateTimePicker
                value={new Date(formData.toDate)}
                mode="date"
                display="default"
                onChange={handleToDateChange}
              />
            )}
          </View>
          <SearchProductForStockMenu
            updateFormData={setFormData}
            productInput={formData.product_code}
          />
        </View>
      )}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <TouchableOpacity onPress={onClickBtn} style={styles.reportbtn}>
          <Text style={styles.exportText}>{buttonLabel}</Text>
        </TouchableOpacity>
      </View>

      {buttonLabel === 'Back' && <StockTransferItemWise formData={formData} />}
    </View>
  );
}
