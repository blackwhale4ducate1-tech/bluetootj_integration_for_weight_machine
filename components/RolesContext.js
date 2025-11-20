import React, {createContext, useContext, useState} from 'react';

// Create RolesContext
const RolesContext = createContext();

// Create RolesProvider component to wrap the app and provide RolesContext
export const RolesProvider = ({children}) => {
  const initialFormData = {
    id: '',
    role: '',
    validationError: '',
  };
  const [formData, setFormData] = useState(initialFormData);
  const [loading, setLoading] = useState(false);
  const [roles, setRoles] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState('Add Role');
  const [showDelModal, setShowDelModal] = useState(false);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  return (
    <RolesContext.Provider
      value={{
        initialFormData,
        formData,
        setFormData,
        loading,
        setLoading,
        roles,
        setRoles,
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
    </RolesContext.Provider>
  );
};

// Create useRoles hook to access RolesContext
export const useRoles = () => useContext(RolesContext);
