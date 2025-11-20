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
import {useProductDetails} from '../components/ProductDetailsContext';
import DateTimePicker from '@react-native-community/datetimepicker';
import {PaperSelect} from 'react-native-paper-select';

const AddEditProductDetails = () => {
  const {data} = useAuth();
  const route = useRoute();
  const {type} = route.params;
  const {initialFormData, formData, setFormData, loading, setLoading} =
    useProductDetails();
  const navigation = useNavigation();

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [productCategories, setProductCategories] = useState([]);

  const getProductCategoriesData = async company_name => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/getProductCategories?company_name=${company_name}`,
        {
          params: {
            include: 'id,name',
          },
        },
      );
      setProductCategories(response.data);
    } catch (error) {
      console.log(error);
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

  const handleSubmit = async () => {
    setLoading(true);
    try {
      if (!formData.productCategoryId) {
        setFormData({
          ...formData,
          validationError: 'Select Product Category',
        });
        return;
      }
      if (!formData.productName) {
        setFormData({
          ...formData,
          validationError: 'Enter Product Name',
        });
        return;
      }
      if (!formData.productCode) {
        setFormData({
          ...formData,
          validationError: 'Enter Product Code',
        });
        return;
      }
      let igstValue =
        formData.igst.toString().trim() === '' ? 0 : parseFloat(formData.igst);
      let cgstValue =
        formData.cgst.toString().trim() === '' ? 0 : parseFloat(formData.cgst);
      let sgstValue =
        formData.sgst.toString().trim() === '' ? 0 : parseFloat(formData.sgst);

      if (isNaN(igstValue)) {
        igstValue = 0;
      }
      if (isNaN(sgstValue)) {
        igstValue = 0;
      }
      if (isNaN(cgstValue)) {
        igstValue = 0;
      }
      if (data.tax_type === 'GST' && igstValue !== cgstValue + sgstValue) {
        setFormData({
          ...formData,
          validationError: 'IGST should be sum of CGST and SGST',
        });
        return;
      }
      if (type === 'Add Product Details') {
        const res = await axios.post(`${API_BASE_URL}/api/addProductDetails`, {
          product_category_id: formData.productCategoryId.value,
          product_name: formData.productName,
          product_code: formData.productCode,
          hsn_code: formData.hsnCode,
          rol: formData.rol,
          igst: formData.igst,
          sgst: formData.sgst,
          cgst: formData.cgst,
          purchase_price: formData.purchasePrice,
          sales_price: formData.salesPrice,
          mrp: formData.mrp,
          purchase_inclusive: formData.purchaseInclusive,
          sales_inclusive: formData.salesInclusive,
          expiry_date: formData.expiryDate,
          unit: formData.unit,
          alt_unit: formData.alt_unit,
          uc_factor: formData.uc_factor,
          discountP: formData.discountP,
          remarks: formData.remarks,
          company_name: data.company_name,
        });
        if (res.data.message) {
          setFormData(initialFormData);
          navigation.goBack();
        } else if (res.data.error) {
          setFormData({...formData, validationError: res.data.error});
        } else {
          setFormData({...formData, validationError: 'Please Try again'});
        }
      } else if (type === 'Edit Product Details') {
        const res = await axios.post(
          `${API_BASE_URL}/api/updateProductDetails`,
          {
            id: formData.id,
            product_category_id: formData.productCategoryId.value,
            product_name: formData.productName,
            product_code: formData.productCode,
            hsn_code: formData.hsnCode,
            rol: formData.rol,
            igst: formData.igst,
            sgst: formData.sgst,
            cgst: formData.cgst,
            purchase_price: formData.purchasePrice,
            sales_price: formData.salesPrice,
            mrp: formData.mrp,
            purchase_inclusive: formData.purchaseInclusive,
            sales_inclusive: formData.salesInclusive,
            expiry_date: formData.expiryDate,
            unit: formData.unit,
            alt_unit: formData.alt_unit,
            uc_factor: formData.uc_factor,
            discountP: formData.discountP,
            remarks: formData.remarks,
            company_name: data.company_name,
          },
        );
        if (res.data.message) {
          navigation.goBack();
        } else if (res.data.error) {
          setFormData({...formData, validationError: res.data.error});
        } else {
          setFormData({...formData, validationError: 'Please Try again'});
        }
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
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
            label="Product Category"
            textInputMode="outlined"
            containerStyle={{margin: 10, flex: 1}}
            value={formData.productCategoryId?.label || ''}
            onSelection={item => {
              if (item.selectedList.length === 0) {
                return;
              }
              setFormData(prevFormData => ({
                ...prevFormData,
                productCategoryId: {
                  value: item.selectedList[0]._id,
                  label: item.selectedList[0].value,
                },
              }));
            }}
            arrayList={productCategories.map(category => ({
              value: category.name,
              _id: category.id,
            }))}
            selectedArrayList={
              formData.productCategoryId
                ? [
                    {
                      value: formData.productCategoryId.label,
                      _id: formData.productCategoryId.value,
                    },
                  ]
                : []
            }
            errorText=""
            multiEnable={false}
          />
          <Button
            mode="contained"
            onPress={() => {
              navigation.navigate('ProductCategoriesStack', {
                screen: 'AddEditProductCategory',
                params: {type: 'Add Product Category'},
              });
            }}
            style={CustomStyles.bottomButton}>
            +
          </Button>
        </View>
        <TextInput
          mode="outlined"
          label="Product Name"
          value={formData.productName}
          onChangeText={text =>
            setFormData({
              ...formData,
              productName: text,
              productCode: text,
            })
          }
          style={{margin: 10}}
          outlineColor={COLORS.black}
          textColor={COLORS.black}
          activeOutlineColor={COLORS.primary}
        />
        <TextInput
          mode="outlined"
          label="Product Code"
          value={formData.productCode}
          onChangeText={text =>
            setFormData({
              ...formData,
              productCode: text,
            })
          }
          style={{margin: 10}}
          outlineColor={COLORS.black}
          textColor={COLORS.black}
          activeOutlineColor={COLORS.primary}
        />
        {data.business_category !== 'FlowerShop' && (
          <>
            <View style={CustomStyles.row}>
              {data.tax_type === 'GST' && (
                <TextInput
                  mode="outlined"
                  label="HSN Code"
                  value={formData.hsnCode.toString()}
                  onChangeText={text =>
                    setFormData({
                      ...formData,
                      hsnCode: text,
                    })
                  }
                  style={{margin: 10, flex: 1}}
                  outlineColor={COLORS.black}
                  textColor={COLORS.black}
                  activeOutlineColor={COLORS.primary}
                />
              )}

              <TextInput
                mode="outlined"
                label="ROL"
                value={formData.rol.toString()}
                onChangeText={text =>
                  setFormData({
                    ...formData,
                    rol: text,
                  })
                }
                style={{margin: 10, flex: 1}}
                outlineColor={COLORS.black}
                textColor={COLORS.black}
                activeOutlineColor={COLORS.primary}
              />
              <TextInput
                mode="outlined"
                label="Discount %"
                value={formData.discountP.toString()}
                onChangeText={text =>
                  setFormData({
                    ...formData,
                    discountP: text,
                  })
                }
                style={{margin: 10, flex: 1}}
                outlineColor={COLORS.black}
                textColor={COLORS.black}
                activeOutlineColor={COLORS.primary}
              />
            </View>
            <View style={CustomStyles.row}>
              <TextInput
                mode="outlined"
                label={data.tax_type === 'VAT' ? 'VAT' : 'IGST'}
                value={formData.igst.toString()}
                onChangeText={text => {
                  const updatedData = {...formData, igst: text};
                  if (data.tax_type !== 'VAT') {
                    updatedData.cgst = text / 2;
                    updatedData.sgst = text / 2;
                  }
                  setFormData(updatedData);
                }}
                style={{margin: 10, flex: 1}}
                outlineColor={COLORS.black}
                textColor={COLORS.black}
                activeOutlineColor={COLORS.primary}
              />
              {data.tax_type === 'GST' && (
                <>
                  <TextInput
                    mode="outlined"
                    label="SGST"
                    value={formData.sgst.toString()}
                    onChangeText={text =>
                      setFormData({
                        ...formData,
                        sgst: text,
                      })
                    }
                    disabled
                    style={{margin: 10, flex: 1}}
                    outlineColor={COLORS.black}
                    textColor={COLORS.black}
                    activeOutlineColor={COLORS.primary}
                  />
                  <TextInput
                    mode="outlined"
                    label="CGST"
                    value={formData.cgst.toString()}
                    onChangeText={text =>
                      setFormData({
                        ...formData,
                        cgst: text,
                      })
                    }
                    disabled
                    style={{margin: 10, flex: 1}}
                    outlineColor={COLORS.black}
                    textColor={COLORS.black}
                    activeOutlineColor={COLORS.primary}
                  />
                </>
              )}
            </View>
            <View style={CustomStyles.row}>
              <TextInput
                mode="outlined"
                label="Purchase Price"
                value={formData.purchasePrice.toString()}
                onChangeText={text =>
                  setFormData({
                    ...formData,
                    purchasePrice: text,
                  })
                }
                style={{margin: 10, flex: 1}}
                outlineColor={COLORS.black}
                textColor={COLORS.black}
                activeOutlineColor={COLORS.primary}
              />
              <TextInput
                mode="outlined"
                label="Sales Price"
                value={formData.salesPrice.toString()}
                onChangeText={text =>
                  setFormData({
                    ...formData,
                    salesPrice: text,
                  })
                }
                style={{margin: 10, flex: 1}}
                outlineColor={COLORS.black}
                textColor={COLORS.black}
                activeOutlineColor={COLORS.primary}
              />
              <TextInput
                mode="outlined"
                label="MRP"
                value={formData.mrp.toString()}
                onChangeText={text =>
                  setFormData({
                    ...formData,
                    mrp: text,
                  })
                }
                style={{margin: 10, flex: 1}}
                outlineColor={COLORS.black}
                textColor={COLORS.black}
                activeOutlineColor={COLORS.primary}
              />
            </View>

            <View style={CustomStyles.row}>
              <View style={{margin: 10, flex: 1}}>
                <Checkbox.Item
                  label="Purchase Inclusive"
                  status={
                    formData.purchaseInclusive === 1 ? 'checked' : 'unchecked'
                  }
                  onPress={() => {
                    setFormData({
                      ...formData,
                      purchaseInclusive:
                        formData.purchaseInclusive === 1 ? 0 : 1,
                    });
                  }}
                />
              </View>
              <View style={{margin: 10, flex: 1}}>
                <Checkbox.Item
                  label="Sales Inclusive"
                  status={
                    formData.salesInclusive === 1 ? 'checked' : 'unchecked'
                  }
                  onPress={() => {
                    setFormData({
                      ...formData,
                      salesInclusive: formData.salesInclusive === 1 ? 0 : 1,
                    });
                  }}
                />
              </View>
            </View>
            <View style={CustomStyles.row}>
              <TextInput
                mode="outlined"
                label="Unit"
                value={formData.unit}
                onChangeText={text =>
                  setFormData({
                    ...formData,
                    unit: text,
                  })
                }
                style={{margin: 10, flex: 1}}
                outlineColor={COLORS.black}
                textColor={COLORS.black}
                activeOutlineColor={COLORS.primary}
              />
              <TextInput
                mode="outlined"
                label="Alt Unit"
                value={formData.alt_unit}
                onChangeText={text =>
                  setFormData({
                    ...formData,
                    alt_unit: text,
                  })
                }
                style={{margin: 10, flex: 1}}
                outlineColor={COLORS.black}
                textColor={COLORS.black}
                activeOutlineColor={COLORS.primary}
              />
              <TextInput
                mode="outlined"
                label="UC Factor"
                value={formData.uc_factor.toString()}
                onChangeText={text =>
                  setFormData({
                    ...formData,
                    uc_factor: text,
                  })
                }
                style={{margin: 10, flex: 1}}
                outlineColor={COLORS.black}
                textColor={COLORS.black}
                activeOutlineColor={COLORS.primary}
                disabled={formData.alt_unit === ''}
              />
            </View>

            <View style={CustomStyles.row}>
              <TextInput
                style={{margin: 10, flex: 9}}
                mode="outlined"
                label="Expiry Date"
                placeholderTextColor={COLORS.black}
                activeUnderlineColor={COLORS.primary}
                value={
                  formData.expiryDate !== ''
                    ? new Date(formData.expiryDate).toLocaleDateString('ta-IN')
                    : ''
                }
                placeholder="Expiry Date"
                editable={false}
              />
              <IconButton
                icon="calendar"
                size={40}
                onPress={() => setShowDatePicker(true)}
                style={{margin: 10, flex: 1}}
              />
              {showDatePicker && (
                <DateTimePicker
                  value={new Date(formData.expiryDate)}
                  mode="date"
                  display="default"
                  onChange={(event, selectedDate) => {
                    setShowDatePicker(false);
                    if (selectedDate) {
                      setFormData({
                        ...formData,
                        expiryDate: selectedDate.toISOString(),
                      });
                    }
                  }}
                />
              )}
            </View>
            <TextInput
              mode="outlined"
              label="Remarks"
              value={formData.remarks}
              onChangeText={text =>
                setFormData({
                  ...formData,
                  remarks: text,
                })
              }
              style={{margin: 10}}
              outlineColor={COLORS.black}
              textColor={COLORS.black}
              activeOutlineColor={COLORS.primary}
              multiline={true}
            />
          </>
        )}
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

export default AddEditProductDetails;

const styles = StyleSheet.create({});
