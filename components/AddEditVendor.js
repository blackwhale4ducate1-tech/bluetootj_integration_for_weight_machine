import {Text, View, TouchableOpacity, ActivityIndicator} from 'react-native';
import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {API_BASE_URL} from '../config';
import {useAuth} from './AuthContext';
import styles from './AddEditModalStyles';
import {Picker} from '@react-native-picker/picker';
import {TextInput} from 'react-native-paper';
import {COLORS} from '../constants';
import DateTimePicker from '@react-native-community/datetimepicker';

const AddEditVendor = props => {
  const {data} = useAuth();

  const debitCredtOptions = [
    {value: 'DEBIT', label: 'DEBIT'},
    {value: 'CREDIT', label: 'CREDIT'},
  ];
  const [formData, setFormData] = useState(props.initialFormData);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setFormData(props.initialFormData);
  }, [props.initialFormData]);

  const onClickClear = () => {
    setFormData(props.initialFormData);
  };

  const handleSubmit = async event => {
    event.preventDefault();
    if (!formData.phone_no || formData.phone_no.toString().length !== 10) {
      setFormData({
        ...formData,
        validationError: 'Phone no should be 10 digits',
      });
      return;
    }
    if (
      formData.alt_phone_no.length > 0 &&
      formData.alt_phone_no.toString().length !== 10
    ) {
      setFormData({
        ...formData,
        validationError: 'AltPhone no should be 10 digits',
      });
      return;
    }
    setIsLoading(true);
    try {
      if (props.type === 'Add Vendor') {
        const res = await axios.post(`${API_BASE_URL}/api/addCustomer`, {
          customer_data: formData,
          company_name: data.company_name,
        });
        if (res.data.message) {
          console.log('message:' + res.data.message);
          setFormData(props.initialFormData);
          props.onHandleSubmit();
        } else if (res.data.error) {
          console.log('error:' + res.data.error);
          setFormData({...formData, validationError: res.data.error});
        } else {
          setFormData({...formData, validationError: 'Please Try again'});
        }
      } else if (props.type === 'Edit Vendor') {
        const res = await axios.post(`${API_BASE_URL}/api/updateCustomer`, {
          id: formData.id,
          name: formData.name,
          account_code: formData.account_code,
          phone_no: formData.phone_no,
          alt_phone_no: formData.alt_phone_no,
          email: formData.email,
          address: formData.address,
          gstin: formData.gstin,
          state: formData.state,
          city: formData.city,
          opening_balance: formData.opening_balance,
          debit_credit: formData.debit_credit.value,
          credit_limit: formData.credit_limit,
          credit_days: formData.credit_days,
          invoice_date: formData.invoiceDate,
          company_name: data.company_name,
        });
        if (res.data.message) {
          console.log('message:' + res.data.message);
          props.onHandleSubmit();
        } else if (res.data.error) {
          console.log('error:' + res.data.error);
          setFormData({...formData, validationError: res.data.error});
        } else {
          setFormData({...formData, validationError: 'Please Try again'});
        }
      }
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.formlabel}>Name :</Text>
        <TextInput
          style={styles.inputbg}
          mode="flat"
          placeholderTextColor={COLORS.black}
          activeUnderlineColor={COLORS.primary}
          placeholder="Enter Name"
          value={formData.name}
          onChangeText={text =>
            setFormData({
              ...formData,
              name: text,
            })
          }
        />
      </View>
      <View>
        <Text style={styles.formlabel}>Account Code :</Text>
        <TextInput
          style={styles.inputbg}
          mode="flat"
          placeholderTextColor={COLORS.black}
          activeUnderlineColor={COLORS.primary}
          placeholder="Enter Account Code"
          value={formData.account_code}
          onChangeText={text =>
            setFormData({
              ...formData,
              account_code: text,
            })
          }
        />
      </View>
      <View>
        <Text style={styles.formlabel}>Phone No :</Text>
        <TextInput
          style={styles.inputbg}
          mode="flat"
          placeholderTextColor={COLORS.black}
          activeUnderlineColor={COLORS.primary}
          placeholder="Enter Phone No"
          value={formData.phone_no.toString()}
          onChangeText={text =>
            setFormData({
              ...formData,
              phone_no: text,
            })
          }
          keyboardType="numeric"
        />
      </View>
      {data.business_category !== 'FlowerShop' && (
        <>
          <View>
            <Text style={styles.formlabel}>Alternate Phone No :</Text>

            <TextInput
              style={styles.inputbg}
              mode="flat"
              placeholderTextColor={COLORS.black}
              activeUnderlineColor={COLORS.primary}
              placeholder="Enter Alt Phone No"
              value={formData.alt_phone_no.toString()}
              onChangeText={text =>
                setFormData({
                  ...formData,
                  alt_phone_no: text,
                })
              }
              keyboardType="numeric"
            />
          </View>
          <View>
            <Text style={styles.formlabel}>Email :</Text>
            <TextInput
              style={styles.inputbg}
              mode="flat"
              placeholderTextColor={COLORS.black}
              activeUnderlineColor={COLORS.primary}
              placeholder="Enter Email"
              value={formData.email}
              onChangeText={text =>
                setFormData({
                  ...formData,
                  email: text,
                })
              }
            />
          </View>
        </>
      )}

      <View>
        <Text style={styles.formlabel}>Address :</Text>
        <TextInput
          style={styles.inputbg}
          mode="flat"
          placeholderTextColor={COLORS.black}
          activeUnderlineColor={COLORS.primary}
          placeholder="Enter Address"
          value={formData.address}
          onChangeText={text =>
            setFormData({
              ...formData,
              address: text,
            })
          }
        />
      </View>
      {data.business_category !== 'FlowerShop' && (
        <>
          <View>
            <Text style={styles.formlabel}>GSTIN :</Text>
            <TextInput
              style={styles.inputbg}
              mode="flat"
              placeholderTextColor={COLORS.black}
              activeUnderlineColor={COLORS.primary}
              placeholder="Enter GSTIN"
              value={formData.gstin}
              onChangeText={text =>
                setFormData({
                  ...formData,
                  gstin: text,
                })
              }
            />
          </View>

          <View>
            <Text style={styles.formlabel}>State :</Text>
            <TextInput
              style={styles.inputbg}
              mode="flat"
              placeholderTextColor={COLORS.black}
              activeUnderlineColor={COLORS.primary}
              placeholder="Enter State"
              value={formData.state}
              onChangeText={text =>
                setFormData({
                  ...formData,
                  state: text,
                })
              }
            />
          </View>

          <View>
            <Text style={styles.formlabel}>City :</Text>
            <TextInput
              style={styles.inputbg}
              mode="flat"
              placeholderTextColor={COLORS.black}
              activeUnderlineColor={COLORS.primary}
              placeholder="Enter City"
              value={formData.city}
              onChangeText={text =>
                setFormData({
                  ...formData,
                  city: text,
                })
              }
            />
          </View>
          <View>
            <Text style={styles.formlabel}>Credit Limit :</Text>
            <TextInput
              style={styles.inputbg}
              mode="flat"
              placeholderTextColor={COLORS.black}
              activeUnderlineColor={COLORS.primary}
              placeholder="Enter Credit Limit"
              value={formData.credit_limit.toString()}
              onChangeText={text =>
                setFormData({
                  ...formData,
                  credit_limit: text,
                })
              }
              keyboardType="numeric"
            />
          </View>
        </>
      )}

      <View>
        <Text style={styles.formlabel}>Opening Balance :</Text>
        <TextInput
          style={styles.inputbg}
          mode="flat"
          placeholderTextColor={COLORS.black}
          activeUnderlineColor={COLORS.primary}
          placeholder="Enter Opening Balance"
          value={formData.opening_balance.toString()}
          onChangeText={text =>
            setFormData({
              ...formData,
              opening_balance: text,
            })
          }
          keyboardType="numeric"
        />
      </View>

      <View>
        <Text style={styles.formlabel}>Dr/Cr :</Text>
        <View style={styles.inputPicker}>
          <Picker
            selectedValue={
              formData.debit_credit ? formData.debit_credit.value : null
            }
            onValueChange={(itemValue, itemIndex) => {
              const selectedOption = debitCredtOptions.find(
                option => option.value === itemValue,
              );
              setFormData(prevFormData => ({
                ...prevFormData,
                debit_credit: {
                  value: selectedOption.value,
                  label: selectedOption.label,
                },
              }));
            }}
            style={{color: COLORS.black}}>
            <Picker.Item label="-- Select Dr/Cr --" value={null} />
            {debitCredtOptions.map(option => (
              <Picker.Item
                key={option.value}
                label={option.label}
                value={option.value}
              />
            ))}
          </Picker>
        </View>
      </View>
      <View style={styles.inputContainer}>
        <View>
          <TouchableOpacity
            style={styles.dateButton}
            onPress={() => setShowDatePicker(true)}>
            <Text style={styles.dateButtonText}>Select Invoice Date</Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={new Date(formData.invoiceDate)}
              mode="date"
              display="default"
              onChange={(event, selectedDate) => {
                setShowDatePicker(false);
                if (selectedDate) {
                  setFormData({
                    ...formData,
                    invoiceDate: selectedDate,
                  });
                }
              }}
            />
          )}
        </View>
      </View>
      <View>
        <Text style={styles.labelInput}>Invoice Date :</Text>
        <TextInput
          style={styles.inputbg}
          mode="flat"
          placeholderTextColor={COLORS.black}
          activeUnderlineColor={COLORS.primary}
          value={
            formData.invoiceDate !== ''
              ? new Date(formData.invoiceDate).toLocaleDateString('ta-IN')
              : ''
          }
          placeholder="Invoice Date"
          editable={false}
        />
      </View>
      <View style={styles.floatRight}>
        <TouchableOpacity onPress={onClickClear}>
          <Text style={styles.clearText}>Clear</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        style={styles.submitButton}
        onPress={handleSubmit}
        disabled={isLoading}>
        {isLoading ? (
          <ActivityIndicator size="large" color={COLORS.white} />
        ) : (
          <Text style={styles.submitButtonText}>Submit</Text>
        )}
      </TouchableOpacity>
      <Text style={styles.errorText}>{formData.validationError}</Text>
    </View>
  );
};

export default AddEditVendor;
