import {useEffect, useState, useRef} from 'react';
import {Text, View, ScrollView, Dimensions} from 'react-native';
import axios from 'axios';
import {API_BASE_URL} from '../config';
import {useAuth} from './AuthContext';
import styles from '../screens/ReportItemStyles';
import {
  COLORS,
  FontAwesome5,
  FontAwesome6,
  MaterialIcons,
  FontAwesome,
} from '../constants';
const {height} = Dimensions.get('screen');

export default function StocksReportData({formData, selectedFields}) {
  const {data} = useAuth();
  const tableRef = useRef(null);
  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleString().replace(/[/:]/g, '_');
  const [dayBookData, setDayBookData] = useState([]);

  useEffect(() => {
    const getStocksReportData = async company_name => {
      try {
        const encodedStoreName = encodeURIComponent(formData.store_name);
        const encodedProductCode = encodeURIComponent(formData.product_code);
        const encodedProductCategoryName = encodeURIComponent(
          formData.product_category_name,
        );
        const encodedBarcode = encodeURIComponent(formData.barcode);

        const response = await axios.get(
          `${API_BASE_URL}/api/getStocksReportData?` +
            `storeName=${encodedStoreName}` +
            `&productCategoryName=${encodedProductCategoryName}` +
            `&productCode=${encodedProductCode}` +
            `&barcode=${encodedBarcode}` +
            `&company_name=${company_name}` +
            `&selectedFields=${JSON.stringify(selectedFields)}`,
        );
        setDayBookData(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    getStocksReportData(data.company_name);
  }, [formData, selectedFields, data.company_name]);

  return (
    <View style={{height: height * 0.8}}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View>
          {dayBookData.map((row, index) => (
            <View key={`row-${index}`}>
              <View style={styles.reportView}>
                {selectedFields.storeName && (
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginTop: 20,
                    }}>
                    <FontAwesome5 name="store" size={18} color={COLORS.blue} />
                    <Text style={[styles.cardValues, {paddingLeft: 7}]}>
                      <Text style={styles.cardText}>Store Name : </Text>{' '}
                      {row.store_name}
                    </Text>
                  </View>
                )}
                {selectedFields.barcode && (
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginTop: 20,
                    }}>
                    <FontAwesome5
                      name="barcode"
                      size={18}
                      color={COLORS.yellow}
                    />
                    <Text style={[styles.cardValues, {paddingLeft: 7}]}>
                      <Text style={styles.cardText}>Barcode :</Text>{' '}
                      {row.barcode}
                    </Text>
                  </View>
                )}
                {selectedFields.productCategory && (
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginTop: 20,
                    }}>
                    <MaterialIcons
                      name="production-quantity-limits"
                      size={18}
                      color={COLORS.purple}
                    />
                    <Text style={[styles.cardValues, {paddingLeft: 7}]}>
                      <Text style={styles.cardText}>Product Category :</Text>{' '}
                      {row.product_category}
                    </Text>
                  </View>
                )}
                {selectedFields.productCode && (
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginTop: 20,
                    }}>
                    <MaterialIcons
                      name="production-quantity-limits"
                      size={18}
                      color={COLORS.purple}
                    />
                    <Text style={[styles.cardValues, {paddingLeft: 7}]}>
                      <Text style={styles.cardText}>Product Code :</Text>{' '}
                      {row.product_code}
                    </Text>
                  </View>
                )}
                {selectedFields.purchasePrice && (
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginTop: 15,
                    }}>
                    <FontAwesome6
                      name="money-bill-wheat"
                      size={18}
                      color={COLORS.primary}
                    />
                    <Text style={[styles.cardValues, {paddingLeft: 7}]}>
                      <Text style={styles.cardText}>Purchase Price :</Text>{' '}
                      {row.purchase_price}
                    </Text>
                  </View>
                )}
                {selectedFields.salesPrice && (
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginTop: 15,
                    }}>
                    <FontAwesome6
                      name="money-bill-wheat"
                      size={18}
                      color={COLORS.primary}
                    />
                    <Text style={[styles.cardValues, {paddingLeft: 7}]}>
                      <Text style={styles.cardText}>Sales Price :</Text>{' '}
                      {row.sales_price}
                    </Text>
                  </View>
                )}
                {selectedFields.mrp && (
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginTop: 15,
                    }}>
                    <FontAwesome6
                      name="money-bill-wheat"
                      size={18}
                      color={COLORS.primary}
                    />
                    <Text style={[styles.cardValues, {paddingLeft: 7}]}>
                      <Text style={styles.cardText}>MRP :</Text> {row.mrp}
                    </Text>
                  </View>
                )}
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginTop: 15,
                  }}>
                  <FontAwesome
                    name="shopping-basket"
                    size={18}
                    color={COLORS.red}
                  />
                  <Text style={[styles.cardValues, {paddingLeft: 7}]}>
                    <Text style={styles.cardText}>Qty : </Text>
                    {row.qty}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
