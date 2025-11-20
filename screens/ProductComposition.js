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
import {useProductComposition} from '../components/ProductCompositionContext';

const ProductComposition = () => {
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
    editComponents,
    setEditComponents,
  } = useProductComposition();

  const isAddProductComposition = permissions.find(
    permission =>
      permission.page === 'productComposition' && permission.add === 1,
  );

  const getProductCompositionData = async company_name => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/getProductCompositionData?company_name=${company_name}`,
      );
      setProducts(response.data);
      setFilteredProducts(response.data);
      //   console.log(
      //     "getProductCompositionData: " + JSON.stringify(response.data)
      //   );
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getProductCompositionData(data.company_name);
  }, [data.company_name]);

  useFocusEffect(
    useCallback(() => {
      getProductCompositionData(data.company_name);
    }, [data.company_name]),
  );

  useEffect(() => {
    setFilteredProducts(
      products.filter(product => {
        const searchValue = searchInput.toLowerCase();
        return (
          product.parent.toLowerCase().includes(searchValue) ||
          product.components.toLowerCase().includes(searchValue)
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
          title="Product Composition"
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
              navigation.navigate('ViewProductComposition', {id: item.id});
            }}>
            <Card style={{marginVertical: 5, backgroundColor: COLORS.white}}>
              <Card.Title
                title={` ${item.parent}`}
                titleStyle={CustomStyles.cardTitle}
              />
              <Card.Content style={CustomStyles.cardContent}>
                <View style={CustomStyles.row}>
                  <Text style={CustomStyles.flexText}>Components</Text>
                </View>
                <View style={CustomStyles.row}>
                  <Text style={CustomStyles.boldText}>{item.components}</Text>
                </View>
              </Card.Content>
            </Card>
          </TouchableOpacity>
        )}
      />
      <View style={CustomStyles.boottomButtonsContainer}>
        <TextInput
          mode="outlined"
          placeholder="Search by Composition"
          value={searchInput}
          onChangeText={text => setSearchInput(text)}
          style={CustomStyles.searchInput}
          right={<TextInput.Icon icon="magnify" disabled />}></TextInput>
        <Button
          mode="contained"
          onPress={() => {
            setFormData(initialFormData);
            setEditComponents([]);
            navigation.navigate('AddEditProductComposition', {
              type: 'Add Product Composition',
            });
          }}
          disabled={!isAddProductComposition}
          style={CustomStyles.bottomButton}>
          <Text>Add </Text>
        </Button>
      </View>
    </View>
  );
};

export default ProductComposition;

const styles = StyleSheet.create({});
