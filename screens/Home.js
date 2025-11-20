import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import Header from './components/Header';
import {useNavigation} from '@react-navigation/native';
import {
  COLORS,
  MaterialCommunityIcons,
  MaterialIcons,
  Feather,
  Ionicons,
  AntDesign,
  FONTS,
} from '../constants';
import NavigationCards from './components/NavigationCards';

const screenWidth = Dimensions.get('window').width;

const cards = [
  {
    id: 1,
    name: 'Master',
    icon: (
      <MaterialCommunityIcons name="file-cabinet" size={40} color={COLORS.secondaryBlue} />
    ),
    accentLight: '#E8F1FF',
    navigateTo: 'Master',
    permissionsPageName: 'master',
  },
  {
    id: 2,
    name: 'Billing',
    icon: <MaterialIcons name="request-quote" size={40} color={COLORS.warning} />,
    accentLight: '#FFF6E5',
    navigateTo: 'Billing',
    permissionsPageName: 'billing',
  },
  {
    id: 3,
    name: 'Accounts',
    icon: <Ionicons name="book-outline" size={40} color={COLORS.success} />,
    accentLight: '#E9F7EF',
    navigateTo: 'Accounts',
    permissionsPageName: 'accounts',
  },
  {
    id: 4,
    name: 'Reports',
    icon: <AntDesign name="areachart" size={40} color={COLORS.info} />,
    accentLight: '#E8FAFE',
    navigateTo: 'Reports',
    permissionsPageName: 'reports',
  },
  {
    id: 5,
    name: 'Tools',
    icon: <Feather name="tool" size={40} color={COLORS.purple} />,
    accentLight: '#F4EFFE',
    navigateTo: 'Tools',
    permissionsPageName: 'tools',
  },
  {
    id: 6,
    name: 'Settings',
    icon: <Ionicons name="settings-outline" size={40} color={COLORS.darkGray} />,
    accentLight: '#F2F4F6',
    navigateTo: 'Settings',
    permissionsPageName: 'settings',
  },
];

const Home = () => {
  const navigation = useNavigation();

  const goToScreen = screen => {
    navigation.navigate('SideNav', {screen: screen});
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}>
        <View style={styles.cardParent}>
          <View style={styles.card}>
            <Text style={styles.bannerText}>
              Elevate your finances with FinTrack overseeing your accounts
              globally
            </Text>
            <TouchableOpacity
              style={styles.dashboardButton}
              activeOpacity={0.8}
              onPress={() => navigation.navigate('Dashboard')}>
              <Text style={styles.dashboardButtonText}>View Dashboard</Text>
            </TouchableOpacity>
          </View>
          {/* Navigation cards */}
          <NavigationCards cards={cards} goToScreen={goToScreen} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F8FA',
  },
  contentContainer: {
    paddingBottom: 24,
  },
  cardParent: {
    alignItems: 'center',
    marginTop: 10,
    padding: 15,
  },
  card: {
    backgroundColor: COLORS.primary,
    width: '100%',
    borderRadius: 10,
    flexDirection: 'column',
    justifyContent: 'center',
    minHeight: 120,
    padding: 20,
    marginBottom: 24,
    // Shadow for iOS
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 6},
    shadowOpacity: 0.15,
    shadowRadius: 12,
    // Elevation for Android
    elevation: 4,
  },
  dashboardButton: {
    alignSelf: 'center',
    marginTop: 14,
    backgroundColor: COLORS.white,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  dashboardButtonText: {
    color: COLORS.primary,
    fontFamily: FONTS.body3.fontFamily,
    fontWeight: '700',
  },
  bannerText: {
    fontSize: 18,
    lineHeight: 26,
    textAlign: 'center',
    fontFamily: 'Roboto-Bold',
    color: COLORS.white,
    letterSpacing: 0.3,
    paddingHorizontal: 12,
  },
});

export default Home;
