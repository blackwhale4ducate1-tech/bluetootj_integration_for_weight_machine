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

const screenWidth = Dimensions.get('screen').width;

const SearchProductForStockMenu = ({updateFormData, productInput}) => {
  const {data} = useAuth();

  const [menuVisible, setMenuVisible] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [searchInput, setSearchInput] = useState(productInput);

  const onHandleSearchInput = async text => {
    updateFormData(prevFormData => ({
      ...prevFormData,
      product_code: '',
    }));
    setSearchInput(text);
    try {
      const res = await axios.post(`${API_BASE_URL}/api/searchProductByInput`, {
        searchInput: text,
        company_name: data.company_name,
      });
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
    setSearchInput(result.product_code);
    updateFormData(prevFormData => ({
      ...prevFormData,
      product_code: result.product_code,
    }));
    setMenuVisible(false);
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
            label="Search Product"
            placeholder="Search By Product Name"
            onChangeText={onHandleSearchInput}
            value={searchInput}
            outlineColor={COLORS.black}
            textColor={COLORS.black}
            activeOutlineColor={COLORS.primary}
            style={{margin: 10}}
          />
        }>
        {searchResults.length > 0 && (
          <View style={{flexDirection: 'column', alignItems: 'center'}}>
            <View style={styles.menuItem}>
              <Text style={[styles.cell, styles.marginRight, styles.heading]}>
                Product Code
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
                    {result.product_code}
                  </Text>
                </View>
              </TouchableOpacity>
              {index < searchResults.length - 1 && <Divider />}
            </Fragment>
          ))}
          {searchResults.length === 0 && (
            <Text style={styles.emptyprd}>No Products found</Text>
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

export default SearchProductForStockMenu;
