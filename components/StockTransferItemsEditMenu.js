import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import React, {useState, useCallback, useEffect} from 'react';
import axios from 'axios';
import {API_BASE_URL} from '../config';
import {useAuth} from './AuthContext';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import {Button, List, Card, IconButton, Icon} from 'react-native-paper';
import {COLORS, FONTS} from '../constants';
import {useStockTransfer} from './StockTransferContext';

const StockTransferItemsEditMenu = ({invoice_no}) => {
  const {data} = useAuth();
  const {
    items,
    setItems,
    setNewProduct,
    initialItem,
    setItemStatus,
    setRowNoToUpdate,
    setSearchProductInput,
  } = useStockTransfer();
  const navigation = useNavigation();

  const [billedItemsExpanded, setBilledItemsExpanded] = useState(true);

  useEffect(() => {
    const getInvoiceItemsData = async company_name => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/api/getStockTransferItemsData?invoiceNo=${invoice_no}&company_name=${company_name}`,
        );
        let sNo = 0;
        const mappedItems = response.data.map(apiItem => ({
          sNo: sNo++,
          barcode: apiItem.barcode,
          productCode: apiItem.product_code,
          productName: apiItem.product_name,
          hsnCode: apiItem.hsn_code,
          unit: apiItem.unit,
          alt_unit: apiItem.alt_unit,
          uc_factor: apiItem.uc_factor,
          selectedUnit: apiItem.selected_unit,
          qty: apiItem.qty,
          purchasePrice: apiItem.purchase_price,
          salesPrice: apiItem.sales_price,
          mrp: apiItem.mrp,
          newPurchasePrice: apiItem.new_purchase_price,
          newSalesPrice: apiItem.new_sales_price,
          newMrp: apiItem.new_mrp,
          cost: apiItem.cost,
          purchaseInclusive: apiItem.purchase_inclusive,
          salesInclusive: apiItem.sales_inclusive,
          grossAmt: apiItem.gross_amt,
          taxable: apiItem.taxable,
          selectedTax: apiItem.seleted_tax,
          cgstP: apiItem.cgstP,
          cgst: apiItem.cgst,
          sgstP: apiItem.sgstP,
          sgst: apiItem.sgst,
          igstP: apiItem.igstP,
          igst: apiItem.igst,
          subTotal: apiItem.sub_total,
          unitOptions:
            apiItem.unit && apiItem.alt_unit
              ? [{option: apiItem.unit}, {option: apiItem.alt_unit}]
              : apiItem.unit && !apiItem.alt_unit
              ? [{option: apiItem.unit}]
              : [],
        }));
        setItems(mappedItems);
        // console.log(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    getInvoiceItemsData(data.company_name);
    // eslint-disable-next-line
  }, []);

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
                navigation.navigate('AddEditStockTransferItem');
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
                      <Text style={styles.billText}>Qty * Purchase Price</Text>
                    </View>
                    <View style={{flex: 1, alignItems: 'flex-end'}}>
                      <Text style={styles.billText}>
                        {item.qty} *{' '}
                        {parseFloat(item.newPurchasePrice).toFixed(2)} =
                        <Icon source="currency-inr" />
                        {parseFloat(item.qty * item.newPurchasePrice).toFixed(
                          2,
                        )}
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
          navigation.navigate('AddEditStockTransferItem');
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

export default StockTransferItemsEditMenu;

const styles = StyleSheet.create({
  billText: {
    fontSize: 12,
    fontFamily: FONTS.body4.fontFamily,
    color: COLORS.black,
  },
});
