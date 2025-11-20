import {StyleSheet, Dimensions} from 'react-native';
import {COLORS, FONTS} from '../constants';
const screenWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  //<table>
  tableContainer: {
    borderColor: COLORS.gray,
    borderWidth: 1,
    marginVertical: 20,
  },
  // <thead><tr>
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: COLORS.white,
    padding: 10,
    backgroundColor: COLORS.primary,
  },
  //<th>
  header: {
    flex: 1,
    fontFamily: FONTS.body4.fontFamily,
    fontWeight: '700',
    textAlign: 'center',
    color: COLORS.white,
    width: 130,
  },
  //<tbody>
  body: {
    marginTop: 5,
    height:"100%",
  
  },
  //<tbody><tr>
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: 'black',
    padding: 10,
  },
  //<tbody><td>
  cell: {
    flex: 1,
    textAlign: 'center',
    fontFamily: FONTS.body4.fontFamily,
    color: COLORS.black,
    width: 130,
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
  },


});

export default styles;
