import React, {createContext, useContext, useState} from 'react';

// Create ProductCompositionContext
const ProductCompositionContext = createContext();

// Create ProductCompositionProvider component to wrap the app and provide ProductCompositionContext
export const ProductCompositionProvider = ({children}) => {
  const initialFormData = {
    id: '',
    finishedProduct: '',
    finishedProductQty: '',
    componentProduct: '',
    componentProductQty: '',
    validationError: '',
  };
  const [formData, setFormData] = useState(initialFormData);
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState('Add Product Composition');
  const [showDelModal, setShowDelModal] = useState(false);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [editComponents, setEditComponents] = useState([]);

  return (
    <ProductCompositionContext.Provider
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
        editComponents,
        setEditComponents,
      }}>
      {children}
    </ProductCompositionContext.Provider>
  );
};

// Create useProductComposition hook to access ProductCompositionContext
export const useProductComposition = () =>
  useContext(ProductCompositionContext);
