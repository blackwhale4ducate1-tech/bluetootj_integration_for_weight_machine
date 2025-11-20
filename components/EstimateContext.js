import React, {createContext, useContext, useState, useMemo} from 'react';
import {useNavigation} from '@react-navigation/native';

// Create EstimateContext
const EstimateContext = createContext();

// Create EstimateProvider component to wrap the app and provide EstimateContext
export const EstimateProvider = ({children}) => {
  const navigation = useNavigation();

  const initialHeaderFormData = {
    invoiceNo: '',
    customInvoiceNo: '',
    invoiceDate: new Date(),
    name: '',
    phoneNo: '',
    gstin: '',
    city: '',
    address: '',
    os: '',
    count: '',
  };

  const initialItem = useMemo(
    () => ({
      sNo: '',
      barcode: '',
      productCode: '',
      productName: '',
      hsnCode: '',
      unit: '',
      alt_unit: '',
      uc_factor: '',
      selectedUnit: '',
      qty: '',
      purchasePrice: '',
      salesPrice: '',
      mrp: '',
      cost: '',
      newPurchasePrice: '',
      newSalesPrice: '',
      newMrp: '',
      // salesPriceInStock: '',
      purchaseInclusive: '',
      salesInclusive: '',
      grossAmt: '',
      taxable: '',
      selectedTax: '',
      cgstP: '',
      cgst: '',
      sgstP: '',
      sgst: '',
      igstP: '',
      igst: '',
      discountP: '',
      discount: '',
      subTotal: '',
      unitOptions: [],
      dynamicColumns: {},
      remarks: '',
    }),
    [],
  );

  const initialProfileData = {
    username: 'user1',
    email: '',
    phone_no: '',
    country: '',
    state: '',
    city: '',
    address: '',
    pincode: '',
    gstin: '',
    company_full_name: '',
    bank_name: '',
    account_no: '',
    ifsc_code: '',
    branch: '',
    declaration: '',
    image_name: '',
    qr_image_name: '',
    accountName: '',
    panNo: '',
    fssi: '',
    accountName: '',
    panNo: '',
    fssi: '',
    companySealImageName: '',
    authorisedSignatureImageName: '',
  };

  const initialFooterFormData = {
    discountType: null,
    discountInput: '',
    discountOnTotal: '',
    mop: null,
    invoice_print_type: null,
    otherExpenses: '',
    tax: {value: 'GST', label: 'GST'},
    // os: "",
    cash: '',
    card: '',
    bank: null,
    tenderedAmt: '',
    balance: '',
    store: null,
    priceList: {value: 'None', label: 'None'},
    estimate_account_add_status: null,
    user: {},
    narration: '',
  };

  const [formDataHeader, setFormDataHeader] = useState(initialHeaderFormData);
  const [items, setItems] = useState([]);
  const [formDataFooter, setFormDataFooter] = useState(initialFooterFormData);
  const [newProduct, setNewProduct] = useState(initialItem);
  const [searchProductInput, setSearchProductInput] = useState('');
  const [searchCustomerInput, setSearchCustomerInput] = useState('');
  const [itemStatus, setItemStatus] = useState('Add');
  const [rowNoToUpdate, setRowNoToUpdate] = useState(0);
  const [billingType, setBillingType] = useState('estimate');

  const newEstimate = () => {
    setFormDataHeader(initialHeaderFormData);
    setItems([]);
    setFormDataFooter(initialFooterFormData);
    setNewProduct(initialItem);
    setSearchProductInput('');
    setSearchCustomerInput('');
    setItemStatus('Add');
    setRowNoToUpdate(0);
    setBillingType('estimate');
  };

  const billAmountTemp = Number(
    items && items.length > 0
      ? items
          .reduce((total, item) => total + Number(item.subTotal), 0)
          .toFixed(2)
      : 0 -
          Number(
            (formDataFooter && formDataFooter.discountOnTotal !== ''
              ? Number(formDataFooter.discountOnTotal)
              : 0
            ).toFixed(2),
          ) +
          Number(
            (formDataFooter && formDataFooter.otherExpenses !== ''
              ? Number(formDataFooter.otherExpenses)
              : 0
            ).toFixed(2),
          ),
  );

  const billAmount = Number(billAmountTemp.toFixed());

  const totalAmt = Number(
    items && items.length > 0
      ? items
          .reduce((total, item) => total + Number(item.subTotal), 0)
          .toFixed(2)
      : 0,
  );

  const roundOff = Number(
    (billAmount - Number(billAmountTemp.toFixed(2))).toFixed(2),
  );

  formDataFooter.balance = (
    Number(formDataFooter.tenderedAmt) - Number(billAmount)
  ).toFixed(2);

  return (
    <EstimateContext.Provider
      value={{
        initialHeaderFormData,
        initialItem,
        formDataHeader,
        setFormDataHeader,
        items,
        setItems,
        formDataFooter,
        setFormDataFooter,
        newEstimate,
        initialProfileData,
        newProduct,
        setNewProduct,
        searchProductInput,
        setSearchProductInput,
        searchCustomerInput,
        setSearchCustomerInput,
        itemStatus,
        setItemStatus,
        rowNoToUpdate,
        setRowNoToUpdate,
        billAmount,
        totalAmt,
        roundOff,
        billingType,
        setBillingType,
      }}>
      {children}
    </EstimateContext.Provider>
  );
};

// Create useEstimate hook to access EstimateContext
export const useEstimate = () => useContext(EstimateContext);
