import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import React, {useState, useCallback, useEffect} from 'react';
import axios from 'axios';
import {API_BASE_URL} from '../config';
import {useAuth} from './AuthContext';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import {Button, List, Card, IconButton, Icon} from 'react-native-paper';
import {COLORS, FONTS} from '../constants';
import {useProduction} from './ProductionContext';

const ProductionInvoiceItemsEditMenu = ({
  type,
  invoice_no,
  setItemsLoading,
}) => {
  const {data} = useAuth();
  if (type === 'production') {
    ({
      items,
      setItems,
      setNewProduct,
      initialItem,
      setItemStatus,
      setRowNoToUpdate,
      setSearchProductInput,
    } = useProduction());
  }
  const navigation = useNavigation();

  const [finishedExpanded, setFinishedExpanded] = useState(true);
  const [rawExpanded, setRawExpanded] = useState(true);

  // Filter items based on product type
  const finishedItems = items.filter(item => item.product_type === 'finished');
  const rawItems = items.filter(item => item.product_type === 'raw');

  useEffect(() => {
    const getInvoiceItemsData = async company_name => {
      setItemsLoading(true);
      try {
        const response = await axios.get(
          `${API_BASE_URL}/api/getInvoiceItemsData?type=${type}&invoiceNo=${invoice_no}&company_name=${company_name}`,
        );
        let sNo = 0;
        const mappedItems = response.data.map(apiItem => ({
          sNo: sNo++,
          product_type: apiItem.product_type,
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
          selectedTax: apiItem.selected_tax,
          cgstP: apiItem.cgstP,
          cgst: apiItem.cgst,
          sgstP: apiItem.sgstP,
          sgst: apiItem.sgst,
          igstP: apiItem.igstP,
          igst: apiItem.igst,
          discountP: apiItem.discountP,
          discount: apiItem.discount,
          subTotal: apiItem.sub_total,
          dropdownOptions: apiItem.barcodelist,
          unitOptions:
            apiItem.unit && apiItem.alt_unit
              ? [{option: apiItem.unit}, {option: apiItem.alt_unit}]
              : apiItem.unit && !apiItem.alt_unit
              ? [{option: apiItem.unit}]
              : [],
        }));
        setItems(mappedItems);
        // console.log(JSON.stringify(response.data));
      } catch (error) {
        console.log(error);
      } finally {
        setItemsLoading(false);
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

  const renderItemList = (items, product_type) => (
    <List.Accordion
      title={`Billed ${product_type === 'finished' ? 'Finished' : 'Raw'} Items`}
      expanded={product_type === 'finished' ? finishedExpanded : rawExpanded}
      onPress={() =>
        product_type === 'finished'
          ? setFinishedExpanded(!finishedExpanded)
          : setRawExpanded(!rawExpanded)
      }
      style={{
        backgroundColor: COLORS.inputbggreen,
        borderRadius: 5,
        marginBottom: 10,
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
            navigation.navigate('AddEditPurchaseItem', {
              type: type,
              product_type: items[index].product_type,
            });
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
                    {item.qty} * {parseFloat(item.newPurchasePrice).toFixed(2)}{' '}
                    =
                    <Icon source="currency-inr" />
                    {parseFloat(item.qty * item.newPurchasePrice).toFixed(2)}
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
  );

  return (
    <View>
      <View style={{padding: 20}}>
        {renderItemList(finishedItems, 'finished')}
        {renderItemList(rawItems, 'raw')}
      </View>
      {data.business_category !== 'FlowerShop' && (
        <View style={{flexDirection: 'row', justifyContent: 'center', gap: 10}}>
          <Button
            mode="outlined"
            icon="plus"
            onPress={() => {
              setNewProduct({...initialItem, product_type: 'finished'});
              setItemStatus('Add');
              setRowNoToUpdate(items.length);
              setSearchProductInput('');
              navigation.navigate('AddEditPurchaseItem', {
                type: type,
                product_type: 'finished',
              });
            }}
            buttonColor={COLORS.white}
            rippleColor={COLORS.lightRed}
            theme={{colors: {outline: COLORS.red, primary: COLORS.red}}}
            style={{flex: 1, maxWidth: 150}}>
            Add Finished
          </Button>
          <Button
            mode="outlined"
            icon="plus"
            onPress={() => {
              setNewProduct({...initialItem, product_type: 'raw'});
              setItemStatus('Add');
              setRowNoToUpdate(items.length);
              setSearchProductInput('');
              navigation.navigate('AddEditPurchaseItem', {
                type: type,
                product_type: 'raw',
              });
            }}
            buttonColor={COLORS.white}
            rippleColor={COLORS.lightRed}
            theme={{colors: {outline: COLORS.red, primary: COLORS.red}}}
            style={{flex: 1, maxWidth: 150}}>
            Add Raw
          </Button>
        </View>
      )}
    </View>
  );
};

export default ProductionInvoiceItemsEditMenu;

const styles = StyleSheet.create({
  billText: {
    fontSize: 12,
    fontFamily: FONTS.body4.fontFamily,
    color: COLORS.black,
  },
});
