import React, {createContext, useContext, useState} from 'react';

// Create ProductDetailsContext
const ProductDetailsContext = createContext();

// Create ProductDetailsProvider component to wrap the app and provide ProductDetailsContext
export const ProductDetailsProvider = ({children}) => {
  const initialFormData = {
    id: '',
    productCategoryId: null,
    productName: '',
    productCode: '',
    hsnCode: '',
    rol: '',
    igst: '',
    sgst: '',
    cgst: '',
    purchasePrice: '',
    salesPrice: '',
    mrp: '',
    purchaseInclusive: 0,
    salesInclusive: 0,
    expiryDate: '',
    unit: '',
    alt_unit: '',
    uc_factor: 0,
    discountP: '',
    remarks: '',
    validationError: '',
  };
  const [formData, setFormData] = useState(initialFormData);
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState('Add Product Details');
  const [showDelModal, setShowDelModal] = useState(false);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  return (
    <ProductDetailsContext.Provider
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
    </ProductDetailsContext.Provider>
  );
};

// Create useProductDetails hook to access ProductDetailsContext
export const useProductDetails = () => useContext(ProductDetailsContext);
