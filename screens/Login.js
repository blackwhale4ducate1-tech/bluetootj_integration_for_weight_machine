import React, {useState, useEffect} from 'react';
import {View, Text, TouchableOpacity, Image, TextInput} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {COLORS, SIZES, FONTS, icons, images} from '../constants';
import axios from 'axios';
import {useAuth} from '../components/AuthContext';
import {useNavigation} from '@react-navigation/native';
import {API_BASE_URL} from '../config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Checkbox} from 'react-native-paper';

const Login = () => {
  const {login, isAuthenticated} = useAuth();
  const navigation = useNavigation();
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [validationError, setValidationError] = useState('');

  useEffect(() => {
    const loadCredentials = async () => {
      try {
        const savedUsername = await AsyncStorage.getItem('username');
        const savedPassword = await AsyncStorage.getItem('password');
        if (savedUsername && savedPassword) {
          setUsername(savedUsername);
          setPassword(savedPassword);
          setRememberMe(true);
        }
      } catch (error) {
        console.error('Failed to load credentials from storage', error);
      }
    };

    loadCredentials();
  }, []);

  const handleLogin = async () => {
    if (username === '') {
      return setValidationError('Enter Username');
    }
    if (password === '') {
      return setValidationError('Enter Password');
    }
    const response = await axios.post(`${API_BASE_URL}/api/login`, {
      withCredentials: true,
      username: username,
      password: password,
    });
    console.log('response in Login: ' + JSON.stringify(response.data));
    if (response.data.error) {
      setValidationError(response.data.error);
    } else {
      if (rememberMe) {
        await AsyncStorage.setItem('username', username);
        await AsyncStorage.setItem('password', password);
      } else {
        await AsyncStorage.removeItem('username');
        await AsyncStorage.removeItem('password');
      }
      await login(response.data.token);
      // console.log('isAuthenticated in login: ' + isAuthenticated());
      navigation.replace('WelcomeScreen');
    }
  };

  return (
    <LinearGradient colors={[COLORS.lime, COLORS.emerald]} style={{flex: 1}}>
      <View
        style={{
          marginTop: SIZES.padding * 5,
          height: 100,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Image
          source={images.Logo}
          resizeMode="contain"
          style={{
            width: '60%',
          }}
        />
      </View>
      <View
        style={{
          marginTop: SIZES.padding * 3,
          marginHorizontal: SIZES.padding * 3,
        }}>
        {/* Full Name */}
        <View style={{marginTop: SIZES.padding * 3}}>
          <Text style={{color: COLORS.lightGreen, ...FONTS.body3}}>
            Username
          </Text>
          <TextInput
            style={{
              marginVertical: SIZES.padding,
              borderBottomColor: COLORS.white,
              borderBottomWidth: 1,
              height: 40,
              color: COLORS.white,
              ...FONTS.body3,
            }}
            placeholder="Enter Full Name"
            placeholderTextColor={COLORS.white}
            selectionColor={COLORS.white}
            value={username}
            onChangeText={text => setUsername(text)}
          />
        </View>

        {/* Password */}
        <View style={{marginTop: SIZES.padding * 2}}>
          <Text style={{color: COLORS.lightGreen, ...FONTS.body3}}>
            Password
          </Text>
          <TextInput
            style={{
              marginVertical: SIZES.padding,
              borderBottomColor: COLORS.white,
              borderBottomWidth: 1,
              height: 40,
              color: COLORS.white,
              ...FONTS.body3,
            }}
            placeholder="Enter Password"
            placeholderTextColor={COLORS.white}
            selectionColor={COLORS.white}
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={text => setPassword(text)}
          />
          <TouchableOpacity
            style={{
              position: 'absolute',
              right: 0,
              bottom: 10,
              height: 30,
              width: 30,
            }}
            onPress={() => setShowPassword(!showPassword)}>
            <Image
              source={showPassword ? icons.disable_eye : icons.eye}
              style={{
                height: 20,
                width: 20,
                tintColor: COLORS.white,
              }}
            />
          </TouchableOpacity>
        </View>
        {/* Remember Me */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: SIZES.padding * 2,
          }}>
          <Checkbox
            status={rememberMe ? 'checked' : 'unchecked'}
            onPress={() => setRememberMe(!rememberMe)}
            color={COLORS.lightGreen}
          />
          <Text
            style={{
              color: COLORS.lightGreen,
              ...FONTS.body3,
              marginLeft: SIZES.padding,
            }}>
            Remember Me
          </Text>
        </View>
        <View>
          <Text style={{color: COLORS.red}}>{validationError}</Text>
        </View>
        <View style={{margin: SIZES.padding * 3}}>
          <TouchableOpacity
            onPress={handleLogin}
            style={{
              height: 60,
              backgroundColor: COLORS.black,
              borderRadius: SIZES.radius / 1.5,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text style={{color: COLORS.white, ...FONTS.h3}}>Continue</Text>
          </TouchableOpacity>
        </View>
        <View>
          <TouchableOpacity
            style={{alignItems: 'center', justifyContent: 'center'}}
            onPress={() => navigation.navigate('Register')}>
            <Text style={{color: COLORS.white, ...FONTS.h4}}>Signup</Text>
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
};

export default Login;
