import {StyleSheet, Dimensions} from 'react-native';
import {COLORS, FONTS} from '../constants';
const screenWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    backgroundColor:COLORS.white
   
  },
  contentContainer: {
    flex: 1,
    margin: 10,
   
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  headerText: {
    fontSize: 16,
    fontFamily: FONTS.body5.fontFamily,
    color: COLORS.black,
    marginLeft: 20,
    fontWeight:"700"
  },
  addbtn: {
    width: screenWidth,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },

  btnposition: {
    position: 'absolute',
   bottom:10,
  
  },
  btnContain: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.red,
    paddingLeft: 10,
    height: 40,
    borderRadius: 20,
  },
  addButtonText: {
    color: COLORS.white,
    paddingHorizontal: 40,
    fontFamily: FONTS.body4.fontFamily,

    fontSize: 16,
    fontWeight: '700',
    paddingLeft: 5,
  },
  backButtonText: {
    color: COLORS.white,
    marginLeft: 10,
    padding: 10,
    backgroundColor: COLORS.emerald,
  },
});

export default styles;
