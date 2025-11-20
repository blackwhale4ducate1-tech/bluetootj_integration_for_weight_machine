import {Text, View, TouchableOpacity,ActivityIndicator} from 'react-native';
import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {API_BASE_URL} from '../config';
import {useAuth} from './AuthContext';
import styles from './AddEditModalStyles';
import {COLORS} from '../constants';
import {TextInput} from 'react-native-paper';


const AddEditRole = props => {
  const {data} = useAuth();

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
      if (props.type === 'Add Role') {
        const res = await axios.post(`${API_BASE_URL}/api/addRole`, {
          formData: formData,
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
      } else if (props.type === 'Edit Role') {
        const res = await axios.post(`${API_BASE_URL}/api/updateRole`, {
          id: formData.id,
          role: formData.role,
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
    }finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
      <TextInput
          style={styles.inputbg}
          mode="flat"
          placeholderTextColor={COLORS.black}
          activeUnderlineColor={COLORS.primary}
          placeholder="Enter Role"
       
          value={formData.role}
          onChangeText={text =>
            setFormData({
              ...formData,
              role: text,
            })
          }
       
        />
      </View>
      <View style={styles.floatRight}>
        <TouchableOpacity onPress={onClickClear}>
          <Text style={styles.clearText}>Clear</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} disabled={isLoading}b>
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

export default AddEditRole;
