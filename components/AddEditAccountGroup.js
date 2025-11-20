import {Text, View, TouchableOpacity, ActivityIndicator} from 'react-native';
import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {API_BASE_URL} from '../config';
import {useAuth} from './AuthContext';
import styles from './AddEditModalStyles';
import {Picker} from '@react-native-picker/picker';
import {TextInput} from 'react-native-paper';
import {COLORS} from '../constants';

const AddEditAccountGroup = props => {
  const {data} = useAuth();

  const baseGroupOptions = [
    {value: 'Capital Account', label: 'Capital Account'},
    {value: 'Current Asset', label: 'Current Asset'},
    {value: 'Current Liability', label: 'Current Liability'},
    {value: 'Direct Expense', label: 'Direct Expense'},
    {value: 'Direct Income', label: 'Direct Income'},
    {value: 'Fixed Asset', label: 'Fixed Asset'},
    {value: 'InDirect Expense', label: 'InDirect Expense'},
    {value: 'InDirect Income', label: 'InDirect Income'},
    {value: 'LongTerm Liability', label: 'LongTerm Liability'},
  ];

  const [formData, setFormData] = useState(props.initialFormData);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setFormData(props.initialFormData);
  }, [props.initialFormData]);

  const onClickClear = () => {
    setFormData(props.initialFormData);
  };

  const handleSubmit = async event => {
    event.preventDefault();
    setIsLoading(true);
    try {
      if (props.type === 'Add Account Group') {
        const res = await axios.post(`${API_BASE_URL}/api/addAccountGroup`, {
          account_group_data: formData,
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
      } else if (props.type === 'Edit Account Group') {
        const res = await axios.post(`${API_BASE_URL}/api/updateAccountGroup`, {
          id: formData.id,
          base_group: formData.baseGroup,
          account_group: formData.accountGroup,
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

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <Text style={styles.labelInput}>Base Group</Text>
        <View style={styles.inputPicker}>
          <Picker
            selectedValue={formData.baseGroup}
            onValueChange={itemValue => {
              setFormData(prevFormData => ({
                ...prevFormData,
                baseGroup: itemValue,
              }));
            }}
            style={{color: COLORS.black}}>
            <Picker.Item label="-- Select Base Group --" value={null} />
            {baseGroupOptions.map(option => (
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
        <TextInput
          style={styles.inputbg}
          mode="flat"
          placeholderTextColor={COLORS.black}
          activeUnderlineColor={COLORS.primary}
          placeholder="Enter Account Group"
          value={formData.accountGroup}
          onChangeText={text =>
            setFormData({
              ...formData,
              accountGroup: text,
            })
          }
        />
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
          <ActivityIndicator size="small" color={COLORS.white} />
        ) : (
          <Text style={styles.submitButtonText}>Submit</Text>
        )}
      </TouchableOpacity>
      <Text style={styles.errorText}>{formData.validationError}</Text>
    </View>
  );
};

export default AddEditAccountGroup;
