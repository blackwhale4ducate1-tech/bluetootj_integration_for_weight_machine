import {StyleSheet, Text, Image, View, ScrollView} from 'react-native';
import React from 'react';
import ReportNavigationCards from './components/ReportNavigationCards';
import {useNavigation} from '@react-navigation/native';
import {COLORS, icons} from '../constants';

const SalesReport = () => {
  const navigation = useNavigation();

  const cards = [
    {
      id: 1,
      name: 'Sales Day Book Report',
      icon: (
        <View style={styles.imgContain}>
          <Image source={icons.profitandloss} style={styles.image} />
        </View>
      ),
      navigateTo: 'salesDayBookReport',
      permissionsPageName: 'salesDayBookReport',
    },
    {
      id: 2,
      name: 'Sales Day Book Detail Report',
      icon: (
        <View style={styles.imgContain}>
          <Image source={icons.stockReport} style={styles.image} />
        </View>
      ),
      navigateTo: 'salesDayBookDetailReport',
      permissionsPageName: 'salesDayBookDetailReport',
    },
    {
      id: 3,
      name: 'Sales Item Wise Report',
      icon: (
        <View style={styles.imgContain}>
          <Image source={icons.salesOrder} style={styles.image} />
        </View>
      ),
      navigateTo: 'salesItemWiseReport',
      permissionsPageName: 'salesItemWiseReport',
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
          title={'Sales Report'}
        />
      </ScrollView>
    </View>
  );
};

export default SalesReport;

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
