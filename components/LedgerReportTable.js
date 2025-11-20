import {useEffect, useState, useRef} from 'react';
import {Text, View, ScrollView, Dimensions} from 'react-native';
import axios from 'axios';
import {API_BASE_URL} from '../config';
import {useAuth} from './AuthContext';
import styles from '../screens/ReportItemStyles';
import {
  COLORS,
  FontAwesome6,
  FontAwesome5,
  MaterialCommunityIcons,
  Foundation,
} from '../constants';

const {height} = Dimensions.get('screen');

const formatDate = date => {
  const options = {year: 'numeric', month: '2-digit', day: '2-digit'};
  return new Date(date).toLocaleDateString('en-GB', options);
};

export default function LedgerReportTable({formData}) {
  const {data} = useAuth();
  const tableRef = useRef(null);
  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleString().replace(/[/:]/g, '_');
  const [ledgerReportData, setLedgerReportData] = useState([]);

  useEffect(() => {
    const getLedgerReportkData = async company_name => {
      try {
        const fromDateStr = formData.fromDate.toISOString().split('T')[0];
        const toDateStr = formData.toDate.toISOString().split('T')[0];
        const encodedLedgerName = encodeURIComponent(formData.ledgerName);
        const response = await axios.get(
          `${API_BASE_URL}/api/getledgerReportData?fromDate=${fromDateStr}&toDate=${toDateStr}&ledgerName=${encodedLedgerName}&company_name=${company_name}`,
        );
        if (response.data.message) {
          setLedgerReportData(response.data.message);
        } else if (response.data.error) {
          setLedgerReportData([]);
        }
      } catch (error) {
        console.log(error);
      }
    };
    getLedgerReportkData(data.company_name);
  }, [formData, data.company_name]);
  return (
    <View>
      <View style={{height: height * 0.8}}>
        <Text
          style={[
            styles.cardValues,
            {color: COLORS.black, marginTop: 10, textAlign: 'center'},
          ]}>
          {formData.ledgerName} Ledger Report
        </Text>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View>
            {ledgerReportData.map((row, index) => (
              <View key={`row-${index}`}>
                <View style={styles.reportView}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginTop: 20,
                    }}>
                    <FontAwesome5
                      name="calendar-alt"
                      size={18}
                      color={COLORS.red}
                    />
                    <Text style={[styles.cardValues, {paddingLeft: 7}]}>
                      <Text style={styles.cardText}>Invoice Date :</Text>{' '}
                      {formatDate(row.invoice_date)}
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginTop: 20,
                    }}>
                    <Foundation
                      name="clipboard-notes"
                      size={20}
                      color={COLORS.blue}
                    />
                    <Text style={[styles.cardValues, {paddingLeft: 7}]}>
                      <Text style={styles.cardText}>Particulars :</Text>{' '}
                      {row.particulars}
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginTop: 15,
                    }}>
                    <MaterialCommunityIcons
                      name="format-list-numbered"
                      size={20}
                      color={COLORS.yellow}
                    />
                    <Text style={[styles.cardValues, {paddingLeft: 7}]}>
                      <Text style={styles.cardText}>Invoice Type:</Text>{' '}
                      {row.invoice_type}
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginTop: 15,
                    }}>
                    <MaterialCommunityIcons
                      name="format-list-numbered"
                      size={20}
                      color={COLORS.purple}
                    />
                    <Text style={[styles.cardValues, {paddingLeft: 7}]}>
                      <Text style={styles.cardText}>Invoice No :</Text>
                      {row.invoice_no}
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
                      <Text style={styles.cardText}>Debit Amount :</Text>
                      {row.debit_amount}
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
                      <Text style={styles.cardText}>Credit Amount :</Text>
                      {row.credit_amount}
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
                      <Text style={styles.cardText}>Balance Amount :</Text>
                      {row.balance_amount}
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
        <View style={styles.childView}>
          <View style={styles.childWrapper}>
            <Text style={styles.cardText}>Balance : </Text>
            <Text style={styles.cardValues}>
              {' '}
              {ledgerReportData.length > 0
                ? ledgerReportData[ledgerReportData.length - 1].balance_amount
                : 0}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}
