import {Text, View, TouchableOpacity,ActivityIndicator} from 'react-native';
import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {API_BASE_URL} from '../config';
import {useAuth} from './AuthContext';
import styles from './AddEditModalStyles';
import {TextInput} from 'react-native-paper';
import {COLORS} from '../constants';


const AddEditStore = props => {
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
      if (props.type === 'Add Store') {
        const res = await axios.post(`${API_BASE_URL}/api/addStore`, {
          store_data: formData,
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
      } else if (props.type === 'Edit Store') {
        const res = await axios.post(`${API_BASE_URL}/api/updateStore`, {
          id: formData.id,
          store_name: formData.store_name,
          email: formData.email,
          phone_no: formData.phone_no,
          country: formData.country,
          state: formData.state,
          city: formData.city,
          address: formData.address,
          pincode: formData.pincode,
          gstin: formData.gstin,
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
          placeholder="Enter Store Name"    
          value={formData.store_name}
          onChangeText={text =>
            setFormData({
              ...formData,
              store_name: text,
            })
          }
          
        />
      </View>
      <View style={styles.inputContainer}>
      <TextInput
          style={styles.inputbg}
          mode="flat"
          placeholderTextColor={COLORS.black}
          activeUnderlineColor={COLORS.primary}
          placeholder="Enter Email"
          value={formData.email}
          onChangeText={text =>
            setFormData({
              ...formData,
              email: text,
            })
          }
        
        />
      </View>
      <View style={styles.inputContainer}>
      <TextInput
          style={styles.inputbg}
          mode="flat"
          placeholderTextColor={COLORS.black}
          activeUnderlineColor={COLORS.primary}
          placeholder="Enter Phone No"
          value={formData.phone_no.toString()}
          onChangeText={text =>
            setFormData({
              ...formData,
              phone_no: text,
            })
          }
          keyboardType="numeric"
         maxLength={10}
        />
      </View>
      <View style={styles.inputContainer}>
      <TextInput
          style={styles.inputbg}
          mode="flat"
          placeholderTextColor={COLORS.black}
          activeUnderlineColor={COLORS.primary}
          placeholder="Enter Country"
          value={formData.country}
          onChangeText={text =>
            setFormData({
              ...formData,
              country: text,
            })
          }
        />
      </View>
      <View style={styles.inputContainer}>
      <TextInput
          style={styles.inputbg}
          mode="flat"
          placeholderTextColor={COLORS.black}
          activeUnderlineColor={COLORS.primary}
          placeholder="Enter State"
          value={formData.state}
          onChangeText={text =>
            setFormData({
              ...formData,
              state: text,
            })
          }
        />
      </View>
      <View style={styles.inputContainer}>
      <TextInput
          style={styles.inputbg}
          mode="flat"
          placeholderTextColor={COLORS.black}
          activeUnderlineColor={COLORS.primary}
          placeholder="Enter City"
          value={formData.city}
          onChangeText={text =>
            setFormData({
              ...formData,
              city: text,
            })
          }
         
        />
      </View>
      <View style={styles.inputContainer}>
      <TextInput
          style={styles.inputbg}
          mode="flat"
          placeholderTextColor={COLORS.black}
          activeUnderlineColor={COLORS.primary}
          placeholder="Enter Address"
          value={formData.address}
          onChangeText={text =>
            setFormData({
              ...formData,
              address: text,
            })
          }
       
        />
      </View>
      <View style={styles.inputContainer}>
      <TextInput
          style={styles.inputbg}
          mode="flat"
          placeholderTextColor={COLORS.black}
          activeUnderlineColor={COLORS.primary}
          placeholder="Enter Pincode"
          value={formData.pincode.toString()}
          onChangeText={text =>
            setFormData({
              ...formData,
              pincode: text,
            })
          }
          keyboardType="numeric"
        
        />
      </View>
      <TextInput
          style={styles.inputbg}
          mode="flat"
          placeholderTextColor={COLORS.black}
          activeUnderlineColor={COLORS.primary}
          placeholder="Enter GSTIN"
        value={formData.gstin}
        onChangeText={text =>
          setFormData({
            ...formData,
            gstin: text,
          })
        }
      
      />
      <View style={styles.floatRight}>
        <TouchableOpacity onPress={onClickClear}>
          <Text style={styles.clearText}>Clear</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}  disabled={isLoading}>
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

export default AddEditStore;
