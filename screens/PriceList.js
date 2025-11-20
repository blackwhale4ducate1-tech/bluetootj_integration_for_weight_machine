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
import {usePriceList} from '../components/PriceListContext';

const PriceList = () => {
  const navigation = useNavigation();
  const {permissions, data} = useAuth();
  const {
    initialFormData,
    loading,
    setLoading,
    formData,
    setFormData,
    priceLists,
    setPriceLists,
    filteredPriceLists,
    setFilteredPriceLists,
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
  } = usePriceList();

  const isAddPriceList = permissions.find(
    permission => permission.page === 'priceList' && permission.add === 1,
  );

  const getPriceListData = async company_name => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${API_BASE_URL}/api/getPriceLists?company_name=${company_name}`,
        {
          params: {
            exclude: 'createdAt,updatedAt,column_type,model_name',
          },
        },
      );
      setPriceLists(response.data);
      setFilteredPriceLists(response.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getPriceListData(data.company_name);
  }, [data.company_name]);

  useFocusEffect(
    useCallback(() => {
      getPriceListData(data.company_name);
    }, [data.company_name]),
  );

  useEffect(() => {
    setFilteredPriceLists(
      priceLists.filter(product => {
        const searchValue = searchInput.toLowerCase();
        return product.column_name.toLowerCase().includes(searchValue);
      }),
    );
  }, [searchInput, priceLists]);

  const memoizedPriceLists = useMemo(
    () => filteredPriceLists,
    [filteredPriceLists],
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
          title="Price Lists"
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
        data={memoizedPriceLists}
        keyExtractor={item => item.id.toString()}
        renderItem={({item}) => (
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('ViewPriceList', {id: item.id});
            }}>
            <Card style={{marginVertical: 5, backgroundColor: COLORS.white}}>
              <Card.Title
                title={` ${item.column_name}`}
                titleStyle={CustomStyles.cardTitle}
                right={props => (
                  <Text {...props} style={CustomStyles.rightText}>
                    {item.column_type}
                  </Text>
                )}
              />
            </Card>
          </TouchableOpacity>
        )}
      />
      <View style={CustomStyles.boottomButtonsContainer}>
        <TextInput
          mode="outlined"
          placeholder="Search by Column Name"
          value={searchInput}
          onChangeText={text => setSearchInput(text)}
          style={CustomStyles.searchInput}
          right={<TextInput.Icon icon="magnify" disabled />}></TextInput>
        <Button
          mode="contained"
          onPress={() => {
            setFormData(initialFormData);
            navigation.navigate('AddEditPriceList', {
              type: 'Add Price List',
            });
          }}
          disabled={!isAddPriceList}
          style={CustomStyles.bottomButton}>
          <Text>Add </Text>
        </Button>
      </View>
    </View>
  );
};

export default PriceList;

const styles = StyleSheet.create({});
