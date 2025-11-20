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
import {useStores} from '../components/StoresContext';

const AddEditStore = () => {
  const {data} = useAuth();
  const route = useRoute();
  const {type} = route.params;
  const {initialFormData, formData, setFormData, loading, setLoading} =
    useStores();
  const navigation = useNavigation();

  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      if (!formData.store_name) {
        setFormData({
          ...formData,
          validationError: 'Enter Store Name',
        });
        return;
      }
      if (type === 'Add Store') {
        const res = await axios.post(`${API_BASE_URL}/api/addStore`, {
          store_data: formData,
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
      } else if (type === 'Edit Store') {
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
        <TextInput
          mode="outlined"
          label="Store Name"
          value={formData.store_name}
          onChangeText={text =>
            setFormData({
              ...formData,
              store_name: text,
            })
          }
          style={{margin: 10}}
          outlineColor={COLORS.black}
          textColor={COLORS.black}
          activeOutlineColor={COLORS.primary}
        />
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

export default AddEditStore;

const styles = StyleSheet.create({});
