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

const InvoiceHeaderTable = ({type}) => {
  const {data} = useAuth();
  let formDataHeader, setFormDataHeader;

  if (type === 'sales' || type === 'sales_order') {
    ({formDataHeader, setFormDataHeader} = useSales());
  } else if (type === 'purchase') {
    ({formDataHeader, setFormDataHeader} = usePurchase());
  } else if (type === 'openingStock') {
    ({formDataHeader, setFormDataHeader} = useOpeningStock());
  } else if (type === 'estimate') {
    ({formDataHeader, setFormDataHeader} = useEstimate());
  } else if (type === 'pettySales') {
    ({formDataHeader, setFormDataHeader} = usePettySales());
  } else if (type === 'purchase_return') {
    ({formDataHeader, setFormDataHeader} = usePurchaseReturn());
  } else if (type === 'production') {
    ({formDataHeader, setFormDataHeader} = useProduction());
  }
  const [showDatePicker, setShowDatePicker] = useState(false);

  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || formDataHeader.invoiceDate;
    setShowDatePicker(false);
    setFormDataHeader({...formDataHeader, invoiceDate: currentDate});
  };

  useEffect(() => {
    const getInvoiceNo = async company_name => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/api/getInvoiceSeriesByType?series_name=${type}&company_name=${company_name}`,
        );
        setFormDataHeader(prevFormData => ({
          ...prevFormData,
          invoiceNo: response.data.next_number,
        }));
      } catch (error) {
        console.log(error);
      }
    };

    getInvoiceNo(data.company_name);
  }, [type, setFormDataHeader, data.company_name]);

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <View style={styles.arrowContainer}>
          <PrevNextInvoice
            invoice_no={formDataHeader.invoiceNo}
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
            isEdit="0"
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

export default InvoiceHeaderTable;

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
