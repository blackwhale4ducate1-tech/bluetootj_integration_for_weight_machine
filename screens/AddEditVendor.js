import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Modal,
  TouchableOpacity,
} from 'react-native';
import React, {useState, useCallback, useEffect} from 'react';
import {
  Appbar,
  Card,
  Button,
  TextInput,
  ActivityIndicator,
  Checkbox,
  IconButton,
} from 'react-native-paper';
import CustomStyles from '../components/AddEditModalStyles';
import {
  useNavigation,
  useRoute,
  useFocusEffect,
} from '@react-navigation/native';
import {COLORS} from '../constants';
import axios from 'axios';
import {API_BASE_URL} from '../config';
import {useAuth} from '../components/AuthContext';
import DateTimePicker from '@react-native-community/datetimepicker';
import {PaperSelect} from 'react-native-paper-select';
import {useVendors} from '../components/VendorsContext';
import translateText from '../components/utils/GoogleTranslate';

const AddEditVendor = () => {
  const {data} = useAuth();
  const route = useRoute();
  const {type} = route.params;
  const {initialFormData, formData, setFormData, loading, setLoading} =
    useVendors();
  const navigation = useNavigation();

  const debitCredtOptions = [
    {value: 'DEBIT', label: 'DEBIT'},
    {value: 'CREDIT', label: 'CREDIT'},
  ];

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loadingTranslateBtn, setLoadingTranslateBtn] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      if (!formData.account_code) {
        setFormData({
          ...formData,
          validationError: 'Enter Account Code',
        });
        return;
      }
      if (!formData.name) {
        setFormData({
          ...formData,
          validationError: 'Enter Name',
        });
        return;
      }
      if (
        data.business_category !== 'FlowerShop' &&
        (!formData.phone_no || formData.phone_no.toString().length !== 10)
      ) {
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
          validationError: 'AltPhone no should be 10 digits or empty',
        });
        return;
      }
      if (type === 'Add Vendor') {
        const res = await axios.post(`${API_BASE_URL}/api/addCustomer`, {
          customer_data: formData,
          company_name: data.company_name,
          business_category: data.business_category,
        });
        if (res.data.message) {
          setFormData(initialFormData);
          navigation.goBack();
        } else if (res.data.error) {
          setFormData({...formData, validationError: res.data.error});
        } else {
          setFormData({...formData, validationError: 'Please Try again'});
        }
      } else if (type === 'Edit Vendor') {
        const res = await axios.post(`${API_BASE_URL}/api/updateCustomer`, {
          id: formData.id,
          name: formData.name,
          account_code: formData.account_code,
          regional_name: formData.regional_name,
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
          navigation.goBack();
        } else if (res.data.error) {
          setFormData({...formData, validationError: res.data.error});
        } else {
          setFormData({...formData, validationError: 'Please Try again'});
        }
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleTranslate = async () => {
    setLoadingTranslateBtn(true);
    // console.log("formData.name: " + formData.name);
    const translatedText = await translateText(formData.name, 'ta');
    // console.log("translatedText: " + translatedText);
    setFormData({
      ...formData,
      regional_name: translatedText,
    });
    setLoadingTranslateBtn(false);
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
          title={`${type}`}
          titleStyle={CustomStyles.titleStyle}
        />
      </Appbar.Header>
      {loading && (
        <Modal
          transparent={true}
          animationType="none"
          visible={loading}
          onRequestClose={() => {}} // Prevent the modal from closing
        >
          <View style={CustomStyles.overlay}>
            <ActivityIndicator
              size="large"
              animating={true}
              color={COLORS.emerald}
            />
          </View>
        </Modal>
      )}
      <ScrollView contentContainerStyle={CustomStyles.scrollViewContent}>
        <TextInput
          mode="outlined"
          label="Name"
          value={formData.name}
          onChangeText={text =>
            setFormData({
              ...formData,
              name: text,
            })
          }
          style={{margin: 10}}
          outlineColor={COLORS.black}
          textColor={COLORS.black}
          activeOutlineColor={COLORS.primary}
        />
        {data.business_category === 'FlowerShop' && (
          <>
            <Button
              mode="contained"
              onPress={() => {
                handleTranslate();
              }}
              editable={!loadingTranslateBtn}
              style={[CustomStyles.bottomButton, {flex: 1}]}>
              <Text>Translate</Text>
            </Button>
            <TextInput
              mode="outlined"
              label="Regional Name"
              value={formData.regional_name}
              style={{margin: 10}}
              outlineColor={COLORS.black}
              textColor={COLORS.black}
              activeOutlineColor={COLORS.primary}
              editable={false}
            />
          </>
        )}
        <TextInput
          mode="outlined"
          label="Account Code"
          value={formData.account_code}
          onChangeText={text =>
            setFormData({
              ...formData,
              account_code: text,
            })
          }
          style={{margin: 10}}
          outlineColor={COLORS.black}
          textColor={COLORS.black}
          activeOutlineColor={COLORS.primary}
          editable={data.business_category !== 'FlowerShop'}
        />
        <TextInput
          mode="outlined"
          label="Phone No"
          value={formData.phone_no.toString()}
          onChangeText={text =>
            setFormData({
              ...formData,
              phone_no: text,
            })
          }
          style={{margin: 10}}
          outlineColor={COLORS.black}
          textColor={COLORS.black}
          activeOutlineColor={COLORS.primary}
          maxLength={data.business_category !== 'FlowerShop' ? 10 : undefined} // Limit input length
          keyboardType="number-pad"
        />
        {data.business_category !== 'FlowerShop' && (
          <>
            <TextInput
              mode="outlined"
              label="Alt Phone No"
              value={formData.alt_phone_no.toString()}
              onChangeText={text =>
                setFormData({
                  ...formData,
                  alt_phone_no: text,
                })
              }
              style={{margin: 10}}
              outlineColor={COLORS.black}
              textColor={COLORS.black}
              activeOutlineColor={COLORS.primary}
              editable={
                !!(
                  formData.phone_no &&
                  formData.phone_no.toString().length === 10
                )
              } // Disable when phone_no is invalid
              keyboardType="number-pad"
            />
            <TextInput
              mode="outlined"
              label="Email"
              value={formData.email}
              onChangeText={text =>
                setFormData({
                  ...formData,
                  email: text,
                })
              }
              style={{margin: 10}}
              outlineColor={COLORS.black}
              textColor={COLORS.black}
              activeOutlineColor={COLORS.primary}
            />
          </>
        )}

        <TextInput
          mode="outlined"
          label="Address"
          value={formData.address}
          onChangeText={text =>
            setFormData({
              ...formData,
              address: text,
            })
          }
          style={{margin: 10}}
          outlineColor={COLORS.black}
          textColor={COLORS.black}
          activeOutlineColor={COLORS.primary}
        />
        {data.business_category !== 'FlowerShop' && (
          <>
            <TextInput
              mode="outlined"
              label="GSTIN"
              value={formData.gstin}
              onChangeText={text =>
                setFormData({
                  ...formData,
                  gstin: text,
                })
              }
              style={{margin: 10}}
              outlineColor={COLORS.black}
              textColor={COLORS.black}
              activeOutlineColor={COLORS.primary}
            />
            <TextInput
              mode="outlined"
              label="State"
              value={formData.state}
              onChangeText={text =>
                setFormData({
                  ...formData,
                  state: text,
                })
              }
              style={{margin: 10}}
              outlineColor={COLORS.black}
              textColor={COLORS.black}
              activeOutlineColor={COLORS.primary}
            />
            <TextInput
              mode="outlined"
              label="City"
              value={formData.city}
              onChangeText={text =>
                setFormData({
                  ...formData,
                  city: text,
                })
              }
              style={{margin: 10}}
              outlineColor={COLORS.black}
              textColor={COLORS.black}
              activeOutlineColor={COLORS.primary}
            />
            <TextInput
              mode="outlined"
              label="Credit Limit"
              value={formData.credit_limit.toString()}
              onChangeText={text =>
                setFormData({
                  ...formData,
                  credit_limit: text,
                })
              }
              style={{margin: 10}}
              outlineColor={COLORS.black}
              textColor={COLORS.black}
              activeOutlineColor={COLORS.primary}
            />
          </>
        )}

        <View style={CustomStyles.row}>
          <TextInput
            mode="outlined"
            label="Opening Balance"
            value={formData.opening_balance.toString()}
            onChangeText={text =>
              setFormData({
                ...formData,
                opening_balance: text,
              })
            }
            style={{margin: 10, flex: 1}}
            outlineColor={COLORS.black}
            textColor={COLORS.black}
            activeOutlineColor={COLORS.primary}
          />
          <PaperSelect
            label="Debit/Credit"
            textInputMode="outlined"
            containerStyle={{margin: 10, flex: 1}}
            value={formData.debit_credit?.label || ''}
            onSelection={item => {
              if (item.selectedList.length === 0) {
                return;
              }
              setFormData(prevFormData => ({
                ...prevFormData,
                debit_credit: {
                  value: item.selectedList[0]._id,
                  label: item.selectedList[0].value,
                },
              }));
            }}
            arrayList={debitCredtOptions.map(option => ({
              value: option.label,
              _id: option.value,
            }))}
            selectedArrayList={
              formData.debit_credit
                ? [
                    {
                      value: formData.debit_credit.label,
                      _id: formData.debit_credit.value,
                    },
                  ]
                : []
            }
            errorText=""
            multiEnable={false}
          />
        </View>
        <View style={CustomStyles.row}>
          <TextInput
            style={{margin: 10, flex: 9}}
            mode="outlined"
            label="Opening Balance Date"
            placeholderTextColor={COLORS.black}
            activeUnderlineColor={COLORS.primary}
            value={
              formData.invoiceDate !== ''
                ? new Date(formData.invoiceDate).toLocaleDateString('ta-IN')
                : ''
            }
            placeholder="Opening Balance Date"
            editable={false}
          />
          <IconButton
            icon="calendar"
            size={40}
            onPress={() => setShowDatePicker(true)}
            style={{margin: 10, flex: 1}}
          />
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
                    invoiceDate: selectedDate.toISOString(),
                  });
                }
              }}
            />
          )}
        </View>
        <Text style={{color: COLORS.red, padding: 10}}>
          {formData.validationError}
        </Text>
      </ScrollView>
      <View style={CustomStyles.boottomButtonsContainer}>
        <Button
          mode="contained"
          onPress={() => {
            handleSubmit();
          }}
          style={[CustomStyles.bottomButton, {flex: 1}]}>
          <Text>Save</Text>
        </Button>
      </View>
    </View>
  );
};

export default AddEditVendor;

const styles = StyleSheet.create({});
