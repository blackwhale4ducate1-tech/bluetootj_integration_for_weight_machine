import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import React, {useState, useEffect, Fragment, useCallback} from 'react';
import {TextInput, Menu, Divider, List, Button} from 'react-native-paper';
import axios from 'axios';
import {API_BASE_URL} from '../config';
import {useAuth} from './AuthContext';
import {useSales} from './SalesContext';
import {COLORS, FONTS} from '../constants';
import {usePurchase} from './PurchaseContext';
import {useOpeningStock} from './OpeningStockContext';
import OuterBodyModal from './OuterBodyModal';
import AddEditCustomer from './AddEditCustomer';
import AddEditVendor from './AddEditVendor';
import {useEstimate} from './EstimateContext';
import {useNavigation} from '@react-navigation/native';
import {usePettySales} from './PettySalesContext';
import {usePurchaseReturn} from './PurchaseReturnContext';

const screenWidth = Dimensions.get('screen').width;

const SearchCustomerMenu = ({type, billingInvoiceType}) => {
  const {data} = useAuth();
  const navigation = useNavigation();
  let {
    formDataHeader,
    setFormDataHeader,
    searchCustomerInput,
    setSearchCustomerInput,
    initialHeaderFormData,
  } = {};

  if (billingInvoiceType === 'sales' || billingInvoiceType === 'sales_order') {
    ({
      formDataHeader,
      setFormDataHeader,
      searchCustomerInput,
      setSearchCustomerInput,
      initialHeaderFormData,
    } = useSales());
  } else if (billingInvoiceType === 'purchase') {
    ({
      formDataHeader,
      setFormDataHeader,
      searchCustomerInput,
      setSearchCustomerInput,
      initialHeaderFormData,
    } = usePurchase());
  } else if (billingInvoiceType === 'openingStock') {
    ({
      formDataHeader,
      setFormDataHeader,
      searchCustomerInput,
      setSearchCustomerInput,
      initialHeaderFormData,
    } = useOpeningStock());
  } else if (billingInvoiceType === 'estimate') {
    ({
      formDataHeader,
      setFormDataHeader,
      searchCustomerInput,
      setSearchCustomerInput,
      initialHeaderFormData,
    } = useEstimate());
  } else if (billingInvoiceType === 'pettySales') {
    ({
      formDataHeader,
      setFormDataHeader,
      searchCustomerInput,
      setSearchCustomerInput,
      initialHeaderFormData,
    } = usePettySales());
  } else if (billingInvoiceType === 'purchase_return') {
    ({
      formDataHeader,
      setFormDataHeader,
      searchCustomerInput,
      setSearchCustomerInput,
      initialHeaderFormData,
    } = usePurchaseReturn());
  }

  const [searchType, setSearchType] = useState(type);

  const initialFormData = {
    id: '',
    type: searchType === 'purchase' ? 'vendor' : 'client',
    name: '',
    account_code: '',
    regional_name: '',
    phone_no: '',
    alt_phone_no: '',
    email: '',
    address: '',
    gstin: '',
    state: '',
    city: '',
    opening_balance: '',
    invoiceDate: new Date().toISOString().split('T')[0],
    debit_credit: {value: 'DEBIT', label: 'DEBIT'},
    credit_limit: '',
    credit_days: '',
    validationError: '',
  };

  const [menuVisible, setMenuVisible] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);

  const handleChangeCustomerName = async text => {
    setSearchCustomerInput(text);
    setFormDataHeader(prevFormData => ({
      ...prevFormData,
      name: '',
      phoneNo: '',
      gstin: '',
      city: '',
      address: '',
      os: '',
    }));
    try {
      const res = await axios.post(
        `${API_BASE_URL}/api/searchCustomersByInput`,
        {
          searchInput: text,
          type: searchType,
          company_name: data.company_name,
        },
      );
      if (res.data.message) {
        setSearchResults(res.data.message);
      } else {
        setSearchResults([]);
      }
      setMenuVisible(true);
    } catch (err) {
      console.log(err);
    }
  };

  const handleClickRow = async result => {
    try {
      const res = await axios.post(`${API_BASE_URL}/api/getOsByAccountCode`, {
        accountCode: result.account_code,
        company_name: data.company_name,
        invoiceType: billingInvoiceType,
        customerId: result.id,
      });
      osValue = parseFloat(res.data.os.toFixed(2)) || 0;
      repeatCount = res.data.count;
    } catch (err) {
      console.log(err);
    }
    setSearchCustomerInput(result.account_code);
    setFormDataHeader(prevFormData => ({
      ...prevFormData,
      name: result.account_code || '',
      phoneNo: result.phone_no || '',
      gstin: result.gstin || '',
      city: result.city || '',
      address: result.address || '',
      os: osValue,
      count: repeatCount,
    }));
    setMenuVisible(false);
  };

  const handleCloseModal = useCallback(() => {
    setShowAddModal(false);
  }, []);

  const onClickSwith = useCallback(() => {
    if (searchType === 'purchase') {
      setSearchType('sales');
    } else if (searchType === 'sales') {
      setSearchType('purchase');
    }
    setSearchCustomerInput('');
    setSearchResults([]);
  }, [searchType]);

  const onClickAdd = () => {
    setMenuVisible(false);
    if (searchType === 'purchase') {
      navigation.navigate('VendorsStack', {
        screen: 'AddEditVendor',
        params: {type: 'Add Vendor'},
      });
    } else if (searchType === 'sales') {
      navigation.navigate('CustomersStack', {
        screen: 'AddEditCustomer',
        params: {type: 'Add Customer'},
      });
    }
  };

  return (
    <View>
      <Menu
        visible={menuVisible}
        onDismiss={() => setMenuVisible(false)}
        contentStyle={{
          width: screenWidth * 0.9,
          maxHeight: 300,

          marginTop: 90,
          backgroundColor: 'white',
        }}
        anchor={
          <TextInput
            mode="outlined"
            label="* Customer Name"
            placeholder="Search By Customer Name/Phone No"
            onChangeText={handleChangeCustomerName}
            value={searchCustomerInput}
            outlineColor={COLORS.black}
            activeOutlineColor={COLORS.primary}
            style={styles.placeholderTextColor}
          />
        }>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <View style={{flex: 2}}>
            <Button
              mode="contained"
              onPress={onClickSwith}
              style={{margin: 10}}>
              {searchType === 'purchase'
                ? 'Switch to Customer'
                : 'Switch to Vendor'}
            </Button>
          </View>
          <View style={{flex: 1}}>
            <Button mode="contained" onPress={onClickAdd} style={{margin: 10}}>
              Add
            </Button>
          </View>
        </View>
        <ScrollView
          style={{maxHeight: 200, width: '100%'}}
          contentContainerStyle={{flexGrow: 1, justifyContent: 'center'}}>
          {searchResults.map((result, index) => (
            <Fragment key={index}>
              <TouchableOpacity
                onPress={() => {
                  handleClickRow(result);
                  setMenuVisible(false);
                }}>
                <View style={styles.menuItem}>
                  <Text style={styles.name}>{result.account_code}</Text>
                  <Text style={styles.name}>{result.name}</Text>
                  {data.business_category === 'FlowerShop' && (
                    <Text style={styles.name}>{result.regional_name}</Text>
                  )}
                  <Text style={styles.phone}>{result.phone_no}</Text>
                </View>
              </TouchableOpacity>
              {/* <Menu.Item
                onPress={() => {
                  handleClickRow(result);
                  setMenuVisible(false);
                }}
                title={
                  
                }
              /> */}
              {index < searchResults.length - 1 && <Divider />}
            </Fragment>
          ))}
          {searchResults.length === 0 && (
            <Text style={styles.emptyprd}>No Customers found</Text>
          )}
        </ScrollView>
      </Menu>
      <TextInput
        mode="outlined"
        label="Phone No"
        value={(formDataHeader?.phoneNo || '').toString()}
        editable={false}
        outlineColor={COLORS.black}
        activeOutlineColor={COLORS.primary}
        style={styles.placeholderTextColor}
      />
      <OuterBodyModal
        modalTitle={searchType === 'purchase' ? 'Add Vendor' : 'Add Customer'}
        showModal={showAddModal}
        handleClose={handleCloseModal}>
        {searchType === 'purchase' ? (
          <AddEditVendor
            initialFormData={initialFormData}
            type="Add Vendor"
            onHandleSubmit={handleCloseModal}></AddEditVendor>
        ) : (
          <AddEditCustomer
            initialFormData={initialFormData}
            type="Add Customer"
            onHandleSubmit={handleCloseModal}></AddEditCustomer>
        )}
      </OuterBodyModal>
    </View>
  );
};

export default SearchCustomerMenu;

const styles = StyleSheet.create({
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  name: {
    flex: 1,
    marginRight: 10,
    width: 60,
    fontFamily: FONTS.body4.fontFamily,
    color: COLORS.black,
  },
  placeholderTextColor: {
    fontSize: 14,
    marginTop: 30,
  },
  phone: {
    flex: 1,
    textAlign: 'right',
    width: 60,
    fontFamily: FONTS.body4.fontFamily,
    color: COLORS.black,
  },
  emptyprd: {
    fontSize: 14,
    fontFamily: FONTS.body4.fontFamily,
    color: COLORS.red,
    fontWeight: '700',
    textAlign: 'center',
  },
});
