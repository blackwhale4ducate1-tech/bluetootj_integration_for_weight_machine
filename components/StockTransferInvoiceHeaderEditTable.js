import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Picker} from '@react-native-picker/picker';
import {useStockTransfer} from './StockTransferContext';
import {useAuth} from './AuthContext';
import axios from 'axios';
import {API_BASE_URL} from '../config';
import DateTimePicker from '@react-native-community/datetimepicker';
import {TextInput} from 'react-native-paper';
import {COLORS} from '../constants';
import CustomStyles from './AddEditModalStyles';

const StockTransferInvoiceHeaderEditTable = ({invoice_no}) => {
  const {data} = useAuth();
  const {formDataHeader: formData, setFormDataHeader: updateFormData} =
    useStockTransfer();

  const [storeOptions, setStoreOptions] = useState([]);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || formData.invoiceDate;
    setShowDatePicker(false);
    updateFormData({...formData, invoiceDate: currentDate});
  };

  useEffect(() => {
    const getInvoiceHeaderData = async company_name => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/api/getStockTransferHeaderData?invoiceNo=${invoice_no}&company_name=${company_name}`,
        );
        updateFormData(prevFormData => ({
          ...prevFormData,
          invoiceDate: new Date(response.data.invoice_date),
          source: {
            value: response.data.source_store_id,
            label: response.data.source_store_name,
          },
          destination: {
            value: response.data.destination_store_id,
            label: response.data.destination_store_name,
          },
        }));
      } catch (error) {
        console.log(error);
      }
    };

    getInvoiceHeaderData(data.company_name);
    // eslint-disable-next-line
  }, []);

  const getStores = async company_name => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/getStores?company_name=${company_name}`,
      );
      if (response.data.message) {
        const data = response.data.message;
        const storeOptions = data.map(store => ({
          value: store.id,
          label: store.store_name,
        }));
        setStoreOptions(storeOptions);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getStores(data.company_name);
  }, [data.company_name]);

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <View style={{flex: 1, marginRight: 10}}>
          <TextInput
            label="Invoice No"
            value={formData.invoiceNo.toString()}
            mode="outlined"
            editable={false}
            outlineColor={COLORS.black}
            textColor={COLORS.black}
            activeOutlineColor={COLORS.primary}
          />
        </View>
        <View style={{flex: 1}}>
          <TouchableOpacity onPress={() => setShowDatePicker(true)}>
            <TextInput
              label="Invoice Date"
              value={formData.invoiceDate
                .toISOString()
                .split('T')[0]
                .toString()}
              mode="outlined"
              editable={false}
              outlineColor={COLORS.black}
              activeOutlineColor={COLORS.primary}
            />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.row}>
        <View style={{flex: 1, marginRight: 10}}>
          <Text style={CustomStyles.labelInput}>Source Store :</Text>
          <View style={{borderWidth: 1, borderRadius: 5}}>
            <Picker
              selectedValue={formData.source ? formData.source.value : null}
              onValueChange={(itemValue, itemIndex) => {
                const selectedOption = storeOptions.find(
                  option => option.value === itemValue,
                );
                updateFormData({...formData, source: selectedOption});
              }}>
              <Picker.Item label="-- Select --" value={null} />
              {storeOptions.map(option => (
                <Picker.Item
                  key={option.value}
                  label={option.label}
                  value={option.value}
                />
              ))}
            </Picker>
          </View>
        </View>
        <View style={{flex: 1}}>
          <Text style={CustomStyles.labelInput}>Destination Store :</Text>
          <View style={{borderWidth: 1, borderRadius: 5}}>
            <Picker
              selectedValue={
                formData.destination ? formData.destination.value : null
              }
              onValueChange={(itemValue, itemIndex) => {
                const selectedOption = storeOptions.find(
                  option => option.value === itemValue,
                );
                updateFormData({...formData, destination: selectedOption});
              }}>
              <Picker.Item label="-- Select --" value={null} />
              {storeOptions.map(option => (
                <Picker.Item
                  key={option.value}
                  label={option.label}
                  value={option.value}
                />
              ))}
            </Picker>
          </View>
        </View>
      </View>
      {/* Date Picker */}
      {showDatePicker && (
        <DateTimePicker
          value={formData.invoiceDate}
          mode="date"
          is24Hour={true}
          display="default"
          onChange={onChangeDate}
        />
      )}
    </View>
  );
};

export default StockTransferInvoiceHeaderEditTable;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
});
