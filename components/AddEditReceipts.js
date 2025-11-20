import {Text, View, TouchableOpacity, ActivityIndicator} from 'react-native';
import React, {useState, useEffect} from 'react';
import axios from 'axios';
import SearchLedgerModal from './SearchLedgerModal';
import {API_BASE_URL} from '../config';
import {useAuth} from './AuthContext';
import DateTimePicker from '@react-native-community/datetimepicker';
import {Picker} from '@react-native-picker/picker';
import {COLORS, FontAwesomeIcon} from '../constants';
import styles from './AddEditModalStyles';
import {TextInput} from 'react-native-paper';

const AddEditReceipts = props => {
  const {data} = useAuth();

  const [formData, setFormData] = useState(props.initialFormData);
  const [morOptions, setMorOptions] = useState([]);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [userOptions, setUserOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const getMorOptions = async company_name => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/getMopOptions?company_name=${company_name}`,
      );
      const options = response.data.map(mor => ({
        value: mor.ledger_group,
        label: mor.ledger_group,
      }));
      setMorOptions(options);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getMorOptions(data.company_name);
  }, [data.company_name]);

  // Fetch user data and populate userOptions
  useEffect(() => {
    const fetchUsers = async company_name => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/api/getUsers?company_name=${company_name}`,
        );
        // console.log('response: ' + JSON.stringify(response.data));
        const users = response.data.map(user => ({
          value: user.id,
          label: user.username,
        }));
        // console.log('users: ' + JSON.stringify(users));
        setUserOptions(users);
      } catch (error) {
        console.log(error);
      }
    };
    fetchUsers(data.company_name);
  }, [data.company_name]);

  useEffect(() => {
    setFormData(props.initialFormData);
  }, [props.initialFormData]);

  const getInvoiceNo = async company_name => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/getInvoiceSeriesByType?series_name=receipt&company_name=${company_name}`,
      );
      setFormData(prevFormData => ({
        ...prevFormData,
        invoiceNo: response.data.next_number,
      }));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getInvoiceNo(data.company_name);
  }, [data.company_name]);

  const onClickClear = () => {
    setFormData(props.initialFormData);
    getInvoiceNo();
  };

  const handleSubmit = async event => {
    event.preventDefault();
    if (
      !formData.invoiceDate ||
      !formData.mor ||
      !formData.ledger ||
      formData.outstandingBalance === '' ||
      !formData.amount ||
      !formData.user
    ) {
      return setFormData({
        ...formData,
        validationError: 'Please fill all details',
      });
    }
    setIsLoading(true);
    try {
      if (props.type === 'Add Receipt') {
        const res = await axios.post(`${API_BASE_URL}/api/addReceipt`, {
          receipt_data: formData,
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
      } else if (props.type === 'Edit Receipt') {
        const res = await axios.post(`${API_BASE_URL}/api/updateReceipt`, {
          id: formData.id,
          invoiceNo: formData.invoiceNo,
          invoiceDate: formData.invoiceDate,
          mor: formData.mor,
          ledger: formData.ledger,
          outstandingBalance: formData.outstandingBalance,
          narration: formData.narration,
          amount: formData.amount,
          user_id: formData.user.id,
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

  const handleUpdateNameBalance = async (name, balance) => {
    setFormData({
      ...formData,
      ledger: name,
      outstandingBalance: Number(balance),
    });
    handleCloseModal();
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <Text style={styles.labelInput}>Invoice No :</Text>
        <TextInput
          style={styles.inputbg}
          mode="flat"
          placeholderTextColor={COLORS.black}
          activeUnderlineColor={COLORS.primary}
          placeholder="Enter Invoice No"
          value={formData.invoiceNo.toString()}
          onChangeText={text =>
            setFormData({
              ...formData,
              invoiceNo: text,
            })
          }
          editable={false}
        />
      </View>
      <View style={styles.inputContainer}>
        <View>
          <TouchableOpacity
            style={styles.dateButton}
            onPress={() => setShowDatePicker(true)}>
            <Text style={styles.dateButtonText}>Select Date</Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={new Date(formData.invoiceDate)}
              mode="date"
              display="default"
              onChange={(event, selectedDate) => {
                setShowDatePicker(false);
                if (selectedDate) {
                  setFormData({
                    ...formData,
                    invoiceDate: selectedDate,
                  });
                }
              }}
            />
          )}
        </View>
      </View>
      <View>
        <Text style={styles.labelInput}>Date :</Text>
        <TextInput
          style={styles.inputbg}
          mode="flat"
          placeholderTextColor={COLORS.black}
          activeUnderlineColor={COLORS.primary}
          value={
            formData.invoiceDate !== ''
              ? new Date(formData.invoiceDate)
                  .toLocaleDateString('ta-IN')
                  .toString()
              : ''
          }
          placeholder="Date"
          editable={false}
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.labelInput}>Mode of Receiving :</Text>
        <View style={[styles.pickercontain, {flex: 1}]}>
          <Picker
            selectedValue={formData.mor ? formData.mor.value : null}
            onValueChange={(itemValue, itemIndex) => {
              const selectedOption = morOptions.find(
                option => option.value === itemValue,
              );
              setFormData(prevFormData => ({
                ...prevFormData,
                mor: selectedOption,
              }));
            }}
            style={{color: COLORS.black}}>
            <Picker.Item label="-- Select MOR --" value={null} />
            {morOptions.map(option => (
              <Picker.Item
                key={option.value}
                label={option.label}
                value={option.value}
              />
            ))}
          </Picker>
        </View>
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.labelInput}>Ledger :</Text>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <View style={{flex: 9}}>
            <TextInput
              style={styles.inputbg}
              mode="flat"
              placeholderTextColor={COLORS.black}
              activeUnderlineColor={COLORS.primary}
              placeholder="Enter Ledger"
              value={formData.ledger}
              onChangeText={text =>
                setFormData({
                  ...formData,
                  ledger: text,
                })
              }
              editable={false}
            />
          </View>
          <View style={{flex: 3}}>
            <TouchableOpacity style={styles.addButton} onPress={onClickSearch}>
              <Text style={styles.addButtonText}>
                <FontAwesomeIcon name="search" size={22} />
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.labelInput}>Outstanding Balance :</Text>
        <TextInput
          style={styles.inputbg}
          mode="flat"
          placeholderTextColor={COLORS.black}
          activeUnderlineColor={COLORS.primary}
          placeholder="Enter Outstanding Balance"
          value={formData.outstandingBalance.toString()}
          onChangeText={text =>
            setFormData({
              ...formData,
              outstandingBalance: text,
            })
          }
          editable={false}
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.labelInput}>Amount :</Text>
        <TextInput
          style={styles.inputbg}
          mode="flat"
          placeholderTextColor={COLORS.black}
          activeUnderlineColor={COLORS.primary}
          placeholder="Enter Amount"
          value={formData.amount.toString()}
          onChangeText={text =>
            setFormData({
              ...formData,
              amount: text,
            })
          }
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.labelInput}>Narration :</Text>
        <TextInput
          style={styles.inputbg}
          mode="flat"
          placeholderTextColor={COLORS.black}
          activeUnderlineColor={COLORS.primary}
          placeholder="Enter Narration"
          value={formData.narration}
          onChangeText={text =>
            setFormData({
              ...formData,
              narration: text,
            })
          }
          multiline
          numberOfLines={4}
        />
      </View>
      {data.role === 'admin' && (
        <View style={styles.inputContainer}>
          <Text style={styles.labelInput}>Created By User</Text>
          <View style={[styles.inputPicker, {flex: 1}]}>
            <Picker
              selectedValue={formData.user ? formData.user.id : null}
              onValueChange={(itemValue, itemIndex) => {
                const selectedOption = userOptions.find(
                  option => option.value === itemValue,
                );
                setFormData(prevFormData => ({
                  ...prevFormData,
                  user: {
                    id: selectedOption.value,
                    username: selectedOption.label,
                  },
                }));
              }}
              style={{color: COLORS.black}}>
              <Picker.Item label="-- Select Created By User --" value={null} />
              {userOptions.map(option => (
                <Picker.Item
                  key={option.value}
                  label={option.label}
                  value={option.value}
                />
              ))}
            </Picker>
          </View>
        </View>
      )}
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

      <SearchLedgerModal
        modalTitle="Search"
        showModal={showSearchModal}
        handleClose={handleCloseModal}
        handleUpdateNameBalance={handleUpdateNameBalance}
      />
    </View>
  );
};

export default AddEditReceipts;
