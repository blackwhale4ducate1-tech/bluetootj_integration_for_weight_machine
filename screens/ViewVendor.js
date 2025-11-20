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
import {useVendors} from '../components/VendorsContext';

const ViewVendor = () => {
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
  } = useVendors();

  const isEditVendor = permissions.find(
    permission => permission.page === 'vendors' && permission.edit === 1,
  );
  const isDelVendor = permissions.find(
    permission => permission.page === 'vendors' && permission.del === 1,
  );

  const handleCloseModal = useCallback(() => {
    setShowDelModal(false);
  }, []);

  const handleCloseAlertModal = useCallback(() => {
    setShowAlertModal(false);
    navigation.navigate('Customers');
  }, []);

  const getProductById = async id => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${API_BASE_URL}/api/getCustomerById?id=${id}&company_name=${data.company_name}`,
      );

      setFormData({
        ...formData,
        id: response.data.id,
        name: response.data.name,
        account_code: response.data.account_code,
        regional_name: response.data.regional_name,
        phone_no: response.data.phone_no !== 0 ? response.data.phone_no : '',
        alt_phone_no:
          response.data.alt_phone_no !== 0 ? response.data.alt_phone_no : '',
        email: response.data.email,
        address: response.data.address,
        gstin: response.data.gstin,
        state: response.data.state,
        city: response.data.city,
        opening_balance:
          response.data.opening_balance !== 0
            ? response.data.opening_balance
            : '',
        invoiceDate: new Date(response.data.invoice_date)
          .toISOString()
          .split('T')[0],
        debit_credit: {
          value: response.data.debit_credit,
          label: response.data.debit_credit,
        },
        credit_limit:
          response.data.credit_limit !== 0 ? response.data.credit_limit : '',
        credit_days:
          response.data.credit_days !== 0 ? response.data.credit_days : '',
      });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const getInvoiceNo = useCallback(async company_name => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/getInvoiceSeriesForCustomer?series_name=customer&company_name=${company_name}`,
      );
      const nextNumber = response.data.next_number.toString().padStart(4, '0');
      setFormData(prevFormData => ({
        ...prevFormData,
        account_code: nextNumber,
      }));
    } catch (error) {
      console.log(error);
    }
  }, []);

  const onClickEdit = useCallback(
    id => {
      console.log('Edit ID: ' + id);
      getProductById(id);
      navigation.navigate('AddEditVendor', {
        type:
          data.business_category === 'FlowerShop'
            ? 'Edit Farmer'
            : 'Edit Vendor',
      });
    },
    [formData, data.company_name],
  );

  useFocusEffect(
    useCallback(() => {
      getProductById(id);
      if (data.business_category === 'FlowerShop' && type === 'Add Vendor') {
        getInvoiceNo(data.company_name);
      }
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
          const res = await axios.post(`${API_BASE_URL}/api/delCustomer`, {
            id: formData.id,
            company_name: data.company_name,
            business_category: data.business_category,
          });
          if (res.data.message) {
            // console.log(res.data.message);
            setAlertMessage('Customer deleted successfully');
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
    [formData, handleCloseModal, data.company_name],
    data.business_category,
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
          title="Vendor Details"
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
              <Text style={[CustomStyles.flexText, styles.blackText]}>Account Code</Text>
              <Text style={[CustomStyles.flexText, styles.blackText]}>Name</Text>
            </View>
            <View style={CustomStyles.row}>
              <Text style={[CustomStyles.boldText, styles.blackText]}>{formData.account_code}</Text>
              <Text style={[CustomStyles.boldText, styles.blackText]}>{formData.name}</Text>
            </View>
            <View style={[CustomStyles.row, {marginTop: 20}]}>
              <Text style={[CustomStyles.flexText, styles.blackText]}>Phone No</Text>
              <Text style={[CustomStyles.flexText, styles.blackText]}>Alt Phone No</Text>
            </View>
            <View style={CustomStyles.row}>
              <Text style={[CustomStyles.boldText, styles.blackText]}>{formData.phone_no}</Text>
              <Text style={[CustomStyles.boldText, styles.blackText]}>{formData.alt_phone_no}</Text>
            </View>
            <View style={[CustomStyles.row, {marginTop: 20}]}>
              <Text style={[CustomStyles.flexText, styles.blackText]}>Email</Text>
              <Text style={[CustomStyles.flexText, styles.blackText]}>Address</Text>
            </View>
            <View style={CustomStyles.row}>
              <Text style={[CustomStyles.boldText, styles.blackText]}>{formData.email}</Text>
              <Text style={[CustomStyles.boldText, styles.blackText]}>{formData.address}</Text>
            </View>
            <View style={[CustomStyles.row, {marginTop: 20}]}>
              <Text style={[CustomStyles.flexText, styles.blackText]}>GSTIN</Text>
              <Text style={[CustomStyles.flexText, styles.blackText]}>State</Text>
              <Text style={[CustomStyles.flexText, styles.blackText]}>City</Text>
            </View>
            <View style={CustomStyles.row}>
              <Text style={[CustomStyles.boldText, styles.blackText]}>{formData.gstin}</Text>
              <Text style={[CustomStyles.boldText, styles.blackText]}>{formData.state}</Text>
              <Text style={[CustomStyles.boldText, styles.blackText]}>{formData.city}</Text>
            </View>
            <View style={[CustomStyles.row, {marginTop: 20}]}>
              <Text style={[CustomStyles.flexText, styles.blackText]}>Opening Balance</Text>
              <Text style={[CustomStyles.flexText, styles.blackText]}>Invoice Date</Text>
            </View>
            <View style={CustomStyles.row}>
              <Text style={[CustomStyles.boldText, styles.blackText]}>
                {formData.opening_balance}
              </Text>
              <Text style={CustomStyles.boldText}>{formData.invoiceDate}</Text>
            </View>
            <View style={[CustomStyles.row, {marginTop: 20}]}>
              <Text style={[CustomStyles.flexText, styles.blackText]}>Debit/Credit</Text>
              <Text style={[CustomStyles.flexText, styles.blackText]}>Credit Limit</Text>
            </View>
            <View style={CustomStyles.row}>
              <Text style={[CustomStyles.boldText, styles.blackText]}>
                {formData.debit_credit.value}
              </Text>
              <Text style={CustomStyles.boldText}>{formData.credit_limit}</Text>
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
          disabled={!isDelVendor}
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
          disabled={!isEditVendor}
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

export default ViewVendor;

const styles = StyleSheet.create({
  blackText: {
    color: COLORS.black,
  },
});
