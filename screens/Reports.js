import {StyleSheet, Image, View, ScrollView} from 'react-native';
import React from 'react';
import NavigationCards from './components/NavigationCards';
import {useNavigation} from '@react-navigation/native';
import {COLORS, icons, FontAwesome6, Foundation} from '../constants';
import {useAuth} from '../components/AuthContext';

const Reports = () => {
  const allCards = [
    {
      id: 1,
      name: 'Sales Report',
      icon: (
        <View style={styles.imgContain}>
          <Image source={icons.salesReport} style={styles.image} />
        </View>
      ),
      navigateTo: 'salesReport',
      permissionsPageName: 'salesReport',
    },
    {
      id: 2,
      name: 'Purchase Report',
      icon: (
        <View style={styles.imgContain}>
          <Image source={icons.purchaseReport} style={styles.image} />
        </View>
      ),
      navigateTo: 'purchaseReport',
      permissionsPageName: 'purchaseReport',
    },
    {
      id: 3,
      name: 'Receipt Report',
      icon: (
        <View style={styles.imgContain}>
          <Image source={icons.receiptReport} style={styles.image} />
        </View>
      ),
      navigateTo: 'receiptReport',
      permissionsPageName: 'receiptReport',
    },
    {
      id: 4,
      name: 'Payment Report',
      icon: (
        <View style={styles.imgContain}>
          <FontAwesome6
            name="money-bill-wheat"
            color={COLORS.white}
            size={30}
          />
        </View>
      ),
      navigateTo: 'paymentReport',
      permissionsPageName: 'paymentReport',
    },
    {
      id: 5,
      name: 'Sales Order Report',
      icon: (
        <View style={styles.imgContain}>
          <Image source={icons.salesOrder} style={styles.image} />
        </View>
      ),
      navigateTo: 'salesOrderReport',
      permissionsPageName: 'salesOrderReport',
    },
    {
      id: 6,
      name: 'Stock Transfer Report',
      icon: (
        <View style={styles.imgContain}>
          <Image source={icons.stockTransfer} style={styles.image} />
        </View>
      ),
      navigateTo: 'stockTransferReport',
      permissionsPageName: 'stockTransferReport',
    },
    {
      id: 7,
      name: 'Stocks Report',
      icon: (
        <View style={styles.imgContain}>
          <Image source={icons.stockReport} style={styles.image} />
        </View>
      ),
      navigateTo: 'stocksReport',
      permissionsPageName: 'stocksReport',
    },
    {
      id: 8,
      name: 'Opening Stock Report',
      icon: (
        <View style={styles.imgContain}>
          <Image source={icons.openingStock} style={styles.image} />
        </View>
      ),
      navigateTo: 'openingStockReport',
      permissionsPageName: 'openingStockReport',
    },
    {
      id: 9,
      name: 'Estimate Report',
      icon: (
        <View style={styles.imgContain}>
          <Image source={icons.salesReport} style={styles.image} />
        </View>
      ),
      navigateTo: 'estimateReport',
      permissionsPageName: 'estimateReport',
    },
    {
      id: 10,
      name: 'Petty Sales Report',
      icon: (
        <View style={styles.imgContain}>
          <Image source={icons.salesReport} style={styles.image} />
        </View>
      ),
      navigateTo: 'pettySalesReport',
      permissionsPageName: 'pettySalesReport',
    },
    {
      id: 11,
      name: 'Purchase Return Report',
      icon: (
        <View style={styles.imgContain}>
          <Image source={icons.salesReport} style={styles.image} />
        </View>
      ),
      navigateTo: 'purchaseReturnReport',
      permissionsPageName: 'purchaseReturnReport',
    },
    {
      id: 12,
      name: 'Accounts Reports',
      icon: (
        <View style={styles.imgContain}>
          <Foundation name="clipboard-notes" color={COLORS.white} size={35} />
        </View>
      ),
      navigateTo: 'accountsReports',
      permissionsPageName: 'accountsReports',
    },
  ];

  const navigation = useNavigation();
    const {data} = useAuth();

  if (!data) {
    return null;
  }


  const allowedCards = [
    'purchaseReport',
    'receiptReport',
    'paymentReport',
    'accountsReports',
  ];

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
        <NavigationCards cards={filteredCards} goToScreen={goToScreen} />
      </ScrollView>
    </View>
  );
};

export default Reports;

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
