import {StyleSheet, View, Text, ScrollView, Alert} from 'react-native';
import React, {useEffect, useState} from 'react';
import {
  Appbar,
  Card,
  Button,
  ActivityIndicator,
  MD2Colors,
} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import {COLORS, FONTS} from '../constants';
import axios from 'axios';
import {API_BASE_URL} from '../config';
import {useAuth} from '../components/AuthContext';
import OuterBodyModal from '../components/OuterBodyModal';
import EditProfile from '../components/EditProfile';
import {launchImageLibrary} from 'react-native-image-picker';

const Profile = () => {
  const navigation = useNavigation();
  const {data} = useAuth();
  const initialProfileData = {
    username: 'user1',
    business_category: '',
    email: '',
    phone_no: '',
    country: '',
    state: '',
    city: '',
    address: '',
    pincode: '',
    gstin: '',
    company_full_name: '',
    bank_name: '',
    account_no: '',
    ifsc_code: '',
    branch: '',
    declaration: '',
    image_name: '',
    qr_image_name: '',
    accountName: '',
    panNo: '',
    fssi: '',
    companySealImageName: '',
    authorisedSignatureImageName: '',
  };

  const [profileData, setProfileData] = useState(initialProfileData);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imageKey, setImageKey] = useState(Date.now());

  const fetchProfileData = async (role, company_name) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/getProfile?role=${role}&company_name=${company_name}`,
      );
      if (response.data.message) {
        setProfileData(prevFormData => ({
          ...prevFormData,
          username: response.data.message.username,
          business_category: response.data.message.business_category,
          email: response.data.message.email,
          phone_no: response.data.message.phone_no,
          country: response.data.message.country,
          state: response.data.message.state,
          city: response.data.message.city,
          address: response.data.message.address,
          pincode: response.data.message.pincode,
          gstin: response.data.message.gstin,
          company_full_name: response.data.message.company_full_name,
          bank_name: response.data.message.bank_name,
          account_no: response.data.message.account_no,
          ifsc_code: response.data.message.ifsc_code,
          branch: response.data.message.branch,
          declaration: response.data.message.declaration,
          image_name: response.data.message.image_name,
          qr_image_name: response.data.message.qr_image_name,
          accountName: response.data.message.accountName,
          panNo: response.data.message.panNo,
          fssi: response.data.message.fssi,
          companySealImageName: response.data.message.companySealImageName,
          authorisedSignatureImageName:
            response.data.message.authorisedSignatureImageName,
        }));
      } else {
        console.log('Error: ' + response.data.error);
      }
    } catch (error) {
      console.log('error: ' + error);
    }
  };

  useEffect(() => {
    fetchProfileData(data.role, data.company_name);
  }, [data.role, data.company_name]);

  const onClickEdit = () => {
    setShowModal(true);
  };

  const onHandleSubmit = () => {
    fetchProfileData(data.role, data.company_name);
    setShowModal(false);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleLogoImagePicker = () => {
    setLoading(true);
    const options = {
      mediaType: 'image',
      includeBase64: false,
      maxHeight: 2000,
      maxWidth: 2000,
    };
    launchImageLibrary(options, async response => {
      if (response.didCancel) {
        console.log('User cancelled Logo image picker');
      } else if (response.error) {
        console.log('Logo Image picker error: ', response.error);
      } else {
        const formData = new FormData();
        let imageUri = response.uri || response.assets?.[0]?.uri;
        const imageData = {
          uri: imageUri,
          type: 'image/jpeg',
          name: 'selectedImage.jpg',
        };
        formData.append('logo', imageData);
        console.log(imageUri);
        try {
          const uploadResponse = await axios.post(
            `${API_BASE_URL}/api/uploadLogo?company_name=${data.company_name}`,
            formData,
            {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
              withCredentials: true,
            },
          );
          console.log('uploadResponse: ' + JSON.stringify(uploadResponse.data));
          if (uploadResponse.data.message) {
            setImageKey(Date.now());
            Alert.alert('Image uploaded successfully');
          }
        } catch (error) {
          console.log('error: ' + error);
          Alert.alert('Try Again');
        } finally {
          console.log('entered finally');
          setLoading(false);
        }
      }
    });
  };

  const handleQrImagePicker = () => {
    setLoading(true);
    const options = {
      mediaType: 'image',
      includeBase64: false,
      maxHeight: 2000,
      maxWidth: 2000,
    };
    launchImageLibrary(options, async response => {
      if (response.didCancel) {
        console.log('User cancelled QR image picker');
      } else if (response.error) {
        console.log('QR Image picker error: ', response.error);
      } else {
        const formData = new FormData();
        let imageUri = response.uri || response.assets?.[0]?.uri;
        const imageData = {
          uri: imageUri,
          type: 'image/jpeg',
          name: 'selectedImage.jpg',
        };
        formData.append('qr_image', imageData);
        console.log(imageUri);
        try {
          const uploadResponse = await axios.post(
            `${API_BASE_URL}/api/uploadQRImage?company_name=${data.company_name}`,
            formData,
            {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
              withCredentials: true,
            },
          );
          console.log('uploadResponse: ' + JSON.stringify(uploadResponse.data));
          if (uploadResponse.data.message) {
            setImageKey(Date.now());
            Alert.alert('QR Image uploaded successfully');
          }
        } catch (error) {
          console.log('error: ' + error);
          Alert.alert('Try Again');
        } finally {
          console.log('entered finally');
          setLoading(false);
        }
      }
    });
  };

  const handleCompanySealImagePicker = () => {
    setLoading(true);
    const options = {
      mediaType: 'image',
      includeBase64: false,
      maxHeight: 2000,
      maxWidth: 2000,
    };
    launchImageLibrary(options, async response => {
      if (response.didCancel) {
        console.log('User cancelled Company Seal image picker');
      } else if (response.error) {
        console.log('Company Seal Image picker error: ', response.error);
      } else {
        const formData = new FormData();
        let imageUri = response.uri || response.assets?.[0]?.uri;
        const imageData = {
          uri: imageUri,
          type: 'image/jpeg',
          name: 'selectedImage.jpg',
        };
        formData.append('companySealImage', imageData);
        console.log(imageUri);
        try {
          const uploadResponse = await axios.post(
            `${API_BASE_URL}/api/uploadCompanySealImage?company_name=${data.company_name}`,
            formData,
            {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
              withCredentials: true,
            },
          );
          console.log('uploadResponse: ' + JSON.stringify(uploadResponse.data));
          if (uploadResponse.data.message) {
            setImageKey(Date.now());
            Alert.alert('Company Seal Image uploaded successfully');
          }
        } catch (error) {
          console.log('error: ' + error);
          Alert.alert('Try Again');
        } finally {
          console.log('entered finally');
          setLoading(false);
        }
      }
    });
  };

  const handleAuthorisedSignatureImagePicker = () => {
    setLoading(true);
    const options = {
      mediaType: 'image',
      includeBase64: false,
      maxHeight: 2000,
      maxWidth: 2000,
    };
    launchImageLibrary(options, async response => {
      if (response.didCancel) {
        console.log('User cancelled Authorised Signature image picker');
      } else if (response.error) {
        console.log('AuthorisedSignature Image picker error: ', response.error);
      } else {
        const formData = new FormData();
        let imageUri = response.uri || response.assets?.[0]?.uri;
        const imageData = {
          uri: imageUri,
          type: 'image/jpeg',
          name: 'selectedImage.jpg',
        };
        formData.append('authorisedSignatureImage', imageData);
        console.log(imageUri);
        try {
          const uploadResponse = await axios.post(
            `${API_BASE_URL}/api/uploadAuthorisedSignatureImage?company_name=${data.company_name}`,
            formData,
            {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
              withCredentials: true,
            },
          );
          console.log('uploadResponse: ' + JSON.stringify(uploadResponse.data));
          if (uploadResponse.data.message) {
            setImageKey(Date.now());
            Alert.alert('Authorised Signature Image uploaded successfully');
          }
        } catch (error) {
          console.log('error: ' + error);
          Alert.alert('Try Again');
        } finally {
          console.log('entered finally');
          setLoading(false);
        }
      }
    });
  };

  return (
    <>
      {loading ? (
        <ActivityIndicator animating={true} color={MD2Colors.red800} />
      ) : (
        <View>
          <Appbar.Header>
            <Appbar.BackAction
              onPress={() => {
                navigation.navigate('Home');
              }}
            />
            <Appbar.Content title="Profile" />
          </Appbar.Header>
          <ScrollView>
            <Card style={{margin: 20}}>
              <Card.Cover
                source={{
                  uri: `${API_BASE_URL}/images/${data.company_name}/${profileData.image_name}?${imageKey}`,
                }}
              />
              <Card.Actions>
                <Button
                  buttonColor={COLORS.emerald}
                  textColor={COLORS.white}
                  onPress={handleLogoImagePicker}>
                  Upload New Logo
                </Button>
              </Card.Actions>
            </Card>
            <Card style={{margin: 20}}>
              <Card.Cover
                source={{
                  uri: `${API_BASE_URL}/images/${data.company_name}/${profileData.qr_image_name}?${imageKey}`,
                }}
              />
              <Card.Actions>
                <Button
                  buttonColor={COLORS.emerald}
                  textColor={COLORS.white}
                  onPress={handleQrImagePicker}>
                  Upload New QR Image
                </Button>
              </Card.Actions>
            </Card>
            <Card style={{margin: 20}}>
              <Card.Cover
                source={{
                  uri: `${API_BASE_URL}/images/${data.company_name}/${profileData.companySealImageName}?${imageKey}`,
                }}
              />
              <Card.Actions>
                <Button
                  buttonColor={COLORS.emerald}
                  textColor={COLORS.white}
                  onPress={handleCompanySealImagePicker}>
                  Upload New Company Seal Image
                </Button>
              </Card.Actions>
            </Card>
            <Card style={{margin: 20}}>
              <Card.Cover
                source={{
                  uri: `${API_BASE_URL}/images/${data.company_name}/${profileData.authorisedSignatureImageName}?${imageKey}`,
                }}
              />
              <Card.Actions>
                <Button
                  buttonColor={COLORS.emerald}
                  textColor={COLORS.white}
                  onPress={handleAuthorisedSignatureImagePicker}>
                  Upload New Authorised Signature Image
                </Button>
              </Card.Actions>
            </Card>
            <Card style={{margin: 10, position: 'relative', marginBottom: 80}}>
              <Button
                icon="pencil"
                onPress={onClickEdit}
                style={{position: 'absolute', top: 0, right: 0}}></Button>
              <Card.Content style={{marginTop: 20}}>
                <View>
                  <View style={styles.row}>
                    <Text style={styles.cellBold}>Username</Text>
                    <Text style={styles.cell}>{profileData.username}</Text>
                  </View>
                  {data.role === 'admin' && (
                    <>
                      <View style={styles.row}>
                        <Text style={styles.cellBold}>Business Category</Text>
                        <Text style={styles.cell}>
                          {profileData.business_category}
                        </Text>
                      </View>
                      <View style={styles.row}>
                        <Text style={styles.cellBold}>Company Full Name</Text>
                        <Text style={styles.cell}>
                          {profileData.company_full_name}
                        </Text>
                      </View>
                    </>
                  )}
                  <View style={styles.row}>
                    <Text style={styles.cellBold}>Email</Text>
                    <Text style={styles.cell}>{profileData.email}</Text>
                  </View>
                </View>
                <View style={styles.row}>
                  <Text style={styles.cellBold}>Phone No</Text>
                  <Text style={styles.cell}>{profileData.phone_no}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.cellBold}>Address</Text>
                  <Text style={styles.cell}>{profileData.address}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.cellBold}>City</Text>
                  <Text style={styles.cell}>{profileData.city}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.cellBold}>State</Text>
                  <Text style={styles.cell}>{profileData.state}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.cellBold}>Country</Text>
                  <Text style={styles.cell}>{profileData.country}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.cellBold}>Pincode</Text>
                  <Text style={styles.cell}>{profileData.pincode}</Text>
                </View>
                {data.role === 'admin' && (
                  <View style={styles.row}>
                    <Text style={styles.cellBold}>Bank Name</Text>
                    <Text style={styles.cell}>{profileData.bank_name}</Text>
                  </View>
                )}
                <View style={styles.row}>
                  <Text style={styles.cellBold}>Account No</Text>
                  <Text style={styles.cell}>{profileData.account_no}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.cellBold}>IFSC Code</Text>
                  <Text style={styles.cell}>{profileData.ifsc_code}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.cellBold}>Branch</Text>
                  <Text style={styles.cell}>{profileData.branch}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.cellBold}>Account Name</Text>
                  <Text style={styles.cell}>{profileData.accountName}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.cellBold}>PAN No</Text>
                  <Text style={styles.cell}>{profileData.panNo}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.cellBold}>FSSI</Text>
                  <Text style={styles.cell}>{profileData.fssi}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.cellBold}>Declaration</Text>
                  <Text style={styles.cell}>{profileData.declaration}</Text>
                </View>
              </Card.Content>
            </Card>
          </ScrollView>
          <OuterBodyModal
            modalTitle="Edit Profile"
            showModal={showModal}
            handleClose={handleCloseModal}>
            <EditProfile
              username={data.username}
              role={data.role}
              formData={profileData}
              onHandleSubmit={onHandleSubmit}></EditProfile>
          </OuterBodyModal>
        </View>
      )}
    </>
  );
};

export default Profile;

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  cell: {
    flex: 1,
    textAlign: 'center',
    fontFamily: FONTS.body4.fontFamily,
    color: COLORS.black,
    width: 130,
    textAlign: 'left',
    padding: 5,
  },
  //bootstrap text-end
  textRight: {
    textAlign: 'right',
  },
  //<tbody><th>
  cellBold: {
    flex: 1,
    textAlign: 'center',
    fontFamily: FONTS.body4.fontFamily,
    color: COLORS.black,
    width: 130,
    fontWeight: '700',
    textAlign: 'left',
    padding: 5,
  },
});
