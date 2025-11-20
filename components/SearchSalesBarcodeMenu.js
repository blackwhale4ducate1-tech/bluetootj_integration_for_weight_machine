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
import {useSales} from './SalesContext';
import {useStockTransfer} from './StockTransferContext';
import {useEstimate} from './EstimateContext';
import BarcodeScanner from './BarcodeScanner';
import {usePurchaseReturn} from './PurchaseReturnContext';

const screenWidth = Dimensions.get('screen').width;

const SearchSalesBarcodeMenu = ({type}) => {
  const {data} = useAuth();
  if (type === 'sales' || type === 'sales_order') {
    ({newProduct, setNewProduct, setSearchProductInput} = useSales());
  } else if (type === 'stock_transfer') {
    ({newProduct, setNewProduct, setSearchProductInput} = useStockTransfer());
  } else if (type === 'estimate') {
    ({newProduct, setNewProduct, setSearchProductInput} = useEstimate());
  } else if (type === 'purchase_return') {
    ({newProduct, setNewProduct, setSearchProductInput} = usePurchaseReturn());
  }
  const [menuVisible, setMenuVisible] = useState(false);
  const [barcodeSearchResult, setBarcodeSearchResult] = useState([]);
  const [qrCodeSearchResult, setQrCodeSearchResult] = useState([]);
  const [showScanner, setShowScanner] = useState(false);

  const handleClickRow = result => {
    // console.log('Result in SearchSalesBarcodeMenu: ' + JSON.stringify(result));
    setSearchProductInput(result.product_code);
    setNewProduct({
      ...newProduct,
      barcode: result.barcode || '',
      productCode: result.product_code || '',
      productName: result.product_name || '',
      hsnCode: result.hsn_code || '',
      unit: result.unit || '',
      alt_unit: result.alt_unit || '',
      uc_factor: result.uc_factor || '',
      selectedUnit: result.unit || '',
      qty: '',
      purchasePrice: result.purchase_price || '',
      salesPrice: result.sales_price || '',
      mrp: result.mrp || '',
      newPurchasePrice: result.purchase_price || '',
      newSalesPrice: result.sales_price || '',
      newMrp: result.mrp || '',
      cost:
        result.sales_inclusive === 1
          ? (result.sales_price / (1 + result.igst / 100)).toFixed(2)
          : result.sales_price,
      purchaseInclusive: result.purchase_inclusive || 0,
      salesInclusive: result.sales_inclusive || 0,
      grossAmt: '',
      taxable: '',
      selectedTax: data.tax_type === 'VAT' ? 'IGST' : 'GST',
      cgstP: result.cgst || '',
      cgst: '',
      sgstP: result.sgst || '',
      sgst: '',
      igstP: result.igst || '',
      igst: '',
      discountP: '',
      discount: '',
      subTotal: '',
      unitOptions:
        result.unit && result.alt_unit
          ? [{option: result.unit}, {option: result.alt_unit}]
          : result.unit && !result.alt_unit
          ? [{option: result.unit}]
          : [],
    });
  };

  const handleChangeBarcode = async (text, isQRCode = false) => {
    const codeEntered = text;
    setNewProduct({...newProduct, barcode: codeEntered});
    setMenuVisible(false);

    try {
      // Use the same API endpoint for both barcode and QR code
      const res = await axios.post(`${API_BASE_URL}/api/searchBarcodeByInput`, {
        searchBarcodeInput: codeEntered,
        company_name: data.company_name,
      });
      const searchResult = res.data.message;
      setBarcodeSearchResult(res.data.message);
      setQrCodeSearchResult([]); // Clear QR results since we're using single API
      
      if (searchResult.length === 1) {
        setSearchProductInput(searchResult[0].product_code);
        setNewProduct({
          ...newProduct,
          barcode: searchResult[0].barcode,
          productCode: searchResult[0].product_code,
          productName: searchResult[0].product_name,
          hsnCode: searchResult[0].hsn_code,
          unit: searchResult[0].unit,
          alt_unit: searchResult[0].alt_unit,
          uc_factor: searchResult[0].uc_factor,
          selectedUnit: searchResult[0].unit,
          description: '',
          qty: '',
          purchasePrice: searchResult[0].purchase_price,
          salesPrice: searchResult[0].sales_price,
          mrp: searchResult[0].mrp,
          newPurchasePrice: searchResult[0].purchase_price,
          newSalesPrice:
            searchResult[0].dynamicColumns[formDataFooter.priceList.value],
          newMrp: searchResult[0].mrp,
          cost:
            searchResult[0].sales_inclusive === 1
              ? (
                  searchResult[0].sales_price /
                  (1 + searchResult[0].igst / 100)
                ).toFixed(2)
              : searchResult[0].sales_price,
          purchaseInclusive: searchResult[0].purchase_inclusive || 0,
          salesInclusive: searchResult[0].sales_inclusive || 0,
          grossAmt: '',
          taxable: '',
          selectedTax: data.tax_type === 'VAT' ? 'IGST' : 'GST',
          cgstP: searchResult[0].cgst || '',
          cgst: '',
          sgstP: searchResult[0].sgst || '',
          sgst: '',
          igstP: searchResult[0].igst || '',
          igst: '',
          discountP: searchResult[0].discountP || 0,
          discount: 0,
          subTotal: '',
          unitOptions:
            searchResult[0].unit && searchResult[0].alt_unit
              ? [
                  {option: searchResult[0].unit},
                  {option: searchResult[0].alt_unit},
                ]
              : searchResult[0].unit && !searchResult[0].alt_unit
              ? [{option: searchResult[0].unit}]
              : [],
          dynamicColumns: searchResult[0].dynamicColumns || {},
          remarks: searchResult[0].remarks || '',
        });
      } else if (searchResult.length === 0) {
        handleNoResultFound(codeEntered);
      } else if (searchResult.length > 1) {
        setMenuVisible(true);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleQRCodeData = (qrData) => {
    // Handle QR code data that contains product information directly
    setSearchProductInput(qrData.product_code || qrData.productCode || '');
    setNewProduct({
      ...newProduct,
      barcode: qrData.barcode || qrData.qr_code || '',
      productCode: qrData.product_code || qrData.productCode || '',
      productName: qrData.product_name || qrData.productName || '',
      hsnCode: qrData.hsn_code || qrData.hsnCode || '',
      unit: qrData.unit || '',
      alt_unit: qrData.alt_unit || qrData.altUnit || '',
      uc_factor: qrData.uc_factor || qrData.ucFactor || '',
      selectedUnit: qrData.unit || '',
      description: qrData.description || '',
      qty: '',
      purchasePrice: qrData.purchase_price || qrData.purchasePrice || '',
      salesPrice: qrData.sales_price || qrData.salesPrice || '',
      mrp: qrData.mrp || '',
      newPurchasePrice: qrData.purchase_price || qrData.purchasePrice || '',
      newSalesPrice: qrData.sales_price || qrData.salesPrice || '',
      newMrp: qrData.mrp || '',
      cost: qrData.sales_price || qrData.salesPrice || '',
      purchaseInclusive: qrData.purchase_inclusive || qrData.purchaseInclusive || 0,
      salesInclusive: qrData.sales_inclusive || qrData.salesInclusive || 0,
      grossAmt: '',
      taxable: '',
      selectedTax: data.tax_type === 'VAT' ? 'IGST' : 'GST',
      cgstP: qrData.cgst || '',
      cgst: '',
      sgstP: qrData.sgst || '',
      sgst: '',
      igstP: qrData.igst || '',
      igst: '',
      discountP: qrData.discountP || 0,
      discount: 0,
      subTotal: '',
      unitOptions: qrData.unit ? [{option: qrData.unit}] : [],
      dynamicColumns: qrData.dynamicColumns || {},
      remarks: qrData.remarks || '',
    });
  };

  const handleNoResultFound = (codeEntered) => {
    setSearchProductInput('');
    setNewProduct({
      ...newProduct,
      barcode: codeEntered, // Keep the typed code value
      productCode: '',
      productName: '',
      hsnCode: '',
      unit: '',
      alt_unit: '',
      uc_factor: '',
      selectedUnit: '',
      description: '',
      qty: '',
      purchasePrice: '',
      salesPrice: '',
      mrp: '',
      newPurchasePrice: '',
      newSalesPrice: '',
      newMrp: '',
      cost: '',
      purchaseInclusive: '',
      salesInclusive: '',
      grossAmt: '',
      taxable: '',
      selectedTax: '',
      cgstP: '',
      cgst: '',
      sgstP: '',
      sgst: '',
      igstP: '',
      igst: '',
      discountP: '',
      discount: '',
      subTotal: '',
      unitOptions: [],
      dynamicColumns: {},
      remarks: '',
    });
  };

  const handleBarcodeScanned = (scannedCode, isQRCode = false) => {
    console.log('Code scanned in handleBarcodeScanned:', scannedCode, 'isQRCode:', isQRCode);
    handleChangeBarcode(scannedCode, isQRCode); // reuse your logic with QR code flag
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
            label="* Barcode / QR Code"
            onChangeText={text => handleChangeBarcode(text)}
            value={newProduct.barcode.toString()}
            outlineColor={COLORS.black}
            textColor={COLORS.black}
            activeOutlineColor={COLORS.primary}
            style={{margin: 20}}
            left={<TextInput.Icon icon="qrcode-scan" onPress={openScanner} />}
          />
        }>
        {(barcodeSearchResult.length > 0 || qrCodeSearchResult.length > 0) && (
          <View style={{flexDirection: 'column', alignItems: 'center'}}>
            <View style={styles.menuItem}>
              <Text style={[styles.cell, styles.marginRight, styles.heading]}>
                Code
              </Text>
              <Text style={[styles.cell, styles.marginRight, styles.heading]}>
                Product Code
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
          {[...barcodeSearchResult, ...qrCodeSearchResult].map((result, index) => (
            <Fragment key={index}>
              <TouchableOpacity
                onPress={() => {
                  handleClickRow(result);
                  setMenuVisible(false);
                }}>
                <View style={styles.menuItem}>
                  <Text style={[styles.cell, styles.marginRight]}>
                    {result.barcode || result.qr_code || 'N/A'}
                  </Text>
                  <Text style={[styles.cell, styles.marginRight]}>
                    {result.product_code}
                  </Text>
                  <Text
                    style={[styles.cell, styles.marginRight, styles.textRight]}>
                    {result.sales_price}
                  </Text>
                  <Text style={[styles.cell, styles.textRight]}>
                    {result.mrp}
                  </Text>
                </View>
              </TouchableOpacity>
              {/* <Menu.Item
                onPress={() => {
                  handleClickRow(result);
                  setMenuVisible(false);
                }}
                title={
                  
                }
              /> */}
              {index < (barcodeSearchResult.length + qrCodeSearchResult.length) - 1 && <Divider />}
            </Fragment>
          ))}
          {barcodeSearchResult.length === 0 && qrCodeSearchResult.length === 0 && (
            <Text style={styles.emptyprd}>No Barcodes or QR Codes found</Text>
          )}
        </ScrollView>
      </Menu>
      {showScanner && (
        <BarcodeScanner
          onClose={closeScanner}
          onBarcodeScanned={(scannedCode, isQRCode) => {
            console.log('Code scanned in parent:', scannedCode, 'isQRCode:', isQRCode);
            handleBarcodeScanned(scannedCode, isQRCode);
          }}
        />
      )}
    </View>
  );
};

export default SearchSalesBarcodeMenu;

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
