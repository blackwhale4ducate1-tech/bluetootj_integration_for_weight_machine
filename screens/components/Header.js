import React, {useRef} from 'react';
import {View, Text, Image, StyleSheet, TouchableOpacity} from 'react-native';
import {COLORS, images, icons} from '../../constants';
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu';
import {useNavigation} from '@react-navigation/native';
import {useAuth} from '../../components/AuthContext';

export default function Header() {
  const {logout} = useAuth();
  const menuRef = useRef();
  const navigation = useNavigation();
  const handleProfilePress = () => {
    if (menuRef.current) {
      menuRef.current.open();
    }
  };

  const navigateToProfile = () => {
    navigation.navigate('Profile');
  };

  const handleLogout = () => {
    logout();
    navigation.navigate('Login');
  };

  return (
    <View style={Styles.container}>
      <Image
        source={images.logoicon}
        style={Styles.logo}
        resizeMode="contain"
      />
      <TouchableOpacity onPress={handleProfilePress}>
        <View style={Styles.profileContainer}>
          <Image source={icons.user} style={Styles.user} resizeMode="contain" />
        </View>
      </TouchableOpacity>
      <Menu ref={menuRef} style={[Styles.menuContainer, {top: 50, right: 10}]}>
        <MenuTrigger text="" />
        <MenuOptions>
          <MenuOption onSelect={navigateToProfile}>
            <View style={Styles.menuOptionContainer}>
              <Image source={icons.user} style={Styles.menuOptionIcon} />
              <Text style={Styles.menuOptionText}>Profile</Text>
            </View>
          </MenuOption>
          <MenuOption onSelect={handleLogout}>
            <View style={Styles.menuOptionContainer}>
              <Image source={icons.logout} style={Styles.menuOptionIcon} />
              <Text style={Styles.menuOptionText}>Logout</Text>
            </View>
          </MenuOption>
        </MenuOptions>
      </Menu>
    </View>
  );
}

const Styles = StyleSheet.create({
  container: {
    position: 'relative',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: 10,
  },
  logo: {
    width: 100,
    height: 40,
  },
  user: {
    width: 25,
    height: 25,
  },
  profileContainer: {
    width: 25,
    height: 25,
    borderRadius: 12.5,
    borderColor: COLORS.primary,
    borderWidth: 1,
    padding: 20,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuContainer: {
    position: 'absolute',
  },
  menuOptionText: {
    fontFamily: 'Roboto-Regular',
    fontSize: 17,
    textAlign: 'center',
    marginVertical: 10,
    letterSpacing: 0.5,
    color: COLORS.black,
  },
  menuOptionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 20,
  },
  menuOptionIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  menuOptionText: {
    fontFamily: 'Roboto-Regular',
    fontSize: 17,
    textAlign: 'center',
    marginVertical: 10,
    letterSpacing: 0.5,
    color: COLORS.black,
  },
});
