import {StyleSheet, Text, Image, View, ScrollView} from 'react-native';
import React from 'react';
import ReportNavigationCards from './components/ReportNavigationCards';
import { useNavigation } from '@react-navigation/native';
import {COLORS, icons, FontAwesome6, Foundation} from '../constants';

const SalesOrderReport= () => {
  const navigation = useNavigation();
  
  const cards = [
    {
      id: 1,
      name: 'Sales Order Day Book Report',
      icon: (
        <View style={styles.imgContain}>
          <Image source={icons.receiptReport} style={styles.image} />
        </View>
      ),
      navigateTo: 'salesOrderDayBookReport',
      permissionsPageName: 'salesOrderDayBookReport',
    },
    {
      id: 2,
      name: 'Sales Order Day Book Detail Report',
      icon: (
        <View style={styles.imgContain}>
          <Image source={icons.stockReport} style={styles.image} />
        </View>
      ),
      navigateTo: 'salesOrderDayBookDetailReport',
      permissionsPageName: 'salesOrderDayBookDetailReport',
    },
    {
      id: 3,
      name: 'Sales Order Item Wise Report',
      icon: (
        <View style={styles.imgContain}>
          <Image source={icons.salesOrder} style={styles.image} />
        </View>
      ),
      navigateTo: 'salesOrderItemWiseReport',
      permissionsPageName: 'salesOrderItemWiseReport',
    },
  ];

  const goToScreen = screen => {
    navigation.navigate(screen);
  };

  return (
    <View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <ReportNavigationCards cards={cards} goToScreen={goToScreen} title={"Sales Order Report"}/>
      </ScrollView>
    </View>
  );
};

export default SalesOrderReport;

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
