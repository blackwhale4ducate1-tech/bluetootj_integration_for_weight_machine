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
import {useVendors} from '../components/VendorsContext';

const Vendors = () => {
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
  } = useVendors();

  const isAddVendor = permissions.find(
    permission => permission.page === 'vendors' && permission.add === 1,
  );

  const getCustomersData = async (company_name, business_category) => {
    try {
      setLoading(true);
      let excludeFields = '';
      if (business_category !== 'FlowerShop') {
        excludeFields += 'createdAt,updatedAt,type,credit_days,regional_name';
      }
      if (business_category === 'FlowerShop') {
        excludeFields +=
          'type,alt_phone_no,email,gstin,state,city,credit_limit,credit_days,createdAt,updatedAt';
      }
      const response = await axios.get(
        `${API_BASE_URL}/api/getCustomers?company_name=${company_name}`,
        {
          params: {
            exclude: excludeFields,
            type: 'vendor',
          },
        },
      );
      // console.log("CustomersData: " + JSON.stringify(response.data));
      let customersData = response.data;

      // Check if the business category is "FlowerShop" and modify the response
      if (business_category === 'FlowerShop') {
        customersData = customersData
          .map(customer => {
            return {
              ...customer,
              debit:
                customer.debit_credit === 'DEBIT'
                  ? customer.opening_balance
                  : '',
              credit:
                customer.debit_credit === 'CREDIT'
                  ? customer.opening_balance
                  : '',
            };
          })
          .map(({opening_balance, debit_credit, ...rest}) => rest); // Remove debit_credit column
      }
      setCustomers(customersData);
      setFilteredCustomers(customersData);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCustomersData(data.company_name, data.business_category);
  }, [data.company_name, data.business_category]);

  useFocusEffect(
    useCallback(() => {
      getCustomersData(data.company_name, data.business_category);
    }, [data.company_name, data.business_category]),
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
          title={
            data.business_category === 'FlowerShop' ? 'Farmers' : 'Vendors'
          }
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
              navigation.navigate('ViewVendor', {id: item.id});
            }}>
            <Card style={{marginVertical: 5, backgroundColor: COLORS.white}}>
              <Card.Title
                title={` ${item.account_code}`}
                titleStyle={CustomStyles.cardTitle}
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
            navigation.navigate('AddEditVendor', {
              type:
                data.business_category === 'FlowerShop'
                  ? 'Add Farmer'
                  : 'Add Vendor',
            });
          }}
          disabled={!isAddVendor}
          style={CustomStyles.bottomButton}>
          <Text>Add</Text>
        </Button>
      </View>
    </View>
  );
};

export default Vendors;

const styles = StyleSheet.create({
  blackText: {
    color: COLORS.black,
  },
});
