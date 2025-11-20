import {StyleSheet, Text, View} from 'react-native';
import {useEffect, useState} from 'react';
import axios from 'axios';
import {API_BASE_URL} from '../config';
import {useAuth} from './AuthContext';
import {ScrollView} from 'react-native-gesture-handler';
import TableStyles from './TableStyles';

const DetailedProfitAndLossTable = () => {
  const {data} = useAuth();
  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleString().replace(/[/:]/g, '_');
  const [profitAndLoss, setProfitAndLoss] = useState([]);

  useEffect(() => {
    const fetchData = async company_name => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/api/getProfitAndLossDetailedData?company_name=${company_name}`,
        );
        setProfitAndLoss(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData(data.company_name);
  }, [data.company_name]);

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
          <Text style={TableStyles.header}>Particulars</Text>
          <Text style={[TableStyles.header, TableStyles.textRight]}>
            Credit by Ledger Group
          </Text>
          <Text style={[TableStyles.header, TableStyles.textRight]}>
            Credit by Account Group
          </Text>
        </View>
        <View style={TableStyles.body}>
          {profitAndLoss.map((row, index) => (
            <View key={`row-${index}`}>
              <View style={TableStyles.row}>
                <Text style={TableStyles.cell}>{row.debit_account_group}</Text>
                <Text style={[TableStyles.cell, TableStyles.textRight]}></Text>
                <Text
                  style={[
                    TableStyles.textRight,
                    !row.debit_account_group && !row.credit_account_group
                      ? TableStyles.cellBold
                      : TableStyles.cell,
                  ]}>
                  {Number(row.DEBIT).toFixed(2)}
                </Text>
                <Text style={TableStyles.cell}>{row.credit_account_group}</Text>
                <Text style={[TableStyles.cell, TableStyles.textRight]}></Text>
                <Text
                  style={[
                    TableStyles.textRight,
                    !row.debit_account_group && !row.credit_account_group
                      ? TableStyles.cellBold
                      : TableStyles.cell,
                  ]}>
                  {Number(row.CREDIT).toFixed(2)}
                </Text>
              </View>
              {row.childData.map((childRow, childIndex) => (
                <View
                  style={TableStyles.row}
                  key={`childRow-${index}-${childIndex}`}>
                  <Text style={TableStyles.cell}>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{childRow.debit_ledger_group}
                  </Text>
                  <Text style={[TableStyles.cell, TableStyles.textRight]}>
                    {Number(childRow.DEBIT).toFixed(2)}
                  </Text>
                  <Text
                    style={[TableStyles.cell, TableStyles.textRight]}></Text>
                  <Text style={TableStyles.cell}>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{childRow.credit_ledger_group}
                  </Text>
                  <Text style={[TableStyles.cell, TableStyles.textRight]}>
                    {Number(childRow.CREDIT).toFixed(2)}
                  </Text>
                  <Text
                    style={[TableStyles.cell, TableStyles.textRight]}></Text>
                </View>
              ))}
            </View>
          ))}
        </View>
      </View>
      </ScrollView>
     
    </ScrollView>
  );
};

export default DetailedProfitAndLossTable;

const styles = StyleSheet.create({});
