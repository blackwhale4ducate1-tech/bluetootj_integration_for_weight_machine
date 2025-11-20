import {Text, View, TouchableOpacity, ActivityIndicator} from 'react-native';
import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {API_BASE_URL} from '../config';
import {useAuth} from './AuthContext';
import styles from './AddEditModalStyles';
import {Picker} from '@react-native-picker/picker';
import SearchLedgerInAccountGroupModal from './SearchLedgerInAccountGroupModal';
import {FontAwesomeIcon} from '../constants';
import {COLORS} from '../constants';
import {TextInput} from 'react-native-paper';

const AddEditLedgerGroup = props => {
  const {data} = useAuth();

  const [formData, setFormData] = useState(props.initialFormData);
  const [accountGroupOptions, setAccountGroupOptions] = useState([]);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const getAccountGroupOptions = async company_name => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/getAccountGroupData?company_name=${company_name}`,
        {
          params: {
            include: 'id,account_group',
          },
        },
      );
      const options = response.data.map(accountGroup => ({
        value: accountGroup.id,
        label: accountGroup.account_group,
      }));
      setAccountGroupOptions(options);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAccountGroupOptions(data.company_name);
  }, [data.company_name]);

  useEffect(() => {
    setFormData(props.initialFormData);
  }, [props.initialFormData]);

  const onClickClear = () => {
    setFormData(props.initialFormData);
  };

  const handleSubmit = async event => {
    event.preventDefault();
    if (!formData.accountGroup) {
      return setFormData({
        ...formData,
        validationError: 'Please fill all details',
      });
    }
    setIsLoading(true);
    try {
      if (props.type === 'Add Ledger Group') {
        const res = await axios.post(`${API_BASE_URL}/api/addLedgerGroup`, {
          ledger_group_data: formData,
          company_name: data.company_name,
        });
        if (res.data.message) {
          console.log('message:' + res.data.message);
          setFormData(props.initialFormData);
          props.onHandleSubmit();
        } else if (res.data.error) {
          console.log('error:' + res.data.error);
          setFormData({...formData, validationError: res.data.error});
        } else {
          setFormData({...formData, validationError: 'Please Try again'});
        }
      } else if (props.type === 'Edit Ledger Group') {
        const res = await axios.post(`${API_BASE_URL}/api/updateLedgerGroup`, {
          id: formData.id,
          ledger_group: formData.ledgerGroup,
          account_group_id: formData.accountGroup.value,
          company_name: data.company_name,
        });
        if (res.data.message) {
          console.log('message:' + res.data.message);
          props.onHandleSubmit();
        } else if (res.data.error) {
          console.log('error:' + res.data.error);
          setFormData({...formData, validationError: res.data.error});
        } else {
          setFormData({...formData, validationError: 'Please Try again'});
        }
      }
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };
  const onClickSearch = () => {
    setShowSearchModal(true);
  };

  const handleCloseModal = () => {
    setShowSearchModal(false);
  };

  const handleUpdateName = async name => {
    setFormData({
      ...formData,
      ledgerGroup: name,
    });
    handleCloseModal();
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <Text style={styles.labelInput}>Account Group :</Text>
        <View style={[styles.pickercontain, {flex: 1}]}>
          <Picker
            selectedValue={
              formData.accountGroup ? formData.accountGroup.value : null
            }
            onValueChange={(itemValue, itemIndex) => {
              const selectedOption = accountGroupOptions.find(
                option => option.value === itemValue,
              );
              setFormData(prevFormData => ({
                ...prevFormData,
                accountGroup: {
                  value: selectedOption.value,
                  label: selectedOption.label,
                },
                ledgerGroup: '',
              }));
            }}
            style={{color: COLORS.black}}>
            <Picker.Item label="-- Select Account Group --" value={null} />
            {accountGroupOptions.map(options => (
              <Picker.Item
                key={options.value}
                label={options.label}
                value={options.value}
              />
            ))}
          </Picker>
        </View>
      </View>
      <View style={styles.inputContainer}>
        <View>
          <TextInput
            style={styles.inputbg}
            mode="flat"
            placeholderTextColor={COLORS.black}
            activeUnderlineColor={COLORS.primary}
            label="Enter Ledger Group"
            value={formData.ledgerGroup}
            onChangeText={text =>
              setFormData({
                ...formData,
                ledgerGroup: text,
              })
            }
            editable={
              !(
                formData.accountGroup &&
                (formData.accountGroup.value === 9 ||
                  formData.accountGroup.value === 10)
              )
            }
          />
          {formData.accountGroup &&
            (formData.accountGroup.value === 9 ||
              formData.accountGroup.value === 10) && (
              <TouchableOpacity
                style={styles.addButton}
                onPress={onClickSearch}>
                <Text style={styles.addButtonText}>
                  <FontAwesomeIcon name="search" size={24} />
                </Text>
              </TouchableOpacity>
            )}
        </View>
      </View>
      <View style={styles.floatRight}>
        <TouchableOpacity onPress={onClickClear}>
          <Text style={styles.clearText}>Clear</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        style={styles.submitButton}
        onPress={handleSubmit}
        disabled={isLoading}>
        {isLoading ? (
          <ActivityIndicator size="large" color={COLORS.white} />
        ) : (
          <Text style={styles.submitButtonText}>Submit</Text>
        )}
      </TouchableOpacity>
      <Text style={styles.errorText}>{formData.validationError}</Text>

      <SearchLedgerInAccountGroupModal
        modalTitle="Search"
        type="sales"
        showModal={showSearchModal}
        handleClose={handleCloseModal}
        handleUpdateName={handleUpdateName}
      />
    </View>
  );
};

export default AddEditLedgerGroup;
