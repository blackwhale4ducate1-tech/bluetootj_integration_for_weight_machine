import {
  View,
  Text,
  TextInput,
  SafeAreaView,
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
import AddEditLedgerGroup from './AddEditLedgerGroup';
import {COLORS} from '../constants';

export default function SearchCustomerLedgerModal({
  modalTitle,
  showModal,
  handleClose,
  handleUpdateNameBalance,
  ledgerInput,
}) {
  const {data} = useAuth();
  const initialFormData = {
    id: '',
    ledgerGroup: '',
    accountGroup: null,
    validationError: '',
  };

  const [searchInput, setSearchInput] = useState(ledgerInput);
  const [searchResults, setSearchResults] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [activeRow, setActiveRow] = useState(0);
  const tableRef = useRef(null);
  const inputRef = useRef(null);

  const onHandleSearchInput = useCallback(
    async inputValue => {
      try {
        const res = await axios.post(
          `${API_BASE_URL}/api/searchCustomerLedgersByInput`,
          {
            searchInput: inputValue,
            company_name: data.company_name,
          },
        );
        if (res.data.message) {
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

  const handleSubmit = async () => {
    const selectedName = searchResults[activeRow]?.ledger_group || '';
    const selectedBalance = searchResults[activeRow]?.balance || '';
    handleUpdateNameBalance(selectedName, selectedBalance);
  };

  useEffect(() => {
    setSearchResults([]); // Clear search results when modal opens or closes
    setActiveRow(0); // Reset the active row index when modal opens or closes
    setSearchInput(ledgerInput); // Clear the search input when modal opens or closes
    if (showModal && inputRef.current) {
      inputRef.current.focus(); // Focus the input field when the modal is opened
      onHandleSearchInput(ledgerInput);
    }
  }, [showModal, ledgerInput, onHandleSearchInput]);

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

  const handleCloseLedgerModal = () => {
    handleUpdateNameBalance('', 0);
  };

  const tableHeaders = ['Ledger', 'Balance'];
  const tableData = searchResults.map(result => [
    result.ledger_group,
    result.balance,
  ]);

  return (
    <SafeAreaView style={styles.safeContainer}>
      <OuterBodyModal
        modalTitle={modalTitle}
        showModal={showModal}
        handleClose={handleCloseLedgerModal}>
        <ScrollView keyboardShouldPersistTaps="handled">
          <View style={styles.container}>
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
                placeholder="Search by Name"
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
        modalTitle="Add Ledger Group"
        showModal={showAddModal}
        handleClose={handleCloseModal}>
        <AddEditLedgerGroup
          initialFormData={initialFormData}
          type="Add Ledger Group"
          onHandleSubmit={handleCloseModal}></AddEditLedgerGroup>
      </OuterBodyModal>
    </SafeAreaView>
  );
}
