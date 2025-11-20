import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import React, {useState} from 'react';
import OuterBodyModal from './OuterBodyModal';
import axios from 'axios';
import {API_BASE_URL} from '../config';
import {useAuth} from './AuthContext';
import {COLORS, FontAwesomeIcon} from '../constants';

const ChangePasswordModal = ({username, showModal, handleClose}) => {
  const {data} = useAuth();
  const initialFormData = {
    cpassword: '',
    npassword: '',
    rpassword: '',
  };
  const [formData, setFormData] = useState(initialFormData);
  const [validationError, setValidationError] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);

  const toggleCurrentPasswordVisibility = () => {
    setShowCurrentPassword(!showCurrentPassword);
  };

  const toggleNewPasswordVisibility = () => {
    setShowNewPassword(!showNewPassword);
  };

  const toggleRepeatPasswordVisibility = () => {
    setShowRepeatPassword(!showRepeatPassword);
  };

  const onSubmitLogin = async event => {
    event.preventDefault();
    try {
      const res = await axios.post(`${API_BASE_URL}/api/changePassword`, {
        username: username,
        cpassword: formData.cpassword,
        npassword: formData.npassword,
        rpassword: formData.rpassword,
        company_name: data.company_name,
      });
      if (res.data.message) {
        console.log('Password Changed');
        setValidationError('');
        setFormData(initialFormData);
        handleClose();
      } else if (res.data.error) {
        setValidationError(res.data.error);
      }
    } catch (error) {
      setValidationError(error);
    }
  };

  return (
    <View>
      <OuterBodyModal
        modalTitle="Login"
        showModal={showModal}
        handleClose={handleClose}>
        <View>
          <View style={{alignItems: 'center'}}>
            <Text>Current Password</Text>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <TextInput
                style={{
                  borderWidth: 1,
                  borderColor: 'gray',
                  width: 200,
                  color: COLORS.black,
                }}
                secureTextEntry={!showCurrentPassword}
                placeholder="Enter Current Password"
                value={formData.cpassword}
                onChangeText={text =>
                  setFormData(prevFormData => ({
                    ...prevFormData,
                    cpassword: text,
                  }))
                }
                required
              />
              <TouchableOpacity onPress={toggleCurrentPasswordVisibility}>
                <FontAwesomeIcon
                  name={showCurrentPassword ? 'eye-slash' : 'eye'}
                />
              </TouchableOpacity>
            </View>
          </View>
          <View style={{alignItems: 'center'}}>
            <Text>New Password</Text>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <TextInput
                style={{
                  borderWidth: 1,
                  borderColor: 'gray',
                  width: 200,
                  color: COLORS.black,
                }}
                secureTextEntry={!showNewPassword}
                placeholder="Enter New Password"
                value={formData.npassword}
                onChangeText={text =>
                  setFormData(prevFormData => ({
                    ...prevFormData,
                    npassword: text,
                  }))
                }
                required
              />
              <TouchableOpacity onPress={toggleNewPasswordVisibility}>
                <FontAwesomeIcon name={showNewPassword ? 'eye-slash' : 'eye'} />
              </TouchableOpacity>
            </View>
          </View>
          <View style={{alignItems: 'center'}}>
            <Text>Repeat Password</Text>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <TextInput
                style={{
                  borderWidth: 1,
                  borderColor: 'gray',
                  width: 200,
                  color: COLORS.black,
                }}
                secureTextEntry={!showRepeatPassword}
                placeholder="Enter Repeat Password"
                value={formData.rpassword}
                onChangeText={text =>
                  setFormData(prevFormData => ({
                    ...prevFormData,
                    rpassword: text,
                  }))
                }
                required
              />
              <TouchableOpacity onPress={toggleRepeatPasswordVisibility}>
                <FontAwesomeIcon
                  name={showRepeatPassword ? 'eye-slash' : 'eye'}
                />
              </TouchableOpacity>
            </View>
          </View>
          <View style={{alignItems: 'center', marginTop: 10}}>
            <TouchableOpacity onPress={onSubmitLogin}>
              <Text
                style={{backgroundColor: 'blue', color: 'white', padding: 10}}>
                Submit
              </Text>
            </TouchableOpacity>
          </View>
          {validationError ? (
            <View style={{alignItems: 'center', marginTop: 10}}>
              <Text style={{color: 'red'}}>{validationError}</Text>
            </View>
          ) : null}
        </View>
      </OuterBodyModal>
    </View>
  );
};

export default ChangePasswordModal;

const styles = StyleSheet.create({});
