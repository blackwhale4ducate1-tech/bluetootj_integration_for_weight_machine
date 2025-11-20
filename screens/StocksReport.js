import {View, Text, TouchableOpacity, SafeAreaView} from 'react-native';
import {useState} from 'react';
import {COLORS, MaterialCommunityIcons} from '../constants';
import styles from './ReportItemStyles';
import {useNavigation} from '@react-navigation/native';
import StocksReportData from '../components/StocksReportData';
// import SearchProductForStockMenu from '../components/SearchProductForStockMenu';
import SearchStoreMenu from '../components/SearchStoreMenu';
import CustomStyles from '../components/AddEditModalStyles';
import {Appbar, TextInput, IconButton} from 'react-native-paper';
import SearchProductByProductCategoryForStockMenu from '../components/SearchProductByProductCategoryForStockMenu';
import SearchProductCategoryForStockMenu from '../components/SearchProductCategoryForStockMenu';
import SearchBarcodeForStockMenu from '../components/SearchBarcodeForStockMenu';
import {useAuth} from '../components/AuthContext';
import {Switch} from 'react-native';

export default function StocksReport() {
  const navigation = useNavigation();
  const {data} = useAuth();

  const initialFormData = {
    store_name: '',
    product_code: '',
    product_category_name: '',
    barcode: '',
    validationError: '',
  };

  const [formData, setFormData] = useState(initialFormData);
  const [buttonLabel, setButtonLabel] = useState('Create Report');

  const onClickBtn = () => {
    const updatedFormData = {
      ...formData,
      validationError: '',
      store_name: selectedFields.storeName ? formData.store_name : '',
      product_category_name: selectedFields.productCategory
        ? formData.product_category_name
        : '',
      product_code: selectedFields.productCode ? formData.product_code : '',
    };
    setFormData(updatedFormData);
    buttonLabel === 'Create Report'
      ? setButtonLabel('Back')
      : setButtonLabel('Create Report');
  };

  // Add to existing state declarations
  // Update initial selectedFields state
  const [selectedFields, setSelectedFields] = useState({
    storeName: true,
    barcode: data.is_barcode_exist === 1, // Set based on is_barcode_exist
    productCategory: true,
    productCode: true,
    purchasePrice: true,
    salesPrice: true,
    mrp: true,
  });

  return (
    <View style={CustomStyles.safeContainer}>
      <Appbar.Header style={CustomStyles.appHeader}>
        <Appbar.BackAction
          onPress={() => {
            navigation.goBack();
          }}
          color={COLORS.white}
        />
        <Appbar.Content
          title="Stocks Report"
          titleStyle={CustomStyles.titleStyle}
        />
      </Appbar.Header>

      {buttonLabel === 'Create Report' && (
        <View style={{margin: 10}}>
          <Text style={{fontSize: 16, marginBottom: 10, color: COLORS.black}}>
            Select Fields to Include:
          </Text>

          <View style={{marginBottom: 10}}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 5,
              }}>
              <Switch
                value={selectedFields.storeName}
                onValueChange={value =>
                  setSelectedFields({...selectedFields, storeName: value})
                }
              />
              <Text style={{marginLeft: 10, color: COLORS.black}}>Store Name</Text>
            </View>

            {data.is_barcode_exist === 1 && (
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginBottom: 5,
                }}>
                <Switch
                  value={selectedFields.barcode}
                  onValueChange={value =>
                    setSelectedFields({...selectedFields, barcode: value})
                  }
                />
                <Text style={{marginLeft: 10, color: COLORS.black}}>Barcode</Text>
              </View>
            )}

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 5,
              }}>
              <Switch
                value={selectedFields.productCategory}
                onValueChange={value =>
                  setSelectedFields({...selectedFields, productCategory: value})
                }
              />
              <Text style={{marginLeft: 10, color: COLORS.black}}>Product Category</Text>
            </View>

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 5,
              }}>
              <Switch
                value={selectedFields.productCode}
                onValueChange={value =>
                  setSelectedFields({...selectedFields, productCode: value})
                }
              />
              <Text style={{marginLeft: 10, color: COLORS.black}}>Product Code</Text>
            </View>

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 5,
              }}>
              <Switch
                value={selectedFields.purchasePrice}
                onValueChange={value =>
                  setSelectedFields({...selectedFields, purchasePrice: value})
                }
              />
              <Text style={{marginLeft: 10, color: COLORS.black}}>Purchase Price</Text>
            </View>

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 5,
              }}>
              <Switch
                value={selectedFields.salesPrice}
                onValueChange={value =>
                  setSelectedFields({...selectedFields, salesPrice: value})
                }
              />
              <Text style={{marginLeft: 10, color: COLORS.black}}>Sales Price</Text>
            </View>

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 5,
              }}>
              <Switch
                value={selectedFields.mrp}
                onValueChange={value =>
                  setSelectedFields({...selectedFields, mrp: value})
                }
              />
              <Text style={{marginLeft: 10, color: COLORS.black}}>MRP</Text>
            </View>
          </View>
          {selectedFields.storeName && (
            <SearchStoreMenu
              updateFormData={setFormData}
              storeInput={formData.store_name}
            />
          )}
          {selectedFields.productCategory && (
            <SearchProductCategoryForStockMenu
              updateFormData={setFormData}
              productCategoryInput={formData.product_category_name}
            />
          )}
          {selectedFields.productCode && (
            <SearchProductByProductCategoryForStockMenu
              updateFormData={setFormData}
              productInput={formData.product_code}
              product_category_name={formData.product_category_name}
            />
          )}
          {selectedFields.barcode && (
            <SearchBarcodeForStockMenu
              updateFormData={setFormData}
              barcodeInput={formData.barcode}
            />
          )}
        </View>
      )}

      <Text
        style={[styles.cardValues, {color: COLORS.red, textAlign: 'center'}]}>
        {formData.validationError}
      </Text>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <TouchableOpacity onPress={onClickBtn} style={styles.reportbtn}>
          <Text style={styles.exportText}>{buttonLabel}</Text>
        </TouchableOpacity>
      </View>
      {buttonLabel === 'Back' && (
        <StocksReportData formData={formData} selectedFields={selectedFields} />
      )}
    </View>
  );
}
