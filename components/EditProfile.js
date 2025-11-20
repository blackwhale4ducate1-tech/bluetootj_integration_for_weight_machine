import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useState} from 'react';
import axios from 'axios';
import {API_BASE_URL} from '../config';
import {useAuth} from './AuthContext';
import ModalStyles from './AddEditModalStyles';
import {TextInput} from 'react-native-paper';
import {COLORS} from '../constants';

const EditProfile = props => {
  const {data} = useAuth();
  const [formData, setFormData] = useState(props.formData);
  const [validationError, setValidationrror] = useState('');

  const handleSubmit = async () => {
    if (!formData.phone_no || formData.phone_no.toString().length !== 10) {
      setValidationrror('Phone no should be 10 digits');
      return;
    }
    try {
      const res = await axios.post(`${API_BASE_URL}/api/updateProfile`, {
        username: props.username,
        email: formData.email,
        phone_no: formData.phone_no,
        country: formData.country,
        state: formData.state,
        city: formData.city,
        address: formData.address,
        pincode: formData.pincode,
        gstin: formData.gstin,
        company_full_name: formData.company_full_name,
        bank_name: formData.bank_name,
        account_no: formData.account_no,
        ifsc_code: formData.ifsc_code,
        branch: formData.branch,
        declaration: formData.declaration,
        accountName: formData.accountName,
        panNo: formData.panNo,
        fssi: formData.fssi,
        company_name: data.company_name,
      });
      if (res.data.message) {
        console.log('message:' + res.data.message);
        props.onHandleSubmit();
      } else if (res.data.error) {
        setValidationrror(res.data.error);
      } else {
        setValidationrror('Please try again');
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <View style={ModalStyles.container}>
      {props.role === 'admin' && (
        <View style={ModalStyles.inputContainer}>
          <TextInput
            style={ModalStyles.inputbg}
            label="Company Full Name"
            mode="outlined"
            placeholderTextColor={COLORS.black}
            activeUnderlineColor={COLORS.primary}
            placeholder="Enter Company Full Name"
            value={formData.company_full_name}
            onChangeText={text =>
              setFormData({
                ...formData,
                company_full_name: text,
              })
            }
          />
        </View>
      )}
      <View style={ModalStyles.inputContainer}>
        <TextInput
          style={ModalStyles.inputbg}
          label="Email"
          mode="outlined"
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
      <View style={ModalStyles.inputContainer}>
        <TextInput
          style={ModalStyles.inputbg}
          label="Phone No"
          mode="outlined"
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
        />
      </View>
      <View style={ModalStyles.inputContainer}>
        <TextInput
          style={ModalStyles.inputbg}
          label="Address"
          mode="outlined"
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
      <View style={ModalStyles.inputContainer}>
        <TextInput
          style={ModalStyles.inputbg}
          label="City"
          mode="outlined"
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
      <View style={ModalStyles.inputContainer}>
        <TextInput
          style={ModalStyles.inputbg}
          label="State"
          mode="outlined"
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
      {props.role === 'admin' && (
        <View style={ModalStyles.inputContainer}>
          <TextInput
            style={ModalStyles.inputbg}
            label="GSTIN"
            mode="outlined"
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
        </View>
      )}
      <View style={ModalStyles.inputContainer}>
        <TextInput
          style={ModalStyles.inputbg}
          label="Country"
          mode="outlined"
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
      <View style={ModalStyles.inputContainer}>
        <TextInput
          style={ModalStyles.inputbg}
          label="Pincode"
          mode="outlined"
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
        />
      </View>
      <View style={ModalStyles.inputContainer}>
        <TextInput
          style={ModalStyles.inputbg}
          label="Bank Name"
          mode="outlined"
          placeholderTextColor={COLORS.black}
          activeUnderlineColor={COLORS.primary}
          placeholder="Enter Bank Name"
          value={formData.bank_name}
          onChangeText={text =>
            setFormData({
              ...formData,
              bank_name: text,
            })
          }
        />
      </View>
      <View style={ModalStyles.inputContainer}>
        <TextInput
          style={ModalStyles.inputbg}
          label="Account No"
          mode="outlined"
          placeholderTextColor={COLORS.black}
          activeUnderlineColor={COLORS.primary}
          placeholder="Enter Account No"
          value={formData.account_no}
          onChangeText={text =>
            setFormData({
              ...formData,
              account_no: text,
            })
          }
        />
      </View>
      <View style={ModalStyles.inputContainer}>
        <TextInput
          style={ModalStyles.inputbg}
          label="IFSC Code"
          mode="outlined"
          placeholderTextColor={COLORS.black}
          activeUnderlineColor={COLORS.primary}
          placeholder="Enter IFSC Code"
          value={formData.ifsc_code}
          onChangeText={text =>
            setFormData({
              ...formData,
              ifsc_code: text,
            })
          }
        />
      </View>
      <View style={ModalStyles.inputContainer}>
        <TextInput
          style={ModalStyles.inputbg}
          label="Branch"
          mode="outlined"
          placeholderTextColor={COLORS.black}
          activeUnderlineColor={COLORS.primary}
          placeholder="Enter Branch"
          value={formData.branch}
          onChangeText={text =>
            setFormData({
              ...formData,
              branch: text,
            })
          }
        />
      </View>
      <View style={ModalStyles.inputContainer}>
        <TextInput
          style={ModalStyles.inputbg}
          label="Account Name"
          mode="outlined"
          placeholderTextColor={COLORS.black}
          activeUnderlineColor={COLORS.primary}
          placeholder="Enter Account Name"
          value={formData.accountName}
          onChangeText={text =>
            setFormData({
              ...formData,
              accountName: text,
            })
          }
        />
      </View>
      <View style={ModalStyles.inputContainer}>
        <TextInput
          style={ModalStyles.inputbg}
          label="PAN No"
          mode="outlined"
          placeholderTextColor={COLORS.black}
          activeUnderlineColor={COLORS.primary}
          placeholder="Enter PAN No"
          value={formData.panNo}
          onChangeText={text =>
            setFormData({
              ...formData,
              panNo: text,
            })
          }
        />
      </View>
      <View style={ModalStyles.inputContainer}>
        <TextInput
          style={ModalStyles.inputbg}
          label="FSSI"
          mode="outlined"
          placeholderTextColor={COLORS.black}
          activeUnderlineColor={COLORS.primary}
          placeholder="Enter FSSI"
          value={formData.fssi}
          onChangeText={text =>
            setFormData({
              ...formData,
              fssi: text,
            })
          }
        />
      </View>
      <View style={ModalStyles.inputContainer}>
        <TextInput
          style={ModalStyles.inputbg}
          label="Declaration"
          mode="outlined"
          placeholderTextColor={COLORS.black}
          activeUnderlineColor={COLORS.primary}
          placeholder="Enter Declaration"
          value={formData.declaration}
          onChangeText={text =>
            setFormData({
              ...formData,
              declaration: text,
            })
          }
          multiline={true}
          numberOfLines={4}
        />
      </View>
      <TouchableOpacity style={ModalStyles.submitButton} onPress={handleSubmit}>
        <Text>Submit</Text>
      </TouchableOpacity>
      <Text style={ModalStyles.errorText}>{validationError}</Text>
    </View>
  );
};

export default EditProfile;

const styles = StyleSheet.create({});
