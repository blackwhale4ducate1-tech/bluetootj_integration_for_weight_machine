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
import {useAccountGroup} from '../components/AccountGroupContext';

const AccountGroup = () => {
  const navigation = useNavigation();
  const {permissions, data} = useAuth();
  const {
    initialFormData,
    loading,
    setLoading,
    formData,
    setFormData,
    accountGroupData,
    setAccountGroupData,
    filteredData,
    setFilteredData,
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
  } = useAccountGroup();

  const isAddAccountGroup = permissions.find(
    permission => permission.page === 'accountGroup' && permission.add === 1,
  );

  const getAccountGroupData = async company_name => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/getAccountGroupData?company_name=${company_name}`,
        {
          params: {
            exclude: 'createdAt,updatedAt',
          },
        },
      );
      setAccountGroupData(response.data);
      setFilteredData(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAccountGroupData(data.company_name);
  }, [data.company_name]);

  useFocusEffect(
    useCallback(() => {
      getAccountGroupData(data.company_name);
    }, [data.company_name]),
  );

  useEffect(() => {
    setFilteredData(
      accountGroupData.filter(data => {
        const searchValue = searchInput.toLowerCase();
        return (
          data.account_group.toLowerCase().includes(searchValue) ||
          data.base_group.toLowerCase().includes(searchValue)
        );
      }),
    );
  }, [searchInput, accountGroupData]);

  const memoizedAccountGroupData = useMemo(() => filteredData, [filteredData]);

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
          title="Account Group"
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
        data={memoizedAccountGroupData}
        keyExtractor={item => item.id.toString()}
        renderItem={({item}) => (
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('ViewAccountGroup', {id: item.id});
            }}>
            <Card style={{marginVertical: 5, backgroundColor: COLORS.white}}>
              <Card.Title
                title={` ${item.account_group}`}
                titleStyle={CustomStyles.cardTitle}
              />
            </Card>
          </TouchableOpacity>
        )}
      />
      <View style={CustomStyles.boottomButtonsContainer}>
        <TextInput
          mode="outlined"
          placeholder="Search by Account Group"
          value={searchInput}
          onChangeText={text => setSearchInput(text)}
          style={CustomStyles.searchInput}
          right={<TextInput.Icon icon="magnify" disabled />}></TextInput>
        <Button
          mode="contained"
          onPress={() => {
            setFormData(initialFormData);
            navigation.navigate('AddEditAccountGroup', {
              type: 'Add Account Group',
            });
          }}
          disabled={!isAddAccountGroup}
          style={CustomStyles.bottomButton}>
          <Text>Add</Text>
        </Button>
      </View>
    </View>
  );
};

export default AccountGroup;

const styles = StyleSheet.create({});
