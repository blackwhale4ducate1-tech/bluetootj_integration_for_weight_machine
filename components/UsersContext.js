import React, {createContext, useContext, useState} from 'react';

// Create UsersContext
const UsersContext = createContext();

// Create UsersProvider component to wrap the app and provide UsersContext
export const UsersProvider = ({children}) => {
  const initialFormData = {
    id: '',
    role: null,
    username: '',
    password: '',
    change_password_check: 0,
    email: '',
    phone_no: '',
    country: '',
    state: '',
    city: '',
    address: '',
    pincode: '',
    gstin: '',
    bank_name: '',
    account_no: '',
    ifsc_code: '',
    branch: '',
    accountName: '',
    panNo: '',
    fssi: '',
    validationError: '',
  };
  const [formData, setFormData] = useState(initialFormData);
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState('Add Product Category');
  const [showDelModal, setShowDelModal] = useState(false);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  return (
    <UsersContext.Provider
      value={{
        initialFormData,
        formData,
        setFormData,
        loading,
        setLoading,
        users,
        setUsers,
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
    </UsersContext.Provider>
  );
};

// Create useUsers hook to access UsersContext
export const useUsers = () => useContext(UsersContext);
