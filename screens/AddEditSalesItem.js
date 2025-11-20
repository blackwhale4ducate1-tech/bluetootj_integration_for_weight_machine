import {StyleSheet, Text, View, ScrollView, Dimensions} from 'react-native';
import React, {useEffect, useState, useCallback} from 'react';
import {
  Appbar,
  TextInput,
  Button,
  Divider,
  Card,
  Icon,
  Badge,
  Checkbox,
} from 'react-native-paper';
import {useNavigation, useRoute} from '@react-navigation/native';
import SearchProductMenu from '../components/SearchProductMenu';
import {useSales} from '../components/SalesContext';
import {COLORS, FONTS} from '../constants';
import CustomStyles from '../components/AddEditModalStyles';
import SearchSalesBarcodeMenu from '../components/SearchSalesBarcodeMenu';
import {useAuth} from '../components/AuthContext';
import {useEstimate} from '../components/EstimateContext';
import SearchUnitMenu from '../components/SearchUnitMenu';
import SearchTaxMenu from '../components/SearchTaxMenu';
import {usePettySales} from '../components/PettySalesContext';

const screenWidth = Dimensions.get('screen').width;

const AddEditSalesItem = () => {
  const route = useRoute();
  const {type, mopSettings, invoice_no} = route.params;
  const navigation = useNavigation();
  const {data} = useAuth();

  if (type === 'sales' || type === 'sales_order') {
    ({
      items,
      setItems,
      initialItem,
      formDataFooter,
      newProduct,
      setNewProduct,
      itemStatus,
      setItemStatus,
      rowNoToUpdate,
      billingType,
    } = useSales());
  } else if (type === 'estimate') {
    ({
      items,
      setItems,
      initialItem,
      formDataFooter,
      newProduct,
      setNewProduct,
      itemStatus,
      setItemStatus,
      rowNoToUpdate,
      billingType,
    } = useEstimate());
  } else if (type === 'pettySales') {
    ({
      items,
      setItems,
      initialItem,
      formDataFooter,
      newProduct,
      setNewProduct,
      itemStatus,
      setItemStatus,
      rowNoToUpdate,
      billingType,
    } = usePettySales());
  }

  const handleSaveItem = () => {
    if (itemStatus === 'Add') {
      setItems(prevItems => [...prevItems, {...newProduct}]);
    }
    if (itemStatus === 'Edit') {
      const updatedItems = items.map((item, index) => {
        if (index === rowNoToUpdate) {
          return newProduct;
        }
        return item;
      });
      setItems(updatedItems);
    }
    setNewProduct(initialItem);
    // setSearchProductInput('');
    if (invoice_no) {
      // Navigate back to edit screen with invoice_no
      navigation.navigate('SalesEditBilling', {
        screen: 'salesEdit',
        params: {invoice_no: invoice_no},
      });
    } else {
      navigation.navigate(billingType);
    }
  };

  const handleSaveAndNewItem = () => {
    if (itemStatus === 'Add') {
      setItems(prevItems => [...prevItems, {...newProduct}]);
    }
    if (itemStatus === 'Edit') {
      const updatedItems = items.map((item, index) => {
        if (index === rowNoToUpdate) {
          return newProduct;
        }
        return item;
      });
      setItems(updatedItems);
    }
    setNewProduct(initialItem);
    setSearchProductInput('');
    setItemStatus('Add');
  };

  const calculateRowValues = item => {
    const qty = parseFloat(item.qty) || 0;
    const salesPrice = parseFloat(item.newSalesPrice) || 0;
    const salesInclusive = item.salesInclusive || 0;
    let cost = 0;
    // const discount = parseFloat(item.discount) || 0;
    const cgstP = parseFloat(item.cgstP) || 0;
    const sgstP = parseFloat(item.sgstP) || 0;
    const igstP = parseFloat(item.igstP) || 0;
    let cgst = 0;
    let sgst = 0;
    let igst = 0;

    if (salesInclusive === 1) {
      cost = Number(salesPrice / (1 + igstP / 100)).toFixed(2);
    } else {
      cost = salesPrice;
    }

    const grossAmt = (Number(qty) * cost).toFixed(2);
    const discount = ((parseFloat(item.discountP) || 0) * grossAmt) / 100;
    const taxable = (Number(grossAmt) - discount).toFixed(2);

    if (
      (data.itemwise_tax === 'not allow' &&
        formDataFooter.tax.value === 'GST') ||
      (data.itemwise_tax === 'allow' && item.selectedTax === 'GST')
    ) {
      cgst = ((Number(taxable) * cgstP) / 100).toFixed(2);
      sgst = ((Number(taxable) * sgstP) / 100).toFixed(2);
    } else if (
      (data.itemwise_tax === 'not allow' &&
        formDataFooter.tax.value === 'IGST') ||
      (data.itemwise_tax === 'allow' && item.selectedTax === 'IGST')
    ) {
      igst = ((Number(taxable) * igstP) / 100).toFixed(2);
    }
    const subTotal = (
      Number(taxable) +
      Number(cgst) +
      Number(sgst) +
      Number(igst)
    ).toFixed(2);

    setNewProduct({
      ...item,
      cost,
      grossAmt,
      taxable,
      cgst,
      sgst,
      igst,
      discount: discount.toFixed(2),
      subTotal,
    });
  };

  const onChangeItem = useCallback(
    (text, itemKey) => {
      let parsedValue;
      let updatedProduct = {...newProduct}; // Clone the current state

      if (itemKey === 'salesInclusive') {
        parsedValue = text;
      } else if (itemKey === 'subTotal') {
        // Handle subTotal input directly
        parsedValue = text;
        const qty = parseFloat(newProduct.qty) || 1;
        const cgstP = parseFloat(newProduct.cgstP) || 0;
        const sgstP = parseFloat(newProduct.sgstP) || 0;
        const igstP = parseFloat(newProduct.igstP) || 0;
        const discountP = parseFloat(newProduct.discountP) || 0;
        const salesInclusive = newProduct.salesInclusive || 0;

        let taxable, newSalesPrice;

        if (
          (data.itemwise_tax === 'not allow' &&
            formDataFooter.tax.value === 'GST') ||
          (data.itemwise_tax === 'allow' && newProduct.selectedTax === 'GST')
        ) {
          taxable = parseFloat(parsedValue) / (1 + (cgstP + sgstP) / 100);
        } else if (
          (data.itemwise_tax === 'not allow' &&
            formDataFooter.tax.value === 'IGST') ||
          (data.itemwise_tax === 'allow' && newProduct.selectedTax === 'IGST')
        ) {
          taxable = parseFloat(parsedValue) / (1 + igstP / 100);
        } else {
          taxable = parseFloat(parsedValue);
        }

        const grossAmt = taxable / (1 - discountP / 100);
        let cost = grossAmt / qty;

        if (salesInclusive === 1) {
          if (igstP > 0) {
            cost = cost / (1 + igstP / 100);
          } else if (cgstP > 0 || sgstP > 0) {
            cost = cost / (1 + (cgstP + sgstP) / 100);
          }
        }

        newSalesPrice = cost;
        updatedProduct.newSalesPrice = newSalesPrice.toFixed(2);
        updatedProduct.taxable = taxable.toFixed(2);
        updatedProduct.grossAmt = grossAmt.toFixed(2);
        updatedProduct.cost = cost.toFixed(2);
      } else {
        // Store numeric values as strings to preserve decimal input
        parsedValue = text;
      }
      updatedProduct[itemKey] = parsedValue; // Update the specific property
      // Update related properties if necessary
      if (itemKey === 'discountP') {
        // When discountP changes, update the discount value
        const grossAmt = parseFloat(newProduct.grossAmt) || 0;
        const discount = ((parseFloat(parsedValue) || 0) * grossAmt) / 100;
        updatedProduct.discount = discount.toFixed(2);
      } else if (itemKey === 'discount') {
        // When discount changes, update the discountP value
        const grossAmt = parseFloat(newProduct.grossAmt) || 0;
        const discount = parseFloat(parsedValue) || 0;
        const discountP = (discount * 100) / grossAmt;
        updatedProduct.discountP = discountP.toFixed(2);
      } else if (itemKey === 'newSalesPrice') {
        let unitSalesPrice;
        if (
          !newProduct.selectedUnit ||
          newProduct.selectedUnit === newProduct.unit
        ) {
          unitSalesPrice = parseFloat(parsedValue) || 0;
        } else if (
          !newProduct.selectedUnit ||
          newProduct.selectedUnit === newProduct.alt_unit
        ) {
          unitSalesPrice =
            (parseFloat(parsedValue) || 0) / newProduct.uc_factor;
        }
        updatedProduct.salesPrice = unitSalesPrice
          ? parseFloat(unitSalesPrice).toFixed(2)
          : '';
      }
      calculateRowValues(updatedProduct);
    },
    [
      newProduct,
      calculateRowValues,
      formDataFooter.tax.value,
      data.itemwise_tax,
    ],
  );

  return (
    <View style={{flex: 1, backgroundColor: COLORS.white}}>
      <Appbar.Header style={CustomStyles.appHeader}>
        <Appbar.BackAction
          onPress={() => {
            if (invoice_no) {
              // Navigate back to edit screen with invoice_no
              navigation.navigate('SalesEditBilling', {
                screen: 'salesEdit',
                params: {invoice_no: invoice_no},
              });
            } else {
              navigation.navigate(billingType);
            }
          }}
          color={COLORS.white}
        />
        <Appbar.Content
          title="AddEditItem"
          titleStyle={CustomStyles.titleStyle}
        />
      </Appbar.Header>
      <ScrollView>
        <View style={{padding: 5}}>
          {data.is_barcode_exist === 1 &&
            !(
              type === 'estimate' &&
              data.negative_stock === 'allow' &&
              data.estimate_accounts_add_status === 0
            ) && (
              <SearchSalesBarcodeMenu
                type={type}
                formDataFooter={formDataFooter}
              />
            )}
          <SearchProductMenu type={type} />
          <TextInput
            mode="outlined"
            label="Product Name"
            value={newProduct.productName}
            editable={false}
            disabled={newProduct.productCode === ''}
            style={{margin: 10}}
            outlineColor={COLORS.black}
            textColor={COLORS.black}
            activeOutlineColor={COLORS.primary}
          />
          {(!mopSettings || Number(mopSettings.isUnitandDiscountExistInAddSales) === 1) && (
            <SearchUnitMenu type={type} unitOptions={newProduct.unitOptions} />
          )}
          <View style={{flex: 1}}>
            <TextInput
              mode="outlined"
              label="Description"
              value={newProduct.description}
              onChangeText={text => onChangeItem(text, 'description')}
              disabled={newProduct.productCode === ''}
              style={{margin: 10}}
              outlineColor={COLORS.black}
              textColor={COLORS.black}
              activeOutlineColor={COLORS.primary}
            />
          </View>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <View style={{flex: 1}}>
              <TextInput
                mode="outlined"
                label="* Qty"
                value={newProduct.qty.toString()}
                onChangeText={text => onChangeItem(text, 'qty')}
                disabled={newProduct.productCode === ''}
                style={{margin: 10}}
                outlineColor={COLORS.black}
                textColor={COLORS.black}
                activeOutlineColor={COLORS.primary}
                keyboardType="decimal-pad"
              />
            </View>
            <View style={{flex: 1}}>
              <TextInput
                mode="outlined"
                label="Sales Price"
                value={newProduct.newSalesPrice.toString()}
                onChangeText={text => onChangeItem(text, 'newSalesPrice')}
                disabled={newProduct.productCode === ''}
                style={{margin: 10}}
                outlineColor={COLORS.black}
                textColor={COLORS.black}
                activeOutlineColor={COLORS.primary}
                keyboardType="decimal-pad"
              />
            </View>
          </View>
          {data.business_category !== 'FlowerShop' && (
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <View style={{flex: 1}}>
                <Checkbox.Item
                  label="Sales Inclusive"
                  status={
                    newProduct.salesInclusive === 1 ? 'checked' : 'unchecked'
                  }
                  onPress={() => {
                    onChangeItem(
                      newProduct.salesInclusive === 1 ? 0 : 1,
                      'salesInclusive',
                    );
                  }}
                  disabled={newProduct.productCode === ''}
                />
              </View>
            </View>
          )}
          {data.itemwise_tax === 'allow' &&
            data.business_category !== 'FlowerShop' && (
              <View
                style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <View style={{flex: 1}}>
                  <SearchTaxMenu type={type} />
                </View>
              </View>
            )}
          {data.business_category !== 'FlowerShop' && (!mopSettings || Number(mopSettings.isUnitandDiscountExistInAddSales) === 1) && (
            <>
              <View
                style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <View style={{flex: 1}}>
                  <TextInput
                    mode="outlined"
                    label="Discount %"
                    value={newProduct.discountP.toString()}
                    onChangeText={text => onChangeItem(text, 'discountP')}
                    disabled={newProduct.productCode === ''}
                    style={{margin: 10}}
                    outlineColor={COLORS.black}
                    textColor={COLORS.black}
                    activeOutlineColor={COLORS.primary}
                    keyboardType="decimal-pad"
                  />
                </View>
                <View style={{flex: 1}}>
                  <TextInput
                    mode="outlined"
                    label="Discount"
                    value={newProduct.discount.toString()}
                    onChangeText={text => onChangeItem(text, 'discount')}
                    disabled={newProduct.productCode === ''}
                    style={{margin: 10}}
                    outlineColor={COLORS.black}
                    textColor={COLORS.black}
                    activeOutlineColor={COLORS.primary}
                    keyboardType="decimal-pad"
                  />
                </View>
              </View>
            </>
          )}
        </View>
        {newProduct.productCode !== '' &&
          newProduct.qty !== '' &&
          newProduct.qty !== 0 && (
            <Card style={styles.totalsContainer}>
              <Card.Content>
                <Text style={styles.totalsTitle}>Totals and Taxes</Text>
                <Divider />
                <View style={styles.totalsContent}>
                  <View style={styles.totalsItem}>
                    <Text style={styles.totalsItemLabel}>MRP :</Text>
                    <View style={styles.totalsItemValue}>
                      <Icon source="currency-inr" style={styles.icon} />
                      <Text style={styles.texticon}>{newProduct.newMrp}</Text>
                    </View>
                  </View>
                  <View style={styles.totalsItem}>
                    <Text style={styles.totalsItemLabel}>Gross Amount :</Text>
                    <View style={styles.totalsItemValue}>
                      <Icon source="currency-inr" style={styles.icon} />
                      <Text style={styles.texticon}>{newProduct.grossAmt}</Text>
                    </View>
                  </View>
                  <View style={styles.totalsItem}>
                    <Text style={styles.totalsItemLabel}>Sub Total :</Text>
                    {data.isSubTotalAsInput !== 1 ? (
                      <View style={styles.totalsItemValue}>
                        <Icon source="currency-inr" style={styles.icon} />
                        <Text style={styles.texticon}>
                          {newProduct.subTotal}
                        </Text>
                      </View>
                    ) : (
                      <TextInput
                        mode="outlined"
                        value={newProduct.subTotal.toString()}
                        onChangeText={text => onChangeItem(text, 'subTotal')}
                        style={{flex: 1, marginLeft: 10}}
                        outlineColor={COLORS.black}
                        textColor={COLORS.black}
                        activeOutlineColor={COLORS.primary}
                        keyboardType="decimal-pad"
                      />
                    )}
                  </View>
                </View>
                <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                  <View style={styles.tableContainer}>
                    <View style={styles.headerRow}>
                      <Text style={styles.header}>Taxable</Text>
                      {data.tax_type === 'GST' && (
                        <>
                          <Text style={styles.header}>CGST %</Text>
                          <Text style={styles.header}>CGST</Text>
                          <Text style={styles.header}>SGST %</Text>
                          <Text style={styles.header}>SGST</Text>
                        </>
                      )}

                      <Text style={styles.header}>
                        {data.tax_type === 'VAT' ? 'VAT %' : 'IGST %'}
                      </Text>
                      <Text style={styles.header}>
                        {data.tax_type === 'VAT' ? 'VAT' : 'IGST'}
                      </Text>
                    </View>
                    <View style={styles.body}>
                      <View style={styles.row}>
                        <Text style={styles.cell}>{newProduct.taxable}</Text>
                        {data.tax_type === 'GST' && (
                          <>
                            <Text style={styles.cell}>{newProduct.cgstP}</Text>
                            <Text style={styles.cell}>{newProduct.cgst}</Text>
                            <Text style={styles.cell}>{newProduct.sgstP}</Text>
                            <Text style={styles.cell}>{newProduct.sgst}</Text>
                          </>
                        )}

                        <Text style={styles.cell}>{newProduct.igstP}</Text>
                        <Text style={styles.cell}>{newProduct.igst}</Text>
                      </View>
                    </View>
                  </View>
                </View>
              </Card.Content>
            </Card>
          )}
      </ScrollView>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingHorizontal: 16,
          paddingBottom: 16,
        }}>
        <Button
          onPress={handleSaveItem}
          textColor={COLORS.white}
          disabled={
            newProduct.productCode === '' ||
            newProduct.qty === '' ||
            newProduct.qty === 0
          }
          style={[styles.btn, {marginRight: 8, backgroundColor: COLORS.red}]}>
          <Text style={styles.btnText}>Save</Text>
        </Button>
        <Button
          onPress={handleSaveAndNewItem}
          buttonColor={COLORS.emerald}
          textColor={COLORS.white}
          disabled={
            newProduct.productCode === '' ||
            newProduct.qty === '' ||
            newProduct.qty === 0
          }
          style={[
            styles.btn,
            {marginRight: 8, backgroundColor: COLORS.primary},
          ]}>
          <Text style={styles.btnText}>Save and New</Text>
        </Button>
      </View>
    </View>
  );
};

export default AddEditSalesItem;

const styles = StyleSheet.create({
  totalsContainer: {
    backgroundColor: COLORS.white,
    padding: 10,
    borderRadius: 10,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  totalsTitle: {
    fontSize: 16,
    fontFamily: FONTS.body4.fontFamily,
    fontWeight: '700',
    color: COLORS.black,
    marginBottom: 10,
  },
  totalsContent: {
    marginTop: 10,
  },
  totalsItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  totalsItemLabel: {
    fontSize: 12,
    fontFamily: FONTS.body4.fontFamily,
    fontWeight: '700',
    color: COLORS.black,
    marginBottom: 10,
  },
  texticon: {
    fontSize: 12,
    fontFamily: FONTS.body4.fontFamily,
    fontWeight: '700',
    color: COLORS.black,
  },
  totalsItemValue: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 5,
  },
  tableContainer: {
    borderColor: COLORS.gray,
    borderWidth: 1,
    width: screenWidth * 0.9,
  },
  // <thead><tr>
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    padding: 2,
  },
  //<th>
  header: {
    flex: 1,
    fontFamily: FONTS.body4.fontFamily,
    fontSize: 10,
    color: COLORS.black,
    textAlign: 'center',
    width: 130,
  },
  //<tbody>
  body: {
    marginTop: 5,
    // height: '100%',
  },
  //<tbody><tr>
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: 'black',
    padding: 2,
  },
  //<tbody><td>
  cell: {
    flex: 1,
    textAlign: 'center',
    fontFamily: FONTS.body4.fontFamily,
    fontSize: 10,
    color: COLORS.black,
    width: 130,
  },
  //bootstrap text-end
  textRight: {
    textAlign: 'right',
  },
  //<tbody><th>
  cellBold: {
    flex: 1,
    textAlign: 'center',
    fontFamily: FONTS.body4.fontFamily,
    color: COLORS.black,
    width: 130,
    fontWeight: '700',
  },
  btnText: {
    color: COLORS.white,
    fontFamily: FONTS.body4.fontFamily,
    fontSize: 18,
    fontWeight: '700',
  },
  btn: {
    flex: 1,
    borderRadius: 10,
    height: 50,
    justifyContent: 'center',
  },
});
