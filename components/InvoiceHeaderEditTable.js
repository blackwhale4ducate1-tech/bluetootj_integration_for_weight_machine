// Import necessary components
import React, {useEffect, useState} from 'react';
import {View, TouchableOpacity, StyleSheet} from 'react-native';
import axios from 'axios';
import {API_BASE_URL} from '../config';
import {useAuth} from './AuthContext';
import DateTimePicker from '@react-native-community/datetimepicker';
import {TextInput} from 'react-native-paper';
import SearchCustomerMenu from './SearchCustomerMenu';
import {useSales} from './SalesContext';
import {COLORS} from '../constants';
import {usePurchase} from './PurchaseContext';
import {useOpeningStock} from './OpeningStockContext';
import {useEstimate} from './EstimateContext';
import {usePettySales} from './PettySalesContext';
import {usePurchaseReturn} from './PurchaseReturnContext';
import {useProduction} from './ProductionContext';
import PrevNextInvoice from './PrevNextInvoice';

const InvoiceHeaderEditTable = ({type, invoice_no, setHeaderLoading}) => {
  const {data} = useAuth();
  let formDataHeader, setFormDataHeader, setSearchCustomerInput;

  //   console.log('type in InvoiceHeaderEdit: ' + type);

  if (type === 'sales' || type === 'sales_order') {
    ({formDataHeader, setFormDataHeader, setSearchCustomerInput} = useSales());
  } else if (type === 'purchase') {
    ({formDataHeader, setFormDataHeader, setSearchCustomerInput} =
      usePurchase());
  } else if (type === 'openingStock') {
    ({formDataHeader, setFormDataHeader, setSearchCustomerInput} =
      useOpeningStock());
  } else if (type === 'estimate') {
    ({formDataHeader, setFormDataHeader, setSearchCustomerInput} =
      useEstimate());
  } else if (type === 'pettySales') {
    ({formDataHeader, setFormDataHeader, setSearchCustomerInput} =
      usePettySales());
  } else if (type === 'purchase_return') {
    ({formDataHeader, setFormDataHeader, setSearchCustomerInput} =
      usePurchaseReturn());
  } else if (type === 'production') {
    ({formDataHeader, setFormDataHeader, setSearchCustomerInput} =
      useProduction());
  }
  const [showDatePicker, setShowDatePicker] = useState(false);

  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || formDataHeader.invoiceDate;
    setShowDatePicker(false);
    setFormDataHeader({...formDataHeader, invoiceDate: currentDate});
  };

  useEffect(() => {
    const getInvoiceHeaderData = async company_name => {
      if (!invoice_no) {
        console.log('Invoice number is undefined, skipping header data fetch');
        return;
      }
      
      setHeaderLoading(true);
      try {
        // console.log('formDataHeader: ' + JSON.stringify(formDataHeader));
        const response = await axios.get(
          `${API_BASE_URL}/api/getInvoiceHeaderData?type=${type}&invoiceNo=${invoice_no}&company_name=${company_name}`,
        );
        // console.log('response.data: ' + JSON.stringify(response.data));
        // console.log('invoice Date: ' + new Date(response.data.invoice_date));
        setSearchCustomerInput(response.data.account_code);
        setFormDataHeader(prevFormData => ({
          ...prevFormData,
          invoiceNo: invoice_no, // Ensure invoice_no is maintained in formDataHeader
          invoiceDate: new Date(response.data.invoice_date),
          customInvoiceNo: response.data.custom_invoice_no,
          ...(type !== 'production' && {
            name: response.data.account_code,
            phoneNo: response.data.phone_no,
            gstin: response.data.gstin,
            city: response.data.city,
            address: response.data.address,
            os: parseFloat(response.data.os?.toFixed(2)),
            count: response.data.repeatCount,
          }),
        }));
      } catch (error) {
        console.log(error);
      } finally {
        setHeaderLoading(false);
      }
    };

    if (data && data.company_name && invoice_no) {
      getInvoiceHeaderData(data.company_name);
    }
    // eslint-disable-next-line
  }, [invoice_no, data.company_name]);
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <View style={styles.arrowContainer}>
          <PrevNextInvoice
            invoice_no={invoice_no}
            series_name={type}
            navigateTo={
              type === 'sales'
                ? 'Sales'
                : type === 'sales_order'
                ? 'SalesOrder'
                : type === 'purchase'
                ? 'Purchase'
                : type === 'openingStock'
                ? 'OpeningStock'
                : type === 'estimate'
                ? 'Estimate'
                : type === 'pettySales'
                ? 'PettySales'
                : type === 'purchase_return'
                ? 'PurchaseReturn'
                : type === 'sales_return'
                ? 'SalesReturn'
                : type === 'production'
                ? 'Production'
                : ''
            }
            navigateToEdit={
              type === 'sales'
                ? 'SalesEdit'
                : type === 'sales_order'
                ? 'SalesOrderEdit'
                : type === 'purchase'
                ? 'PurchaseEdit'
                : type === 'openingStock'
                ? 'OpeningStockEdit'
                : type === 'estimate'
                ? 'EstimateEdit'
                : type === 'pettySales'
                ? 'PettySalesEdit'
                : type === 'purchase_return'
                ? 'PurchaseReturnEdit'
                : type === 'sales_return'
                ? 'SalesReturnEdit'
                : type === 'production'
                ? 'ProductionEdit'
                : ''
            }
            isEdit="1"
          />
        </View>
        <View style={{flex: 1, marginRight: 10}}>
          <TextInput
            label="Invoice No"
            value={formDataHeader.invoiceNo.toString()}
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
              value={formDataHeader.invoiceDate
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
      {type !== 'production' && (
        <SearchCustomerMenu
          type={
            ['sales', 'sales_order', 'estimate', 'pettySales'].includes(type)
              ? 'sales'
              : ['purchase', 'openingStock', 'purchase_return'].includes(type)
              ? 'purchase'
              : type
          }
          billingInvoiceType={type}
        />
      )}
      {/* Date Picker */}
      {showDatePicker && (
        <DateTimePicker
          value={formDataHeader.invoiceDate}
          mode="date"
          is24Hour={true}
          display="default"
          onChange={onChangeDate}
        />
      )}
    </View>
  );
};

export default InvoiceHeaderEditTable;

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
  
  arrowContainer: {
    width: 80,
    marginRight: 10,
  },
});
