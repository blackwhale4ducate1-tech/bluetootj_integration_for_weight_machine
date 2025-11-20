import {StyleSheet,  Image, View, ScrollView} from 'react-native';
import React from 'react';
import ReportNavigationCards from './components/ReportNavigationCards';
import {useNavigation} from '@react-navigation/native';
import {COLORS, icons} from '../constants';

const PurchaseReport = () => {
  const navigation = useNavigation();
  const cards = [
    {
      id: 1,
      name: 'Purchase Day Book Report',
      icon: (
        <View style={styles.imgContain}>
          <Image source={icons.purchaseReport} style={styles.image} />
        </View>
      ),
      navigateTo: 'purchaseDayBookReport',
      permissionsPageName: 'purchaseDayBookReport',
    },
    {
      id: 2,
      name: 'Purchase Day Book Detail Report',
      icon: (
        <View style={styles.imgContain}>
          <Image source={icons.openingStock} style={styles.image} />
        </View>
      ),
      navigateTo: 'purchaseDayBookDetailReport',
      permissionsPageName: 'purchaseDayBookDetailReport',
    },
    {
      id: 3,
      name: 'Purchase Item Wise Report',
      icon: (
        <View style={styles.imgContain}>
          <Image source={icons.salesOrder} style={styles.image} />
        </View>
      ),
      navigateTo: 'purchaseItemWiseReport',
      permissionsPageName: 'purchaseItemWiseReport',
    },
  ];

  const goToScreen = screen => {
    navigation.navigate(screen);
  };

  return (
    <View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <ReportNavigationCards
          cards={cards}
          goToScreen={goToScreen}
          title={'Purchase Reports'}
        />
      </ScrollView>
    </View>
  );
};

export default PurchaseReport;

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
