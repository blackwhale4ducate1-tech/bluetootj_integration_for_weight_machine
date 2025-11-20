import {
  StyleSheet,
  Text,
  Dimensions,
  View,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {Fragment, useEffect, useState, useCallback} from 'react';
import axios from 'axios';
import {API_BASE_URL} from '../config';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal';
import InternalLoginModal from '../components/InternalLoginModal';
import ChangePasswordModal from '../components/ChangePasswordModal';
import {useAuth} from '../components/AuthContext';
import {Picker} from '@react-native-picker/picker';
import {
  FONTS,
  COLORS,
  FontAwesome6,
  MaterialCommunityIcons,
  FontAwesome5,
} from '../constants';
import {TextInput} from 'react-native-paper';
import SearchLedgerMenu from '../components/SearchLedgerMenu';

const screenWidth = Dimensions.get('screen').width;

const Settings = () => {
    const {data} = useAuth();

  if (!data) {
    return null;
  }

  // console.log("data in settings: " + JSON.stringify(data));

  const [purchaseSelectedMop, setPurchaseSelectedMop] = useState(null);
  const [salesSelectedMop, setSalesSelectedMop] = useState(null);
  const [estimateSelectedMop, setEstimateSelectedMop] = useState(null);
  const [purchaseSelectedInvoice, setPurchaseSelectedInvoice] = useState(null);
  const [salesSelectedInvoice, setSalesSelectedInvoice] = useState(null);
  const [estimateSelectedInvoice, setEstimateSelectedInvoice] = useState(null);
  const [estimateAccountsAddStatus, setEstimateAccountsAddStatus] =
    useState(null);
  const [barcode, setBarcode] = useState(null);
  const [negativeStock, setNegativeStock] = useState(null);
  const [showDelModal, setShowDelModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [isStocksAdded, setIsStocksAdded] = useState(true);
  const [itemwiseTax, setItemwiseTax] = useState(null);
  const [estimateInvHeaderAddress, setEstimateInvHeaderAddress] =
    useState(null);
  const [declarationHeight, setDeclarationHeight] = useState(0);
  const [a4ItemsCount, setA4ItemsCount] = useState(0);
  const [a5ItemsCount, setA5ItemsCount] = useState(0);
  const [unitInInvoice, setUnitInInvoice] = useState(null);
  const [commissionInput, setCommissionInput] = useState(0);
  const [salesPersonInInvoice, setSalesPersonInInvoice] = useState(null);
  const [descriptionInInvoice, setDescriptionInInvoice] = useState(null);
  const [barcodeInInvoice, setBarcodeInInvoice] = useState(null);
  const [
    barcodeSummarizeItemAllowInInvoice,
    setBarcodeSummarizeItemAllowInInvoice,
  ] = useState(null);
  const [selectedCurrency, setSelectedCurrency] = useState(null);
  const [taxType, setTaxType] = useState(null);
  const [hsnCodeInInvoice, setHsnCodeInInvoice] = useState(null);
  const [defaultAccountCode, setDefaultAccountCode] = useState('');
  const [isBillByBillAdjustmentExist, setIsBillByBillAdjustmentExist] =
    useState(null);
  const [isSalesInvoiceAdded, setIsSalesInvoiceAdded] = useState(true);
  const [isPurchaseInvoiceAdded, setIsPurchaseInvoiceAdded] = useState(true);
  const [isReceiptInvoiceSplitAdded, setIsReceiptInvoiceSplitAdded] =
    useState(true);
  const [isPaymentInvoiceSplitAdded, setIsPaymentInvoiceSplitAdded] =
    useState(true);
  const [isTaxModeExistInInvoice, setIsTaxModeExistInInvoice] = useState(null);
  const [isGstExistInInvoice, setIsGstExistInInvoice] = useState(null);
  const [isGstAmtExistInInvoice, setIsGstAmtExistInInvoice] = useState(null);
  const [isDiscountExistInInvoice, setIsDiscountExistInInvoice] =
    useState(null);
  const [isExpenseExistInInvoice, setIsExpenseExistInInvoice] = useState(null);
  const [expenseAliasInInvoice, setExpenseAliasInInvoice] = useState(null);
  const [updateCustomerAfterInvoice, setUpdateCustomerAfterInvoice] =
    useState(null);
  const [isRemarksExistInInvoice, setIsRemarksExistInInvoice] = useState(null);
  const [isMrpExistInInvoice, setIsMrpExistInInvoice] = useState(null);
  const [isDescriptionExistAsAColumn, setIsDescriptionExistAsAColumn] =
    useState(null);
  const [isFssiExistInInvoice, setIsFssiExistInInvoice] = useState(null);
  const [isGstExistInProduction, setIsGstExistInProduction] = useState(null);
  const [isNarrationExistInInvoice, setIsNarrationExistInInvoice] =
    useState(null);
  const [isSubTotalAsInput, setIsSubTotalAsInput] = useState(null);
  const [salesBillDetails, setSalesBillDetails] = useState(null);
  const [isUnitandDiscountExistInAddSales, setIsUnitandDiscountExistInAddSales] = useState(null); 
  const [isCompanySealExistInSales, setIsCompanySealExistInSales] =
    useState(null);
  const [isSignatureImageExistInSales, setIsSignatureImageExistInSales] =
    useState(null);
  const [isCompanySealExistInEstimate, setIsCompanySealExistInEstimate] =
    useState(null);
  const [isSignatureImageExistInEstimate, setIsSignatureImageExistInEstimate] =
    useState(null);

  const [multipleMrp, setMultipleMrp] = useState(null);

  const [isShippingAddressExist, setIsShippingAddressExist] = useState(null);

  const [defaultStore, setDefaultStore] = useState({
    value: 'Main Store',
    label: 'Main Store',
  });
  const [defaultStoreOptions, setDefaultStoreOptions] = useState([]);

  const purchaseMopOptions = [
    {value: 'CASH', label: 'CASH'},
    {value: 'CREDIT', label: 'CREDIT'},
  ];
  const salesMopOptions = [
    {value: 'CASH', label: 'CASH'},
    {value: 'CREDIT', label: 'CREDIT'},
    {value: 'MIXED', label: 'MIXED'},
  ];
  const invoiceOptions = [
    {value: 'A4 Size', label: 'A4 Size'},
    {value: 'A4 Landscape', label: 'A4 Landscape'},
    {value: 'A5 Size', label: 'A5 Size'},
    {value: 'Thermal Printer', label: 'Thermal Printer'},
  ];
  const allowNotAllowOptions = [
    {value: 'allow', label: 'allow'},
    {value: 'not allow', label: 'not allow'},
  ];
  const enableDisableOptions = [
    {value: 1, label: 'Enable'},
    {value: 0, label: 'Disable'},
  ];

  const currencyOptions = [
    {value: 'AED', label: 'AED'},
    {value: 'INR', label: 'INR'},
  ];

  const taxTypeOptions = [
    {value: 'GST', label: 'GST'},
    {value: 'VAT', label: 'VAT'},
  ];

  const handleUpdateNameBalance = async (name, balance) => {
    setDefaultAccountCode(name);
    setMopSettings({value: name}, 'defaultAccountCode');
  };

  const getMOP = async (username, company_name) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/getMopSettings?username=${username}&company_name=${company_name}`,
      );
      setPurchaseSelectedMop({
        value: response.data.purchase,
        label: response.data.purchase,
      });
      setSalesSelectedMop({
        value: response.data.sales,
        label: response.data.sales,
      });
      setEstimateSelectedMop({
        value: response.data.estimate,
        label: response.data.estimate,
      });
      setPurchaseSelectedInvoice({
        value: response.data.purchase_invoice_type,
        label: response.data.purchase_invoice_type,
      });
      setSalesSelectedInvoice({
        value: response.data.sales_invoice_type,
        label: response.data.sales_invoice_type,
      });
      setEstimateSelectedInvoice({
        value: response.data.estimate_invoice_type,
        label: response.data.estimate_invoice_type,
      });
      setBarcode({
        value: response.data.is_barcode_exist,
        label: response.data.is_barcode_exist === 0 ? 'Disable' : 'Enable',
      });
      setEstimateAccountsAddStatus({
        value: response.data.estimate_accounts_add_status,
        label:
          response.data.estimate_accounts_add_status === 0
            ? 'Disable'
            : 'Enable',
      });
      setNegativeStock({
        value: response.data.negative_stock,
        label: response.data.negative_stock,
      });
      setIsStocksAdded(response.data.isStocksAdded);
      setDefaultStore({
        value: response.data.default_store,
        label: response.data.default_store,
      });
      setItemwiseTax({
        value: response.data.itemwise_tax,
        label: response.data.itemwise_tax,
      });
      setEstimateInvHeaderAddress({
        value: response.data.estimate_invoice_header_address,
        label: response.data.estimate_invoice_header_address,
      });
      setDeclarationHeight(response.data.declaration_height);
      setA4ItemsCount(response.data.a4_item_count);
      setA5ItemsCount(response.data.a5_item_count);
      setUnitInInvoice({
        value: response.data.isUnitExistInInvoice,
        label: response.data.isUnitExistInInvoice === 0 ? 'Disable' : 'Enable',
      });
      setCommissionInput(response.data.commission_input);
      setSalesPersonInInvoice({
        value: response.data.isSalesPersonExistInInvoice,
        label:
          response.data.isSalesPersonExistInInvoice === 0
            ? 'Disable'
            : 'Enable',
      });
      setDescriptionInInvoice({
        value: response.data.isDescriptionExistInInvoice,
        label:
          response.data.isDescriptionExistInInvoice === 0
            ? 'Disable'
            : 'Enable',
      });
      setBarcodeInInvoice({
        value: response.data.isBarcodeExistInInvoice,
        label:
          response.data.isBarcodeExistInInvoice === 0 ? 'Disable' : 'Enable',
      });
      setBarcodeSummarizeItemAllowInInvoice({
        value: response.data.isBarcodeSummarizeItemAllowInInvoice,
        label:
          response.data.isBarcodeSummarizeItemAllowInInvoice === 0
            ? 'Disable'
            : 'Enable',
      });
      setSelectedCurrency({
        value: response.data.currency,
        label: response.data.currency,
      });
      setTaxType({
        value: response.data.tax_type,
        label: response.data.tax_type,
      });
      setHsnCodeInInvoice({
        value: response.data.isHsnCodeExistInInvoice,
        label:
          response.data.isHsnCodeExistInInvoice === 0 ? 'Disable' : 'Enable',
      });
      setDefaultAccountCode(response.data.defaultAccountCode);
      setIsBillByBillAdjustmentExist({
        value: response.data.isBillByBillAdjustmentExist,
        label:
          response.data.isBillByBillAdjustmentExist === 0
            ? 'Disable'
            : 'Enable',
      });
      setIsSalesInvoiceAdded(response.data.isSalesInvoiceAdded);
      setIsPurchaseInvoiceAdded(response.data.isPurchaseInvoiceAdded);
      setIsReceiptInvoiceSplitAdded(response.data.isReceiptInvoiceSplitAdded);
      setIsPaymentInvoiceSplitAdded(data.isPaymentInvoiceSplitAdded);
      setIsTaxModeExistInInvoice({
        value: response.data.isTaxModeExistInInvoice,
        label:
          response.data.isTaxModeExistInInvoice === 0 ? 'Disable' : 'Enable',
      });
      setIsGstExistInInvoice({
        value: response.data.isGstExistInInvoice,
        label: response.data.isGstExistInInvoice === 0 ? 'Disable' : 'Enable',
      });
      setIsGstAmtExistInInvoice({
        value: response.data.isGstAmtExistInInvoice,
        label:
          response.data.isGstAmtExistInInvoice === 0 ? 'Disable' : 'Enable',
      });
      setIsDiscountExistInInvoice({
        value: response.data.isDiscountExistInInvoice,
        label:
          response.data.isDiscountExistInInvoice === 0 ? 'Disable' : 'Enable',
      });
      setIsExpenseExistInInvoice({
        value: response.data.isExpenseExistInInvoice,
        label:
          response.data.isExpenseExistInInvoice === 0 ? 'Disable' : 'Enable',
      });
      setExpenseAliasInInvoice(response.data.expenseAliasInInvoice);
      setUpdateCustomerAfterInvoice({
        value: response.data.updateCustomerAfterInvoice,
        label:
          response.data.updateCustomerAfterInvoice === 0 ? 'Disable' : 'Enable',
      });
      setIsRemarksExistInInvoice({
        value: response.data.isRemarksExistInInvoice,
        label:
          response.data.isRemarksExistInInvoice === 0 ? 'Disable' : 'Enable',
      });
      setIsMrpExistInInvoice({
        value: response.data.isMrpExistInInvoice,
        label: response.data.isMrpExistInInvoice === 0 ? 'Disable' : 'Enable',
      });
      setIsDescriptionExistAsAColumn({
        value: response.data.isDescriptionExistAsAColumn,
        label:
          response.data.isDescriptionExistAsAColumn === 0
            ? 'Disable'
            : 'Enable',
      });
      setIsFssiExistInInvoice({
        value: response.data.isFssiExistInInvoice,
        label: response.data.isFssiExistInInvoice === 0 ? 'Disable' : 'Enable',
      });
      setIsGstExistInProduction({
        value: response.data.isGstExistInProduction,
        label:
          response.data.isGstExistInProduction === 0 ? 'Disable' : 'Enable',
      });
      setIsNarrationExistInInvoice({
        value: response.data.isNarrationExistInInvoice,
        label:
          response.data.isNarrationExistInInvoice === 0 ? 'Disable' : 'Enable',
      });
      setIsSubTotalAsInput({
        value: response.data.isSubTotalAsInput,
        label: response.data.isSubTotalAsInput === 0 ? 'Disable' : 'Enable',
      });
      setIsCompanySealExistInSales({
        value: response.data.isCompanySealExistInSales,
        label:
          response.data.isCompanySealExistInSales === 0 ? 'Disable' : 'Enable',
      });
      setIsSignatureImageExistInSales({
        value: response.data.isSignatureImageExistInSales,
        label:
          response.data.isSignatureImageExistInSales === 0
            ? 'Disable'
            : 'Enable',
      });
      setIsCompanySealExistInEstimate({
        value: response.data.isCompanySealExistInEstimate,
        label:
          response.data.isCompanySealExistInEstimate === 0
            ? 'Disable'
            : 'Enable',
      });
      setIsSignatureImageExistInEstimate({
        value: response.data.isSignatureImageExistInEstimate,
        label:
          response.data.isSignatureImageExistInEstimate === 0
            ? 'Disable'
            : 'Enable',
      });
      setIsShippingAddressExist({
        value: response.data.isShippingAddressExist,
        label:
          response.data.isShippingAddressExist === 0 ? 'Disable' : 'Enable',
      });
      setMultipleMrp({
          value: response.data.multiple_mrp,
          label: response.data.multiple_mrp,
      });
      setSalesBillDetails({
        value: response.data.sales_bill_details,
        label: response.data.sales_bill_details === 0 ? 'Disable' : 'Enable',
      });
      setIsUnitandDiscountExistInAddSales({
        value: response.data.isUnitandDiscountExistInAddSales,
        label:
          response.data.isUnitandDiscountExistInAddSales === 0 ? 'Disable' : 'Enable',
      });
    } catch (error) {
      console.log(error);
    }
  };

  const getDefaultStoreOptions = async company_name => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/getStores?company_name=${company_name}`,
      );
      if (response.data.message) {
        const storeOptions = response.data.message.map(option => ({
          value: option.store_name,
          label: option.store_name,
        }));
        // console.log("storeOptions: " + JSON.stringify(storeOptions));
        setDefaultStoreOptions(storeOptions);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getDefaultStoreOptions(data.company_name);
    getMOP(data.username, data.company_name);
  }, [data.username, data.company_name]);

  const setMopSettings = async (selectedMop, type) => {
    try {
      await axios.post(`${API_BASE_URL}/api/setMopSettings`, {
        username: data.username,
        mop: selectedMop.value,
        name: type,
        company_name: data.company_name,
      });
      console.log('MOP settings saved successfully!');
    } catch (error) {
      console.log(error);
    }
  };

  const handleFormatData = () => {
    console.log('Format Button Clicked');
    setShowDelModal(true);
  };

  const handleChangePassword = () => {
    console.log('Change Pwd Button Clicked');
    setShowChangePasswordModal(true);
  };

  const handleCloseModal = useCallback(() => {
    setShowDelModal(false);
    setShowLoginModal(false);
    setShowChangePasswordModal(false);
  }, []);

  const handleSubmitAlert = useCallback(async buttonValue => {
    if (buttonValue === 'Yes') {
      console.log('Yes button clicked ');
      setShowDelModal(false);
      setShowLoginModal(true);
    } else if (buttonValue === 'No') {
      console.log('No button clicked ');
      setShowDelModal(false);
    }
  }, []);

  return (
    <View Style={styles.container}>
      <View style={{marginBottom: 60}}>
        <ScrollView contentContainerStyle={{backgroundColor: COLORS.lightGray}}>
          <View style={{margin: 10}}>
            <View style={[styles.settingsview, {marginTop: 20}]}>
              <View style={[styles.iconbg, {backgroundColor: '#feeddb'}]}>
                <FontAwesome6 name="file-invoice" size={22} color="#daa56e" />
              </View>

              <Text style={styles.labelText}>
                Default Purchase Invoice MOP :
              </Text>
            </View>

            <View style={styles.pickercontain}>
              <Picker
                style={styles.pickerwidth}
                selectedValue={
                  purchaseSelectedMop ? purchaseSelectedMop.value : null
                }
                onValueChange={itemValue => {
                  const selectedOption = purchaseMopOptions.find(
                    option => option.value === itemValue,
                  );
                  setPurchaseSelectedMop(selectedOption);
                  setMopSettings(selectedOption, 'purchase_mop');
                }}>
                {purchaseMopOptions.map(option => (
                  <Picker.Item
                    label={option.label}
                    value={option.value}
                    key={option.value}
                  />
                ))}
              </Picker>
            </View>
          </View>
          <View style={{margin: 10}}>
            <View style={[styles.settingsview]}>
              <View style={[styles.iconbg, {backgroundColor: '#e0dcfb'}]}>
                <FontAwesome6 name="note-sticky" size={22} color="#322ddb" />
              </View>

              <Text style={styles.labelText}>Default Sales Invoice MOP :</Text>
            </View>
            <View style={styles.pickercontain}>
              <Picker
                style={styles.pickerwidth}
                selectedValue={salesSelectedMop ? salesSelectedMop.value : null}
                onValueChange={itemValue => {
                  const selectedOption = salesMopOptions.find(
                    option => option.value === itemValue,
                  );
                  setSalesSelectedMop(selectedOption);
                  setMopSettings(selectedOption, 'sales_mop');
                }}>
                {salesMopOptions.map(option => (
                  <Picker.Item
                    label={option.label}
                    value={option.value}
                    key={option.value}
                  />
                ))}
              </Picker>
            </View>
          </View>
          <View style={{margin: 10}}>
            <View style={[styles.settingsview]}>
              <View style={[styles.iconbg, {backgroundColor: '#e0dcfb'}]}>
                <FontAwesome6 name="note-sticky" size={22} color="#322ddb" />
              </View>

              <Text style={styles.labelText}>
                Default Estimate Invoice MOP :
              </Text>
            </View>
            <View style={styles.pickercontain}>
              <Picker
                style={styles.pickerwidth}
                selectedValue={
                  estimateSelectedMop ? estimateSelectedMop.value : null
                }
                onValueChange={itemValue => {
                  const selectedOption = salesMopOptions.find(
                    option => option.value === itemValue,
                  );
                  setEstimateSelectedMop(selectedOption);
                  setMopSettings(selectedOption, 'estimate_mop');
                }}>
                {salesMopOptions.map(option => (
                  <Picker.Item
                    label={option.label}
                    value={option.value}
                    key={option.value}
                  />
                ))}
              </Picker>
            </View>
          </View>
          <View style={{margin: 10}}>
            <View style={[styles.settingsview]}>
              <View style={[styles.iconbg, {backgroundColor: '#e2f4fe'}]}>
                <MaterialCommunityIcons
                  name="notebook-plus"
                  size={22}
                  color="#62b8e1"
                />
              </View>

              <Text style={styles.labelText}>
                Default Purchase Invoice Type :
              </Text>
            </View>
            <View style={styles.pickercontain}>
              <Picker
                style={styles.pickerwidth}
                selectedValue={
                  purchaseSelectedInvoice ? purchaseSelectedInvoice.value : null
                }
                onValueChange={itemValue => {
                  const selectedOption = invoiceOptions.find(
                    option => option.value === itemValue,
                  );
                  setPurchaseSelectedInvoice(selectedOption);
                  setMopSettings(selectedOption, 'purchase_invoice_type');
                }}>
                {invoiceOptions.map(option => (
                  <Picker.Item
                    label={option.label}
                    value={option.value}
                    key={option.value}
                  />
                ))}
              </Picker>
            </View>
          </View>
          <View style={{margin: 10}}>
            <View style={[styles.settingsview]}>
              <View style={[styles.iconbg, {backgroundColor: '#ffe8ee'}]}>
                <MaterialCommunityIcons
                  name="notebook-check"
                  size={22}
                  color="#ea8299"
                />
              </View>

              <Text style={styles.labelText}>Default Sales Invoice Type :</Text>
            </View>

            <View style={styles.pickercontain}>
              <Picker
                style={styles.pickerwidth}
                selectedValue={
                  salesSelectedInvoice ? salesSelectedInvoice.value : null
                }
                onValueChange={itemValue => {
                  const selectedOption = invoiceOptions.find(
                    option => option.value === itemValue,
                  );
                  setSalesSelectedInvoice(selectedOption);
                  setMopSettings(selectedOption, 'sales_invoice_type');
                }}>
                {invoiceOptions.map(option => (
                  <Picker.Item
                    label={option.label}
                    value={option.value}
                    key={option.value}
                  />
                ))}
              </Picker>
            </View>
          </View>
          <View style={{margin: 10}}>
            <View style={[styles.settingsview]}>
              <View style={[styles.iconbg, {backgroundColor: '#ffe8ee'}]}>
                <MaterialCommunityIcons
                  name="notebook-check"
                  size={22}
                  color="#ea8299"
                />
              </View>

              <Text style={styles.labelText}>
                Default Estimate Invoice Type :
              </Text>
            </View>

            <View style={styles.pickercontain}>
              <Picker
                style={styles.pickerwidth}
                selectedValue={
                  estimateSelectedInvoice ? estimateSelectedInvoice.value : null
                }
                onValueChange={itemValue => {
                  const selectedOption = invoiceOptions.find(
                    option => option.value === itemValue,
                  );
                  setEstimateSelectedInvoice(selectedOption);
                  setMopSettings(selectedOption, 'estimate_invoice_type');
                }}>
                {invoiceOptions.map(option => (
                  <Picker.Item
                    label={option.label}
                    value={option.value}
                    key={option.value}
                  />
                ))}
              </Picker>
            </View>
          </View>
          <View style={{margin: 10}}>
            <View style={[styles.settingsview]}>
              <View style={[styles.iconbg, {backgroundColor: '#dafef0'}]}>
                <FontAwesome5 name="store" size={22} color="#1bb070" />
              </View>

              <Text style={styles.labelText}>Default Store :</Text>
            </View>
            <View style={styles.pickercontain}>
              <Picker
                style={styles.pickerwidth}
                selectedValue={defaultStore ? defaultStore.value : null}
                onValueChange={itemValue => {
                  const selectedOption = defaultStoreOptions.find(
                    option => option.value === itemValue,
                  );
                  setDefaultStore(selectedOption);
                  setMopSettings(selectedOption, 'default_store');
                }}>
                {defaultStoreOptions.map(option => (
                  <Picker.Item
                    label={option.label}
                    value={option.value}
                    key={option.value}
                  />
                ))}
              </Picker>
            </View>
          </View>
          {data.role === 'admin' && (
            <View style={{margin: 10}}>
              <View style={[styles.settingsview]}>
                <View style={[styles.iconbg, {backgroundColor: '#fbc6e0'}]}>
                  <MaterialCommunityIcons
                    name="cart-minus"
                    size={22}
                    color="#b74c80"
                  />
                </View>

                <Text style={styles.labelText}>Sales Bill Details :</Text>
              </View>
              <View style={styles.pickercontain}>
                <Picker
                  style={styles.pickerwidth}
                  selectedValue={
                    salesBillDetails ? salesBillDetails.value : null
                  }
                  onValueChange={itemValue => {
                    const selectedOption = enableDisableOptions.find(
                      option => option.value === itemValue,
                    );
                    setSalesBillDetails(selectedOption);
                    setMopSettings(selectedOption, 'sales_bill_details');
                  }}>
                  {enableDisableOptions.map(option => (
                    <Picker.Item
                      label={option.label}
                      value={option.value}
                      key={option.value}
                    />
                  ))}
                </Picker>
              </View>
            </View>
          )}
          {data.role === 'admin' && (
            <View style={{margin: 10}}>
              <View style={[styles.settingsview]}>
                <View style={[styles.iconbg, {backgroundColor: '#fbc6e0'}]}>
                  <MaterialCommunityIcons
                    name="cart-minus"
                    size={22}
                    color="#b74c80"
                  />
                </View>

                <Text style={styles.labelText}>Unit and Discount Exist in Add Sales :</Text>
              </View>
              <View style={styles.pickercontain}>
                <Picker
                  style={styles.pickerwidth}
                  selectedValue={
                    isUnitandDiscountExistInAddSales ? isUnitandDiscountExistInAddSales.value : null
                  }
                  onValueChange={itemValue => {
                    const selectedOption = enableDisableOptions.find(
                      option => option.value === itemValue,
                    );
                    setIsUnitandDiscountExistInAddSales(selectedOption);
                    setMopSettings(selectedOption, 'isUnitandDiscountExistInAddSales');
                  }}>
                  {enableDisableOptions.map(option => (
                    <Picker.Item
                      label={option.label}
                      value={option.value}
                      key={option.value}
                    />
                  ))}
                </Picker>
              </View>
            </View>
          )}
          {data.role === 'admin' && (
            <View style={{margin: 10}}>
              <View style={[styles.settingsview]}>
                <View style={[styles.iconbg, {backgroundColor: '#ffedea'}]}>
                  <FontAwesome6 name="barcode" size={22} color="#ff8270" />
                </View>

                <Text style={styles.labelText}>Default Barcode Status :</Text>
              </View>

              <View style={styles.pickercontain}>
                <Picker
                  style={styles.pickerwidth}
                  selectedValue={barcode ? barcode.value : null}
                  onValueChange={itemValue => {
                    const selectedOption = enableDisableOptions.find(
                      option => option.value === itemValue,
                    );
                    setBarcode(selectedOption);
                    setMopSettings(selectedOption, 'is_barcode_exist');
                  }}
                  enabled={!isStocksAdded}>
                  {enableDisableOptions.map(option => (
                    <Picker.Item
                      label={option.label}
                      value={option.value}
                      key={option.value}
                    />
                  ))}
                </Picker>
              </View>
            </View>
          )}
          {data.role === 'admin' && (
            <View style={{margin: 10}}>
              <View style={[styles.settingsview]}>
                <View style={[styles.iconbg, {backgroundColor: '#fbc6e0'}]}>
                  <MaterialCommunityIcons
                    name="cart-minus"
                    size={22}
                    color="#b74c80"
                  />
                </View>

                <Text style={styles.labelText}>Negative Stock :</Text>
              </View>
              <View style={styles.pickercontain}>
                <Picker
                  style={styles.pickerwidth}
                  selectedValue={negativeStock ? negativeStock.value : null}
                  onValueChange={itemValue => {
                    const selectedOption = allowNotAllowOptions.find(
                      option => option.value === itemValue,
                    );
                    setNegativeStock(selectedOption);
                    setMopSettings(selectedOption, 'negative_stock');
                  }}>
                  {allowNotAllowOptions.map(option => (
                    <Picker.Item
                      label={option.label}
                      value={option.value}
                      key={option.value}
                    />
                  ))}
                </Picker>
              </View>
            </View>
          )}
          {data.role === 'admin' && (
            <View style={{margin: 10}}>
              <View style={[styles.settingsview]}>
                <View style={[styles.iconbg, {backgroundColor: '#fbc6e0'}]}>
                  <MaterialCommunityIcons
                    name="cart-minus"
                    size={22}
                    color="#b74c80"
                  />
                </View>

                <Text style={styles.labelText}>Multiple Mrp :</Text>
              </View>
              <View style={styles.pickercontain}>
                <Picker
                  style={styles.pickerwidth}
                  selectedValue={multipleMrp ? multipleMrp.value : null}
                  onValueChange={itemValue => {
                    const selectedOption = allowNotAllowOptions.find(
                      option => option.value === itemValue,
                    );
                    setMultipleMrp(selectedOption);
                    setMopSettings(selectedOption, 'multiple_mrp');
                  }}>
                  {allowNotAllowOptions.map(option => (
                    <Picker.Item
                      label={option.label}
                      value={option.value}
                      key={option.value}
                    />
                  ))}
                </Picker>
              </View>
            </View>
          )}
          {data.role === 'admin' && (
            <View style={{margin: 10}}>
              <View style={[styles.settingsview]}>
                <View style={[styles.iconbg, {backgroundColor: '#fbc6e0'}]}>
                  <MaterialCommunityIcons
                    name="cart-minus"
                    size={22}
                    color="#b74c80"
                  />
                </View>

                <Text style={styles.labelText}>Itemwise Tax :</Text>
              </View>
              <View style={styles.pickercontain}>
                <Picker
                  style={styles.pickerwidth}
                  selectedValue={itemwiseTax ? itemwiseTax.value : null}
                  onValueChange={itemValue => {
                    const selectedOption = allowNotAllowOptions.find(
                      option => option.value === itemValue,
                    );
                    setItemwiseTax(selectedOption);
                    setMopSettings(selectedOption, 'itemwise_tax');
                  }}
                  enabled={!isStocksAdded}>
                  {allowNotAllowOptions.map(option => (
                    <Picker.Item
                      label={option.label}
                      value={option.value}
                      key={option.value}
                    />
                  ))}
                </Picker>
              </View>
            </View>
          )}
          {data.role === 'admin' && (
            <View style={{margin: 10}}>
              <View style={[styles.settingsview]}>
                <View style={[styles.iconbg, {backgroundColor: '#fbc6e0'}]}>
                  <MaterialCommunityIcons
                    name="cart-minus"
                    size={22}
                    color="#b74c80"
                  />
                </View>

                <Text style={styles.labelText}>Unit In Invoice :</Text>
              </View>
              <View style={styles.pickercontain}>
                <Picker
                  style={styles.pickerwidth}
                  selectedValue={unitInInvoice ? unitInInvoice.value : null}
                  onValueChange={itemValue => {
                    const selectedOption = enableDisableOptions.find(
                      option => option.value === itemValue,
                    );
                    setUnitInInvoice(selectedOption);
                    setMopSettings(selectedOption, 'isUnitExistInInvoice');
                  }}>
                  {enableDisableOptions.map(option => (
                    <Picker.Item
                      label={option.label}
                      value={option.value}
                      key={option.value}
                    />
                  ))}
                </Picker>
              </View>
            </View>
          )}
          {data.role === 'admin' && (
            <View style={{margin: 10}}>
              <View style={[styles.settingsview]}>
                <View style={[styles.iconbg, {backgroundColor: '#fbc6e0'}]}>
                  <MaterialCommunityIcons
                    name="cart-minus"
                    size={22}
                    color="#b74c80"
                  />
                </View>

                <Text style={styles.labelText}>Sales Person In Invoice :</Text>
              </View>
              <View style={styles.pickercontain}>
                <Picker
                  style={styles.pickerwidth}
                  selectedValue={
                    salesPersonInInvoice ? salesPersonInInvoice.value : null
                  }
                  onValueChange={itemValue => {
                    const selectedOption = enableDisableOptions.find(
                      option => option.value === itemValue,
                    );
                    setSalesPersonInInvoice(selectedOption);
                    setMopSettings(
                      selectedOption,
                      'isSalesPersonExistInInvoice',
                    );
                  }}>
                  {enableDisableOptions.map(option => (
                    <Picker.Item
                      label={option.label}
                      value={option.value}
                      key={option.value}
                    />
                  ))}
                </Picker>
              </View>
            </View>
          )}
          {data.role === 'admin' && (
            <View style={{margin: 10}}>
              <View style={[styles.settingsview]}>
                <View style={[styles.iconbg, {backgroundColor: '#fbc6e0'}]}>
                  <MaterialCommunityIcons
                    name="cart-minus"
                    size={22}
                    color="#b74c80"
                  />
                </View>

                <Text style={styles.labelText}>Description In Invoice :</Text>
              </View>
              <View style={styles.pickercontain}>
                <Picker
                  style={styles.pickerwidth}
                  selectedValue={
                    descriptionInInvoice ? descriptionInInvoice.value : null
                  }
                  onValueChange={itemValue => {
                    const selectedOption = enableDisableOptions.find(
                      option => option.value === itemValue,
                    );
                    setDescriptionInInvoice(selectedOption);
                    setMopSettings(
                      selectedOption,
                      'isDescriptionExistInInvoice',
                    );
                  }}>
                  {enableDisableOptions.map(option => (
                    <Picker.Item
                      label={option.label}
                      value={option.value}
                      key={option.value}
                    />
                  ))}
                </Picker>
              </View>
            </View>
          )}
          {data.role === 'admin' && (
            <View style={{margin: 10}}>
              <View style={[styles.settingsview]}>
                <View style={[styles.iconbg, {backgroundColor: '#fbc6e0'}]}>
                  <MaterialCommunityIcons
                    name="cart-minus"
                    size={22}
                    color="#b74c80"
                  />
                </View>

                <Text style={styles.labelText}>Barcode In Invoice :</Text>
              </View>
              <View style={styles.pickercontain}>
                <Picker
                  style={styles.pickerwidth}
                  selectedValue={
                    barcodeInInvoice ? barcodeInInvoice.value : null
                  }
                  onValueChange={itemValue => {
                    const selectedOption = enableDisableOptions.find(
                      option => option.value === itemValue,
                    );
                    setBarcodeInInvoice(selectedOption);
                    setMopSettings(selectedOption, 'isBarcodeExistInInvoice');
                  }}>
                  {enableDisableOptions.map(option => (
                    <Picker.Item
                      label={option.label}
                      value={option.value}
                      key={option.value}
                    />
                  ))}
                </Picker>
              </View>
            </View>
          )}
          {data.role === 'admin' && (
            <View style={{margin: 10}}>
              <View style={[styles.settingsview]}>
                <View style={[styles.iconbg, {backgroundColor: '#fbc6e0'}]}>
                  <MaterialCommunityIcons
                    name="cart-minus"
                    size={22}
                    color="#b74c80"
                  />
                </View>

                <Text style={styles.labelText}>
                  Barcode Bill Summarize Item :
                </Text>
              </View>
              <View style={styles.pickercontain}>
                <Picker
                  style={styles.pickerwidth}
                  selectedValue={
                    barcodeSummarizeItemAllowInInvoice
                      ? barcodeSummarizeItemAllowInInvoice.value
                      : null
                  }
                  onValueChange={itemValue => {
                    const selectedOption = enableDisableOptions.find(
                      option => option.value === itemValue,
                    );
                    setBarcodeSummarizeItemAllowInInvoice(selectedOption);
                    setMopSettings(
                      selectedOption,
                      'isBarcodeSummarizeItemAllowInInvoice',
                    );
                  }}>
                  {enableDisableOptions.map(option => (
                    <Picker.Item
                      label={option.label}
                      value={option.value}
                      key={option.value}
                    />
                  ))}
                </Picker>
              </View>
            </View>
          )}
          {data.role === 'admin' && (
            <View style={{margin: 10}}>
              <View style={[styles.settingsview]}>
                <View style={[styles.iconbg, {backgroundColor: '#fbc6e0'}]}>
                  <MaterialCommunityIcons
                    name="cart-minus"
                    size={22}
                    color="#b74c80"
                  />
                </View>

                <Text style={styles.labelText}>
                  Show Company Details in Estimate Invoice
                </Text>
              </View>
              <View style={styles.pickercontain}>
                <Picker
                  style={styles.pickerwidth}
                  selectedValue={
                    estimateInvHeaderAddress
                      ? estimateInvHeaderAddress.value
                      : null
                  }
                  onValueChange={itemValue => {
                    const selectedOption = allowNotAllowOptions.find(
                      option => option.value === itemValue,
                    );
                    setEstimateInvHeaderAddress(selectedOption);
                    setMopSettings(
                      selectedOption,
                      'estimate_invoice_header_address',
                    );
                  }}>
                  {allowNotAllowOptions.map(option => (
                    <Picker.Item
                      label={option.label}
                      value={option.value}
                      key={option.value}
                    />
                  ))}
                </Picker>
              </View>
            </View>
          )}
          {data.role === 'admin' && (
            <View style={{margin: 10}}>
              <View style={[styles.settingsview]}>
                <View style={[styles.iconbg, {backgroundColor: '#fbc6e0'}]}>
                  <MaterialCommunityIcons
                    name="cart-minus"
                    size={22}
                    color="#b74c80"
                  />
                </View>

                <Text style={styles.labelText}>Estimate Accounts Entry :</Text>
              </View>
              <View style={styles.pickercontain}>
                <Picker
                  style={styles.pickerwidth}
                  selectedValue={
                    estimateAccountsAddStatus
                      ? estimateAccountsAddStatus.value
                      : null
                  }
                  onValueChange={itemValue => {
                    const selectedOption = enableDisableOptions.find(
                      option => option.value === itemValue,
                    );
                    setEstimateAccountsAddStatus(selectedOption);
                    setMopSettings(
                      selectedOption,
                      'estimate_accounts_add_status',
                    );
                  }}>
                  {enableDisableOptions.map(option => (
                    <Picker.Item
                      label={option.label}
                      value={option.value}
                      key={option.value}
                    />
                  ))}
                </Picker>
              </View>
            </View>
          )}
          {data.role === 'admin' && (
            <View style={{margin: 10}}>
              <View style={[styles.settingsview]}>
                <View style={[styles.iconbg, {backgroundColor: '#fbc6e0'}]}>
                  <MaterialCommunityIcons
                    name="cart-minus"
                    size={22}
                    color="#b74c80"
                  />
                </View>

                <Text style={styles.labelText}>Declaration Height :</Text>
              </View>
              <View style={styles.pickercontain}>
                <TextInput
                  style={styles.inputbg}
                  mode="flat"
                  placeholderTextColor={COLORS.black}
                  activeUnderlineColor={COLORS.primary}
                  placeholder="Enter Declaration Height"
                  value={declarationHeight.toString()}
                  onChangeText={text => {
                    setDeclarationHeight(text);
                    setMopSettings({value: text}, 'declaration_height');
                  }}
                />
              </View>
            </View>
          )}
          {data.role === 'admin' && (
            <View style={{margin: 10}}>
              <View style={[styles.settingsview]}>
                <View style={[styles.iconbg, {backgroundColor: '#fbc6e0'}]}>
                  <MaterialCommunityIcons
                    name="cart-minus"
                    size={22}
                    color="#b74c80"
                  />
                </View>

                <Text style={styles.labelText}>A4 Size Items Count :</Text>
              </View>
              <View style={styles.pickercontain}>
                <TextInput
                  style={styles.inputbg}
                  mode="flat"
                  placeholderTextColor={COLORS.black}
                  activeUnderlineColor={COLORS.primary}
                  placeholder="Enter A4 Size Items Count"
                  value={a4ItemsCount.toString()}
                  onChangeText={text => {
                    setA4ItemsCount(text);
                    setMopSettings({value: text}, 'a4_item_count');
                  }}
                />
              </View>
            </View>
          )}
          {data.role === 'admin' && (
            <View style={{margin: 10}}>
              <View style={[styles.settingsview]}>
                <View style={[styles.iconbg, {backgroundColor: '#fbc6e0'}]}>
                  <MaterialCommunityIcons
                    name="cart-minus"
                    size={22}
                    color="#b74c80"
                  />
                </View>

                <Text style={styles.labelText}>Currency :</Text>
              </View>
              <View style={styles.pickercontain}>
                <Picker
                  style={styles.pickerwidth}
                  selectedValue={
                    selectedCurrency ? selectedCurrency.value : null
                  }
                  onValueChange={itemValue => {
                    const selectedOption = currencyOptions.find(
                      option => option.value === itemValue,
                    );
                    setSelectedCurrency(selectedOption);
                    setMopSettings(selectedOption, 'currency');
                  }}
                  enabled={!(isSalesInvoiceAdded || isPurchaseInvoiceAdded)}>
                  {currencyOptions.map(option => (
                    <Picker.Item
                      label={option.label}
                      value={option.value}
                      key={option.value}
                    />
                  ))}
                </Picker>
              </View>
            </View>
          )}
          {data.role === 'admin' && (
            <View style={{margin: 10}}>
              <View style={[styles.settingsview]}>
                <View style={[styles.iconbg, {backgroundColor: '#fbc6e0'}]}>
                  <MaterialCommunityIcons
                    name="cart-minus"
                    size={22}
                    color="#b74c80"
                  />
                </View>

                <Text style={styles.labelText}>Tax Type :</Text>
              </View>
              <View style={styles.pickercontain}>
                <Picker
                  style={styles.pickerwidth}
                  selectedValue={taxType ? taxType.value : null}
                  onValueChange={itemValue => {
                    const selectedOption = taxTypeOptions.find(
                      option => option.value === itemValue,
                    );
                    setTaxType(selectedOption);
                    setMopSettings(selectedOption, 'tax_type');
                  }}
                  enabled={!(isSalesInvoiceAdded || isPurchaseInvoiceAdded)}>
                  {taxTypeOptions.map(option => (
                    <Picker.Item
                      label={option.label}
                      value={option.value}
                      key={option.value}
                    />
                  ))}
                </Picker>
              </View>
            </View>
          )}
          {data.role === 'admin' && (
            <View style={{margin: 10}}>
              <View style={[styles.settingsview]}>
                <View style={[styles.iconbg, {backgroundColor: '#fbc6e0'}]}>
                  <MaterialCommunityIcons
                    name="cart-minus"
                    size={22}
                    color="#b74c80"
                  />
                </View>

                <Text style={styles.labelText}>HsnCode In Invoice :</Text>
              </View>
              <View style={styles.pickercontain}>
                <Picker
                  style={styles.pickerwidth}
                  selectedValue={
                    hsnCodeInInvoice ? hsnCodeInInvoice.value : null
                  }
                  onValueChange={itemValue => {
                    const selectedOption = enableDisableOptions.find(
                      option => option.value === itemValue,
                    );
                    setHsnCodeInInvoice(selectedOption);
                    setMopSettings(selectedOption, 'isHsnCodeExistInInvoice');
                  }}>
                  {enableDisableOptions.map(option => (
                    <Picker.Item
                      label={option.label}
                      value={option.value}
                      key={option.value}
                    />
                  ))}
                </Picker>
              </View>
            </View>
          )}
          {data.role === 'admin' && (
            <View style={{margin: 10}}>
              <View style={[styles.settingsview]}>
                <View style={[styles.iconbg, {backgroundColor: '#fbc6e0'}]}>
                  <MaterialCommunityIcons
                    name="cart-minus"
                    size={22}
                    color="#b74c80"
                  />
                </View>

                <Text style={styles.labelText}>A5 Size Items Count :</Text>
              </View>
              <View style={styles.pickercontain}>
                <TextInput
                  style={styles.inputbg}
                  mode="flat"
                  placeholderTextColor={COLORS.black}
                  activeUnderlineColor={COLORS.primary}
                  placeholder="Enter A5 Size Items Count"
                  value={a5ItemsCount.toString()}
                  onChangeText={text => {
                    setA5ItemsCount(text);
                    setMopSettings({value: text}, 'a5_item_count');
                  }}
                />
              </View>
            </View>
          )}
          {data.role === 'admin' && (
            <View style={{margin: 10}}>
              <View style={[styles.settingsview]}>
                <View style={[styles.iconbg, {backgroundColor: '#fbc6e0'}]}>
                  <MaterialCommunityIcons
                    name="cart-minus"
                    size={22}
                    color="#b74c80"
                  />
                </View>

                <Text style={styles.labelText}>Default Customer :</Text>
              </View>
              <SearchLedgerMenu
                handleUpdateNameBalance={handleUpdateNameBalance}
                ledgerInput={defaultAccountCode}
              />
            </View>
          )}
          {data.role === 'admin' && (
            <View style={{margin: 10}}>
              <View style={[styles.settingsview]}>
                <View style={[styles.iconbg, {backgroundColor: '#fbc6e0'}]}>
                  <MaterialCommunityIcons
                    name="cart-minus"
                    size={22}
                    color="#b74c80"
                  />
                </View>

                <Text style={styles.labelText}>Bill by Bill Adjustment :</Text>
              </View>
              <View style={styles.pickercontain}>
                <Picker
                  style={styles.pickerwidth}
                  selectedValue={
                    isBillByBillAdjustmentExist
                      ? isBillByBillAdjustmentExist.value
                      : null
                  }
                  onValueChange={itemValue => {
                    const selectedOption = enableDisableOptions.find(
                      option => option.value === itemValue,
                    );
                    setIsBillByBillAdjustmentExist(selectedOption);
                    setMopSettings(
                      selectedOption,
                      'isBillByBillAdjustmentExist',
                    );
                  }}
                  enabled={
                    !(isReceiptInvoiceSplitAdded || isPaymentInvoiceSplitAdded)
                  }>
                  {enableDisableOptions.map(option => (
                    <Picker.Item
                      label={option.label}
                      value={option.value}
                      key={option.value}
                    />
                  ))}
                </Picker>
              </View>
            </View>
          )}
          {data.role === 'admin' && (
            <View style={{margin: 10}}>
              <View style={[styles.settingsview]}>
                <View style={[styles.iconbg, {backgroundColor: '#fbc6e0'}]}>
                  <MaterialCommunityIcons
                    name="cart-minus"
                    size={22}
                    color="#b74c80"
                  />
                </View>

                <Text style={styles.labelText}>TaxMode In Invoice :</Text>
              </View>
              <View style={styles.pickercontain}>
                <Picker
                  style={styles.pickerwidth}
                  selectedValue={
                    isTaxModeExistInInvoice
                      ? isTaxModeExistInInvoice.value
                      : null
                  }
                  onValueChange={itemValue => {
                    const selectedOption = enableDisableOptions.find(
                      option => option.value === itemValue,
                    );
                    setIsTaxModeExistInInvoice(selectedOption);
                    setMopSettings(selectedOption, 'isTaxModeExistInInvoice');
                  }}>
                  {enableDisableOptions.map(option => (
                    <Picker.Item
                      label={option.label}
                      value={option.value}
                      key={option.value}
                    />
                  ))}
                </Picker>
              </View>
            </View>
          )}
          {data.role === 'admin' && (
            <View style={{margin: 10}}>
              <View style={[styles.settingsview]}>
                <View style={[styles.iconbg, {backgroundColor: '#fbc6e0'}]}>
                  <MaterialCommunityIcons
                    name="cart-minus"
                    size={22}
                    color="#b74c80"
                  />
                </View>

                <Text style={styles.labelText}>GST In Invoice :</Text>
              </View>
              <View style={styles.pickercontain}>
                <Picker
                  style={styles.pickerwidth}
                  selectedValue={
                    isGstExistInInvoice ? isGstExistInInvoice.value : null
                  }
                  onValueChange={itemValue => {
                    const selectedOption = enableDisableOptions.find(
                      option => option.value === itemValue,
                    );
                    setIsGstExistInInvoice(selectedOption);
                    setMopSettings(selectedOption, 'isGstExistInInvoice');
                  }}>
                  {enableDisableOptions.map(option => (
                    <Picker.Item
                      label={option.label}
                      value={option.value}
                      key={option.value}
                    />
                  ))}
                </Picker>
              </View>
            </View>
          )}
          {data.role === 'admin' && (
            <View style={{margin: 10}}>
              <View style={[styles.settingsview]}>
                <View style={[styles.iconbg, {backgroundColor: '#fbc6e0'}]}>
                  <MaterialCommunityIcons
                    name="cart-minus"
                    size={22}
                    color="#b74c80"
                  />
                </View>

                <Text style={styles.labelText}>GST Amt In Invoice :</Text>
              </View>
              <View style={styles.pickercontain}>
                <Picker
                  style={styles.pickerwidth}
                  selectedValue={
                    isGstAmtExistInInvoice ? isGstAmtExistInInvoice.value : null
                  }
                  onValueChange={itemValue => {
                    const selectedOption = enableDisableOptions.find(
                      option => option.value === itemValue,
                    );
                    setIsGstAmtExistInInvoice(selectedOption);
                    setMopSettings(selectedOption, 'isGstAmtExistInInvoice');
                  }}>
                  {enableDisableOptions.map(option => (
                    <Picker.Item
                      label={option.label}
                      value={option.value}
                      key={option.value}
                    />
                  ))}
                </Picker>
              </View>
            </View>
          )}
          {data.role === 'admin' && (
            <View style={{margin: 10}}>
              <View style={[styles.settingsview]}>
                <View style={[styles.iconbg, {backgroundColor: '#fbc6e0'}]}>
                  <MaterialCommunityIcons
                    name="cart-minus"
                    size={22}
                    color="#b74c80"
                  />
                </View>

                <Text style={styles.labelText}>Discount In Invoice :</Text>
              </View>
              <View style={styles.pickercontain}>
                <Picker
                  style={styles.pickerwidth}
                  selectedValue={
                    isDiscountExistInInvoice
                      ? isDiscountExistInInvoice.value
                      : null
                  }
                  onValueChange={itemValue => {
                    const selectedOption = enableDisableOptions.find(
                      option => option.value === itemValue,
                    );
                    setIsDiscountExistInInvoice(selectedOption);
                    setMopSettings(selectedOption, 'isDiscountExistInInvoice');
                  }}>
                  {enableDisableOptions.map(option => (
                    <Picker.Item
                      label={option.label}
                      value={option.value}
                      key={option.value}
                    />
                  ))}
                </Picker>
              </View>
            </View>
          )}
          {data.role === 'admin' && (
            <View style={{margin: 10}}>
              <View style={[styles.settingsview]}>
                <View style={[styles.iconbg, {backgroundColor: '#fbc6e0'}]}>
                  <MaterialCommunityIcons
                    name="cart-minus"
                    size={22}
                    color="#b74c80"
                  />
                </View>

                <Text style={styles.labelText}>Expense In Invoice :</Text>
              </View>
              <View style={styles.pickercontain}>
                <Picker
                  style={styles.pickerwidth}
                  selectedValue={
                    isExpenseExistInInvoice
                      ? isExpenseExistInInvoice.value
                      : null
                  }
                  onValueChange={itemValue => {
                    const selectedOption = enableDisableOptions.find(
                      option => option.value === itemValue,
                    );
                    setIsExpenseExistInInvoice(selectedOption);
                    setMopSettings(selectedOption, 'isExpenseExistInInvoice');
                  }}>
                  {enableDisableOptions.map(option => (
                    <Picker.Item
                      label={option.label}
                      value={option.value}
                      key={option.value}
                    />
                  ))}
                </Picker>
              </View>
            </View>
          )}
          {data.role === 'admin' && (
            <View style={{margin: 10}}>
              <View style={[styles.settingsview]}>
                <View style={[styles.iconbg, {backgroundColor: '#fbc6e0'}]}>
                  <MaterialCommunityIcons
                    name="cart-minus"
                    size={22}
                    color="#b74c80"
                  />
                </View>

                <Text style={styles.labelText}>Name for Expense :</Text>
              </View>
              <View style={styles.pickercontain}>
                <TextInput
                  style={styles.inputbg}
                  mode="flat"
                  placeholderTextColor={COLORS.black}
                  activeUnderlineColor={COLORS.primary}
                  placeholder="Enter Expense Name"
                  value={expenseAliasInInvoice}
                  onChangeText={text => {
                    setExpenseAliasInInvoice(text);
                    setMopSettings({value: text}, 'expenseAliasInInvoice');
                  }}
                />
              </View>
            </View>
          )}
          {data.role === 'admin' && (
            <View style={{margin: 10}}>
              <View style={[styles.settingsview]}>
                <View style={[styles.iconbg, {backgroundColor: '#fbc6e0'}]}>
                  <MaterialCommunityIcons
                    name="cart-minus"
                    size={22}
                    color="#b74c80"
                  />
                </View>

                <Text style={styles.labelText}>
                  Update Customer After Creation of Invoice :
                </Text>
              </View>
              <View style={styles.pickercontain}>
                <Picker
                  style={styles.pickerwidth}
                  selectedValue={
                    updateCustomerAfterInvoice
                      ? updateCustomerAfterInvoice.value
                      : null
                  }
                  onValueChange={itemValue => {
                    const selectedOption = enableDisableOptions.find(
                      option => option.value === itemValue,
                    );
                    setUpdateCustomerAfterInvoice(selectedOption);
                    setMopSettings(
                      selectedOption,
                      'updateCustomerAfterInvoice',
                    );
                  }}>
                  {enableDisableOptions.map(option => (
                    <Picker.Item
                      label={option.label}
                      value={option.value}
                      key={option.value}
                    />
                  ))}
                </Picker>
              </View>
            </View>
          )}
          {data.role === 'admin' && (
            <View style={{margin: 10}}>
              <View style={[styles.settingsview]}>
                <View style={[styles.iconbg, {backgroundColor: '#fbc6e0'}]}>
                  <MaterialCommunityIcons
                    name="cart-minus"
                    size={22}
                    color="#b74c80"
                  />
                </View>

                <Text style={styles.labelText}>Remarks in Invoice :</Text>
              </View>
              <View style={styles.pickercontain}>
                <Picker
                  style={styles.pickerwidth}
                  selectedValue={
                    isRemarksExistInInvoice
                      ? isRemarksExistInInvoice.value
                      : null
                  }
                  onValueChange={itemValue => {
                    const selectedOption = enableDisableOptions.find(
                      option => option.value === itemValue,
                    );
                    setIsRemarksExistInInvoice(selectedOption);
                    setMopSettings(selectedOption, 'isRemarksExistInInvoice');
                  }}>
                  {enableDisableOptions.map(option => (
                    <Picker.Item
                      label={option.label}
                      value={option.value}
                      key={option.value}
                    />
                  ))}
                </Picker>
              </View>
            </View>
          )}
          {data.role === 'admin' && (
            <View style={{margin: 10}}>
              <View style={[styles.settingsview]}>
                <View style={[styles.iconbg, {backgroundColor: '#fbc6e0'}]}>
                  <MaterialCommunityIcons
                    name="cart-minus"
                    size={22}
                    color="#b74c80"
                  />
                </View>

                <Text style={styles.labelText}>MRP in Invoice :</Text>
              </View>
              <View style={styles.pickercontain}>
                <Picker
                  style={styles.pickerwidth}
                  selectedValue={
                    isMrpExistInInvoice ? isMrpExistInInvoice.value : null
                  }
                  onValueChange={itemValue => {
                    const selectedOption = enableDisableOptions.find(
                      option => option.value === itemValue,
                    );
                    setIsMrpExistInInvoice(selectedOption);
                    setMopSettings(selectedOption, 'isMrpExistInInvoice');
                  }}>
                  {enableDisableOptions.map(option => (
                    <Picker.Item
                      label={option.label}
                      value={option.value}
                      key={option.value}
                    />
                  ))}
                </Picker>
              </View>
            </View>
          )}
          {data.role === 'admin' && descriptionInInvoice?.value === 1 && (
            <View style={{margin: 10}}>
              <View style={[styles.settingsview]}>
                <View style={[styles.iconbg, {backgroundColor: '#fbc6e0'}]}>
                  <MaterialCommunityIcons
                    name="cart-minus"
                    size={22}
                    color="#b74c80"
                  />
                </View>

                <Text style={styles.labelText}>
                  Description as a Column in Invoice :
                </Text>
              </View>
              <View style={styles.pickercontain}>
                <Picker
                  style={styles.pickerwidth}
                  selectedValue={
                    isDescriptionExistAsAColumn
                      ? isDescriptionExistAsAColumn.value
                      : null
                  }
                  onValueChange={itemValue => {
                    const selectedOption = enableDisableOptions.find(
                      option => option.value === itemValue,
                    );
                    setIsDescriptionExistAsAColumn(selectedOption);
                    setMopSettings(
                      selectedOption,
                      'isDescriptionExistAsAColumn',
                    );
                  }}>
                  {enableDisableOptions.map(option => (
                    <Picker.Item
                      label={option.label}
                      value={option.value}
                      key={option.value}
                    />
                  ))}
                </Picker>
              </View>
            </View>
          )}
          {data.role === 'admin' && (
            <View style={{margin: 10}}>
              <View style={[styles.settingsview]}>
                <View style={[styles.iconbg, {backgroundColor: '#fbc6e0'}]}>
                  <MaterialCommunityIcons
                    name="cart-minus"
                    size={22}
                    color="#b74c80"
                  />
                </View>

                <Text style={styles.labelText}>FSSI in Invoice :</Text>
              </View>
              <View style={styles.pickercontain}>
                <Picker
                  style={styles.pickerwidth}
                  selectedValue={
                    isFssiExistInInvoice ? isFssiExistInInvoice.value : null
                  }
                  onValueChange={itemValue => {
                    const selectedOption = enableDisableOptions.find(
                      option => option.value === itemValue,
                    );
                    setIsFssiExistInInvoice(selectedOption);
                    setMopSettings(selectedOption, 'isFssiExistInInvoice');
                  }}>
                  {enableDisableOptions.map(option => (
                    <Picker.Item
                      label={option.label}
                      value={option.value}
                      key={option.value}
                    />
                  ))}
                </Picker>
              </View>
            </View>
          )}
          {data.role === 'admin' && (
            <View style={{margin: 10}}>
              <View style={[styles.settingsview]}>
                <View style={[styles.iconbg, {backgroundColor: '#fbc6e0'}]}>
                  <MaterialCommunityIcons
                    name="cart-minus"
                    size={22}
                    color="#b74c80"
                  />
                </View>

                <Text style={styles.labelText}>
                  GST in Production Invoice :
                </Text>
              </View>
              <View style={styles.pickercontain}>
                <Picker
                  style={styles.pickerwidth}
                  selectedValue={
                    isGstExistInProduction ? isGstExistInProduction.value : null
                  }
                  onValueChange={itemValue => {
                    const selectedOption = enableDisableOptions.find(
                      option => option.value === itemValue,
                    );
                    setIsGstExistInProduction(selectedOption);
                    setMopSettings(selectedOption, 'isGstExistInProduction');
                  }}>
                  {enableDisableOptions.map(option => (
                    <Picker.Item
                      label={option.label}
                      value={option.value}
                      key={option.value}
                    />
                  ))}
                </Picker>
              </View>
            </View>
          )}
          {data.role === 'admin' && (
            <View style={{margin: 10}}>
              <View style={[styles.settingsview]}>
                <View style={[styles.iconbg, {backgroundColor: '#fbc6e0'}]}>
                  <MaterialCommunityIcons
                    name="cart-minus"
                    size={22}
                    color="#b74c80"
                  />
                </View>

                <Text style={styles.labelText}>Narration in Invoice :</Text>
              </View>
              <View style={styles.pickercontain}>
                <Picker
                  style={styles.pickerwidth}
                  selectedValue={
                    isNarrationExistInInvoice
                      ? isNarrationExistInInvoice.value
                      : null
                  }
                  onValueChange={itemValue => {
                    const selectedOption = enableDisableOptions.find(
                      option => option.value === itemValue,
                    );
                    setIsNarrationExistInInvoice(selectedOption);
                    setMopSettings(selectedOption, 'isNarrationExistInInvoice');
                  }}>
                  {enableDisableOptions.map(option => (
                    <Picker.Item
                      label={option.label}
                      value={option.value}
                      key={option.value}
                    />
                  ))}
                </Picker>
              </View>
            </View>
          )}
          {data.role === 'admin' && (
            <View style={{margin: 10}}>
              <View style={[styles.settingsview]}>
                <View style={[styles.iconbg, {backgroundColor: '#fbc6e0'}]}>
                  <MaterialCommunityIcons
                    name="cart-minus"
                    size={22}
                    color="#b74c80"
                  />
                </View>

                <Text style={styles.labelText}>Sub Total as Input :</Text>
              </View>
              <View style={styles.pickercontain}>
                <Picker
                  style={styles.pickerwidth}
                  selectedValue={
                    isSubTotalAsInput ? isSubTotalAsInput.value : null
                  }
                  onValueChange={itemValue => {
                    const selectedOption = enableDisableOptions.find(
                      option => option.value === itemValue,
                    );
                    setIsSubTotalAsInput(selectedOption);
                    setMopSettings(selectedOption, 'isSubTotalAsInput');
                  }}>
                  {enableDisableOptions.map(option => (
                    <Picker.Item
                      label={option.label}
                      value={option.value}
                      key={option.value}
                    />
                  ))}
                </Picker>
              </View>
            </View>
          )}
          {data.role === 'admin' && (
            <View style={{margin: 10}}>
              <View style={[styles.settingsview]}>
                <View style={[styles.iconbg, {backgroundColor: '#fbc6e0'}]}>
                  <MaterialCommunityIcons
                    name="cart-minus"
                    size={22}
                    color="#b74c80"
                  />
                </View>

                <Text style={styles.labelText}>Company Seal in Sales :</Text>
              </View>
              <View style={styles.pickercontain}>
                <Picker
                  style={styles.pickerwidth}
                  selectedValue={
                    isCompanySealExistInSales
                      ? isCompanySealExistInSales.value
                      : null
                  }
                  onValueChange={itemValue => {
                    const selectedOption = enableDisableOptions.find(
                      option => option.value === itemValue,
                    );
                    setIsCompanySealExistInSales(selectedOption);
                    setMopSettings(selectedOption, 'isCompanySealExistInSales');
                  }}>
                  {enableDisableOptions.map(option => (
                    <Picker.Item
                      label={option.label}
                      value={option.value}
                      key={option.value}
                    />
                  ))}
                </Picker>
              </View>
            </View>
          )}
          {data.role === 'admin' && (
            <View style={{margin: 10}}>
              <View style={[styles.settingsview]}>
                <View style={[styles.iconbg, {backgroundColor: '#fbc6e0'}]}>
                  <MaterialCommunityIcons
                    name="cart-minus"
                    size={22}
                    color="#b74c80"
                  />
                </View>

                <Text style={styles.labelText}>Signature Image in Sales :</Text>
              </View>
              <View style={styles.pickercontain}>
                <Picker
                  style={styles.pickerwidth}
                  selectedValue={
                    isSignatureImageExistInSales
                      ? isSignatureImageExistInSales.value
                      : null
                  }
                  onValueChange={itemValue => {
                    const selectedOption = enableDisableOptions.find(
                      option => option.value === itemValue,
                    );
                    setIsSignatureImageExistInSales(selectedOption);
                    setMopSettings(
                      selectedOption,
                      'isSignatureImageExistInSales',
                    );
                  }}>
                  {enableDisableOptions.map(option => (
                    <Picker.Item
                      label={option.label}
                      value={option.value}
                      key={option.value}
                    />
                  ))}
                </Picker>
              </View>
            </View>
          )}
          {data.role === 'admin' && (
            <View style={{margin: 10}}>
              <View style={[styles.settingsview]}>
                <View style={[styles.iconbg, {backgroundColor: '#fbc6e0'}]}>
                  <MaterialCommunityIcons
                    name="cart-minus"
                    size={22}
                    color="#b74c80"
                  />
                </View>

                <Text style={styles.labelText}>Company Seal in Estimate :</Text>
              </View>
              <View style={styles.pickercontain}>
                <Picker
                  style={styles.pickerwidth}
                  selectedValue={
                    isCompanySealExistInEstimate
                      ? isCompanySealExistInEstimate.value
                      : null
                  }
                  onValueChange={itemValue => {
                    const selectedOption = enableDisableOptions.find(
                      option => option.value === itemValue,
                    );
                    setIsCompanySealExistInEstimate(selectedOption);
                    setMopSettings(
                      selectedOption,
                      'isCompanySealExistInEstimate',
                    );
                  }}>
                  {enableDisableOptions.map(option => (
                    <Picker.Item
                      label={option.label}
                      value={option.value}
                      key={option.value}
                    />
                  ))}
                </Picker>
              </View>
            </View>
          )}
          {data.role === 'admin' && (
            <View style={{margin: 10}}>
              <View style={[styles.settingsview]}>
                <View style={[styles.iconbg, {backgroundColor: '#fbc6e0'}]}>
                  <MaterialCommunityIcons
                    name="cart-minus"
                    size={22}
                    color="#b74c80"
                  />
                </View>

                <Text style={styles.labelText}>
                  Signature Image in Estimate :
                </Text>
              </View>
              <View style={styles.pickercontain}>
                <Picker
                  style={styles.pickerwidth}
                  selectedValue={
                    isSignatureImageExistInEstimate
                      ? isSignatureImageExistInEstimate.value
                      : null
                  }
                  onValueChange={itemValue => {
                    const selectedOption = enableDisableOptions.find(
                      option => option.value === itemValue,
                    );
                    setIsSignatureImageExistInEstimate(selectedOption);
                    setMopSettings(
                      selectedOption,
                      'isSignatureImageExistInEstimate',
                    );
                  }}>
                  {enableDisableOptions.map(option => (
                    <Picker.Item
                      label={option.label}
                      value={option.value}
                      key={option.value}
                    />
                  ))}
                </Picker>
              </View>
            </View>
          )}
          {data.role === 'admin' && (
            <View style={{margin: 10}}>
              <View style={[styles.settingsview]}>
                <View style={[styles.iconbg, {backgroundColor: '#fbc6e0'}]}>
                  <MaterialCommunityIcons
                    name="cart-minus"
                    size={22}
                    color="#b74c80"
                  />
                </View>

                <Text style={styles.labelText}>Shipping Address :</Text>
              </View>
              <View style={styles.pickercontain}>
                <Picker
                  style={styles.pickerwidth}
                  selectedValue={
                    isShippingAddressExist ? isShippingAddressExist.value : null
                  }
                  onValueChange={itemValue => {
                    const selectedOption = enableDisableOptions.find(
                      option => option.value === itemValue,
                    );
                    setIsShippingAddressExist(selectedOption);
                    setMopSettings(selectedOption, 'isShippingAddressExist');
                  }}>
                  {enableDisableOptions.map(option => (
                    <Picker.Item
                      label={option.label}
                      value={option.value}
                      key={option.value}
                    />
                  ))}
                </Picker>
              </View>
            </View>
          )}
          {data.role === 'admin' && (
            <View style={{margin: 10}}>
              <View style={[styles.settingsview]}>
                <View style={[styles.iconbg, {backgroundColor: '#fbc6e0'}]}>
                  <MaterialCommunityIcons
                    name="cart-minus"
                    size={22}
                    color="#b74c80"
                  />
                </View>

                <Text style={styles.labelText}>Commission Input :</Text>
              </View>
              <View style={styles.pickercontain}>
                <TextInput
                  style={styles.inputbg}
                  mode="flat"
                  placeholderTextColor={COLORS.black}
                  activeUnderlineColor={COLORS.primary}
                  placeholder="Enter Commission Input"
                  value={commissionInput.toString()}
                  onChangeText={text => {
                    setCommissionInput(text);
                    setMopSettings({value: text}, 'commission_input');
                  }}
                />
              </View>
            </View>
          )}
        </ScrollView>
      </View>
      <View style={styles.btncontain}>
        <View style={styles.positionbtn}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            {data.role === 'admin' && (
              <TouchableOpacity
                onPress={handleFormatData}
                style={{
                  backgroundColor: COLORS.primary,
                  width: screenWidth * 0.5,
                  padding: 20,
                }}>
                <Text style={styles.btnText}>Format Data</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              onPress={handleChangePassword}
              style={{
                backgroundColor: COLORS.red,
                width: screenWidth * 0.5,
                padding: 20,
              }}>
              <Text style={styles.btnText}>Change Password</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <DeleteConfirmationModal
        showModal={showDelModal}
        handleClose={handleCloseModal}
        handleSubmitAlert={handleSubmitAlert}
      />
      <InternalLoginModal
        showModal={showLoginModal}
        handleClose={handleCloseModal}
        type="format"
        invoiceNo=""
      />
      <ChangePasswordModal
        username={data.username}
        showModal={showChangePasswordModal}
        handleClose={handleCloseModal}
      />
    </View>
  );
};

export default Settings;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  labelText: {
    fontFamily: FONTS.body4.fontFamily,
    fontSize: 16,
    paddingLeft: 10,
    color: COLORS.black,
    fontWeight: '700',
  },
  settingsview: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconbg: {
    width: 35,
    height: 35,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30,
  },
  pickercontain: {
    marginLeft: 10,
    marginTop: 10,
    borderRadius: 5,
    backgroundColor: '#EFEFEF',
    width: screenWidth * 0.9,
  },
  btncontain: {
    position: 'relative',

    marginTop: 5,
  },
  btnText: {
    textAlign: 'center',
    color: COLORS.white,
    fontFamily: FONTS.body4.fontFamily,
    fontWeight: '700',
    marginBottom: 5,
  },
  positionbtn: {
    position: 'absolute',
    bottom: 0,
  },
  pickerwidth: {color: COLORS.black},
});
