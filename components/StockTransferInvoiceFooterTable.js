import {StyleSheet, Text, View, TextInput, Dimensions} from 'react-native';
import React, {useState, useEffect} from 'react';
import {Picker} from '@react-native-picker/picker';
import axios from 'axios';
import {API_BASE_URL} from '../config';
import {useAuth} from './AuthContext';
import CustomStyles from './AddEditModalStyles';
import {COLORS} from '../constants';

const screenWidth = Dimensions.get('screen').width;

const StockTransferInvoiceFooterTable = ({
  formData,
  updateFormData,
  totalAmt,
  handleTaxChange,
  handlePriceListChange,
}) => {
  const {data} = useAuth();

  const [priceListOptions, setPriceListOptions] = useState([]);

  const taxOptions =
    data.tax_type === 'VAT'
      ? [{value: 'IGST', label: 'VAT'}]
      : [
          {value: 'GST', label: 'GST'},
          {value: 'IGST', label: 'IGST'},
          {value: 'Non Tax', label: 'Non Tax'},
        ];

  // Fetch priceList data and populate priceListOptions
  useEffect(() => {
    const fetchPriceLists = async company_name => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/api/getPriceLists?company_name=${company_name}`,
        );
        const priceLists = response.data.map(priceList => ({
          value: priceList.column_name,
          label: priceList.column_name,
        }));
        const updatedPriceLists = [
          {value: 'None', label: 'None'},
          ...priceLists,
        ];

        setPriceListOptions(updatedPriceLists);
      } catch (error) {
        console.log(error);
      }
    };
    fetchPriceLists(data.company_name);
  }, [data.company_name]);

  return (
    <View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: screenWidth * 0.8,
        }}>
        {data.itemwise_tax === 'not allow' && (
          <View style={CustomStyles.inputContainer}>
            <Text style={CustomStyles.labelInput}>Tax :</Text>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <View>
                <Picker
                  selectedValue={formData.tax ? formData.tax.value : null}
                  onValueChange={(itemValue, itemIndex) => {
                    const selectedOption = taxOptions.find(
                      option => option.value === itemValue,
                    );
                    updateFormData(prevData => ({
                      ...prevData,
                      tax: selectedOption,
                    }));
                    handleTaxChange(selectedOption);
                  }}
                  style={{
                    width: 160,
                    backgroundColor: COLORS.inputbggreen,
                    color: COLORS.black,
                  }}>
                  {/* <Picker.Item label="-- Select --" value={null} /> */}
                  {taxOptions.map(option => (
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
        )}
        <View style={CustomStyles.inputContainer}>
          <Text style={CustomStyles.labelInput}>Vehicle No :</Text>
          <View>
            <TextInput
              style={{
                flex: 1,
                marginLeft: 10,
                backgroundColor: COLORS.inputbggreen,
                padding: 10,
                width: 150,
                color: COLORS.black,
              }}
              mode="flat"
              placeholderTextColor={COLORS.black}
              activeUnderlineColor={COLORS.primary}
              value={formData.vehicle_no}
              onChangeText={text => {
                updateFormData({
                  ...formData,
                  vehicle_no: text,
                });
              }}
            />
          </View>
        </View>
        <View style={CustomStyles.inputContainer}>
          <Text style={CustomStyles.labelInput}>PriceList :</Text>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <View>
              <Picker
                selectedValue={
                  formData.priceList ? formData.priceList.value : null
                }
                onValueChange={(itemValue, itemIndex) => {
                  const selectedOption = taxOptions.find(
                    option => option.value === itemValue,
                  );
                  updateFormData(prevData => ({
                    ...prevData,
                    priceList: selectedOption,
                  }));
                  handlePriceListChange(selectedOption);
                }}
                style={{
                  width: 160,
                  backgroundColor: COLORS.inputbggreen,
                  color: COLORS.black,
                }}>
                {/* <Picker.Item label="-- Select --" value={null} /> */}
                {priceListOptions.map(option => (
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
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: screenWidth * 0.8,
        }}>
        <View style={CustomStyles.inputContainer}>
          <Text style={CustomStyles.labelInput}>Notes :</Text>
          <View>
            <View>
              <TextInput
                style={{
                  flex: 1,
                  marginLeft: 10,
                  backgroundColor: COLORS.inputbggreen,
                  padding: 10,
                  width: screenWidth * 0.8,
                  color: COLORS.black,
                }}
                mode="flat"
                placeholderTextColor={COLORS.black}
                activeUnderlineColor={COLORS.primary}
                value={formData.notes}
                onChangeText={text => {
                  updateFormData({
                    ...formData,
                    notes: text,
                  });
                }}
                multiline={true}
              />
            </View>
          </View>
        </View>
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: screenWidth * 0.8,
        }}>
        <View style={CustomStyles.inputContainer}>
          <Text style={CustomStyles.labelInput}>Created By User :</Text>
          <View>
            <View>
              <TextInput
                style={{
                  flex: 1,
                  marginLeft: 10,
                  backgroundColor: COLORS.inputbggreen,
                  padding: 10,
                  width: screenWidth * 0.8,
                  color: COLORS.black,
                }}
                mode="flat"
                placeholderTextColor={COLORS.black}
                activeUnderlineColor={COLORS.primary}
                value={formData.user.username}
                editable={false}
              />
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

export default StockTransferInvoiceFooterTable;

const styles = StyleSheet.create({});
