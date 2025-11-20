import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {useState, useEffect, useRef, useCallback} from 'react';
import axios from 'axios';
import {API_BASE_URL} from '../config';
import {useAuth} from './AuthContext';
import OuterBodyModal from './OuterBodyModal';
import styles from './AddEditModalStyles';
import SearchResponsiveTable from './SearchResponsiveTable';
import AddEditProductDetails from './AddEditProductDetails';

const SearchSalesProductModal = ({
  modalTitle,
  showModal,
  handleClose,
  updateItems,
  rowNo,
  is_barcode_exist,
}) => {
  const {data} = useAuth();
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
    purchaseInclusive: false,
    salesInclusive: false,
    expiryDate: '',
    unit: '',
    alt_unit: '',
    uc_factor: '',
    discountP: '',
    validationError: '',
  };

  const [searchInput, setSearchInput] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [activeRow, setActiveRow] = useState(0);
  const inputRef = useRef(null);

  const onHandleSearchInput = async inputValue => {
    try {
      const res = await axios.post(
        `${API_BASE_URL}/api/searchSalesProductByInput`,
        {
          searchInput: inputValue,
          company_name: data.company_name,
          type: type,
        },
      );
      // console.log("searchProductByInput: " + JSON.stringify(res.data));
      if (res.data.message) {
        setSearchResults(res.data.message);
        setActiveRow(0); // Reset the active row index when search results change
      } else {
        setSearchResults([]);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleSubmit = async () => {
    updateItems(prevItems => {
      const updatedItems = [...prevItems];
      const updatedItem = {...updatedItems[rowNo]};
      // console.log("rowNo: " + rowNo);
      // console.log(
      //   "searchResults[activeRow]: " +
      //     JSON.stringify(searchResults[activeRow])
      // );
      // console.log("updatedItem before: " + JSON.stringify(updatedItem));
      updatedItem.barcode = searchResults[activeRow]?.barcode || '';
      updatedItem.productCode = searchResults[activeRow]?.product_code || '';
      updatedItem.productName = searchResults[activeRow]?.product_name || '';
      updatedItem.hsnCode = searchResults[activeRow]?.hsn_code || '';
      updatedItem.qty = '';
      updatedItem.purchasePrice =
        searchResults[activeRow]?.purchase_price || '';
      updatedItem.salesPrice = searchResults[activeRow]?.sales_price || '';
      // updatedItem.salesPriceInStock =
      //   searchResults[activeRow]?.sales_price || '';
      updatedItem.mrp = searchResults[activeRow]?.mrp || '';
      updatedItem.cost =
        searchResults[activeRow]?.sales_inclusive === 1
          ? (
              searchResults[activeRow]?.sales_price /
              (1 + searchResults[activeRow]?.igst / 100)
            ).toFixed(2)
          : searchResults[activeRow]?.sales_price;
      updatedItem.purchaseInclusive =
        searchResults[activeRow]?.purchase_inclusive || 0;
      updatedItem.salesInclusive =
        searchResults[activeRow]?.sales_inclusive || 0;
      updatedItem.grossAmt = '';
      updatedItem.taxable = '';
      updatedItem.cgstP = searchResults[activeRow]?.cgst || '';
      updatedItem.cgst = '';
      updatedItem.sgstP = searchResults[activeRow]?.sgst || '';
      updatedItem.sgst = '';
      updatedItem.igstP = searchResults[activeRow]?.igst || '';
      updatedItem.igst = '';
      updatedItem.discountP = searchResults[activeRow]?.discountP || 0;
      updatedItem.discount = 0;
      updatedItem.subTotal = '';
      updatedItems[rowNo] = updatedItem;
      // console.log("updatedItem after: " + JSON.stringify(updatedItem));
      return updatedItems;
    });
    handleClose();
  };

  useEffect(() => {
    setSearchResults([]); // Clear search results when modal opens or closes
    setActiveRow(0); // Reset the active row index when modal opens or closes
    setSearchInput(''); // Clear the search input when modal opens or closes
    if (showModal && inputRef.current && !showAddModal) {
      inputRef.current.focus(); // Focus the input field when the modal is opened
    }
  }, [showModal, showAddModal]);

  const handleCloseModal = useCallback(() => {
    setShowAddModal(false);
  }, []);

  const onClickAdd = () => {
    setShowAddModal(true);
  };

  const onSubmitProducts = useCallback(() => {
    setShowAddModal(false);
  }, []);

  const handleClickRow = index => {
    setActiveRow(index);
    inputRef.current.focus();
  };

  const tableHeaders =
    is_barcode_exist === 1
      ? ['Barcode', 'Product Code', 'Sales Price', 'MRP']
      : ['Product Code', 'Sales Price', 'MRP'];
  const tableData =
    is_barcode_exist === 1
      ? searchResults.map(result => [
          result.barcode,
          result.product_code,
          result.sales_price,
          result.mrp,
        ])
      : searchResults.map(result => [
          result.product_code,
          result.sales_price,
          result.mrp,
        ]);

  return (
    <View>
      <OuterBodyModal
        modalTitle={modalTitle}
        showModal={showModal}
        handleClose={handleClose}>
        <ScrollView>
          <View style={styles.container}>
            <View style={{flexDirection: 'row', marginTop: 20}}>
              <TextInput
                style={[styles.input, {flex: 9}]}
                placeholder="Search by Product Code"
                value={searchInput}
                onChangeText={text => {
                  setSearchInput(text);
                  onHandleSearchInput(text);
                }}
                ref={inputRef}
              />
              <TouchableOpacity
                style={[styles.submitButton, {flex: 1}]}
                onPress={onClickAdd}>
                <Text style={styles.submitButtonText}>+</Text>
              </TouchableOpacity>
            </View>
            <SearchResponsiveTable
              headers={tableHeaders}
              data={tableData}
              activeRowIndex={activeRow}
              handleRowClick={handleClickRow}
            />
            <View>
              <TouchableOpacity
                onPress={handleSubmit}
                style={styles.submitButton}>
                <Text style={styles.submitButtonText}>Submit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </OuterBodyModal>
      <OuterBodyModal
        modalTitle="Add Product Details"
        showModal={showAddModal}
        handleClose={handleCloseModal}>
        <AddEditProductDetails
          initialFormData={initialFormData}
          type="Add Product Details"
          onHandleSubmit={onSubmitProducts}></AddEditProductDetails>
      </OuterBodyModal>
    </View>
  );
};

export default SearchSalesProductModal;
