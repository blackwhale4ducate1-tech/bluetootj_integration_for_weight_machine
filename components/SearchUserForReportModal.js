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
import AddEditLedgerGroup from './AddEditLedgerGroup';
import {COLORS} from '../constants';

export default function SearchUserForReportModal({
  modalTitle,
  showModal,
  handleClose,
  updateFormData,
  usernameInput,
}) {
  const {data} = useAuth();
  const [searchInput, setSearchInput] = useState(usernameInput);
  const [searchResults, setSearchResults] = useState([]);
  const [activeRow, setActiveRow] = useState(0);
  const tableRef = useRef(null);
  const inputRef = useRef(null);

  const onHandleSearchInput = useCallback(
    async inputValue => {
      try {
        const res = await axios.post(`${API_BASE_URL}/api/searchUserByInput`, {
          searchInput: inputValue,
          company_name: data.company_name,
        });
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
    setSearchInput(usernameInput); // Clear the search input when modal opens or closes
    if (showModal && inputRef.current) {
      inputRef.current.focus(); // Focus the input field when the modal is opened
      onHandleSearchInput(usernameInput);
    }
  }, [showModal, usernameInput, onHandleSearchInput]);

  const handleClickRow = index => {
    setActiveRow(index);
    inputRef.current.focus();
  };
  const handleSubmit = () => {
    updateFormData(prevFormData => ({
      ...prevFormData,
      username: searchResults[activeRow]?.username || '',
    }));
    handleClose();
  };

  const handleCloseUserModal = () => {
    updateFormData(prevFormData => ({
      ...prevFormData,
      username: '',
    }));
    handleClose();
  };

  const tableHeaders = ['User Name'];
  const tableData = searchResults.map(result => [result.username]);

  return (
    <View>
      <OuterBodyModal
        modalTitle={modalTitle}
        showModal={showModal}
        handleClose={handleCloseUserModal}>
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
                placeholder="Search by Username"
                value={searchInput}
                onChangeText={text => {
                  setSearchInput(text);
                  onHandleSearchInput(text);
                }}
                ref={inputRef}
              />
            </View>
            <SearchResponsiveTable
              headers={tableHeaders}
              data={tableData}
              activeRowIndex={activeRow}
              handleRowClick={handleClickRow}
            />
          </View>
        </ScrollView>
        <View>
          <TouchableOpacity onPress={handleSubmit} style={styles.submitButton}>
            <Text style={styles.submitButtonText}>Submit</Text>
          </TouchableOpacity>
        </View>
      </OuterBodyModal>
    </View>
  );
}
