import {StyleSheet, Text, Image, View, ScrollView} from 'react-native';
import React from 'react';
import ReportNavigationCards from './components/ReportNavigationCards';
import {useNavigation} from '@react-navigation/native';
import {COLORS, icons} from '../constants';

const EstimateReport = () => {
  const navigation = useNavigation();

  const cards = [
    {
      id: 1,
      name: 'Estimate Day Book Report',
      icon: (
        <View style={styles.imgContain}>
          <Image source={icons.profitandloss} style={styles.image} />
        </View>
      ),
      navigateTo: 'estimateDayBookReport',
      permissionsPageName: 'estimateDayBookReport',
    },
    {
      id: 2,
      name: 'Estimate Day Book Detail Report',
      icon: (
        <View style={styles.imgContain}>
          <Image source={icons.stockReport} style={styles.image} />
        </View>
      ),
      navigateTo: 'estimateDayBookDetailReport',
      permissionsPageName: 'estimateDayBookDetailReport',
    },
    {
      id: 3,
      name: 'Estimate Item Wise Report',
      icon: (
        <View style={styles.imgContain}>
          <Image source={icons.salesOrder} style={styles.image} />
        </View>
      ),
      navigateTo: 'estimateItemWiseReport',
      permissionsPageName: 'estimateItemWiseReport',
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
          title={'Estimate Report'}
        />
      </ScrollView>
    </View>
  );
};

export default EstimateReport;

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
