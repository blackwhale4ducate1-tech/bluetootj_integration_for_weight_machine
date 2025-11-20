import React, {createContext, useContext, useState} from 'react';

// Create PriceListContext
const PriceListContext = createContext();

// Create PriceListProvider component to wrap the app and provide PriceListContext
export const PriceListProvider = ({children}) => {
  const initialFormData = {
    id: '',
    column_name: '',
    column_type: 'DOUBLE',
    model_name: 'product_details',
    validationError: '',
  };
  const [formData, setFormData] = useState(initialFormData);
  const [loading, setLoading] = useState(false);
  const [priceLists, setPriceLists] = useState([]);
  const [filteredPriceLists, setFilteredPriceLists] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState('Add Price List');
  const [showDelModal, setShowDelModal] = useState(false);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  return (
    <PriceListContext.Provider
      value={{
        initialFormData,
        formData,
        setFormData,
        loading,
        setLoading,
        priceLists,
        setPriceLists,
        filteredPriceLists,
        setFilteredPriceLists,
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
    </PriceListContext.Provider>
  );
};

// Create usePriceList hook to access PriceListContext
export const usePriceList = () => useContext(PriceListContext);
