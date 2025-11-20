import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Modal,
  TouchableOpacity,
} from 'react-native';
import React, {useState, useCallback, useEffect} from 'react';
import {
  Appbar,
  Card,
  Button,
  TextInput,
  ActivityIndicator,
  Checkbox,
  IconButton,
} from 'react-native-paper';
import CustomStyles from '../components/AddEditModalStyles';
import {
  useNavigation,
  useRoute,
  useFocusEffect,
} from '@react-navigation/native';
import {COLORS} from '../constants';
import axios from 'axios';
import {API_BASE_URL} from '../config';
import {useAuth} from '../components/AuthContext';
import DateTimePicker from '@react-native-community/datetimepicker';
import {PaperSelect} from 'react-native-paper-select';
import {useProductComposition} from '../components/ProductCompositionContext';

const AddEditProductComposition = () => {
  const {data} = useAuth();
  const route = useRoute();
  const {type} = route.params;
  const {
    initialFormData,
    formData,
    setFormData,
    loading,
    setLoading,
    editComponents: initialComponents,
    setEditComponents, // Add this to destructure setEditComponents
  } = useProductComposition();
  const navigation = useNavigation();

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [products, setProducts] = useState([]);
  const [components, setComponents] = useState(
    initialComponents || [{componentProduct: '', componentProductQty: ''}],
  );

  useEffect(() => {
    if (initialComponents && initialComponents.length > 0) {
      setComponents(initialComponents);
    } else {
      setComponents([{componentProduct: '', componentProductQty: ''}]);
    }
  }, [initialComponents]);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/getProductDetails?company_name=${data.company_name}&business_category=${data.business_category}`,
      );
      setProducts(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [data.company_name]);

  useFocusEffect(
    useCallback(() => {
      fetchProducts();
    }, [data.company_name]),
  );

  const handleSubmit = async () => {
    setLoading(true);
    if (!formData.finishedProduct || !formData.finishedProductQty) {
      setValidationError('Please fill in all parent product fields');
      return;
    }

    const hasEmptyComponent = components.some(
      comp => !comp.componentProduct || !comp.componentProductQty,
    );
    if (hasEmptyComponent) {
      setValidationError('Please fill in all component fields');
      return;
    }

    try {
      const payload = {
        id: formData.id,
        parent_id: formData.finishedProduct,
        parent_quantity: formData.finishedProductQty,
        components: components.map(comp => ({
          component_id: comp.componentProduct,
          component_quantity: comp.componentProductQty,
        })),
        company_name: data.company_name,
      };

      //   console.log('payload AddEditComposition: ' + JSON.stringify(payload));

      const endpoint =
        type === 'Add Product Composition'
          ? `${API_BASE_URL}/api/addProductComposition`
          : `${API_BASE_URL}/api/updateProductComposition`;

      const res = await axios.post(endpoint, payload);
      if (res.data.message) {
        navigation.goBack();
      } else if (res.data.error) {
        setFormData({...formData, validationError: res.data.error});
      } else {
        setFormData({...formData, validationError: 'Please Try again'});
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleComponentChange = (index, field, value) => {
    const updatedComponents = [...components];
    updatedComponents[index][field] = value;
    setComponents(updatedComponents);
  };

  const removeComponent = index => {
    const updatedComponents = components.filter((_, i) => i !== index);
    setComponents(updatedComponents);
  };

  const addComponent = () => {
    setComponents([
      ...components,
      {componentProduct: '', componentProductQty: ''},
    ]);
  };

  return (
    <View style={CustomStyles.safeContainer}>
      <Appbar.Header style={CustomStyles.appHeader}>
        <Appbar.BackAction
          onPress={() => {
            navigation.goBack();
          }}
          color={COLORS.white}
        />
        <Appbar.Content
          title={`${type}`}
          titleStyle={CustomStyles.titleStyle}
        />
      </Appbar.Header>
      {loading && (
        <Modal
          transparent={true}
          animationType="none"
          visible={loading}
          onRequestClose={() => {}} // Prevent the modal from closing
        >
          <View style={CustomStyles.overlay}>
            <ActivityIndicator
              size="large"
              animating={true}
              color={COLORS.emerald}
            />
          </View>
        </Modal>
      )}
      <ScrollView contentContainerStyle={CustomStyles.scrollViewContent}>
        <View style={CustomStyles.row}>
          <PaperSelect
            label="Parent Product"
            textInputMode="outlined"
            containerStyle={{margin: 10, flex: 1}}
            value={
              formData.finishedProduct
                ? products.find(p => p.id === formData.finishedProduct)
                    ?.product_name || ''
                : ''
            }
            onSelection={item => {
              if (item.selectedList.length === 0) {
                setFormData(prev => ({...prev, finishedProduct: ''}));
                return;
              }
              const selectedId = item.selectedList[0]._id;
              const selectedProduct = products.find(p => p.id === selectedId);
              if (!selectedProduct) return; // Prevent invalid selection
              setFormData(prev => ({...prev, finishedProduct: selectedId}));
            }}
            arrayList={products.map(product => ({
              value: product.product_name,
              _id: product.id,
            }))}
            selectedArrayList={
              formData.finishedProduct
                ? [
                    {
                      value: products.find(
                        p => p.id === formData.finishedProduct,
                      )?.product_name,
                      _id: formData.finishedProduct,
                    },
                  ]
                : []
            }
            errorText=""
            multiEnable={false}
          />
        </View>
        <TextInput
          mode="outlined"
          label="Parent Product Quantity"
          value={formData.finishedProductQty?.toString() || ''} // Convert to string
          onChangeText={text =>
            setFormData({
              ...formData,
              finishedProductQty: text,
            })
          }
          style={{margin: 10}}
          outlineColor={COLORS.black}
          textColor={COLORS.black}
          activeOutlineColor={COLORS.primary}
        />

        <Text style={{margin: 10, fontSize: 16, fontWeight: 'bold' , color: COLORS.black}}>
          Components
        </Text>
        {components.map((component, index) => (
          <View
            key={index}
            style={{
              borderWidth: 1,
              padding: 10,
              marginBottom: 10,
              marginHorizontal: 10,
            }}>
            <View style={{marginBottom: 10}}>
              <Text style={{color: COLORS.black}}>Component Product</Text>
              <PaperSelect
                value={
                  component.componentProduct
                    ? products.find(p => p.id === component.componentProduct)
                        ?.product_name || ''
                    : ''
                }
                onSelection={item => {
                  if (item.selectedList.length > 0) {
                    handleComponentChange(
                      index,
                      'componentProduct',
                      item.selectedList[0]._id,
                    );
                  }
                }}
                arrayList={products.map(product => ({
                  value: product.product_name,
                  _id: product.id,
                }))}
                selectedArrayList={
                  component.componentProduct
                    ? [
                        {
                          value:
                            products.find(
                              p => p.id === component.componentProduct,
                            )?.product_name || '',
                          _id: component.componentProduct,
                        },
                      ]
                    : []
                }
                textInputMode="outlined"
                containerStyle={{marginTop: 5}}
                errorText=""
                multiEnable={false}
              />
            </View>

            <View style={{marginBottom: 10}}>
              <Text style={{color: COLORS.black}}>Component Quantity</Text>
              <TextInput
                mode="outlined"
                value={component.componentProductQty?.toString() || ''} // Convert to string
                onChangeText={text =>
                  handleComponentChange(index, 'componentProductQty', text)
                }
                keyboardType="numeric"
                style={{marginTop: 5}}
                outlineColor={COLORS.black}
                textColor={COLORS.black}
                activeOutlineColor={COLORS.primary}
              />
            </View>

            {components.length > 1 && (
              <Button
                mode="contained"
                onPress={() => removeComponent(index)}
                style={{backgroundColor: COLORS.red}}>
                Remove Component
              </Button>
            )}
          </View>
        ))}
        <Button
          mode="contained"
          onPress={addComponent}
          style={{margin: 10, backgroundColor: COLORS.primary}}>
          Add Component
        </Button>
        <Text style={{color: COLORS.red, padding: 10}}>
          {formData.validationError}
        </Text>
      </ScrollView>
      <View style={CustomStyles.boottomButtonsContainer}>
        <Button
          mode="contained"
          onPress={() => {
            handleSubmit();
          }}
          style={[CustomStyles.bottomButton, {flex: 1}]}>
          <Text>Save</Text>
        </Button>
      </View>
    </View>
  );
};

export default AddEditProductComposition;

const styles = StyleSheet.create({
  blackText: {
    color: COLORS.black,
  },
});
