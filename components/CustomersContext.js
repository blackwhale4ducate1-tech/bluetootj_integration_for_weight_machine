import React, {createContext, useContext, useState} from 'react';

// Create CustomersContext
const CustomersContext = createContext();

// Create CustomersProvider component to wrap the app and provide CustomersContext
export const CustomersProvider = ({children}) => {
  const initialFormData = {
    id: '',
    type: 'client',
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
    debit_credit: {value: 'DEBIT', label: 'DEBIT'},
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
  const [modalTitle, setModalTitle] = useState('Add Customer');
  const [showDelModal, setShowDelModal] = useState(false);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  return (
    <CustomersContext.Provider
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
    </CustomersContext.Provider>
  );
};

// Create useCustomers hook to access CustomersContext
export const useCustomers = () => useContext(CustomersContext);
