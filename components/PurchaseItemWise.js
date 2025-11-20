import {useEffect, useState, useRef} from 'react';
import {Text, View, ScrollView, Dimensions} from 'react-native';
import axios from 'axios';
import {API_BASE_URL} from '../config';
import {useAuth} from './AuthContext';
import styles from '../screens/ReportItemStyles';
import {COLORS, FontAwesome6, MaterialIcons} from '../constants';

const {height} = Dimensions.get('screen');

export default function PurchaseItemWise({formData}) {
  const {data} = useAuth();
  const tableRef = useRef(null);
  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleString().replace(/[/:]/g, '_');
  const [itemWiseData, setItemWiseData] = useState([]);

  useEffect(() => {
    const getPurchaseItemWiseData = async company_name => {
      try {
        const fromDateStr = formData.fromDate.toISOString().split('T')[0];
        const toDateStr = formData.toDate.toISOString().split('T')[0];
        const encodedProductCode = encodeURIComponent(formData.product_code);
        const response = await axios.get(
          `${API_BASE_URL}/api/getPurchaseItemWiseData?fromDate=${fromDateStr}&toDate=${toDateStr}&productCode=${encodedProductCode}&company_name=${company_name}`,
        );
        console.log('ItemsData: ' + JSON.stringify(response.data));
        setItemWiseData(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    getPurchaseItemWiseData(data.company_name);
  }, [formData, data.company_name]);

  const totalSum = itemWiseData.reduce(
    (acc, row) => {
      acc.total_qty += parseFloat(row.total_qty);
      acc.purchase_price += row.purchase_price;
      return acc;
    },
    {
      total_qty: 0,
      purchase_price: 0,
    },
  );

  return (
    <>
      <View style={{height: height * 0.8}}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View>
            {itemWiseData.map((row, index) => (
              <View key={`row-${index}`}>
                <View style={styles.reportView}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginTop: 20,
                    }}>
                    <MaterialIcons
                      name="shopping-cart"
                      size={18}
                      color={COLORS.blue}
                    />
                    <Text style={[styles.cardValues, {paddingLeft: 7}]}>
                      <Text style={styles.cardText}>Product Code :</Text>{' '}
                      {row.product_code}
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginTop: 20,
                    }}>
                    <MaterialIcons
                      name="production-quantity-limits"
                      size={18}
                      color={COLORS.red}
                    />
                    <Text style={[styles.cardValues, {paddingLeft: 7}]}>
                      <Text style={styles.cardText}>Product Name :</Text>{' '}
                      {row.product_name}
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginTop: 15,
                    }}>
                    <MaterialIcons
                      name="playlist-add-check-circle"
                      size={24}
                      color={COLORS.yellow}
                    />
                    <Text style={[styles.cardValues, {paddingLeft: 7}]}>
                      <Text style={styles.cardText}>Sum of Qty :</Text>{' '}
                      {row.total_qty}
                    </Text>
                  </View>
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
                      <Text style={styles.cardText}>Price :</Text>
                      {row.purchase_price}
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
        <View style={[styles.childView, {marginBottom: 10}]}>
          <View style={styles.childWrapper}>
            <Text style={[styles.cardText, {color: COLORS.red}]}>Total :</Text>
          </View>

          <View style={styles.childWrapper}>
            <Text style={styles.cardText}>Sum Of Qty :</Text>
            <Text style={styles.cardValues}>{totalSum.total_qty}</Text>
          </View>
          <View style={styles.childWrapper}>
            <Text style={styles.cardText}>Price :</Text>
            <Text style={styles.cardValues}>
              {totalSum.purchase_price.toFixed(2)}
            </Text>
          </View>
        </View>
      </View>
    </>
  );
}
