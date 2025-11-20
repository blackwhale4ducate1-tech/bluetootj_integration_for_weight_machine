import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useEffect} from 'react';
import {useAuth} from '../components/AuthContext';
import {useNavigation} from '@react-navigation/native';

const Logout = () => {
  const navigation = useNavigation();
  const {logout} = useAuth();
  useEffect(() => {
    logout();
    navigation.navigate('Login');
  }, []);

  return (
    <View>
      <TouchableOpacity>
      <Text>Logout</Text>
      </TouchableOpacity>

    </View>
  );
};

export default Logout;

const styles = StyleSheet.create({});
