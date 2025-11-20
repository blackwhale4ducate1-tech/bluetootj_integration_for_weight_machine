// import {
//   View,
//   Text,
//   ScrollView,
//   TouchableOpacity,
//   SafeAreaView,
//   StyleSheet,
//   Image,
//   Dimensions,
// } from 'react-native';
// import React from 'react';
// import {
//   icons,
//   FONTS,
//   COLORS,
//   FontAwesome5,
//   FontAwesome,
// } from '../constants';
// import {useNavigation} from '@react-navigation/native';
// import LinearGradient from 'react-native-linear-gradient';
// import {
//   BarChart,
//   PieChart,
// } from 'react-native-chart-kit';
// import {Table, Row, Rows} from 'react-native-table-component';

// const screenWidth = Dimensions.get('window').width;
// export default function Dashboard() {
//   const navigation = useNavigation();
//   const saleschartConfig = {
//     backgroundColor: '#fff',
//     backgroundGradientFrom: '#fff',
//     backgroundGradientFromOpacity: 0,
//     backgroundGradientTo: '#fff',
//     backgroundGradientToOpacity: 0,
//     color: (opacity = 1) => `rgba(26, 115, 232, ${opacity})`,
//     strokeWidth: 2,
//     barPercentage: 0.5,
//     useShadowColorFromDataset: false,
//   };
//   const data = {
//     labels: ['January', 'February', 'March', 'April', 'May', 'June'],
//     datasets: [
//       {
//         data: [20, 45, 28, 80, 99, 43],
//       },
//     ],
//   };

//   const salesMonthConfig = {
//     backgroundColor: '#fff',
//     backgroundGradientFrom: '#fff',
//     backgroundGradientFromOpacity: 0,
//     backgroundGradientTo: '#fff',
//     backgroundGradientToOpacity: 0,
//     color: (opacity = 1) => `rgba(216, 27, 96, ${opacity})`,
//     strokeWidth: 2,
//     barPercentage: 0.5,
//     useShadowColorFromDataset: false,
//   };

//   const storeChartConfig = {
//     backgroundColor: '#fff',
//     backgroundGradientFrom: '#fff',
//     backgroundGradientFromOpacity: 0,
//     backgroundGradientTo: '#fff',
//     backgroundGradientToOpacity: 0,
//     color: (opacity = 1) => `rgba(67, 160, 71, ${opacity})`,
//     strokeWidth: 2,
//     barPercentage: 0.5,
//     useShadowColorFromDataset: false,
//   };

//   // pie chart data

//   const piedata = [
//     {
//       name: 'Seoul',
//       population: 21500000,
//       color: '#d81b60',
//       legendFontColor: '#7F7F7F',
//       legendFontSize: 15,
//     },
//     {
//       name: 'Toronto',
//       population: 2800000,
//       color: '#43a047',
//       legendFontColor: 'rgba(54,162,235,255)',
//       legendFontSize: 15,
//     },

//     {
//       name: 'Moscow',
//       population: 11920000,
//       color: '#8e24aa',
//       legendFontColor: '#7F7F7F',
//       legendFontSize: 15,
//     },
//   ];

//   const header = ['Username', 'Sales Sum'];
//   const tabledata = [
//     ['gfg1', 'gfg2'],
//     ['gfg4', 'gfg5'],
//     ['gfg7', 'gfg8'],
//   ];
//   const header2 = ['Product Code', 'Sales Sum'];
//   const tabledata2 = [
//     ['gfg1', 'gfg2'],
//     ['gfg4', 'gfg5'],
//     ['gfg7', 'gfg8'],
//   ];
//   return (
//     <SafeAreaView style={styles.container}>
//       <View style={styles.heading}>
//         <TouchableOpacity onPress={() => navigation.goBack()}>
//           <Image source={icons.back} style={styles.backicon} />
//         </TouchableOpacity>
//         <Text style={styles.headingText}>Dashboard</Text>
//       </View>
//       <ScrollView showsVerticalScrollIndicator={false}>
//         <LinearGradient
//           colors={['#49a3f1', '#1a73e8']}
//           start={{x: 0, y: 0}}
//           end={{x: 1, y: 0}}
//           style={styles.customerCountContainer}>
//           <View style={styles.dashboardItem}>
//             <Text style={styles.label}>Customers Count</Text>
//             <View style={styles.iconbg}>
//               <FontAwesome name="users" size={22} color="#1a73e8" />
//             </View>
//           </View>
//           <Text style={styles.countText}>0</Text>
//         </LinearGradient>
//         {/* vendor count */}
//         <LinearGradient
//           colors={['#ec407a', '#d81b60']}
//           start={{x: 0, y: 1}}
//           end={{x: 1, y: 1}}
//           style={styles.customerCountContainer}>
//           <View style={styles.dashboardItem}>
//             <Text style={styles.label}>Vendor Count</Text>
//             <View style={styles.iconbg}>
//               <FontAwesome5 name="user-cog" size={22} color="#d81b60" />
//             </View>
//           </View>
//           <Text style={styles.countText}>0</Text>
//         </LinearGradient>
//         {/* today sales */}
//         <LinearGradient
//           colors={['#66bb6a', '#43a047']}
//           start={{x: 0.5, y: 0}}
//           end={{x: 1, y: 1}}
//           locations={[0, 1]}
//           style={styles.customerCountContainer}>
//           <View style={styles.dashboardItem}>
//             <Text style={styles.label}>Today Sales</Text>
//             <View style={styles.iconbg}>
//               <FontAwesome5 name="coins" size={22} color="#43a047" />
//             </View>
//           </View>
//           <Text style={styles.countText}>0</Text>
//         </LinearGradient>
//         {/* today Purchase */}
//         <LinearGradient
//           colors={['#ab47bc', '#8e24aa']}
//           start={{x: 0, y: 1}}
//           end={{x: 1, y: 1}}
//           style={styles.customerCountContainer}>
//           <View style={styles.dashboardItem}>
//             <Text style={styles.label}>Today Purchase</Text>
//             <View style={styles.iconbg}>
//               <FontAwesome5 name="coins" size={22} color="#8e24aa" />
//             </View>
//           </View>
//           <Text style={styles.countText}>0</Text>
//         </LinearGradient>
//         <View style={{marginTop: 20}}>
//           <Text style={styles.graphText}>
//             SalesLastWeek vs SalesCurrentWeek
//           </Text>
//           <BarChart
//             data={data}
//             width={screenWidth}
//             height={220}
//             chartConfig={saleschartConfig}
//             verticalLabelRotation={0}
//           />
//         </View>
//         <View style={{marginTop: 20}}>
//           <Text style={styles.graphText}>
//             SalesLastMonth Vs SalesCurrentMonth
//           </Text>
//           <BarChart
//             data={data}
//             width={screenWidth}
//             height={220}
//             chartConfig={salesMonthConfig}
//             verticalLabelRotation={0}
//           />
//         </View>
//         <View style={{marginTop: 20}}>
//           <Text style={styles.graphText}>Store Count</Text>
//           <BarChart
//             data={data}
//             width={screenWidth}
//             height={220}
//             chartConfig={storeChartConfig}
//             verticalLabelRotation={0}
//           />
//         </View>
//         <View style={{marginTop: 20}}>
//           <Text style={styles.graphText}>Store Count</Text>
//           <PieChart
//             data={piedata}
//             width={screenWidth * 0.9}
//             height={220}
//             chartConfig={storeChartConfig}
//             accessor={'population'}
//             backgroundColor={'transparent'}
//             center={[10, 10]}
//           />
//         </View>
//         <View style={{marginTop: 20, marginBottom: 20}}>
//           <Text style={styles.graphText}>Current Month Sales By Users</Text>
//           <Table borderStyle={{borderWidth: 1, borderColor: COLORS.black}}>
//             <Row
//               data={header}
//               style={{height: 40}}
//               textStyle={styles.text}
              
//             />
//             <Rows
//               data={tabledata}
//               textStyle={styles.textCell}
//             />
//           </Table>
//         </View>
//         <View style={{marginTop: 20, marginBottom: 20}}>
//           <Text style={styles.graphText}>Current Month Sales By Products</Text>
//           <Table borderStyle={{borderWidth: 1, borderColor: COLORS.black}}>
//             <Row
//               data={header2}
//               style={{height: 40,color: COLORS.primary,}}
//               textStyle={styles.text}
//             />
//             <Rows
//               data={tabledata2}
//               // textStyle={{color: COLORS.black, textAlign: 'center'}}
//             />
//           </Table>
//         </View>
//       </ScrollView>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 10,
//   },
//   text: { 
//     color: COLORS.primary,
//       textAlign: 'center',
//       fontWeight: '700',
//    },
//    textCell:{
//     color: COLORS.black,
//       textAlign: 'center',
//    },

//   heading: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   backicon: {
//     width: 20,
//     height: 20,
//     resizeMode: 'contain',
//   },
//   dashboardItem: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'centerS',
//   },
//   label: {
//     fontFamily: FONTS.body1.fontFamily,
//     color: COLORS.white,
//     fontWeight: '700',
//     fontSize: 18,
//   },
//   graphText: {
//     fontFamily: FONTS.body1.fontFamily,
//     color: COLORS.black,
//     textAlign: 'center',
//     fontSize: 16,
//     textDecorationLine: 'underline',
//     textDecorationStyle: 'solid',
//     marginBottom: 20,
//   },
//   countText: {
//     fontFamily: FONTS.body1.fontFamily,
//     color: COLORS.white,
//     fontWeight: '700',
//     fontSize: 32,
//     textAlign: 'center',
//     marginTop: 20,
//   },
//   iconbg: {
//     backgroundColor: COLORS.white,
//     width: 40,
//     height: 40,
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderRadius: 10,
//   },
//   headingText: {
//     fontFamily: FONTS.body1.fontFamily,
//     fontSize: 18,
//     fontWeight: '700',
//     marginLeft: 10,
//     color: COLORS.black,
//   },
//   customerCountContainer: {
//     height: 150,
//     padding: 10,
//     borderRadius: 5,
//     marginTop: 20,
//   },
// });






import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
  Image,
  Dimensions,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { icons, FONTS, COLORS, FontAwesome5, FontAwesome } from '../constants';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import { BarChart, PieChart } from 'react-native-chart-kit';
import { Table, Row, Rows } from 'react-native-table-component';
import axios from 'axios';
import { API_BASE_URL } from '../config';
import { useAuth } from '../components/AuthContext';

const screenWidth = Dimensions.get('window').width;

export default function Dashboard() {
  const navigation = useNavigation();
  const { data } = useAuth();
  const [lastWeekSales, setLastWeekSales] = useState(0);
  const [currentWeekSales, setCurrentWeekSales] = useState(0);
  const [lastMonthSales, setLastMonthSales] = useState(0);
  const [currentMonthSales, setCurrentMonthSales] = useState(0);
  const [monthlySalesByUser, setMonthlySalesByUser] = useState([]);
  const [monthlySalesByProduct, setMonthlySalesByProduct] = useState([]);
  const [storeCount, setStoreCount] = useState(0);
  const [customerCount, setCustomerCount] = useState(0);
  const [vendorCount, setVendorCount] = useState(0);
  const [currentDaySales, setCurrentDaySales] = useState(0);
  const [currentDayPurchase, setCurrentDayPurchase] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getSalesGraphData = async (companyName) => {
    if (!companyName) {
      setError('Company name not provided');
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const response = await axios.get(
        `${API_BASE_URL}/api/getSalesGraphData?company_name=${companyName}`,
      );
      const responseData = response.data || {};
      setLastWeekSales(Number(responseData.lastWeekSales) || 0);
      setCurrentWeekSales(Number(responseData.currentWeekSales) || 0);
      setLastMonthSales(Number(responseData.lastMonthSales) || 0);
      setCurrentMonthSales(Number(responseData.currentMonthSales) || 0);
      setMonthlySalesByUser(
        Array.isArray(responseData.currentMonthSalesByUser)
          ? responseData.currentMonthSalesByUser
          : [],
      );
      setMonthlySalesByProduct(
        Array.isArray(responseData.currentMonthSalesByProduct)
          ? responseData.currentMonthSalesByProduct
          : [],
      );
      setStoreCount(Number(responseData.storeCount) || 0);
      setCustomerCount(Number(responseData.customerCount) || 0);
      setVendorCount(Number(responseData.vendorCount) || 0);
      setCurrentDaySales(Number(responseData.currentDaySales) || 0);
      setCurrentDayPurchase(Number(responseData.currentDayPurchase) || 0);
      setError(null);
    } catch (err) {
      setError('Failed to load dashboard data');
      console.error('API Error:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getSalesGraphData(data?.company_name);
  }, [data?.company_name]);

  const salesChartWeeklyConfig = {
    backgroundColor: '#fff',
    backgroundGradientFrom: '#fff',
    backgroundGradientFromOpacity: 0,
    backgroundGradientTo: '#fff',
    backgroundGradientToOpacity: 0,
    color: (opacity = 1) => `rgba(26, 115, 232, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.5,
    useShadowColorFromDataset: false,
  };

  const salesChartWeeklyData = {
    labels: ['Last Week', 'This Week'],
    datasets: [
      {
        data: [lastWeekSales || 0, currentWeekSales || 0],
      },
    ],
  };

  const salesChartMonthlyConfig = {
    backgroundColor: '#fff',
    backgroundGradientFrom: '#fff',
    backgroundGradientFromOpacity: 0,
    backgroundGradientTo: '#fff',
    backgroundGradientToOpacity: 0,
    color: (opacity = 1) => `rgba(216, 27, 96, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.5,
    useShadowColorFromDataset: false,
  };

  const salesChartMonthlyData = {
    labels: ['Last Month', 'This Month'],
    datasets: [
      {
        data: [lastMonthSales || 0, currentMonthSales || 0],
      },
    ],
  };

  const storeChartConfig = {
    backgroundColor: '#fff',
    backgroundGradientFrom: '#fff',
    backgroundGradientFromOpacity: 0,
    backgroundGradientTo: '#fff',
    backgroundGradientToOpacity: 0,
    color: (opacity = 1) => `rgba(67, 160, 71, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.5,
    useShadowColorFromDataset: false,
  };

  const storeChartData = {
    labels: ['Store Count'],
    datasets: [
      {
        data: [storeCount || 0],
      },
    ],
  };

  const pieChartData = monthlySalesByProduct.length
    ? monthlySalesByProduct.map((product, index) => ({
        name: product.product_code || `Product ${index + 1}`,
        population: Number(product.salesSum) || 0,
        color: ['#d81b60', '#43a047', '#8e24aa'][index % 3],
        legendFontColor: '#7F7F7F',
        legendFontSize: 15,
      }))
    : [{ name: 'No Data', population: 0, color: '#ccc', legendFontColor: '#7F7F7F', legendFontSize: 15 }];

  const header = ['Username', 'Sales Sum'];
  const tableData = monthlySalesByUser.length
    ? monthlySalesByUser.map((user) => [user.username || 'N/A', user.salesSum || 0])
    : [['No Data', '0']];

  const header2 = ['Product Code', 'Sales Sum'];
  const tableData2 = monthlySalesByProduct.length
    ? monthlySalesByProduct.map((product) => [product.product_code || 'N/A', product.salesSum || 0])
    : [['No Data', '0']];

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.loadingText}>Loading...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.heading}>
        <TouchableOpacity onPress={() => navigation.goBack()} accessibilityLabel="Go back">
          <Image source={icons.back} style={styles.backicon} accessibilityLabel="Back icon" />
        </TouchableOpacity>
        <Text style={styles.headingText}>Dashboard</Text>
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
      <ScrollView showsVerticalScrollIndicator={false}>
        <LinearGradient
          colors={['#49a3f1', '#1a73e8']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.customerCountContainer}>
          <View style={styles.dashboardItem}>
            <Text style={styles.label}>Customers Count</Text>
            <View style={styles.iconbg}>
              <FontAwesome name="users" size={22} color="#1a73e8" accessibilityLabel="Users icon" />
            </View>
          </View>
          <Text style={styles.countText}>{customerCount}</Text>
        </LinearGradient>
        <LinearGradient
          colors={['#ec407a', '#d81b60']}
          start={{ x: 0, y: 1 }}
          end={{ x: 1, y: 1 }}
          style={styles.customerCountContainer}>
          <View style={styles.dashboardItem}>
            <Text style={styles.label}>Vendor Count</Text>
            <View style={styles.iconbg}>
              <FontAwesome5 name="user-cog" size={22} color="#d81b60" accessibilityLabel="User settings icon" />
            </View>
          </View>
          <Text style={styles.countText}>{vendorCount}</Text>
        </LinearGradient>
        <LinearGradient
          colors={['#66bb6a', '#43a047']}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.customerCountContainer}>
          <View style={styles.dashboardItem}>
            <Text style={styles.label}>Today Sales</Text>
            <View style={styles.iconbg}>
              <FontAwesome5 name="coins" size={22} color="#43a047" accessibilityLabel="Coins icon" />
            </View>
          </View>
          <Text style={styles.countText}>{currentDaySales}</Text>
        </LinearGradient>
        <LinearGradient
          colors={['#ab47bc', '#8e24aa']}
          start={{ x: 0, y: 1 }}
          end={{ x: 1, y: 1 }}
          style={styles.customerCountContainer}>
          <View style={styles.dashboardItem}>
            <Text style={styles.label}>Today Purchase</Text>
            <View style={styles.iconbg}>
              <FontAwesome5 name="coins" size={22} color="#8e24aa" accessibilityLabel="Coins icon" />
            </View>
          </View>
          <Text style={styles.countText}>{currentDayPurchase}</Text>
        </LinearGradient>
        <View style={{ marginTop: 20 }}>
          <Text style={styles.graphText}>Sales Last Week vs Current Week</Text>
          <BarChart
            data={salesChartWeeklyData}
            width={screenWidth - 20}
            height={220}
            chartConfig={salesChartWeeklyConfig}
            verticalLabelRotation={0}
            accessibilityLabel="Weekly sales bar chart"
          />
        </View>
        <View style={{ marginTop: 20 }}>
          <Text style={styles.graphText}>Sales Last Month vs Current Month</Text>
          <BarChart
            data={salesChartMonthlyData}
            width={screenWidth - 20}
            height={220}
            chartConfig={salesChartMonthlyConfig}
            verticalLabelRotation={0}
            accessibilityLabel="Monthly sales bar chart"
          />
        </View>
        <View style={{ marginTop: 20 }}>
          <Text style={styles.graphText}>Store Count</Text>
          <BarChart
            data={storeChartData}
            width={screenWidth - 20}
            height={220}
            chartConfig={storeChartConfig}
            verticalLabelRotation={0}
            accessibilityLabel="Store count bar chart"
          />
        </View>
        <View style={{ marginTop: 20 }}>
          <Text style={styles.graphText}>Sales by Product</Text>
          <PieChart
            data={pieChartData}
            width={screenWidth * 0.9}
            height={220}
            chartConfig={storeChartConfig}
            accessor={'population'}
            backgroundColor={'transparent'}
            center={[10, 10]}
            accessibilityLabel="Sales by product pie chart"
          />
        </View>
        <View style={{ marginTop: 20, marginBottom: 20 }}>
          <Text style={styles.graphText}>Current Month Sales By Users</Text>
          <Table borderStyle={{ borderWidth: 1, borderColor: COLORS.black }}>
            <Row data={header} style={{ height: 40 }} textStyle={styles.text} />
            <Rows data={tableData} textStyle={styles.textCell} />
          </Table>
        </View>
        <View style={{ marginTop: 20, marginBottom: 20 }}>
          <Text style={styles.graphText}>Current Month Sales By Products</Text>
          <Table borderStyle={{ borderWidth: 1, borderColor: COLORS.black }}>
            <Row data={header2} style={{ height: 40 }} textStyle={styles.text} />
            <Rows data={tableData2} textStyle={styles.textCell} />
          </Table>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: COLORS.white,
  },
  text: {
    color: COLORS.primary,
    textAlign: 'center',
    fontWeight: '700',
    fontSize: 16,
  },
  textCell: {
    color: COLORS.black,
    textAlign: 'center',
    fontSize: 14,
  },
  heading: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  backicon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
  dashboardItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontFamily: FONTS.body1?.fontFamily || 'Arial',
    color: COLORS.white,
    fontWeight: '700',
    fontSize: 18,
  },
  graphText: {
    fontFamily: FONTS.body1?.fontFamily || 'Arial',
    color: COLORS.black,
    textAlign: 'center',
    fontSize: 16,
    textDecorationLine: 'underline',
    textDecorationStyle: 'solid',
    marginBottom: 10,
  },
  countText: {
    fontFamily: FONTS.body1?.fontFamily || 'Arial',
    color: COLORS.white,
    fontWeight: '700',
    fontSize: 32,
    textAlign: 'center',
    marginTop: 20,
  },
  iconbg: {
    backgroundColor: COLORS.white,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  headingText: {
    fontFamily: FONTS.body1?.fontFamily || 'Arial',
    fontSize: 18,
    fontWeight: '700',
    marginLeft: 10,
    color: COLORS.black,
  },
  customerCountContainer: {
    height: 120,
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  errorText: {
    color: COLORS.red || '#ff0000',
    textAlign: 'center',
    fontSize: 16,
    marginVertical: 10,
  },
  loadingText: {
    color: COLORS.black,
    textAlign: 'center',
    fontSize: 18,
    marginTop: 20,
  },
});
