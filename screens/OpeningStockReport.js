import {StyleSheet, Text, Image, View, ScrollView} from 'react-native';
import React from 'react';
import ReportNavigationCards from './components/ReportNavigationCards';
import { useNavigation } from '@react-navigation/native';
import {COLORS, icons} from '../constants';

const OpeningStockReport= () => {
  const navigation =useNavigation();
  
  const cards = [
    {
      id: 1,
      name: 'Opening Stock Day Book Report',
      icon: (
        <View style={styles.imgContain}>
          <Image source={icons.openingStock} style={styles.image} />
        </View>
      ),
      navigateTo: 'openingStockDayBookReport',
      permissionsPageName: 'openingStockDayBookReport',
    },
    {
      id: 2,
      name: 'Opening Stock Day Book Detail Report',
      icon: (
        <View style={styles.imgContain}>
          <Image source={icons.stockReport} style={styles.image} />
        </View>
      ),
      navigateTo: 'openingStockDayBookDetailReport',
      permissionsPageName: 'openingStockDayBookDetailReport',
    },
    {
      id: 3,
      name: 'Opening Stock  Item Wise Report',
      icon: (
        <View style={styles.imgContain}>
          <Image source={icons.salesOrder} style={styles.image} />
        </View>
      ),
      navigateTo: 'openingStockItemWiseReport',
      permissionsPageName: 'openingStockItemWiseReport',
    },
  ];

  const goToScreen = screen => {
    navigation.navigate(screen);
  };

  return (
    <View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <ReportNavigationCards cards={cards} goToScreen={goToScreen} title={"Opening Stock Report"}/>
      </ScrollView>
    </View>
  );
};

export default OpeningStockReport;

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
