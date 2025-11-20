import React from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  Image,
  StyleSheet,
  Dimensions,
} from 'react-native';
import {COLORS, FONTS, MaterialCommunityIcons, icons} from '../../constants';
import {useAuth} from '../../components/AuthContext';
const screenWidth = Dimensions.get('window').width;
import {useNavigation} from '@react-navigation/native';
import CustomStyles from '../../components/AddEditModalStyles';
import {Appbar} from 'react-native-paper';

export default function ReportNavigationCards({cards, goToScreen, title}) {
  const navigation = useNavigation();
  const {permissions} = useAuth();
  const filteredCards = cards.filter(card => {
    const permission = Array.isArray(permissions)
      ? permissions.find(p => p.page === card.permissionsPageName)
      : null;
    return permission && permission.view === 1;
  });

  return (
    <View style={CustomStyles.safeContainer}>
      <Appbar.Header style={CustomStyles.appHeader}>
        <Appbar.BackAction
          onPress={() => {
            navigation.goBack();
          }}
          color={COLORS.white}
        />
        <Appbar.Content title={title} titleStyle={CustomStyles.titleStyle} />
      </Appbar.Header>
      <View style={styles.scrollViewContainer}>
        {filteredCards.map(card => (
          <TouchableOpacity
            key={card.id}
            style={styles.navCard}
            onPress={
              card.navigateTo ? () => goToScreen(card.navigateTo) : undefined
            }>
            <View style={{justifyContent: 'center', alignItems: 'center'}}>
              <View style={[styles.iconContain]}>
                <View style={styles.imgContain}>
                  {card.icon}
                  {/* <Image source={icons.purchaseReport} style={styles.image} /> */}
                </View>
              </View>
            </View>
            <Text
              style={{
                color: COLORS.black,
                ...FONTS.body4,
                fontWeight: 700,
                marginTop: 80,
                textAlign: 'center',
              }}>
              {card.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 15,
  },
  scrollViewContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    paddingVertical: 10,
    marginBottom: 40,
  },
  navText: {
    textTransform: 'capitalize',
    letterSpacing: 0.2,
    marginTop: 60,
    textAlign: 'center',
  },
  navCard: {
    backgroundColor: COLORS.white,
    width: screenWidth * 0.9,
    height: 150,
    borderRadius: 10,
    margin: 20,
    position: 'relative',
  },
  image: {
    width: 35,
    height: 35,
    tintColor: COLORS.white,
  },
  iconContain: {
    position: 'absolute',
    top: -10,
  },
  imgContain: {
    width: 60,
    height: 60,
    backgroundColor: COLORS.primary,
    borderRadius: 30,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 20,
  },

  navText: {
    textTransform: 'capitalize',
    letterSpacing: 0.2,
    marginTop: 10,
    textAlign: 'center',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  headerText: {
    fontSize: 16,
    fontFamily: FONTS.body5.fontFamily,
    color: COLORS.black,
    marginLeft: 20,
    fontWeight: '700',
  },
});
