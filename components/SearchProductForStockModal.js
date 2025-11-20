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
import {COLORS} from '../constants';

export default function SearchProductForStockModal({
  modalTitle,
  showModal,
  handleClose,
  updateFormData,
  productInput,
}) {
  const {data} = useAuth();
  const [searchInput, setSearchInput] = useState(productInput);
  const [searchResults, setSearchResults] = useState([]);
  const [activeRow, setActiveRow] = useState(0);
  const tableRef = useRef(null);
  const inputRef = useRef(null);

  const onHandleSearchInput = useCallback(
    async inputValue => {
      try {
        const res = await axios.post(
          `${API_BASE_URL}/api/searchProductByInput`,
          {
            searchInput: inputValue,
            company_name: data.company_name,
          },
        );
        if (res.data.message) {
          // console.log("result:" + JSON.stringify(res.data.message));
          setSearchResults(res.data.message);
          setActiveRow(0); // Reset the active row index when search results change
        } else {
          setSearchResults([]);
        }
      } catch (err) {
        console.log(err);
      }
    },
    [data.company_name],
  );

  useEffect(() => {
    setSearchResults([]); // Clear search results when modal opens or closes
    setActiveRow(0); // Reset the active row index when modal opens or closes
    setSearchInput(productInput); // Clear the search input when modal opens or closes
    if (showModal && inputRef.current) {
      inputRef.current.focus(); // Focus the input field when the modal is opened
      onHandleSearchInput(productInput);
    }
  }, [showModal, productInput, onHandleSearchInput]);

  useEffect(() => {
    if (tableRef.current) {
      // Scroll to the active row in the table
      const rowElement = tableRef.current.querySelector(
        `tr[data-index="${activeRow}"]`,
      );
      if (rowElement) {
        rowElement.scrollIntoView({behavior: 'smooth', block: 'nearest'});
      }
    }
  }, [activeRow]);

  const handleClickRow = index => {
    setActiveRow(index);
    inputRef.current.focus();
  };

  const handleSubmit = () => {
    updateFormData(prevFormData => ({
      ...prevFormData,
      product_code: searchResults[activeRow]?.product_code || '',
    }));
    handleClose();
  };

  const handleCloseProductModal = () => {
    updateFormData(prevFormData => ({
      ...prevFormData,
      product_code: '',
    }));
    handleClose();
  };

  const tableHeaders = ['Product Name'];
  const tableData = searchResults.map(result => [result.product_code]);

  return (
    <View>
      <OuterBodyModal
        modalTitle={modalTitle}
        showModal={showModal}
        handleClose={handleCloseProductModal}>
        <ScrollView keyboardShouldPersistTaps="handled">
          <View style={{flexDirection: 'row', marginTop: 20}}>
            <TextInput
              style={[styles.input, {flex: 9}]}
              placeholder="Search by Product Name"
              placeholderTextColor={COLORS.black}
              value={searchInput}
              onChangeText={text => {
                setSearchInput(text);
                onHandleSearchInput(text);
              }}
              ref={inputRef}
            />
          </View>
          <View
            style={{
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <SearchResponsiveTable
              headers={tableHeaders}
              data={tableData}
              activeRowIndex={activeRow}
              handleRowClick={handleClickRow}
            />
          </View>

          <View>
            <TouchableOpacity
              onPress={handleSubmit}
              style={styles.submitButton}>
              <Text style={styles.submitButtonText}>Submit</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </OuterBodyModal>
    </View>
  );
}
