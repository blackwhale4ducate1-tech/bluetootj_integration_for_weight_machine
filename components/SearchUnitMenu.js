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
import {useSales} from './SalesContext';
import {useEstimate} from './EstimateContext';
import {useStockTransfer} from './StockTransferContext';
import {usePurchaseReturn} from './PurchaseReturnContext';
import {useProduction} from './ProductionContext';

const screenWidth = Dimensions.get('screen').width;

const SearchUnitMenu = ({type, unitOptions, product_type = ''}) => {
  const {data} = useAuth();
  if (type === 'purchase') {
    ({newProduct, setNewProduct, rowNoToUpdate, items} = usePurchase());
  } else if (type === 'openingStock') {
    ({newProduct, setNewProduct, rowNoToUpdate, items} = useOpeningStock());
  } else if (type === 'sales' || type === 'sales_order') {
    ({newProduct, setNewProduct, rowNoToUpdate, items} = useSales());
  } else if (type === 'estimate') {
    ({newProduct, setNewProduct, rowNoToUpdate, items} = useEstimate());
  } else if (type === 'stock_transfer') {
    ({newProduct, setNewProduct, rowNoToUpdate, items} = useStockTransfer());
  } else if (type === 'purchase_return') {
    ({newProduct, setNewProduct, rowNoToUpdate, items} = usePurchaseReturn());
  } else if (type === 'production') {
    ({newProduct, setNewProduct, rowNoToUpdate, items} = useProduction());
  }

  const [menuVisible, setMenuVisible] = useState(false);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  const handleClickRow = result => {
    const basePurchasePrice = newProduct.purchasePrice || '';
    const baseSalesPrice = newProduct.salesPrice || '';
    const baseMRP = newProduct.mrp || '';
    let selectedUnit = result.option || '';
    let purchasePrice = '';
    let salesPrice = '';
    let MRP = '';
    if (!selectedUnit || selectedUnit === newProduct.unit) {
      purchasePrice = basePurchasePrice;
      salesPrice = baseSalesPrice;
      MRP = baseMRP;
    } else if (selectedUnit === newProduct.alt_unit) {
      purchasePrice =
        (basePurchasePrice * newProduct.uc_factor).toFixed(2) || '';
      salesPrice = (baseSalesPrice * newProduct.uc_factor).toFixed(2) || '';
      MRP = (baseMRP * newProduct.uc_factor).toFixed(2) || '';
    }

    setNewProduct({
      ...newProduct,
      ...(type === 'production' && {product_type: product_type}),
      qty: '',
      selectedUnit: selectedUnit,
      newPurchasePrice: purchasePrice,
      newSalesPrice: salesPrice,
      newMrp: MRP,
      cost:
        newProduct.purchase_inclusive === 1
          ? (purchasePrice / (1 + newProduct.igst / 100)).toFixed(2)
          : purchasePrice,
      grossAmt: '',
      taxable: '',
      cgstP: newProduct.cgstP || '',
      cgst: '',
      sgstP: newProduct.sgstP || '',
      sgst: '',
      igstP: newProduct.igstP || '',
      igst: '',
      discountP: '',
      discount: '',
      subTotal: '',
      remarks: newProduct.remarks || '',
    });
  };

  const handleOpenUnitMenu = () => {
    setMenuVisible(true);
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
            label="Unit"
            readOnly={true}
            value={newProduct.selectedUnit}
            disabled={newProduct.productCode === ''}
            outlineColor={COLORS.black}
            textColor={COLORS.black}
            activeOutlineColor={COLORS.primary}
            style={{margin: 10}}
            right={
              <TextInput.Icon
                icon="card-search"
                onPress={handleOpenUnitMenu}
                disabled={newProduct.productCode === ''}
              />
            }
          />
        }>
        {unitOptions.length > 0 && (
          <View style={{flexDirection: 'column', alignItems: 'center'}}>
            <View style={styles.menuItem}>
              <Text style={[styles.cell, styles.marginRight, styles.heading]}>
                Unit
              </Text>
            </View>
          </View>
        )}
        <ScrollView style={{maxHeight: 200, width: '100%'}}>
          {unitOptions.map((unitlist, index) => (
            <Fragment key={index}>
              <TouchableOpacity
                onPress={() => {
                  handleClickRow(unitlist);
                  setMenuVisible(false);
                }}>
                <View style={styles.menuItem}>
                  <Text style={[styles.cell, styles.marginRight]}>
                    {unitlist.option}
                  </Text>
                </View>
              </TouchableOpacity>
              {index < unitOptions.length - 1 && <Divider />}
            </Fragment>
          ))}
          {unitOptions.length === 0 && (
            <Text style={styles.emptyprd}>No Units found</Text>
          )}
        </ScrollView>
      </Menu>
      <AlertModal
        showModal={showAlertModal}
        handleClose={() => setShowAlertModal(false)}
        modalTitle="Alert"
        message={alertMessage}
      />
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

export default SearchUnitMenu;
