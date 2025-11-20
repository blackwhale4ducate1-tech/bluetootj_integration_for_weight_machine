import {StyleSheet, Dimensions} from 'react-native';
import {COLORS, FONTS} from '../constants';

const screenWidth = Dimensions.get('screen').width;
const screenHeight = Dimensions.get('screen').height;

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  safeContainer: {
    flex: 1,
  },
  scrollViewContent: {
    padding: 10,
    paddingBottom: 80,
  },
  floatRight: {
    alignSelf: 'flex-end',
  },
  clearLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    // marginVertical: 5,
    color: COLORS.lime,
    textDecorationLine: 'underline',
  },
  titletext: {
    fontFamily: FONTS.body3.fontFamily,
    color: COLORS.black,
    fontSize: 16,
  },
  inputContainer: {
    marginVertical: 10,
  },
  inputbg: {
    backgroundColor: '#f5f6f9',
  },
  appHeader: {
    backgroundColor: COLORS.primary,
  },
  titleStyle: {
    fontSize: 18,
    color: COLORS.white,
    fontWeight: 700,
    letterSpacing: 0.5,
  },

  clearText: {
    fontFamily: FONTS.body3.fontFamily,
    color: COLORS.red,
    textDecorationLine: 'underline',
    fontSize: 16,
  },
  labelInput: {
    fontSize: 17,
    margin: 10,
    fontFamily: FONTS.body3.fontFamily,
    color: COLORS.black,
  },
  input: {
    marginTop: 5,
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    flex: 1,
    color: COLORS.black,
  },
  inputPicker: {
    flex: 9,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: COLORS.primary,
  },
  submitButton: {
    backgroundColor: COLORS.primary,

    borderRadius: 5,
    padding: 10,
    margin: 10,
    alignItems: 'center',
  },
  formlabel: {
    fontFamily: FONTS.body4.fontFamily,
    color: COLORS.black,
    fontSize: 16,
    margin: 10,
    marginTop: 20,
    fontWeight: '700',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 18,
    fontFamily: FONTS.body3.fontFamily,
    fontWeight: '700',
    letterSpacing: 1,
  },
  switchbtnText: {
    color: COLORS.white,
    fontSize: 14,
    fontFamily: FONTS.body3.fontFamily,
    fontWeight: '700',
    letterSpacing: 1,
    textAlign: 'center',
  },
  addButton: {
    backgroundColor: COLORS.emerald,
    borderRadius: 5,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    marginLeft: 10,
    width: screenWidth * 0.8,
    marginVertical: 20,
  },
  addButtonText: {
    color: COLORS.white,
    fontSize: 18,
    fontFamily: FONTS.body4.fontFamily,
    fontWeight: '700',
    paddingVertical: 5,
    letterSpacing: 1,
  },
  errorText: {
    color: 'red',
  },
  checkContainer: {
    flexDirection: 'row',
    padding: 10,
    marginBottom: 20,
    alignItems: 'center',
  },
  pickercontain: {
    marginLeft: 10,
    marginTop: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: COLORS.primary,
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
    letterSpacing: 1,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  boottomButtonsContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#ddd',
    padding: 5,
  },
  searchInput: {
    flex: 1,
    marginHorizontal: 10,
  },
  bottomButton: {
    marginHorizontal: 10,
    marginVertical: 10,
    justifyContent: 'center',
  },
  cardTitle: {
    color: COLORS.black,
    fontWeight: 'bold',
  },
  cardContent: {
    marginTop: -20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  flexText: {
    flex: 1,
  },
  boldText: {
    flex: 1,
    fontWeight: 'bold',
    color: 'black',
  },
  rightText: {
    marginRight: 16,
  },
});

export default styles;
