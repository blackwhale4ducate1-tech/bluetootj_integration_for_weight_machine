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
import {useReceipts} from '../components/ReceiptsContext';

const Receipts = () => {
  const navigation = useNavigation();
  const {permissions, data} = useAuth();
  const {
    initialFormData,
    loading,
    setLoading,
    formData,
    setFormData,
    receipts,
    setReceipts,
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
  } = useReceipts();

  const isAddReceipt = permissions.find(
    permission => permission.page === 'receipts' && permission.add === 1,
  );

  const getReceiptsData = async company_name => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${API_BASE_URL}/api/getReceiptsData?company_name=${company_name}`,
        {
          params: {
            exclude: 'createdAt,updatedAt',
          },
        },
      );
      setReceipts(response.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getReceiptsData(data.company_name);
  }, [data.company_name]);

  useFocusEffect(
    useCallback(() => {
      getReceiptsData(data.company_name);
    }, [data.company_name]),
  );

  const memoizedReceipts = useMemo(() => receipts, [receipts]);

  return (
    <View style={CustomStyles.safeContainer}>
      <Appbar.Header style={CustomStyles.appHeader}>
        <Appbar.BackAction
          onPress={() => {
            navigation.goBack();
          }}
          color={COLORS.white}
        />
        <Appbar.Content title="Receipts" titleStyle={CustomStyles.titleStyle} />
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
        data={memoizedReceipts}
        keyExtractor={item => item.id.toString()}
        renderItem={({item}) => (
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('ViewReceipt', {id: item.id});
            }}>
            <Card style={{marginVertical: 5, backgroundColor: COLORS.white}}>
              <Card.Title
                title={` ${item.invoice_no}`}
                titleStyle={CustomStyles.cardTitle}
                right={props => (
                  <Text {...props} style={CustomStyles.rightText}>
                    {item.invoice_date}
                  </Text>
                )}
              />
              <Card.Content style={CustomStyles.cardContent}>
                <View style={CustomStyles.row}>
                  <Text style={CustomStyles.flexText}>Mode of Receive</Text>
                  <Text style={CustomStyles.flexText}>Ledger</Text>
                  <Text style={CustomStyles.flexText}>Amount</Text>
                </View>
                <View style={CustomStyles.row}>
                  <Text style={CustomStyles.boldText}>{item.mor}</Text>
                  <Text style={CustomStyles.boldText}>{item.ledger}</Text>
                  <Text style={CustomStyles.boldText}>{item.amount}</Text>
                </View>
              </Card.Content>
            </Card>
          </TouchableOpacity>
        )}
      />
      <View style={CustomStyles.boottomButtonsContainer}>
        <Button
          mode="contained"
          onPress={() => {
            setFormData(initialFormData);
            navigation.navigate('AddEditReceipt', {
              type: 'Add Receipt',
            });
          }}
          disabled={!isAddReceipt}
          style={[CustomStyles.bottomButton, {flex: 1}]}>
          <Text>Add </Text>
        </Button>
      </View>
    </View>
  );
};

export default Receipts;

const styles = StyleSheet.create({});
