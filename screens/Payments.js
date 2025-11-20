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
import {usePayments} from '../components/PaymentsContext';

const Payments = () => {
  const navigation = useNavigation();
  const {permissions, data} = useAuth();
  const {
    initialFormData,
    loading,
    setLoading,
    formData,
    setFormData,
    payments,
    setPayments,
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
  } = usePayments();

  const isAddPayment = permissions.find(
    permission => permission.page === 'payments' && permission.add === 1,
  );

  const getPaymentsData = async company_name => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${API_BASE_URL}/api/getPaymentsData?company_name=${company_name}`,
        {
          params: {
            exclude: 'createdAt,updatedAt',
          },
        },
      );
      setPayments(response.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getPaymentsData(data.company_name);
  }, [data.company_name]);

  useFocusEffect(
    useCallback(() => {
      getPaymentsData(data.company_name);
    }, [data.company_name]),
  );

  const memoizedPayments = useMemo(() => payments, [payments]);

  return (
    <View style={CustomStyles.safeContainer}>
      <Appbar.Header style={CustomStyles.appHeader}>
        <Appbar.BackAction
          onPress={() => {
            navigation.goBack();
          }}
          color={COLORS.white}
        />
        <Appbar.Content title="Payments" titleStyle={CustomStyles.titleStyle} />
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
        data={memoizedPayments}
        keyExtractor={item => item.id.toString()}
        renderItem={({item}) => (
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('ViewPayment', {id: item.id});
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
                  <Text style={CustomStyles.flexText}>Mode of Payment</Text>
                  <Text style={CustomStyles.flexText}>Ledger</Text>
                  <Text style={CustomStyles.flexText}>Amount</Text>
                </View>
                <View style={CustomStyles.row}>
                  <Text style={CustomStyles.boldText}>{item.mop}</Text>
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
            navigation.navigate('AddEditPayment', {
              type: 'Add Payment',
            });
          }}
          disabled={!isAddPayment}
          style={[CustomStyles.bottomButton, {flex: 1}]}>
          <Text>Add </Text>
        </Button>
      </View>
    </View>
  );
};

export default Payments;

const styles = StyleSheet.create({});
