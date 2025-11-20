import {StyleSheet, Text, View, ScrollView, Modal} from 'react-native';
import React, {useState, useCallback} from 'react';
import {Appbar, Card, Button, ActivityIndicator} from 'react-native-paper';
import CustomStyles from '../components/AddEditModalStyles';
import {
  useNavigation,
  useRoute,
  useFocusEffect,
} from '@react-navigation/native';
import {COLORS} from '../constants';
import {useAuth} from '../components/AuthContext';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal';
import AlertModal from '../components/AlertModal';
import axios from 'axios';
import {API_BASE_URL} from '../config';
import {usePayments} from '../components/PaymentsContext';

const ViewPayment = () => {
  const {permissions, data} = useAuth();
  const route = useRoute();
  const {id} = route.params;
  const navigation = useNavigation();
  const {
    formData,
    setFormData,
    loading,
    setLoading,
    showDelModal,
    setShowDelModal,
    showAlertModal,
    setShowAlertModal,
    alertMessage,
    setAlertMessage,
    setSearchLedgerInput,
    initialPaymentSplits,
    setInitialPaymentSplits,
  } = usePayments();

  const isEditPayment = permissions.find(
    permission => permission.page === 'payments' && permission.edit === 1,
  );
  const isDelPayment = permissions.find(
    permission => permission.page === 'payments' && permission.del === 1,
  );

  const handleCloseModal = useCallback(() => {
    setShowDelModal(false);
  }, []);

  const handleCloseAlertModal = useCallback(() => {
    setShowAlertModal(false);
    navigation.navigate('Payments');
  }, []);

  const getPaymentById = async id => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${API_BASE_URL}/api/getPaymentById?id=${id}&company_name=${data.company_name}`,
      );
      setSearchLedgerInput(response.data.ledger);
      setFormData({
        ...formData,
        id: response.data.id,
        invoiceNo: response.data.invoice_no,
        invoiceDate: new Date(response.data.invoice_date),
        mop: {value: response.data.mop, label: response.data.mop},
        ledger: response.data.ledger,
        outstandingBalance: response.data.outstanding_balance,
        narration: response.data.narration,
        amount: response.data.amount,
        user: {
          id: response.data.user_id,
          username: response.data.username,
        },
      });
      setInitialPaymentSplits(response.data.purchase_invoices);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const onClickEdit = useCallback(
    id => {
      console.log('Edit ID: ' + id);
      getPaymentById(id);
      navigation.navigate('AddEditPayment', {
        type: 'Edit Payment',
      });
    },
    [formData, data.company_name],
  );

  useFocusEffect(
    useCallback(() => {
      getPaymentById(id);
    }, [id]),
  );

  const onClickDel = useCallback(
    id => {
      setFormData({
        ...formData,
        id: id,
      });
      setShowDelModal(true);
    },
    [formData],
  );

  const handleSubmitAlert = useCallback(
    async buttonValue => {
      if (buttonValue === 'Yes') {
        console.log('Yes button clicked and id is: ' + formData.id);
        try {
          const res = await axios.post(`${API_BASE_URL}/api/delPayment`, {
            id: formData.id,
            company_name: data.company_name,
            isBillByBillAdjustmentExist: data.isBillByBillAdjustmentExist,
          });
          if (res.data.message) {
            // console.log(res.data.message);
            setAlertMessage('Payment deleted successfully');
          } else if (res.data.error) {
            // console.log(res.data.error);
            setAlertMessage('Error: ' + res.data.error);
          }
        } catch (err) {
          console.log(err);
        }
        setShowDelModal(false);
        setShowAlertModal(true);
      } else if (buttonValue === 'No') {
        handleCloseModal();
      }
    },
    [
      formData,
      handleCloseModal,
      data.company_name,
      data.isBillByBillAdjustmentExist,
    ],
  );

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
          title="Payment Details"
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
        <Card style={{marginVertical: 10, backgroundColor: COLORS.white}}>
          <Card.Content>
            <View style={CustomStyles.row}>
              <Text style={CustomStyles.flexText}>Invoice No</Text>
              <Text style={CustomStyles.flexText}>Invoice Date</Text>
            </View>
            <View style={CustomStyles.row}>
              <Text style={CustomStyles.boldText}>{formData.invoiceNo}</Text>
              <Text style={CustomStyles.boldText}>
                {formData.invoiceDate
                  ? new Date(formData.invoiceDate).toLocaleDateString('ta-IN')
                  : ''}
              </Text>
            </View>
            <View style={[CustomStyles.row, {marginTop: 20}]}>
              <Text style={CustomStyles.flexText}>Mode of Payment</Text>
              <Text style={CustomStyles.flexText}>Ledger</Text>
            </View>
            <View style={CustomStyles.row}>
              <Text style={CustomStyles.boldText}>{formData.mop?.label}</Text>
              <Text style={CustomStyles.boldText}>{formData.ledger}</Text>
            </View>
            <View style={[CustomStyles.row, {marginTop: 20}]}>
              <Text style={CustomStyles.flexText}>Amount</Text>
              <Text style={CustomStyles.flexText}>Outstanding Balance</Text>
            </View>
            <View style={CustomStyles.row}>
              <Text style={CustomStyles.boldText}>{formData.amount}</Text>
              <Text style={CustomStyles.boldText}>
                {formData.outstandingBalance}
              </Text>
            </View>
            <View style={[CustomStyles.row, {marginTop: 20}]}>
              <Text style={CustomStyles.flexText}>Narration</Text>
              <Text style={CustomStyles.flexText}>Created By User</Text>
            </View>
            <View style={CustomStyles.row}>
              <Text style={CustomStyles.boldText}>{formData.narration}</Text>
              <Text style={CustomStyles.boldText}>
                {formData.user?.username}
              </Text>
            </View>
          </Card.Content>
        </Card>
      </ScrollView>
      <View style={CustomStyles.boottomButtonsContainer}>
        <Button
          mode="contained"
          onPress={() => {
            onClickDel(formData.id);
          }}
          disabled={!isDelPayment}
          style={[
            CustomStyles.bottomButton,
            {backgroundColor: COLORS.red, flex: 1},
          ]}>
          <Text>Delete</Text>
        </Button>
        <Button
          mode="contained"
          onPress={() => {
            onClickEdit(formData.id);
          }}
          disabled={!isEditPayment}
          style={[CustomStyles.bottomButton, {flex: 1}]}>
          <Text>Edit</Text>
        </Button>
      </View>
      <DeleteConfirmationModal
        showModal={showDelModal}
        handleClose={handleCloseModal}
        handleSubmitAlert={handleSubmitAlert}
      />
      <AlertModal
        showModal={showAlertModal}
        handleClose={handleCloseAlertModal}
        modalTitle="Alert"
        message={alertMessage}
      />
    </View>
  );
};

export default ViewPayment;

const styles = StyleSheet.create({});
