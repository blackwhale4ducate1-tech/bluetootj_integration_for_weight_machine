import {StyleSheet, Text, View, TextInput, Dimensions} from 'react-native';
import React, {useState, useEffect} from 'react';
import {Picker} from '@react-native-picker/picker';
import axios from 'axios';
import {API_BASE_URL} from '../config';
import {useAuth} from './AuthContext';
import CustomStyles from './AddEditModalStyles';
import {COLORS} from '../constants';

const screenWidth = Dimensions.get('screen').width;

const PurchaseInvoiceFooterTable = ({
  type,
  formData,
  updateFormData,
  totalAmt,
  handleTaxChange,
}) => {
  const {data} = useAuth();

  const [selectedDiscountType, setSelectedDiscountType] = useState(
    type !== 'production' ? formData.discountType : null,
  );
  const [storeOptions, setStoreOptions] = useState([]);
  const [discountInput, setDiscountInput] = useState(
    type !== 'production' ? formData.discountInput : null,
  );

  const discountOptions = [
    {value: 'Discount %', label: 'Discount %'},
    {value: 'Discount Price', label: 'Discount Price'},
  ];
  if (data.business_category === 'FlowerShop') {
    discountOptions.push({value: 'Commission %', label: 'Commission %'});
  }
  const mopOptions = [
    {value: 'CASH', label: 'CASH'},
    {value: 'CREDIT', label: 'CREDIT'},
  ];
  const taxOptions =
    data.tax_type === 'VAT'
      ? [{value: 'IGST', label: 'VAT'}]
      : [
          {value: 'GST', label: 'GST'},
          {value: 'IGST', label: 'IGST'},
          {value: 'Non Tax', label: 'Non Tax'},
        ];

  useEffect(() => {
    const getStores = async company_name => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/api/getStores?company_name=${company_name}`,
        );
        if (response.data.message) {
          const storesData = response.data.message;
          // console.log('storesData: ' + JSON.stringify(storesData));
          const storeOptions = storesData.map(store => ({
            value: store.id,
            label: store.store_name,
          }));
          setStoreOptions(storeOptions);

          const defaultStore = storesData.find(
            store => data.default_store === store.store_name,
          );
          const defaultStoreOption = defaultStore
            ? {value: defaultStore.id, label: defaultStore.store_name}
            : {value: '', label: ''};
          updateFormData(prevData => ({
            ...prevData,
            store: defaultStoreOption,
          }));
        }
      } catch (error) {
        console.log(error);
      }
    };

    getStores(data.company_name);
  }, [data.company_name, data.default_store, updateFormData]);

  useEffect(() => {
    if (selectedDiscountType) {
      if (
        selectedDiscountType.value === 'Discount %' ||
        selectedDiscountType.value === 'Commission %'
      ) {
        const discountOnTotal =
          (parseFloat(discountInput === '' ? 0 : discountInput) *
            parseFloat(totalAmt)) /
          100;
        updateFormData(prevData => ({
          ...prevData,
          discountType: selectedDiscountType,
          discountInput: discountInput,
          discountOnTotal: discountOnTotal.toFixed(2),
        }));
      } else if (selectedDiscountType.value === 'Discount Price') {
        updateFormData(prevData => ({
          ...prevData,
          discountType: selectedDiscountType,
          discountInput: discountInput,
          discountOnTotal: parseFloat(
            discountInput === '' ? 0 : discountInput,
          ).toFixed(2),
        }));
      }
    } else {
      if (type !== 'production') {
        updateFormData(prevData => ({
          ...prevData,
          discountType: selectedDiscountType || null,
          discountInput: discountInput,
          discountOnTotal: 0.0,
        }));
      }
    }
  }, [selectedDiscountType, discountInput, totalAmt, updateFormData, type]);

  return (
    <View>
      {type !== 'production' && (
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: screenWidth * 0.8,
          }}>
          <View>
            <Text style={CustomStyles.labelInput}>
              {data.business_category === 'FlowerShop'
                ? 'Commision'
                : 'Discount'}
            </Text>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <View style={[]}>
                <Picker
                  selectedValue={
                    selectedDiscountType ? selectedDiscountType.value : null
                  }
                  onValueChange={(itemValue, itemIndex) => {
                    const selectedOption = discountOptions.find(
                      option => option.value === itemValue,
                    );
                    setSelectedDiscountType(selectedOption);
                    if (!selectedOption) {
                      setDiscountInput('');
                    }
                  }}
                  enabled={data.business_category !== 'FlowerShop'}
                  style={{
                    width: 160,
                    backgroundColor: COLORS.inputbggreen,
                    color: COLORS.black,
                  }}>
                  <Picker.Item label="-- Select --" value={null} />
                  {discountOptions.map(option => (
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

          <View>
            <Text style={CustomStyles.labelInput}>
              {' '}
              {data.business_category === 'FlowerShop'
                ? 'Commission Input'
                : 'Discount Input'}
            </Text>
            <TextInput
              style={{
                flex: 1,
                marginLeft: 10,
                backgroundColor: COLORS.inputbggreen,
                color: COLORS.black,
              }}
              mode="flat"
              placeholderTextColor={COLORS.black}
              activeUnderlineColor={COLORS.primary}
              value={discountInput.toString()}
              onChangeText={text => setDiscountInput(text)}
              keyboardType="numeric"
              editable={
                !!selectedDiscountType &&
                data.business_category !== 'FlowerShop'
              }
            />
          </View>
        </View>
      )}

      <View style={CustomStyles.inputContainer}>
        <Text style={CustomStyles.labelInput}>Other Expenses :</Text>
        <TextInput
          style={{backgroundColor: COLORS.inputbggreen, color: COLORS.black}}
          mode="flat"
          placeholderTextColor={COLORS.black}
          activeUnderlineColor={COLORS.primary}
          value={formData.otherExpenses.toString()}
          onChangeText={text =>
            updateFormData(prevData => ({
              ...prevData,
              otherExpenses: text,
            }))
          }
          keyboardType="numeric"
        />
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: screenWidth * 0.8,
        }}>
        {data.itemwise_tax === 'not allow' &&
          data.business_category !== 'FlowerShop' &&
          (type === 'production'
            ? data.isGstExistInProduction === 1
            : true) && (
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
                    }}
                    dropdownIconColor={COLORS.black}>
                    <Picker.Item label="-- Select --" value={null} />
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
        {type !== 'production' && (
          <View style={CustomStyles.inputContainer}>
            <Text style={CustomStyles.labelInput}>MOP :</Text>
            <View>
              <View>
                <Picker
                  selectedValue={formData.mop ? formData.mop.value : null}
                  onValueChange={(itemValue, itemIndex) => {
                    const selectedOption = mopOptions.find(
                      option => option.value === itemValue,
                    );
                    updateFormData(prevData => ({
                      ...prevData,
                      mop: selectedOption,
                    }));
                  }}
                  enabled={data.business_category !== 'FlowerShop'}
                  style={{
                    width: 130,
                    marginLeft: 10,
                    backgroundColor: COLORS.inputbggreen,
                    color: COLORS.black,
                  }}
                  dropdownIconColor={COLORS.black}>
                  <Picker.Item label="-- Select --" value={null} />
                  {mopOptions.map(option => (
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
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: screenWidth * 0.8,
        }}>
        <View style={CustomStyles.inputContainer}>
          <Text style={CustomStyles.labelInput}>Store :</Text>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <View>
              <Picker
                selectedValue={formData.store ? formData.store.value : null}
                onValueChange={(itemValue, itemIndex) => {
                  const selectedOption = storeOptions.find(
                    option => option.value === itemValue,
                  );
                  updateFormData(prevData => ({
                    ...prevData,
                    store: selectedOption,
                  }));
                }}
                style={{
                  width: 160,
                  backgroundColor: COLORS.inputbggreen,
                  color: COLORS.black,
                }}
                dropdownIconColor={COLORS.black}>
                <Picker.Item label="-- Select Store --" value={null} />
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
      <View
        style={[
          CustomStyles.inputContainer,
          {marginTop: 20, width: screenWidth * 0.8},
        ]}>
        <Text style={[CustomStyles.labelInput, {marginBottom: 10}]}>
          Narration :
        </Text>
        <TextInput
          style={{
            backgroundColor: COLORS.inputbggreen,
            color: COLORS.black,
            minHeight: 100,
            textAlignVertical: 'top',
            padding: 10,
          }}
          mode="flat"
          placeholderTextColor={COLORS.black}
          activeUnderlineColor={COLORS.primary}
          value={formData.narration}
          onChangeText={text =>
            updateFormData(prevData => ({
              ...prevData,
              narration: text,
            }))
          }
          multiline={true}
        />
      </View>
    </View>
  );
};

export default PurchaseInvoiceFooterTable;

const styles = StyleSheet.create({});
