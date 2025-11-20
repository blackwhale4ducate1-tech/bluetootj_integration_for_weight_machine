import {StyleSheet, Dimensions} from 'react-native';
import {COLORS, FONTS} from '../constants';

const screenWidth = Dimensions.get('screen').width;
const screenHeight = Dimensions.get('screen').height;

const Styles = StyleSheet.create({
  container: {
    margin: 2,
  },
  safeContainer: {
    flex: 1,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 5,
    height: 20,
  },

  headerText: {
    fontSize: 16,
    fontFamily: FONTS.body5.fontFamily,
    color: COLORS.black,
    marginLeft: 20,
    fontWeight: '700',
  },
searchbtn:{
height:50,
backgroundColor:COLORS.red,
width:screenWidth*0.6,
marginTop:20,
borderRadius:25,
flexDirection:"row",
justifyContent:"center",
alignItems:"center"
},
searchText:{
    fontSize: 16,
    color: COLORS.white,
    margin: 10,
    fontFamily:FONTS.body4.fontFamily
},
  row: {
    flexDirection: 'column',
    justifyContent: 'center',
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    color: COLORS.black,
    fontWeight: '700',
    margin: 10,
    fontFamily:FONTS.body4.fontFamily
  },

  input: {
    backgroundColor: COLORS.white,
    width: screenWidth * 0.9,
    borderRadius: 5,
  },

});

export default Styles;
