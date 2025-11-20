import React, {createContext, useContext, useState, useMemo} from 'react';
import {useNavigation} from '@react-navigation/native';

// Create SalesContext
const SalesContext = createContext();

// Create SalesProvider component to wrap the app and provide SalesContext
export const SalesProvider = ({children}) => {
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
      description: '',
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
    user: {},
    narration: '',
    shippingAddress: '',
  };

  const [formDataHeader, setFormDataHeader] = useState(initialHeaderFormData);
  const [items, setItems] = useState([]);
  const [formDataFooter, setFormDataFooter] = useState(initialFooterFormData);
  const [newProduct, setNewProduct] = useState(initialItem);
  const [searchProductInput, setSearchProductInput] = useState('');
  const [searchCustomerInput, setSearchCustomerInput] = useState('');
  const [itemStatus, setItemStatus] = useState('Add');
  const [rowNoToUpdate, setRowNoToUpdate] = useState(0);
  const [billingType, setBillingType] = useState('sales');

  const newSales = () => {
    setFormDataHeader(initialHeaderFormData);
    setItems([]);
    setFormDataFooter(initialFooterFormData);
    setNewProduct(initialItem);
    setSearchProductInput('');
    setSearchCustomerInput('');
    setItemStatus('Add');
    setRowNoToUpdate(0);
    setBillingType('sales');
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
    <SalesContext.Provider
      value={{
        initialHeaderFormData,
        initialItem,
        formDataHeader,
        setFormDataHeader,
        items,
        setItems,
        formDataFooter,
        setFormDataFooter,
        newSales,
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
    </SalesContext.Provider>
  );
};

// Create useSales hook to access SalesContext
export const useSales = () => useContext(SalesContext);
