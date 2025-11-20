import React, {createContext, useContext, useState, useMemo} from 'react';
import {useNavigation} from '@react-navigation/native';
import {useAuth} from './AuthContext';

// Create ProductionContext
const ProductionContext = createContext();

// Create ProductionProvider component to wrap the app and provide ProductionContext
export const ProductionProvider = ({children}) => {
  const navigation = useNavigation();
  const {data} = useAuth();

  const initialHeaderFormData = {
    invoiceNo: '',
    customInvoiceNo: '',
    invoiceDate: new Date(),
  };

  const initialItem = useMemo(
    () => ({
      sNo: '',
      product_type: '',
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
  const [barcodeSeries, setBarcodeSeries] = useState(0);
  const [addedBarcodes, setAddedBarcodes] = useState([]);
  const [billingType, setBillingType] = useState('production');

  const newProduction = () => {
    setFormDataHeader(initialHeaderFormData);
    setItems([
      {...initialItem, product_type: 'finished'},
      {...initialItem, product_type: 'raw'},
    ]);
    setFormDataFooter(initialFooterFormData);
    setNewProduct(initialItem);
    setSearchProductInput('');
    setSearchCustomerInput('');
    setItemStatus('Add');
    setRowNoToUpdate(0);
    setBarcodeSeries(0);
    setAddedBarcodes([]);
    setBillingType('production');
  };

  const finishedTotalCost = Number(
    items
      .filter(item => item.product_type === 'finished')
      .reduce((total, item) => total + Number(item.subTotal), 0),
  ).toFixed(2);
  const rawTotalCost = Number(
    items
      .filter(item => item.product_type === 'raw')
      .reduce((total, item) => total + Number(item.subTotal), 0),
  ).toFixed(2);

  const addBarcode = barcode => {
    setAddedBarcodes([...addedBarcodes, barcode]);
  };

  return (
    <ProductionContext.Provider
      value={{
        initialHeaderFormData,
        initialItem,
        formDataHeader,
        setFormDataHeader,
        items,
        setItems,
        formDataFooter,
        setFormDataFooter,
        newProduction,
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
        finishedTotalCost,
        rawTotalCost,
        barcodeSeries,
        setBarcodeSeries,
        addedBarcodes,
        addBarcode,
        billingType,
        setBillingType,
      }}>
      {children}
    </ProductionContext.Provider>
  );
};

// Create useProduction hook to access ProductionContext
export const useProduction = () => useContext(ProductionContext);
