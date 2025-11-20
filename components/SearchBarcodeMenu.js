import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import React, {useState, useEffect, Fragment} from 'react';
import {TextInput, Menu, Divider, List, Button} from 'react-native-paper';
import axios from 'axios';
import {API_BASE_URL} from '../config';
import {useAuth} from './AuthContext';
import {COLORS, FONTS} from '../constants';
import {usePurchase} from './PurchaseContext';
import AlertModal from './AlertModal';
import {useOpeningStock} from './OpeningStockContext';
import BarcodeScanner from './BarcodeScanner';
import {usePurchaseReturn} from './PurchaseReturnContext';
import {useProduction} from './ProductionContext';

const screenWidth = Dimensions.get('screen').width;

const SearchBarcodeMenu = ({type, barcodeOptions, product_type = ''}) => {
  const {data} = useAuth();
  if (type === 'purchase') {
    ({
      newProduct,
      setNewProduct,
      rowNoToUpdate,
      items,
      barcodeSeries,
      addBarcode,
    } = usePurchase());
  } else if (type === 'openingStock') {
    ({
      newProduct,
      setNewProduct,
      rowNoToUpdate,
      items,
      barcodeSeries,
      addBarcode,
    } = useOpeningStock());
  } else if (type === 'purchase_return') {
    ({
      newProduct,
      setNewProduct,
      rowNoToUpdate,
      items,
      barcodeSeries,
      addBarcode,
    } = usePurchaseReturn());
  } else if (type === 'production') {
    ({
      newProduct,
      setNewProduct,
      rowNoToUpdate,
      items,
      barcodeSeries,
      addBarcode,
    } = useProduction());
  }
  const [menuVisible, setMenuVisible] = useState(false);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [showScanner, setShowScanner] = useState(false);

  const handleClickRow = result => {
    const basePurchasePrice = result.purchase_price || '';
    const baseSalesPrice = result.sales_price || '';
    const baseMRP = result.mrp || '';
    let purchasePrice = '';
    let salesPrice = '';
    let MRP = '';
    if (
      !newProduct.selectedUnit ||
      newProduct.selectedUnit === newProduct.unit
    ) {
      purchasePrice = basePurchasePrice;
      salesPrice = baseSalesPrice;
      MRP = baseMRP;
    } else if (newProduct.selectedUnit === newProduct.alt_unit) {
      purchasePrice = basePurchasePrice * newProduct.uc_factor || '';
      salesPrice = baseSalesPrice * newProduct.uc_factor || '';
      MRP = baseMRP * newProduct.uc_factor || '';
    }

    setNewProduct({
      ...newProduct,
      ...(type === 'production' && {product_type: product_type}),
      barcode: result.barcode,
      qty: '',
      purchasePrice: result.purchase_price || '',
      salesPrice: result.sales_price || '',
      mrp: result.mrp || '',
      newPurchasePrice: purchasePrice,
      newSalesPrice: salesPrice,
      newMrp: MRP,
      cost:
        newProduct.purchase_inclusive === 1
          ? (purchasePrice / (1 + newProduct.igst / 100)).toFixed(2)
          : purchasePrice,
      grossAmt: '',
      taxable: '',
      selectedTax: data.tax_type === 'VAT' ? 'IGST' : 'GST',
      cgstP: newProduct.cgstP || '',
      cgst: '',
      sgstP: newProduct.sgstP || '',
      sgst: '',
      igstP: newProduct.igstP || '',
      igst: '',
      discountP: newProduct.discountP || 0,
      discount: 0,
      subTotal: '',
      remarks: newProduct.remarks || '',
    });
  };

  const handleOpenBarcodeMenu = () => {
    setMenuVisible(true);
  };

  const onChangeBarcodeItem = async text => {
    const barcodeEntered = text;
    const searchProductCode = newProduct.productCode;
    setNewProduct({...newProduct, barcode: barcodeEntered});
    const existingIndex = newProduct.dropdownOptions.findIndex(
      option => option.barcode === barcodeEntered,
    );
    if (existingIndex !== -1) {
      setMenuVisible(true);
    } else {
      try {
        const res = await axios.post(
          `${API_BASE_URL}/api/validateBarcodeInStock`,
          {
            barcodeEntered: barcodeEntered,
            searchProductCode: searchProductCode,
            company_name: data.company_name,
          },
        );
        if (res.data.error) {
          console.log('Error: ' + res.data.error);
          setAlertMessage(
            'Barcode ' + barcodeEntered + ' already exist for other product',
          );
          const isBarcodeAssigned = (barcode, currentRowNo) => {
            // Iterate through the items and check if any item already has this barcode
            for (let i = 0; i < items.length; i++) {
              if (i !== currentRowNo && items[i].barcode === barcode) {
                return true; // Barcode already assigned to another item
              }
            }
            return false; // Barcode not assigned to any other item
          };

          // Check if barcodeSeries is already assigned to another item
          let newBarcode = barcodeSeries; // Initialize newBarcode with barcodeSeries
          while (isBarcodeAssigned(newBarcode, rowNoToUpdate)) {
            // If barcodeSeries is already assigned, increment it by 1
            newBarcode++;
          }
          addBarcode(newBarcode);
          setNewProduct({...newProduct, barcode: newBarcode || ''});
          setShowAlertModal(true);
        }
      } catch (err) {
        console.log(err);
      }
    }
  };

  const handleBarcodeScanned = scannedBarcode => {
    console.log('Barcode scanned in handleBarcodeScanned:', scannedBarcode);
    onChangeBarcodeItem(scannedBarcode); // reuse your logic
  };

  const openScanner = () => {
    console.log('Opening Scanner...');
    setShowScanner(true);
  };

  const closeScanner = () => {
    console.log('Closing scanner...');
    setShowScanner(false);
  };

  return (
    <View>
      <Menu
        visible={menuVisible}
        onDismiss={() => setMenuVisible(false)}
        contentStyle={{
          width: screenWidth * 0.9,
          maxHeight: 200,
          marginLeft: 10,
          marginTop: 70,
          backgroundColor: 'white',
        }}
        anchor={
          <TextInput
            mode="outlined"
            label="* Barcode"
            onChangeText={text => onChangeBarcodeItem(text)}
            value={newProduct.barcode.toString()}
            disabled={newProduct.productCode === ''}
            outlineColor={COLORS.black}
            textColor={COLORS.black}
            activeOutlineColor={COLORS.primary}
            style={{margin: 10}}
            left={
              <TextInput.Icon
                icon="barcode-scan"
                onPress={openScanner}
                disabled={newProduct.productCode === ''}
              />
            }
            right={
              <TextInput.Icon
                icon="card-search"
                onPress={handleOpenBarcodeMenu}
                disabled={newProduct.productCode === ''}
              />
            }
          />
        }>
        {barcodeOptions.length > 0 && (
          <View style={{flexDirection: 'column', alignItems: 'center'}}>
            <View style={styles.menuItem}>
              <Text style={[styles.cell, styles.marginRight, styles.heading]}>
                Barcode
              </Text>
              <Text
                style={[
                  styles.cell,
                  styles.marginRight,
                  styles.textRight,
                  styles.heading,
                ]}>
                Purchase Price
              </Text>
              <Text
                style={[
                  styles.cell,
                  styles.textRight,
                  styles.marginRight,
                  styles.heading,
                ]}>
                Sales Price
              </Text>
              <Text style={[styles.cell, styles.textRight, styles.heading]}>
                MRP
              </Text>
            </View>
          </View>
        )}
        <ScrollView style={{maxHeight: 200, width: '100%'}}>
          {barcodeOptions.map((barcodelist, index) => (
            <Fragment key={index}>
              <TouchableOpacity
                onPress={() => {
                  handleClickRow(barcodelist);
                  setMenuVisible(false);
                }}>
                <View style={styles.menuItem}>
                  <Text style={[styles.cell, styles.marginRight]}>
                    {barcodelist.barcode}
                  </Text>
                  <Text
                    style={[styles.cell, styles.marginRight, styles.textRight]}>
                    {barcodelist.purchase_price}
                  </Text>
                  <Text
                    style={[styles.cell, styles.marginRight, styles.textRight]}>
                    {barcodelist.sales_price}
                  </Text>
                  <Text style={[styles.cell, styles.textRight]}>
                    {barcodelist.mrp}
                  </Text>
                </View>
              </TouchableOpacity>
              {index < barcodeOptions.length - 1 && <Divider />}
            </Fragment>
          ))}
          {barcodeOptions.length === 0 && (
            <Text style={styles.emptyprd}>No Barcodes found</Text>
          )}
        </ScrollView>
      </Menu>
      <AlertModal
        showModal={showAlertModal}
        handleClose={() => setShowAlertModal(false)}
        modalTitle="Alert"
        message={alertMessage}
      />
      {showScanner && (
        <BarcodeScanner
          onClose={closeScanner}
          onBarcodeScanned={scannedBarcode => {
            console.log('Barcode scanned in parent:', scannedBarcode);
            handleBarcodeScanned(scannedBarcode);
          }}
        />
      )}
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
  textCenter: {textAlign: 'center'},
  marginRight: {
    marginRight: 5,
  },
  marginLeft: {
    marginLeft: 15,
  },
});

export default SearchBarcodeMenu;
