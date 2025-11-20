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
import {
  Appbar,
  Card,
  ActivityIndicator,
  Button,
  TextInput,
} from 'react-native-paper';
import {COLORS} from '../constants';
import CustomStyles from '../components/AddEditModalStyles';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import axios from 'axios';
import {API_BASE_URL} from '../config';
import {useAuth} from '../components/AuthContext';
import {useCustomers} from '../components/CustomersContext';

const Customers = () => {
  const navigation = useNavigation();
  const {permissions, data} = useAuth();
  const {
    initialFormData,
    loading,
    setLoading,
    formData,
    setFormData,
    customers,
    setCustomers,
    filteredCustomers,
    setFilteredCustomers,
    searchInput,
    setSearchInput,
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
  } = useCustomers();

  const isAddCustomer = permissions.find(
    permission => permission.page === 'customers' && permission.add === 1,
  );

  const getCustomersData = async (company_name, tax_type) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${API_BASE_URL}/api/getCustomers?company_name=${company_name}`,
        {
          params: {
            exclude: 'createdAt,updatedAt,type,credit_days,regional_name',
            type: 'client',
          },
        },
      );
      // console.log("CustomersData: " + JSON.stringify(response.data));
      if (tax_type === 'VAT') {
        const modifiedCustomers = response.data.map(customer => {
          const {gstin, ...filteredProduct} = customer;
          return {
            ...filteredProduct,
            trn: gstin,
          };
        });
        setCustomers(modifiedCustomers);
        setFilteredCustomers(modifiedCustomers);
      } else {
        setCustomers(response.data);
        setFilteredCustomers(response.data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCustomersData(data.company_name, data.tax_type);
  }, [data.company_name, data.tax_type]);

  useFocusEffect(
    useCallback(() => {
      getCustomersData(data.company_name, data.tax_type);
    }, [data.company_name, data.tax_type]),
  );

  useEffect(() => {
    setFilteredCustomers(
      customers.filter(customer => {
        const searchValue = searchInput.toLowerCase();
        return (
          customer.name.toLowerCase().includes(searchValue) ||
          customer.account_code.toLowerCase().includes(searchValue) ||
          customer.phone_no.toString().includes(searchValue) ||
          customer.alt_phone_no.toString().includes(searchValue)
        );
      }),
    );
  }, [searchInput, customers]);

  const memoizedCustomers = useMemo(
    () => filteredCustomers,
    [filteredCustomers],
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
          title="Customers"
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
      <FlatList
        contentContainerStyle={CustomStyles.scrollViewContent}
        data={memoizedCustomers}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item}) => (
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('ViewCustomer', {id: item.id});
            }}>
            <Card style={{marginVertical: 5, backgroundColor: COLORS.white}}>
              <Card.Title
                title={` ${item.account_code}`}
                titleStyle={[CustomStyles.cardTitle, styles.blackText]}
              />
              <Card.Content>
                <View style={CustomStyles.row}>
                  <Text style={[CustomStyles.flexText, styles.blackText]}>Name</Text>
                  <Text style={[CustomStyles.flexText, styles.blackText]}>Phone No</Text>
                </View>
                <View style={CustomStyles.row}>
                  <Text style={[CustomStyles.boldText, styles.blackText]}>{item.name}</Text>
                  <Text style={[CustomStyles.boldText, styles.blackText]}>{item.phone_no}</Text>
                </View>
              </Card.Content>
            </Card>
          </TouchableOpacity>
        )}
      />
      <View style={CustomStyles.boottomButtonsContainer}>
        <TextInput
          mode="outlined"
          placeholder="Search by name/account_code/phone_no/alt_phone_no"
          value={searchInput}
          onChangeText={text => setSearchInput(text)}
          style={CustomStyles.searchInput}
          right={<TextInput.Icon icon="magnify" disabled />}></TextInput>
        <Button
          mode="contained"
          onPress={() => {
            setFormData(initialFormData);
            navigation.navigate('AddEditCustomer', {
              type: 'Add Customer',
            });
          }}
          disabled={!isAddCustomer}
          style={CustomStyles.bottomButton}>
          <Text>Add Customer</Text>
        </Button>
      </View>
    </View>
  );
};

export default Customers;

const styles = StyleSheet.create({
  blackText: {
    color: COLORS.black,
  },
});
