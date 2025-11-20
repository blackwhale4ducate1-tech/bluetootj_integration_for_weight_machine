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
import {useRoles} from '../components/RolesContext';

const AddEditRole = () => {
  const {data} = useAuth();
  const route = useRoute();
  const {type} = route.params;
  const {initialFormData, formData, setFormData, loading, setLoading} =
    useRoles();
  const navigation = useNavigation();

  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      if (!formData.role) {
        setFormData({
          ...formData,
          validationError: 'Enter Role Name',
        });
        return;
      }
      if (type === 'Add Role') {
        const res = await axios.post(`${API_BASE_URL}/api/addRole`, {
          formData: formData,
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
      } else if (type === 'Edit Role') {
        const res = await axios.post(`${API_BASE_URL}/api/updateRole`, {
          id: formData.id,
          role: formData.role,
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
          label="Role Name"
          value={formData.role}
          onChangeText={text =>
            setFormData({
              ...formData,
              role: text,
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

export default AddEditRole;

const styles = StyleSheet.create({});
