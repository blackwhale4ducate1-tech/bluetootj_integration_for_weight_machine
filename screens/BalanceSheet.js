import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import {useState} from 'react';
import {Picker} from '@react-native-picker/picker';
import SimpleBalanceSheetTable from '../components/SimpleBalanceSheetTable';
import {useNavigation} from '@react-navigation/native';
import DetailedBalanceSheetTable from '../components/DetailedBalanceSheetTable';
import {COLORS, MaterialCommunityIcons, FONTS} from '../constants';

const BalanceSheet = () => {
  const [viewMode, setViewMode] = useState(null);
  const navigation = useNavigation();
  const viewModeOptions = [
    {value: 'simple', label: 'Simple View'},
    {value: 'detailed', label: 'Detailed View'},
  ];

  const handleViewModeChange = itemValue => {
    console.log('itemValue: ' + itemValue);
    if (itemValue === 'simple') {
      setViewMode({value: 'simple', label: 'Simple View'});
      console.log('Entered simple');
    } else if (itemValue === 'detailed') {
      setViewMode({value: 'detailed', label: 'Detailed View'});
    } else {
      setViewMode(null);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons
            name="keyboard-backspace"
            size={22}
            color={COLORS.black}
          />
        </TouchableOpacity>
        <Text style={styles.headerText}>Balance Sheet</Text>
      </View>

      <View style={styles.pickercontain}>
        <Picker
          selectedValue={viewMode ? viewMode.value : null}
          onValueChange={itemValue => handleViewModeChange(itemValue)}
          style={{color: COLORS.black}}>
          <Picker.Item label="Select View Mode" value={null} />
          {viewModeOptions.map(option => (
            <Picker.Item
              key={option.value}
              label={option.label}
              value={option.value}
            />
          ))}
        </Picker>
      </View>
      {viewMode && (
        <>
          {viewMode.value === 'simple' && <SimpleBalanceSheetTable />}
          {viewMode.value === 'detailed' && <DetailedBalanceSheetTable />}
        </>
      )}
    </View>
  );
};

export default BalanceSheet;

const styles = StyleSheet.create({
  container: {
    margin: 15,
  },

  button: {
    alignItems: 'center',
    backgroundColor: '#DDDDDD',
    padding: 10,
  },
  validationError: {
    color: 'red',
    textAlign: 'center',
    marginTop: 10,
  },
  pickercontain: {
    marginLeft: 10,
    marginTop: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: COLORS.primary,
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
    fontWeight: '700',
  },
});
