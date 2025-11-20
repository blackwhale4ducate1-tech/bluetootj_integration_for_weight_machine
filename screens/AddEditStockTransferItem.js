// import {StyleSheet, Text, View, ScrollView, Dimensions} from 'react-native';
// import React, {useEffect, useState} from 'react';
// import {
//   Appbar,
//   TextInput,
//   Button,
//   Divider,
//   Card,
//   Icon,
//   Badge,
//   Checkbox,
// } from 'react-native-paper';
// import {useNavigation} from '@react-navigation/native';
// import SearchProductMenu from '../components/SearchProductMenu';
// import {COLORS, FONTS} from '../constants';
// import CustomStyles from '../components/AddEditModalStyles';
// import SearchSalesBarcodeMenu from '../components/SearchSalesBarcodeMenu';
// import {useStockTransfer} from '../components/StockTransferContext';
// import {useAuth} from '../components/AuthContext';
// import SearchUnitMenu from '../components/SearchUnitMenu';
// import SearchTaxMenu from '../components/SearchTaxMenu';

// const screenWidth = Dimensions.get('screen').width;

// const AddEditStockTransferItem = () => {
//   const navigation = useNavigation();
//   const {data} = useAuth();
//   const {
//     items,
//     setItems,
//     initialItem,
//     formDataFooter,
//     newProduct,
//     setNewProduct,
//     itemStatus,
//     setItemStatus,
//     rowNoToUpdate,
//     billingType,
//   } = useStockTransfer();

//   const handleSaveItem = () => {
//     if (itemStatus === 'Add') {
//       setItems(prevItems => [...prevItems, {...newProduct}]);
//     }
//     if (itemStatus === 'Edit') {
//       const updatedItems = items.map((item, index) => {
//         if (index === rowNoToUpdate) {
//           return newProduct;
//         }
//         return item;
//       });
//       setItems(updatedItems);
//     }
//     setNewProduct(initialItem);
//     // setSearchProductInput('');
//     navigation.navigate(billingType);
//   };

//   const handleSaveAndNewItem = () => {
//     if (itemStatus === 'Add') {
//       setItems(prevItems => [...prevItems, {...newProduct}]);
//     }
//     if (itemStatus === 'Edit') {
//       const updatedItems = items.map((item, index) => {
//         if (index === rowNoToUpdate) {
//           return newProduct;
//         }
//         return item;
//       });
//       setItems(updatedItems);
//     }
//     setNewProduct(initialItem);
//     setSearchProductInput('');
//     setItemStatus('Add');
//   };

//   const calculateRowValues = item => {
//     const qty = parseFloat(item.qty) || 0;
//     const purchasePrice = parseFloat(item.newPurchasePrice) || 0;
//     const purchaseInclusive = item.purchaseInclusive || 0;
//     let cost = 0;
//     const cgstP = parseFloat(item.cgstP) || 0;
//     const sgstP = parseFloat(item.sgstP) || 0;
//     const igstP = parseFloat(item.igstP) || 0;
//     let cgst = 0;
//     let sgst = 0;
//     let igst = 0;

//     if (purchaseInclusive === 1) {
//       cost = Number(purchasePrice / (1 + igstP / 100)).toFixed(2);
//     } else {
//       cost = purchasePrice;
//     }

//     const grossAmt = (Number(qty) * cost).toFixed(2);
//     const taxable = Number(grossAmt).toFixed(2);

//     if (
//       (data.itemwise_tax === 'not allow' &&
//         formDataFooter.tax.value === 'GST') ||
//       (data.itemwise_tax === 'allow' && item.selectedTax === 'GST')
//     ) {
//       cgst = ((Number(taxable) * cgstP) / 100).toFixed(2);
//       sgst = ((Number(taxable) * sgstP) / 100).toFixed(2);
//     } else if (
//       (data.itemwise_tax === 'not allow' &&
//         formDataFooter.tax.value === 'IGST') ||
//       (data.itemwise_tax === 'allow' && item.selectedTax === 'IGST')
//     ) {
//       igst = ((Number(taxable) * igstP) / 100).toFixed(2);
//     }
//     const subTotal = (
//       Number(taxable) +
//       Number(cgst) +
//       Number(sgst) +
//       Number(igst)
//     ).toFixed(2);

//     setNewProduct({
//       ...item,
//       cost,
//       grossAmt,
//       taxable,
//       cgst,
//       sgst,
//       igst,
//       subTotal,
//     });
//   };

//   const onChangeItem = (text, itemKey) => {
//     let parsedValue;
//     if (itemKey === 'purchaseInclusive') {
//       parsedValue = text;
//     } else {
//       parsedValue = parseFloat(text) || 0;
//     }
//     let updatedProduct = {...newProduct}; // Clone the current state
//     updatedProduct[itemKey] = parsedValue; // Update the specific property

//     if (itemKey === 'newPurchasePrice') {
//       let unitPurchasePrice;
//       if (
//         !newProduct.selectedUnit ||
//         newProduct.selectedUnit === newProduct.unit
//       ) {
//         unitPurchasePrice = parsedValue;
//       } else if (
//         !newProduct.selectedUnit ||
//         newProduct.selectedUnit === newProduct.alt_unit
//       ) {
//         unitPurchasePrice = parsedValue / newProduct.uc_factor;
//       }
//       updatedProduct.purchasePrice = unitPurchasePrice
//         ? parseFloat(unitPurchasePrice).toFixed(2)
//         : '';
//     }
//     calculateRowValues(updatedProduct);
//   };

//   return (
//     <View style={{flex: 1, backgroundColor: COLORS.white}}>
//       <Appbar.Header style={CustomStyles.appHeader}>
//         <Appbar.BackAction
//           onPress={() => {
//             navigation.navigate(billingType);
//           }}
//           color={COLORS.white}
//         />
//         <Appbar.Content
//           title="AddEditStockTransferItem"
//           titleStyle={CustomStyles.titleStyle}
//         />
//       </Appbar.Header>
//       <ScrollView>
//         <View style={{padding: 5}}>
//           {data.is_barcode_exist === 1 && (
//             <SearchSalesBarcodeMenu
//               type="stock_transfer"
//               formDataFooter={formDataFooter}
//             />
//           )}
//           <SearchProductMenu type="stock_transfer" />

//           <TextInput
//             mode="outlined"
//             label="Product Name"
//             value={newProduct.productName}
//             editable={false}
//             disabled={newProduct.productCode === ''}
//             style={{margin: 10}}
//             outlineColor={COLORS.black}
//             textColor={COLORS.black}
//             activeOutlineColor={COLORS.primary}
//           />
//           <SearchUnitMenu
//             type="stock_transfer"
//             unitOptions={newProduct.unitOptions}
//           />
//           <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
//             <View style={{flex: 1}}>
//               <TextInput
//                 mode="outlined"
//                 label="* Qty"
//                 value={newProduct.qty.toString()}
//                 onChangeText={text => onChangeItem(text, 'qty')}
//                 disabled={newProduct.productCode === ''}
//                 style={{margin: 10}}
//                 outlineColor={COLORS.black}
//                 textColor={COLORS.black}
//                 activeOutlineColor={COLORS.primary}
//               />
//             </View>
//             <View style={{flex: 1}}>
//               <TextInput
//                 mode="outlined"
//                 label="Purchase Price"
//                 value={newProduct.newPurchasePrice.toString()}
//                 onChangeText={text => onChangeItem(text, 'newPurchasePrice')}
//                 disabled={newProduct.productCode === ''}
//                 style={{margin: 10}}
//                 outlineColor={COLORS.black}
//                 textColor={COLORS.black}
//                 activeOutlineColor={COLORS.primary}
//               />
//             </View>
//           </View>
//         </View>
//         <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
//           <View style={{flex: 1}}>
//             <Checkbox.Item
//               label="Purchase Inclusive"
//               status={
//                 newProduct.purchaseInclusive === 1 ? 'checked' : 'unchecked'
//               }
//               onPress={() => {
//                 onChangeItem(
//                   newProduct.purchaseInclusive === 1 ? 0 : 1,
//                   'purchaseInclusive',
//                 );
//               }}
//               disabled={newProduct.productCode === ''}
//             />
//           </View>
//         </View>
//         {data.itemwise_tax === 'allow' && (
//           <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
//             <View style={{flex: 1}}>
//               <SearchTaxMenu type="stock_transfer" />
//             </View>
//           </View>
//         )}
//         {newProduct.productCode !== '' &&
//           newProduct.qty !== '' &&
//           newProduct.qty !== 0 && (
//             <Card style={styles.totalsContainer}>
//               <Card.Content>
//                 <Text style={styles.totalsTitle}>Totals and Taxes</Text>
//                 <Divider />
//                 <View style={styles.totalsContent}>
//                   <View style={styles.totalsItem}>
//                     <Text style={styles.totalsItemLabel}>Cost :</Text>
//                     <View style={styles.totalsItemValue}>
//                       <Icon source="currency-inr" style={styles.icon} />
//                       <Text style={styles.texticon}>{newProduct.cost}</Text>
//                     </View>
//                   </View>
//                   <View style={styles.totalsItem}>
//                     <Text style={styles.totalsItemLabel}>Gross Amount :</Text>
//                     <View style={styles.totalsItemValue}>
//                       <Icon source="currency-inr" style={styles.icon} />
//                       <Text style={styles.texticon}>{newProduct.grossAmt}</Text>
//                     </View>
//                   </View>
//                   <View style={styles.totalsItem}>
//                     <Text style={styles.totalsItemLabel}>Sub Total :</Text>
//                     <View style={styles.totalsItemValue}>
//                       <Icon source="currency-inr" style={styles.icon} />
//                       <Text style={styles.texticon}>{newProduct.subTotal}</Text>
//                     </View>
//                   </View>
//                 </View>
//                 <View style={{flexDirection: 'row', justifyContent: 'center'}}>
//                   <View style={styles.tableContainer}>
//                     <View style={styles.headerRow}>
//                       <Text style={styles.header}>Taxable</Text>
//                       {data.tax_type === 'GST' && (
//                         <>
//                           {' '}
//                           <Text style={styles.header}>CGST %</Text>
//                           <Text style={styles.header}>CGST</Text>
//                           <Text style={styles.header}>SGST %</Text>
//                           <Text style={styles.header}>SGST</Text>
//                         </>
//                       )}

//                       <Text style={styles.header}>
//                         {data.tax_type === 'GST' ? 'IGST %' : 'VAT %'}
//                       </Text>
//                       <Text style={styles.header}>
//                         {data.tax_type === 'GST' ? 'IGST' : 'VAT'}
//                       </Text>
//                     </View>
//                     <View style={styles.body}>
//                       <View style={styles.row}>
//                         <Text style={styles.cell}>{newProduct.taxable}</Text>
//                         {data.tax_type === 'GST' && (
//                           <>
//                             <Text style={styles.cell}>{newProduct.cgstP}</Text>
//                             <Text style={styles.cell}>{newProduct.cgst}</Text>
//                             <Text style={styles.cell}>{newProduct.sgstP}</Text>
//                             <Text style={styles.cell}>{newProduct.sgst}</Text>
//                           </>
//                         )}

//                         <Text style={styles.cell}>{newProduct.igstP}</Text>
//                         <Text style={styles.cell}>{newProduct.igst}</Text>
//                       </View>
//                     </View>
//                   </View>
//                 </View>
//               </Card.Content>
//             </Card>
//           )}
//       </ScrollView>
//       <View
//         style={{
//           flexDirection: 'row',
//           justifyContent: 'space-between',
//           paddingHorizontal: 16,
//           paddingBottom: 16,
//         }}>
//         <Button
//           onPress={handleSaveItem}
//           textColor={COLORS.white}
//           disabled={
//             newProduct.productCode === '' ||
//             newProduct.qty === '' ||
//             newProduct.qty === 0
//           }
//           style={[styles.btn, {marginRight: 8, backgroundColor: COLORS.red}]}>
//           <Text style={styles.btnText}>Save</Text>
//         </Button>
//         <Button
//           onPress={handleSaveAndNewItem}
//           buttonColor={COLORS.emerald}
//           textColor={COLORS.white}
//           disabled={
//             newProduct.productCode === '' ||
//             newProduct.qty === '' ||
//             newProduct.qty === 0
//           }
//           style={[
//             styles.btn,
//             {marginRight: 8, backgroundColor: COLORS.primary},
//           ]}>
//           <Text style={styles.btnText}>Save and New</Text>
//         </Button>
//       </View>
//     </View>
//   );
// };

// export default AddEditStockTransferItem;

// const styles = StyleSheet.create({
//   totalsContainer: {
//     backgroundColor: COLORS.white,
//     padding: 10,
//     borderRadius: 10,
//     marginVertical: 10,
//     shadowColor: '#000',
//     shadowOffset: {
//       width: 0,
//       height: 2,
//     },
//     shadowOpacity: 0.25,
//     shadowRadius: 3.84,
//     elevation: 5,
//   },
//   totalsTitle: {
//     fontSize: 16,
//     fontFamily: FONTS.body4.fontFamily,
//     fontWeight: '700',
//     color: COLORS.black,
//     marginBottom: 10,
//   },
//   totalsContent: {
//     marginTop: 10,
//   },
//   totalsItem: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 5,
//   },
//   totalsItemLabel: {
//     fontSize: 12,
//     fontFamily: FONTS.body4.fontFamily,
//     fontWeight: '700',
//     color: COLORS.black,
//     marginBottom: 10,
//   },
//   texticon: {
//     fontSize: 12,
//     fontFamily: FONTS.body4.fontFamily,
//     fontWeight: '700',
//     color: COLORS.black,
//   },
//   totalsItemValue: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   icon: {
//     marginRight: 5,
//   },
//   tableContainer: {
//     borderColor: COLORS.gray,
//     borderWidth: 1,
//     width: screenWidth * 0.9,
//   },
//   // <thead><tr>
//   headerRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     borderBottomWidth: 1,
//     padding: 2,
//   },
//   //<th>
//   header: {
//     flex: 1,
//     fontFamily: FONTS.body4.fontFamily,
//     fontSize: 10,
//     color: COLORS.black,
//     textAlign: 'center',
//     width: 130,
//   },
//   //<tbody>
//   body: {
//     marginTop: 5,
//     // height: '100%',
//   },
//   //<tbody><tr>
//   row: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     borderBottomWidth: 1,
//     borderColor: 'black',
//     padding: 2,
//   },
//   //<tbody><td>
//   cell: {
//     flex: 1,
//     textAlign: 'center',
//     fontFamily: FONTS.body4.fontFamily,
//     fontSize: 10,
//     color: COLORS.black,
//     width: 130,
//   },
//   //bootstrap text-end
//   textRight: {
//     textAlign: 'right',
//   },
//   //<tbody><th>
//   cellBold: {
//     flex: 1,
//     textAlign: 'center',
//     fontFamily: FONTS.body4.fontFamily,
//     color: COLORS.black,
//     width: 130,
//     fontWeight: '700',
//   },
//   btnText: {
//     color: COLORS.white,
//     fontFamily: FONTS.body4.fontFamily,
//     fontSize: 18,
//     fontWeight: '700',
//   },
//   btn: {
//     flex: 1,
//     borderRadius: 10,
//     height: 50,
//     justifyContent: 'center',
//   },
// });







import { StyleSheet, Text, View, ScrollView, Dimensions } from 'react-native';
import React, { useEffect, useState } from 'react';
import {Appbar,TextInput, Button, Divider, Card, Icon,Checkbox,} from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import SearchProductMenu from '../components/SearchProductMenu';
import { COLORS, FONTS } from '../constants';
import CustomStyles from '../components/AddEditModalStyles';
import SearchSalesBarcodeMenu from '../components/SearchSalesBarcodeMenu';
import { useStockTransfer } from '../components/StockTransferContext';
import { useAuth } from '../components/AuthContext';
import SearchUnitMenu from '../components/SearchUnitMenu';
import SearchTaxMenu from '../components/SearchTaxMenu';

const screenWidth = Dimensions.get('screen').width;

const AddEditStockTransferItem = () => {
  const navigation = useNavigation();
  const { data } = useAuth();
  const {
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
  } = useStockTransfer();

  const handleSaveItem = () => {
    if (itemStatus === 'Add') {
      setItems(prevItems => [...prevItems, { ...newProduct }]);
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
    navigation.navigate(billingType);
  };

  const handleSaveAndNewItem = () => {
    if (itemStatus === 'Add') {
      setItems(prevItems => [...prevItems, { ...newProduct }]);
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
    setItemStatus('Add');
  };

  const calculateRowValues = item => {
    // Handle missing or invalid item properties
    if (!item || !item.newPurchasePrice) {
      return {
        ...item,
        cost: '0.00',
        grossAmt: '0.00',
        taxable: '0.00',
        cgst: '0.00',
        sgst: '0.00',
        igst: '0.00',
        subTotal: '0.00',
        cgstP: item.cgstP || '0',
        sgstP: item.sgstP || '0',
        igstP: item.igstP || '0',
        qty: item.qty || '0', // Ensure qty has a default
      };
    }

    const qty = parseFloat(item.qty) || 0;
    const purchasePrice = parseFloat(item.newPurchasePrice) || 0;
    const purchaseInclusive = item.purchaseInclusive || 0;
    const cgstP = parseFloat(item.cgstP) || 0;
    const sgstP = parseFloat(item.sgstP) || 0;
    const igstP = parseFloat(item.igstP) || 0;

    let cost = purchaseInclusive === 1
      ? Number(purchasePrice / (1 + igstP / 100)).toFixed(2)
      : purchasePrice.toFixed(2);
    const grossAmt = (Number(qty) * Number(cost)).toFixed(2);
    const taxable = Number(grossAmt).toFixed(2);

    let cgst = 0, sgst = 0, igst = 0;
    if (
      (data.itemwise_tax === 'not allow' && formDataFooter.tax?.value === 'GST') ||
      (data.itemwise_tax === 'allow' && item.selectedTax === 'GST')
    ) {
      cgst = ((Number(taxable) * cgstP) / 100).toFixed(2);
      sgst = ((Number(taxable) * sgstP) / 100).toFixed(2);
    } else if (
      (data.itemwise_tax === 'not allow' && formDataFooter.tax?.value === 'IGST') ||
      (data.itemwise_tax === 'allow' && item.selectedTax === 'IGST')
    ) {
      igst = ((Number(taxable) * igstP) / 100).toFixed(2);
    }
    const subTotal = (Number(taxable) + Number(cgst) + Number(sgst) + Number(igst)).toFixed(2);

    const updatedItem = {
      ...item,
      cost,
      grossAmt,
      taxable,
      cgst,
      sgst,
      igst,
      subTotal,
      cgstP,
      sgstP,
      igstP,
      qty: item.qty || '0', // Preserve qty even if empty
    };

    setNewProduct(updatedItem);
    return updatedItem;
  };

  const onChangeItem = (text, itemKey) => {
    // Allow empty string for qty and newPurchasePrice to support clearing
    let parsedValue;
    if (itemKey === 'purchaseInclusive') {
      parsedValue = text;
    } else {
      parsedValue = text === '' ? '' : parseFloat(text) || 0; // Allow empty string
    }
    let updatedProduct = { ...newProduct };
    updatedProduct[itemKey] = parsedValue;

    if (itemKey === 'newPurchasePrice') {
      let unitPurchasePrice;
      if (
        !newProduct.selectedUnit ||
        newProduct.selectedUnit === newProduct.unit
      ) {
        unitPurchasePrice = parsedValue;
      } else if (
        !newProduct.selectedUnit ||
        newProduct.selectedUnit === newProduct.alt_unit
      ) {
        unitPurchasePrice = newProduct.uc_factor ? parsedValue / newProduct.uc_factor : parsedValue;
      }
      updatedProduct.purchasePrice = unitPurchasePrice
        ? parseFloat(unitPurchasePrice).toFixed(2)
        : '0.00';
    }

    calculateRowValues(updatedProduct);
  };

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.white }}>
      <Appbar.Header style={CustomStyles.appHeader}>
        <Appbar.BackAction
          onPress={() => {
            navigation.navigate(billingType);
          }}
          color={COLORS.white}
        />
        <Appbar.Content
          title="AddEditStockTransferItem"
          titleStyle={CustomStyles.titleStyle}
        />
      </Appbar.Header>
      <ScrollView>
        <View style={{ padding: 5 }}>
          {data.is_barcode_exist === 1 && (
            <SearchSalesBarcodeMenu
              type="stock_transfer"
              formDataFooter={formDataFooter}
            />
          )}
          <SearchProductMenu type="stock_transfer" />
          <TextInput
            mode="outlined"
            label="Product Name"
            value={newProduct.productName || ''}
            editable={false}
            disabled={newProduct.productCode === ''}
            style={{ margin: 10 }}
            outlineColor={COLORS.black}
            textColor={COLORS.black}
            activeOutlineColor={COLORS.primary}
          />
          <SearchUnitMenu
            type="stock_transfer"
            unitOptions={newProduct.unitOptions}
          />
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <View style={{ flex: 1 }}>
              <TextInput
                mode="outlined"
                label="* Qty"
                value={newProduct.qty ? newProduct.qty.toString() : ''}
                onChangeText={text => onChangeItem(text, 'qty')}
                disabled={newProduct.productCode === ''}
                style={{ margin: 10 }}
                outlineColor={COLORS.black}
                textColor={COLORS.black}
                activeOutlineColor={COLORS.primary}
                keyboardType="numeric"
              />
            </View>
            <View style={{ flex: 1 }}>
              <TextInput
                mode="outlined"
                label="Purchase Price"
                value={newProduct.newPurchasePrice ? newProduct.newPurchasePrice.toString() : ''}
                onChangeText={text => onChangeItem(text, 'newPurchasePrice')}
                disabled={newProduct.productCode === ''}
                style={{ margin: 10 }}
                outlineColor={COLORS.black}
                textColor={COLORS.black}
                activeOutlineColor={COLORS.primary}
                keyboardType="numeric"
              />
            </View>
          </View>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <View style={{ flex: 1 }}>
            <Checkbox.Item
              label="Purchase Inclusive"
              status={newProduct.purchaseInclusive === 1 ? 'checked' : 'unchecked'}
              onPress={() => {
                onChangeItem(
                  newProduct.purchaseInclusive === 1 ? 0 : 1,
                  'purchaseInclusive',
                );
              }}
              disabled={newProduct.productCode === ''}
            />
          </View>
        </View>
        {data.itemwise_tax === 'allow' && (
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <View style={{ flex: 1 }}>
              <SearchTaxMenu type="stock_transfer" />
            </View>
          </View>
        )}
        {newProduct.productCode && newProduct.qty && newProduct.qty !== '0' && (
          <Card style={styles.totalsContainer}>
            <Card.Content>
              <Text style={styles.totalsTitle}>Totals and Taxes</Text>
              <Divider />
              <View style={styles.totalsContent}>
                <View style={styles.totalsItem}>
                  <Text style={styles.totalsItemLabel}>Cost :</Text>
                  <View style={styles.totalsItemValue}>
                    <Icon source="currency-inr" style={styles.icon} />
                    <Text style={styles.texticon}>{newProduct.cost || '0.00'}</Text>
                  </View>
                </View>
                <View style={styles.totalsItem}>
                  <Text style={styles.totalsItemLabel}>Gross Amount :</Text>
                  <View style={styles.totalsItemValue}>
                    <Icon source="currency-inr" style={styles.icon} />
                    <Text style={styles.texticon}>{newProduct.grossAmt || '0.00'}</Text>
                  </View>
                </View>
                <View style={styles.totalsItem}>
                  <Text style={styles.totalsItemLabel}>Sub Total :</Text>
                  <View style={styles.totalsItemValue}>
                    <Icon source="currency-inr" style={styles.icon} />
                    <Text style={styles.texticon}>{newProduct.subTotal || '0.00'}</Text>
                  </View>
                </View>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
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
                      {data.tax_type === 'GST' ? 'IGST %' : 'VAT %'}
                    </Text>
                    <Text style={styles.header}>
                      {data.tax_type === 'GST' ? 'IGST' : 'VAT'}
                    </Text>
                  </View>
                  <View style={styles.body}>
                    <View style={styles.row}>
                      <Text style={styles.cell}>{newProduct.taxable || '0.00'}</Text>
                      {data.tax_type === 'GST' && (
                        <>
                          <Text style={styles.cell}>{newProduct.cgstP || '0'}</Text>
                          <Text style={styles.cell}>{newProduct.cgst || '0.00'}</Text>
                          <Text style={styles.cell}>{newProduct.sgstP || '0'}</Text>
                          <Text style={styles.cell}>{newProduct.sgst || '0.00'}</Text>
                        </>
                      )}
                      <Text style={styles.cell}>{newProduct.igstP || '0'}</Text>
                      <Text style={styles.cell}>{newProduct.igst || '0.00'}</Text>
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
            !newProduct.qty ||
            newProduct.qty === '0'
          }
          style={[styles.btn, { marginRight: 8, backgroundColor: COLORS.red }]}>
          <Text style={styles.btnText}>Save</Text>
        </Button>
        <Button
          onPress={handleSaveAndNewItem}
          buttonColor={COLORS.emerald}
          textColor={COLORS.white}
          disabled={
            newProduct.productCode === '' ||
            !newProduct.qty ||
            newProduct.qty === '0'
          }
          style={[styles.btn, { marginRight: 8, backgroundColor: COLORS.primary }]}>
          <Text style={styles.btnText}>Save and New</Text>
        </Button>
      </View>
    </View>
  );
};

export default AddEditStockTransferItem;

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
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    padding: 2,
  },
  header: {
    flex: 1,
    fontFamily: FONTS.body4.fontFamily,
    fontSize: 10,
    color: COLORS.black,
    textAlign: 'center',
    width: 130,
  },
  body: {
    marginTop: 5,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: 'black',
    padding: 2,
  },
  cell: {
    flex: 1,
    textAlign: 'center',
    fontFamily: FONTS.body4.fontFamily,
    fontSize: 10,
    color: COLORS.black,
    width: 130,
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