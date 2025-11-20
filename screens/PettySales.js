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
import {Appbar, Button, ActivityIndicator} from 'react-native-paper';
import {usePettySales} from '../components/PettySalesContext';
import {COLORS, FONTS} from '../constants';
import RNPrint from 'react-native-print';
import GenerateInvoicePrint from '../components/GenerateInvoicePrint';
import Share from 'react-native-share';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import {getPageBreaks} from '../components/calculateUtils';

const screenWidth = Dimensions.get('screen').width;

const PettySales = () => {
  const navigation = useNavigation();
  const {data, columnWidths} = useAuth();
  const {
    formDataHeader,
    setFormDataHeader,
    items,
    setItems,
    formDataFooter,
    setFormDataFooter,
    newPettySales,
    initialProfileData,
    billAmount,
    totalAmt,
    roundOff,
    setBillingType,
  } = usePettySales();

  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState(initialProfileData);
  const [selectedFile, setSelectedFile] = useState(null);
  const [validationError, setValidationError] = useState('');
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSharing, setIsSharing] = useState(false);

  const [imageLogoExists, setImageLogoExists] = useState(false);
  const [imageQRExists, setImageQRExists] = useState(false);
  const [imageCompanySealExists, setImageCompanySealExists] = useState(false);
  const [imageAuthorisedSignatureExists, setImageAuthorisedSignatureExists] =
    useState(false);

  useEffect(() => {
    setBillingType('pettySales');
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

  useEffect(() => {
    const fetchProfileData = async company_name => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/api/getProfile?role=admin&company_name=${company_name}`,
        );
        if (response.data.message) {
          setProfileData(prevFormData => ({
            ...prevFormData,
            username: response.data.message.username,
            email: response.data.message.email,
            phone_no: response.data.message.phone_no,
            country: response.data.message.country,
            state: response.data.message.state,
            city: response.data.message.city,
            address: response.data.message.address,
            pincode: response.data.message.pincode,
            gstin: response.data.message.gstin,
            company_full_name: response.data.message.company_full_name,
            bank_name: response.data.message.bank_name,
            account_no: response.data.message.account_no,
            ifsc_code: response.data.message.ifsc_code,
            branch: response.data.message.branch,
            declaration: response.data.message.declaration,
            image_name: response.data.message.image_name,
            qr_image_name: response.data.message.qr_image_name,
            accountName: response.data.message.accountName,
            panNo: response.data.message.panNo,
            fssi: response.data.message.fssi,
            companySealImageName: response.data.companySealImageName,
            authorisedSignatureImageName:
              response.data.authorisedSignatureImageName,
          }));
        } else {
          console.log('Error: ' + response.data.error);
        }
      } catch (error) {
        console.log('error: ' + error);
      }
    };

    fetchProfileData(data.company_name);
  }, [data.company_name]);

  useEffect(() => {
    const checkImageExists = async () => {
      try {
        const response = await axios.head(
          `${API_BASE_URL}/images/${data.company_name}/${profileData.image_name}`,
        );
        if (response.status === 200) {
          // Image exists
          // console.log('Image Exists');
          setImageLogoExists(true);
        } else {
          // Image does not exist
          // console.log('Image not exists');
          setImageLogoExists(false);
        }
      } catch (error) {
        // Error fetching image
        console.error('Error fetching image:', error);
        setImageLogoExists(false); // Assume image does not exist in case of error
      }
    };

    checkImageExists();
  }, [data.company_name, profileData.image_name]);

  useEffect(() => {
    const checkImageExists = async () => {
      try {
        const response = await axios.head(
          `${API_BASE_URL}/images/${data.company_name}/${profileData.qr_image_name}`,
        );
        if (response.status === 200) {
          // Image exists
          // console.log('Qr Image Exists');
          setImageQRExists(true);
        } else {
          // Image does not exist
          // console.log('Qr Image not exists');
          setImageQRExists(false);
        }
      } catch (error) {
        // Error fetching image
        console.error('Error fetching qr image:', error);
        setImageQRExists(false); // Assume image does not exist in case of error
      }
    };

    checkImageExists();
  }, [data.company_name, profileData.qr_image_name]);

  useEffect(() => {
    const checkImageExists = async () => {
      try {
        const response = await axios.head(
          `${API_BASE_URL}/images/${data.company_name}/${profileData.companySealImageName}`,
        );
        if (response.status === 200) {
          // Image exists
          // console.log('Company Seal Image Exists');
          setImageCompanySealExists(true);
        } else {
          // Image does not exist
          // console.log('Company Seal Image not exists');
          setImageCompanySealExists(false);
        }
      } catch (error) {
        // Error fetching image
        console.error('Error fetching company seal image:', error);
        setImageCompanySealExists(false); // Assume image does not exist in case of error
      }
    };

    checkImageExists();
  }, [data.company_name, profileData.companySealImageName]);

  useEffect(() => {
    const checkImageExists = async () => {
      try {
        const response = await axios.head(
          `${API_BASE_URL}/images/${data.company_name}/${profileData.authorisedSignatureImageName}`,
        );
        if (response.status === 200) {
          // Image exists
          // console.log('Authorised Signature Image Exists');
          setImageAuthorisedSignatureExists(true);
        } else {
          // Image does not exist
          // console.log('Authorised Signature Image not exists');
          setImageAuthorisedSignatureExists(false);
        }
      } catch (error) {
        // Error fetching image
        console.error('Error fetching Authorised Signature image:', error);
        setImageAuthorisedSignatureExists(false); // Assume image does not exist in case of error
      }
    };

    checkImageExists();
  }, [data.company_name, profileData.authorisedSignatureImageName]);

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

  const onClickSubmit = async type => {
    if (type === 'submit') {
      setIsSubmitting(true);
    }
    if (type === 'share') {
      setIsSharing(true);
    }
    setLoading(true);
    if (
      items.length === 0 ||
      items.some(item => !isItemValid(item)) ||
      !formDataHeader.invoiceNo ||
      !formDataHeader.invoiceDate ||
      !formDataHeader.name ||
      !formDataFooter.store ||
      !formDataFooter.mop ||
      !formDataFooter.invoice_print_type
    ) {
      setValidationError('Please fill in all item details.');
      setShowErrorModal(true);
      if (type === 'submit') {
        setIsSubmitting(false);
      }
      if (type === 'share') {
        setIsSharing(false);
      }
      setLoading(false);
      return;
    } else if (
      formDataFooter.mop &&
      formDataFooter.mop.value === 'MIXED' &&
      (Number(formDataFooter.card) === '' || Number(formDataFooter.card) === 0)
    ) {
      setValidationError('Please fill Card Amount');
      setShowErrorModal(true);
      if (type === 'submit') {
        setIsSubmitting(false);
      }
      if (type === 'share') {
        setIsSharing(false);
      }
      setLoading(false);
      return;
    } else if (
      formDataFooter.mop &&
      formDataFooter.mop.value === 'MIXED' &&
      billAmount !== Number(formDataFooter.cash) + Number(formDataFooter.card)
    ) {
      setValidationError('Sum of Cash and Credit not equals to Bill Amount ');
      setShowErrorModal(true);
      if (type === 'submit') {
        setIsSubmitting(false);
      }
      if (type === 'share') {
        setIsSharing(false);
      }
      setLoading(false);
      return;
    } else if (
      formDataFooter.mop &&
      formDataFooter.mop.value === 'MIXED' &&
      !formDataFooter.bank
    ) {
      setValidationError('Please Select Bank');
      setShowErrorModal(true);
      if (type === 'submit') {
        setIsSubmitting(false);
      }
      if (type === 'share') {
        setIsSharing(false);
      }
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post(`${API_BASE_URL}/api/addPettySalesInvoice`, {
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
        newPettySales();
        const pageTitle = 'Sales Invoice';
        let pageSize;
        let additionalPrintStyles;
        switch (formDataFooter.invoice_print_type.value) {
          case 'A4 Size':
            pageSize = '210mm 297mm';
            additionalPrintStyles =
              '@media print{ body::before {content: ""; display: block; position: fixed; top: 30px; left: 30px; width: calc(100% - 60px); height: calc(100% - 60px); border: 1px solid black; box-sizing: border-box; z-index: -1;}}';
            break;
          case 'A4 Landscape':
            pageSize = '297mm 210mm';
            additionalPrintStyles =
              '@media print{ body::before {content: ""; display: block; position: fixed; top: 20px; left: 20px; width: calc(100% - 40px); height: calc(100% - 40px); border: 1px solid black; box-sizing: border-box; z-index: -1;}}';
            break;
          case 'A5 Size':
            // pageSize = "210mm 148mm";
            pageSize = '210mm 297mm';
            additionalPrintStyles =
              '@media print{ body::before {content: ""; display: block; position: fixed; top: 30px; left: 30px; width: calc(210mm - 60px); height: calc(149mm - 60px); border: 1px solid black; box-sizing: border-box; z-index: -1;}}';
            break;
          default:
            pageSize = '80mm 297mm';
            additionalPrintStyles = '';
        }
        const maxLinesPerPage =
          formDataFooter.invoice_print_type.value === 'A5 Size'
            ? data.a5_item_count
            : formDataFooter.invoice_print_type.value === 'A4 Landscape'
            ? data.a4_item_count + 5
            : data.a4_item_count;

        const fontSize =
          formDataFooter.invoice_print_type.value === 'A5 Size' ? 12 : 
          formDataFooter.invoice_print_type.value === 'A4 Landscape' ? 11 : 14;

        const {rowsWithPageBreaks, remainingRowCount} = await getPageBreaks(
          items,
          maxLinesPerPage,
          columnWidths.productCode,
          columnWidths.unit,
          fontSize,
        );

        const invoiceHTML = GenerateInvoicePrint({
          pageTitle,
          pageSize,
          additionalPrintStyles,
          type: 'SALES',
          invoiceType: 'pettySales',
          profileData: profileData,
          invoiceNo: res.data.invoiceNo,
          formDataHeader: formDataHeader,
          items: items,
          formDataFooter: formDataFooter,
          totalAmt: totalAmt,
          billAmount: billAmount,
          roundOff: roundOff,
          company_name: data.company_name,
          imageLogoExists: imageLogoExists,
          imageQRExists: imageQRExists,
          addEstimateAddress: '',
          data,
          columnWidths: columnWidths,
          rowsWithPageBreaks: rowsWithPageBreaks,
          remainingRowCount: remainingRowCount,
          imageCompanySealExists: imageCompanySealExists,
          imageAuthorisedSignatureExists: imageAuthorisedSignatureExists,
        });
        console.log('success');
        if (type === 'submit') {
          await RNPrint.print({
            html: invoiceHTML,
          });
        }
        if (type === 'share') {
          const options = {
            html: invoiceHTML,
            fileName: 'sales_invoice',
            directory: 'Documents',
          };
          const file = await RNHTMLtoPDF.convert(options);
          await Share.open({
            title: 'Share Sales Invoice',
            url: `file://${file.filePath}`,
            type: 'application/pdf',
          });
        }
        navigation.navigate('Billing');
      } else if (res.data.error) {
        setValidationError('Error: ' + res.data.error);
        setShowErrorModal(true);
      }
    } catch (err) {
      console.log(err);
      if (err.message === 'User did not share') {
        console.log('User cancelled sharing');
        setIsSharing(false);
        setSubmitLoading(false);
        navigation.navigate('Billing');
      }
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
            title="Petty Sales Invoice"
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
        <InvoiceHeaderTable type="pettySales"></InvoiceHeaderTable>
        <SalesInvoiceItemsMenu type="pettySales" />
        <InvoiceFooterForAll
          type="pettySales"
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
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <View style={{flex: 1, margin: 10}}>
            <Button
              mode="contained"
              onPress={() => onClickSubmit('submit')}
              disabled={isSubmitting}
              buttonColor={COLORS.emerald}>
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </Button>
          </View>
          <View style={{flex: 1, margin: 10}}>
            <Button
              mode="contained"
              onPress={() => onClickSubmit('share')}
              disabled={isSharing}>
              {isSharing ? 'Sharing...' : 'Share'}
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

export default PettySales;

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
