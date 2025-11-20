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
import {useProductDetails} from '../components/ProductDetailsContext';

const ProductDetails = () => {
  const navigation = useNavigation();
  const {permissions, data} = useAuth();
  const {
    initialFormData,
    loading,
    setLoading,
    formData,
    setFormData,
    products,
    setProducts,
    filteredProducts,
    setFilteredProducts,
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
  } = useProductDetails();

  const isAddProductDetails = permissions.find(
    permission => permission.page === 'productDetails' && permission.add === 1,
  );

  const getProductDetailsData = async (
    company_name,
    business_category,
    tax_type,
  ) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/getProductDetails?company_name=${company_name}&business_category=${business_category}`,
      );
      if (tax_type === 'VAT') {
        // Filter out sgst and cgst, and rename igst to vat
        const modifiedProducts = response.data.map(product => {
          const {sgst, cgst, igst, expiry_date, hsn_code, ...filteredProduct} =
            product; // Remove sgst and cgst
          return {
            ...filteredProduct,
            vat: igst, // Rename igst to vat
          };
        });
        setProducts(modifiedProducts);
        setFilteredProducts(modifiedProducts);
      } else {
        setProducts(response.data);
        setFilteredProducts(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getProductDetailsData(
      data.company_name,
      data.business_category,
      data.tax_type,
    );
  }, [data.company_name, data.business_category, data.tax_type]);

  useFocusEffect(
    useCallback(() => {
      getProductDetailsData(
        data.company_name,
        data.business_category,
        data.tax_type,
      );
    }, [data.company_name, data.business_category, data.tax_type]),
  );

  useEffect(() => {
    setFilteredProducts(
      products.filter(product => {
        const searchValue = searchInput.toLowerCase();
        return (
          product.product_name.toLowerCase().includes(searchValue) ||
          product.product_code.toLowerCase().includes(searchValue)
        );
      }),
    );
  }, [searchInput, products]);

  const memoizedProducts = useMemo(() => filteredProducts, [filteredProducts]);

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
          title="Product Details"
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
        data={memoizedProducts}
        keyExtractor={item => item.id.toString()}
        renderItem={({item}) => (
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('ViewProductDetails', {id: item.id});
            }}>
            <Card style={{marginVertical: 5, backgroundColor: COLORS.white}}>
              <Card.Title
                title={` ${item.product_code}`}
                titleStyle={[CustomStyles.cardTitle, styles.blackText]}
                right={props => (
                  <Text {...props} style={[CustomStyles.rightText, styles.blackText]}>
                    {item.product_category}
                  </Text>
                )}
              />
              <Card.Content style={CustomStyles.cardContent}>
                <View style={CustomStyles.row}>
                  <Text style={[CustomStyles.flexText, styles.blackText]}>purchase price</Text>
                  <Text style={[CustomStyles.flexText, styles.blackText]}>Sales price</Text>
                </View>
                <View style={CustomStyles.row}>
                  <Text style={[CustomStyles.boldText, styles.blackText]}>
                    {item.purchase_price}
                  </Text>
                  <Text style={[CustomStyles.boldText, styles.blackText]}>{item.sales_price}</Text>
                </View>
              </Card.Content>
            </Card>
          </TouchableOpacity>
        )}
      />
      <View style={CustomStyles.boottomButtonsContainer}>
        <TextInput
          mode="outlined"
          placeholder="Search by Product Name/Product Code"
          value={searchInput}
          onChangeText={text => setSearchInput(text)}
          style={CustomStyles.searchInput}
          right={<TextInput.Icon icon="magnify" disabled />}></TextInput>
        <Button
          mode="contained"
          onPress={() => {
            setFormData(initialFormData);
            navigation.navigate('AddEditProductDetails', {
              type: 'Add Product Details',
            });
          }}
          disabled={
            !(
              isAddProductDetails &&
              (data.business_category !== 'FlowerShop' ||
                (data.business_category === 'FlowerShop' &&
                  products.length < 1))
            )
          }
          style={CustomStyles.bottomButton}>
          <Text style={styles.blackText}>Add </Text>
        </Button>
      </View>
    </View>
  );
};

export default ProductDetails;

const styles = StyleSheet.create({
  blackText: {
    color: COLORS.black,
  },
});
