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

const SearchTaxMenu = ({type}) => {
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

  const taxOptions =
    data.tax_type === 'VAT'
      ? [{value: 'IGST', label: 'VAT'}]
      : [
          {value: 'GST', label: 'GST'},
          {value: 'IGST', label: 'IGST'},
          {value: 'Non Tax', label: 'Non Tax'},
        ];

  const handleClickRow = result => {
    let selectedTax = result.value || '';
    let cgst = 0;
    let sgst = 0;
    let igst = 0;
    let subTotal = 0;

    if (selectedTax === 'GST') {
      cgst = ((Number(newProduct.taxable) * newProduct.cgstP) / 100).toFixed(2);
      sgst = ((Number(newProduct.taxable) * newProduct.sgstP) / 100).toFixed(2);
    } else if (selectedTax === 'IGST') {
      igst = ((Number(newProduct.taxable) * newProduct.igstP) / 100).toFixed(2);
    }

    subTotal = (
      Number(newProduct.taxable) +
      Number(cgst) +
      Number(sgst) +
      Number(igst)
    ).toFixed(2);

    setNewProduct({
      ...newProduct,
      selectedTax: selectedTax,
      cgst: cgst,
      sgst: sgst,
      igst: igst,
      subTotal: subTotal,
    });
  };

  const handleOpenTaxMenu = () => {
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
            label="Tax"
            readOnly={true}
            value={data.tax_type === 'VAT' ? 'VAT' : newProduct.selectedTax}
            disabled={newProduct.productCode === ''}
            outlineColor={COLORS.black}
            textColor={COLORS.black}
            activeOutlineColor={COLORS.primary}
            style={{margin: 10}}
            right={
              <TextInput.Icon
                icon="card-search"
                onPress={handleOpenTaxMenu}
                disabled={newProduct.productCode === ''}
              />
            }
          />
        }>
        {taxOptions.length > 0 && (
          <View style={{flexDirection: 'column', alignItems: 'center'}}>
            <View style={styles.menuItem}>
              <Text style={[styles.cell, styles.marginRight, styles.heading]}>
                Tax
              </Text>
            </View>
          </View>
        )}
        <ScrollView style={{maxHeight: 200, width: '100%'}}>
          {taxOptions.map((taxlist, index) => (
            <Fragment key={index}>
              <TouchableOpacity
                onPress={() => {
                  handleClickRow(taxlist);
                  setMenuVisible(false);
                }}>
                <View style={styles.menuItem}>
                  <Text style={[styles.cell, styles.marginRight]}>
                    {taxlist.label}
                  </Text>
                </View>
              </TouchableOpacity>
              {index < taxOptions.length - 1 && <Divider />}
            </Fragment>
          ))}
          {taxOptions.length === 0 && (
            <Text style={styles.emptyprd}>No Tax found</Text>
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

export default SearchTaxMenu;
