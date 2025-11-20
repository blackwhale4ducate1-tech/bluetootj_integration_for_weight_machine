import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  Dimensions,
  Image,
  TouchableOpacity,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useFocusEffect} from '@react-navigation/native';
import {useAuth} from '../components/AuthContext';
import {COLORS, FONTS, images} from '../constants';

const {width, height} = Dimensions.get('screen');

const WelcomeScreen = () => {
  const {isAuthenticated, jwt} = useAuth();
  console.log('isAuthenticated in WelcomeScreen: ' + isAuthenticated());
  const navigation = useNavigation();

  const handleGetStarted = () => {
    if (isAuthenticated() && jwt) {
      navigation.navigate('PrivateRoute');
    } else {
      navigation.navigate('Login');
    }
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <Image style={styles.background} alt="welcome" source={images.welcome} />

      <View style={[styles.background, styles.overlay]} />

      <View style={styles.welcometext}>
        <Text style={styles.heading}>Fintrack</Text>
        <Text style={styles.welcomemsg}>
          Your Best Companinon To Manage Your Accounts
        </Text>

        <TouchableOpacity onPress={handleGetStarted}>
          <View style={styles.btn}>
            <Text style={styles.btnText}>Get Start</Text>
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width,
    height,
    resizeMode: 'cover',
  },

  overlay: {
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  welcomemsg: {
    fontSize: 16,
    marginBottom: 36,
    fontWeight: '700',
    lineHeight: 22,
    color: COLORS.white,
    textAlign: 'center',
    fontFamily: 'Roboto-Regular',
  },

  welcometext: {
    padding: 24,
    flex: 1,
    flexDirection: 'column',
    alignItems: 'stretch',
    justifyContent: 'flex-end',
  },
  heading: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 12,
    lineHeight: 44,
    color: COLORS.primary,
    textAlign: 'center',
    fontFamily: 'Roboto-Bold',
    letterSpacing: 1,
  },

  btn: {
    backgroundColor: COLORS.primary,

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  btnText: {
    fontSize: 17,
    lineHeight: 24,
    fontWeight: '700',
    color: COLORS.white,
    fontFamily: 'Roboto-Regular',
  },
});

export default WelcomeScreen;
