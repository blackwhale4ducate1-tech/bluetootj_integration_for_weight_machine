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
import {useLedgerGroup} from '../components/LedgerGroupContext';

const LedgerGroup = () => {
  const navigation = useNavigation();
  const {permissions, data} = useAuth();
  const {
    initialFormData,
    loading,
    setLoading,
    formData,
    setFormData,
    ledgerGroupData,
    setLedgerGroupData,
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
  } = useLedgerGroup();

  const isAddLedgerGroup = permissions.find(
    permission => permission.page === 'ledgerGroup' && permission.add === 1,
  );

  const getLedgerGroupData = async company_name => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${API_BASE_URL}/api/getLedgerGroupData?company_name=${company_name}`,
        {
          params: {
            exclude: 'createdAt,updatedAt',
          },
        },
      );
      setLedgerGroupData(response.data);
      setFilteredData(response.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getLedgerGroupData(data.company_name);
  }, [data.company_name]);

  useFocusEffect(
    useCallback(() => {
      getLedgerGroupData(data.company_name);
    }, [data.company_name]),
  );

  useEffect(() => {
    setFilteredData(
      ledgerGroupData.filter(data => {
        const searchValue = searchInput.toLowerCase();
        return data.ledger_group.toLowerCase().includes(searchValue);
      }),
    );
  }, [searchInput, ledgerGroupData]);

  const memoizedLedgerGroupData = useMemo(() => filteredData, [filteredData]);

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
          title="Ledger Group"
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
        data={memoizedLedgerGroupData}
        keyExtractor={item => item.id.toString()}
        renderItem={({item}) => (
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('ViewLedgerGroup', {id: item.id});
            }}>
            <Card style={{marginVertical: 5, backgroundColor: COLORS.white}}>
              <Card.Title
                title={` ${item.ledger_group}`}
                titleStyle={CustomStyles.cardTitle}
                right={props => (
                  <Text {...props} style={CustomStyles.rightText}>
                    {item.account_group}
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
          placeholder="Search by Ledger Group"
          value={searchInput}
          onChangeText={text => setSearchInput(text)}
          style={CustomStyles.searchInput}
          right={<TextInput.Icon icon="magnify" disabled />}></TextInput>
        <Button
          mode="contained"
          onPress={() => {
            setFormData(initialFormData);
            navigation.navigate('AddEditLedgerGroup', {
              type: 'Add Ledger Group',
            });
          }}
          disabled={!isAddLedgerGroup}
          style={CustomStyles.bottomButton}>
          <Text>Add</Text>
        </Button>
      </View>
    </View>
  );
};

export default LedgerGroup;

const styles = StyleSheet.create({});
