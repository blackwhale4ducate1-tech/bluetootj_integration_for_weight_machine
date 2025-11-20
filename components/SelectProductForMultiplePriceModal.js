import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import {useState, useEffect, useRef, useCallback} from 'react';
import OuterBodyModal from './OuterBodyModal';
import styles from './AddEditModalStyles';
import SearchResponsiveTable from './SearchResponsiveTable';

const SelectProductForMultiplePriceModal = ({
  modalTitle,
  showModal,
  handleClose,
  updateItems,
  rowNo,
  barcodeSearchResult,
}) => {
  const [activeRow, setActiveRow] = useState(0);

  const handleSubmit = async () => {
    updateItems(prevItems => {
      const updatedItems = [...prevItems];
      const updatedItem = {...updatedItems[rowNo]};
      updatedItem.barcode = barcodeSearchResult[activeRow]?.barcode || '';
      updatedItem.productCode =
        barcodeSearchResult[activeRow]?.product_code || '';
      updatedItem.productName =
        barcodeSearchResult[activeRow]?.product_name || '';
      updatedItem.hsnCode = barcodeSearchResult[activeRow]?.hsn_code || '';
      updatedItem.qty = '';
      updatedItem.purchasePrice =
        barcodeSearchResult[activeRow]?.purchase_price || '';
      updatedItem.salesPrice =
        barcodeSearchResult[activeRow]?.sales_price || '';
      // updatedItem.salesPriceInStock =
      //   barcodeSearchResult[activeRow]?.sales_price || '';
      updatedItem.mrp = barcodeSearchResult[activeRow]?.mrp || '';
      updatedItem.cost =
        barcodeSearchResult[activeRow]?.sales_inclusive === 1
          ? (
              barcodeSearchResult[activeRow]?.sales_price /
              (1 + barcodeSearchResult[activeRow]?.igst / 100)
            ).toFixed(2)
          : barcodeSearchResult[activeRow]?.sales_price;
      updatedItem.purchaseInclusive =
        barcodeSearchResult[activeRow]?.purchase_inclusive || 0;
      updatedItem.salesInclusive =
        barcodeSearchResult[activeRow]?.sales_inclusive || 0;
      updatedItem.grossAmt = '';
      updatedItem.taxable = '';
      updatedItem.cgstP = barcodeSearchResult[activeRow]?.cgst || '';
      updatedItem.cgst = '';
      updatedItem.sgstP = barcodeSearchResult[activeRow]?.sgst || '';
      updatedItem.sgst = '';
      updatedItem.igstP = barcodeSearchResult[activeRow]?.igst || '';
      updatedItem.igst = '';
      updatedItem.discountP = barcodeSearchResult[activeRow]?.discountP || 0;
      updatedItem.discount = 0;
      updatedItem.subTotal = '';
      updatedItems[rowNo] = updatedItem;
      return updatedItems;
    });
    handleClose();
  };

  useEffect(() => {
    setActiveRow(0); // Reset the active row index when modal opens or closes
    if (showModal && inputRef.current) {
      inputRef.current.focus();
    }
  }, [showModal]);

  const handleClickRow = index => {
    setActiveRow(index);
    inputRef.current.focus();
  };

  const tableHeaders = ['Barcode', 'Product Code', 'Sales Price', 'MRP'];
  const tableData = barcodeSearchResult.map(result => [
    result.barcode,
    result.product_code,
    result.sales_price,
    result.mrp,
  ]);

  return (
    <View>
      <OuterBodyModal
        modalTitle={modalTitle}
        showModal={showModal}
        handleClose={handleClose}>
        <ScrollView>
          <View style={styles.container}>
            <SearchResponsiveTable
              headers={tableHeaders}
              data={tableData}
              activeRowIndex={activeRow}
              handleRowClick={handleClickRow}
            />
            <View>
              <TouchableOpacity
                onPress={handleSubmit}
                style={styles.submitButton}>
                <Text style={styles.submitButtonText}>Submit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </OuterBodyModal>
    </View>
  );
};

export default SelectProductForMultiplePriceModal;
