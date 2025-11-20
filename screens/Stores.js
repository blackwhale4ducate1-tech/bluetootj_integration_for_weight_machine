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
import {useStores} from '../components/StoresContext';

const Stores = () => {
  const navigation = useNavigation();
  const {permissions, data} = useAuth();
  const {
    initialFormData,
    loading,
    setLoading,
    formData,
    setFormData,
    stores,
    setStores,
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
  } = useStores();

  const isAddStore = permissions.find(
    permission => permission.page === 'stores' && permission.add === 1,
  );

  const getStoresData = async company_name => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${API_BASE_URL}/api/getStoresData?company_name=${company_name}`,
        {
          params: {
            exclude: 'createdAt,updatedAt',
          },
        },
      );
      // console.log("response: " + JSON.stringify(response.data));
      setStores(response.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getStoresData(data.company_name);
  }, [data.company_name]);

  useFocusEffect(
    useCallback(() => {
      getStoresData(data.company_name);
    }, [data.company_name]),
  );

  const memoizedStores = useMemo(() => stores, [stores]);

  return (
    <View style={CustomStyles.safeContainer}>
      <Appbar.Header style={CustomStyles.appHeader}>
        <Appbar.BackAction
          onPress={() => {
            navigation.goBack();
          }}
          color={COLORS.white}
        />
        <Appbar.Content title="Stores" titleStyle={CustomStyles.titleStyle} />
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
        data={memoizedStores}
        keyExtractor={item => item.id.toString()}
        renderItem={({item}) => (
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('ViewStore', {id: item.id});
            }}>
            <Card style={{marginVertical: 5, backgroundColor: COLORS.white}}>
              <Card.Title
                title={` ${item.store_name}`}
                titleStyle={CustomStyles.cardTitle}
              />
            </Card>
          </TouchableOpacity>
        )}
      />
      <View style={CustomStyles.boottomButtonsContainer}>
        <Button
          mode="contained"
          onPress={() => {
            setFormData(initialFormData);
            navigation.navigate('AddEditStore', {
              type: 'Add Store',
            });
          }}
          disabled={!isAddStore}
          style={[CustomStyles.bottomButton, {flex: 1}]}>
          <Text>Add Store</Text>
        </Button>
      </View>
    </View>
  );
};

export default Stores;

const styles = StyleSheet.create({});
