import {StyleSheet, Image, View, ScrollView} from 'react-native';
import React from 'react';
import NavigationCards from './components/NavigationCards';
import {useNavigation} from '@react-navigation/native';
import {COLORS, icons} from '../constants';
import {useAuth} from '../components/AuthContext';

const Billing = () => {
  const navigation = useNavigation();
    const {data} = useAuth();

  if (!data) {
    return null;
  }


  const allCards = [
    {
      id: 1,
      name: 'Sales',
      icon: (
        <View style={styles.imgContain}>
          <Image source={icons.salesReport} style={styles.image} />
        </View>
      ),
      navigateTo: 'SalesBilling',
      permissionsPageName: 'sales',
    },
    {
      id: 2,
      name: 'Sales Order',
      icon: (
        <View style={styles.imgContain}>
          <Image source={icons.salesOrder} style={styles.image} />
        </View>
      ),
      navigateTo: 'SalesOrderBilling',
      permissionsPageName: 'salesOrder',
    },
    {
      id: 3,
      name: 'Purchase',
      icon: (
        <View style={styles.imgContain}>
          <Image source={icons.purchaseReport} style={styles.image} />
        </View>
      ),
      navigateTo: 'PurchaseBilling',
      permissionsPageName: 'purchase',
    },
    {
      id: 4,
      name: 'Purchase Order',
      icon: (
        <View style={styles.imgContain}>
          <Image source={icons.openingStock} style={styles.image} />
        </View>
      ),
      navigateTo: 'Billing',
      permissionsPageName: 'purchaseOrder',
    },
    {
      id: 5,
      name: 'Stock Transfer',
      icon: (
        <View style={styles.imgContain}>
          <Image source={icons.stockTransfer} style={styles.image} />
        </View>
      ),
      navigateTo: 'StockTransferBilling',
      permissionsPageName: 'stockTransfer',
    },
    {
      id: 6,
      name: 'Opening Stock',
      icon: (
        <View style={styles.imgContain}>
          <Image source={icons.openingStock} style={styles.image} />
        </View>
      ),
      navigateTo: 'OpeningStockBilling',
      permissionsPageName: 'openingStock',
    },
    {
      id: 7,
      name: 'Estimate',
      icon: (
        <View style={styles.imgContain}>
          <Image source={icons.openingStock} style={styles.image} />
        </View>
      ),
      navigateTo: 'EstimateBilling',
      permissionsPageName: 'estimate',
    },
    {
      id: 8,
      name: 'PettySales',
      icon: (
        <View style={styles.imgContain}>
          <Image source={icons.openingStock} style={styles.image} />
        </View>
      ),
      navigateTo: 'PettySalesBilling',
      permissionsPageName: 'pettySales',
    },
    {
      id: 9,
      name: 'PurchaseReturn',
      icon: (
        <View style={styles.imgContain}>
          <Image source={icons.purchaseReport} style={styles.image} />
        </View>
      ),
      navigateTo: 'PurchaseReturnBilling',
      permissionsPageName: 'purchaseReturn',
    },

    {
      id: 10,
      name: 'Production',
      icon: (
        <View style={styles.imgContain}>
          <Image source={icons.purchaseReport} style={styles.image} />
        </View>
      ),
      navigateTo: 'ProductionBilling',
      permissionsPageName: 'production',
    },
  ];

  // Filter cards based on business_category
  const filteredCards =
    data.business_category === 'FlowerShop'
      ? allCards.filter(card => card.name === 'Purchase') // Include only Purchase
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

export default Billing;

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
