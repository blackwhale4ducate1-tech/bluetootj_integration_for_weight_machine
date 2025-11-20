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
import PurchaseInvoiceItemsEditMenu from '../components/PurchaseInvoiceItemsEditMenu';
import InvoiceFooterForAll from '../components/InvoiceFooterForAll';
import CustomStyles from '../components/AddEditModalStyles';
import {useNavigation, useRoute} from '@react-navigation/native';
import {Appbar, TextInput, Button, ActivityIndicator} from 'react-native-paper';
import {COLORS, FONTS} from '../constants';
import {usePurchase} from '../components/PurchaseContext';
import RNPrint from 'react-native-print';
import GenerateInvoicePrint from '../components/GenerateInvoicePrint';
import Share from 'react-native-share';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import {getPageBreaks} from '../components/calculateUtils';

const screenWidth = Dimensions.get('screen').width;

const PurchaseEdit = () => {
  const route = useRoute();
  const {invoice_no} = route.params;
  const navigation = useNavigation();
  const {data, columnWidths} = useAuth();
  const {
    formDataHeader,
    setFormDataHeader,
    items,
    setItems,
    formDataFooter,
    setFormDataFooter,
    newPurchase,
    initialProfileData,
    billAmount,
    totalAmt,
    roundOff,
    setRoundOff,
    barcodeSeries,
    setBarcodeSeries,
    addedBarcodes,
    setBillingType,
  } = usePurchase();

  const [submitLoading, setSubmitLoading] = useState(false);
  const [headerLoading, setHeaderLoading] = useState(false);
  const [itemsLoading, setItemsLoading] = useState(false);
  const [footerLoading, setFooterLoading] = useState(false);
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

  const isLoading =
    submitLoading || headerLoading || itemsLoading || footerLoading;

  useEffect(() => {
    setBillingType('purchaseEdit');
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

  const templateType =
    data.is_barcode_exist === 1
      ? 'purchase_items_with_barcode'
      : 'purchase_items_without_barcode';

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
        invoice_print_type: {
          value: response.data.purchase_invoice_type,
          label: response.data.purchase_invoice_type,
        },
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
    setSubmitLoading(true);

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
        if (type === 'share') {
          setIsSharing(false);
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
      setSubmitLoading(false);
      return;
    }

    const updatedBarcodeSeries = findMaxBarcodeAndAssign(addedBarcodes);
    try {
      const res = await axios.post(`${API_BASE_URL}/api/addPurchaseInvoice`, {
        type: 'edit',
        invoiceNo: invoice_no,
        formDataHeader: formDataHeader,
        items: items,
        formDataFooter: formDataFooter,
        totalAmt: totalAmt,
        billAmount: billAmount,
        roundOff: formDataFooter.roundOff,
        barcodeSeries: updatedBarcodeSeries,
        company_name: data.company_name,
        business_category: data.business_category,
        isBarcodeExistInInvoice: data.is_barcode_exist,
      });
      if (res.data.message) {
        newPurchase();
        const pageTitle = 'Purchase Invoice';
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
          type: 'PURCHASE',
          invoiceType: 'purchase',
          profileData: profileData,
          invoiceNo: invoice_no,
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
            fileName: 'purchase_invoice',
            directory: 'Documents',
          };
          const file = await RNHTMLtoPDF.convert(options);
          await Share.open({
            title: 'Share Purchase Invoice',
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
            title="Purchase Edit Invoice"
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
          type="purchase"
          invoice_no={invoice_no}
          setHeaderLoading={setHeaderLoading}></InvoiceHeaderEditTable>
        <PurchaseInvoiceItemsEditMenu
          type="purchase"
          invoice_no={invoice_no}
          setItemsLoading={setItemsLoading}
        />
        <InvoiceFooterForAll
          type="purchase"
          invoice_no={invoice_no}
          handleTaxChange={handleTaxChange}
          invoiceFooterType="PurchaseInvoiceFooterEditTable"
          setFooterLoading={setFooterLoading}></InvoiceFooterForAll>
        <View style={{flexDirection: 'row', justifyContent: 'center'}}>
          <View style={{width: screenWidth * 0.95}}>
            <View style={styles.footerContent}>
              <Text style={styles.footerText}>Total Amount : </Text>
              <Text style={styles.footerText}>{totalAmt}</Text>
            </View>

            <View style={styles.footerContent}>
              <Text style={styles.footerText}>
                {' '}
                {data.business_category === 'FlowerShop'
                  ? 'Commission: '
                  : 'Discount: '}{' '}
                :{' '}
              </Text>
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
                {data.business_category === 'FlowerShop' ? '-' : ''}
                {formDataFooter.otherExpenses
                  ? parseFloat(formDataFooter.otherExpenses).toFixed(2)
                  : '0.00'}
              </Text>
            </View>
            {data.business_category !== 'FlowerShop' && (
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
            )}

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
              {isSubmitting ? 'Updating...' : 'Update'}
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

export default PurchaseEdit;

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
