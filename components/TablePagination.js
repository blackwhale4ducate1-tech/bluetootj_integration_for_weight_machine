import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
} from 'react-native';
import {
  COLORS,
  FONTS,
  FontAwesomeIcon,
  MaterialIcons,
  Foundation,
  MaterialCommunityIcons,
} from '../constants';
import {Picker} from '@react-native-picker/picker';

const screenWidth = Dimensions.get('screen').width;
const screenHeight = Dimensions.get('screen').height;

const TablePagination = ({
  tabledata,
  initialRowsPerPage,
  imagecolumns,
  showEditOption,
  showDeleteOption,
  onClickEdit,
  onClickDel,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(initialRowsPerPage);
  const [isFirstPage, setIsFirstPage] = useState(true);
  const [isLastPage, setIsLastPage] = useState(false);
  const [totalPages, setTotalPages] = useState(
    Math.ceil(tabledata.length / rowsPerPage),
  );
  const columns = tabledata.length > 0 ? Object.keys(tabledata[0]) : [];
  const imageColumnsExist =
    Array.isArray(imagecolumns) && imagecolumns.length > 0;

  useEffect(() => {
    setIsLastPage(totalPages <= 1);
    setRowsPerPage(
      initialRowsPerPage > tabledata.length
        ? tabledata.length
        : initialRowsPerPage,
    );
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleRowsPerPageChange(value) {
    setRowsPerPage(parseInt(value, 10));
    const newTotalPages = Math.ceil(tabledata.length / parseInt(value, 10));
    setTotalPages(newTotalPages);
    setCurrentPage(1);
    setIsFirstPage(true);
    setIsLastPage(newTotalPages <= 1);
  }

  function handleFirstClick() {
    setCurrentPage(1);
    setIsFirstPage(true);
    setIsLastPage(false);
  }

  function handlePreviousClick() {
    const newCurrentPage = currentPage - 1;
    setCurrentPage(newCurrentPage);
    setIsFirstPage(newCurrentPage === 1);
    setIsLastPage(newCurrentPage === totalPages);
  }

  function handleNextClick() {
    const newCurrentPage = currentPage + 1;
    setCurrentPage(newCurrentPage);
    setIsFirstPage(newCurrentPage === 1);
    setIsLastPage(newCurrentPage === totalPages);
  }

  function handleLastClick() {
    setCurrentPage(totalPages);
    setIsFirstPage(false);
    setIsLastPage(true);
  }

  function handleEditClick(rows) {
    if (rows.is_default !== 1) {
      onClickEdit(rows.id);
    }
  }

  function handleDelClick(rows) {
    if (rows.is_default !== 1) {
      onClickDel(rows.id);
    }
  }

  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = Math.min(startIndex + rowsPerPage, tabledata.length);
  const currentPageData = tabledata.slice(startIndex, endIndex);

  const rowsPerPageOptions = Array.from({length: tabledata.length}, (_, i) =>
    String(i + 1),
  );

  return (
    <View style={styles.table}>
      <ScrollView
        style={styles.parentScrollViewStyle}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{flexDirection: 'column', alignItems: 'center'}}>
        {currentPageData.map((rowData, index) => (
          <View key={index} style={styles.card}>
            <View style={styles.icons}>
              {(showEditOption || showDeleteOption) && (
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'flex-end',
                    marginBottom: 20,
                  }}>
                  {showEditOption && rowData.is_default !== 1 && (
                    <TouchableOpacity
                      onPress={() => handleEditClick(rowData)}
                      style={styles.editbg}>
                      <FontAwesomeIcon
                        name="pencil"
                        size={20}
                        color={COLORS.white}
                        style={styles.editIcon}
                      />
                    </TouchableOpacity>
                  )}
                  {showDeleteOption && rowData.is_default !== 1 && (
                    <TouchableOpacity
                      onPress={() => handleDelClick(rowData)}
                      style={[styles.editbg, styles.deletebg]}>
                      <FontAwesomeIcon
                        name="trash"
                        size={20}
                        color={COLORS.white}
                      />
                    </TouchableOpacity>
                  )}
                </View>
              )}
            </View>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <MaterialCommunityIcons
                  name="format-list-numbered"
                  size={18}
                  color={COLORS.primary}
                />
                <Text style={styles.heading}>No : </Text>
              </View>
              <View style={{marginLeft: 20}}>
                <Text style={styles.definition}>{index + 1}</Text>
              </View>
            </View>
            {columns.map((column, columnIndex) => {
              if (column !== 'id') {
                return (
                  <View
                    key={columnIndex}
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      marginVertical: 5,
                    }}>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                      <MaterialCommunityIcons
                        name="star-four-points"
                        size={18}
                        color={COLORS.primary}
                      />
                      <Text style={styles.heading}>
                        {column.toUpperCase()} :
                      </Text>
                    </View>
                    <View style={{flex: 1}}>
                      <Text style={styles.definition}>
                        {imageColumnsExist &&
                        imagecolumns.includes(column) &&
                        rowData[column] !== '' ? (
                          <Image
                            source={{uri: '/images/' + rowData[column]}}
                            style={styles.image}
                          />
                        ) : (
                          rowData[column]
                        )}
                      </Text>
                    </View>
                  </View>
                );
              }
              return null;
            })}
          </View>
        ))}
      </ScrollView>

      {/* Pagination controls */}
      <View style={styles.paginationContainer}>
        <Text style={styles.btnText}>Rows per page :</Text>
        <View style={styles.selectContainer}>
          <Picker
            selectedValue={String(rowsPerPage)}
            style={styles.select}
            onValueChange={itemValue => handleRowsPerPageChange(itemValue)}>
            {rowsPerPageOptions.map((option, index) => (
              <Picker.Item key={index} label={option} value={option} />
            ))}
          </Picker>
        </View>
      </View>
      <View>
        <View style={styles.paginationContainer}>
          <View style={styles.paginationButtons}>
            <TouchableOpacity
              style={[styles.button, {marginRight: 5}]}
              onPress={handleFirstClick}
              disabled={isFirstPage}>
              <MaterialIcons name="first-page" size={20} color={COLORS.black} />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, {marginRight: 15}]}
              onPress={handlePreviousClick}
              disabled={isFirstPage}>
              <Foundation name="previous" size={20} color={COLORS.black} />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, {marginRight: 15}]}
              onPress={handleNextClick}
              disabled={isLastPage}>
              <Foundation name="next" size={20} color={COLORS.black} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={handleLastClick}
              disabled={isLastPage}>
              <MaterialIcons name="last-page" size={20} color={COLORS.black} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  parentScrollViewStyle: {
    height: screenHeight - 300,
  },

  heading: {
    fontFamily: FONTS.body4.fontFamily,
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.black,
    marginVertical: 5,
    marginLeft: 10,
  },
  definition: {
    fontFamily: FONTS.body4.fontFamily,
    fontSize: 14,
    color: COLORS.black,
    marginVertical: 5,
    textAlign: 'right',
    marginLeft: 10,
  },
  editbg: {
    backgroundColor: COLORS.primary,
    width: 30,
    height: 30,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },

  deletebg: {
    marginLeft: 12,
    backgroundColor: COLORS.red,
  },

  card: {
    elevation: 0.7,
    borderRadius: 10,
    marginVertical: 20,
    padding: 10,
    width: screenWidth * 0.9,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },

  table: {
    height: screenHeight * 0.75,
  },

  btnText: {
    fontFamily: FONTS.body4.fontFamily,
    color: COLORS.blue,
    fontWeight: '700',
    fontSize: 14,
  },

  image: {
    width: 50,
    height: 50,
  },

  paginationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    margin: 10,
  },

  select: {
    height: 30,
    width: 100,
  },
  paginationButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  button: {
    padding: 5,
  },
});

export default TablePagination;
