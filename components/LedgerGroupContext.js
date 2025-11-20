import React, {createContext, useContext, useState} from 'react';

// Create LedgerGroupContext
const LedgerGroupContext = createContext();

// Create LedgerGroupProvider component to wrap the app and provide LedgerGroupContext
export const LedgerGroupProvider = ({children}) => {
  const initialFormData = {
    id: '',
    ledgerGroup: '',
    accountGroup: null,
    validationError: '',
  };
  const [formData, setFormData] = useState(initialFormData);
  const [loading, setLoading] = useState(false);
  const [ledgerGroupData, setLedgerGroupData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState('Add Ledger Group');
  const [showDelModal, setShowDelModal] = useState(false);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  return (
    <LedgerGroupContext.Provider
      value={{
        initialFormData,
        formData,
        setFormData,
        loading,
        setLoading,
        ledgerGroupData,
        setLedgerGroupData,
        filteredData,
        setFilteredData,
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
    </LedgerGroupContext.Provider>
  );
};

// Create useLedgerGroup hook to access LedgerGroupContext
export const useLedgerGroup = () => useContext(LedgerGroupContext);
