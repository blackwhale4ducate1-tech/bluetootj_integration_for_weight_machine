import {Text, View, TouchableOpacity, ActivityIndicator} from 'react-native';
import React, {useState, useEffect, useCallback} from 'react';
import axios from 'axios';
import {API_BASE_URL} from '../config';
import {useAuth} from './AuthContext';
import styles from './AddEditModalStyles';
import {Picker} from '@react-native-picker/picker';
import AddEditProductCategory from './AddEditProductCategory';
import OuterBodyModal from './OuterBodyModal';
import CheckBox from '@react-native-community/checkbox';
import DateTimePicker from '@react-native-community/datetimepicker';
import {COLORS} from '../constants';
import {TextInput} from 'react-native-paper';

const AddEditProductDetails = props => {
  const {data} = useAuth();

  const productCategoryFormData = {
    id: '',
    name: '',
    validationError: '',
  };

  const [formData, setFormData] = useState(props.initialFormData);
  const [productCategories, setProductCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setFormData(props.initialFormData);
  }, [props.initialFormData]);

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

  const onClickClear = () => {
    setFormData(props.initialFormData);
  };

  const onClickAdd = useCallback(() => {
    setShowModal(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setShowModal(false);
  }, []);

  const onSubmitProductCategory = useCallback(() => {
    setShowModal(false);
    getProductCategoriesData(data.company_name);
  }, [data.company_name]);

  const handleSubmit = async event => {
    event.preventDefault();
    setIsLoading(true);
    try {
      if (!formData.productCategoryId) {
        setFormData({
          ...formData,
          validationError: 'Select Product Category',
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
      if (igstValue !== cgstValue + sgstValue) {
        setFormData({
          ...formData,
          validationError: 'IGST should be sum of CGST and SGST',
        });
        return;
      }
      if (props.type === 'Add Product Details') {
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
          company_name: data.company_name,
        });
        if (res.data.message) {
          console.log('message:' + res.data.message);
          setFormData(props.initialFormData);
          props.onHandleSubmit();
        } else if (res.data.error) {
          console.log('error:' + res.data.error);
          setFormData({...formData, validationError: res.data.error});
        } else {
          setFormData({...formData, validationError: 'Please Try again'});
        }
      } else if (props.type === 'Edit Product Details') {
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
            company_name: data.company_name,
          },
        );
        if (res.data.message) {
          console.log('message:' + res.data.message);
          props.onHandleSubmit();
        } else if (res.data.error) {
          console.log('error:' + res.data.error);
          setFormData({...formData, validationError: res.data.error});
        } else {
          setFormData({...formData, validationError: 'Please Try again'});
        }
      }
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <Text style={styles.labelInput}>Product Category :</Text>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <View style={styles.inputPicker}>
            <Picker
              selectedValue={
                formData.productCategoryId
                  ? formData.productCategoryId.value
                  : null
              }
              onValueChange={(itemValue, itemIndex) => {
                const selectedCategory = productCategories.find(
                  category => category.id === itemValue,
                );
                setFormData(prevFormData => ({
                  ...prevFormData,
                  productCategoryId: {
                    value: selectedCategory.id,
                    label: selectedCategory.name,
                  },
                }));
              }}
              style={{color: COLORS.black}}>
              <Picker.Item label="-- Select Product Category --" value={null} />
              {productCategories.map(category => (
                <Picker.Item
                  key={category.id}
                  label={category.name}
                  value={category.id}
                />
              ))}
            </Picker>
          </View>
          <TouchableOpacity style={styles.addButton} onPress={onClickAdd}>
            <Text style={styles.addButtonText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.labelInput}>Product Name :</Text>
        <TextInput
          style={styles.inputbg}
          mode="flat"
          placeholderTextColor={COLORS.black}
          activeUnderlineColor={COLORS.primary}
          placeholder="Enter Product Name"
          value={formData.productName}
          onChangeText={text =>
            setFormData({
              ...formData,
              productName: text,
            })
          }
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.labelInput}>Product Code :</Text>
        <TextInput
          style={styles.inputbg}
          mode="flat"
          placeholderTextColor={COLORS.black}
          activeUnderlineColor={COLORS.primary}
          placeholder="Enter Product Code"
          value={formData.productCode}
          onChangeText={text =>
            setFormData({
              ...formData,
              productCode: text,
            })
          }
        />
      </View>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <View style={{flex: 6, padding: 5}}>
          <View style={styles.inputContainer}>
            <Text style={styles.labelInput}>HSN Code :</Text>
            <TextInput
              style={styles.inputbg}
              mode="flat"
              placeholderTextColor={COLORS.black}
              activeUnderlineColor={COLORS.primary}
              placeholder="Enter HSN Code"
              value={formData.hsnCode.toString()}
              onChangeText={text =>
                setFormData({
                  ...formData,
                  hsnCode: text,
                })
              }
              keyboardType="numeric"
            />
          </View>
        </View>
        <View style={{flex: 6, padding: 5}}>
          <View style={styles.inputContainer}>
            <Text style={styles.labelInput}>ROL :</Text>
            <TextInput
              style={styles.inputbg}
              mode="flat"
              placeholderTextColor={COLORS.black}
              activeUnderlineColor={COLORS.primary}
              placeholder="Enter ROL"
              value={formData.rol.toString()}
              onChangeText={text =>
                setFormData({
                  ...formData,
                  rol: text,
                })
              }
              keyboardType="numeric"
            />
          </View>
        </View>
      </View>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <View style={{flex: 1, padding: 5}}>
          <View style={styles.inputContainer}>
            <Text style={styles.labelInput}>IGST :</Text>
            <TextInput
              style={styles.inputbg}
              mode="flat"
              placeholderTextColor={COLORS.black}
              activeUnderlineColor={COLORS.primary}
              placeholder="Enter IGST"
              value={formData.igst.toString()}
              onChangeText={text =>
                setFormData({
                  ...formData,
                  igst: text,
                  cgst: text / 2,
                  sgst: text / 2,
                })
              }
              keyboardType="numeric"
            />
          </View>
        </View>
        <View style={{flex: 1, padding: 5}}>
          <View style={styles.inputContainer}>
            <Text style={styles.labelInput}>SGST :</Text>
            <TextInput
              style={styles.inputbg}
              mode="flat"
              placeholderTextColor={COLORS.black}
              activeUnderlineColor={COLORS.primary}
              placeholder="Enter SGST"
              value={formData.sgst.toString()}
              onChangeText={text =>
                setFormData({
                  ...formData,
                  sgst: text,
                })
              }
              keyboardType="numeric"
              editable={false}
            />
          </View>
        </View>
        <View style={{flex: 1, padding: 5}}>
          <View style={styles.inputContainer}>
            <Text style={styles.labelInput}>CGST :</Text>
            <TextInput
              style={styles.inputbg}
              mode="flat"
              placeholderTextColor={COLORS.black}
              activeUnderlineColor={COLORS.primary}
              placeholder="Enter CGST"
              value={formData.cgst.toString()}
              onChangeText={text =>
                setFormData({
                  ...formData,
                  cgst: text,
                })
              }
              keyboardType="numeric"
              editable={false}
            />
          </View>
        </View>
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.labelInput}>Purchase Price :</Text>
        <TextInput
          style={styles.inputbg}
          mode="flat"
          placeholderTextColor={COLORS.black}
          activeUnderlineColor={COLORS.primary}
          placeholder="Enter Purchase Price"
          value={formData.purchasePrice.toString()}
          onChangeText={text =>
            setFormData({
              ...formData,
              purchasePrice: text,
            })
          }
          keyboardType="numeric"
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.labelInput}>Sales Price :</Text>
        <TextInput
          style={styles.inputbg}
          mode="flat"
          placeholderTextColor={COLORS.black}
          activeUnderlineColor={COLORS.primary}
          placeholder="Enter Sales Price"
          value={formData.salesPrice.toString()}
          onChangeText={text =>
            setFormData({
              ...formData,
              salesPrice: text,
            })
          }
          keyboardType="numeric"
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.labelInput}>MRP :</Text>
        <TextInput
          style={styles.inputbg}
          mode="flat"
          placeholderTextColor={COLORS.black}
          activeUnderlineColor={COLORS.primary}
          placeholder="Enter MRP"
          value={formData.mrp.toString()}
          onChangeText={text =>
            setFormData({
              ...formData,
              mrp: text,
            })
          }
          keyboardType="numeric"
        />
      </View>

      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <View style={{flex: 1, padding: 5}}>
          <View style={styles.checkContainer}>
            <CheckBox
              value={formData.purchaseInclusive === 1 ? true : false}
              onValueChange={value =>
                setFormData({...formData, purchaseInclusive: value ? 1 : 0})
              }
              tintColors={{true: COLORS.black, false: COLORS.black}}
            />
            <Text style={styles.labelInput}>Purchase Inclusive</Text>
          </View>
        </View>
        <View style={{flex: 1, padding: 5}}>
          <View style={styles.checkContainer}>
            <CheckBox
              value={formData.salesInclusive === 1 ? true : false}
              onValueChange={value =>
                setFormData({...formData, salesInclusive: value ? 1 : 0})
              }
              tintColors={{true: COLORS.black, false: COLORS.black}}
            />
            <Text style={styles.labelInput}>Sales Inclusive</Text>
          </View>
        </View>
      </View>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <View style={{flex: 1, padding: 5}}>
          <View style={styles.inputContainer}>
            <Text style={styles.labelInput}>Unit:</Text>
            <TextInput
              style={styles.inputbg}
              mode="flat"
              placeholderTextColor={COLORS.black}
              activeUnderlineColor={COLORS.primary}
              placeholder="Enter Unit"
              value={formData.unit}
              onChangeText={text =>
                setFormData({
                  ...formData,
                  unit: text,
                })
              }
            />
          </View>
        </View>
        <View style={{flex: 1, padding: 5}}>
          <View style={styles.inputContainer}>
            <Text style={styles.labelInput}>Alt Unit:</Text>
            <TextInput
              style={styles.inputbg}
              mode="flat"
              placeholderTextColor={COLORS.black}
              activeUnderlineColor={COLORS.primary}
              placeholder="Enter Alt Unit"
              value={formData.alt_unit}
              onChangeText={text =>
                setFormData({
                  ...formData,
                  alt_unit: text,
                })
              }
            />
          </View>
        </View>
        <View style={{flex: 1, padding: 5}}>
          <View style={styles.inputContainer}>
            <Text style={styles.labelInput}>UCFactor</Text>
            <TextInput
              style={styles.inputbg}
              mode="flat"
              placeholderTextColor={COLORS.black}
              activeUnderlineColor={COLORS.primary}
              placeholder="Enter UC Factor"
              value={formData.uc_factor.toString()}
              onChangeText={text =>
                setFormData({
                  ...formData,
                  uc_factor: text,
                })
              }
              keyboardType="numeric"
            />
          </View>
        </View>
      </View>
      <View style={styles.inputContainer}>
        <View>
          <TouchableOpacity
            style={styles.dateButton}
            onPress={() => setShowDatePicker(true)}>
            <Text style={styles.dateButtonText}>Select Expiry Date</Text>
          </TouchableOpacity>
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
                    expiryDate: selectedDate,
                  });
                }
              }}
            />
          )}
        </View>
      </View>
      <View>
        <Text style={styles.labelInput}>Expiry Date :</Text>
        <TextInput
          style={styles.inputbg}
          mode="flat"
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
      </View>
      <View style={styles.floatRight}>
        <TouchableOpacity onPress={onClickClear}>
          <Text style={styles.clearText}>Clear</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        style={styles.submitButton}
        onPress={handleSubmit}
        disabled={isLoading}
        b>
        {isLoading ? (
          <ActivityIndicator size="large" color={COLORS.white} />
        ) : (
          <Text style={styles.submitButtonText}>Submit</Text>
        )}
      </TouchableOpacity>
      <Text style={styles.errorText}>{formData.validationError}</Text>

      <OuterBodyModal
        modalTitle="Add Product Category"
        showModal={showModal}
        handleClose={handleCloseModal}>
        <AddEditProductCategory
          initialFormData={productCategoryFormData}
          type="Add Product Category"
          onHandleSubmit={onSubmitProductCategory}
        />
      </OuterBodyModal>
    </View>
  );
};

export default AddEditProductDetails;
