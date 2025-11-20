import {StyleSheet, Text, View, TextInput, Dimensions} from 'react-native';
import React, {useState, useEffect} from 'react';
import {Picker} from '@react-native-picker/picker';
import axios from 'axios';
import {API_BASE_URL} from '../config';
import {useAuth} from './AuthContext';
import CustomStyles from './AddEditModalStyles';
import {COLORS} from '../constants';

const screenWidth = Dimensions.get('screen').width;

const SalesInvoiceFooterEditTable = ({
  type,
  invoice_no,
  formData,
  updateFormData,
  totalAmt,
  handleTaxChange,
  handlePriceListChange,
  setFooterLoading,
}) => {
  const {data} = useAuth();

  const [selectedDiscountType, setSelectedDiscountType] = useState(
    formData.discountType,
  );
  const [storeOptions, setStoreOptions] = useState([]);
  const [bankOptions, setBankOptions] = useState([]);
  const [discountInput, setDiscountInput] = useState(formData.discountInput);
  const [userOptions, setUserOptions] = useState([]);
  const [priceListOptions, setPriceListOptions] = useState([]);

  const discountOptions = [
    {value: 'Discount %', label: 'Discount %'},
    {value: 'Discount Price', label: 'Discount Price'},
  ];
  const mopOptions = [
    {value: 'CASH', label: 'CASH'},
    {value: 'CREDIT', label: 'CREDIT'},
    {value: 'MIXED', label: 'MIXED'},
  ];
  const taxOptions =
    data.tax_type === 'VAT'
      ? [{value: 'IGST', label: 'VAT'}]
      : [
          {value: 'GST', label: 'GST'},
          {value: 'IGST', label: 'IGST'},
          {value: 'Non Tax', label: 'Non Tax'},
        ];

  // Fetch user data and populate userOptions
  useEffect(() => {
    const fetchUsers = async company_name => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/api/getUsers?company_name=${company_name}`,
        );
        const users = response.data.map(user => ({
          value: user.id,
          label: user.username,
        }));
        setUserOptions(users);
      } catch (error) {
        console.log(error);
      }
    };
    fetchUsers(data.company_name);
  }, [data.company_name]);

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

  const getBanks = async company_name => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/getBanks?company_name=${company_name}`,
      );
      const data = response.data;
      const bankOptions = data.map(item => ({
        value: item,
        label: item,
      }));
      setBankOptions(bankOptions);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getBanks(data.company_name);
  }, [data.company_name]);

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

  useEffect(() => {
    const getInvoiceFooterData = async company_name => {
      setFooterLoading(true);
      try {
        const response = await axios.get(
          `${API_BASE_URL}/api/getInvoiceFooterData?type=${type}&invoiceNo=${invoice_no}&company_name=${company_name}`,
        );
        if (response.data.discount_type !== '') {
          setSelectedDiscountType({
            value: response.data.discount_type,
            label: response.data.discount_type,
          });
          setDiscountInput(response.data.discount_input);
        } else {
          setSelectedDiscountType(null);
          setDiscountInput('');
        }
        updateFormData(prevFormData => ({
          ...prevFormData,
          discountType:
            response.data.discount_type !== ''
              ? {
                  value: response.data.discount_type,
                  label: response.data.discount_type,
                }
              : null,
          discountInput:
            response.data.discount_type !== ''
              ? response.data.discount_input
              : '',
          discountOnTotal: response.data.discount_on_total,
          mop: {value: response.data.mop, label: response.data.mop},
          otherExpenses: response.data.other_expenses,
          tax: {
            value: response.data.tax_type,
            label:
              response.data.tax_type === 'IGST' && data.tax_type === 'VAT'
                ? 'VAT'
                : response.data.tax_type,
          },
          priceList: {
            value: response.data.price_list,
            label: response.data.price_list,
          },
          cash: response.data.cash,
          card: response.data.card,
          bank: {value: response.data.bank, label: response.data.bank},
          tenderedAmt: response.data.tendered_amt,
          balance: response.data.balance,
          store: {
            value: response.data.store_id,
            label: response.data.store_name,
          },
          user: {id: response.data.user_id, username: response.data.username},
          narration: response.data.narration,
          shippingAddress: response.data.shippingAddress,
        }));
      } catch (error) {
        console.log(error);
      } finally {
        setFooterLoading(false);
      }
    };

    getInvoiceFooterData(data.company_name);
    // eslint-disable-next-line
  }, []);

  const handleMopChange = selectedOption => {
    updateFormData(prevData => ({
      ...prevData,
      mop: selectedOption,
      cash: '',
      card: '',
      bank: null,
    }));
  };

  useEffect(() => {
    if (selectedDiscountType) {
      if (selectedDiscountType.value === 'Discount %') {
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
      updateFormData(prevData => ({
        ...prevData,
        discountType: selectedDiscountType || null,
        discountInput: discountInput,
        discountOnTotal: 0.0,
      }));
    }
  }, [selectedDiscountType, discountInput, totalAmt, updateFormData]);

  return (
    <View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: screenWidth * 0.8,
        }}>
        <View>
          <Text style={CustomStyles.labelInput}>Discount :</Text>
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
                style={{
                  width: 160,
                  backgroundColor: COLORS.inputbggreen,
                  color: COLORS.black,
                }}
                dropdownIconColor={COLORS.black}>
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
          <Text style={CustomStyles.labelInput}>Discount Input :</Text>
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
            editable={selectedDiscountType !== null}
          />
        </View>
      </View>

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
                  }}
                  dropdownIconColor={COLORS.black}>
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
          <Text style={CustomStyles.labelInput}>MOP :</Text>
          <View>
            <View>
              <Picker
                selectedValue={formData.mop ? formData.mop.value : null}
                onValueChange={(itemValue, itemIndex) => {
                  const selectedOption = mopOptions.find(
                    option => option.value === itemValue,
                  );
                  handleMopChange(selectedOption);
                }}
                style={{
                  width: 130,
                  marginLeft: 10,
                  backgroundColor: COLORS.inputbggreen,
                  color: COLORS.black,
                }}
                dropdownIconColor={COLORS.black}>
                {/* <Picker.Item label="-- Select --" value={null} /> */}
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
      </View>

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: screenWidth * 0.8,
        }}>
        <View style={CustomStyles.inputContainer}>
          <Text style={CustomStyles.labelInput}>Cash :</Text>
          <TextInput
            style={{
              width: 150,
              backgroundColor: COLORS.inputbggreen,
              color: COLORS.black,
            }}
            mode="flat"
            placeholderTextColor={COLORS.black}
            activeUnderlineColor={COLORS.primary}
            value={formData.cash.toString()}
            onChangeText={text =>
              updateFormData(prevData => ({
                ...prevData,
                cash: text,
              }))
            }
            keyboardType="numeric"
            editable={!(formData.mop && formData.mop.value !== 'MIXED')}
          />
        </View>
        <View style={CustomStyles.inputContainer}>
          <Text style={CustomStyles.labelInput}>Card :</Text>
          <TextInput
            style={{
              width: 150,
              marginLeft: 10,
              backgroundColor: COLORS.inputbggreen,
              color: COLORS.black,
            }}
            mode="flat"
            placeholderTextColor={COLORS.black}
            activeUnderlineColor={COLORS.primary}
            value={formData.card.toString()}
            onChangeText={text =>
              updateFormData(prevData => ({
                ...prevData,
                card: text,
              }))
            }
            keyboardType="numeric"
            editable={!(formData.mop && formData.mop.value !== 'MIXED')}
          />
        </View>
      </View>

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: screenWidth * 0.8,
        }}>
        <View>
          <Text style={CustomStyles.labelInput}>Bank :</Text>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <View>
              <Picker
                selectedValue={formData.bank ? formData.bank.value : null}
                onValueChange={(itemValue, itemIndex) => {
                  const selectedOption = bankOptions.find(
                    option => option.value === itemValue,
                  );
                  updateFormData(prevData => ({
                    ...prevData,
                    bank: selectedOption,
                  }));
                }}
                enabled={!(formData.mop && formData.mop.value !== 'MIXED')}
                style={{
                  width: 140,
                  backgroundColor: COLORS.inputbggreen,
                  color: COLORS.black,
                }}
                dropdownIconColor={COLORS.black}>
                <Picker.Item label="-- Select --" value={null} />
                {bankOptions.map(option => (
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
          <Text style={[CustomStyles.labelInput]}>Cash Payment :</Text>
          <TextInput
            style={{
              width: 160,
              marginLeft: 5,
              backgroundColor: COLORS.inputbggreen,
              color: COLORS.black,
            }}
            mode="flat"
            placeholderTextColor={COLORS.black}
            activeUnderlineColor={COLORS.primary}
            value={formData.tenderedAmt.toString()}
            onChangeText={text =>
              updateFormData(prevData => ({
                ...prevData,
                tenderedAmt: text,
              }))
            }
            keyboardType="numeric"
          />
        </View>
      </View>

      <View style={CustomStyles.inputContainer}>
        <Text style={CustomStyles.labelInput}>Balance :</Text>
        <TextInput
          style={{
            backgroundColor: COLORS.inputbggreen,
            padding: 10,
            color: COLORS.black,
          }}
          mode="flat"
          placeholderTextColor={COLORS.black}
          activeUnderlineColor={COLORS.primary}
          value={formData.balance.toString()}
          onChangeText={text =>
            updateFormData(prevData => ({
              ...prevData,
              balance: text,
            }))
          }
          keyboardType="numeric"
          editable={false}
        />
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
          <Text style={CustomStyles.labelInput}>PriceList :</Text>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <View>
              <Picker
                selectedValue={
                  formData.priceList ? formData.priceList.value : null
                }
                onValueChange={(itemValue, itemIndex) => {
                  const selectedOption = priceListOptions.find(
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
                }}
                dropdownIconColor={COLORS.black}>
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
        <View style={CustomStyles.inputContainer}>
          <Text style={CustomStyles.labelInput}>Created By User :</Text>
          <View>
            <View>
              <Picker
                selectedValue={formData.user.id ? formData.user.id : null}
                onValueChange={(itemValue, itemIndex) => {
                  const selectedOption = userOptions.find(
                    option => option.value === itemValue,
                  );
                  updateFormData(prevData => ({
                    ...prevData,
                    user: {
                      id: selectedOption.value,
                      username: selectedOption.label,
                    },
                  }));
                }}
                style={{
                  width: 130,
                  marginLeft: 10,
                  backgroundColor: COLORS.inputbggreen,
                  color: COLORS.black,
                }}
                dropdownIconColor={COLORS.black}
                enabled={data.role === 'admin'}>
                {/* <Picker.Item label="-- Select --" value={null} /> */}
                {userOptions.map(option => (
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
          <Text style={CustomStyles.labelInput}>Narration :</Text>
          <TextInput
            style={{backgroundColor: COLORS.inputbggreen, color: COLORS.black}}
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
        {data.isShippingAddressExist === 1 && (
          <View style={CustomStyles.inputContainer}>
            <Text style={CustomStyles.labelInput}>Shipping Address :</Text>
            <TextInput
              style={{
                backgroundColor: COLORS.inputbggreen,
                color: COLORS.black,
              }}
              mode="flat"
              placeholderTextColor={COLORS.black}
              activeUnderlineColor={COLORS.primary}
              value={formData.shippingAddress}
              onChangeText={text =>
                updateFormData(prevData => ({
                  ...prevData,
                  shippingAddress: text,
                }))
              }
              multiline={true}
            />
          </View>
        )}
      </View>
    </View>
  );
};

export default SalesInvoiceFooterEditTable;

const styles = StyleSheet.create({});
