import React, {createContext, useContext, useState} from 'react';

// Create AccountGroupContext
const AccountGroupContext = createContext();

// Create AccountGroupProvider component to wrap the app and provide AccountGroupContext
export const AccountGroupProvider = ({children}) => {
  const initialFormData = {
    id: '',
    baseGroup: '',
    accountGroup: '',
    validationError: '',
  };
  const [formData, setFormData] = useState(initialFormData);
  const [loading, setLoading] = useState(false);
  const [accountGroupData, setAccountGroupData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState('Add Account Group');
  const [showDelModal, setShowDelModal] = useState(false);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  return (
    <AccountGroupContext.Provider
      value={{
        initialFormData,
        formData,
        setFormData,
        loading,
        setLoading,
        accountGroupData,
        setAccountGroupData,
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
    </AccountGroupContext.Provider>
  );
};

// Create useAccountGroup hook to access AccountGroupContext
export const useAccountGroup = () => useContext(AccountGroupContext);
