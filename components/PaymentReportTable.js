import {useEffect, useState, useRef} from 'react';
import {Text, View, ScrollView, Dimensions} from 'react-native';
import axios from 'axios';
import {API_BASE_URL} from '../config';
import {useAuth} from './AuthContext';
import styles from '../screens/ReportItemStyles';
import {
  COLORS,
  Foundation,
  FontAwesome6,
  MaterialCommunityIcons,
  MaterialIcons,
  FontAwesome5,
} from '../constants';

const {height} = Dimensions.get('screen');

export default function PaymentReportTable({formData}) {
  const {data} = useAuth();
  const tableRef = useRef(null);
  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleString().replace(/[/:]/g, '_');
  const [paymentReportData, setPaymentReportData] = useState([]);
  useEffect(() => {
    const getPaymentReportData = async company_name => {
      try {
        const fromDateStr = formData.fromDate.toISOString().split('T')[0];
        const toDateStr = formData.toDate.toISOString().split('T')[0];
        const response = await axios.get(
          `${API_BASE_URL}/api/getPaymentReportData?fromDate=${fromDateStr}&toDate=${toDateStr}&company_name=${company_name}`,
        );
        setPaymentReportData(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    getPaymentReportData(data.company_name);
  }, [formData, data.company_name]);

  const totalSum = paymentReportData.reduce(
    (acc, row) => {
      acc.amount += row.amount;
      return acc;
    },
    {
      amount: 0,
    },
  );

  return (
    <View style={{height: height * 0.8}}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View>
          {paymentReportData.map((row, index) => (
            <View key={`row-${index}`}>
              <View style={styles.reportView}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <Text style={styles.cardValues}>
                    <Text style={styles.cardText}>Invoice No :</Text>{' '}
                    {row.invoice_no}
                  </Text>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <FontAwesome5
                      name="calendar-alt"
                      size={18}
                      color={COLORS.red}
                    />
                    <Text style={[{paddingLeft: 5}, styles.cardValues]}>
                      {row.invoice_date}
                    </Text>
                  </View>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginTop: 20,
                  }}>
                  <MaterialIcons
                    name="account-balance"
                    size={20}
                    color={COLORS.blue}
                  />
                  <Text style={[styles.cardValues, {paddingLeft: 7}]}>
                    <Text style={styles.cardText}>Mode of Receive :</Text>{' '}
                    {row.mor}
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginTop: 15,
                  }}>
                  <MaterialCommunityIcons
                    name="note-multiple"
                    size={20}
                    color={COLORS.yellow}
                  />
                  <Text style={[styles.cardValues, {paddingLeft: 7}]}>
                    <Text style={styles.cardText}>Ledger :</Text> {row.ledger}
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginTop: 15,
                  }}>
                  <MaterialIcons
                    name="account-balance-wallet"
                    size={18}
                    color={COLORS.primary}
                  />
                  <Text style={[styles.cardValues, {paddingLeft: 7}]}>
                    <Text style={styles.cardText}>Outstanding Balance :</Text>{' '}
                    Rs.
                    {row.outstanding_balance}
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginTop: 15,
                  }}>
                  <Foundation
                    name="clipboard-notes"
                    color={COLORS.red}
                    size={20}
                  />
                  <Text style={[styles.cardValues, {paddingLeft: 7}]}>
                    <Text style={styles.cardText}>Narration :</Text>{' '}
                    {row.narration}
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
                    <Text style={styles.cardText}>Amount :</Text> {row.amount}
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginTop: 15,
                  }}>
                  <FontAwesome5
                    name="user-circle"
                    size={20}
                    color={COLORS.blue}
                  />
                  <Text style={[styles.cardValues, {paddingLeft: 7}]}>
                    <Text style={styles.cardText}>Craeted By User : </Text>
                    {row.username}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
      <View style={[styles.childView]}>
        <View style={styles.childWrapper}>
          <Text style={[styles.cardText, {color: COLORS.blue}]}>
            Total : {totalSum.amount.toFixed(2)}
          </Text>
        </View>
      </View>
    </View>
  );
}
