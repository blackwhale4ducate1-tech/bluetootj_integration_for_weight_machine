import React, {createContext, useContext, useState} from 'react';
import {useAuth} from './AuthContext';

// Create PaymentsContext
const PaymentsContext = createContext();

// Create PaymentsProvider component to wrap the app and provide PaymentsContext
export const PaymentsProvider = ({children}) => {
  const {data} = useAuth();
  const initialFormData = {
    id: '',
    invoiceNo: '',
    invoiceDate: new Date(),
    mop: null,
    ledger: '',
    outstandingBalance: '',
    narration: '',
    amount: '',
    user: {id: data.id, username: data.username},
  };
  const [formData, setFormData] = useState(initialFormData);
  const [loading, setLoading] = useState(false);
  const [payments, setPayments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState('Add Payment');
  const [showDelModal, setShowDelModal] = useState(false);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [searchLedgerInput, setSearchLedgerInput] = useState('');
  const [initialPaymentSplits, setInitialPaymentSplits] = useState([]);

  return (
    <PaymentsContext.Provider
      value={{
        initialFormData,
        formData,
        setFormData,
        loading,
        setLoading,
        payments,
        setPayments,
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
        initialPaymentSplits,
        setInitialPaymentSplits,
      }}>
      {children}
    </PaymentsContext.Provider>
  );
};

// Create usePayments hook to access PaymentsContext
export const usePayments = () => useContext(PaymentsContext);
