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
import InvoiceHeaderEditTable from '../components/InvoiceHeaderEditTable';
import axios from 'axios';
import OuterBodyModal from '../components/OuterBodyModal';
import {API_BASE_URL} from '../config';
import {useAuth} from '../components/AuthContext';
import InvoiceFooterForAll from '../components/InvoiceFooterForAll';
import CustomStyles from '../components/AddEditModalStyles';
import {useNavigation, useRoute} from '@react-navigation/native';
import {Appbar, TextInput, Button, ActivityIndicator} from 'react-native-paper';
import {COLORS, FONTS} from '../constants';
import ProductionInvoiceItemsEditMenu from '../components/ProductionInvoiceItemsEditMenu';
import {useProduction} from '../components/ProductionContext';

const ProductionEdit = () => {
  const route = useRoute();
  const {invoice_no} = route.params;
  const navigation = useNavigation();
  const {data} = useAuth();
  const {
    formDataHeader,
    setFormDataHeader,
    items,
    setItems,
    formDataFooter,
    setFormDataFooter,
    newProduction,
    finishedTotalCost,
    rawTotalCost,
    barcodeSeries,
    setBarcodeSeries,
    addedBarcodes,
    setBillingType,
  } = useProduction();

  const [submitLoading, setSubmitLoading] = useState(false);
  const [headerLoading, setHeaderLoading] = useState(false);
  const [itemsLoading, setItemsLoading] = useState(false);
  const [footerLoading, setFooterLoading] = useState(false);
  const [validationError, setValidationError] = useState('');
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isLoading =
    submitLoading || headerLoading || itemsLoading || footerLoading;

  useEffect(() => {
    setBillingType('productionEdit');
    setFormDataHeader(prevFormDataHeader => ({
      ...prevFormDataHeader,
      invoiceNo: invoice_no,
    }));
    setFormDataFooter(prevFormDataFooter => ({
      ...prevFormDataFooter,
      tax:
        data.tax_type === 'GST'
          ? {value: 'GST', label: 'GST'}
          : {value: 'IGST', label: 'VAT'},
      user: {id: data.id, username: data.username},
    }));
  }, []);

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

  const onClickSubmit = async type => {
    if (type === 'submit') {
      setIsSubmitting(true);
    }
    setSubmitLoading(true);

    const finishedProducts = items.filter(
      item => item.product_type === 'finished',
    );
    const rawProducts = items.filter(item => item.product_type === 'raw');

    const duplicateProduct = finishedProducts.find(finished =>
      rawProducts.some(raw => raw.productCode === finished.productCode),
    );

    if (duplicateProduct) {
      setValidationError(
        'Raw and Finished products cannot have the same product code.',
      );
      setShowErrorModal(true);
      setIsSubmitting(false);
      setSubmitLoading(false);
      return;
    }

    // Add validation for finished vs raw cost comparison
    const totalRawCost =
      parseFloat(rawTotalCost) +
      (formDataFooter.otherExpenses
        ? parseFloat(formDataFooter.otherExpenses)
        : 0);

    if (parseFloat(finishedTotalCost) < totalRawCost) {
      setValidationError(
        'Finished Total Amount cannot be less than Raw Total Amount + Other Expenses',
      );
      setShowErrorModal(true);
      setIsSubmitting(false);
      setSubmitLoading(false);
      return;
    }

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
        if (type === 'submit') {
          setIsSubmitting(false);
        }
        setSubmitLoading(false);
        return;
      }
    }

    if (
      (data.business_category !== 'FlowerShop' &&
        (items.length === 0 || items.some(item => !isItemValid(item, data)))) ||
      !formDataHeader.invoiceNo ||
      !formDataHeader.invoiceDate ||
      !formDataFooter.store
    ) {
      setValidationError('Please fill in all item details.');
      setShowErrorModal(true);
      if (type === 'submit') {
        setIsSubmitting(false);
      }
      setSubmitLoading(false);
      return;
    }

    const updatedBarcodeSeries = findMaxBarcodeAndAssign(addedBarcodes);
    try {
      const res = await axios.post(`${API_BASE_URL}/api/addProductionInvoice`, {
        type: 'edit',
        invoiceNo: invoice_no,
        formDataHeader: formDataHeader,
        items: items,
        formDataFooter: formDataFooter,
        finishedTotalCost: finishedTotalCost,
        rawTotalCost: rawTotalCost,
        barcodeSeries: updatedBarcodeSeries,
        company_name: data.company_name,
        business_category: data.business_category,
        isBarcodeExistInInvoice: data.is_barcode_exist,
      });
      if (res.data.message) {
        newProduction();
        const pageTitle = 'Production Invoice';
        console.log('success');
        navigation.navigate('Billing');
      } else if (res.data.error) {
        setValidationError('Error: ' + res.data.error);
        setShowErrorModal(true);
      }
    } catch (err) {
      console.log(err);
      if (err.message === 'User did not share') {
        console.log('User cancelled sharing');
        setSubmitLoading(false);
        navigation.navigate('Billing');
      }
    } finally {
      setIsSubmitting(false);
      setSubmitLoading(false);
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
            title="Production Edit Invoice"
            titleStyle={CustomStyles.titleStyle}
          />
        </Appbar.Header>
        {isLoading && (
          <Modal
            transparent={true}
            animationType="none"
            visible={isLoading}
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
        <InvoiceHeaderEditTable
          type="production"
          invoice_no={invoice_no}
          setHeaderLoading={setHeaderLoading}></InvoiceHeaderEditTable>
        <ProductionInvoiceItemsEditMenu
          type="production"
          invoice_no={invoice_no}
          setItemsLoading={setItemsLoading}
        />
        <InvoiceFooterForAll
          type="production"
          invoice_no={invoice_no}
          handleTaxChange={handleTaxChange}
          invoiceFooterType="PurchaseInvoiceFooterEditTable"
          setFooterLoading={setFooterLoading}></InvoiceFooterForAll>
        <View style={{padding: 15, backgroundColor: COLORS.white}}>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>Production Summary</Text>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Finished Total Amount:</Text>
              <View style={[styles.badge, {backgroundColor: COLORS.primary}]}>
                <Text style={styles.badgeText}>{finishedTotalCost}</Text>
              </View>
            </View>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Raw Total Amount:</Text>
              <View style={[styles.badge, {backgroundColor: COLORS.secondary}]}>
                <Text style={styles.badgeText}>{rawTotalCost}</Text>
              </View>
            </View>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Other Expenses:</Text>
              <View style={[styles.badge, {backgroundColor: COLORS.info}]}>
                <Text style={styles.badgeText}>
                  {data.business_category === 'FlowerShop' ? '-' : ''}
                  {formDataFooter.otherExpenses
                    ? parseFloat(formDataFooter.otherExpenses).toFixed(2)
                    : '0.00'}
                </Text>
              </View>
            </View>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>
                Raw Total + Other Expenses:
              </Text>
              <View style={[styles.badge, {backgroundColor: COLORS.warning}]}>
                <Text style={styles.badgeText}>
                  {(
                    parseFloat(rawTotalCost) +
                    (formDataFooter.otherExpenses
                      ? parseFloat(formDataFooter.otherExpenses)
                      : 0)
                  ).toFixed(2)}
                </Text>
              </View>
            </View>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Profit/Loss:</Text>
              <View
                style={[
                  styles.badge,
                  {
                    backgroundColor:
                      parseFloat(finishedTotalCost) -
                        (parseFloat(rawTotalCost) +
                          (formDataFooter.otherExpenses
                            ? parseFloat(formDataFooter.otherExpenses)
                            : 0)) >=
                      0
                        ? COLORS.success
                        : COLORS.danger,
                  },
                ]}>
                <Text style={styles.badgeText}>
                  {(
                    parseFloat(finishedTotalCost) -
                    (parseFloat(rawTotalCost) +
                      (formDataFooter.otherExpenses
                        ? parseFloat(formDataFooter.otherExpenses)
                        : 0))
                  ).toFixed(2)}
                </Text>
              </View>
            </View>
          </View>
        </View>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <View style={{flex: 1, margin: 10}}>
            <Button
              mode="contained"
              onPress={() => onClickSubmit('submit')}
              disabled={isSubmitting}
              buttonColor={COLORS.emerald}>
              {isSubmitting ? 'Updating...' : 'Update'}
            </Button>
          </View>
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

export default ProductionEdit;

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
  summaryCard: {
    backgroundColor: COLORS.white,
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.black,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
    paddingBottom: 12,
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 14,
    color: COLORS.darkGray,
    fontWeight: '500',
  },
  badge: {
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  badgeText: {
    fontSize: 14,
    color: COLORS.white,
    fontWeight: '500',
  },
});
