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
import SearchLedgerMenu from '../components/SearchLedgerMenu';
import {usePayments} from '../components/PaymentsContext';

const AddEditPayment = () => {
  const {data} = useAuth();
  const route = useRoute();
  const {type} = route.params;
  const {
    initialFormData,
    formData,
    setFormData,
    loading,
    setLoading,
    initialPaymentSplits,
    setInitialPaymentSplits,
  } = usePayments();
  const navigation = useNavigation();

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [mopOptions, setMopOptions] = useState([]);
  const [userOptions, setUserOptions] = useState([]);
  const [paymentSplits, setPaymentSplits] = useState(initialPaymentSplits);

  const handlePayingNowChange = (index, value) => {
    const updatedSplits = [...paymentSplits];
    updatedSplits[index].payingNow = value;
    setPaymentSplits(updatedSplits);
  };

  const getMopOptions = async company_name => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/getMopOptions?company_name=${company_name}`,
      );
      const options = response.data.map(mop => ({
        value: mop.ledger_group,
        label: mop.ledger_group,
      }));
      setMopOptions(options);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchUsers = async company_name => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/getUsers?company_name=${company_name}`,
      );
      const users = response.data.map(user => ({
        value: user.id,
        label: user.username,
      }));
      setUserOptions(users);
    } catch (error) {
      console.log(error);
    }
  };

  const getInvoiceNo = async company_name => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/getInvoiceSeriesByType?series_name=payment&company_name=${company_name}`,
      );
      setFormData(prevFormData => ({
        ...prevFormData,
        invoiceNo: response.data.next_number,
      }));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getMopOptions(data.company_name);
    fetchUsers(data.company_name);
    if (type === 'Add Payment') {
      getInvoiceNo(data.company_name);
    }
  }, [data.company_name]);

  useFocusEffect(
    useCallback(() => {
      getMopOptions(data.company_name);
      fetchUsers(data.company_name);
      if (type === 'Add Payment') {
        getInvoiceNo(data.company_name);
      }
    }, [data.company_name]),
  );

  const handleUpdateNameBalance = async (name, balance) => {
    setFormData({
      ...formData,
      ledger: name,
      outstandingBalance: Number(balance),
    });
    if (data.isBillByBillAdjustmentExist === 1) {
      try {
        const res = await axios.get(
          `${API_BASE_URL}/api/getPaymentSplitsData`,
          {
            params: {
              ledger: name,
              company_name: data.company_name,
            },
          },
        );
        if (res.data.message) {
          setPaymentSplits(res.data.message);
        } else {
          setPaymentSplits([]);
        }
      } catch (err) {
        console.log(err);
      }
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      if (
        !formData.invoiceDate ||
        !formData.mop ||
        !formData.ledger ||
        formData.outstandingBalance === '' ||
        !formData.amount
      ) {
        return setFormData({
          ...formData,
          validationError: 'Please fill all details',
        });
      }
      // Check the sum of paymentSplits.payingNow only if paymentSplits.length > 0
      if (paymentSplits.length > 0 && data.isBillByBillAdjustmentExist === 1) {
        const totalPayingNow = paymentSplits.reduce((sum, split) => {
          return sum + (Number(split.payingNow) || 0);
        }, 0);

        // Check if the sum of paymentSplits.payingNow matches formData.amount
        if (
          totalPayingNow !== Number(formData.amount) &&
          data.isBillByBillAdjustmentExist === 1
        ) {
          return setFormData({
            ...formData,
            validationError:
              'The total amount does not match the sum of paying now amounts.',
          });
        }
      }
      if (type === 'Add Payment') {
        const res = await axios.post(`${API_BASE_URL}/api/addPayment`, {
          payment_data: formData,
          company_name: data.company_name,
          paymentSplits: paymentSplits,
          isBillByBillAdjustmentExist: data.isBillByBillAdjustmentExist,
        });
        if (res.data.message) {
          setFormData(initialFormData);
          setPaymentSplits(initialPaymentSplits);
          navigation.goBack();
        } else if (res.data.error) {
          setFormData({...formData, validationError: res.data.error});
        } else {
          setFormData({...formData, validationError: 'Please Try again'});
        }
      } else if (type === 'Edit Payment') {
        const res = await axios.post(`${API_BASE_URL}/api/updatePayment`, {
          id: formData.id,
          invoiceNo: formData.invoiceNo,
          invoiceDate: formData.invoiceDate,
          mop: formData.mop,
          ledger: formData.ledger,
          outstandingBalance: formData.outstandingBalance,
          narration: formData.narration,
          amount: formData.amount,
          user_id: formData.user.id,
          company_name: data.company_name,
          paymentSplits: paymentSplits,
          isBillByBillAdjustmentExist: data.isBillByBillAdjustmentExist,
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
          label="Invoice No"
          value={formData.invoiceNo.toString()}
          onChangeText={text =>
            setFormData({
              ...formData,
              invoiceNo: text,
            })
          }
          readOnly
          style={{margin: 10}}
          outlineColor={COLORS.black}
          textColor={COLORS.black}
          activeOutlineColor={COLORS.primary}
        />
        <View style={CustomStyles.row}>
          <TextInput
            style={{margin: 10, flex: 9}}
            mode="outlined"
            label="Invoice Date"
            placeholderTextColor={COLORS.black}
            activeUnderlineColor={COLORS.primary}
            value={
              formData.invoiceDate
                ? new Date(formData.invoiceDate).toLocaleDateString('ta-IN')
                : ''
            }
            placeholder="Invoice Date"
            editable={false}
          />
          <IconButton
            icon="calendar"
            size={40}
            onPress={() => setShowDatePicker(true)}
            style={{margin: 10, flex: 1}}
          />
          {showDatePicker && (
            <DateTimePicker
              value={
                formData.invoiceDate
                  ? new Date(formData.invoiceDate)
                  : new Date()
              }
              mode="date"
              display="default"
              onChange={(event, selectedDate) => {
                setShowDatePicker(false);
                if (selectedDate) {
                  setFormData({
                    ...formData,
                    invoiceDate: selectedDate.toISOString(),
                  });
                }
              }}
            />
          )}
        </View>
        <View style={{margin: 10}}>
          <PaperSelect
            label="Mode of Payment"
            textInputMode="outlined"
            containerStyle={{flex: 1}}
            value={formData.mop?.label || ''}
            onSelection={item => {
              if (item.selectedList.length === 0) {
                return;
              }
              setFormData(prevFormData => ({
                ...prevFormData,
                mop: {
                  value: item.selectedList[0]._id,
                  label: item.selectedList[0].value,
                },
              }));
            }}
            arrayList={mopOptions.map(option => ({
              value: option.label,
              _id: option.value,
            }))}
            selectedArrayList={
              formData.mop
                ? [
                    {
                      value: formData.mop.label,
                      _id: formData.mop.value,
                    },
                  ]
                : []
            }
            errorText=""
            multiEnable={false}
          />
        </View>
        <SearchLedgerMenu
          handleUpdateNameBalance={handleUpdateNameBalance}
          ledgerInput={formData.ledger}
        />
        <TextInput
          mode="outlined"
          label="Outstanding Balance"
          value={formData.outstandingBalance.toString()}
          onChangeText={text =>
            setFormData({
              ...formData,
              outstandingBalance: text,
            })
          }
          style={{margin: 10}}
          outlineColor={COLORS.black}
          textColor={COLORS.black}
          activeOutlineColor={COLORS.primary}
        />
        <TextInput
          mode="outlined"
          label="Amount"
          value={formData.amount.toString()}
          onChangeText={text =>
            setFormData({
              ...formData,
              amount: text,
            })
          }
          style={{margin: 10}}
          outlineColor={COLORS.black}
          textColor={COLORS.black}
          activeOutlineColor={COLORS.primary}
        />
        <TextInput
          mode="outlined"
          label="Narration"
          value={formData.narration}
          onChangeText={text =>
            setFormData({
              ...formData,
              narration: text,
            })
          }
          multiline={true}
          numberOfLines={4}
          style={{margin: 10}}
          outlineColor={COLORS.black}
          textColor={COLORS.black}
          activeOutlineColor={COLORS.primary}
        />
        <View style={{margin: 10}}>
          <PaperSelect
            label="Created By User"
            textInputMode="outlined"
            containerStyle={{flex: 1}}
            value={formData.user?.username || ''}
            onSelection={item => {
              if (item.selectedList.length === 0) {
                return;
              }
              setFormData(prevFormData => ({
                ...prevFormData,
                user: {
                  id: item.selectedList[0]._id,
                  username: item.selectedList[0].value,
                },
              }));
            }}
            arrayList={userOptions.map(option => ({
              value: option.label,
              _id: option.value,
            }))}
            selectedArrayList={
              formData.user
                ? [
                    {
                      value: formData.user.username,
                      _id: formData.user.id,
                    },
                  ]
                : []
            }
            errorText=""
            multiEnable={false}
            disabled={data.role !== 'admin'}
          />
        </View>
        {Array.isArray(paymentSplits) &&
          paymentSplits.length > 0 &&
          data.isBillByBillAdjustmentExist === 1 && (
            <Card style={{margin: 10}}>
              <Card.Title title="Payment Splits" />
              <Card.Content>
                {paymentSplits.map((split, index) => (
                  <View key={index} style={styles.splitContainer}>
                    <View style={styles.splitRow}>
                      <Text style={styles.splitLabel}>Invoice No:</Text>
                      <Text style={styles.splitValue}>
                        {split.invoice_no ?? 'N/A'}
                      </Text>
                    </View>
                    <View style={styles.splitRow}>
                      <Text style={styles.splitLabel}>Type:</Text>
                      <Text style={styles.splitValue}>
                        {split.invoice_type ?? 'N/A'}
                      </Text>
                    </View>
                    <View style={styles.splitRow}>
                      <Text style={styles.splitLabel}>Bill Amount:</Text>
                      <Text style={styles.splitValue}>
                        {split.total_amount ?? 0}
                      </Text>
                    </View>
                    <View style={styles.splitRow}>
                      <Text style={styles.splitLabel}>Settled:</Text>
                      <Text style={styles.splitValue}>
                        {split.settled_amount ?? 0}
                      </Text>
                    </View>
                    <View style={styles.splitRow}>
                      <Text style={styles.splitLabel}>Pending:</Text>
                      <Text style={styles.splitValue}>
                        {split.pending_amount ?? 0}
                      </Text>
                    </View>
                    <View style={styles.splitRow}>
                      <Text style={styles.splitLabel}>Paying Now:</Text>
                      <TextInput
                        style={styles.payingNowInput}
                        keyboardType="numeric"
                        value={split.payingNow?.toString()}
                        onChangeText={text =>
                          handlePayingNowChange(index, text)
                        }
                      />
                    </View>
                    <View style={styles.divider} />
                  </View>
                ))}
              </Card.Content>
            </Card>
          )}
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

export default AddEditPayment;

const styles = StyleSheet.create({
  splitContainer: {
    marginBottom: 10,
  },
  splitRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 4,
  },
  splitLabel: {
    fontWeight: 'bold',
    color: COLORS.black,
  },
  splitValue: {
    flex: 1,
    marginLeft: 10,
    textAlign: 'right',
  },
  payingNowInput: {
    height: 40,
    width: 100,
    borderWidth: 1,
    borderColor: COLORS.gray,
    borderRadius: 4,
    paddingHorizontal: 8,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.lightGray,
    marginVertical: 8,
  },
});
