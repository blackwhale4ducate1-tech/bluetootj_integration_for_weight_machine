import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import React, {useState, useEffect, Fragment, useCallback} from 'react';
import {TextInput, Menu, Divider, List, Button} from 'react-native-paper';
import axios from 'axios';
import {API_BASE_URL} from '../config';
import {useAuth} from './AuthContext';
import {COLORS, FONTS} from '../constants';
import {useNavigation} from '@react-navigation/native';

const screenWidth = Dimensions.get('screen').width;

const SearchCustomerForDayBookMenu = ({
  type,
  updateFormData,
  customerInput,
}) => {
  const {data} = useAuth();
  const navigation = useNavigation();

  const [menuVisible, setMenuVisible] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [searchInput, setSearchInput] = useState(customerInput);
  const [searchType, setSearchType] = useState(type);

  const onHandleSearchInput = async text => {
    updateFormData(prevFormData => ({
      ...prevFormData,
      name: '',
    }));
    setSearchInput(text);
    try {
      const res = await axios.post(
        `${API_BASE_URL}/api/searchCustomersByInput`,
        {
          searchInput: text,
          type: searchType,
          company_name: data.company_name,
        },
      );
      if (res.data.message) {
        setSearchResults(res.data.message);
      } else {
        setSearchResults([]);
      }
      setMenuVisible(true);
    } catch (err) {
      console.log(err);
    }
  };

  const handleClickRow = result => {
    setSearchInput(result.account_code);
    updateFormData(prevFormData => ({
      ...prevFormData,
      name: result.account_code,
    }));
    setMenuVisible(false);
  };

  const onClickSwith = useCallback(() => {
    if (searchType === 'purchase') {
      setSearchType('sales');
    } else if (searchType === 'sales') {
      setSearchType('purchase');
    }
    setSearchInput('');
    setSearchResults([]);
  }, [searchType]);

  const onClickAdd = () => {
    setMenuVisible(false);
    if (searchType === 'purchase') {
      navigation.navigate('VendorsStack', {
        screen: 'AddEditVendor',
        params: {type: 'Add Vendor'},
      });
    } else if (searchType === 'sales') {
      navigation.navigate('CustomersStack', {
        screen: 'AddEditCustomer',
        params: {type: 'Add Customer'},
      });
    }
  };

  return (
    <View>
      <Menu
        visible={menuVisible}
        onDismiss={() => setMenuVisible(false)}
        contentStyle={{
          width: screenWidth * 0.9,
          maxHeight: 300,
          marginLeft: 10,
          marginTop: 75,
          backgroundColor: 'white',
        }}
        anchor={
          <TextInput
            mode="outlined"
            label="Search Customer"
            placeholder="Search By Name"
            onChangeText={onHandleSearchInput}
            value={searchInput}
            outlineColor={COLORS.black}
            textColor={COLORS.black}
            activeOutlineColor={COLORS.primary}
            style={{margin: 10}}
          />
        }>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <View style={{flex: 2}}>
            <Button
              mode="contained"
              onPress={onClickSwith}
              style={{margin: 10}}>
              {searchType === 'purchase'
                ? 'Switch to Customer'
                : 'Switch to Vendor'}
            </Button>
          </View>
          <View style={{flex: 1}}>
            <Button mode="contained" onPress={onClickAdd} style={{margin: 10}}>
              Add
            </Button>
          </View>
        </View>
        {searchResults.length > 0 && (
          <View style={{flexDirection: 'column', alignItems: 'center'}}>
            <View style={styles.menuItem}>
              <Text style={[styles.cell, styles.marginRight, styles.heading]}>
                Account Code
              </Text>
              <Text style={[styles.cell, styles.marginRight, styles.heading]}>
                Name
              </Text>
              {data.business_category === 'FlowerShop' && (
                <Text style={[styles.cell, styles.marginRight, styles.heading]}>
                  Regional Name
                </Text>
              )}
              <Text
                style={[
                  styles.cell,
                  styles.textRight,
                  styles.marginRight,
                  styles.heading,
                ]}>
                Phone No
              </Text>
            </View>
          </View>
        )}

        <ScrollView style={{maxHeight: 200, width: '100%'}}>
          {searchResults.map((result, index) => (
            <Fragment key={index}>
              <TouchableOpacity
                onPress={() => {
                  handleClickRow(result);
                  setMenuVisible(false);
                }}>
                <View style={styles.menuItem}>
                  <Text style={[styles.cell, styles.marginRight]}>
                    {result.account_code}
                  </Text>
                  <Text style={[styles.cell, styles.marginRight]}>
                    {result.name}
                  </Text>
                  {data.business_category === 'FlowerShop' && (
                    <Text style={[styles.cell, styles.marginRight]}>
                      {result.regional_name}
                    </Text>
                  )}
                  <Text
                    style={[styles.cell, styles.textRight, styles.marginRight]}>
                    {result.phone_no}
                  </Text>
                </View>
              </TouchableOpacity>
              {index < searchResults.length - 1 && <Divider />}
            </Fragment>
          ))}
          {searchResults.length === 0 && (
            <Text style={styles.emptyprd}>No Customers found</Text>
          )}
        </ScrollView>
      </Menu>
    </View>
  );
};

const styles = StyleSheet.create({
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  heading: {
    color: COLORS.red,
    fontSize: 14,
    fontWeight: 700,
  },
  emptyprd: {
    fontSize: 14,
    fontFamily: FONTS.body4.fontFamily,
    color: COLORS.red,
    fontWeight: '700',
    textAlign: 'center',
  },
  cell: {
    flex: 1,
    color: COLORS.black,
  },
  textRight: {
    textAlign: 'right',
  },
  marginRight: {
    marginRight: 5,
  },
  marginLeft: {
    marginLeft: 15,
  },
});

export default SearchCustomerForDayBookMenu;
