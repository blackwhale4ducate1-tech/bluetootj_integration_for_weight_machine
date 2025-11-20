import {StyleSheet, Text, Image, View, ScrollView} from 'react-native';
import React from 'react';
import ReportNavigationCards from './components/ReportNavigationCards';
import { useNavigation } from '@react-navigation/native';
import {COLORS, icons} from '../constants';

const StockTransferReport= () => {
  const navigation =useNavigation();

  const cards = [
    {
      id: 1,
      name: 'Stock Transfer Day Book Report',
      icon: (
        <View style={styles.imgContain}>
          <Image source={icons.stockTransfer} style={styles.image} />
        </View>
      ),
      navigateTo: 'stockTransferDayBookReport',
      permissionsPageName: 'stockTransferDayBookReport',
    },
    {
      id: 2,
      name: 'Stock Transfer Day Book Detail Report',
      icon: (
        <View style={styles.imgContain}>
          <Image source={icons.stockReport} style={styles.image} />
        </View>
      ),
      navigateTo: 'stockTransferDayBookDetailReport',
      permissionsPageName: 'stockTransferDayBookDetailReport',
    },
    {
      id: 3,
      name: 'Stock Transfer Item Wise Report',
      icon: (
        <View style={styles.imgContain}>
          <Image source={icons.salesOrder} style={styles.image} />
        </View>
      ),
      navigateTo: 'stockTransferItemWiseReport',
      permissionsPageName: 'stockTransferItemWiseReport',
    },
  ];

  const goToScreen = screen => {
    navigation.navigate(screen);
  };

  return (
    <View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <ReportNavigationCards cards={cards} goToScreen={goToScreen} title={"Stock Transfer Report"}/>
      </ScrollView>
    </View>
  );
};

export default StockTransferReport;

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
