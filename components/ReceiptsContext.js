import React, {createContext, useContext, useState} from 'react';
import {useAuth} from './AuthContext';

// Create ReceiptsContext
const ReceiptsContext = createContext();

// Create ReceiptsProvider component to wrap the app and provide ReceiptsContext
export const ReceiptsProvider = ({children}) => {
  const {data} = useAuth();
  const initialFormData = {
    id: '',
    invoiceNo: '',
    invoiceDate: new Date(),
    mor: null,
    ledger: '',
    outstandingBalance: '',
    narration: '',
    amount: '',
    user: {id: data.id, username: data.username},
  };
  const [formData, setFormData] = useState(initialFormData);
  const [loading, setLoading] = useState(false);
  const [receipts, setReceipts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState('Add Receipt');
  const [showDelModal, setShowDelModal] = useState(false);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [searchLedgerInput, setSearchLedgerInput] = useState('');
  const [initialReceiptSplits, setInitialReceiptSplits] = useState([]);

  return (
    <ReceiptsContext.Provider
      value={{
        initialFormData,
        formData,
        setFormData,
        loading,
        setLoading,
        receipts,
        setReceipts,
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
        searchLedgerInput,
        setSearchLedgerInput,
        initialReceiptSplits,
        setInitialReceiptSplits,
      }}>
      {children}
    </ReceiptsContext.Provider>
  );
};

// Create useReceipts hook to access ReceiptsContext
export const useReceipts = () => useContext(ReceiptsContext);
