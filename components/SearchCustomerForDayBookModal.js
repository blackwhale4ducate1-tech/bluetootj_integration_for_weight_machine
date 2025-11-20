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
import AddEditCustomer from './AddEditCustomer';
import AddEditVendor from './AddEditVendor';

export default function SearchCustomerForDayBookModal({
  modalTitle,
  type,
  showModal,
  handleClose,
  updateFormData,
  customerInput,
}) {
  const {data} = useAuth();
  const initialFormData = {
    id: '',
    type: type === 'purchase' ? 'vendor' : 'client',
    name: '',
    account_code: '',
    regional_name: '',
    phone_no: '',
    alt_phone_no: '',
    email: '',
    address: '',
    gstin: '',
    state: '',
    city: '',
    opening_balance: '',
    invoiceDate: new Date().toISOString().split('T')[0],
    debit_credit: {
      value: type === 'purchase' ? 'CREDIT' : 'DEBIT',
      label: 'purchase' ? 'CREDIT' : 'DEBIT',
    },
    credit_limit: '',
    credit_days: '',
    validationError: '',
  };

  const [searchInput, setSearchInput] = useState(customerInput);
  const [searchType, setSearchType] = useState(type);
  const [searchResults, setSearchResults] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [activeRow, setActiveRow] = useState(0);
  const inputRef = useRef(null);

  const onHandleSearchInput = useCallback(
    async inputValue => {
      try {
        const res = await axios.post(
          `${API_BASE_URL}/api/searchCustomersByInput`,
          {
            searchInput: inputValue,
            type: searchType,
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
    [data.company_name, searchType],
  );

  const handleSubmit = () => {
    updateFormData(prevFormData => ({
      ...prevFormData,
      name: searchResults[activeRow]?.account_code || '',
    }));
    handleClose();
  };

  useEffect(() => {
    setSearchResults([]); // Clear search results when modal opens or closes
    setActiveRow(0); // Reset the active row index when modal opens or closes
    setSearchInput(customerInput); // Clear the search input when modal opens or closes
    setSearchType(type);
    if (showModal && inputRef.current) {
      inputRef.current.focus(); // Focus the input field when the modal is opened
      onHandleSearchInput(customerInput);
    }
  }, [showModal, type, customerInput, onHandleSearchInput]);

  const handleCloseModal = useCallback(() => {
    setShowAddModal(false);
  }, []);

  const onClickAdd = () => {
    setShowAddModal(true);
  };

  const handleClickRow = index => {
    setActiveRow(index);
    inputRef.current.focus();
  };
  const onClickSwith = useCallback(() => {
    console.log('searchType: ' + searchType);
    if (searchType === 'purchase') {
      setSearchType('sales');
    } else {
      setSearchType('purchase');
    }
    setSearchInput('');
    setSearchResults([]);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [searchType]);

  const handleCloseCustomerModal = () => {
    updateFormData(prevFormData => ({
      ...prevFormData,
      name: '',
    }));
    handleClose();
  };

  const tableHeaders = ['Account Code', 'Phone No'];
  const tableData = searchResults.map(result => [
    result.account_code,
    result.phone_no,
  ]);
  return (
    <View>
      <OuterBodyModal
        modalTitle={modalTitle}
        showModal={showModal}
        handleClose={handleCloseCustomerModal}>
        <ScrollView keyboardShouldPersistTaps="handled">
          <View style={styles.container}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',

                marginTop: 10,
              }}>
              <TouchableOpacity
                style={[styles.submitButton, {backgroundColor: COLORS.blue}]}
                onPress={onClickSwith}>
                <Text style={styles.switchbtnText}>
                  {searchType === 'purchase'
                    ? 'Switch to Customer'
                    : 'Switch to Vendor'}
                </Text>
              </TouchableOpacity>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: 10,
              }}>
              <TextInput
                style={[styles.input, {flex: 9}]}
                placeholderTextColor={COLORS.black}
                placeholder="Search by Username"
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
            <TouchableOpacity
              onPress={handleSubmit}
              style={styles.submitButton}>
              <Text style={styles.submitButtonText}>Submit</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </OuterBodyModal>
      <OuterBodyModal
        modalTitle={searchType === 'purchase' ? 'Add Vendor' : 'Add Customer'}
        showModal={showAddModal}
        handleClose={handleCloseModal}>
        {searchType === 'purchase' ? (
          <AddEditVendor
            initialFormData={initialFormData}
            type="Add Vendor"
            onHandleSubmit={handleCloseModal}></AddEditVendor>
        ) : (
          <AddEditCustomer
            initialFormData={initialFormData}
            type="Add Customer"
            onHandleSubmit={handleCloseModal}></AddEditCustomer>
        )}
      </OuterBodyModal>
    </View>
  );
}
