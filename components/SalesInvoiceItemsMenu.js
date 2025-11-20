import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import React, {useState, useCallback, useEffect} from 'react';
import axios from 'axios';
import {API_BASE_URL} from '../config';
import {useAuth} from './AuthContext';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import {Button, List, Card, IconButton, Icon} from 'react-native-paper';
import {COLORS, FONTS} from '../constants';
import {useSales} from './SalesContext';
import {useEstimate} from './EstimateContext';
import {usePettySales} from './PettySalesContext';

const SalesInvoiceItemsMenu = ({type, mopSettings}) => {
  const {data} = useAuth();
  if (type === 'sales' || type === 'sales_order') {
    ({
      items,
      setItems,
      setNewProduct,
      initialItem,
      setItemStatus,
      setRowNoToUpdate,
      setSearchProductInput,
    } = useSales());
  } else if (type === 'estimate') {
    ({
      items,
      setItems,
      setNewProduct,
      initialItem,
      setItemStatus,
      setRowNoToUpdate,
      setSearchProductInput,
    } = useEstimate());
  } else if (type === 'pettySales') {
    ({
      items,
      setItems,
      setNewProduct,
      initialItem,
      setItemStatus,
      setRowNoToUpdate,
      setSearchProductInput,
    } = usePettySales());
  }

  const navigation = useNavigation();

  const [billedItemsExpanded, setBilledItemsExpanded] = useState(true);

  const handleDeleteItem = index => {
    setItems(prevItems => {
      const updatedItems = [...prevItems];
      updatedItems.splice(index, 1);
      return updatedItems;
    });
  };

  return (
    <View>
      <View style={{padding: 20}}>
        <List.Accordion
          title="Billed Items"
          expanded={billedItemsExpanded}
          onPress={() => setBilledItemsExpanded(!billedItemsExpanded)}
          style={{
            backgroundColor: COLORS.inputbggreen,
            borderRadius: 5,
          }}
          titleStyle={{
            fontFamily: FONTS.body4.fontFamily,
            color: COLORS.black,
          }}>
          {items.map((item, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => {
                setNewProduct(items[index]);
                setRowNoToUpdate(index);
                setSearchProductInput(items[index].productCode);
                setItemStatus('Edit');
                navigation.navigate('AddEditSalesItem', {type: type, mopSettings: mopSettings});
              }}>
              <Card
                key={index}
                style={{marginVertical: 5, backgroundColor: COLORS.white}}>
                <Card.Title
                  title={`#${index + 1} ${item.productCode}`}
                  right={props => (
                    <IconButton
                      {...props}
                      icon="delete"
                      iconColor={COLORS.red}
                      onPress={() => handleDeleteItem(index)}
                    />
                  )}
                />
                <Card.Content>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    <View style={{flex: 1}}>
                      <Text style={styles.billText}>Qty * Sales Price</Text>
                    </View>
                    <View style={{flex: 1, alignItems: 'flex-end'}}>
                      <Text style={styles.billText}>
                        {item.qty} * {parseFloat(item.newSalesPrice).toFixed(2)}{' '}
                        =
                        <Icon source="currency-inr" />
                        {parseFloat(item.qty * item.newSalesPrice).toFixed(2)}
                      </Text>
                    </View>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    <View style={{flex: 1}}>
                      <Text style={styles.billText}>Discount</Text>
                    </View>
                    <View style={{flex: 1, alignItems: 'flex-end'}}>
                      <Text style={styles.billText}>
                        -<Icon source="currency-inr" />
                        {parseFloat(item.discount || 0).toFixed(2)}
                      </Text>
                    </View>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    <View style={{flex: 1}}>
                      <Text style={styles.billText}>Tax</Text>
                    </View>
                    <View style={{flex: 1, alignItems: 'flex-end'}}>
                      <Text style={styles.billText}>
                        <Icon source="currency-inr" />
                        {(
                          parseFloat(item.cgst + item.sgst + item.igst || 0) *
                          item.qty
                        ).toFixed(2)}
                      </Text>
                    </View>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    <View style={{flex: 1}}>
                      <Text style={styles.billText}>Sub Total</Text>
                    </View>
                    <View style={{flex: 1, alignItems: 'flex-end'}}>
                      <Text style={styles.billText}>
                        <Icon source="currency-inr" />
                        {parseFloat(item.subTotal).toFixed(2)}
                      </Text>
                    </View>
                  </View>
                </Card.Content>
              </Card>
            </TouchableOpacity>
          ))}
        </List.Accordion>
      </View>
      <Button
        mode="outlined"
        icon="plus"
        onPress={() => {
          setNewProduct(initialItem);
          setItemStatus('Add');
          setSearchProductInput('');
          navigation.navigate('AddEditSalesItem', {type: type, mopSettings: mopSettings});
        }}
        buttonColor={COLORS.white}
        rippleColor={COLORS.lightRed}
        theme={{colors: {outline: COLORS.red, primary: COLORS.red}}}
        style={{
          marginHorizontal: 70,
        }}>
        Add Items
      </Button>
    </View>
  );
};

export default SalesInvoiceItemsMenu;

const styles = StyleSheet.create({
  billText: {
    fontSize: 12,
    fontFamily: FONTS.body4.fontFamily,
    color: COLORS.black,
  },
});
