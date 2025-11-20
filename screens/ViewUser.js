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
import {useUsers} from '../components/UsersContext';

const ViewUser = () => {
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
  } = useUsers();

  const isEditUser = permissions.find(
    permission => permission.page === 'users' && permission.edit === 1,
  );
  const isDelUser = permissions.find(
    permission => permission.page === 'users' && permission.del === 1,
  );

  const handleCloseModal = useCallback(() => {
    setShowDelModal(false);
  }, []);

  const handleCloseAlertModal = useCallback(() => {
    setShowAlertModal(false);
    navigation.navigate('Users');
  }, []);

  const getUserById = async id => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${API_BASE_URL}/api/getUserById?id=${id}&company_name=${data.company_name}`,
      );
      // const { name } = response.data;
      setFormData({
        ...formData,
        id: response.data.id,
        role: {value: response.data.role, label: response.data.role},
        username: response.data.username,
        password: response.data.password,
        email: response.data.email,
        phone_no: response.data.phone_no,
        country: response.data.country,
        state: response.data.state,
        city: response.data.city,
        address: response.data.address,
        pincode: response.data.pincode,
        gstin: response.data.gstin,
        bank_name: response.data.bank_name,
        account_no: response.data.account_no,
        ifsc_code: response.data.ifsc_code,
        branch: response.data.branch,
        accountName: response.data.accountName,
        panNo: response.data.panNo,
        fssi: response.data.fssi,
      });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const onClickEdit = useCallback(
    id => {
      console.log('Edit ID: ' + id);
      getUserById(id);
      navigation.navigate('AddEditUser', {
        type: 'Edit User',
      });
    },
    [formData, data.company_name],
  );

  useFocusEffect(
    useCallback(() => {
      getUserById(id);
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
          const res = await axios.post(`${API_BASE_URL}/api/delUsers`, {
            id: formData.id,
            company_name: data.company_name,
          });
          if (res.data.message) {
            // console.log(res.data.message);
            setAlertMessage('User deleted successfully');
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
          title="User Details"
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
              <Text style={[CustomStyles.flexText, styles.blackText]}>Username</Text>
            </View>
            <View style={CustomStyles.row}>
              <Text style={[CustomStyles.boldText, styles.blackText]}>{formData.username}</Text>
            </View>
            <View style={[CustomStyles.row, {marginTop: 20}]}>
              <Text style={[CustomStyles.flexText, styles.blackText]}>Email</Text>
              <Text style={[CustomStyles.flexText, styles.blackText]}>Phone No</Text>
            </View>
            <View style={CustomStyles.row}>
              <Text style={[CustomStyles.boldText, styles.blackText]}>{formData.email}</Text>
              <Text style={[CustomStyles.boldText, styles.blackText]}>{formData.phone_no}</Text>
            </View>
            <View style={[CustomStyles.row, {marginTop: 20}]}>
              <Text style={[CustomStyles.flexText, styles.blackText]}>Country</Text>
              <Text style={[CustomStyles.flexText, styles.blackText]}>State</Text>
            </View>
            <View style={CustomStyles.row}>
              <Text style={[CustomStyles.boldText, styles.blackText]}>{formData.country}</Text>
              <Text style={[CustomStyles.boldText, styles.blackText]}>{formData.state}</Text>
            </View>
            <View style={[CustomStyles.row, {marginTop: 20}]}>
              <Text style={[CustomStyles.flexText, styles.blackText]}>City</Text>
              <Text style={[CustomStyles.flexText, styles.blackText]}>Address</Text>
            </View>
            <View style={CustomStyles.row}>
              <Text style={[CustomStyles.boldText, styles.blackText]}>{formData.city}</Text>
              <Text style={[CustomStyles.boldText, styles.blackText]}>{formData.address}</Text>
            </View>
            <View style={[CustomStyles.row, {marginTop: 20}]}>
              <Text style={[CustomStyles.flexText, styles.blackText]}>Pincode</Text>
              <Text style={[CustomStyles.flexText, styles.blackText]}>GSTIN</Text>
            </View>
            <View style={CustomStyles.row}>
              <Text style={[CustomStyles.boldText, styles.blackText]}>{formData.pincode}</Text>
              <Text style={[CustomStyles.boldText, styles.blackText]}>{formData.gstin}</Text>
            </View>
            <View style={[CustomStyles.row, {marginTop: 20}]}>
              <Text style={[CustomStyles.flexText, styles.blackText]}>Bank Name</Text>
              <Text style={[CustomStyles.flexText, styles.blackText]}>Account No</Text>
            </View>
            <View style={CustomStyles.row}>
              <Text style={[CustomStyles.boldText, styles.blackText]}>{formData.bank_name}</Text>
              <Text style={[CustomStyles.boldText, styles.blackText]}>{formData.account_no}</Text>
            </View>
            <View style={[CustomStyles.row, {marginTop: 20}]}>
              <Text style={[CustomStyles.flexText, styles.blackText]}>IFSC Code</Text>
              <Text style={[CustomStyles.flexText, styles.blackText]}>Branch</Text>
            </View>
            <View style={CustomStyles.row}>
              <Text style={[CustomStyles.boldText, styles.blackText]}>{formData.ifsc_code}</Text>
              <Text style={[CustomStyles.boldText, styles.blackText]}>{formData.branch}</Text>
            </View>
            <View style={[CustomStyles.row, {marginTop: 20}]}>
              <Text style={[CustomStyles.flexText, styles.blackText]}>Account Name</Text>
              <Text style={[CustomStyles.flexText, styles.blackText]}>PAN No</Text>
            </View>
            <View style={CustomStyles.row}>
              <Text style={[CustomStyles.boldText, styles.blackText]}>{formData.accountName}</Text>
              <Text style={[CustomStyles.boldText, styles.blackText]}>{formData.panNo}</Text>
            </View>
            <View style={[CustomStyles.row, {marginTop: 20}]}>
              <Text style={[CustomStyles.flexText, styles.blackText]}>FSSI</Text>
              <Text style={[CustomStyles.flexText, styles.blackText]}></Text>
            </View>
            <View style={CustomStyles.row}>
              <Text style={[CustomStyles.boldText, styles.blackText]}>{formData.fssi}</Text>
              <Text style={[CustomStyles.boldText, styles.blackText]}></Text>
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
          disabled={!isDelUser}
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
          disabled={!isEditUser}
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

export default ViewUser;

const styles = StyleSheet.create({
  blackText: {
    color: COLORS.black,
  },
});
