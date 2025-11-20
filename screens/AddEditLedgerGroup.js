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
import {useLedgerGroup} from '../components/LedgerGroupContext';

const AddEditLedgerGroup = () => {
  const {data} = useAuth();
  const route = useRoute();
  const {type} = route.params;
  const {initialFormData, formData, setFormData, loading, setLoading} =
    useLedgerGroup();
  const navigation = useNavigation();

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [accountGroupOptions, setAccountGroupOptions] = useState([]);

  const getAccountGroupOptions = async company_name => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/getAccountGroupData?company_name=${company_name}`,
        {
          params: {
            include: 'id,account_group',
          },
        },
      );
      const options = response.data.map(accountGroup => ({
        value: accountGroup.id,
        label: accountGroup.account_group,
      }));
      setAccountGroupOptions(options);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAccountGroupOptions(data.company_name);
  }, [data.company_name]);

  useFocusEffect(
    useCallback(() => {
      getAccountGroupOptions(data.company_name);
    }, [data.company_name]),
  );

  const handleSubmit = async () => {
    setLoading(true);
    try {
      if (!formData.accountGroup) {
        return setFormData({
          ...formData,
          validationError: 'Please fill all details',
        });
      }
      if (type === 'Add Ledger Group') {
        const res = await axios.post(`${API_BASE_URL}/api/addLedgerGroup`, {
          ledger_group_data: formData,
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
      } else if (type === 'Edit Ledger Group') {
        const res = await axios.post(`${API_BASE_URL}/api/updateLedgerGroup`, {
          id: formData.id,
          ledger_group: formData.ledgerGroup,
          account_group_id: formData.accountGroup.value,
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
            label="Account Group"
            textInputMode="outlined"
            containerStyle={{margin: 10, flex: 1}}
            value={formData.accountGroup?.label || ''}
            onSelection={item => {
              if (item.selectedList.length === 0) {
                return;
              }
              setFormData(prevFormData => ({
                ...prevFormData,
                accountGroup: {
                  value: item.selectedList[0]._id,
                  label: item.selectedList[0].value,
                },
                ledgerGroup: '',
              }));
            }}
            arrayList={accountGroupOptions.map(option => ({
              value: option.label,
              _id: option.value,
            }))}
            selectedArrayList={
              formData.accountGroup
                ? [
                    {
                      value: formData.accountGroup.label,
                      _id: formData.accountGroup.value,
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
          label="Ledger Group"
          value={formData.ledgerGroup}
          onChangeText={text =>
            setFormData({
              ...formData,
              ledgerGroup: text,
            })
          }
          style={{margin: 10}}
          outlineColor={COLORS.black}
          textColor={COLORS.black}
          activeOutlineColor={COLORS.primary}
          readOnly={
            formData.accountGroup &&
            (formData.accountGroup.value === 9 ||
              formData.accountGroup.value === 10)
          }
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

export default AddEditLedgerGroup;

const styles = StyleSheet.create({});
