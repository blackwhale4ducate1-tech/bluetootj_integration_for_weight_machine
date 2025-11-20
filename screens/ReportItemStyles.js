import {StyleSheet, Dimensions} from 'react-native';
import {COLORS, FONTS} from '../constants';

const screenWidth = Dimensions.get('screen').width;
const screenHeight = Dimensions.get('screen').height;

const styles = StyleSheet.create({
  container: {
    margin: 15,
  },
  safeContainer: {
    flex: 1,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  pickercontain: {
    marginTop: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  inputPicker: {
    borderWidth: 1,
    borderRadius: 5,
    borderColor: COLORS.primary,
  },
  btnText: {
    color: COLORS.white,
    fontFamily: FONTS.body4.fontFamily,
    letterSpacing: 0.5,
    fontSize: 16,
  },
  input: {
    marginTop: 5,
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    color: COLORS.black,
  },
  dateButton: {
    backgroundColor: COLORS.emerald,
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateButtonText: {
    color: COLORS.white,
    fontSize: 16,
    textTransform: 'capitalize',
    fontFamily: FONTS.body1.fontFamily,
    letterSpacing: 0.5,
  },
  headerText: {
    fontSize: 16,
    fontFamily: FONTS.body5.fontFamily,
    color: COLORS.black,
    marginLeft: 20,
    fontWeight: '700',
  },
  button: {
    alignItems: 'center',
    backgroundColor: COLORS.emerald,
    borderRadius: 5,

    padding: 10,
    marginTop: 20,
  },
  validationError: {
    color: 'red',
    textAlign: 'center',
    marginTop: 10,
  },
  reportbtn: {
    width: '50%',
    backgroundColor: COLORS.blue,
    padding: 10,
    borderRadius: 15,
    marginTop: 10,
  },
  exportText: {
    fontFamily: FONTS.body4.fontFamily,
    color: COLORS.white,

    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
  },
  dateText: {
    fontFamily: FONTS.body4.fontFamily,
    color: COLORS.black,
    marginBottom: 10,
    fontSize: 14,
  },
  reportView: {
    backgroundColor: COLORS.white,
    elevation: 3,
    height: 'auto',
    marginVertical: 10,
    padding: 10,
    borderRadius: 10,
  },
  cardText: {
    fontFamily: FONTS.body4.fontFamily,
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.black,
  },
  cardValues: {
    fontFamily: FONTS.body4.fontFamily,
    fontSize: 16,
    color: COLORS.black,
  },
  viewbg: {
    width: 30,
    height: 30,
    borderRadius: 20,
    backgroundColor: COLORS.blue,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalReport: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 1,
    maxHeight: '100%',
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    // justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  modalTitle: {
    fontSize: 16,
    color: COLORS.black,
    fontFamily: FONTS.body4.fontFamily,
    fontWeight: '700',
    marginLeft: 20,
  },
  modalBottom: {
    height: 50,
  },
  modalbtn: {
    width: '50%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalbtntext: {
    fontFamily: FONTS.body4.fontFamily,
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.white,
  },
  // parentView: {
  //   position: 'relative',
  //   height:'auto',
  //   backgroundColor: COLORS.white,
  //   elevation: 3,
  //   marginTop: 15,
  //   marginBottom:100,
  //   borderRadius:10
  // },

  usernameReport: {
    fontFamily: FONTS.body4.fontFamily,
    letterSpacing: 0.5,
    fontSize: 16,
    fontWeight: 700,
    color: COLORS.black,
    paddingLeft: 10,
  },
  childView: {
    backgroundColor: COLORS.lightRed,
    width: screenWidth * 0.9,
    padding: 50,
    paddingHorizontal: 20,
    alignSelf: 'center',  
  },
  
  childWrapper: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  activityIndicatorContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default styles;
