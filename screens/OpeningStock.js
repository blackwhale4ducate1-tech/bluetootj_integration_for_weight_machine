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
import axios from 'axios';
import OuterBodyModal from '../components/OuterBodyModal';
import {API_BASE_URL} from '../config';
import {useAuth} from '../components/AuthContext';
import InvoiceFooterForAll from '../components/InvoiceFooterForAll';
import CustomStyles from '../components/AddEditModalStyles';
import {useNavigation} from '@react-navigation/native';
import {Appbar, TextInput, ActivityIndicator} from 'react-native-paper';
import {COLORS, FONTS} from '../constants';
import InvoiceHeaderTable from '../components/InvoiceHeaderTable';
import {useOpeningStock} from '../components/OpeningStockContext';
import PurchaseInvoiceItemsMenu from '../components/PurchaseInvoiceItemsMenu';

const screenWidth = Dimensions.get('screen').width;

const OpeningStock = () => {
  const navigation = useNavigation();
  const {data} = useAuth();
  const {
    formDataHeader,
    setFormDataHeader,
    items,
    setItems,
    formDataFooter,
    setFormDataFooter,
    newOpeningStock,
    billAmount,
    totalAmt,
    roundOff,
    setRoundOff,
    barcodeSeries,
    setBarcodeSeries,
    addedBarcodes,
    setBillingType,
  } = useOpeningStock();

  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [validationError, setValidationError] = useState('');
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setBillingType('openingStock');
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
      ? 'opening_stock_items_with_barcode'
      : 'opening_stock_items_without_barcode';

  const findMaxBarcodeAndAssign = barcodes => {
    if (barcodes.length === 0) {
      return barcodeSeries;
    }

    // Find the maximum value from barcodes array
    const maxBarcode = Math.max(...barcodes);

    // Find if maxBarcode exists in items
    const foundItem = items.find(item => item.barcode === maxBarcode);

    if (foundItem) {
      // If the barcode exists in items, return the next available barcode series
      return maxBarcode + 1;
    } else {
      // If the barcode doesn't exist in items, remove it from barcodes and find the next maximum value
      const filteredBarcodes = barcodes.filter(
        barcode => barcode !== maxBarcode,
      );
      // Recursive call to find the next maximum value and check if it exists in items
      return findMaxBarcodeAndAssign(filteredBarcodes);
    }
  };

  const getMOP = async (username, company_name) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/getMopSettings?username=${username}&company_name=${company_name}`,
      );
      setFormDataFooter(selectedOption => ({
        ...selectedOption,
        mop: {value: response.data.purchase, label: response.data.purchase},
        // invoice_print_type: {
        //   value: response.data.purchase_invoice_type,
        //   label: response.data.purchase_invoice_type,
        // },
      }));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getMOP(data.username, data.company_name);
  }, [data.username, data.company_name]);

  const getBarcodeSeries = async company_name => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/getBarcodeSeries?company_name=${company_name}`,
      );
      if (response.data.message) {
        setBarcodeSeries(response.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (data.is_barcode_exist === 1) {
      getBarcodeSeries(data.company_name);
    }
  }, [data.company_name, data.is_barcode_exist]);

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

  const handleCloseErrorModal = useCallback(() => {
    setShowErrorModal(false);
  }, []);

  const onClickSubmit = async () => {
    setIsSubmitting(true);
    setLoading(true);

    if (data.is_barcode_exist === 1) {
      const barcodeMap = new Map();
      let hasDuplicateBarcodeWithDifferentProductCode = false;
      items.forEach(item => {
        if (barcodeMap.has(item.barcode)) {
          if (barcodeMap.get(item.barcode) !== item.productCode) {
            hasDuplicateBarcodeWithDifferentProductCode = true;
            return;
          }
        }
        barcodeMap.set(item.barcode, item.productCode);
      });

      if (hasDuplicateBarcodeWithDifferentProductCode) {
        setValidationError(
          'Barcode should not be same for different products.',
        );
        setShowErrorModal(true);
        setIsSubmitting(false);
        setLoading(false);
        return;
      }
    }

    if (
      items.length === 0 ||
      items.some(item => !isItemValid(item, data)) ||
      !formDataHeader.invoiceNo ||
      !formDataHeader.invoiceDate ||
      !formDataFooter.store ||
      !formDataFooter.mop
    ) {
      setValidationError('Please fill in all item details.');
      setShowErrorModal(true);
      setIsSubmitting(false);
      setLoading(false);
      return;
    }

    const updatedBarcodeSeries = findMaxBarcodeAndAssign(addedBarcodes);
    try {
      const res = await axios.post(
        `${API_BASE_URL}/api/addOpeningStockInvoice`,
        {
          type: '',
          invoiceNo: '',
          formDataHeader: formDataHeader,
          items: items,
          formDataFooter: formDataFooter,
          totalAmt: totalAmt,
          billAmount: billAmount,
          roundOff: roundOff,
          barcodeSeries: updatedBarcodeSeries,
          company_name: data.company_name,
          isBarcodeExistInInvoice: data.is_barcode_exist,
        },
      );
      if (res.data.message) {
        newOpeningStock();
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

  const isItemValid = (item, data) => {
    if (data.is_barcode_exist === 1) {
      return (
        item.barcode &&
        item.productCode &&
        item.productName &&
        item.qty &&
        item.purchasePrice &&
        item.grossAmt &&
        item.taxable &&
        item.subTotal
      );
    } else {
      return (
        item.productCode &&
        item.productName &&
        item.qty &&
        item.purchasePrice &&
        item.grossAmt &&
        item.taxable &&
        item.subTotal
      );
    }
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
            title="Opening Stock"
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
        <InvoiceHeaderTable type="openingStock"></InvoiceHeaderTable>
        <PurchaseInvoiceItemsMenu type="openingStock" />
        <InvoiceFooterForAll
          type="openingStock"
          handleTaxChange={handleTaxChange}
          invoiceFooterType="OpeningStockInvoiceFooterTable"></InvoiceFooterForAll>
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
              <TextInput
                mode="flat"
                value={roundOff.toString()}
                onChangeText={text => setRoundOff(text)}
                style={[
                  styles.footerContent,
                  {paddingVertical: 0, textAlign: 'right'},
                ]}></TextInput>
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

export default OpeningStock;

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
