import React, {createContext, useContext, useState, useMemo} from 'react';
import {useNavigation} from '@react-navigation/native';
import {useAuth} from './AuthContext';

// Create PurchaseReturnContext
const PurchaseReturnContext = createContext();

// Create PurchaseReturnProvider component to wrap the app and provide PurchaseReturnContext
export const PurchaseReturnProvider = ({children}) => {
  const navigation = useNavigation();
  const {data} = useAuth();

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
      dropdownOptions: [],
      unitOptions: [],
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
    discountType:
      data.business_category === 'FlowerShop'
        ? {value: 'Commission %', label: 'Commission %'}
        : null,
    discountInput:
      data.business_category === 'FlowerShop' ? data.commission_input : '',
    discountOnTotal: '',
    mop:
      data.business_category === 'FlowerShop'
        ? {value: 'CREDIT', label: 'CREDIT'}
        : null,
    invoice_print_type: null,
    otherExpenses: '',
    tax: {value: 'GST', label: 'GST'},
    store: null,
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
  const [roundOff, setRoundOff] = useState(0);
  const [barcodeSeries, setBarcodeSeries] = useState(0);
  const [addedBarcodes, setAddedBarcodes] = useState([]);
  const [billingType, setBillingType] = useState('purchase');

  const newPurchaseReturn = () => {
    setFormDataHeader(initialHeaderFormData);
    setItems([]);
    setFormDataFooter(initialFooterFormData);
    setNewProduct(initialItem);
    setSearchProductInput('');
    setSearchCustomerInput('');
    setItemStatus('Add');
    setRowNoToUpdate(0);
    setRoundOff(0);
    setBarcodeSeries(0);
    setAddedBarcodes([]);
    setBillingType('purchaseReturn');
  };

  const billAmountTemp = Number(
    (
      items
        .reduce((total, item) => total + Number(item.subTotal), 0)
        .toFixed(2) -
      Number(
        (formDataFooter.discountOnTotal !== ''
          ? Number(formDataFooter.discountOnTotal)
          : 0
        ).toFixed(2),
      ) +
      (data.business_category !== 'FlowerShop'
        ? Number(
            (formDataFooter.otherExpenses !== ''
              ? Number(formDataFooter.otherExpenses)
              : 0
            ).toFixed(2),
          )
        : -Number(
            (formDataFooter.otherExpenses !== ''
              ? Number(formDataFooter.otherExpenses)
              : 0
            ).toFixed(2),
          ))
    ).toFixed(2),
  );

  const billAmount = Number(Number(billAmountTemp) + Number(roundOff)).toFixed(
    2,
  );

  const totalAmt = Number(
    items.reduce((total, item) => total + Number(item.subTotal), 0).toFixed(2),
  );

  const addBarcode = barcode => {
    setAddedBarcodes([...addedBarcodes, barcode]);
  };

  return (
    <PurchaseReturnContext.Provider
      value={{
        initialHeaderFormData,
        initialItem,
        formDataHeader,
        setFormDataHeader,
        items,
        setItems,
        formDataFooter,
        setFormDataFooter,
        newPurchaseReturn,
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
        setRoundOff,
        barcodeSeries,
        setBarcodeSeries,
        addedBarcodes,
        addBarcode,
        billingType,
        setBillingType,
      }}>
      {children}
    </PurchaseReturnContext.Provider>
  );
};

// Create usePurchaseReturn hook to access PurchaseReturnContext
export const usePurchaseReturn = () => useContext(PurchaseReturnContext);
