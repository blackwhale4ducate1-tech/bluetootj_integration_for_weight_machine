import {StyleSheet, Text, View, ScrollView} from 'react-native';
import {useEffect, useState} from 'react';
import axios from 'axios';
import {API_BASE_URL} from '../config';
import {useAuth} from './AuthContext';
import TableStyles from './TableStyles';

const DetailedBalanceSheetTable = () => {
  const {data} = useAuth();
  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleString().replace(/[/:]/g, '_');
  const [balanceSheet, setBalanceSheet] = useState([]);
  const [liabilityTotal, setLiabilityTotal] = useState(0);
  const [assetsTotal, setAssetsTotal] = useState(0);

  useEffect(() => {
    const fetchData = async company_name => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/api/getBalanceSheetDetailedData?company_name=${company_name}`,
        );
        setBalanceSheet(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData(data.company_name);
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
            Amount by Ledger Group
          </Text>
          <Text style={[TableStyles.header, TableStyles.textRight]}>
            Amount by Account Group
          </Text>
          <Text style={TableStyles.header}>Assets</Text>
          <Text style={[TableStyles.header, TableStyles.textRight]}>
            Amount by Ledger Group
          </Text>
          <Text style={[TableStyles.header, TableStyles.textRight]}>
            Amount by Account Group
          </Text>
        </View>
        <View style={TableStyles.body}>
          {balanceSheet.map((row, index) => (
            <View key={`row-${index}`}>
              <View style={TableStyles.row}>
                <Text style={TableStyles.cell}>{row.liabilities}</Text>
                <Text style={[TableStyles.cell, TableStyles.textRight]}></Text>
                <Text style={[TableStyles.cell, TableStyles.textRight]}>
                  {Number(row.liability_amount).toFixed(2)}
                </Text>
                <Text style={TableStyles.cell}>{row.assets}</Text>
                <Text style={[TableStyles.cell, TableStyles.textRight]}></Text>
                <Text style={[TableStyles.cell, TableStyles.textRight]}>
                  {Number(row.asset_amount).toFixed(2)}
                </Text>
              </View>
              {row.childData.map((childRow, childIndex) => (
                <View
                  style={TableStyles.row}
                  key={`childRow-${index}-${childIndex}`}>
                  <Text style={TableStyles.cell}>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{childRow.liabilities}
                  </Text>
                  <Text style={[TableStyles.cell, TableStyles.textRight]}>
                    {Number(childRow.liability_amount).toFixed(2)}
                  </Text>
                  <Text
                    style={[TableStyles.cell, TableStyles.textRight]}></Text>
                  <Text style={TableStyles.cell}>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{childRow.assets}
                  </Text>
                  <Text style={[TableStyles.cell, TableStyles.textRight]}>
                    {Number(childRow.asset_amount).toFixed(2)}
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
              {liabilityTotal.toFixed(2)}
            </Text>
            <Text style={TableStyles.header}>Total</Text>
            <Text style={TableStyles.header}></Text>
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

export default DetailedBalanceSheetTable;


