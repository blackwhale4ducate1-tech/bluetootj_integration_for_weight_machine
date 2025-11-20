import React, {createContext, useContext, useState, useMemo} from 'react';
import {useNavigation} from '@react-navigation/native';

// Create OpeningStockContext
const OpeningStockContext = createContext();

// Create OpeningStockProvider component to wrap the app and provide OpeningStockContext
export const OpeningStockProvider = ({children}) => {
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

  const initialFooterFormData = {
    discountType: null,
    discountInput: '',
    discountOnTotal: '',
    mop: null,
    // invoice_print_type: null,
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
  const [billingType, setBillingType] = useState('openingStock');

  const newOpeningStock = () => {
    setFormDataHeader(initialHeaderFormData);
    setItems([]);
    setFormDataFooter(initialFooterFormData);
    setNewProduct(initialItem);
    setSearchProductInput('');
    setSearchCustomerInput('');
    setItemStatus('Add');
    setRowNoToUpdate(0);
    setBillingType('openingStock');
  };

  const billAmountTemp = Number(
    items.reduce((total, item) => total + Number(item.subTotal), 0).toFixed(2) -
      Number(
        (formDataFooter.discountOnTotal !== ''
          ? Number(formDataFooter.discountOnTotal)
          : 0
        ).toFixed(2),
      ) +
      Number(
        (formDataFooter.otherExpenses !== ''
          ? Number(formDataFooter.otherExpenses)
          : 0
        ).toFixed(2),
      ),
  );

  // const billAmount = Number(billAmountTemp.toFixed());
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
    <OpeningStockContext.Provider
      value={{
        initialHeaderFormData,
        initialItem,
        formDataHeader,
        setFormDataHeader,
        items,
        setItems,
        formDataFooter,
        setFormDataFooter,
        newOpeningStock,
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
    </OpeningStockContext.Provider>
  );
};

// Create useOpeningStock hook to access OpeningStockContext
export const useOpeningStock = () => useContext(OpeningStockContext);
