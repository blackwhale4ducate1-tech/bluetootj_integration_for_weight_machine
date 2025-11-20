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
import {useProductComposition} from '../components/ProductCompositionContext';

const ViewProductComposition = () => {
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
    editComponents,
    setEditComponents,
    products,
  } = useProductComposition();

  const isEditProductComposition = permissions.find(
    permission =>
      permission.page === 'productComposition' && permission.edit === 1,
  );
  const isDelProductComposition = permissions.find(
    permission =>
      permission.page === 'productComposition' && permission.del === 1,
  );

  const handleCloseModal = useCallback(() => {
    setShowDelModal(false);
  }, []);

  const handleCloseAlertModal = useCallback(() => {
    setShowAlertModal(false);
    navigation.navigate('ProductComposition');
  }, []);

  const getProductById = async id => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${API_BASE_URL}/api/getProductCompositionById?id=${id}&company_name=${data.company_name}`,
      );
      const {parent_id, parent_name, parent_quantity, components} =
        response.data;

      // console.log(
      //   'getProductCompositionById: ' + JSON.stringify(response.data),
      // );

      setFormData({
        ...formData,
        id: id,
        finishedProduct: parent_id,
        finishedProductName: parent_name,
        finishedProductQty: parent_quantity,
      });

      if (components && components.length > 0) {
        const formattedComponents = components.map(comp => ({
          componentProduct: comp.component_id,
          componentProductQty: comp.component_quantity,
          componentProductName: comp.component_name,
        }));
        setEditComponents(formattedComponents);
      } else {
        setEditComponents([]);
      }
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
      navigation.navigate('AddEditProductComposition', {
        type: 'Edit Product Composition',
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
            `${API_BASE_URL}/api/delProductComposition`,
            {
              id: formData.id,
              company_name: data.company_name,
            },
          );
          if (res.data.message) {
            // console.log(res.data.message);
            setAlertMessage('Product Composition deleted successfully');
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
      <ScrollView contentContainerStyle={CustomStyles.scrollViewContent}>
        <Card style={{marginVertical: 10, backgroundColor: COLORS.white}}>
          <Card.Content>
            <View style={CustomStyles.row}>
              <Text style={CustomStyles.flexText}>Parent</Text>
              <Text style={CustomStyles.flexText}>Components</Text>
            </View>
            <View style={CustomStyles.row}>
              <Text style={CustomStyles.boldText}>
                {formData.finishedProductName +
                  `(` +
                  formData.finishedProductQty +
                  `)`}
              </Text>
              <Text style={CustomStyles.boldText}>
                {editComponents
                  .map(
                    comp =>
                      `${comp.componentProductName}(${comp.componentProductQty})`,
                  )
                  .join(', ')}
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
          disabled={!isDelProductComposition}
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
          disabled={!isEditProductComposition}
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

export default ViewProductComposition;

const styles = StyleSheet.create({});
