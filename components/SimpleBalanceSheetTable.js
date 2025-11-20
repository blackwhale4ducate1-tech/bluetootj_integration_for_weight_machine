import {StyleSheet, Text, View, ScrollView} from 'react-native';
import {useEffect, useState} from 'react';
import axios from 'axios';
import {API_BASE_URL} from '../config';
import {useAuth} from './AuthContext';
import TableStyles from './TableStyles';

const SimpleBalanceSheetTable = () => {
  const {data} = useAuth();
  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleString().replace(/[/:]/g, '_');
  const [balanceSheet, setBalanceSheet] = useState([]);
  const [liabilityTotal, setLiabilityTotal] = useState(0);
  const [assetsTotal, setAssetsTotal] = useState(0);

  const getBalanceSheetSimpleData = async company_name => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/getBalanceSheetSimpleData?company_name=${company_name}`,
      );
      setBalanceSheet(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getBalanceSheetSimpleData(data.company_name);
  }, [data.company_name]);

  useEffect(() => {
    // Calculate the total amounts
    let liabilitySum = 0;
    let assetsSum = 0;

    balanceSheet.forEach(row => {
      if (!isNaN(parseFloat(row.liability_amount))) {
        liabilitySum += parseFloat(row.liability_amount);
      }
      if (!isNaN(parseFloat(row.asset_amount))) {
        assetsSum += parseFloat(row.asset_amount);
      }
    });

    setLiabilityTotal(liabilitySum);
    setAssetsTotal(assetsSum);
  }, [balanceSheet]);

  return (
    <ScrollView>
      <ScrollView horizontal={true}>
      <View style={TableStyles.tableContainer}>
        <View style={TableStyles.headerRow}>
          <Text style={TableStyles.header}>Liabilities</Text>
          <Text style={[TableStyles.header, TableStyles.textRight]}>
            Amount
          </Text>
          <Text style={TableStyles.header}>Assets</Text>
          <Text style={[TableStyles.header, TableStyles.textRight]}>
            Amount
          </Text>
        </View>
        <View style={TableStyles.body}>
          {balanceSheet.map((row, index) => (
            <View style={TableStyles.row} key={index}>
              <Text style={TableStyles.cell}>{row.liabilities}</Text>
              <Text style={[TableStyles.cell, TableStyles.textRight]}>
                {Number(row.liability_amount).toFixed(2)}
              </Text>
              <Text style={TableStyles.cell}>{row.assets}</Text>
              <Text style={[TableStyles.cell, TableStyles.textRight]}>
                {Number(row.asset_amount).toFixed(2)}
              </Text>
            </View>
          ))}
          <View style={TableStyles.headerRow}>
            <Text style={TableStyles.header}>Total</Text>
            <Text style={[TableStyles.header, TableStyles.textRight]}>
              {liabilityTotal.toFixed(2)}
            </Text>
            <Text style={TableStyles.header}>Total</Text>
            <Text style={[TableStyles.header, TableStyles.textRight]}>
              {assetsTotal.toFixed(2)}
            </Text>
          </View>
        </View>
      </View>
      </ScrollView>
   
    </ScrollView>
  );
};

export default SimpleBalanceSheetTable;

const styles = StyleSheet.create({});
