import React, {createContext, useContext, useState} from 'react';

// Create VendorsContext
const VendorsContext = createContext();

// Create VendorsProvider component to wrap the app and provide VendorsContext
export const VendorsProvider = ({children}) => {
  const initialFormData = {
    id: '',
    type: 'vendor',
    name: '',
    account_code: '',
    regional_name: '',
    phone_no: '',
    alt_phone_no: '',
    email: '',
    address: '',
    gstin: '',
    state: '',
    city: '',
    opening_balance: '',
    invoiceDate: new Date().toISOString().split('T')[0],
    debit_credit: {value: 'CREDIT', label: 'CREDIT'},
    credit_limit: '',
    credit_days: '',
    validationError: '',
  };
  const [formData, setFormData] = useState(initialFormData);
  const [loading, setLoading] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState('Add Vendor');
  const [showDelModal, setShowDelModal] = useState(false);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  return (
    <VendorsContext.Provider
      value={{
        initialFormData,
        formData,
        setFormData,
        loading,
        setLoading,
        customers,
        setCustomers,
        filteredCustomers,
        setFilteredCustomers,
        searchInput,
        setSearchInput,
        showModal,
        setShowModal,
        modalTitle,
        setModalTitle,
        showDelModal,
        setShowDelModal,
        showAlertModal,
        setShowAlertModal,
        alertMessage,
        setAlertMessage,
      }}>
      {children}
    </VendorsContext.Provider>
  );
};

// Create useVendors hook to access VendorsContext
export const useVendors = () => useContext(VendorsContext);
