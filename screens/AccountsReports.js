import {StyleSheet, Image, View, ScrollView} from 'react-native';
import React from 'react';
import ReportNavigationCards from './components/ReportNavigationCards';
import {useNavigation} from '@react-navigation/native';
import {COLORS, icons} from '../constants';
import {useAuth} from '../components/AuthContext';

const AccountsReports = () => {
  const navigation = useNavigation();
  const {data} = useAuth();

  const allCards = [
    {
      id: 1,
      name: 'Ledger Report',
      icon: (
        <View style={styles.imgContain}>
          <Image source={icons.stockReport} style={styles.image} />
        </View>
      ),
      navigateTo: 'ledgerReport',
      permissionsPageName: 'ledgerReport',
    },
    {
      id: 2,
      name: 'Outstanding Customer Report',
      icon: (
        <View style={styles.imgContain}>
          <Image source={icons.CustomerReport} style={styles.image} />
        </View>
      ),
      navigateTo: 'outstandingCustomerReport',
      permissionsPageName: 'outstandingCustomerReport',
    },
    {
      id: 3,
      name: 'Outstanding Statement Report',
      icon: (
        <View style={styles.imgContain}>
          <Image source={icons.stockReport} style={styles.image} />
        </View>
      ),
      navigateTo: 'outstandingStatementReport',
      permissionsPageName: 'outstandingStatementReport',
    },
  ];

  const allowedCards = ['ledgerReport', 'outstandingStatementReport'];

  // Filter cards based on business_category
  const filteredCards =
    data.business_category === 'FlowerShop'
      ? allCards.filter(card => allowedCards.includes(card.name)) // Include only allowed cards
      : allCards; // Include all cards

  const goToScreen = screen => {
    navigation.navigate(screen);
  };

  return (
    <View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <ReportNavigationCards
          cards={filteredCards}
          goToScreen={goToScreen}
          title={'Accounts Report'}
        />
      </ScrollView>
    </View>
  );
};

export default AccountsReports;

const styles = StyleSheet.create({
  image: {
    width: 35,
    height: 35,
    tintColor: COLORS.white,
  },
  imgContain: {
    width: 60,
    height: 60,
    backgroundColor: COLORS.primary,
    borderRadius: 30,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
