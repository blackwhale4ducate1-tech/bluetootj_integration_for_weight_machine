import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Image,
} from 'react-native';
import {FONTS, COLORS, SIZES, icons} from '../constants';
import {useNavigation} from '@react-navigation/native';
import axios from 'axios';
import {API_BASE_URL} from '../config';
import {OtpInput} from 'react-native-otp-entry';
// import {Dropdown} from 'react-native-element-dropdown';
import {Picker} from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import AlertModal from '../components/AlertModal';

const Register = () => {
  const initialFormData = {
    companyName: '',
    isCompanyVerified: false,
    username: '',
    isUsernameVerified: false,
    email: '',
    isEmailOTPSent: false,
    isEmailOTPVerified: false,
    emailOTP: '',
    phoneNo: '',
    businessCategory: {value: 'ERP', label: 'ERP'},
    startDate: new Date(),
    endDate: new Date(),
    country: '',
    region: '',
    password: '',
    cpassword: '',
    validationError: '',
  };
  const businessCategoryOptions = [
    {value: 'ERP', label: 'ERP'},
    {value: 'FlowerShop', label: 'FlowerShop'},
  ];
  const inputRefs = useRef({
    username: null,
    email: null,
    phoneNo: null,
  });

  const [formData, setFormData] = useState(initialFormData);
  const [isSignUpSuccess, setIsSignUpSuccess] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showCPassword, setShowCPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [showFYStartDateModal, setShowFYStartDateModal] = useState(false);
  const [showFYEndDateModal, setShowFYEndDateModal] = useState(false);

  const navigation = useNavigation();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const toggleCPasswordVisibility = () => {
    setShowCPassword(!showCPassword);
  };

  useEffect(() => {
    if (isSignUpSuccess) {
      setShowModal(true);
    }
  }, [isSignUpSuccess]);

  // Navigate to another page when modal is closed
  const handleCloseModal = () => {
    setShowModal(false);
    navigation.navigate('Login');
  };

  const getCountries = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/getCountries`);
      if (response.data) {
        // console.log('countries: ' + JSON.stringify(response.data));
        setCountries(response.data);
      }
    } catch (err) {
      console.log('Error: ' + err);
    }
  };

  const getStates = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/getStates`);
      if (response.data) {
        // console.log('states: ' + JSON.stringify(response.data));
        setStates(response.data);
      }
    } catch (err) {
      console.log('Error: ' + err);
    }
  };

  useEffect(() => {
    getCountries();
    getStates();
  }, []);

  const getAdminByCompany = async () => {
    setLoading(true);
    try {
      // Validate company name format before sending it to the backend
      const companyName = formData.companyName.trim(); // Remove leading and trailing spaces

      // Check if company name is empty
      if (!companyName) {
        setFormData({
          ...formData,
          validationError: 'Company name cannot be empty.',
        });
        setLoading(false);
        return;
      }

      // Check if company name contains spaces
      if (companyName.includes(' ')) {
        setFormData({
          ...formData,
          validationError: 'Company name cannot contain spaces.',
        });
        setLoading(false);
        return;
      }

      // Check if company name exceeds maximum length
      if (companyName.length > 64) {
        setFormData({
          ...formData,
          validationError:
            'Company name is too long. Maximum length is 64 characters.',
        });
        setLoading(false);
        return;
      }

      // Check if company name contains invalid characters
      const invalidCharsRegex = /[^a-zA-Z0-9_$]/;
      if (invalidCharsRegex.test(companyName)) {
        setFormData({
          ...formData,
          validationError:
            'Company name contains invalid characters. Only alphanumeric characters, underscores, and dollar signs are allowed.',
        });
        setLoading(false);
        return;
      }

      const response = await axios.get(`${API_BASE_URL}/api/searchAdmins`, {
        params: {
          company_name: companyName,
        },
      });
      if (response.data.success) {
        setFormData({
          ...formData,
          validationError: 'Company Name exists already.',
        });
      } else if (response.data.message) {
        setFormData({
          ...formData,
          isCompanyVerified: true,
          validationError: '',
        });
        setTimeout(() => {
          inputRefs.current['username'].focus();
        }, 0);
      } else if (response.data.error) {
        setFormData({
          ...formData,
          validationError: response.data.error,
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const getUsername = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/api/searchUsername`, {
        params: {
          username: formData.username,
        },
      });
      if (response.data.success) {
        setFormData({
          ...formData,
          validationError: 'Username exists already.',
        });
        setTimeout(() => {
          inputRefs.current['username'].focus();
        }, 0);
      } else if (response.data.message) {
        setFormData({
          ...formData,
          isUsernameVerified: true,
          validationError: '',
        });
        setTimeout(() => {
          inputRefs.current['email'].focus();
        }, 0);
      } else if (response.data.error) {
        setFormData({
          ...formData,
          validationError: response.data.error,
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const sendEmailOTP = async () => {
    setLoading(true);
    try {
      console.log('Email: ' + formData.email);
      const response = await axios.post(`${API_BASE_URL}/api/sendEmailOTP`, {
        email: formData.email,
        username: formData.username,
      });
      if (response.data.message) {
        console.log('message:' + response.data.message);
        setFormData({
          ...formData,
          isEmailOTPSent: true,
          validationError: '',
        });
      } else if (response.data.error) {
        console.log('errorin: ' + response.data.error);
        setFormData({
          ...formData,
          isEmailOTPSent: false,
          validationError: response.data.error,
        });
        setTimeout(() => {
          inputRefs.current['email'].focus();
        }, 0);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const verifyEmailOTP = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/api/verifyEmailOTP`, {
        email: formData.email,
        email_otp: formData.emailOTP,
      });
      if (response.data.success) {
        console.log('message:' + response.data.success);
        setFormData({
          ...formData,
          emailOTP: '',
          isEmailOTPSent: true,
          isEmailOTPVerified: true,
          validationError: '',
        });
        // setTimeout(() => {
        //   inputRefs.current['phoneNo'].focus();
        // }, 0);
      } else if (response.data.error) {
        console.log('errorin: ' + response.data.error);
        setFormData({
          ...formData,
          emailOTP: '',
          isEmailOTPSent: false,
          isEmailOTPVerified: false,
          validationError: response.data.error,
        });
        setTimeout(() => {
          inputRefs.current['email'].focus();
        }, 0);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const adminSignUp = async () => {
    setLoading(true);
    console.log('formData:' + JSON.stringify(formData));
    try {
      const response = await axios.post(`${API_BASE_URL}/api/adminSignUp`, {
        Data: formData,
      });
      if (response.data.success) {
        console.log('success: ' + response.data.success);
        setIsSignUpSuccess(true);
      } else if (response.data.error) {
        console.log('error in: ' + response.data.error);
      }
    } catch (error) {
      console.log('error in frontend: ' + error);
    } finally {
      setLoading(false);
    }
  };

  const onClickLogin = () => {
    navigation.navigate('Login');
  };

  const onSubmitHandler = async () => {
    if (!formData.isCompanyVerified) {
      getAdminByCompany();
    } else if (formData.isCompanyVerified && !formData.isUsernameVerified) {
      getUsername();
    } else if (
      formData.isCompanyVerified &&
      formData.isUsernameVerified &&
      !formData.isEmailOTPSent
    ) {
      sendEmailOTP();
    } else if (
      formData.isCompanyVerified &&
      formData.isUsernameVerified &&
      formData.isEmailOTPSent &&
      !formData.isEmailOTPVerified
    ) {
      verifyEmailOTP();
    } else if (
      formData.isCompanyVerified &&
      formData.isUsernameVerified &&
      formData.isEmailOTPSent &&
      formData.isEmailOTPVerified &&
      !formData.businessCategory
    ) {
      setFormData({
        ...formData,
        validationError: 'Please Select Business Category',
      });
    } else if (
      formData.isCompanyVerified &&
      formData.isUsernameVerified &&
      formData.isEmailOTPSent &&
      formData.isEmailOTPVerified &&
      !formData.businessCategory &&
      !formData.startDate
    ) {
      setFormData({
        ...formData,
        validationError: 'Please Select Start Date',
      });
    } else if (
      formData.isCompanyVerified &&
      formData.isUsernameVerified &&
      formData.isEmailOTPSent &&
      formData.isEmailOTPVerified &&
      !formData.businessCategory &&
      formData.startDate &&
      !formData.endDate
    ) {
      setFormData({
        ...formData,
        validationError: 'Please Select End Date',
      });
    } else if (
      formData.isCompanyVerified &&
      formData.isUsernameVerified &&
      formData.isEmailOTPSent &&
      formData.isEmailOTPVerified &&
      !formData.businessCategory &&
      formData.startDate &&
      formData.endDate &&
      !formData.country
    ) {
      setFormData({
        ...formData,
        validationError: 'Please Select Country',
      });
    } else if (
      formData.isCompanyVerified &&
      formData.isUsernameVerified &&
      formData.isEmailOTPSent &&
      formData.isEmailOTPVerified &&
      !formData.businessCategory &&
      formData.startDate &&
      formData.endDate &&
      formData.country &&
      !formData.region
    ) {
      setFormData({
        ...formData,
        validationError: 'Please Select State',
      });
    } else if (
      formData.isCompanyVerified &&
      formData.isUsernameVerified &&
      formData.isEmailOTPSent &&
      formData.isEmailOTPVerified &&
      formData.businessCategory &&
      formData.startDate &&
      formData.endDate &&
      formData.country &&
      formData.region
    ) {
      if (formData.password !== formData.cpassword) {
        setFormData({
          ...formData,
          validationError: 'Passwords should match',
        });
      } else if (
        !formData.phoneNo ||
        formData.phoneNo.toString().length !== 10
      ) {
        setFormData({
          ...formData,
          validationError: 'Phoneno should be 10 digits',
        });
      } else {
        setFormData({
          ...formData,
          validationError: '',
        });
        adminSignUp();
      }
    }
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <View>
          <View style={styles.contentContainer}>
            <Text style={styles.title}>Register</Text>
            <View style={styles.inputContainer}>
              <Text style={styles.labelText}>Company Name :</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter Company Name"
                placeholderTextColor={COLORS.white}
                selectionColor={COLORS.white}
                value={formData.companyName}
                onChangeText={text =>
                  setFormData({...formData, companyName: text})
                }
                autoFocus={!formData.isCompanyVerified}
                editable={!formData.isCompanyVerified}
              />
            </View>
            {!formData.isCompanyVerified && (
              <TouchableOpacity onPress={onSubmitHandler} style={styles.button}>
                <Text style={styles.buttonText}>Verify Company Name</Text>
              </TouchableOpacity>
            )}
            {formData.isCompanyVerified && (
              <View style={[styles.inputContainer, {marginTop: 20}]}>
                <Text style={styles.labelText}>Username :</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter Username"
                  placeholderTextColor={COLORS.white}
                  selectionColor={COLORS.white}
                  value={formData.username}
                  onChangeText={text =>
                    setFormData({...formData, username: text})
                  }
                  autoFocus={
                    formData.isCompanyVerified && !formData.isUsernameVerified
                  }
                  editable={
                    !formData.isCompanyVerified || !formData.isUsernameVerified
                  }
                  ref={input => (inputRefs.current.username = input)}
                />
              </View>
            )}
            {formData.isCompanyVerified && !formData.isUsernameVerified && (
              <TouchableOpacity onPress={onSubmitHandler} style={styles.button}>
                <Text style={styles.buttonText}>Verify Username</Text>
              </TouchableOpacity>
            )}
            {formData.isCompanyVerified && formData.isUsernameVerified && (
              <View style={[styles.inputContainer, {marginTop: 20}]}>
                <Text style={styles.labelText}>Email :</Text>
                <TextInput
                  style={styles.input}
                  placeholder="name@example.com"
                  placeholderTextColor={COLORS.white}
                  selectionColor={COLORS.white}
                  value={formData.email}
                  onChangeText={text => setFormData({...formData, email: text})}
                  autoFocus={
                    formData.isCompanyVerified &&
                    formData.isUsernameVerified &&
                    !formData.isEmailOTPSent
                  }
                  editable={
                    !(
                      formData.isCompanyVerified &&
                      formData.isUsernameVerified &&
                      formData.isEmailOTPSent &&
                      formData.isEmailOTPVerified
                    )
                  }
                  ref={input => (inputRefs.current.email = input)}
                />
              </View>
            )}
            {formData.isCompanyVerified &&
              formData.isUsernameVerified &&
              !formData.isEmailOTPSent && (
                <TouchableOpacity
                  onPress={onSubmitHandler}
                  style={styles.button}>
                  <Text style={styles.buttonText}>
                    Click to send OTP to validate Email
                  </Text>
                </TouchableOpacity>
              )}
            {formData.isCompanyVerified &&
              formData.isUsernameVerified &&
              formData.isEmailOTPSent &&
              !formData.isEmailOTPVerified && (
                <View style={styles.inputContainer}>
                  <Text style={styles.labelText}>Enter OTP :</Text>
                  <OtpInput
                    numberOfDigits={6}
                    focusColor={COLORS.green}
                    focusStickBlinkingDuration={500}
                    onTextChange={otp =>
                      setFormData({...formData, emailOTP: otp})
                    }
                    onFilled={text => console.log(`OTP is ${text}`)}
                  />
                  <TouchableOpacity
                    onPress={onSubmitHandler}
                    style={[styles.button, {marginTop: 20}]}>
                    <Text style={styles.buttonText}>Verify OTP</Text>
                  </TouchableOpacity>
                </View>
              )}
            {formData.isCompanyVerified &&
              formData.isUsernameVerified &&
              formData.isEmailOTPSent &&
              formData.isEmailOTPVerified && (
                <>
                  <View style={styles.inputContainer}>
                    <Text style={styles.labelText}>Phone No</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Enter Phone No"
                      keyboardType="numeric"
                      placeholderTextColor={COLORS.white}
                      selectionColor={COLORS.white}
                      value={formData.phoneNo}
                      onChangeText={text =>
                        setFormData({...formData, phoneNo: text})
                      }
                    />
                  </View>
                  <View style={styles.inputContainer}>
                    <Text style={styles.labelText}>Business Category :</Text>
                    <Picker
                      selectedValue={formData.businessCategory.value} // Use the value property
                      onValueChange={itemValue => {
                        setFormData(prevFormData => ({
                          ...prevFormData,
                          businessCategory: {
                            value: itemValue,
                            label:
                              businessCategoryOptions.find(
                                option => option.value === itemValue,
                              )?.label || '',
                          },
                        }));
                      }}>
                      <Picker.Item label="Select Business Category" value="" />
                      {businessCategoryOptions.map(option => (
                        <Picker.Item
                          key={option.value}
                          label={option.label}
                          value={option.value}
                        />
                      ))}
                    </Picker>
                  </View>
                  <View style={styles.inputContainer}>
                    <View>
                      <TouchableOpacity
                        style={styles.button}
                        onPress={() => setShowFYStartDateModal(true)}>
                        <Text style={styles.buttonText}>
                          Select FY Start Date
                        </Text>
                      </TouchableOpacity>
                      {showFYStartDateModal && (
                        <DateTimePicker
                          value={new Date(formData.startDate)}
                          mode="date"
                          display="default"
                          onChange={(event, selectedDate) => {
                            setShowFYStartDateModal(false);
                            if (selectedDate) {
                              setFormData({
                                ...formData,
                                startDate: selectedDate,
                              });
                            }
                          }}
                        />
                      )}
                    </View>
                    <View>
                      <Text style={[styles.labelText, {marginTop: 20}]}>
                        FY Start Date :
                      </Text>
                      <TextInput
                        style={styles.input}
                        value={
                          formData.startDate !== ''
                            ? new Date(formData.startDate).toLocaleDateString(
                                'ta-IN',
                              )
                            : ''
                        }
                        placeholder="FY Start Date"
                        editable={false}
                      />
                    </View>
                  </View>
                  <View style={styles.inputContainer}>
                    <View>
                      <TouchableOpacity
                        style={styles.button}
                        onPress={() => setShowFYEndDateModal(true)}>
                        <Text style={styles.buttonText}>
                          Select FY End Date
                        </Text>
                      </TouchableOpacity>
                      {showFYEndDateModal && (
                        <DateTimePicker
                          value={new Date(formData.endDate)}
                          mode="date"
                          display="default"
                          onChange={(event, selectedDate) => {
                            setShowFYEndDateModal(false);
                            if (selectedDate) {
                              setFormData({...formData, endDate: selectedDate});
                            }
                          }}
                        />
                      )}
                    </View>
                    <View>
                      <Text style={[styles.labelText, {marginTop: 20}]}>
                        FY End Date :
                      </Text>
                      <TextInput
                        style={styles.input}
                        value={
                          formData.endDate !== ''
                            ? new Date(formData.endDate).toLocaleDateString(
                                'ta-IN',
                              )
                            : ''
                        }
                        placeholder="FY End Date"
                        editable={false}
                      />
                    </View>
                  </View>
                  <View style={styles.inputContainer}>
                    <Text style={styles.labelText}>Country :</Text>
                    <Picker
                      selectedValue={selectedCountry}
                      onValueChange={itemValue => {
                        const selectedCountryObject = countries.find(
                          country => country.id === itemValue,
                        );
                        setSelectedCountry(itemValue);
                        console.log(
                          'country: ' + selectedCountryObject
                            ? selectedCountryObject.name
                            : '',
                        );
                        setFormData({
                          ...formData,
                          country: selectedCountryObject
                            ? selectedCountryObject.name
                            : '',
                        });
                      }}>
                      <Picker.Item label="Select Country" value="" />
                      {countries.map(cntry => (
                        <Picker.Item
                          key={cntry.id}
                          label={cntry.name}
                          value={cntry.id}
                        />
                      ))}
                    </Picker>
                  </View>
                  <View style={styles.inputContainer}>
                    <Text style={styles.labelText}>State :</Text>
                    <Picker
                      selectedValue={selectedState}
                      onValueChange={itemValue => {
                        const selectedStateObject = states.find(
                          stat => stat.id === itemValue,
                        );
                        setSelectedState(itemValue);
                        console.log(
                          'state: ' +
                            (selectedStateObject
                              ? selectedStateObject.name
                              : null),
                        );
                        setFormData({
                          ...formData,
                          region: selectedStateObject
                            ? selectedStateObject.name
                            : null,
                        });
                      }}>
                      <Picker.Item label="Select State" value="" />
                      {states
                        .filter(item => item.country_id === selectedCountry)
                        .map(stat => (
                          <Picker.Item
                            key={stat.id}
                            label={stat.name}
                            value={stat.id}
                          />
                        ))}
                    </Picker>
                  </View>
                  <View style={styles.inputContainer}>
                    <Text style={styles.labelText}>Password</Text>
                    <TextInput
                      style={styles.input}
                      placeholderTextColor={COLORS.white}
                      selectionColor={COLORS.white}
                      placeholder="Enter Password"
                      secureTextEntry={!showPassword}
                      value={formData.password}
                      onChangeText={text =>
                        setFormData({...formData, password: text})
                      }
                    />
                    <TouchableOpacity
                      onPress={togglePasswordVisibility}
                      style={{
                        position: 'absolute',
                        right: 0,
                        bottom: 10,
                        height: 30,
                        width: 30,
                      }}>
                      <Image
                        source={showPassword ? icons.eye : icons.disable_eye}
                        style={{
                          height: 20,
                          width: 20,
                          tintColor: COLORS.white,
                        }}
                      />
                    </TouchableOpacity>
                  </View>
                  <View style={styles.inputContainer}>
                    <Text style={styles.labelText}>Confirm Password</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Confirm Password"
                      placeholderTextColor={COLORS.white}
                      selectionColor={COLORS.white}
                      secureTextEntry={!showCPassword}
                      value={formData.cpassword}
                      onChangeText={text =>
                        setFormData({...formData, cpassword: text})
                      }
                    />

                    <TouchableOpacity
                      onPress={toggleCPasswordVisibility}
                      style={{
                        position: 'absolute',
                        right: 0,
                        bottom: 10,
                        height: 30,
                        width: 30,
                      }}>
                      <Image
                        source={showCPassword ? icons.eye : icons.disable_eye}
                        style={{
                          height: 20,
                          width: 20,
                          tintColor: COLORS.white,
                        }}
                      />
                    </TouchableOpacity>
                  </View>
                </>
              )}
            {/* Continue rendering other form elements similarly */}
            <Text style={styles.errorText}>{formData.validationError}</Text>
            <TouchableOpacity
              onPress={onSubmitHandler}
              disabled={
                !formData.isCompanyVerified ||
                !formData.isEmailOTPSent ||
                !formData.isEmailOTPVerified ||
                !formData.businessCategory ||
                !formData.startDate ||
                !formData.endDate ||
                !formData.country ||
                !formData.region ||
                formData.isSignUpSuccess
              }
              style={styles.button}>
              <Text style={styles.buttonText}>Register</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            onPress={onClickLogin}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: 20,
              justifyContent: 'center',
            }}>
            <Text
              style={{
                color: COLORS.black,
                ...FONTS.body3,
                marginLeft: 10,
                textDecorationLine: 'underline',
              }}>
              Already have an account?
            </Text>
            <Text
              style={{
                color: COLORS.white,
                ...FONTS.body3,
                marginLeft: 10,
                textDecorationLine: 'underline',
              }}>
              Login
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {showModal && (
        <AlertModal
          showModal={showModal}
          handleClose={handleCloseModal}
          modalTitle="Alert"
          message="Registered Successfully"></AlertModal>
      )}
    </ScrollView>
  );
};

export default Register;

// styles.js
export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.emerald,
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  contentContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    color: COLORS.white,
    fontSize: 20,
    marginBottom: 30,
    fontFamily: 'Roboto-Bold',
  },
  picker: {
    borderBottomColor: COLORS.white,
    borderBottomWidth: 1,
  },
  inputContainer: {
    marginBottom: 20,
    width: '100%',
  },
  labelText: {
    color: COLORS.white,
    marginBottom: 10,
    fontSize: 16,
    fontFamily: 'Roboto-regular',
  },
  input: {
    marginVertical: SIZES.padding,
    borderBottomColor: COLORS.white,
    borderBottomWidth: 1,
    height: 40,
    color: COLORS.white,
    fontFamily: FONTS.body1.fontFamily,
  },
  button: {
    backgroundColor: COLORS.black,
    borderRadius: 5,
    paddingHorizontal: 20,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginBottom: 20,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 16,
    textTransform: 'capitalize',
    fontFamily: FONTS.body1.fontFamily,
    letterSpacing: 1,
  },
  errorText: {
    color: COLORS.red,
    marginTop: 10,
    marginBottom: 10,
  },
});
