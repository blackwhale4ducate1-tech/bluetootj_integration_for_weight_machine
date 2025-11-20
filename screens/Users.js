import {
  StyleSheet,
  Text,
  View,
  Modal,
  TouchableOpacity,
  ScrollView,
  FlatList,
} from 'react-native';
import React, {useState, useEffect, useCallback, useMemo} from 'react';
import {Appbar, Card, ActivityIndicator, Button} from 'react-native-paper';
import {COLORS} from '../constants';
import CustomStyles from '../components/AddEditModalStyles';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import axios from 'axios';
import {API_BASE_URL} from '../config';
import {useAuth} from '../components/AuthContext';
import {useUsers} from '../components/UsersContext';

const Users = () => {
  const navigation = useNavigation();
  const {permissions, data} = useAuth();
  const {
    initialFormData,
    loading,
    setLoading,
    formData,
    setFormData,
    users,
    setUsers,
    showModal,
    setShowModal,
    modalTitle,
    setModalTitle,
    showDelModal,
    setShowDelModal,
    showAlertModal,
    setShowAlertModal,
    alertMessage,
    setAlertMessage,
  } = useUsers();

  const isAddUser = permissions.find(
    permission => permission.page === 'users' && permission.add === 1,
  );

  const getUsersData = async company_name => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/getUsers?company_name=${company_name}`,
        {
          params: {
            exclude:
              'company_name,company_full_name,image_name,qr_image_name,purchase_mop,sales_mop,estimate_mop,purchase_invoice_type,sales_invoice_type,estimate_invoice_type,estimate_accounts_add_status,is_barcode_exist,negative_stock,itemwise_tax,commission_input,isUnitExistInInvoice,isSalesPersonExistInInvoice,isDescriptionExistInInvoice,isBarcodeExistInInvoice,isBarcodeSummarizeItemAllowInInvoice,estimate_invoice_header_address,declaration,declaration_height,a4_item_count,a5_item_count,default_store,fy_start_date,fy_end_date,premium,registration_time,last_login_time,expiration_time',
          },
        },
      );
      const filteredUsers = response.data.filter(
        user => user.username !== 'admin',
      );

      setUsers(filteredUsers);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUsersData(data.company_name);
  }, [data.company_name]);

  useFocusEffect(
    useCallback(() => {
      getUsersData(data.company_name);
    }, [data.company_name]),
  );

  const memoizedUsers = useMemo(() => users, [users]);

  return (
    <View style={CustomStyles.safeContainer}>
      <Appbar.Header style={CustomStyles.appHeader}>
        <Appbar.BackAction
          onPress={() => {
            navigation.goBack();
          }}
          color={COLORS.white}
        />
        <Appbar.Content title="Users" titleStyle={CustomStyles.titleStyle} />
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
      <FlatList
        contentContainerStyle={CustomStyles.scrollViewContent}
        data={memoizedUsers}
        keyExtractor={item => item.id.toString()}
        renderItem={({item, index}) => (
          <TouchableOpacity
            key={index}
            onPress={() => {
              navigation.navigate('ViewUser', {id: item.id});
            }}>
            <Card style={{marginVertical: 5, backgroundColor: COLORS.white}}>
              <Card.Title
                title={` ${item.username}`}
                titleStyle={CustomStyles.cardTitle}
                right={props => (
                  <Text {...props} style={CustomStyles.rightText}>
                    {item.role}
                  </Text>
                )}
              />
              <Card.Content style={CustomStyles.cardContent}>
                <View style={CustomStyles.row}>
                  <Text style={[CustomStyles.flexText, styles.blackText]}>Email</Text>
                  <Text style={[CustomStyles.flexText, styles.blackText]}>Phone No</Text>
                </View>
                <View style={CustomStyles.row}>
                  <Text style={[CustomStyles.boldText, styles.blackText]}>{item.email}</Text>
                  <Text style={[CustomStyles.boldText, styles.blackText]}>{item.phone_no}</Text>
                </View>
              </Card.Content>
            </Card>
          </TouchableOpacity>
        )}
      />
      <View style={CustomStyles.boottomButtonsContainer}>
        <Button
          mode="contained"
          onPress={() => {
            setFormData(initialFormData);
            navigation.navigate('AddEditUser', {
              type: 'Add User',
            });
          }}
          disabled={!isAddUser}
          style={[CustomStyles.bottomButton, {flex: 1}]}>
          <Text>Add User</Text>
        </Button>
      </View>
    </View>
  );
};

export default Users;

const styles = StyleSheet.create({
  blackText: {
    color: COLORS.black,
  },
});
