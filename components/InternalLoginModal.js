import {
  View,
  Text,
  TextInput,
  TouchableOpacity,

} from 'react-native';
import React, {useState} from 'react';
import OuterBodyModal from './OuterBodyModal';
import axios from 'axios';
import {API_BASE_URL} from '../config';
import AlertModal from './AlertModal';
import {useAuth} from './AuthContext';
import {FontAwesomeIcon, COLORS} from '../constants';
import styles from './AddEditModalStyles';

const InternalLoginModal = ({showModal, handleClose, type, invoiceNo}) => {
  const {data} = useAuth();
  const initialFormData = {
    username: '',
    password: '',
  };
  const [formData, setFormData] = useState(initialFormData);
  const [validationError, setValidationError] = useState('');
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const onSubmitLogin = async event => {
    event.preventDefault();
    if (type === 'format') {
      try {
        const res = await axios.post(
          `${API_BASE_URL}/api/internalLoginToFormat`,
          {
            username: formData.username,
            password: formData.password,
            company_name: data.company_name,
          },
        );
        if (res.data.message) {
          console.log('Login Successful');
          setValidationError('');
          setFormData(initialFormData);
          handleClose();
          setShowAlertModal(true);
        } else if (res.data.error) {
          setValidationError(res.data.error);
        }
      } catch (error) {
        setValidationError(error);
      }
    } else {
      try {
        const res = await axios.post(
          `${API_BASE_URL}/api/internalLoginToDelInvoice`,
          {
            username: formData.username,
            password: formData.password,
            type: type,
            invoiceNo: invoiceNo,
            company_name: data.company_name,
          },
        );
        if (res.data.message) {
          console.log('Login Successful');
          setValidationError('');
          setFormData(initialFormData);
          handleClose();
          setShowAlertModal(true);
          window.location.reload();
        } else if (res.data.error) {
          setValidationError(res.data.error);
        }
      } catch (error) {
        setValidationError(error);
      }
    }
  };

  const handleCloseAlertModal = event => {
    event.preventDefault();
    setShowAlertModal(false);
  };

  return (
    <View>
      <OuterBodyModal
        modalTitle="Login"
        showModal={showModal}
        handleClose={handleClose}>
        <View>
          <View style={styles.container}>
            <Text style={styles.labelInput}>Username :</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter Username"
              placeholderTextColor={COLORS.black}
              value={formData.username}
              onChangeText={text =>
                setFormData(prevFormData => ({
                  ...prevFormData,
                  username: text,
                }))
              }
            />
          </View>
          <View
            style={[styles.container, {position: 'relative', marginTop: -30}]}>
            <Text style={styles.labelInput}>Password :</Text>
            <TextInput
              style={styles.input}
              secureTextEntry={!showPassword}
              placeholderTextColor={COLORS.black}
              placeholder="Enter Password"
              value={formData.password}
              onChangeText={text =>
                setFormData(prevFormData => ({
                  ...prevFormData,
                  password: text,
                }))
              }
            />
            <TouchableOpacity
              onPress={togglePasswordVisibility}
              style={{
                position: 'absolute',
                right: 20,
                bottom: 35,
                height: 30,
                width: 30,
              }}>
              <FontAwesomeIcon
                size={18}
                color={COLORS.black}
                name={showPassword ? 'eye' : 'eye-slash'}
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity onPress={onSubmitLogin} style={styles.submitButton}>
            <Text style={styles.submitButtonText}>Submit</Text>
          </TouchableOpacity>

          {validationError ? (
            <View style={{alignItems: 'center', marginTop: 10}}>
              <Text style={{color: 'red'}}>{validationError}</Text>
            </View>
          ) : null}
        </View>
      </OuterBodyModal>
      <AlertModal
        showModal={showAlertModal}
        handleClose={handleCloseAlertModal}
        modalTitle="Alert"
        message="Deleted successfully"
      />
    </View>
  );
};

export default InternalLoginModal;
