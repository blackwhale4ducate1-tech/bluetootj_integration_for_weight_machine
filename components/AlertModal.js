import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import React from 'react';
import OuterBodyModal from './OuterBodyModal';
import {COLORS, icons, FONTS} from '../constants';
import LottieView from 'lottie-react-native';

const AlertModal = ({showModal, message, handleClose, modalTitle}) => {
  return (
    <View>
      <OuterBodyModal
        modalTitle={modalTitle}
        showModal={showModal}
        handleClose={handleClose}>
        <View style={{alignItems: 'center'}}>
          <LottieView
            style={{width: 300, height: 200}}
            source={icons.lottie}
            autoPlay
            loop
          />

          <Text
            style={{
              fontSize: 18,
              margin: 10,
              ...FONTS.body3,
              color: COLORS.black,
            }}>
            {message}
          </Text>
          <TouchableOpacity
            style={{
              backgroundColor: COLORS.primary,
              width: '50%',
              alignItems: 'center',
              marginTop: 10,
            }}
            onPress={handleClose}>
            <Text
              style={{
                margin: '20',
                paddingHorizontal: 20,
                paddingVertical: 10,
                ...FONTS.body3,
                color: COLORS.white,
              }}>
              Done
            </Text>
          </TouchableOpacity>
        </View>
      </OuterBodyModal>
    </View>
  );
};

export default AlertModal;

const styles = StyleSheet.create({});
