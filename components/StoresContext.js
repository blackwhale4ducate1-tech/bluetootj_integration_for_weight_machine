import React, {createContext, useContext, useState} from 'react';

// Create StoresContext
const StoresContext = createContext();

// Create StoresProvider component to wrap the app and provide StoresContext
export const StoresProvider = ({children}) => {
  const initialFormData = {
    id: '',
    store_name: '',
    email: '',
    phone_no: '',
    country: '',
    state: '',
    city: '',
    address: '',
    pincode: '',
    gstin: '',
    validationError: '',
  };
  const [formData, setFormData] = useState(initialFormData);
  const [loading, setLoading] = useState(false);
  const [stores, setStores] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState('Add Store');
  const [showDelModal, setShowDelModal] = useState(false);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  return (
    <StoresContext.Provider
      value={{
        initialFormData,
        formData,
        setFormData,
        loading,
        setLoading,
        stores,
        setStores,
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
    </StoresContext.Provider>
  );
};

// Create useStores hook to access StoresContext
export const useStores = () => useContext(StoresContext);
