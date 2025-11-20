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
import {useRoles} from '../components/RolesContext';

const Roles = () => {
  const navigation = useNavigation();
  const {permissions, data} = useAuth();
  const {
    initialFormData,
    loading,
    setLoading,
    formData,
    setFormData,
    roles,
    setRoles,
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
  } = useRoles();

  const isAddRole = permissions.find(
    permission => permission.page === 'roles' && permission.add === 1,
  );

  const getRolesData = async company_name => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/getRoles?company_name=${company_name}`,
      );
      setRoles(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getRolesData(data.company_name);
  }, [data.company_name]);

  useFocusEffect(
    useCallback(() => {
      getRolesData(data.company_name);
    }, [data.company_name]),
  );

  const memoizedRoles = useMemo(() => roles, [roles]);

  return (
    <View style={CustomStyles.safeContainer}>
      <Appbar.Header style={CustomStyles.appHeader}>
        <Appbar.BackAction
          onPress={() => {
            navigation.goBack();
          }}
          color={COLORS.white}
        />
        <Appbar.Content title="Roles" titleStyle={CustomStyles.titleStyle} />
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
        data={memoizedRoles}
        keyExtractor={item => item.id.toString()}
        renderItem={({item}) => (
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('ViewRole', {id: item.id});
            }}>
            <Card style={{marginVertical: 5, backgroundColor: COLORS.white}}>
              <Card.Title
                title={` ${item.role}`}
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
            navigation.navigate('AddEditRole', {
              type: 'Add Role',
            });
          }}
          disabled={!isAddRole}
          style={[CustomStyles.bottomButton, {flex: 1}]}>
          <Text>Add Role</Text>
        </Button>
      </View>
    </View>
  );
};

export default Roles;

const styles = StyleSheet.create({});
