import React, {createContext, useContext, useState, useMemo} from 'react';
import {useNavigation} from '@react-navigation/native';

// Create StockTransferContext
const StockTransferContext = createContext();

// Create StockTransferProvider component to wrap the app and provide StockTransferContext
export const StockTransferProvider = ({children}) => {
  const navigation = useNavigation();

  const initialHeaderFormData = {
    invoiceNo: '',
    invoiceDate: new Date(),
    source: '',
    destination: '',
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
      unitOptions: [],
      dynamicColumns: {},
    }),
    [],
  );

  const initialFooterFormData = {
    tax: {value: 'GST', label: 'GST'},
    vehicle_no: '',
    user: {},
    priceList: {value: 'None', label: 'None'},
    notes: '',
  };

  const [formDataHeader, setFormDataHeader] = useState(initialHeaderFormData);
  const [items, setItems] = useState([]);
  const [formDataFooter, setFormDataFooter] = useState(initialFooterFormData);
  const [newProduct, setNewProduct] = useState(initialItem);
  const [searchProductInput, setSearchProductInput] = useState('');
  const [searchCustomerInput, setSearchCustomerInput] = useState('');
  const [itemStatus, setItemStatus] = useState('Add');
  const [rowNoToUpdate, setRowNoToUpdate] = useState(0);
  const [billingType, setBillingType] = useState('stock_transfer');

  const newStockTransfer = () => {
    setFormDataHeader(initialHeaderFormData);
    setItems([]);
    setFormDataFooter(initialFooterFormData);
    setNewProduct(initialItem);
    setSearchProductInput('');
    setSearchCustomerInput('');
    setItemStatus('Add');
    setRowNoToUpdate(0);
    setBillingType('stock_transfer');
  };

  const totalAmt = Number(
    items.reduce((total, item) => total + Number(item.subTotal), 0).toFixed(2),
  );

  return (
    <StockTransferContext.Provider
      value={{
        initialHeaderFormData,
        initialItem,
        formDataHeader,
        setFormDataHeader,
        items,
        setItems,
        formDataFooter,
        setFormDataFooter,
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
        newStockTransfer,
        totalAmt,
        billingType,
        setBillingType,
      }}>
      {children}
    </StockTransferContext.Provider>
  );
};

// Create useStockTransfer hook to access StockTransferContext
export const useStockTransfer = () => useContext(StockTransferContext);
