import {StyleSheet, Text, View} from 'react-native';
import {useEffect, useState} from 'react';
import axios from 'axios';
import {API_BASE_URL} from '../config';
import {useAuth} from './AuthContext';
import {COLORS, FONTS} from '../constants';
import {ScrollView} from 'react-native-gesture-handler';
import TableStyles from './TableStyles';

const SimpleProfitAndLossTable = () => {
  
  const {data} = useAuth();
  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleString().replace(/[/:]/g, '_');
  const [profitAndLoss, setProfitAndLoss] = useState([]);

  const getProfitAndLossSimpleData = async company_name => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/getProfitAndLossSimpleData?company_name=${company_name}`,
      );
      setProfitAndLoss(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getProfitAndLossSimpleData(data.company_name);
  }, [data.company_name]);

  return (
    <ScrollView>
     
      <View style={TableStyles.tableContainer}>
        <View style={TableStyles.headerRow}>
          <Text style={TableStyles.header}>Particulars</Text>
          <Text style={[TableStyles.header, TableStyles.textRight]}>Debit</Text>
          <Text style={TableStyles.header}>Particulars</Text>
          <Text style={[TableStyles.header, TableStyles.textRight]}>
            Credit
          </Text>
        </View>
        <View style={TableStyles.body}>
          {profitAndLoss.map((row, index) => (
            <View style={TableStyles.row} key={index}>
              <Text style={TableStyles.cell}>{row.debit_account_group}</Text>
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
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

export default SimpleProfitAndLossTable;

const styles = StyleSheet.create({});
