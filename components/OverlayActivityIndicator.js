import React from 'react';
import {View, StyleSheet} from 'react-native';
import Modal from 'react-native-modal';
import LottieView from 'lottie-react-native';
import { icons } from '../constants';

const OverlayActivityIndicator = ({loading}) => {
  return (
    <Modal
      isVisible={loading}
      animationIn="fadeIn"
      animationOut="fadeOut"
      backdropOpacity={0.5}
      backdropColor="#fff"
      backdropTransitionInTiming={0}
      backdropTransitionOutTiming={0}
      hideModalContentWhileAnimating
      useNativeDriverForBackdrop
      style={styles.modal}>
      <View style={styles.activityIndicatorContainer}>
      
        <LottieView
            style={{width: 300, height: 150}}
            source={icons.loader}
            autoPlay
            loop
          />

      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: '#ffffff',
  
  },
  activityIndicatorContainer: {
    justifyContent: 'center',
    alignItems: 'center',

  },
});

export default OverlayActivityIndicator;
