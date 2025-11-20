import React, {useState, useEffect} from 'react';
import {View, TouchableOpacity, StyleSheet, Alert, Text} from 'react-native';
import {IconButton} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import axios from 'axios';
import {API_BASE_URL} from '../config';
import {useAuth} from './AuthContext';
import {COLORS} from '../constants';

const PrevNextInvoice = ({
  invoice_no,
  series_name,
  navigateTo,
  navigateToEdit,
  isEdit = '0',
}) => {
  const navigation = useNavigation();
  const {data} = useAuth();
  const [prevInvoiceNo, setPrevInvoiceNo] = useState(null);
  const [nextInvoiceNo, setNextInvoiceNo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [invoiceNumbers, setInvoiceNumbers] = useState([]);

  useEffect(() => {
    const getPrevNextInvoiceNumbers = async () => {
      if (!invoice_no || !series_name || !data.company_name) {
        console.log('Missing required data:', {invoice_no, series_name, company_name: data.company_name});
        return;
      }

      setLoading(true);
      try {
        console.log('Fetching prev/next for:', {invoice_no, series_name, company_name: data.company_name});
        
        // Handle sales, sales_order and other invoices
        try {
          let apiEndpoint;
          if (series_name === 'sales') {
            apiEndpoint = `${API_BASE_URL}/api/getSalesReport?company_name=${data.company_name}`;
          } else if (series_name === 'sales_order') {
            apiEndpoint = `${API_BASE_URL}/api/getSalesOrderReport?company_name=${data.company_name}`;
          } else if (series_name === 'purchase') {
            apiEndpoint = `${API_BASE_URL}/api/getPurchaseReport?company_name=${data.company_name}`;
          } else if (series_name === 'openingStock') {
            apiEndpoint = `${API_BASE_URL}/api/getOpeningStockReport?company_name=${data.company_name}`;
          } else if (series_name === 'estimate') {
            apiEndpoint = `${API_BASE_URL}/api/getEstimateReport?company_name=${data.company_name}`;
          } else if (series_name === 'pettySales') {
            apiEndpoint = `${API_BASE_URL}/api/getPettySalesReport?company_name=${data.company_name}`;
          } else if (series_name === 'purchase_return') {
            apiEndpoint = `${API_BASE_URL}/api/getPurchaseReturnReport?company_name=${data.company_name}`;
          } else if (series_name === 'production') {
            apiEndpoint = `${API_BASE_URL}/api/getProductionReport?company_name=${data.company_name}`;
          } else {
            throw new Error('Unsupported invoice series');
          }

          const response = await axios.get(apiEndpoint);
          console.log('Report API Response type:', typeof response.data);
          
          if (response.data && Array.isArray(response.data)) {
            // Extract invoice numbers and sort them
            const invoices = response.data
              .map(item => parseInt(item.invoice_no || item.invoiceNo))
              .filter(num => !isNaN(num))
              .sort((a, b) => a - b);
            
            console.log('Available invoices:', invoices);
            setInvoiceNumbers(invoices);
            const currentInvoiceNum = parseInt(invoice_no);
            const currentIndex = invoices.indexOf(currentInvoiceNum);
            
            if (currentIndex !== -1) {
              const prevInvoice = currentIndex > 0 ? invoices[currentIndex - 1] : null;
              const nextInvoice = currentIndex < invoices.length - 1 ? invoices[currentIndex + 1] : null;
              
              setPrevInvoiceNo(prevInvoice);
              setNextInvoiceNo(nextInvoice);
              console.log('Successfully found prev/next:', {prevInvoice, nextInvoice, currentIndex, totalInvoices: invoices.length});
              return;
            } else {
              console.log('Current invoice not found in list, using fallback');
            }
          }
        } catch (error) {
          console.log('Report API failed:', error.message);
        }

        // Fallback: Only allow previous via arithmetic; prevent navigating to non-existent next
        console.log('Using limited fallback for prev/next (no next beyond existing)');
        const currentNum = parseInt(invoice_no);
        setPrevInvoiceNo(currentNum > 1 ? currentNum - 1 : null);
        setNextInvoiceNo(null);
        console.log('Fallback prev/next:', {prev: currentNum > 1 ? currentNum - 1 : null, next: null});
        
      } catch (error) {
        console.log('All methods failed, using basic fallback (no next beyond existing):', error);
        const currentNum = parseInt(invoice_no);
        setPrevInvoiceNo(currentNum > 1 ? currentNum - 1 : null);
        setNextInvoiceNo(null);
      } finally {
        setLoading(false);
      }
    };

    getPrevNextInvoiceNumbers();
  }, [invoice_no, series_name, data.company_name]);

  const handlePrevious = () => {
    console.log('Previous clicked, prevInvoiceNo:', prevInvoiceNo);
    if (prevInvoiceNo) {
      // Always navigate to edit billing with the previous invoice number
      if (series_name === 'sales') {
        console.log('Navigating to nested edit screen: SalesEditBilling > salesEdit with invoice_no:', prevInvoiceNo);
        navigation.push('SalesEditBilling', {
          screen: 'salesEdit',
          params: {invoice_no: prevInvoiceNo},
        });
      } else if (series_name === 'sales_order') {
        console.log('Navigating to nested edit screen: SalesOrderEditBilling > salesOrderEdit with invoice_no:', prevInvoiceNo);
        navigation.push('SalesOrderEditBilling', {
          screen: 'salesOrderEdit',
          params: {invoice_no: prevInvoiceNo},
        });
      } else if (series_name === 'purchase') {
        console.log('Navigating to nested edit screen: PurchaseEditBilling > purchaseEdit with invoice_no:', prevInvoiceNo);
        navigation.push('PurchaseEditBilling', {
          screen: 'purchaseEdit',
          params: {invoice_no: prevInvoiceNo},
        });
      } else if (series_name === 'openingStock') {
        console.log('Navigating to nested edit screen: OpeningStockEditBilling > openingStockEdit with invoice_no:', prevInvoiceNo);
        navigation.push('OpeningStockEditBilling', {
          screen: 'openingStockEdit',
          params: {invoice_no: prevInvoiceNo},
        });
      } else if (series_name === 'estimate') {
        console.log('Navigating to nested edit screen: EstimateEditBilling > estimateEdit with invoice_no:', prevInvoiceNo);
        navigation.push('EstimateEditBilling', {
          screen: 'estimateEdit',
          params: {invoice_no: prevInvoiceNo},
        });
      } else if (series_name === 'pettySales') {
        console.log('Navigating to nested edit screen: PettySalesEditBilling > pettySalesEdit with invoice_no:', prevInvoiceNo);
        navigation.push('PettySalesEditBilling', {
          screen: 'pettySalesEdit',
          params: {invoice_no: prevInvoiceNo},
        });
      } else if (series_name === 'purchase_return') {
        console.log('Navigating to nested edit screen: PurchaseReturnEditBilling > purchaseReturnEdit with invoice_no:', prevInvoiceNo);
        navigation.push('PurchaseReturnEditBilling', {
          screen: 'purchaseReturnEdit',
          params: {invoice_no: prevInvoiceNo},
        });
      } else if (series_name === 'production') {
        console.log('Navigating to nested edit screen: ProductionEditBilling > productionEdit with invoice_no:', prevInvoiceNo);
        navigation.push('ProductionEditBilling', {
          screen: 'productionEdit',
          params: {invoice_no: prevInvoiceNo},
        });
      }
    } else {
      Alert.alert('Info', 'No previous invoice found');
    }
  };

  const handleNext = () => {
    console.log('Next clicked, nextInvoiceNo:', nextInvoiceNo);
    // If we have a valid next that exists in fetched list, go to edit; otherwise check if we're at the last invoice
    const nextExists = nextInvoiceNo && invoiceNumbers.includes(parseInt(nextInvoiceNo));
    const currentInvoiceNum = parseInt(invoice_no);
    const isLastInvoice = invoiceNumbers.length > 0 && currentInvoiceNum === Math.max(...invoiceNumbers);
    
    if (series_name === 'sales') {
      if (nextExists) {
        console.log('Navigating to nested edit screen: SalesEditBilling > salesEdit with invoice_no:', nextInvoiceNo);
        navigation.push('SalesEditBilling', {
          screen: 'salesEdit',
          params: {invoice_no: nextInvoiceNo},
        });
      } else if (isLastInvoice) {
        console.log('At last invoice, navigating to SalesInvoicePage (Sales.js)');
        navigation.navigate('SalesBilling', {
          screen: 'sales',
        });
      } else {
        console.log('Next invoice does not exist, navigating to SalesBilling (create new)');
        navigation.navigate('SalesBilling');
      }
    } else if (series_name === 'sales_order') {
      if (nextExists) {
        console.log('Navigating to nested edit screen: SalesOrderEditBilling > salesOrderEdit with invoice_no:', nextInvoiceNo);
        navigation.push('SalesOrderEditBilling', {
          screen: 'salesOrderEdit',
          params: {invoice_no: nextInvoiceNo},
        });
      } else if (isLastInvoice) {
        console.log('At last invoice, navigating to SalesOrderInvoicePage');
        navigation.navigate('SalesOrderBilling', {
          screen: 'salesOrder',
        });
      } else {
        console.log('Next invoice does not exist, navigating to SalesOrderBilling (create new)');
        navigation.navigate('SalesOrderBilling');
      }
    } else if (series_name === 'purchase') {
      if (nextExists) {
        console.log('Navigating to nested edit screen: PurchaseEditBilling > purchaseEdit with invoice_no:', nextInvoiceNo);
        navigation.push('PurchaseEditBilling', {
          screen: 'purchaseEdit',
          params: {invoice_no: nextInvoiceNo},
        });
      } else if (isLastInvoice) {
        console.log('At last invoice, navigating to PurchaseInvoicePage');
        navigation.navigate('PurchaseBilling', {
          screen: 'purchase',
        });
      } else {
        console.log('Next invoice does not exist, navigating to PurchaseBilling (create new)');
        navigation.navigate('PurchaseBilling');
      }
    } else if (series_name === 'openingStock') {
      if (nextExists) {
        console.log('Navigating to nested edit screen: OpeningStockEditBilling > openingStockEdit with invoice_no:', nextInvoiceNo);
        navigation.push('OpeningStockEditBilling', {
          screen: 'openingStockEdit',
          params: {invoice_no: nextInvoiceNo},
        });
      } else if (isLastInvoice) {
        console.log('At last invoice, navigating to OpeningStockInvoicePage');
        navigation.navigate('OpeningStockBilling', {
          screen: 'openingStock',
        });
      } else {
        console.log('Next invoice does not exist, navigating to OpeningStockBilling (create new)');
        navigation.navigate('OpeningStockBilling');
      }
    } else if (series_name === 'estimate') {
      if (nextExists) {
        console.log('Navigating to nested edit screen: EstimateEditBilling > estimateEdit with invoice_no:', nextInvoiceNo);
        navigation.push('EstimateEditBilling', {
          screen: 'estimateEdit',
          params: {invoice_no: nextInvoiceNo},
        });
      } else if (isLastInvoice) {
        console.log('At last invoice, navigating to EstimateInvoicePage');
        navigation.navigate('EstimateBilling', {
          screen: 'estimate',
        });
      } else {
        console.log('Next invoice does not exist, navigating to EstimateBilling (create new)');
        navigation.navigate('EstimateBilling');
      }
    } else if (series_name === 'pettySales') {
      if (nextExists) {
        console.log('Navigating to nested edit screen: PettySalesEditBilling > pettySalesEdit with invoice_no:', nextInvoiceNo);
        navigation.push('PettySalesEditBilling', {
          screen: 'pettySalesEdit',
          params: {invoice_no: nextInvoiceNo},
        });
      } else if (isLastInvoice) {
        console.log('At last invoice, navigating to PettySalesInvoicePage');
        navigation.navigate('PettySalesBilling', {
          screen: 'pettySales',
        });
      } else {
        console.log('Next invoice does not exist, navigating to PettySalesBilling (create new)');
        navigation.navigate('PettySalesBilling');
      }
    } else if (series_name === 'purchase_return') {
      if (nextExists) {
        console.log('Navigating to nested edit screen: PurchaseReturnEditBilling > purchaseReturnEdit with invoice_no:', nextInvoiceNo);
        navigation.push('PurchaseReturnEditBilling', {
          screen: 'purchaseReturnEdit',
          params: {invoice_no: nextInvoiceNo},
        });
      } else if (isLastInvoice) {
        console.log('At last invoice, navigating to PurchaseReturnInvoicePage');
        navigation.navigate('PurchaseReturnBilling', {
          screen: 'purchaseReturn',
        });
      } else {
        console.log('Next invoice does not exist, navigating to PurchaseReturnBilling (create new)');
        navigation.navigate('PurchaseReturnBilling');
      }
    } else if (series_name === 'production') {
      if (nextExists) {
        console.log('Navigating to nested edit screen: ProductionEditBilling > productionEdit with invoice_no:', nextInvoiceNo);
        navigation.push('ProductionEditBilling', {
          screen: 'productionEdit',
          params: {invoice_no: nextInvoiceNo},
        });
      } else if (isLastInvoice) {
        console.log('At last invoice, navigating to ProductionInvoicePage');
        navigation.navigate('ProductionBilling', {
          screen: 'production',
        });
      } else {
        console.log('Next invoice does not exist, navigating to ProductionBilling (create new)');
        navigation.navigate('ProductionBilling');
      }
    }
  };

  // Debug info
  console.log('PrevNextInvoice render:', {
    invoice_no,
    series_name,
    navigateTo,
    navigateToEdit,
    isEdit,
    prevInvoiceNo,
    nextInvoiceNo,
    loading
  });

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={handlePrevious}
        disabled={loading || !prevInvoiceNo}
        style={[
          styles.arrowButton,
          {opacity: (loading || !prevInvoiceNo) ? 0.3 : 1},
        ]}>
        <Text style={styles.arrowText}>←</Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        onPress={handleNext}
        disabled={loading}
        style={[
          styles.arrowButton,
          {opacity: loading ? 0.3 : 1},
        ]}>
        <Text style={styles.arrowText}>→</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 5,
  },
  arrowButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: COLORS.lightGray,
    marginHorizontal: 2,
    minWidth: 35,
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrowText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
});

export default PrevNextInvoice;
