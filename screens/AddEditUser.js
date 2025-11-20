import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Modal,
  TouchableOpacity,
} from 'react-native';
import React, {useState, useCallback, useEffect} from 'react';
import {
  Appbar,
  Card,
  Button,
  TextInput,
  ActivityIndicator,
  Checkbox,
  IconButton,
} from 'react-native-paper';
import CustomStyles from '../components/AddEditModalStyles';
import {
  useNavigation,
  useRoute,
  useFocusEffect,
} from '@react-navigation/native';
import {COLORS} from '../constants';
import axios from 'axios';
import {API_BASE_URL} from '../config';
import {useAuth} from '../components/AuthContext';
import DateTimePicker from '@react-native-community/datetimepicker';
import {PaperSelect} from 'react-native-paper-select';
import {useUsers} from '../components/UsersContext';

const AddEditUser = () => {
  const {data} = useAuth();
  const route = useRoute();
  const {type} = route.params;
  const {initialFormData, formData, setFormData, loading, setLoading} =
    useUsers();
  const navigation = useNavigation();

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [roles, setRoles] = useState([]);
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

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

  useFocusEffect(
    useCallback(() => {
      getRolesData(data.company_name);
    }, [data.company_name]),
  );

  const handleSubmit = async () => {
    setLoading(true);
    try {
      if (!formData.role) {
        setFormData({
          ...formData,
          validationError: 'Select Role',
        });
        return;
      }
      if (type === 'Add User') {
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
          accountName: formData.accountName,
          panNo: formData.panNo,
          fssi: formData.fssi,
          company_name: data.company_name,
        });
        if (res.data.message) {
          setFormData(initialFormData);
          navigation.goBack();
        } else if (res.data.error) {
          setFormData({...formData, validationError: res.data.error});
        } else {
          setFormData({...formData, validationError: 'Please Try again'});
        }
      } else if (type === 'Edit User') {
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
          accountName: formData.accountName,
          panNo: formData.panNo,
          fssi: formData.fssi,
          company_name: data.company_name,
        });
        if (res.data.message) {
          navigation.goBack();
        } else if (res.data.error) {
          setFormData({...formData, validationError: res.data.error});
        } else {
          setFormData({...formData, validationError: 'Please Try again'});
        }
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={CustomStyles.safeContainer}>
      <Appbar.Header style={CustomStyles.appHeader}>
        <Appbar.BackAction
          onPress={() => {
            navigation.goBack();
          }}
          color={COLORS.white}
        />
        <Appbar.Content
          title={`${type}`}
          titleStyle={CustomStyles.titleStyle}
        />
      </Appbar.Header>
      {loading && (
        <Modal
          transparent={true}
          animationType="none"
          visible={loading}
          onRequestClose={() => {}} // Prevent the modal from closing
        >
          <View style={CustomStyles.overlay}>
            <ActivityIndicator
              size="large"
              animating={true}
              color={COLORS.emerald}
            />
          </View>
        </Modal>
      )}
      <ScrollView contentContainerStyle={CustomStyles.scrollViewContent}>
        <View style={CustomStyles.row}>
          <PaperSelect
            label="Role"
            textInputMode="outlined"
            containerStyle={{margin: 10, flex: 1}}
            value={formData.role?.label || ''}
            onSelection={item => {
              if (item.selectedList.length === 0) {
                return;
              }
              setFormData(prevFormData => ({
                ...prevFormData,
                role: {
                  value: item.selectedList[0]._id,
                  label: item.selectedList[0].value,
                },
              }));
            }}
            arrayList={roles.map(option => ({
              value: option.role,
              _id: option.role,
            }))}
            selectedArrayList={
              formData.role
                ? [
                    {
                      value: formData.role.label,
                      _id: formData.role.value,
                    },
                  ]
                : []
            }
            errorText=""
            multiEnable={false}
          />
          <Button
            mode="contained"
            onPress={() => {
              navigation.navigate('RolesStack', {
                screen: 'AddEditRole',
                params: {type: 'Add Role'},
              });
            }}
            style={CustomStyles.bottomButton}>
            +
          </Button>
        </View>
        <TextInput
          mode="outlined"
          label="Username"
          value={formData.username}
          onChangeText={text =>
            setFormData({
              ...formData,
              username: text,
            })
          }
          style={{margin: 10}}
          outlineColor={COLORS.black}
          textColor={COLORS.black}
          activeOutlineColor={COLORS.primary}
        />
        <TextInput
          mode="outlined"
          label="Password"
          value={formData.password}
          onChangeText={text =>
            setFormData({
              ...formData,
              password: text,
            })
          }
          secureTextEntry={!showPassword}
          readOnly={
            formData.change_password_check === 0 && type === 'Edit User'
          }
          right={
            <TextInput.Icon
              icon={showPassword ? 'eye-off' : 'eye'}
              onPress={togglePasswordVisibility}
            />
          }
          style={{margin: 10}}
          outlineColor={COLORS.black}
          textColor={COLORS.black}
          activeOutlineColor={COLORS.primary}
        />
        {type === 'Edit User' && (
          <Checkbox.Item
            label="Change Pasword"
            status={
              formData.change_password_check === 1 ? 'checked' : 'unchecked'
            }
            onPress={() => {
              setFormData({
                ...formData,
                change_password_check:
                  formData.change_password_check === 1 ? 0 : 1,
              });
            }}
          />
        )}
        <TextInput
          mode="outlined"
          label="Email"
          value={formData.email}
          onChangeText={text =>
            setFormData({
              ...formData,
              email: text,
            })
          }
          style={{margin: 10}}
          outlineColor={COLORS.black}
          textColor={COLORS.black}
          activeOutlineColor={COLORS.primary}
        />
        <TextInput
          mode="outlined"
          label="Phone No"
          value={formData.phone_no.toString()}
          onChangeText={text =>
            setFormData({
              ...formData,
              phone_no: text,
            })
          }
          style={{margin: 10}}
          outlineColor={COLORS.black}
          textColor={COLORS.black}
          activeOutlineColor={COLORS.primary}
        />
        <TextInput
          mode="outlined"
          label="Country"
          value={formData.country}
          onChangeText={text =>
            setFormData({
              ...formData,
              country: text,
            })
          }
          style={{margin: 10}}
          outlineColor={COLORS.black}
          textColor={COLORS.black}
          activeOutlineColor={COLORS.primary}
        />
        <TextInput
          mode="outlined"
          label="State"
          value={formData.state}
          onChangeText={text =>
            setFormData({
              ...formData,
              state: text,
            })
          }
          style={{margin: 10}}
          outlineColor={COLORS.black}
          textColor={COLORS.black}
          activeOutlineColor={COLORS.primary}
        />
        <TextInput
          mode="outlined"
          label="City"
          value={formData.city}
          onChangeText={text =>
            setFormData({
              ...formData,
              city: text,
            })
          }
          style={{margin: 10}}
          outlineColor={COLORS.black}
          textColor={COLORS.black}
          activeOutlineColor={COLORS.primary}
        />
        <TextInput
          mode="outlined"
          label="Address"
          value={formData.address}
          onChangeText={text =>
            setFormData({
              ...formData,
              address: text,
            })
          }
          style={{margin: 10}}
          outlineColor={COLORS.black}
          textColor={COLORS.black}
          activeOutlineColor={COLORS.primary}
        />
        <TextInput
          mode="outlined"
          label="Pincode"
          value={formData.pincode.toString()}
          onChangeText={text =>
            setFormData({
              ...formData,
              pincode: text,
            })
          }
          style={{margin: 10}}
          outlineColor={COLORS.black}
          textColor={COLORS.black}
          activeOutlineColor={COLORS.primary}
        />
        <TextInput
          mode="outlined"
          label="GSTIN"
          value={formData.gstin}
          onChangeText={text =>
            setFormData({
              ...formData,
              gstin: text,
            })
          }
          style={{margin: 10}}
          outlineColor={COLORS.black}
          textColor={COLORS.black}
          activeOutlineColor={COLORS.primary}
        />
        <TextInput
          mode="outlined"
          label="Bank Name"
          value={formData.bank_name}
          onChangeText={text =>
            setFormData({
              ...formData,
              bank_name: text,
            })
          }
          style={{margin: 10}}
          outlineColor={COLORS.black}
          textColor={COLORS.black}
          activeOutlineColor={COLORS.primary}
        />
        <TextInput
          mode="outlined"
          label="Account No"
          value={formData.account_no.toString()}
          onChangeText={text =>
            setFormData({
              ...formData,
              account_no: text,
            })
          }
          style={{margin: 10}}
          outlineColor={COLORS.black}
          textColor={COLORS.black}
          activeOutlineColor={COLORS.primary}
        />
        <TextInput
          mode="outlined"
          label="IFSC Code"
          value={formData.ifsc_code}
          onChangeText={text =>
            setFormData({
              ...formData,
              ifsc_code: text,
            })
          }
          style={{margin: 10}}
          outlineColor={COLORS.black}
          textColor={COLORS.black}
          activeOutlineColor={COLORS.primary}
        />
        <TextInput
          mode="outlined"
          label="Branch"
          value={formData.branch}
          onChangeText={text =>
            setFormData({
              ...formData,
              branch: text,
            })
          }
          style={{margin: 10}}
          outlineColor={COLORS.black}
          textColor={COLORS.black}
          activeOutlineColor={COLORS.primary}
        />
        <TextInput
          mode="outlined"
          label="Account Name"
          value={formData.accountName}
          onChangeText={text =>
            setFormData({
              ...formData,
              accountName: text,
            })
          }
          style={{margin: 10}}
          outlineColor={COLORS.black}
          textColor={COLORS.black}
          activeOutlineColor={COLORS.primary}
        />
        <TextInput
          mode="outlined"
          label="PAN No"
          value={formData.panNo}
          onChangeText={text =>
            setFormData({
              ...formData,
              panNo: text,
            })
          }
          style={{margin: 10}}
          outlineColor={COLORS.black}
          textColor={COLORS.black}
          activeOutlineColor={COLORS.primary}
        />
        <TextInput
          mode="outlined"
          label="FSSI"
          value={formData.fssi}
          onChangeText={text =>
            setFormData({
              ...formData,
              fssi: text,
            })
          }
          style={{margin: 10}}
          outlineColor={COLORS.black}
          textColor={COLORS.black}
          activeOutlineColor={COLORS.primary}
        />
        <Text style={{color: COLORS.red, padding: 10}}>
          {formData.validationError}
        </Text>
      </ScrollView>
      <View style={CustomStyles.boottomButtonsContainer}>
        <Button
          mode="contained"
          onPress={() => {
            handleSubmit();
          }}
          style={[CustomStyles.bottomButton, {flex: 1}]}>
          <Text>Save</Text>
        </Button>
      </View>
    </View>
  );
};

export default AddEditUser;

const styles = StyleSheet.create({});
