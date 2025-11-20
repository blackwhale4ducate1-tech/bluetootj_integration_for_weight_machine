import {useEffect, useState, useRef} from 'react';
import {Text, View, ScrollView, SafeAreaView} from 'react-native';
import axios from 'axios';
import {API_BASE_URL} from '../config';
import {useAuth} from './AuthContext';
import OverlayActivityIndicator from './OverlayActivityIndicator';
import LottieView from 'lottie-react-native';
import {ActivityIndicator, Card, List} from 'react-native-paper';
import {COLORS} from '../constants';

export default function OutstandingStatementReportTable({formData}) {
  const {data} = useAuth();
  const tableRef = useRef(null);
  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleString().replace(/[/:]/g, '_');
  const [ledgerReportData, setLedgerReportData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getLedgerReportkData = async company_name => {
      try {
        const fromDateStr = formData.fromDate.toISOString().split('T')[0];
        const toDateStr = formData.toDate.toISOString().split('T')[0];
        const encodedUserName = encodeURIComponent(formData.username);
        const response = await axios.get(
          `${API_BASE_URL}/api/getOutstandingUserStatement?fromDate=${fromDateStr}&toDate=${toDateStr}&username=${encodedUserName}&company_name=${company_name}`,
        );
        if (response.data.message) {
          // console.log(
          //   'response.data.message: ' + JSON.stringify(response.data.message),
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
    getLedgerReportkData(data.company_name);
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
                <View style={{flex: 1}}>
                  <Text style={{fontWeight: 'bold'}}>Days</Text>
                  <Text>
                    {row.invoice_date.startsWith('Name: ')
                      ? ''
                      : `${Math.floor(
                          (new Date() - new Date(row.invoice_date)) /
                            (1000 * 60 * 60 * 24),
                        )}`}
                  </Text>
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
          <View style={{flexDirection: 'row'}}>
            <View>
              <Text style={{fontWeight: 'bold', fontSize: 20}}>User: </Text>
            </View>
            <View>
              <Text style={{fontSize: 20}}>{formData.username}</Text>
            </View>
          </View>
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
