import {
  StyleSheet,
  Text,
  View,
  Modal,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import React, {useState, useEffect, useCallback, useMemo} from 'react';
import {
  Appbar,
  Card,
  ActivityIndicator,
  Button,
  TextInput,
} from 'react-native-paper';
import {COLORS} from '../constants';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import axios from 'axios';
import {API_BASE_URL} from '../config';
import {useAuth} from '../components/AuthContext';
import {useProductCategory} from '../components/ProductCategoryContext';

const ProductCategories = () => {
  const navigation = useNavigation();
  const {permissions, data} = useAuth();
  const {
    initialFormData,
    loading,
    setLoading,
    formData,
    setFormData,
    products,
    setProducts,
    filteredProducts,
    setFilteredProducts,
    searchInput,
    setSearchInput,
  } = useProductCategory();

  const isAddProductCategories = permissions.find(
    permission =>
      permission.page === 'productCategories' && permission.add === 1,
  );

  const getProductCategoriesData = async company_name => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${API_BASE_URL}/api/getProductCategories?company_name=${company_name}`,
      );
      setProducts(response.data);
      setFilteredProducts(response.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getProductCategoriesData(data.company_name);
  }, [data.company_name]);

  useFocusEffect(
    useCallback(() => {
      getProductCategoriesData(data.company_name);
    }, [data.company_name]),
  );

  useEffect(() => {
    setFilteredProducts(
      products.filter(product =>
        product.name.toLowerCase().includes(searchInput.toLowerCase()),
      ),
    );
  }, [searchInput, products]);

  const memoizedProducts = useMemo(() => filteredProducts, [filteredProducts]);

  return (
    <View style={styles.container}>
      {/* App Header */}
      <Appbar.Header style={styles.appHeader}>
        <Appbar.BackAction onPress={() => navigation.goBack()} color="#fff" />
        <Appbar.Content title="Product Categories" titleStyle={styles.headerTitle} />
      </Appbar.Header>

      {/* Loading Modal */}
      {loading && (
        <Modal transparent animationType="none" visible={loading}>
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" animating color={COLORS.emerald} />
          </View>
        </Modal>
      )}

      {/* Search */}
      <View style={styles.searchWrapper}>
        <TextInput
          mode="outlined"
          placeholder="Search categories"
          value={searchInput}
          onChangeText={setSearchInput}
          style={styles.searchInput}
          left={<TextInput.Icon icon="magnify" />}
        />
      </View>

      {/* List */}
      <FlatList
        data={memoizedProducts}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={[
          styles.listContent,
          memoizedProducts.length === 0 && styles.emptyStateWrapper,
        ]}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No product categories found.</Text>
        }
        renderItem={({item}) => (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('ViewProductCategory', {id: item.id})
            }>
            <Card style={styles.card}>
              <Card.Title title={item.name} titleStyle={styles.cardTitle} />
            </Card>
          </TouchableOpacity>
        )}
      />

      {/* Add Button */}
      <View style={styles.footer}>
        <Button
          icon="plus"
          mode="contained"
          onPress={() => {
            setFormData(initialFormData);
            navigation.navigate('AddEditProductCategory', {
              type: 'Add Product Category',
            });
          }}
          disabled={!isAddProductCategories}
          style={styles.addButton}>
          Add Category
        </Button>
      </View>
    </View>
  );
};

export default ProductCategories;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background || '#f9f9f9',
  },
  appHeader: {
    backgroundColor: COLORS.primary || '#6200ee',
    elevation: 4,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  loaderContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchWrapper: {
    padding: 12,
  },
  searchInput: {
    backgroundColor: '#fff',
  },
  listContent: {
    paddingHorizontal: 12,
    paddingBottom: 100,
  },
  emptyStateWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: '#999',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 40,
  },
  card: {
    backgroundColor: '#fff',
    marginVertical: 6,
    borderRadius: 10,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textPrimary || '#333',
    textAlign: 'center',
  },
  footer: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
  },
  addButton: {
    borderRadius: 8,
    paddingVertical: 6,
  },
});
