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
import {useAccountGroup} from '../components/AccountGroupContext';

const AddEditAccountGroup = () => {
  const {data} = useAuth();
  const route = useRoute();
  const {type} = route.params;
  const {initialFormData, formData, setFormData, loading, setLoading} =
    useAccountGroup();
  const navigation = useNavigation();

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

  const handleSubmit = async () => {
    setLoading(true);
    try {
      if (type === 'Add Account Group') {
        const res = await axios.post(`${API_BASE_URL}/api/addAccountGroup`, {
          account_group_data: formData,
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
      } else if (type === 'Edit Account Group') {
        const res = await axios.post(`${API_BASE_URL}/api/updateAccountGroup`, {
          id: formData.id,
          base_group: formData.baseGroup,
          account_group: formData.accountGroup,
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
            label="Base Group"
            textInputMode="outlined"
            containerStyle={{margin: 10, flex: 1}}
            value={formData.baseGroup}
            onSelection={item => {
              if (item.selectedList.length === 0) {
                return;
              }
              setFormData(prevFormData => ({
                ...prevFormData,
                baseGroup: item.selectedList[0]._id,
              }));
            }}
            arrayList={baseGroupOptions.map(option => ({
              value: option.label,
              _id: option.value,
            }))}
            selectedArrayList={
              formData.baseGroup
                ? [
                    {
                      value: formData.baseGroup,
                      _id: formData.baseGroup,
                    },
                  ]
                : []
            }
            errorText=""
            multiEnable={false}
          />
        </View>
        <TextInput
          mode="outlined"
          label="Account Group"
          value={formData.accountGroup}
          onChangeText={text =>
            setFormData({
              ...formData,
              accountGroup: text,
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

export default AddEditAccountGroup;

const styles = StyleSheet.create({});
