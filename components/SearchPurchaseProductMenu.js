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
import {usePurchase} from './PurchaseContext';
import {useOpeningStock} from './OpeningStockContext';
import OuterBodyModal from './OuterBodyModal';
import AddEditProductDetails from './AddEditProductDetails';
import {useNavigation} from '@react-navigation/native';
import {usePurchaseReturn} from './PurchaseReturnContext';
import {useProduction} from './ProductionContext';

const screenWidth = Dimensions.get('screen').width;

const SearchPurchaseProductMenu = ({type, product_type = ''}) => {
  const {data} = useAuth();
  const navigation = useNavigation();
  if (type === 'purchase') {
    ({
      initialItem,
      addBarcode,
      barcodeSeries,
      items,
      setItems,
      setNewProduct,
      searchProductInput,
      setSearchProductInput,
      rowNoToUpdate,
    } = usePurchase());
  } else if (type === 'openingStock') {
    ({
      initialItem,
      addBarcode,
      barcodeSeries,
      items,
      setItems,
      setNewProduct,
      searchProductInput,
      setSearchProductInput,
      rowNoToUpdate,
    } = useOpeningStock());
  } else if (type === 'purchase_return') {
    ({
      initialItem,
      addBarcode,
      barcodeSeries,
      items,
      setNewProduct,
      searchProductInput,
      setSearchProductInput,
      rowNoToUpdate,
    } = usePurchaseReturn());
  } else if (type === 'production') {
    ({
      initialItem,
      addBarcode,
      barcodeSeries,
      items,
      setNewProduct,
      searchProductInput,
      setSearchProductInput,
      rowNoToUpdate,
    } = useProduction());
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
      const res = await axios.post(`${API_BASE_URL}/api/searchProductByInput`, {
        searchInput: text,
        company_name: data.company_name,
        type: type,
        product_type: product_type,
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
    setSearchProductInput(result.product_code);
    // Function to check if barcode is already assigned to any item excluding the current row
    let newBarcode = barcodeSeries;
    if (data.is_barcode_exist === 1 && type !== 'purchase_return') {
      const isBarcodeAssigned = (barcode, currentRowNo) => {
        // Iterate through the items and check if any item already has this barcode
        for (let i = 0; i < items.length; i++) {
          if (i !== currentRowNo && items[i].barcode === barcode) {
            return true; // Barcode already assigned to another item
          }
        }
        return false; // Barcode not assigned to any other item
      };

      while (isBarcodeAssigned(newBarcode, rowNoToUpdate)) {
        // If barcodeSeries is already assigned, increment it by 1
        newBarcode++;
      }
      addBarcode(newBarcode);
    }

    const unitOptions = [];
    if (result.unit !== '') {
      unitOptions.push({option: result.unit});
    }
    if (result.unit !== '' && result.alt_unit !== '') {
      unitOptions.push({option: result.alt_unit});
    }
    const newProduct = {
      ...initialItem,
      ...(type === 'production' && {product_type: product_type}),
      barcode: type === 'purchase_return' ? '' : data.is_barcode_exist === 1 ? newBarcode || '' : '',
      productCode: result.product_code || '',
      productName: result.product_name || '',
      hsnCode: result.hsn_code || '',
      unit: result.unit || '',
      alt_unit: result.alt_unit || '',
      uc_factor: result.uc_factor || '',
      selectedUnit: result.unit || '',
      qty: type === 'production' && product_type === 'finished' ? result.parent_quantity || '1' : '',
      purchasePrice: result.purchase_price || '',
      salesPrice: result.sales_price || '',
      mrp: result.mrp || '',
      newPurchasePrice: result.purchase_price || '',
      newSalesPrice: result.sales_price || '',
      newMrp: result.mrp || '',
      cost: result.purchase_inclusive === 1 ? (result.purchase_price / (1 + result.igst / 100)).toFixed(2) : result.purchase_price,
      purchaseInclusive: result.purchase_inclusive || 0,
      salesInclusive: result.sales_inclusive || 0,
      grossAmt: type === 'production' && product_type === 'finished' ? (
          parseFloat(result.parent_quantity || '1') *
          Number(
            result.purchase_inclusive === 1
                ? (result.purchase_price / (1 + result.igst / 100)).toFixed(2)
                : result.purchase_price,
          )
      ).toFixed(2) : '',
      taxable: type === 'production' && product_type === 'finished' ? (
          parseFloat(result.parent_quantity || '1') *
          Number(
            result.purchase_inclusive === 1
                ? (result.purchase_price / (1 + result.igst / 100)).toFixed(2)
                : result.purchase_price,
          )
      ).toFixed(2) : '',
      selectedTax: data.tax_type === 'VAT' ? 'IGST' : 'GST',
      cgstP: result.cgst || '',
      cgst: '',
      sgstP: result.sgst || '',
      sgst: '',
      igstP: result.igst || '',
      igst: '',
      discountP: '',
      discount: '',
      subTotal: type === 'production' && product_type === 'finished' ? (
          parseFloat(result.parent_quantity || '1') *
          Number(
            result.purchase_inclusive === 1
                ? (result.purchase_price / (1 + result.igst / 100)).toFixed(2)
                : result.purchase_price,
          )
      ).toFixed(2) : '',
      dropdownOptions: result.barcodelist || [],
      unitOptions: unitOptions,
      remarks: result.remarks || '',
    };

    setNewProduct(newProduct);

    // Add components separately to items if production and finished
    if (type === 'production' && product_type === 'finished' && result.componentDetails) {
        const components = result.componentDetails.map(comp => ({
            ...initialItem,
            product_type: 'raw',
            productCode: comp.product_code || '',
            productName: comp.product_name || '',
            hsnCode: comp.hsn_code || '',
            unit: comp.unit || '',
            alt_unit: comp.alt_unit || '',
            uc_factor: comp.uc_factor || '',
            selectedUnit: comp.unit || '',
            qty: (comp.component_quantity * (result.parent_quantity || 1)).toString(),
            purchasePrice: comp.purchase_price || '',
            salesPrice: comp.sales_price || '',
            mrp: comp.mrp || '',
            newPurchasePrice: comp.purchase_price || '',
            newSalesPrice: comp.sales_price || '',
            newMrp: comp.mrp || '',
            purchaseInclusive: comp.purchase_inclusive || 0,
            salesInclusive: comp.sales_inclusive || 0,
            selectedTax: data.tax_type === 'VAT' ? 'IGST' : 'GST',
            cgstP: comp.cgst || '',
            sgstP: comp.sgst || '',
            igstP: comp.igst || '',
            cost: comp.purchase_inclusive === 1
                ? (comp.purchase_price / (1 + comp.igst / 100)).toFixed(2)
                : comp.purchase_price.toString(),
            grossAmt: (
                comp.component_quantity *
                (result.parent_quantity || 1) *
                Number(
                    comp.purchase_inclusive === 1
                        ? (comp.purchase_price / (1 + comp.igst / 100)).toFixed(2)
                        : comp.purchase_price,
                )
            ).toFixed(2),
            taxable: (
                comp.component_quantity *
                (result.parent_quantity || 1) *
                Number(
                    comp.purchase_inclusive === 1
                        ? (comp.purchase_price / (1 + comp.igst / 100)).toFixed(2)
                        : comp.purchase_price,
                )
            ).toFixed(2),
            cgst: data.tax_type === 'GST'
                ? (
                    (comp.component_quantity *
                        (result.parent_quantity || 1) *
                        Number(
                            comp.purchase_inclusive === 1
                                ? (comp.purchase_price / (1 + comp.igst / 100)).toFixed(2)
                                : comp.purchase_price,
                        ) *
                        comp.cgst) /
                    100
                ).toFixed(2)
                : '0',
            sgst: data.tax_type === 'GST'
                ? (
                    (comp.component_quantity *
                        (result.parent_quantity || 1) *
                        Number(
                            comp.purchase_inclusive === 1
                                ? (comp.purchase_price / (1 + comp.igst / 100)).toFixed(2)
                                : comp.purchase_price,
                        ) *
                        comp.sgst) /
                    100
                ).toFixed(2)
                : '0',
            igst: data.tax_type === 'VAT'
                ? (
                    (comp.component_quantity *
                        (result.parent_quantity || 1) *
                        Number(
                            comp.purchase_inclusive === 1
                                ? (comp.purchase_price / (1 + comp.igst / 100)).toFixed(2)
                                : comp.purchase_price,
                        ) *
                        comp.igst) /
                    100
                ).toFixed(2)
                : '0',
            subTotal: (
                Number(
                    comp.component_quantity *
                        (result.parent_quantity || 1) *
                        Number(
                            comp.purchase_inclusive === 1
                                ? (comp.purchase_price / (1 + comp.igst / 100)).toFixed(2)
                                : comp.purchase_price,
                        ),
                ) +
                Number(
                    data.tax_type === 'GST'
                        ? (
                            (comp.component_quantity *
                                (result.parent_quantity || 1) *
                                Number(
                                    comp.purchase_inclusive === 1
                                        ? (comp.purchase_price / (1 + comp.igst / 100)).toFixed(2)
                                        : comp.purchase_price,
                                ) *
                                comp.cgst) /
                            100
                        ).toFixed(2)
                        : '0',
                ) +
                Number(
                    data.tax_type === 'GST'
                        ? (
                            (comp.component_quantity *
                                (result.parent_quantity || 1) *
                                Number(
                                    comp.purchase_inclusive === 1
                                        ? (comp.purchase_price / (1 + comp.igst / 100)).toFixed(2)
                                        : comp.purchase_price,
                                ) *
                                comp.sgst) /
                            100
                        ).toFixed(2)
                        : '0',
                ) +
                Number(
                    data.tax_type === 'VAT'
                        ? (
                            (comp.component_quantity *
                                (result.parent_quantity || 1) *
                                Number(
                                    comp.purchase_inclusive === 1
                                        ? (comp.purchase_price / (1 + comp.igst / 100)).toFixed(2)
                                        : comp.purchase_price,
                                ) *
                                comp.igst) /
                            100
                        ).toFixed(2)
                        : '0',
                )
            ).toFixed(2),
        }));

        setItems(prevItems => {
            // Filter out existing raw components
            const updatedItems = prevItems.filter(item => item.product_type !== "raw");
            // Add new components
            return [...updatedItems, ...components];
        });
    }

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
        <ScrollView style={{maxHeight: 200, width: '100%'}}>
          {searchResults.map((result, index) => (
            <Fragment key={index}>
              <TouchableOpacity
                onPress={() => {
                  handleClickRow(result);
                  setMenuVisible(false);
                }}>
                <View style={styles.menuItem}>
                  <Text
                    style={[
                      styles.cell,
                      styles.marginRight,
                      styles.textCenter,
                    ]}>
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
  textCenter: {textAlign: 'center'},
  marginRight: {
    marginRight: 5,
  },
  marginLeft: {
    marginLeft: 15,
  },
});

export default SearchPurchaseProductMenu;
