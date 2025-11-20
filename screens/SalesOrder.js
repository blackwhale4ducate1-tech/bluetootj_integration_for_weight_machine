import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Modal,
} from 'react-native';
import {useEffect, useState, useMemo, useCallback} from 'react';
import InvoiceHeaderTable from '../components/InvoiceHeaderTable';
import axios from 'axios';
import OuterBodyModal from '../components/OuterBodyModal';
import {API_BASE_URL} from '../config';
import {useAuth} from '../components/AuthContext';
import SalesInvoiceItemsMenu from '../components/SalesInvoiceItemsMenu';
import InvoiceFooterForAll from '../components/InvoiceFooterForAll';
import CustomStyles from '../components/AddEditModalStyles';
import {useNavigation} from '@react-navigation/native';
import {Appbar, ActivityIndicator} from 'react-native-paper';
import {useSales} from '../components/SalesContext';
import {COLORS, FONTS} from '../constants';

const screenWidth = Dimensions.get('screen').width;

const SalesOrder = () => {
  const navigation = useNavigation();
  const {data} = useAuth();
  const {
    formDataHeader,
    setFormDataHeader,
    items,
    setItems,
    formDataFooter,
    setFormDataFooter,
    newSales,
    billAmount,
    totalAmt,
    roundOff,
    setBillingType,
  } = useSales();

  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [validationError, setValidationError] = useState('');
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setBillingType('salesOrder');
    setFormDataFooter({
      ...formDataFooter,
      tax:
        data.tax_type === 'GST'
          ? {value: 'GST', label: 'GST'}
          : {value: 'IGST', label: 'VAT'},
      user: {id: data.id, username: data.username},
    });
  }, []);

  const templateType =
    data.is_barcode_exist === 1
      ? 'sales_items_with_barcode'
      : 'sales_items_without_barcode';

  const getMOP = async (username, company_name) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/getMopSettings?username=${username}&company_name=${company_name}`,
      );
      setFormDataFooter(selectedOption => ({
        ...selectedOption,
        mop: {value: response.data.sales, label: response.data.sales},
        invoice_print_type: {
          value: response.data.sales_invoice_type,
          label: response.data.sales_invoice_type,
        },
      }));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getMOP(data.username, data.company_name);
  }, [data.username, data.company_name]);

  const handleTaxChange = selectedOption => {
    // Update the tax value in formDataFooter state
    setFormDataFooter(prevData => ({
      ...prevData,
      tax: selectedOption,
    }));

    let cgst = 0;
    let sgst = 0;
    let igst = 0;
    let subTotal = 0;

    const updatedItems = items.map(item => {
      if (selectedOption.value === 'GST') {
        cgst = ((Number(item.taxable) * item.cgstP) / 100).toFixed(2);
        sgst = ((Number(item.taxable) * item.sgstP) / 100).toFixed(2);
      } else if (selectedOption.value === 'IGST') {
        igst = ((Number(item.taxable) * item.igstP) / 100).toFixed(2);
      }
      subTotal = (
        Number(item.taxable) +
        Number(cgst) +
        Number(sgst) +
        Number(igst)
      ).toFixed(2);
      return {
        ...item,
        selectedTax: selectedOption.value,
        cgst,
        sgst,
        igst,
        subTotal,
      };
    });
    setItems(updatedItems);
  };

  const calculateRowValues = useCallback(
    item => {
      // console.log("item: " + JSON.stringify(item));
      const qty = parseFloat(item.qty) || 0;
      const salesPrice = parseFloat(item.newSalesPrice) || 0;
      const salesInclusive = item.salesInclusive || 0;
      let cost = 0;
      // const discount = parseFloat(item.discount) || 0;
      const cgstP = parseFloat(item.cgstP) || 0;
      const sgstP = parseFloat(item.sgstP) || 0;
      const igstP = parseFloat(item.igstP) || 0;
      let cgst = 0;
      let sgst = 0;
      let igst = 0;

      if (salesInclusive === 1) {
        cost = Number(salesPrice / (1 + igstP / 100)).toFixed(2);
      } else {
        cost = salesPrice;
      }
      const grossAmt = (Number(qty) * cost).toFixed(2);
      const discount = (item.discountP * grossAmt) / 100;
      const taxable = (Number(grossAmt) - discount).toFixed(2);

      if (
        (data.itemwise_tax === 'not allow' &&
          formDataFooter.tax.value === 'GST') ||
        (data.itemwise_tax === 'allow' && item.selectedTax === 'GST')
      ) {
        cgst = ((Number(taxable) * cgstP) / 100).toFixed(2);
        sgst = ((Number(taxable) * sgstP) / 100).toFixed(2);
      } else if (
        (data.itemwise_tax === 'not allow' &&
          formDataFooter.tax.value === 'IGST') ||
        (data.itemwise_tax === 'allow' && item.selectedTax === 'IGST')
      ) {
        igst = ((Number(taxable) * igstP) / 100).toFixed(2);
      }
      const subTotal = (
        Number(taxable) +
        Number(cgst) +
        Number(sgst) +
        Number(igst)
      ).toFixed(2);

      return {
        ...item,
        cost,
        grossAmt,
        taxable,
        cgst,
        sgst,
        igst,
        discount: discount.toFixed(2),
        subTotal,
      };
    },
    [formDataFooter.tax.value, data.itemwise_tax],
  );

  const handlePriceListChange = selectedOption => {
    // Update the tax value in formDataFooter state
    setFormDataFooter(prevData => ({
      ...prevData,
      priceList: selectedOption,
    }));

    const updatedItems = items.map(item => {
      let salesPrice;
      let newSalesPrice;
      let unitSalesPrice;

      if (!item.selectedUnit || item.selectedUnit === item.unit) {
        unitSalesPrice = item.dynamicColumns[selectedOption.value];
      } else if (!item.selectedUnit || item.selectedUnit === item.alt_unit) {
        unitSalesPrice =
          item.dynamicColumns[selectedOption.value] / item.uc_factor;
      }
      salesPrice = unitSalesPrice ? parseFloat(unitSalesPrice).toFixed(2) : '';
      newSalesPrice = item.dynamicColumns[selectedOption.value];
      let updatedItem = {...item, newSalesPrice, salesPrice};

      return {
        ...updatedItem,
        ...calculateRowValues(updatedItem),
      };
    });
    setItems(updatedItems);
  };

  const handleCloseErrorModal = useCallback(() => {
    setShowErrorModal(false);
  }, []);

  const onClickSubmit = async () => {
    setIsSubmitting(true);
    setLoading(true);
    if (
      items.length === 0 ||
      items.some(item => !isItemValid(item)) ||
      !formDataHeader.invoiceNo ||
      !formDataHeader.invoiceDate ||
      !formDataHeader.name ||
      !formDataFooter.store
    ) {
      setValidationError('Please fill in all item details.');
      setShowErrorModal(true);
      setIsSubmitting(false);
      setLoading(false);
      return;
    } else if (
      formDataFooter.mop &&
      formDataFooter.mop.value === 'MIXED' &&
      (Number(formDataFooter.card) === '' || Number(formDataFooter.card) === 0)
    ) {
      setValidationError('Please fill Card Amount');
      setShowErrorModal(true);
      setIsSubmitting(false);
      setLoading(false);
      return;
    } else if (
      formDataFooter.mop &&
      formDataFooter.mop.value === 'MIXED' &&
      billAmount !== Number(formDataFooter.cash) + Number(formDataFooter.card)
    ) {
      setValidationError('Sum of Cash and Credit not equals to Bill Amount ');
      setShowErrorModal(true);
      setIsSubmitting(false);
      setLoading(false);
      return;
    } else if (
      formDataFooter.mop &&
      formDataFooter.mop.value === 'MIXED' &&
      !formDataFooter.bank
    ) {
      setValidationError('Please Select Bank');
      setShowErrorModal(true);
      setIsSubmitting(false);
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post(`${API_BASE_URL}/api/addSalesOrderInvoice`, {
        type: '',
        invoiceNo: '',
        formDataHeader: formDataHeader,
        items: items,
        formDataFooter: formDataFooter,
        totalAmt: totalAmt,
        billAmount: billAmount,
        roundOff: roundOff,
        company_name: data.company_name,
      });
      if (res.data.message) {
        newSales();
        console.log('success');
        navigation.navigate('Billing');
      } else if (res.data.error) {
        setValidationError('Error: ' + res.data.error);
        setShowErrorModal(true);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setIsSubmitting(false);
      setLoading(false);
    }
  };

  const isItemValid = item => {
    return (
      item.productCode &&
      item.productName &&
      item.qty &&
      item.salesPrice &&
      item.grossAmt &&
      item.taxable &&
      item.subTotal
    );
  };

  return (
    <View>
      <ScrollView contentContainerStyle={{backgroundColor: COLORS.white}}>
        <Appbar.Header style={CustomStyles.appHeader}>
          <Appbar.BackAction
            onPress={() => {
              navigation.navigate('Billing');
            }}
            color={COLORS.white}
          />
          <Appbar.Content
            title="Sales Order Invoice"
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
        <InvoiceHeaderTable type="sales_order"></InvoiceHeaderTable>
        <SalesInvoiceItemsMenu type="sales_order" />
        <InvoiceFooterForAll
          type="sales_order"
          handleTaxChange={handleTaxChange}
          handlePriceListChange={handlePriceListChange}
          invoiceFooterType="SalesInvoiceFooterTable"></InvoiceFooterForAll>
        <View style={{flexDirection: 'row', justifyContent: 'center'}}>
          <View style={{width: screenWidth * 0.95}}>
            <View style={styles.footerContent}>
              <Text style={styles.footerText}>Total Amount : </Text>
              <Text style={styles.footerText}>{totalAmt}</Text>
            </View>

            <View style={styles.footerContent}>
              <Text style={styles.footerText}> Discount : </Text>
              <Text style={styles.footerText}>
                {' '}
                -{' '}
                {formDataFooter.discountOnTotal
                  ? parseFloat(formDataFooter.discountOnTotal).toFixed(2)
                  : '0.00'}
              </Text>
            </View>

            <View style={styles.footerContent}>
              <Text style={styles.footerText}>Other Expenses : </Text>
              <Text style={styles.footerText}>
                {' '}
                {formDataFooter.otherExpenses
                  ? parseFloat(formDataFooter.otherExpenses).toFixed(2)
                  : '0.00'}
              </Text>
            </View>

            <View style={styles.footerContent}>
              <Text style={styles.footerText}>Round Off : </Text>
              <Text style={styles.footerText}>{roundOff}</Text>
            </View>

            <View style={styles.footerContent}>
              <Text style={styles.footerText}>Bill Amount : </Text>
              <Text style={styles.footerText}>{billAmount}</Text>
            </View>
          </View>
        </View>
        <View
          style={{
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <TouchableOpacity
            style={CustomStyles.addButton}
            onPress={() => onClickSubmit()}
            disabled={isSubmitting}>
            <Text style={CustomStyles.addButtonText}>
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </Text>
          </TouchableOpacity>
        </View>

        <OuterBodyModal
          modalTitle="Alert"
          showModal={showErrorModal}
          handleClose={handleCloseErrorModal}>
          <View>
            <Text style={styles.errorText}>{validationError}</Text>
            <TouchableOpacity
              style={CustomStyles.addButton}
              onPress={() => handleCloseErrorModal()}>
              <Text style={CustomStyles.addButtonText}>Ok</Text>
            </TouchableOpacity>
          </View>
        </OuterBodyModal>
      </ScrollView>
    </View>
  );
};

export default SalesOrder;

const styles = StyleSheet.create({
  footerText: {
    fontSize: 14,
    fontFamily: FONTS.body4.fontFamily,
    color: COLORS.black,
    fontWeight: '700',
    paddingVertical: 5,
  },
  footerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  errorText: {
    fontSize: 14,
    fontFamily: FONTS.body4.fontFamily,
    color: COLORS.red,
    fontWeight: '700',
    paddingVertical: 25,
    textAlign: 'center',
  },
});
