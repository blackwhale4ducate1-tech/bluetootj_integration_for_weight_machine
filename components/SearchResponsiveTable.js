import React from 'react';
import {
  View,
  Dimensions,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import {COLORS} from '../constants';

const screenWidth = Dimensions.get('screen').width;

const SearchResponsiveTable = ({
  headers,
  data,
  activeRowIndex,
  handleRowClick,
}) => {
  return (
    <ScrollView horizontal={true}>
      <View style={styles.tableContainer}>
        {/* Table Header */}
        <View style={styles.tableHeader}>
          {headers.map((header, index) => (
            <Text key={index} style={styles.headerCell}>
              {header}
            </Text>
          ))}
        </View>
        {/* Table Body */}
        <View style={{height: 300}}>
          <ScrollView>
            {data.map((rowData, rowIndex) => (
              <TouchableOpacity
                key={rowIndex}
                style={[
                  styles.tableRow,
                  rowIndex === activeRowIndex && styles.activeRow,
                ]}
                onPress={() => handleRowClick(rowIndex)}>
                {rowData.map((cellData, cellIndex) => (
                  <Text key={cellIndex} style={[styles.bodyCell,{fontSize:17,color:COLORS.black}]}>
                    {cellData}
                  </Text>
                ))}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  tableContainer: {
    flexDirection: 'column',
    backgroundColor: COLORS.white,
    borderColor: COLORS.green,

    borderWidth: 1,
    borderRadius: 5,
    marginTop: 10,
    marginBottom: 10,
    overflow: 'hidden',
    width: screenWidth * 0.7,
    height: 370,
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    backgroundColor: COLORS.primary,
  },
  headerCell: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 15,
    fontWeight: '700',
    textAlign: 'center',
    color: COLORS.white,
    fontSize: 17,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.white,
    backgroundColor: '#fff',
  },
  activeRow: {
    backgroundColor: COLORS.lightRed,
  },
  bodyCell: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
});

export default SearchResponsiveTable;
