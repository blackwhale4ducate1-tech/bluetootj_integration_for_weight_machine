import {StyleSheet, Text, View, ScrollView} from 'react-native';
import React from 'react';
import NavigationCards from './components/NavigationCards';
import {useNavigation} from '@react-navigation/native';
import {
  MaterialCommunityIcons,
  FontAwesome,
  MaterialIcons,
  FontAwesome5,
  FontAwesome6,
  Foundation,
  COLORS,
} from '../constants';
import {useAuth} from '../components/AuthContext';

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
    name: 'Product Categories',
    icon: (
      <View style={styles.iconContainer}>
        <MaterialIcons name="category" size={28} color={COLORS.white} />
      </View>
    ),
    navigateTo: 'ProductCategoriesStack',
    permissionsPageName: 'productCategories',
  },
  {
    id: 2,
    name: 'Product Details',
    icon: (
      <View style={styles.iconContainer}>
        <MaterialCommunityIcons
          name="format-list-checks"
          size={28}
          color={COLORS.white}
        />
      </View>
    ),
    navigateTo: 'ProductDetailsStack',
    permissionsPageName: 'productDetails',
  },
  {
    id: 3,
    name: 'Customers',
    icon: (
      <View style={styles.iconContainer}>
        <FontAwesome name="users" size={28} color={COLORS.white} />
      </View>
    ),
    navigateTo: 'CustomersStack',
    permissionsPageName: 'customers',
  },
  {
    id: 4,
    name: 'Vendors',
    icon: (
      <View style={styles.iconContainer}>
        <FontAwesome5 name="user-shield" size={28} color={COLORS.white} />
      </View>
    ),
    navigateTo: 'VendorsStack',
    permissionsPageName: 'vendors',
  },
  {
    id: 5,
    name: 'Account Group',
    icon: (
      <View style={styles.iconContainer}>
        <MaterialCommunityIcons
          name="note-multiple"
          size={28}
          color={COLORS.white}
        />
      </View>
    ),
    navigateTo: 'AccountGroupStack',
    permissionsPageName: 'accountGroup',
  },
  {
    id: 6,
    name: 'Ledger Group',
    icon: (
      <View style={styles.iconContainer}>
        <Foundation name="clipboard-notes" size={28} color={COLORS.white} />
      </View>
    ),
    navigateTo: 'LedgerGroupStack',
    permissionsPageName: 'ledgerGroup',
  },
  {
    id: 7,
    name: 'Stores',
    icon: (
      <View style={styles.iconContainer}>
        <FontAwesome5 name="store" size={28} color={COLORS.white} />
      </View>
    ),
    navigateTo: 'StoresStack',
    permissionsPageName: 'stores',
  },
  {
    id: 8,
    name: 'Roles',
    icon: (
      <View style={styles.iconContainer}>
        <FontAwesome5 name="user-check" size={28} color={COLORS.white} />
      </View>
    ),
    navigateTo: 'RolesStack',
    permissionsPageName: 'roles',
  },
  {
    id: 9,
    name: 'Users',
    icon: (
      <View style={styles.iconContainer}>
        <FontAwesome6 name="users-viewfinder" size={28} color={COLORS.white} />
      </View>
    ),
    navigateTo: 'UsersStack',
    permissionsPageName: 'users',
  },
  {
    id: 10,
    name: 'PriceList',
    icon: (
      <View style={styles.iconContainer}>
        <FontAwesome6 name="users-viewfinder" size={28} color={COLORS.white} />
      </View>
    ),
    navigateTo: 'PriceListStack',
    permissionsPageName: 'priceList',
  },
  {
    id: 11,
    name: 'Permissions',
    icon: (
      <View style={styles.iconContainer}>
        <FontAwesome6 name="user-lock" size={28} color={COLORS.white} />
      </View>
    ),
    navigateTo: 'Permissions',
    permissionsPageName: 'permissions',
  },
  {
    id: 12,
    name: 'ProductComposition',
    icon: (
      <View style={styles.iconContainer}>
        <FontAwesome6 name="users-viewfinder" size={28} color={COLORS.white} />
      </View>
    ),
    navigateTo: 'ProductCompositionStack',
    permissionsPageName: 'productComposition',
  },
];

const Master = () => {
  const {data} = useAuth();
  const navigation = useNavigation();

  // Dynamically update card names based on business_category
  const updatedCards = cards.map(card => {
    if (card.id === 4) {
      return {
        ...card,
        name: data && data.business_category === 'FlowerShop' ? 'Farmers' : 'Vendors',
      };
    }
    return card;
  });

  const goToScreen = screen => {
    navigation.navigate(screen);
  };

  return (
    <View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <NavigationCards cards={updatedCards} goToScreen={goToScreen} />
      </ScrollView>
    </View>
  );
};

export default Master;
