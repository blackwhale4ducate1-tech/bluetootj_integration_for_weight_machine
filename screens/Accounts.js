import {StyleSheet, Text, View, ScrollView, Image} from 'react-native';
import React from 'react';
import NavigationCards from './components/NavigationCards';
import {useNavigation} from '@react-navigation/native';
import {MaterialIcons, COLORS, FontAwesome6, icons} from '../constants';

const styles = StyleSheet.create({
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    backgroundColor: COLORS.primary,
  },
});

const cards = [
  {
    id: 1,
    name: 'Receipts',
    icon: (
      <View style={styles.iconContainer}>
        <MaterialIcons name="receipt-long" size={28} color={COLORS.white} />
      </View>
    ),
    navigateTo: 'ReceiptsStack',
    permissionsPageName: 'receipts',
  },
  {
    id: 2,
    name: 'Payments',
    icon: (
      <View style={styles.iconContainer}>
        <MaterialIcons name="payments" size={28} color={COLORS.white} />
      </View>
    ),
    navigateTo: 'PaymentsStack',
    permissionsPageName: 'payments',
  },
  {
    id: 3,
    name: 'Balance Sheet',
    icon: (
      <View style={styles.iconContainer}>
        <FontAwesome6 name="sheet-plastic" size={28} color={COLORS.white} />
      </View>
    ),
    navigateTo: 'BalanceSheet',
    permissionsPageName: 'balanceSheet',
  },
  {
    id: 4,
    name: 'Trial Balance',
    icon: (
      <View style={styles.iconContainer}>
        <Image
          source={icons.trialbalance}
          style={{width: 40, height: 40, tintColor: COLORS.white}}
        />
      </View>
    ),
    navigateTo: 'TrialBalance',
    permissionsPageName: 'trialBalance',
  },
  {
    id: 5,
    name: 'Profit and Loss',
    icon: (
      <View style={styles.iconContainer}>
        <Image
          source={icons.profitandloss}
          style={{width: 36, height: 36, tintColor: COLORS.white}}
        />
      </View>
    ),
    navigateTo: 'ProfitAndLoss',
    permissionsPageName: 'profitAndLoss',
  },
];

const Accounts = () => {
  const navigation = useNavigation();

  const goToScreen = screen => {
    navigation.navigate(screen);
  };

  return (
    <View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <NavigationCards cards={cards} goToScreen={goToScreen} />
      </ScrollView>
    </View>
  );
};

export default Accounts;
