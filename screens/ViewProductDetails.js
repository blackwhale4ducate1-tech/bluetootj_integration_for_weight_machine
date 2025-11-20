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
import {useProductDetails} from '../components/ProductDetailsContext';

const ViewProductDetails = () => {
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
  } = useProductDetails();

  const isEditProductDetails = permissions.find(
    permission => permission.page === 'productDetails' && permission.edit === 1,
  );
  const isDelProductDetails = permissions.find(
    permission => permission.page === 'productDetails' && permission.del === 1,
  );

  const handleCloseModal = useCallback(() => {
    setShowDelModal(false);
  }, []);

  const handleCloseAlertModal = useCallback(() => {
    setShowAlertModal(false);
    navigation.navigate('ProductDetails');
  }, []);

  const getProductById = async id => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${API_BASE_URL}/api/getProductDetailById?id=${id}&company_name=${data.company_name}`,
      );
      setFormData({
        ...formData,
        id: response.data.id,
        productCategoryId: response.data.product_category_id,
        productName: response.data.product_name,
        productCode: response.data.product_code,
        hsnCode: response.data.hsn_code,
        rol: response.data.rol,
        igst: response.data.igst,
        sgst: response.data.sgst,
        cgst: response.data.cgst,
        purchasePrice: response.data.purchase_price,
        salesPrice: response.data.sales_price,
        mrp: response.data.mrp,
        purchaseInclusive: response.data.purchase_inclusive,
        salesInclusive: response.data.sales_inclusive,
        expiryDate: response.data.expiry_date,
        unit: response.data.unit,
        alt_unit: response.data.alt_unit,
        uc_factor: response.data.uc_factor,
        discountP: response.data.discountP,
        remarks: response.data.remarks,
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
      getProductById(id);
      navigation.navigate('AddEditProductDetails', {
        type: 'Edit Product Details',
      });
    },
    [formData, data.company_name],
  );

  useFocusEffect(
    useCallback(() => {
      getProductById(id);
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
          const res = await axios.post(
            `${API_BASE_URL}/api/delProductDetails`,
            {
              id: formData.id,
              company_name: data.company_name,
            },
          );
          if (res.data.message) {
            // console.log(res.data.message);
            setAlertMessage('Product Details deleted successfully');
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
      <ScrollView contentContainerStyle={CustomStyles.scrollViewContent}>
        <Card style={{marginVertical: 10, backgroundColor: COLORS.white}}>
          <Card.Content>
            <View style={CustomStyles.row}>
              <Text style={[CustomStyles.flexText, styles.blackText]}>Product Code</Text>
              <Text style={[CustomStyles.flexText, styles.blackText]}>Product Name</Text>
              <Text style={[CustomStyles.flexText, styles.blackText]}>Product Category</Text>
            </View>
            <View style={CustomStyles.row}>
              <Text style={[CustomStyles.boldText, styles.blackText]}>{formData.productCode}</Text>
              <Text style={[CustomStyles.boldText, styles.blackText]}>{formData.productName}</Text>
              <Text style={[CustomStyles.boldText, styles.blackText]}>
                {formData.productCategoryId?.label || ''}
              </Text>
            </View>
            <View style={[CustomStyles.row, {marginTop: 20}]}>
              <Text style={[CustomStyles.flexText, styles.blackText]}>HSN Code</Text>
              <Text style={[CustomStyles.flexText, styles.blackText]}>ROL</Text>
              <Text style={[CustomStyles.flexText, styles.blackText]}>Expiry Date</Text>
            </View>
            <View style={CustomStyles.row}>
              <Text style={[CustomStyles.boldText, styles.blackText]}>{formData.hsnCode}</Text>
              <Text style={[CustomStyles.boldText, styles.blackText]}>{formData.rol}</Text>
              <Text style={[CustomStyles.boldText, styles.blackText]}>{formData.expiryDate}</Text>
            </View>
            <View style={[CustomStyles.row, {marginTop: 20}]}>
              <Text style={[CustomStyles.flexText, styles.blackText]}>IGST</Text>
              <Text style={[CustomStyles.flexText, styles.blackText]}>SGST</Text>
              <Text style={[CustomStyles.flexText, styles.blackText]}>CGST</Text>
            </View>
            <View style={CustomStyles.row}>
              <Text style={[CustomStyles.boldText, styles.blackText]}>{formData.igst}</Text>
              <Text style={[CustomStyles.boldText, styles.blackText]}>{formData.sgst}</Text>
              <Text style={[CustomStyles.boldText, styles.blackText]}>{formData.cgst}</Text>
            </View>
            <View style={[CustomStyles.row, {marginTop: 20}]}>
              <Text style={[CustomStyles.flexText, styles.blackText]}>Purchase Price</Text>
              <Text style={[CustomStyles.flexText, styles.blackText]}>Sales Price</Text>
              <Text style={[CustomStyles.flexText, styles.blackText]}>MRP</Text>
            </View>
            <View style={CustomStyles.row}>
              <Text style={[CustomStyles.boldText, styles.blackText]}>
                {formData.purchasePrice}
              </Text>
              <Text style={[CustomStyles.boldText, styles.blackText]}>{formData.salesPrice}</Text>
              <Text style={[CustomStyles.boldText, styles.blackText]}>{formData.mrp}</Text>
            </View>
            <View style={[CustomStyles.row, {marginTop: 20}]}>
              <Text style={[CustomStyles.flexText, styles.blackText]}>Unit</Text>
              <Text style={[CustomStyles.flexText, styles.blackText]}>Alt Unit</Text>
              <Text style={[CustomStyles.flexText, styles.blackText]}>UC Factor</Text>
            </View>
            <View style={CustomStyles.row}>
              <Text style={[CustomStyles.boldText, styles.blackText]}>{formData.unit}</Text>
              <Text style={[CustomStyles.boldText, styles.blackText]}>{formData.alt_unit}</Text>
              <Text style={[CustomStyles.boldText, styles.blackText]}>{formData.uc_factor}</Text>
            </View>
            <View style={[CustomStyles.row, {marginTop: 20}]}>
              <Text style={[CustomStyles.flexText, styles.blackText]}>Purchase Inclusive</Text>
              <Text style={[CustomStyles.flexText, styles.blackText]}>Sales Inclusive</Text>
            </View>
            <View style={CustomStyles.row}>
              <Text style={[CustomStyles.boldText, styles.blackText]}>
                {formData.purchaseInclusive === 1 ? 'yes' : 'no'}
              </Text>
              <Text style={[CustomStyles.boldText, styles.blackText]}>
                {formData.salesInclusive === 1 ? 'yes' : 'no'}
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
          disabled={!isDelProductDetails}
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
          disabled={!isEditProductDetails}
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

export default ViewProductDetails;

const styles = StyleSheet.create({
  blackText: {
    color: COLORS.black,
  },
});
