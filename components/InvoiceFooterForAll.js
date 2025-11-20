import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Dimensions,
} from 'react-native';
import React, {useCallback, useState} from 'react';
import SalesInvoiceFooterTable from './SalesInvoiceFooterTable';
import {Picker} from '@react-native-picker/picker';
import OuterBodyModal from './OuterBodyModal';
import {COLORS, FONTS} from '../constants';
import CustomStyles from './AddEditModalStyles';
import {useSales} from './SalesContext';
import {List, Card} from 'react-native-paper';
import PurchaseInvoiceFooterTable from './PurchaseInvoiceFooterTable';
import {usePurchase} from './PurchaseContext';
import {useStockTransfer} from './StockTransferContext';
import StockTransferInvoiceFooterTable from './StockTransferInvoiceFooterTable';
import {useOpeningStock} from './OpeningStockContext';
import SalesInvoiceFooterEditTable from './SalesInvoiceFooterEditTable';
import PurchaseInvoiceFooterEditTable from './PurchaseInvoiceFooterEditTable';
import StockTransferInvoiceFooterEditTable from './StockTransferInvoiceFooterEditTable';
import {useEstimate} from './EstimateContext';
import EstimateInvoiceFooterTable from './EstimateInvoiceFooterTable';
import EstimateInvoiceFooterEditTable from './EstimateInvoiceFooterEditTable';
import {usePettySales} from './PettySalesContext';
import {usePurchaseReturn} from './PurchaseReturnContext';
import {useProduction} from './ProductionContext';

const screenWidth = Dimensions.get('screen').width;

const InvoiceFooterForAll = ({
  handleTaxChange,
  handlePriceListChange,
  invoiceFooterType,
  type,
  invoice_no,
  setFooterLoading,
  mopSettings,
}) => {
  let items, formDataFooter, setFormDataFooter, totalAmt;

  if (type === 'sales' || type === 'sales_order') {
    ({items, formDataFooter, setFormDataFooter, totalAmt} = useSales());
  } else if (type === 'purchase') {
    ({items, formDataFooter, setFormDataFooter, totalAmt} = usePurchase());
  } else if (type === 'stock_transfer') {
    ({items, formDataFooter, setFormDataFooter, totalAmt} = useStockTransfer());
  } else if (type === 'openingStock') {
    ({items, formDataFooter, setFormDataFooter, totalAmt} = useOpeningStock());
  } else if (type === 'estimate') {
    ({items, formDataFooter, setFormDataFooter, totalAmt} = useEstimate());
  } else if (type === 'pettySales') {
    ({items, formDataFooter, setFormDataFooter, totalAmt} = usePettySales());
  } else if (type === 'purchase_return') {
    ({items, formDataFooter, setFormDataFooter, totalAmt} =
      usePurchaseReturn());
  } else if (type === 'production') {
    ({items, formDataFooter, setFormDataFooter, totalAmt} = useProduction());
  }

  const [billDetailsExpanded, setBillDetailsExpanded] = useState(true);

  const totalGrossAmt = Number(
    items.reduce((total, item) => total + Number(item.grossAmt), 0).toFixed(2),
  );

  const totalDiscountAmt = Number(
    items.reduce((total, item) => total + Number(item.discount), 0).toFixed(2),
  );

  const totalTaxableAmt = Number(
    items.reduce((total, item) => total + Number(item.taxable), 0).toFixed(2),
  );

  const totalSGSTAmt = Number(
    items.reduce((total, item) => total + Number(item.sgst), 0).toFixed(2),
  );

  const totalCGSTAmt = Number(
    items.reduce((total, item) => total + Number(item.cgst), 0).toFixed(2),
  );

  const totalIGSTAmt = Number(
    items.reduce((total, item) => total + Number(item.igst), 0).toFixed(2),
  );

  const totalQty = Number(
    items.reduce((total, item) => total + Number(item.qty), 0).toFixed(2),
  );

  const printOptions = [
    {value: 'A4 Size', label: 'A4 Size'},
    {value: 'A4 Landscape', label: 'A4 Landscape'},
    {value: 'A5 Size', label: 'A5 Size'},
    {value: 'Thermal Printer', label: 'Thermal Printer'},
  ];

  // Check if bill details should be shown based on mopSettings
  const salesBillDetailsFlag = mopSettings?.sales_bill_details;
  const isBillDetailsOn =
    mopSettings == null || Number(salesBillDetailsFlag) === 1;
  const shouldShowBillDetails = isBillDetailsOn;
  const shouldShowPrintSettings = isBillDetailsOn;

  return (
    <View style={{marginHorizontal: 15, marginVertical: 30}}>
      {shouldShowBillDetails && (
        <List.Accordion
          title="Bill Details"
          expanded={billDetailsExpanded}
          onPress={() => setBillDetailsExpanded(!billDetailsExpanded)}
          style={{
            backgroundColor: COLORS.inputbggreen,
            borderRadius: 5,
          }}
          titleStyle={{
            fontFamily: FONTS.body4.fontFamily,
            color: COLORS.black,
          }}>
        {invoiceFooterType === 'SalesInvoiceFooterTable' && (
          <Card style={{marginVertical: 5, backgroundColor: COLORS.white}}>
            <Card.Content>
              <SalesInvoiceFooterTable
                formData={formDataFooter}
                updateFormData={setFormDataFooter}
                totalAmt={totalAmt}
                handleTaxChange={handleTaxChange}
                handlePriceListChange={handlePriceListChange}
              />
            </Card.Content>
          </Card>
        )}
        {invoiceFooterType === 'SalesInvoiceFooterEditTable' && (
          <Card style={{marginVertical: 5, backgroundColor: COLORS.white}}>
            <Card.Content>
              <SalesInvoiceFooterEditTable
                type={type}
                invoice_no={invoice_no}
                formData={formDataFooter}
                updateFormData={setFormDataFooter}
                totalAmt={totalAmt}
                handleTaxChange={handleTaxChange}
                handlePriceListChange={handlePriceListChange}
                setFooterLoading={setFooterLoading}
              />
            </Card.Content>
          </Card>
        )}
        {(invoiceFooterType === 'PurchaseInvoiceFooterTable' ||
          invoiceFooterType === 'OpeningStockInvoiceFooterTable') && (
          <Card style={{marginVertical: 5, backgroundColor: COLORS.white}}>
            <Card.Content>
              <PurchaseInvoiceFooterTable
                type={type}
                formData={formDataFooter}
                updateFormData={setFormDataFooter}
                totalAmt={totalAmt}
                handleTaxChange={handleTaxChange}
              />
            </Card.Content>
          </Card>
        )}
        {(invoiceFooterType === 'PurchaseInvoiceFooterEditTable' ||
          invoiceFooterType === 'OpeningStockInvoiceFooterEditTable') && (
          <Card style={{marginVertical: 5, backgroundColor: COLORS.white}}>
            <Card.Content>
              <PurchaseInvoiceFooterEditTable
                type={type}
                invoice_no={invoice_no}
                formData={formDataFooter}
                updateFormData={setFormDataFooter}
                totalAmt={totalAmt}
                handleTaxChange={handleTaxChange}
                setFooterLoading={setFooterLoading}
              />
            </Card.Content>
          </Card>
        )}
        {invoiceFooterType === 'StockTransferInvoiceFooterTable' && (
          <Card style={{marginVertical: 5, backgroundColor: COLORS.white}}>
            <Card.Content>
              <StockTransferInvoiceFooterTable
                formData={formDataFooter}
                updateFormData={setFormDataFooter}
                totalAmt={totalAmt}
                handleTaxChange={handleTaxChange}
                handlePriceListChange={handlePriceListChange}
              />
            </Card.Content>
          </Card>
        )}
        {invoiceFooterType === 'StockTransferInvoiceFooterEditTable' && (
          <Card style={{marginVertical: 5, backgroundColor: COLORS.white}}>
            <Card.Content>
              <StockTransferInvoiceFooterEditTable
                invoice_no={invoice_no}
                formData={formDataFooter}
                updateFormData={setFormDataFooter}
                totalAmt={totalAmt}
                handleTaxChange={handleTaxChange}
                handlePriceListChange={handlePriceListChange}
              />
            </Card.Content>
          </Card>
        )}
        {invoiceFooterType === 'EstimateInvoiceFooterTable' && (
          <Card style={{marginVertical: 5, backgroundColor: COLORS.white}}>
            <Card.Content>
              <EstimateInvoiceFooterTable
                formData={formDataFooter}
                updateFormData={setFormDataFooter}
                totalAmt={totalAmt}
                handleTaxChange={handleTaxChange}
                handlePriceListChange={handlePriceListChange}
              />
            </Card.Content>
          </Card>
        )}
        {invoiceFooterType === 'EstimateInvoiceFooterEditTable' && (
          <Card style={{marginVertical: 5, backgroundColor: COLORS.white}}>
            <Card.Content>
              <EstimateInvoiceFooterEditTable
                type={type}
                invoice_no={invoice_no}
                formData={formDataFooter}
                updateFormData={setFormDataFooter}
                totalAmt={totalAmt}
                handleTaxChange={handleTaxChange}
                handlePriceListChange={handlePriceListChange}
              />
            </Card.Content>
          </Card>
        )}
      </List.Accordion>
      )}
      {type !== 'production' && (
        <List.Accordion
          title="Total"
          style={{
            backgroundColor: COLORS.inputbggreen,
            borderRadius: 5,
            marginTop: 20,
          }}
          titleStyle={{
            fontFamily: FONTS.body4.fontFamily,
            color: COLORS.black,
          }}>
          <Card style={{marginVertical: 5, backgroundColor: COLORS.white}}>
            <Card.Content>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  width: screenWidth * 0.8,
                }}>
                <View style={{width: '50%'}}>
                  <Text style={CustomStyles.labelInput}>Gross Total :</Text>
                  <TextInput
                    style={{
                      backgroundColor: COLORS.inputbggreen,
                      padding: 10,
                      color: COLORS.black,
                    }}
                    mode="flat"
                    placeholderTextColor={COLORS.black}
                    activeUnderlineColor={COLORS.primary}
                    value={totalGrossAmt.toString()}
                    keyboardType="numeric"
                    editable={false}
                  />
                </View>
                <View style={{width: '50%', marginLeft: 10}}>
                  <Text style={CustomStyles.labelInput}>Discount Total :</Text>
                  <TextInput
                    style={{
                      backgroundColor: COLORS.inputbggreen,
                      padding: 10,
                      color: COLORS.black,
                    }}
                    mode="flat"
                    placeholderTextColor={COLORS.black}
                    activeUnderlineColor={COLORS.primary}
                    value={totalDiscountAmt.toString()}
                    keyboardType="numeric"
                    editable={false}
                  />
                </View>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  width: screenWidth * 0.8,
                }}>
                <View style={{width: '50%'}}>
                  <Text style={CustomStyles.labelInput}>Taxable Total :</Text>
                  <TextInput
                    style={{
                      backgroundColor: COLORS.inputbggreen,
                      padding: 10,
                      color: COLORS.black,
                    }}
                    mode="flat"
                    placeholderTextColor={COLORS.black}
                    activeUnderlineColor={COLORS.primary}
                    value={totalTaxableAmt.toString()}
                    keyboardType="numeric"
                    editable={false}
                  />
                </View>
                <View style={{width: '50%', marginLeft: 10}}>
                  <Text style={CustomStyles.labelInput}>SGST Total :</Text>
                  <TextInput
                    style={{
                      backgroundColor: COLORS.inputbggreen,
                      padding: 10,
                      color: COLORS.black,
                    }}
                    mode="flat"
                    placeholderTextColor={COLORS.black}
                    activeUnderlineColor={COLORS.primary}
                    value={totalSGSTAmt.toString()}
                    keyboardType="numeric"
                    editable={false}
                  />
                </View>
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  width: screenWidth * 0.8,
                }}>
                <View style={{width: '50%'}}>
                  <Text style={CustomStyles.labelInput}>CGST Total :</Text>
                  <TextInput
                    style={{
                      backgroundColor: COLORS.inputbggreen,
                      padding: 10,
                      color: COLORS.black,
                    }}
                    mode="flat"
                    placeholderTextColor={COLORS.black}
                    activeUnderlineColor={COLORS.primary}
                    value={totalCGSTAmt.toString()}
                    keyboardType="numeric"
                    editable={false}
                  />
                </View>
                <View style={{width: '50%', marginLeft: 10}}>
                  <Text style={CustomStyles.labelInput}>IGST Total :</Text>
                  <TextInput
                    style={{
                      backgroundColor: COLORS.inputbggreen,
                      padding: 10,
                      color: COLORS.black,
                    }}
                    mode="flat"
                    placeholderTextColor={COLORS.black}
                    activeUnderlineColor={COLORS.primary}
                    value={totalIGSTAmt.toString()}
                    keyboardType="numeric"
                    editable={false}
                  />
                </View>
              </View>

              <View style={CustomStyles.inputContainer}>
                <Text style={CustomStyles.labelInput}>Total Qty :</Text>
                <TextInput
                  style={{
                    backgroundColor: COLORS.inputbggreen,
                    padding: 10,
                    color: COLORS.black,
                  }}
                  mode="flat"
                  placeholderTextColor={COLORS.black}
                  activeUnderlineColor={COLORS.primary}
                  value={totalQty.toString()}
                  keyboardType="numeric"
                  editable={false}
                />
              </View>
            </Card.Content>
          </Card>
        </List.Accordion>
      )}
      {type !== 'production' && shouldShowPrintSettings && (
        <List.Accordion
          title="Print Settings"
          style={{
            backgroundColor: COLORS.inputbggreen,
            borderRadius: 5,
            marginTop: 20,
            
          }}
          titleStyle={{
            fontFamily: FONTS.body4.fontFamily,
            color: COLORS.black,
          }}>
          <Card style={{marginVertical: 5, backgroundColor: COLORS.white}}>
            <Card.Content>
              {(invoiceFooterType === 'SalesInvoiceFooterTable' ||
                invoiceFooterType === 'SalesInvoiceFooterEditTable' ||
                invoiceFooterType === 'PurchaseInvoiceFooterTable' ||
                invoiceFooterType === 'PurchaseInvoiceFooterEditTable' ||
                invoiceFooterType === 'EstimateInvoiceFooterTable' ||
                invoiceFooterType === 'EstimateInvoiceFooterEditTable') && (
                <View style={CustomStyles.inputContainer}>
                  <Text style={CustomStyles.labelInput}>Print Type :</Text>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <View style={CustomStyles.inputPicker}>
                      <Picker
                        selectedValue={
                          formDataFooter.invoice_print_type
                            ? formDataFooter.invoice_print_type.value
                            : null
                        }
                        style={{color: COLORS.black}}
                        dropdownIconColor={COLORS.black}
                        onValueChange={(itemValue, itemIndex) => {
                          const selectedOption = printOptions.find(
                            option => option.value === itemValue,
                          );
                          setFormDataFooter(prevFormData => ({
                            ...prevFormData,
                            invoice_print_type: {
                              value: selectedOption.value,
                              label: selectedOption.label,
                            },
                          }));
                        }}>
                        <Picker.Item
                          label="-- Select Print Type --"
                          value={null}
                          color={COLORS.black}
                        />
                        {printOptions.map(option => (
                          <Picker.Item
                            key={option.value}
                            label={option.label}
                            value={option.value}
                            color={COLORS.black}
                          />
                        ))}
                      </Picker>
                    </View>
                  </View>
                </View>
              )}
            </Card.Content>
          </Card>
        </List.Accordion>
      )}
    </View>
  );
};

export default InvoiceFooterForAll;

const styles = StyleSheet.create({});
