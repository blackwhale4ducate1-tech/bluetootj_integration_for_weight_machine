import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {useState, useCallback} from 'react';
import axios from 'axios';
import {API_BASE_URL} from '../config';
import {useAuth} from './AuthContext';
import SelectProductForMultiplePriceModal from './SelectProductForMultiplePriceModal';
import SearchSalesProductModal from './SearchSalesProductModal';
import {
  COLORS,
  MaterialIcons,
  FontAwesome6,
  FontAwesome,
  MaterialCommunityIcons,
} from '../constants';
import Styles from '../screens/BillingItemStyles';

const SalesInvoiceItemsTable = ({
  items,
  initialItem,
  updateItems,
  formDataFooter,
  is_barcode_exist,
}) => {
  const {data} = useAuth();
  const [rowNo, setRowNo] = useState(0);
  const [showProductModal, setShowProductModal] = useState(false);
  const [showBarcodeModal, setShowBarcodeModal] = useState(false);
  const [barcodeSearchResult, setBarcodeSearchResult] = useState([]);

  const handleCloseProductModal = useCallback(() => {
    setShowProductModal(false);
  }, []);

  const handleOpenProductModal = useCallback(rowIndex => {
    setRowNo(rowIndex);
    setShowProductModal(true);
  }, []);

  const handleCloseBarcodeModal = useCallback(() => {
    setShowBarcodeModal(false);
  }, []);

  const handleOpenBarcodeModal = useCallback(rowIndex => {
    setRowNo(rowIndex);
    setShowBarcodeModal(true);
  }, []);

  const handleChangeBarcode = async (barcodeEntered, rowIndex) => {
    // setRowNo(rowIndex);
    updateItems(prevItems => {
      const updatedItems = [...prevItems];
      const updatedItem = {...updatedItems[rowIndex]};
      updatedItem.barcode = barcodeEntered;

      updatedItems[rowIndex] = updatedItem;
      return updatedItems;
    });
    try {
      const res = await axios.post(`${API_BASE_URL}/api/searchBarcodeByInput`, {
        searchBarcodeInput: barcodeEntered,
        company_name: data.company_name,
      });
      const BarcodeResult = res.data.message;
      setBarcodeSearchResult(res.data.message);
      if (BarcodeResult.length === 1) {
        updateItems(prevItems => {
          const updatedItems = [...prevItems];
          const updatedItem = {...updatedItems[rowIndex]};
          updatedItem.productCode = BarcodeResult[0].product_code;
          updatedItem.productName = BarcodeResult[0].product_name;
          updatedItem.hsnCode = BarcodeResult[0].hsn_code;
          updatedItem.qty = '';
          updatedItem.purchasePrice = BarcodeResult[0].purchase_price;
          updatedItem.salesPrice = BarcodeResult[0].sales_price;
          // updatedItem.salesPriceInStock = BarcodeResult[0].sales_price;
          updatedItem.mrp = BarcodeResult[0].mrp;
          updatedItem.cost =
            BarcodeResult[0].sales_inclusive === 1
              ? (
                  BarcodeResult[0].sales_price /
                  (1 + BarcodeResult[0].igst / 100)
                ).toFixed(2)
              : BarcodeResult[0].sales_price;
          updatedItem.purchaseInclusive =
            BarcodeResult[0].purchase_inclusive || 0;
          updatedItem.salesInclusive = BarcodeResult[0].sales_inclusive || 0;
          updatedItem.grossAmt = '';
          updatedItem.taxable = '';
          updatedItem.cgstP = BarcodeResult[0].cgst || '';
          updatedItem.cgst = '';
          updatedItem.sgstP = BarcodeResult[0].sgst || '';
          updatedItem.sgst = '';
          updatedItem.igstP = BarcodeResult[0].igst || '';
          updatedItem.igst = '';
          updatedItem.discountP = BarcodeResult[0].discountP || 0;
          updatedItem.discount = 0;
          updatedItem.subTotal = '';

          updatedItems[rowIndex] = updatedItem;
          return updatedItems;
        });
      } else if (BarcodeResult.length === 0) {
        updateItems(prevItems => {
          const updatedItems = [...prevItems];
          const updatedItem = {...updatedItems[rowIndex]};
          updatedItem.productCode = '';
          updatedItem.productName = '';
          updatedItem.hsnCode = '';
          updatedItem.qty = '';
          updatedItem.purchasePrice = '';
          updatedItem.salesPrice = '';
          // updatedItem.salesPriceInStock = '';
          updatedItem.mrp = '';
          updatedItem.cost = '';
          updatedItem.purchaseInclusive = '';
          updatedItem.salesInclusive = '';
          updatedItem.grossAmt = '';
          updatedItem.taxable = '';
          updatedItem.cgstP = '';
          updatedItem.cgst = '';
          updatedItem.sgstP = '';
          updatedItem.sgst = '';
          updatedItem.igstP = '';
          updatedItem.igst = '';
          updatedItem.discountP = '';
          updatedItem.discount = '';
          updatedItem.subTotal = '';

          updatedItems[rowIndex] = updatedItem;
          return updatedItems;
        });
      } else if (BarcodeResult.length > 1) {
        handleOpenBarcodeModal(rowIndex);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleAddRow = useCallback(() => {
    updateItems(prevItems => [...prevItems, {...initialItem}]);
  }, [initialItem, updateItems]);

  const onClickDel = index => {
    if (items.length === 1) {
      return; // Do not delete the only row/item
    }

    updateItems(prevItems => {
      const updatedItems = [...prevItems];
      updatedItems.splice(index, 1);
      return updatedItems;
    });

    setRowNo(prevRowNo => {
      if (prevRowNo === index) {
        // If the deleted row was the one being edited, reset the rowNo
        return 0;
      } else if (prevRowNo > index) {
        // If the deleted row was before the current rowNo, decrement the rowNo
        return prevRowNo - 1;
      } else {
        // If the deleted row was after the current rowNo, no need to update rowNo
        return prevRowNo;
      }
    });
  };

  const calculateRowValues = useCallback(
    item => {
      // console.log("item: " + JSON.stringify(item));
      const qty = parseFloat(item.qty) || 0;
      const salesPrice = parseFloat(item.salesPrice) || 0;
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
      const discount = (item.discountP * grossAmt) / 100;
      const taxable = (Number(grossAmt) - discount).toFixed(2);
      if (formDataFooter.tax.value === 'GST') {
        cgst = ((Number(taxable) * cgstP) / 100).toFixed(2);
        sgst = ((Number(taxable) * sgstP) / 100).toFixed(2);
      } else if (formDataFooter.tax.value === 'IGST') {
        igst = ((Number(taxable) * igstP) / 100).toFixed(2);
      }
      const subTotal = (
        Number(taxable) +
        Number(cgst) +
        Number(sgst) +
        Number(igst)
      ).toFixed(2);

      return {
        ...item,
        cost,
        grossAmt,
        taxable,
        cgst,
        sgst,
        igst,
        discount: discount.toFixed(2),
        subTotal,
      };
    },
    [formDataFooter.tax.value],
  );

  const onChangeItem = useCallback(
    (value, index, itemKey) => {
      const parsedValue = parseFloat(value);

      updateItems(prevItems => {
        const updatedItems = prevItems.map((item, i) => {
          if (i === index) {
            let updatedItem = {...item, [itemKey]: value};

            if (itemKey === 'discountP') {
              // When discountP changes, update the discount value
              const grossAmt = parseFloat(item.grossAmt) || 0;
              const discount = (parsedValue * grossAmt) / 100;
              updatedItem = {...updatedItem, discount: discount.toFixed(2)};
            } else if (itemKey === 'discount') {
              // When discount changes, update the discountP value
              const grossAmt = parseFloat(item.grossAmt) || 0;
              const discount = parseFloat(parsedValue) || 0;
              const discountP = (discount * 100) / grossAmt;
              updatedItem = {...updatedItem, discountP: discountP.toFixed(2)};
            }

            return {
              ...updatedItem,
              ...calculateRowValues(updatedItem),
            };
          }
          return item;
        });
        return updatedItems;
      });
    },
    [updateItems, calculateRowValues],
  );

  return (
    <View style={{margin: 10}}>
      <ScrollView>
        {items.map((item, index) => (
          <View key={index}>
            <View style={styles.cardHeader}>
              {items.length > 1 && (
                <TouchableOpacity onPress={() => onClickDel(index)}>
                  <MaterialIcons
                    name="delete-sweep"
                    color={COLORS.red}
                    size={26}
                  />
                </TouchableOpacity>
              )}
              <View>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}>
                  <MaterialIcons
                    name="production-quantity-limits"
                    color={COLORS.primary}
                    size={20}
                  />
                  <Text style={Styles.label}>{index + 1} Product Code </Text>
                </View>

                <TextInput
                  style={styles.input}
                  value={item.productCode}
                  onChangeText={() => handleOpenProductModal(index)}
                />
              </View>
              {is_barcode_exist === 1 && (
                <View>
                  <Text>Barcode</Text>
                  <TextInput
                    style={styles.input}
                    value={item.barcode.toString()}
                    onChangeText={text => handleChangeBarcode(text, index)}
                  />
                </View>
              )}
              <View style={styles.column}>
                <Text>Qty</Text>
                <TextInput
                  style={styles.input}
                  value={item.qty.toString()}
                  onChangeText={text => onChangeItem(text, index, 'qty')}
                  keyboardType="numeric"
                />
              </View>
              <View style={styles.column}>
                <Text>Sales Price</Text>
                <TextInput
                  style={styles.input}
                  value={item.salesPrice.toString()}
                  onChangeText={text => onChangeItem(text, index, 'salesPrice')}
                  keyboardType="numeric"
                />
              </View>
              <View style={styles.column}>
                <Text>Discount %</Text>
                <TextInput
                  style={styles.input}
                  value={item.discountP.toString()}
                  onChangeText={text => onChangeItem(text, index, 'discountP')}
                  keyboardType="numeric"
                />
              </View>
              <View style={styles.column}>
                <Text>Discount</Text>
                <TextInput
                  style={styles.input}
                  value={item.discount.toString()}
                  onChangeText={text => onChangeItem(text, index, 'discount')}
                  keyboardType="numeric"
                />
              </View>
              <Text>MRP: {item.mrp}</Text>
              <Text>
                CGST%: {item.cgstP} CGST: {item.cgst}
              </Text>
              <Text>
                SGST%: {item.sgstP} SGST: {item.sgst}
              </Text>
              <Text>
                IGST%: {item.igstP} IGST: {item.igst}
              </Text>
              <Text>Sub Total: {item.subTotal}</Text>
            </View>
          </View>
        ))}
        <TouchableOpacity onPress={handleAddRow} style={styles.addButton}>
          <Text style={styles.addButtonText}>Add Row</Text>
        </TouchableOpacity>
      </ScrollView>
      <SearchSalesProductModal
        modalTitle="Search Products"
        showModal={showProductModal}
        handleClose={handleCloseProductModal}
        updateItems={updateItems}
        rowNo={rowNo}
        is_barcode_exist={is_barcode_exist}></SearchSalesProductModal>
      <SelectProductForMultiplePriceModal
        modalTitle="Select Product"
        showModal={showBarcodeModal}
        handleClose={handleCloseBarcodeModal}
        updateItems={updateItems}
        rowNo={rowNo}
        barcodeSearchResult={
          barcodeSearchResult
        }></SelectProductForMultiplePriceModal>
    </View>
  );
};

export default SalesInvoiceItemsTable;

const styles = StyleSheet.create({
  card: {},
  cardHeader: {
    padding: 10,
  },

  input: {
    borderWidth: 1,
    borderColor: 'gray',
    padding: 5,
  },
  column: {
    flexDirection: 'column',
    marginBottom: 10,
  },
  addButton: {
    backgroundColor: 'transparent',
    margin: 10,
  },
  addButtonText: {
    color: 'green',
  },
});
