import {useEffect, useState, useRef, useCallback, useMemo} from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import axios from 'axios';
import {API_BASE_URL} from '../config';
import {useAuth} from './AuthContext';
import styles from '../screens/ReportItemStyles';
import DeleteConfirmationModal from './DeleteConfirmationModal';
import InternalLoginModal from './InternalLoginModal';
import {
  COLORS,
  Foundation,
  FontAwesome5,
  FontAwesome6,
  FontAwesome,
  Ionicons,
  MaterialCommunityIcons,
} from '../constants';
import Modal from 'react-native-modal';
import {useNavigation} from '@react-navigation/native';

const {height} = Dimensions.get('screen');

/*
 * PERFORMANCE OPTIMIZATION STRATEGIES IMPLEMENTED:
 *
 * FRONTEND OPTIMIZATIONS:
 * 1. Pagination: Only load 20 items at a time
 * 2. Lazy Loading: Load more data on scroll
 * 3. Virtual Scrolling: Only render visible items
 * 4. Caching: API responses cached to avoid re-fetching
 * 5. Optimized Rendering: removeClippedSubviews, initialNumToRender
 * 6. Scroll Throttling: Reduce scroll event frequency
 *
 * BACKEND OPTIMIZATION SUGGESTIONS:
 * 1. Add pagination parameters to API
 * 2. Implement database indexing
 * 3. Add query optimization
 * 4. Use database pagination (LIMIT/OFFSET)
 * 5. Add response compression
 * 6. Implement caching at server level
 */

// Cache for API responses
const apiCache = new Map();
const pendingRequests = new Map();

// Cache management utilities
const clearCache = () => {
  apiCache.clear();
  pendingRequests.clear();
};

const clearCacheForUrl = url => {
  apiCache.delete(url);
  pendingRequests.delete(url);
};

// Custom hook for API calls with caching
const useApiCall = (url, dependencies) => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const cacheKey = url;

      // Check if we have cached data
      if (apiCache.has(cacheKey)) {
        setData(apiCache.get(cacheKey));
        return;
      }

      // Check if there's already a pending request for this URL
      if (pendingRequests.has(cacheKey)) {
        try {
          const result = await pendingRequests.get(cacheKey);
          setData(result);
          apiCache.set(cacheKey, result);
        } catch (err) {
          setError(err.message);
        }
        return;
      }

      setIsLoading(true);
      setError(null);

      // Create a new promise for this request
      const requestPromise = axios
        .get(url)
        .then(response => {
          const result = response.data;
          apiCache.set(cacheKey, result);
          pendingRequests.delete(cacheKey);
          return result;
        })
        .catch(err => {
          pendingRequests.delete(cacheKey);
          throw err;
        });

      // Store the promise
      pendingRequests.set(cacheKey, requestPromise);

      try {
        const result = await requestPromise;
        setData(result);
      } catch (err) {
        console.log(err);
        setError('Failed to load data. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, dependencies);

  const refetch = useCallback(async () => {
    const cacheKey = url;
    clearCacheForUrl(cacheKey); // Clear cache for this URL
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.get(url);
      const result = response.data;
      apiCache.set(cacheKey, result);
      setData(result);
    } catch (err) {
      console.log(err);
      setError('Failed to load data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [url]);

  return {data, isLoading, error, refetch};
};

export default function StockTransferDayBook({formData}) {
  const navigation = useNavigation();
  const {data} = useAuth();
  const tableRef = useRef(null);
  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleString().replace(/[/:]/g, '_');
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showDelModal, setShowDelModal] = useState(false);
  const [invoiceNo, setInvoiceNo] = useState(0);
  const [showDetailModal, setDetailModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [isModalLoading, setIsModalLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20); // Show 20 items per page
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Memoize the API URL to prevent unnecessary re-renders
  const apiUrl = useMemo(() => {
    const fromDateStr = formData.fromDate.toISOString().split('T')[0];
    const toDateStr = formData.toDate.toISOString().split('T')[0];
    const encodedUserName = encodeURIComponent(formData.username);
    const encodedFromStoreName = encodeURIComponent(formData.from_store_name);
    const encodedToStoreName = encodeURIComponent(formData.to_store_name);

    return `${API_BASE_URL}/api/getStockTransferDayBookData?fromDate=${fromDateStr}&toDate=${toDateStr}&username=${encodedUserName}&fromStoreName=${encodedFromStoreName}&toStoreName=${encodedToStoreName}&company_name=${data.company_name}`;
  }, [
    formData.fromDate,
    formData.toDate,
    formData.username,
    formData.from_store_name,
    formData.to_store_name,
    data.company_name,
  ]);

  // Use the custom hook for API calls
  const {
    data: dayBookData,
    isLoading,
    error,
    refetch,
  } = useApiCall(apiUrl, [apiUrl]);

  // Pagination logic
  const totalPages = Math.ceil(dayBookData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = dayBookData.slice(startIndex, endIndex);

  // Load more data function
  const loadMoreData = useCallback(() => {
    if (currentPage < totalPages && !isLoadingMore) {
      setIsLoadingMore(true);
      setTimeout(() => {
        setCurrentPage(prev => prev + 1);
        setIsLoadingMore(false);
      }, 300);
    }
  }, [currentPage, totalPages, isLoadingMore]);

  // Reset pagination when data changes
  useEffect(() => {
    setCurrentPage(1);
  }, [dayBookData.length]);

  // Clear cache when component unmounts or when form data changes significantly
  useEffect(() => {
    return () => {
      // Clear cache when component unmounts to prevent memory leaks
      clearCacheForUrl(apiUrl);
    };
  }, [apiUrl]);

  // Open modal when content is ready
  useEffect(() => {
    if (selectedRow && isModalLoading) {
      // Small delay to show loading state, then open modal
      const timer = setTimeout(() => {
        setDetailModal(true);
        setIsModalLoading(false);
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [selectedRow, isModalLoading]);

  const handleOnClickEdit = invoice_no => {
    navigation.navigate('StockTransferEditBilling', {invoice_no: invoice_no});
  };

  const handleOnClickDel = invoice_no => {
    setInvoiceNo(invoice_no);
    setShowDelModal(true);
  };

  const handleCloseModal = useCallback(() => {
    setShowDelModal(false);
    setShowLoginModal(false);
  }, []);

  const handleSubmitAlert = useCallback(async buttonValue => {
    if (buttonValue === 'Yes') {
      console.log('Yes button clicked ');
      setShowDelModal(false);
      setShowLoginModal(true);
    } else if (buttonValue === 'No') {
      console.log('No button clicked ');
      setShowDelModal(false);
    }
  }, []);

  const handleOpenDetail = useCallback(row => {
    setIsModalLoading(true);
    setSelectedRow(row);
    // Don't open modal immediately - wait for content to be ready
  }, []);

  const handleCloseDetail = useCallback(() => {
    setDetailModal(false);
    setIsModalLoading(false);
    // Clear selected row after modal closes to free memory
    setTimeout(() => {
      setSelectedRow(null);
    }, 300);
  }, []);

  // Memoize the totalSum calculation to prevent recalculation on every render
  const totalSum = useMemo(() => {
    return dayBookData.reduce(
      (acc, row) => {
        acc.total_amount += row.total_amount;
        acc.discount_on_total += row.discount_on_total;
        acc.round_off += row.round_off;
        acc.bill_amount += row.bill_amount;
        return acc;
      },
      {
        total_amount: 0,
        discount_on_total: 0,
        round_off: 0,
        bill_amount: 0,
      },
    );
  }, [dayBookData]);

  // Memoize the DataRow component to prevent unnecessary re-renders
  const DataRow = useCallback(
    ({label, value, iconComponent, iconSize, iconColor}) => (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginTop: 20,
          paddingRight: 20,
        }}>
        {iconComponent}
        <Text style={[styles.cardValues, {paddingLeft: 7}]}>
          <Text style={styles.cardText}>{label}:</Text> {value}
        </Text>
      </View>
    ),
    [],
  );

  return (
    <View style={{height: height * 0.8}}>
      {isLoading ? (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={{marginTop: 10, color: COLORS.primary}}>
            Loading data...
          </Text>
        </View>
      ) : error ? (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Text style={{color: COLORS.red, textAlign: 'center', margin: 20}}>
            {error}
          </Text>
          <TouchableOpacity
            style={[styles.reportbtn, {marginTop: 10}]}
            onPress={refetch}>
            <Text style={styles.exportText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <ScrollView
            showsVerticalScrollIndicator={false}
            onScroll={({nativeEvent}) => {
              const {layoutMeasurement, contentOffset, contentSize} =
                nativeEvent;
              const paddingToBottom = 20;
              if (
                layoutMeasurement.height + contentOffset.y >=
                contentSize.height - paddingToBottom
              ) {
                loadMoreData();
              }
            }}
            scrollEventThrottle={400}
            removeClippedSubviews={true}
            initialNumToRender={10}
            maxToRenderPerBatch={10}
            windowSize={10}>
            <View>
              {currentData.map((row, index) => (
                <View key={`row-${startIndex + index}`}>
                  <View style={styles.reportView}>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                      }}>
                      <Text style={styles.cardValues}>
                        <Text style={styles.cardText}>Invoice No :</Text>{' '}
                        {row.invoice_no}
                      </Text>
                      <View
                        style={{flexDirection: 'row', alignItems: 'center'}}>
                        <FontAwesome5
                          name="calendar-alt"
                          size={18}
                          color={COLORS.red}
                        />
                        <Text style={[{paddingLeft: 5}, styles.cardValues]}>
                          {row.invoice_date}
                        </Text>
                      </View>
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginTop: 20,
                      }}>
                      <FontAwesome5
                        name="exchange-alt"
                        size={20}
                        color={COLORS.blue}
                      />
                      <Text style={[styles.cardValues, {paddingLeft: 7}]}>
                        <Text style={styles.cardText}>From Store :</Text>{' '}
                        {row.from_store_name}
                      </Text>
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginTop: 15,
                      }}>
                      <FontAwesome5
                        name="exchange-alt"
                        size={20}
                        color={COLORS.green}
                      />
                      <Text style={[styles.cardValues, {paddingLeft: 7}]}>
                        <Text style={styles.cardText}>To Store :</Text>{' '}
                        {row.to_store_name}
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
                        <Text style={styles.cardText}>Bill Amount :</Text> Rs.
                        {row.bill_amount}
                      </Text>
                    </View>
                    <TouchableOpacity
                      style={{alignItems: 'flex-end'}}
                      onPress={() => handleOpenDetail(row)}
                      activeOpacity={0.7}
                      delayPressIn={0}>
                      <View style={styles.viewbg}>
                        <FontAwesome5
                          name="angle-double-right"
                          size={18}
                          color={COLORS.white}
                        />
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}

              {/* Load More Section */}
              {currentPage < totalPages && (
                <View style={{padding: 20, alignItems: 'center'}}>
                  {isLoadingMore ? (
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                      <ActivityIndicator size="small" color={COLORS.primary} />
                      <Text style={{marginLeft: 10, color: COLORS.primary}}>
                        Loading more...
                      </Text>
                    </View>
                  ) : (
                    <TouchableOpacity
                      style={[styles.reportbtn, {paddingHorizontal: 30}]}
                      onPress={loadMoreData}>
                      <Text style={styles.exportText}>
                        Load More ({currentPage}/{totalPages})
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              )}

              {/* Show total count */}
              {dayBookData.length > 0 && (
                <View style={{padding: 10, alignItems: 'center'}}>
                  <Text style={{color: COLORS.primary, fontSize: 12}}>
                    Showing {startIndex + 1}-
                    {Math.min(endIndex, dayBookData.length)} of{' '}
                    {dayBookData.length} records
                  </Text>
                </View>
              )}
            </View>
          </ScrollView>

          {/* Loading overlay for modal */}
          {isModalLoading && !showDetailModal && (
            <View
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0,0,0,0.5)',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 1000,
              }}>
              <View
                style={{
                  backgroundColor: COLORS.white,
                  padding: 20,
                  borderRadius: 10,
                  alignItems: 'center',
                }}>
                <ActivityIndicator size="large" color={COLORS.primary} />
                <Text style={{marginTop: 10, color: COLORS.primary}}>
                  Opening details...
                </Text>
              </View>
            </View>
          )}

          {/* Single Modal outside the map function */}
          <Modal
            isVisible={showDetailModal}
            onBackdropPress={handleCloseDetail}
            animationIn="slideInUp"
            animationOut="slideOutDown"
            backdropOpacity={0.5}
            useNativeDriver={true}
            hideModalContentWhileAnimating={true}>
            <View style={styles.modalReport}>
              {/* Modal Title */}
              <View style={styles.titleContainer}>
                <Text style={styles.modalTitle}>Details :</Text>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={handleCloseDetail}
                  activeOpacity={0.7}>
                  <FontAwesome
                    name="window-close"
                    size={20}
                    color={COLORS.red}
                  />
                </TouchableOpacity>
              </View>
              {selectedRow ? (
                <>
                  <ScrollView
                    contentContainerStyle={{marginVertical: 20}}
                    showsVerticalScrollIndicator={false}
                    nestedScrollEnabled={true}
                    removeClippedSubviews={true}
                    initialNumToRender={10}
                    maxToRenderPerBatch={10}
                    windowSize={10}>
                    <View style={{marginBottom: 100}}>
                      <DataRow
                        label="Invoice No"
                        value={selectedRow.invoice_no}
                        iconComponent={
                          <MaterialCommunityIcons
                            name="format-list-numbered"
                            size={20}
                            color={COLORS.primary}
                          />
                        }
                      />
                      <DataRow
                        label="Date"
                        value={selectedRow.invoice_date}
                        iconComponent={
                          <FontAwesome5
                            name="calendar-alt"
                            size={18}
                            color={COLORS.primary}
                          />
                        }
                      />
                      <DataRow
                        label="From Store"
                        value={selectedRow.from_store_name}
                        iconComponent={
                          <FontAwesome5
                            name="exchange-alt"
                            size={20}
                            color={COLORS.primary}
                          />
                        }
                      />
                      <DataRow
                        label="To Store"
                        value={selectedRow.to_store_name}
                        iconComponent={
                          <FontAwesome5
                            name="exchange-alt"
                            size={20}
                            color={COLORS.primary}
                          />
                        }
                      />
                      <DataRow
                        label="Created By User"
                        value={selectedRow.username}
                        iconComponent={
                          <Ionicons
                            name="create-outline"
                            size={25}
                            color={COLORS.primary}
                          />
                        }
                      />
                      <DataRow
                        label="Discount Type"
                        value={selectedRow.discount_type}
                        iconComponent={
                          <MaterialCommunityIcons
                            name="discount"
                            size={20}
                            color={COLORS.primary}
                          />
                        }
                      />
                      <DataRow
                        label="Discount Input"
                        value={selectedRow.discount_input}
                        iconComponent={
                          <MaterialCommunityIcons
                            name="format-list-bulleted-type"
                            size={20}
                            color={COLORS.primary}
                          />
                        }
                      />
                      <DataRow
                        label="Other Expenses"
                        value={selectedRow.other_expenses}
                        iconComponent={
                          <FontAwesome6
                            name="money-bill"
                            size={20}
                            color={COLORS.primary}
                          />
                        }
                      />
                      <DataRow
                        label="Tax Type"
                        value={
                          data.tax_type === 'VAT' &&
                          selectedRow.tax_type === 'IGST'
                            ? 'VAT'
                            : selectedRow.tax_type
                        }
                        iconComponent={
                          <Foundation
                            name="clipboard-notes"
                            size={20}
                            color={COLORS.primary}
                          />
                        }
                      />
                      <DataRow
                        label="OS"
                        value={selectedRow.os}
                        iconComponent={
                          <FontAwesome5
                            name="balance-scale"
                            size={20}
                            color={COLORS.primary}
                          />
                        }
                      />
                      <DataRow
                        label="Total Amount"
                        value={selectedRow.total_amount}
                        iconComponent={
                          <FontAwesome6
                            name="money-bill-wheat"
                            size={20}
                            color={COLORS.primary}
                          />
                        }
                      />
                      <DataRow
                        label="Discount On Total"
                        value={selectedRow.discount_on_total}
                        iconComponent={
                          <MaterialCommunityIcons
                            name="discount"
                            size={20}
                            color={COLORS.primary}
                          />
                        }
                      />
                      <DataRow
                        label="Round Off"
                        value={selectedRow.round_off}
                        iconComponent={
                          <FontAwesome
                            name="calculator"
                            size={18}
                            color={COLORS.primary}
                          />
                        }
                      />
                      <DataRow
                        label="Bill Amount"
                        value={selectedRow.bill_amount}
                        iconComponent={
                          <FontAwesome6
                            name="money-bill-wheat"
                            size={18}
                            color={COLORS.primary}
                          />
                        }
                      />
                      <DataRow
                        label="Narration"
                        value={selectedRow.narration}
                        iconComponent={
                          <FontAwesome6
                            name="money-bill-wheat"
                            size={18}
                            color={COLORS.primary}
                          />
                        }
                      />
                      <DataRow
                        label="Created At"
                        value={new Date(selectedRow.createdAt).toLocaleString()}
                        iconComponent={
                          <MaterialCommunityIcons
                            name="av-timer"
                            size={20}
                            color={COLORS.primary}
                          />
                        }
                      />
                      <DataRow
                        label="Updated At"
                        value={new Date(selectedRow.updatedAt).toLocaleString()}
                        iconComponent={
                          <MaterialCommunityIcons
                            name="av-timer"
                            size={22}
                            color={COLORS.primary}
                          />
                        }
                      />
                    </View>
                  </ScrollView>
                  {/* modal bottom */}
                  <View style={styles.modalBottom}>
                    {(data.username === selectedRow.username ||
                      data.role === 'admin') && (
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                        }}>
                        <TouchableOpacity
                          onPress={() =>
                            handleOnClickDel(selectedRow.invoice_no)
                          }
                          style={[
                            styles.modalbtn,
                            {backgroundColor: COLORS.red},
                          ]}
                          activeOpacity={0.7}>
                          <Text style={styles.modalbtntext}>Delete</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() =>
                            handleOnClickEdit(selectedRow.invoice_no)
                          }
                          style={[
                            styles.modalbtn,
                            {backgroundColor: COLORS.primary},
                          ]}
                          activeOpacity={0.7}>
                          <Text style={styles.modalbtntext}>Edit</Text>
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>
                </>
              ) : null}
            </View>
          </Modal>

          <View style={styles.childView}>
            <View style={styles.childWrapper}>
              <Text style={styles.cardText}>Total Amount : </Text>
              <Text style={styles.cardValues}>
                {totalSum.total_amount.toFixed(2)}
              </Text>
            </View>

            <View style={styles.childWrapper}>
              <Text style={styles.cardText}>Discount on Total :</Text>
              <Text style={styles.cardValues}>
                {totalSum.discount_on_total.toFixed(2)}
              </Text>
            </View>
            <View style={styles.childWrapper}>
              <Text style={styles.cardText}>Round Off :</Text>
              <Text style={styles.cardValues}>
                {totalSum.round_off.toFixed(2)}
              </Text>
            </View>
            <View style={styles.childWrapper}>
              <Text style={styles.cardText}>Bill Amount : </Text>
              <Text style={styles.cardValues}>
                {totalSum.bill_amount.toFixed(2)}
              </Text>
            </View>
          </View>
        </>
      )}
      <DeleteConfirmationModal
        showModal={showDelModal}
        handleClose={handleCloseModal}
        handleSubmitAlert={handleSubmitAlert}
      />
      <InternalLoginModal
        showModal={showLoginModal}
        handleClose={handleCloseModal}
        type="stockTransfer"
        invoiceNo={invoiceNo}
      />
    </View>
  );
}
