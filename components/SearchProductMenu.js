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
import {useSales} from './SalesContext';
import {COLORS, FONTS} from '../constants';
import {useStockTransfer} from './StockTransferContext';
import OuterBodyModal from './OuterBodyModal';
import AddEditProductDetails from './AddEditProductDetails';
import {useEstimate} from './EstimateContext';
import {useNavigation} from '@react-navigation/native';
import {usePettySales} from './PettySalesContext';
import {usePurchaseReturn} from './PurchaseReturnContext';

const screenWidth = Dimensions.get('screen').width;

const SearchProductMenu = ({type}) => {
  const {data} = useAuth();
  const navigation = useNavigation();
  if (type === 'sales' || type === 'sales_order') {
    ({
      initialItem,
      newProduct,
      setNewProduct,
      searchProductInput,
      setSearchProductInput,
      formDataFooter,
    } = useSales());
  } else if (type === 'stock_transfer') {
    ({
      initialItem,
      newProduct,
      setNewProduct,
      searchProductInput,
      setSearchProductInput,
      formDataFooter,
    } = useStockTransfer());
  } else if (type === 'estimate') {
    ({
      initialItem,
      newProduct,
      setNewProduct,
      searchProductInput,
      setSearchProductInput,
      formDataFooter,
    } = useEstimate());
  } else if (type === 'pettySales') {
    ({
      initialItem,
      newProduct,
      setNewProduct,
      searchProductInput,
      setSearchProductInput,
      formDataFooter,
    } = usePettySales());
  } else if (type === 'purchase_return') {
    ({
      initialItem,
      newProduct,
      setNewProduct,
      searchProductInput,
      setSearchProductInput,
      formDataFooter,
    } = usePurchaseReturn());
  }

  const [menuVisible, setMenuVisible] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);

  const initialFormData = {
    id: '',
    productCategoryId: null,
    productName: '',
    productCode: '',
    hsnCode: '',
    rol: '',
    igst: '',
    sgst: '',
    cgst: '',
    purchasePrice: '',
    salesPrice: '',
    mrp: '',
    purchaseInclusive: 0,
    salesInclusive: 0,
    expiryDate: new Date(),
    unit: '',
    alt_unit: '',
    uc_factor: '',
    discountP: '',
    remarks: '',
    validationError: '',
  };

  const onHandleSearchInput = async text => {
    setSearchProductInput(text);
    setNewProduct(initialItem);
    try {
      const res = await axios.post(
        `${API_BASE_URL}/api/searchSalesProductByInput`,
        {
          searchInput: text,
          company_name: data.company_name,
          type: type,
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
    setSearchProductInput(result.product_code);
    const unitOptions = [];
    if (result.unit !== '') {
      unitOptions.push({option: result.unit});
    }
    if (result.unit !== '' && result.alt_unit !== '') {
      unitOptions.push({option: result.alt_unit});
    }
    setNewProduct({
      ...initialItem,
      barcode: result.barcode || '',
      productCode: result.product_code || '',
      productName: result.product_name || '',
      hsnCode: result.hsn_code || '',
      unit: result.unit || '',
      alt_unit: result.alt_unit || '',
      uc_factor: result.uc_factor || '',
      selectedUnit: result.unit || '',
      qty: '',
      purchasePrice:
        data.business_category === 'FlowerShop'
          ? ''
          : result.purchase_price || '',
      salesPrice: result.sales_price || '',
      mrp: result.mrp || '',
      newPurchasePrice:
        data.business_category === 'FlowerShop'
          ? ''
          : result.purchase_price || '',
      newSalesPrice: formDataFooter?.priceList?.value
        ? result?.dynamicColumns[formDataFooter.priceList.value] || ''
        : '',
      newMrp: result.mrp || '',
      cost:
        type === 'purchase_return'
          ? result?.purchase_inclusive === 1
            ? (result.purchase_price / (1 + result.igst / 100)).toFixed(2)
            : result.purchase_price
          : result?.sales_inclusive === 1
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
      discountP: result.discountP || 0,
      discount: 0,
      subTotal: '',
      unitOptions: unitOptions,
      remarks: result.remarks || '',
    });
    setMenuVisible(false);
  };

  const handleCloseModal = useCallback(() => {
    setShowAddModal(false);
  }, []);

  const onClickAdd = () => {
    setMenuVisible(false);
    navigation.navigate('ProductDetailsStack', {
      screen: 'AddEditProductDetails',
      params: {type: 'Add Product Details'},
    });
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
            label="* Product Code"
            placeholder="Search By Product Code"
            onChangeText={onHandleSearchInput}
            value={searchProductInput}
            outlineColor={COLORS.black}
            textColor={COLORS.black}
            activeOutlineColor={COLORS.primary}
            style={{margin: 20}}
          />
        }>
        <Button
          mode="contained"
          onPress={onClickAdd}
          style={{margin: 10, marginHorizontal: 60}}>
          Add Product
        </Button>
        {searchResults.length > 0 && (
          <View style={{flexDirection: 'column', alignItems: 'center'}}>
            <View style={styles.menuItem}>
              {data.is_barcode_exist === 1 &&
                !(
                  type === 'estimate' &&
                  data.negative_stock === 'allow' &&
                  data.estimate_accounts_add_status === 0
                ) && (
                  <Text
                    style={[styles.cell, styles.marginRight, styles.heading]}>
                    barcode
                  </Text>
                )}
              <Text style={[styles.cell, styles.marginRight, styles.heading]}>
                product code
              </Text>

              <Text
                style={[
                  styles.cell,
                  styles.textRight,
                  styles.marginRight,
                  styles.heading,
                ]}>
                sales price
              </Text>
              <Text style={[styles.cell, styles.textRight, styles.heading]}>
                mrp
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
                  {data.is_barcode_exist === 1 && (
                    <Text style={[styles.cell, styles.marginRight]}>
                      {result.barcode}
                    </Text>
                  )}
                  <Text style={[styles.cell, styles.marginRight]}>
                    {result.product_code}
                  </Text>
                  <Text
                    style={[styles.cell, styles.textRight, styles.marginRight]}>
                    {result.sales_price}
                  </Text>
                  <Text style={[styles.cell, styles.textRight]}>
                    {result.mrp}
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
      <OuterBodyModal
        modalTitle="Add Product Details"
        showModal={showAddModal}
        handleClose={handleCloseModal}>
        <AddEditProductDetails
          initialFormData={initialFormData}
          type="Add Product Details"
          onHandleSubmit={handleCloseModal}></AddEditProductDetails>
      </OuterBodyModal>
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

export default SearchProductMenu;
