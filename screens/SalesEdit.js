import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Image,
  Modal,
} from 'react-native';
import {useEffect, useState, useMemo, useCallback} from 'react';
import InvoiceHeaderEditTable from '../components/InvoiceHeaderEditTable';
import axios from 'axios';
import OuterBodyModal from '../components/OuterBodyModal';
import {API_BASE_URL} from '../config';
import {useAuth} from '../components/AuthContext';
import SalesInvoiceItemsEditMenu from '../components/SalesInvoiceItemsEditMenu';
import InvoiceFooterForAll from '../components/InvoiceFooterForAll';
import CustomStyles from '../components/AddEditModalStyles';
import {useNavigation, useRoute} from '@react-navigation/native';
import {Appbar, Button, ActivityIndicator} from 'react-native-paper';
import {useSales} from '../components/SalesContext';
import {COLORS, FONTS} from '../constants';
import RNPrint from 'react-native-print';
import GenerateInvoicePrint from '../components/GenerateInvoicePrint';
import Share from 'react-native-share';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import {getPageBreaks} from '../components/calculateUtils';

const screenWidth = Dimensions.get('screen').width;

const SalesEdit = () => {
  const route = useRoute();
  // console.log(route);
  const {invoice_no} = route.params;
  // console.log('invoice_no in SalesEdit : ' + invoice_no);
  const navigation = useNavigation();
  const {data, columnWidths} = useAuth();
  const {
    formDataHeader,
    setFormDataHeader,
    items,
    setItems,
    formDataFooter,
    setFormDataFooter,
    newSales,
    initialProfileData,
    billAmount,
    totalAmt,
    roundOff,
    setBillingType,
  } = useSales();

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

  useEffect(() => {
    console.log('[SalesEdit] Screen mounted/navigated to - Initial state:', { company: data?.company_name, initialProfileData });
  }, []);

  const isLoading =
    submitLoading || headerLoading || itemsLoading || footerLoading;

  useEffect(() => {
    setBillingType('salesEdit');
    // console.log('invoice_no in useeefect: ' + invoice_no);
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
        console.log('[SalesEdit] Fetching profile for company:', company_name);
        const response = await axios.get(
          `${API_BASE_URL}/api/getProfile?role=admin&company_name=${company_name}`,
        );
        console.log('[SalesEdit] Full API Response:', response.data);
        if (response.data.message) {
          const message = response.data.message;
          const imageNames = {
            logo: message.image_name,
            qr: message.qr_image_name,
            seal: message.companySealImageName,
            signature: message.authorisedSignatureImageName,
          };
          console.log('[SalesEdit] Extracted Image Names:', imageNames);

          setProfileData(prevFormData => {
            const updatedProfileData = {
              ...prevFormData,
              username: message.username,
              email: message.email,
              phone_no: message.phone_no,
              country: message.country,
              state: message.state,
              city: message.city,
              address: message.address,
              pincode: message.pincode,
              gstin: message.gstin,
              company_full_name: message.company_full_name,
              bank_name: message.bank_name,
              account_no: message.account_no,
              ifsc_code: message.ifsc_code,
              branch: message.branch,
              declaration: message.declaration,
              image_name: message.image_name || '',
              qr_image_name: message.qr_image_name || '',
              accountName: message.accountName || '',
              panNo: message.panNo,
              fssi: message.fssi,
              companySealImageName: message.companySealImageName || '',
              authorisedSignatureImageName: message.authorisedSignatureImageName || '',
              bank_branch: message.bank_branch,
              bank_ifsc: message.bank_ifsc,
              bank_account_no: message.bank_account_no,
            };
            console.log('[SalesEdit] Profile Data (updated):', updatedProfileData);
            return updatedProfileData;
          });
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
        const url = `${API_BASE_URL}/images/${data.company_name}/${profileData.image_name}`;
        console.log('[SalesEdit] Checking Logo URL:', url);
        const response = await axios.head(url);
        if (response.status === 200) {
          setImageLogoExists(true);
          console.log('[SalesEdit] Logo exists:', url);
        } else {
          setImageLogoExists(false);
          console.log('[SalesEdit] Logo missing:', url);
        }
      } catch (error) {
        console.error('[SalesEdit] Error fetching logo image:', `${API_BASE_URL}/images/${data.company_name}/${profileData.image_name}`, error);
        setImageLogoExists(false);
      }
    };

    checkImageExists();
  }, [data.company_name, profileData.image_name]);

  useEffect(() => {
    const checkImageExists = async () => {
      try {
        const url = `${API_BASE_URL}/images/${data.company_name}/${profileData.qr_image_name}`;
        console.log('[SalesEdit] Checking QR URL:', url);
        const response = await axios.head(url);
        if (response.status === 200) {
          setImageQRExists(true);
          console.log('[SalesEdit] QR exists:', url);
        } else {
          setImageQRExists(false);
          console.log('[SalesEdit] QR missing:', url);
        }
      } catch (error) {
        console.error('[SalesEdit] Error fetching qr image:', `${API_BASE_URL}/images/${data.company_name}/${profileData.qr_image_name}`, error);
        setImageQRExists(false);
      }
    };

    checkImageExists();
  }, [data.company_name, profileData.qr_image_name]);

  useEffect(() => {
    const checkImageExists = async () => {
      try {
        const url = `${API_BASE_URL}/images/${data.company_name}/${profileData.companySealImageName}`;
        console.log('[SalesEdit] Checking Company Seal URL:', url);
        const response = await axios.head(url);
        if (response.status === 200) {
          setImageCompanySealExists(true);
          console.log('[SalesEdit] Company Seal exists:', url);
        } else {
          setImageCompanySealExists(false);
          console.log('[SalesEdit] Company Seal missing:', url);
        }
      } catch (error) {
        console.error('[SalesEdit] Error fetching company seal image:', `${API_BASE_URL}/images/${data.company_name}/${profileData.companySealImageName}`, error);
        setImageCompanySealExists(false);
      }
    };

    checkImageExists();
  }, [data.company_name, profileData.companySealImageName]);

  useEffect(() => {
    const checkImageExists = async () => {
      try {
        const url = `${API_BASE_URL}/images/${data.company_name}/${profileData.authorisedSignatureImageName}`;
        console.log('[SalesEdit] Checking Authorised Signature URL:', url);
        const response = await axios.head(url);
        if (response.status === 200) {
          setImageAuthorisedSignatureExists(true);
          console.log('[SalesEdit] Authorised Signature exists:', url);
        } else {
          setImageAuthorisedSignatureExists(false);
          console.log('[SalesEdit] Authorised Signature missing:', url);
        }
      } catch (error) {
        console.error('[SalesEdit] Error fetching Authorised Signature image:', `${API_BASE_URL}/images/${data.company_name}/${profileData.authorisedSignatureImageName}`, error);
        setImageAuthorisedSignatureExists(false);
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
    setSubmitLoading(true);

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
      setSubmitLoading(false);
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
      setSubmitLoading(false);
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
      setSubmitLoading(false);
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
      setSubmitLoading(false);
      return;
    }
    try {
      const res = await axios.post(`${API_BASE_URL}/api/addSalesInvoice`, {
        type: 'edit',
        invoiceNo: invoice_no,
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
          invoiceType: 'sales',
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
      if (type === 'submit') {
        setIsSubmitting(false);
      }
      if (type === 'share') {
        setIsSharing(false);
      }
      setSubmitLoading(false);
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
            title="Sales Edit Invoice"
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
          type="sales"
          invoice_no={invoice_no}
          setHeaderLoading={setHeaderLoading}></InvoiceHeaderEditTable>
        <SalesInvoiceItemsEditMenu
          type="sales"
          invoice_no={invoice_no}
          setItemsLoading={setItemsLoading}></SalesInvoiceItemsEditMenu>
        {formDataFooter.mop && (
          <InvoiceFooterForAll
            type="sales"
            invoice_no={invoice_no}
            handleTaxChange={handleTaxChange}
            handlePriceListChange={handlePriceListChange}
            invoiceFooterType="SalesInvoiceFooterEditTable"
            setFooterLoading={setFooterLoading}></InvoiceFooterForAll>
        )}
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

export default SalesEdit;

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
