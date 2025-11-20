import {StyleSheet, Text, View, ScrollView} from 'react-native';
import {useEffect, useState} from 'react';
import axios from 'axios';
import {API_BASE_URL} from '../config';
import {useAuth} from './AuthContext';
import {COLORS, FONTS} from '../constants';
import TableStyles from './TableStyles';

const DetailedTrialBalanceTable = ({formData}) => {
  const {data} = useAuth();
  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleString().replace(/[/:]/g, '_');
  const [trialBalance, setTrialBalance] = useState([]);
  const [debitTotal, setDebitTotal] = useState(0);
  const [creditTotal, setCreditTotal] = useState(0);
  const [openingBalance, setOpeningBalance] = useState(0);

  useEffect(() => {
    const fetchData = async company_name => {
      try {
        const fromDateStr = formData.fromDate.toISOString().split('T')[0];
        const toDateStr = formData.toDate.toISOString().split('T')[0];
        const response = await axios.get(
          `${API_BASE_URL}/api/getTrialBalanceDetailedData?fromDate=${fromDateStr}&toDate=${toDateStr}&company_name=${company_name}`,
        );
        setTrialBalance(response.data.trialBalanceData);
        setOpeningBalance(response.data.openingBalance);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData(data.company_name);
  }, [formData, data.company_name]);

  useEffect(() => {
    // Calculate the total amounts
    let debitSum = 0;
    let creditSum = 0;

    trialBalance.forEach(row => {
      if (!isNaN(parseFloat(row.DEBIT))) {
        debitSum += parseFloat(row.DEBIT);
      }
      if (!isNaN(parseFloat(row.CREDIT))) {
        creditSum += parseFloat(row.CREDIT);
      }
    });

    setDebitTotal(debitSum);
    setCreditTotal(creditSum);
  }, [trialBalance]);

  return (
    <ScrollView>
      <ScrollView horizontal={true}>
        <View style={TableStyles.tableContainer}>
          <View style={TableStyles.headerRow}>
            <Text style={TableStyles.header}>Particulars</Text>
            <Text style={[TableStyles.header, TableStyles.textRight]}>
              Debit by Ledger Group
            </Text>
            <Text style={[TableStyles.header, TableStyles.textRight]}>
              Debit by Account Group
            </Text>
            <Text style={[TableStyles.header, TableStyles.textRight]}>
              Credit by Ledger Group
            </Text>
            <Text style={[TableStyles.header, TableStyles.textRight]}>
              Credit by Account Group
            </Text>
          </View>
          <View style={TableStyles.body}>
            {openingBalance > 0 && (
              <View style={styles.row}>
                <Text style={TableStyles.cell}>
                  Difference in Opening Balance
                </Text>
                <Text style={TableStyles.cell}></Text>
                <Text style={TableStyles.cell}></Text>
                <Text style={TableStyles.cell}></Text>
                <Text style={[TableStyles.cell, TableStyles.textRight]}>
                  {Number(openingBalance).toFixed(2)}
                </Text>
              </View>
            )}
            {trialBalance.map(row => (
              <View key={row.account_group}>
                <View style={TableStyles.row}>
                  <Text style={TableStyles.cellBold}>{row.account_group}</Text>
                  <Text
                    style={[
                      TableStyles.cellBold,
                      TableStyles.textRight,
                    ]}></Text>
                  <Text style={[TableStyles.cellBold, TableStyles.textRight]}>
                    {Number(row.DEBIT).toFixed(2)}
                  </Text>
                  <Text
                    style={[
                      TableStyles.cellBold,
                      TableStyles.textRight,
                    ]}></Text>
                  <Text style={[TableStyles.cellBold, TableStyles.textRight]}>
                    {Number(-row.CREDIT).toFixed(2)}
                  </Text>
                </View>
                {row.childData.map(childRow => (
                  <View style={TableStyles.row} key={childRow.ledger_group}>
                    <Text style={TableStyles.cell}>
                      {childRow.ledger_group}
                    </Text>
                    <Text style={[TableStyles.cell, TableStyles.textRight]}>
                      {Number(childRow.DEBIT).toFixed(2)}
                    </Text>
                    <Text
                      style={[TableStyles.cell, TableStyles.textRight]}></Text>
                    <Text style={[TableStyles.cell, TableStyles.textRight]}>
                      {Number(-childRow.CREDIT).toFixed(2)}
                    </Text>
                    <Text
                      style={[TableStyles.cell, TableStyles.textRight]}></Text>
                  </View>
                ))}
              </View>
            ))}

            <View style={TableStyles.headerRow}>
              <Text style={TableStyles.header}>Total</Text>
              <Text style={TableStyles.header}></Text>
              <Text style={[TableStyles.header, TableStyles.textRight]}>
                {debitTotal.toFixed(2)}
              </Text>
              <Text style={[TableStyles.header, TableStyles.textRight]}></Text>
              <Text style={[TableStyles.header, TableStyles.textRight]}>
                {Number(-creditTotal).toFixed(2)}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </ScrollView>
  );
};

export default DetailedTrialBalanceTable;

const styles = StyleSheet.create({});
