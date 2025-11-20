import React, {useEffect, useState, useRef} from 'react';
import {Text, View, ScrollView, SafeAreaView} from 'react-native';
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
import {ActivityIndicator, Card, List} from 'react-native-paper';

export default function OutstandingCustomerReportTable({formData}) {
  const {data} = useAuth();
  const tableRef = useRef(null);
  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleString().replace(/[/:]/g, '_');
  const [ledgerReportData, setLedgerReportData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getLedgerReportData = async company_name => {
      try {
        const fromDateStr = formData.fromDate.toISOString().split('T')[0];
        const toDateStr = formData.toDate.toISOString().split('T')[0];
        const encodedLedgerName = encodeURIComponent(formData.ledgerName);
        const encodedUserName = encodeURIComponent(formData.username);
        const response = await axios.get(
          `${API_BASE_URL}/api/getOutstandingCustomerData?fromDate=${fromDateStr}&toDate=${toDateStr}&ledgerName=${encodedLedgerName}&username=${encodedUserName}&company_name=${company_name}`,
        );
        if (response.data.message) {
          // console.log(
          //   'getOutstandingCustomerData: ' +
          //     JSON.stringify(response.data.message),
          // );
          setLedgerReportData(response.data.message);
        } else if (response.data.error) {
          setLedgerReportData([]);
        }
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    };
    getLedgerReportData(data.company_name);
  }, [formData, data.company_name]);

  const renderAccordionContent = (startIndex, endIndex) => {
    return (
      <Card
        style={{backgroundColor: COLORS.white, padding: 3, marginVertical: 10}}>
        <Card.Title
          title={
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <View>
                <Text style={{fontWeight: 'bold'}}>Customer Name: </Text>
              </View>
              <View>
                <Text>
                  {ledgerReportData[startIndex].invoice_date.substring(6)}
                </Text>
              </View>
            </View>
          }
        />
        {ledgerReportData.slice(startIndex + 1, endIndex).map((row, index) => (
          <Card key={index} style={{margin: 5, backgroundColor: '#78c38733'}}>
            <Card.Content>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginVertical: 5,
                }}>
                <View style={{flex: 1}}>
                  <Text style={{fontWeight: 'bold'}}>Date</Text>
                  <Text>
                    {new Date(row.invoice_date).toLocaleDateString('en-GB')}
                  </Text>
                </View>
                <View style={{flex: 1}}>
                  <Text style={{fontWeight: 'bold'}}>Particulars</Text>
                  <Text>{row.particulars}</Text>
                </View>
                <View style={{flex: 1}}>
                  <Text style={{fontWeight: 'bold'}}>Type</Text>
                  <Text>{row.invoice_type}</Text>
                </View>

                <View style={{flex: 1}}>
                  <Text style={{fontWeight: 'bold'}}>Invoice No</Text>
                  <Text>{row.invoice_no}</Text>
                </View>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginVertical: 5,
                }}>
                <View style={{flex: 1}}>
                  <Text style={{fontWeight: 'bold'}}>User</Text>
                  <Text>{row.username}</Text>
                </View>
                <View style={{flex: 1}}>
                  <Text style={{fontWeight: 'bold'}}>Debit</Text>
                  <Text>{row.debit_amount}</Text>
                </View>
                <View style={{flex: 1}}>
                  <Text style={{fontWeight: 'bold'}}>Credit</Text>
                  <Text>{row.credit_amount}</Text>
                </View>
                <View style={{flex: 1}}>
                  <Text style={{fontWeight: 'bold'}}>Balance</Text>
                  <Text>{row.balance_amount}</Text>
                </View>
              </View>
            </Card.Content>
          </Card>
        ))}
      </Card>
    );
  };

  return (
    <View>
      {loading ? (
        <ActivityIndicator animating={true} color={COLORS.emerald} />
      ) : (
        <View style={{marginVertical: 5}}>
          {ledgerReportData.map((row, index) => (
            <View key={index}>
              {row.invoice_date.startsWith('Name: ')
                ? renderAccordionContent(
                    index,
                    ledgerReportData.findIndex(
                      (r, i) =>
                        i > index && r.invoice_date.startsWith('Name: '),
                    ) >= 0
                      ? ledgerReportData.findIndex(
                          (r, i) =>
                            i > index && r.invoice_date.startsWith('Name: '),
                        )
                      : ledgerReportData.length,
                  )
                : null}
            </View>
          ))}
        </View>
      )}
    </View>
  );
}
