import {
    View,
    Text,
    StyleSheet,
    Dimensions,
  } from 'react-native';
  import React from 'react';
  import LottieView from 'lottie-react-native';
  import {icons, COLORS, FONTS} from '../constants';
  

  export default function AccountsEmptyScreen() {
    return (
      <View style={styles.container}>
        <LottieView
          source={icons.receiptanime}
          style={styles.animation}
          autoPlay
          loop
        />
        <Text style={styles.text}>Hey! You have not added any Accounts yet.</Text>

      </View>
    );
  }
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },

    animation: {
      width: 200,
      height: 200,
    },
    text: {
      fontFamily: FONTS.body4.fontFamily,
      color: COLORS.black,
    },
  });
  