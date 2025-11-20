import {Text, View, TouchableOpacity, ActivityIndicator} from 'react-native';
import React, {useState, useEffect, useCallback} from 'react';
import axios from 'axios';
import {API_BASE_URL} from '../config';
import {useAuth} from './AuthContext';
import styles from './AddEditModalStyles';
import {Picker} from '@react-native-picker/picker';
import OuterBodyModal from './OuterBodyModal';
import CheckBox from '@react-native-community/checkbox';
import AddEditRole from './AddEditRole';
import {TextInput} from 'react-native-paper';
import {COLORS, FONTS, FontAwesomeIcon} from '../constants';

const AddEditUser = props => {
  const {data} = useAuth();

  const RoleFormData = {
    id: '',
    role: '',
    validationError: '',
  };

  const [formData, setFormData] = useState(props.initialFormData);
  const [roles, setRoles] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  useEffect(() => {
    setFormData(props.initialFormData);
  }, [props.initialFormData]);

  const getRolesData = async company_name => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/getRoles?company_name=${company_name}`,
        {
          params: {
            include: 'id,role',
          },
        },
      );
      setRoles(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getRolesData(data.company_name);
  }, [data.company_name]);

  const onClickClear = () => {
    setFormData(props.initialFormData);
  };

  const onClickAdd = useCallback(() => {
    setShowModal(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setShowModal(false);
  }, []);

  const onSubmitRole = useCallback(() => {
    setShowModal(false);
    getRolesData(data.company_name);
  }, [data.company_name]);

  const handleSubmit = async event => {
    event.preventDefault();
    setIsLoading(true);
    try {
      if (!formData.role) {
        setFormData({
          ...formData,
          validationError: 'Select Role',
        });
        return;
      }
      if (props.type === 'Add User') {
        const res = await axios.post(`${API_BASE_URL}/api/addUser`, {
          role: formData.role.value,
          username: formData.username,
          password: formData.password,
          email: formData.email,
          phone_no: formData.phone_no,
          country: formData.country,
          state: formData.state,
          city: formData.city,
          address: formData.address,
          pincode: formData.pincode,
          gstin: formData.gstin,
          bank_name: formData.bank_name,
          account_no: formData.account_no,
          ifsc_code: formData.ifsc_code,
          branch: formData.branch,
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
      } else if (props.type === 'Edit User') {
        const res = await axios.post(`${API_BASE_URL}/api/updateUser`, {
          id: formData.id,
          role: formData.role.value,
          username: formData.username,
          password: formData.password,
          change_password_check: formData.change_password_check,
          email: formData.email,
          phone_no: formData.phone_no,
          country: formData.country,
          state: formData.state,
          city: formData.city,
          address: formData.address,
          pincode: formData.pincode,
          gstin: formData.gstin,
          bank_name: formData.bank_name,
          account_no: formData.account_no,
          ifsc_code: formData.ifsc_code,
          branch: formData.branch,
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
        <Text style={styles.labelInput}>Role</Text>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <View style={styles.inputPicker}>
            <Picker
              selectedValue={formData.role ? formData.role.value : null}
              onValueChange={(itemValue, itemIndex) => {
                const selectedOption = roles.find(
                  option => option.role === itemValue,
                );
                setFormData(prevFormData => ({
                  ...prevFormData,
                  role: {
                    value: selectedOption.role,
                    label: selectedOption.role,
                  },
                }));
              }}
              style={{color: COLORS.black}}>
              <Picker.Item label="-- Select Role --" value={null} />
              {roles.map(option => (
                <Picker.Item
                  key={option.id}
                  label={option.role}
                  value={option.role}
                />
              ))}
            </Picker>
          </View>
          <TouchableOpacity style={styles.addButton} onPress={onClickAdd}>
            <Text style={styles.addButtonText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.inputbg}
          mode="flat"
          placeholderTextColor={COLORS.black}
          activeUnderlineColor={COLORS.primary}
          placeholder="Enter Username"
          value={formData.username}
          onChangeText={text =>
            setFormData({
              ...formData,
              username: text,
            })
          }
        />
      </View>

      <View style={[styles.inputContainer]}>
        <View>
          <TextInput
            style={styles.inputbg}
            mode="flat"
            placeholderTextColor={COLORS.black}
            activeUnderlineColor={COLORS.primary}
            placeholder="Enter Password"
            value={formData.password}
            secureTextEntry={showPassword ? false : true}
            onChangeText={text =>
              setFormData({
                ...formData,
                password: text,
              })
            }
            editable={
              formData.change_password_check === 0 && props.type === 'Edit User'
                ? false
                : true
            }
          />
          <TouchableOpacity
            onPress={togglePasswordVisibility}
            style={{
              position: 'absolute',
              right: 0,
              bottom: 10,
              height: 30,
              width: 30,
            }}>
            {showPassword ? (
              <FontAwesomeIcon name="eye-slash" size={20} />
            ) : (
              <FontAwesomeIcon name="eye" size={20} />
            )}
          </TouchableOpacity>
        </View>
      </View>
      {props.type === 'Edit User' && (
        <View style={styles.checkContainer}>
          <CheckBox
            value={formData.change_password_check === 1 ? true : false}
            onValueChange={value =>
              setFormData({...formData, change_password_check: value ? 1 : 0})
            }
          />
          <Text
            style={{fontFamily: FONTS.body4.fontFamily, color: COLORS.blue}}>
            Change Password
          </Text>
        </View>
      )}
      <View style={[styles.inputContainer]}>
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
      <View style={[styles.inputContainer]}>
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
        />
      </View>
      <View style={[styles.inputContainer]}>
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
      <View style={[styles.inputContainer]}>
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
      <View style={[styles.inputContainer]}>
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
      <View style={[styles.inputContainer]}>
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
      <View style={[styles.inputContainer]}>
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
      <View style={[styles.inputContainer]}>
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
      </View>
      <View style={[styles.inputContainer]}>
        <TextInput
          style={styles.inputbg}
          mode="flat"
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
      <View style={[styles.inputContainer]}>
        <TextInput
          style={styles.inputbg}
          mode="flat"
          placeholderTextColor={COLORS.black}
          activeUnderlineColor={COLORS.primary}
          placeholder="Enter Account No"
          value={formData.account_no.toString()}
          onChangeText={text =>
            setFormData({
              ...formData,
              account_no: text,
            })
          }
          keyboardType="numeric"
        />
      </View>
      <View style={[styles.inputContainer]}>
        <TextInput
          style={styles.inputbg}
          mode="flat"
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
      <View style={[styles.inputContainer]}>
        <TextInput
          style={styles.inputbg}
          mode="flat"
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

      <OuterBodyModal
        modalTitle="Add Role"
        showModal={showModal}
        handleClose={handleCloseModal}>
        <AddEditRole
          initialFormData={RoleFormData}
          type="Add Role"
          onHandleSubmit={onSubmitRole}></AddEditRole>
      </OuterBodyModal>
    </View>
  );
};

export default AddEditUser;
