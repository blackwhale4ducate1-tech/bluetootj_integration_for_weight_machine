import React, {createContext, useContext, useState} from 'react';

// Create ProductCategoryContext
const ProductCategoryContext = createContext();

// Create ProductCategoryProvider component to wrap the app and provide ProductCategoryContext
export const ProductCategoryProvider = ({children}) => {
  const initialFormData = {
    id: '',
    name: '',
    validationError: '',
  };
  const [formData, setFormData] = useState(initialFormData);
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState('Add Product Category');
  const [showDelModal, setShowDelModal] = useState(false);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  return (
    <ProductCategoryContext.Provider
      value={{
        initialFormData,
        formData,
        setFormData,
        loading,
        setLoading,
        products,
        setProducts,
        filteredProducts,
        setFilteredProducts,
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
    </ProductCategoryContext.Provider>
  );
};

// Create useProductCategory hook to access ProductCategoryContext
export const useProductCategory = () => useContext(ProductCategoryContext);
