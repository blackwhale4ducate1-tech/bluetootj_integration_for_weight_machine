import {
    View,
    Text,
    StyleSheet,
    Dimensions,
  } from 'react-native';
  import React from 'react';
  import LottieView from 'lottie-react-native';
  import {icons, COLORS, FONTS} from '../constants';
  

  export default function ProductEmptyScreen() {
    return (
      <View style={styles.container}>
        <LottieView
          source={icons.product}
          style={styles.animation}
          autoPlay
          loop
        />
        <Text style={styles.text}>Hey! You have not added any items yet.</Text>
        <Text style={styles.text}>Add your first item now</Text>
  
       
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
      width: 300,
      height: 250,
    },
    text: {
      fontFamily: FONTS.body4.fontFamily,
      color: COLORS.black,
    },
  });
  