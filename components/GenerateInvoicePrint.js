import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
// import numberToWords from 'number-to-words';
import {API_BASE_URL} from '../config';
import {numberToIndianWords} from './utils';
const GenerateInvoicePrint = ({
  pageTitle,
  pageSize,
  additionalPrintStyles,
  type,
  invoiceType,
  profileData,
  invoiceNo,
  formDataHeader,
  items,
  formDataFooter,
  totalAmt,
  billAmount,
  roundOff,
  company_name,
  imageLogoExists,
  imageQRExists,
  addEstimateAddress,
  columnWidths,
  rowsWithPageBreaks,
  remainingRowCount,
  data,
  imageCompanySealExists,
  imageAuthorisedSignatureExists,
}) => {
  const resolveImagePath = imageName =>
    imageName ? `${API_BASE_URL}/images/${company_name}/${imageName}` : undefined;
  const {
    declaration_height,
    a4_item_count,
    a5_item_count,
    isUnitExistInInvoice: isUnitExist,
    isDescriptionExistInInvoice,
    isBarcodeExistInInvoice,
    isSalesPersonExistInInvoice,
    isBarcodeSummarizeItemAllowInInvoice,
    currency,
    tax_type,
    isHsnCodeExistInInvoice,
    isTaxModeExistInInvoice,
    isGstExistInInvoice,
    isGstAmtExistInInvoice,
    isDiscountExistInInvoice,
    isExpenseExistInInvoice,
    expenseAliasInInvoice,
    isRemarksExistInInvoice,
    isMrpExistInInvoice,
    isDescriptionExistAsAColumn,
    isFssiExistInInvoice,
    isNarrationExistInInvoice,
    isCompanySealExistInSales,
    isSignatureImageExistInSales,
    isCompanySealExistInEstimate,
    isSignatureImageExistInEstimate,
    isShippingAddressExist,
  } = data;
  console.log('[GenerateInvoicePrint] Invoice Type:', invoiceType);
  console.log('[GenerateInvoicePrint] Invoice No:', invoiceNo);
  console.log('[GenerateInvoicePrint] Form Data Header:', formDataHeader);
  console.log('[GenerateInvoicePrint] Form Data Footer:', formDataFooter);
  console.log('[GenerateInvoicePrint] Profile Data:', profileData);
  console.log('[GenerateInvoicePrint] Price List Value:', formDataFooter?.priceList);
  console.log('[GenerateInvoicePrint] Payment Mode:', formDataFooter?.mop);
  console.log('[GenerateInvoicePrint] Items Count:', items?.length);
  console.log('[GenerateInvoicePrint] Items:', items);
  console.log('[GenerateInvoicePrint] Logo Image:',
    imageLogoExists ? resolveImagePath(profileData?.image_name) : 'NOT AVAILABLE',
  );
  console.log('[GenerateInvoicePrint] QR Image:',
    imageQRExists ? resolveImagePath(profileData?.qr_image_name) : 'NOT AVAILABLE',
  );
  console.log('[GenerateInvoicePrint] Company Seal Image:',
    imageCompanySealExists ? resolveImagePath(profileData?.companySealImageName) : 'NOT AVAILABLE',
  );
  console.log('[GenerateInvoicePrint] Authorised Signature Image:',
    imageAuthorisedSignatureExists ? resolveImagePath(profileData?.authorisedSignatureImageName) : 'NOT AVAILABLE',
  );
  items?.forEach((item, index) => {
    console.log(`[GenerateInvoicePrint] Item ${index}:`, {
      productCode: item.productCode,
      productName: item.productName,
      qty: item.qty,
      salesPrice: item.salesPrice,
      newSalesPrice: item.newSalesPrice,
      subTotal: item.subTotal,
      unit: item.unit,
      selectedUnit: item.selectedUnit,
      unitOptions: JSON.stringify(item.unitOptions),
      dynamicColumns: JSON.stringify(item.dynamicColumns),
      barcode: item.barcode,
      description: item.description,
      remarks: item.remarks,
    });
  });
  const itemsCount = items.length + remainingRowCount;
  const rowSpanWithDiscountExpense =
    2 + (isDiscountExistInInvoice ? 1 : 0) + (isExpenseExistInInvoice ? 1 : 0);
  const productCodeWidth =
    columnWidths.productCode +
    (isUnitExist === 1 ? 0 : columnWidths.unit) +
    (isDescriptionExistInInvoice === 1 && isDescriptionExistAsAColumn === 1
      ? 0
      : columnWidths.description) +
    (isHsnCodeExistInInvoice === 1 ? 0 : columnWidths.hsn) +
    (isGstExistInInvoice === 1 ? 0 : columnWidths.gstp) +
    (isGstAmtExistInInvoice === 1 ? 0 : columnWidths.gstAmt) +
    (isMrpExistInInvoice === 1 ? 0 : columnWidths.mrp);
  // Function to convert string to Pascal case
  const toPascalCase = str => {
    return str
      .replace(/[^a-zA-Z0-9 -]/g, '') // Remove any non-alphanumeric characters except spaces and hyphens
      .replace(/\b\w/g, txt => txt.toUpperCase()); // Capitalize the first letter of each word
  };
  const summarizeItems = items => {
    const summary = {};
    items.forEach(item => {
      const key = `${item.productCode}_${item.productName}_${item.hsnCode}_${item.unit}_${item.alt_unit}_${item.uc_factor}_${item.selectedUnit}_${item.purchasePrice}_${item.salesPrice}_${item.mrp}_${item.cost}_${item.newPurchasePrice}_${item.newSalesPrice}_${item.newMrp}_${item.purchaseInclusive}_${item.salesInclusive}_${item.selectedTax}_${item.cgstP}_${item.sgstP}_${item.igstP}_${item.discountP}`;
      if (!summary[key]) {
        summary[key] = {
          ...item,
          qty: Number(item.qty) || 0,
          grossAmt: Number(item.grossAmt) || 0,
          taxable: Number(item.taxable) || 0,
          cgst: Number(item.cgst) || 0,
          sgst: Number(item.sgst) || 0,
          igst: Number(item.igst) || 0,
          discount: Number(item.discount) || 0,
          subTotal: Number(item.subTotal).toFixed(2) || 0.0,
          barcodes: [item.barcode], // collect barcodes in an array
        };
      } else {
        // Sum up the fields
        summary[key].qty += Number(item.qty) || 0;
        summary[key].grossAmt += Number(item.grossAmt) || 0;
        summary[key].taxable += Number(item.taxable) || 0;
        summary[key].cgst += Number(item.cgst) || 0;
        summary[key].sgst += Number(item.sgst) || 0;
        summary[key].igst += Number(item.igst) || 0;
        summary[key].discount += Number(item.discount) || 0;
        summary[key].subTotal += Number(item.subTotal).toFixed(2) || 0.0;
        summary[key].barcodes.push(item.barcode); // add to barcodes list
      }
    });
    return Object.values(summary);
  };
  // Use the summarized data if the conditions are met
  const displayItems =
    isBarcodeExistInInvoice === 1 && isBarcodeSummarizeItemAllowInInvoice === 1
      ? summarizeItems(items)
      : items;
  function numberToWordsWithDecimal(number) {
    const [wholePart, decimalPart] = number.toString().split('.');
    let result = '';
    if (wholePart) {
      result += toPascalCase(numberToIndianWords(Number(wholePart)));
      result += currency === 'INR' ? ' Rupees' : ' Dirhams';
    }
    if (decimalPart) {
      result += ' And ';
      result += toPascalCase(numberToIndianWords(Number(decimalPart)));
      result += currency === 'INR' ? ' Paise' : ' Fils';
    }
    return result;
  }
  const formatDate = date => {
    const options = {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    };
    return new Date(date).toLocaleDateString('en-GB', options);
  };
  const totalQty = items.reduce((sum, item) => sum + Number(item.qty), 0);
  const totalGrossAmt = items.reduce(
    (sum, item) => sum + Number(item.grossAmt),
    0,
  );
  const totalGst = items.reduce(
    (sum, item) =>
      sum + Number(item.cgst) + Number(item.sgst) + Number(item.igst),
    0,
  );
  console.log('[GenerateInvoicePrint] Totals:', {
    totalQty,
    totalGrossAmt,
    totalGst,
    totalAmt,
    billAmount,
    roundOff,
  });
  const calculateSum = items => {
    const sumMap = {};
    items.forEach(item => {
      const {hsnCode, igstP, cgst, sgst, igst, taxable} = item;
      const key = `${hsnCode}-${igstP}`;
      if (!sumMap[key]) {
        sumMap[key] = {cgstSum: 0, sgstSum: 0, igstSum: 0, taxableSum: 0};
      }
      sumMap[key].cgstSum += parseFloat(cgst);
      sumMap[key].sgstSum += parseFloat(sgst);
      sumMap[key].igstSum += parseFloat(igst);
      sumMap[key].taxableSum += parseFloat(taxable);
    });
    return sumMap;
  };
  const sumMap = calculateSum(items);
  // Calculate flexible hsnItemsCount based on actual unique HSN codes
  const uniqueHsnCount = Object.keys(sumMap).length;
  const hsnItemsCount = Math.max(5, Math.min(10, uniqueHsnCount));

  // Calculate dynamic column count for A4 Landscape
  const landscapeColumnCount = 
    1 + // No
    1 + // Description
    (isHsnCodeExistInInvoice === 1 ? 1 : 0) + // Hanscode
    (isDescriptionExistInInvoice === 1 && isDescriptionExistAsAColumn === 1 ? 1 : 0) + // Desc column
    (isMrpExistInInvoice === 1 ? 1 : 0) + // MRP
    1 + // Qty
    (isUnitExist === 1 ? 1 : 0) + // Unit
    1 + // Rate
    1 + // Gross Amt
    (isDiscountExistInInvoice === 1 ? 1 : 0) + // Disc Amt
    (isGstExistInInvoice === 1 && formDataFooter.tax.value === "GST" ? 1 : 0) + // CGST %
    (isGstAmtExistInInvoice === 1 && formDataFooter.tax.value === "GST" ? 1 : 0) + // CGST Amt
    (isGstExistInInvoice === 1 && formDataFooter.tax.value === "GST" ? 1 : 0) + // SGST %
    (isGstAmtExistInInvoice === 1 && formDataFooter.tax.value === "GST" ? 1 : 0) + // SGST Amt
    (isGstExistInInvoice === 1 && formDataFooter.tax.value === "IGST" ? 1 : 0) + // IGST %
    (isGstAmtExistInInvoice === 1 && formDataFooter.tax.value === "IGST" ? 1 : 0) + // IGST Amt
    1; // Total
  const totalTaxable = items.reduce(
    (sum, item) => sum + Number(item.taxable),
    0,
  );
  const totalCgst = items.reduce((sum, item) => sum + Number(item.cgst), 0);
  const totalSgst = items.reduce((sum, item) => sum + Number(item.sgst), 0);
  const totalIgst = items.reduce((sum, item) => sum + Number(item.igst), 0);
  const generateHTMLTableRows = (
    items,
    displayItems,
    itemsCount,
    rowsWithPageBreaks,
    type,
  ) => {
    let rows = '';
    for (let index = 0; index < itemsCount; index++) {
      const item = displayItems[index];
      rows += `
        <tr
          class="row-item"
          style="
            padding: .3em;
            padding-top: 0;
            padding-bottom: 0;
            margin: 0;
            page-break-before: ${
              rowsWithPageBreaks && rowsWithPageBreaks.includes(index)
                ? 'always'
                : 'auto'
            };
            border-bottom: ${
              rowsWithPageBreaks && rowsWithPageBreaks.includes(index + 1)
                ? '1px solid black'
                : 'none'
            };
            visibility: ${index >= displayItems.length ? 'hidden' : 'visible'};
          "
        >
          <td
            class="text-end"
            style="border: 1px solid black; border-top: none; border-bottom: none; border-left: none; width: ${
              columnWidths.no
            }mm; padding: .3em; padding-top: 0; padding-bottom: 0; margin: 0; word-wrap: break-word; overflow-wrap: break-word; vertical-align: top;"
          >
            ${index < displayItems.length ? index + 1 : 'xyz'}
          </td>
          <td style="border: 1px solid black; border-top: none; border-bottom: none; width: ${productCodeWidth}mm; padding: .3em; padding-top: 0; padding-bottom: 0; margin: 0; word-wrap: break-word; overflow-wrap: break-word; vertical-align: top;">
          ${
            index < displayItems.length
              ? `${item.productName}${
                  isDescriptionExistInInvoice === 1 &&
                  isDescriptionExistAsAColumn === 0
                    ? `<br/>${item.description}`
                    : ''
                }${
                  isBarcodeExistInInvoice === 1 &&
                  isBarcodeSummarizeItemAllowInInvoice === 0
                    ? ` ${item.barcode}`
                    : ''
                }${
                  isBarcodeExistInInvoice === 1 &&
                  isBarcodeSummarizeItemAllowInInvoice === 1
                    ? item.barcodes.map(barcode => `<br/>${barcode}`).join('')
                    : ''
                }${isRemarksExistInInvoice === 1 ? `<br/>${item.remarks}` : ''}`
              : ''
          }
          </td>
          ${
            isHsnCodeExistInInvoice === 1
              ? `<td style="border: 1px solid black; border-top: none; border-bottom: none; width: ${
                  columnWidths.hsn
                }mm; padding: .3em; padding-top: 0; padding-bottom: 0; margin: 0; word-wrap: break-word; overflow-wrap: break-word; vertical-align: top;">
            ${index < displayItems.length ? item.hsnCode : 'xyz'}
          </td>`
              : ''
          }
         
          ${
            isDescriptionExistInInvoice === 1 &&
            isDescriptionExistAsAColumn === 1
              ? `
              <td style="border: 1px solid black; border-top: none; border-bottom: none; width: ${
                columnWidths.description
              }mm; padding: .3em; padding-top: 0; padding-bottom: 0; margin: 0; word-wrap: break-word; overflow-wrap: break-word; vertical-align: top;">
                  ${index < displayItems.length ? item.description : 'xyz'}
              </td>
            `
              : ``
          }
          ${
            isMrpExistInInvoice === 1
              ? `
              <td style="border: 1px solid black; border-top: none; border-bottom: none; width: ${
                columnWidths.mrp
              }mm; padding: .3em; padding-top: 0; padding-bottom: 0; margin: 0; word-wrap: break-word; overflow-wrap: break-word; vertical-align: top;">
                  ${index < displayItems.length ? item.mrp : 'xyz'}
              </td>
            `
              : ``
          }
          <td class="text-end" style="border: 1px solid black; border-top: none; border-bottom: none; width: ${
            columnWidths.qty
          }mm; padding: .3em; padding-top: 0; padding-bottom: 0; margin: 0; word-wrap: break-word; overflow-wrap: break-word; vertical-align: top;">
            ${index < displayItems.length ? item.qty : 'xyz'}
          </td>
          ${
            isUnitExist === 1
              ? `
              <td style="border: 1px solid black; border-top: none; border-bottom: none; width: ${
                columnWidths.unit
              }mm; padding: .3em; padding-top: 0; padding-bottom: 0; margin: 0; word-wrap: break-word; overflow-wrap: break-word; vertical-align: top;">
                  ${index < displayItems.length ? item.selectedUnit : 'xyz'}
              </td>
            `
              : ``
          }
          <td class="text-end" style="border: 1px solid black; border-top: none; border-bottom: none; width: ${
            columnWidths.rate
          }mm; padding: .3em; padding-top: 0; padding-bottom: 0; margin: 0; word-wrap: break-word; overflow-wrap: break-word; vertical-align: top;">
            ${
              index < displayItems.length
                ? type === 'PURCHASE'
                  ? Number(item.newPurchasePrice).toFixed(2)
                  : Number(item.newSalesPrice).toFixed(2)
                : ' '
            }
          </td>
          <td class="text-end" style="border: 1px solid black; border-top: none; border-bottom: none; width: ${
            columnWidths.grossAmt
          }mm; padding: .3em; padding-top: 0; padding-bottom: 0; margin: 0; word-wrap: break-word; overflow-wrap: break-word; vertical-align: top;">
            ${
              index < displayItems.length
                ? Number(item.grossAmt).toFixed(2)
                : 'xyz'
            }
          </td>
          ${
            isGstExistInInvoice === 1
              ? `<td class="text-end" style="border: 1px solid black; border-top: none; border-bottom: none; width: ${
                  columnWidths.gstp
                }mm; padding: .3em; padding-top: 0; padding-bottom: 0; margin: 0; word-wrap: break-word; overflow-wrap: break-word; vertical-align: top;">
            ${index < displayItems.length ? item.igstP : 'xyz'}
          </td>`
              : ''
          }
          ${
            isGstAmtExistInInvoice === 1
              ? `<td class="text-end" style="border: 1px solid black; border-top: none; border-bottom: none; width: ${
                  columnWidths.gstAmt
                }mm; padding: .3em; padding-top: 0; padding-bottom: 0; margin: 0; word-wrap: break-word; overflow-wrap: break-word; vertical-align: top;">
            ${
              index < displayItems.length
                ? Number(
                    Number(item.cgst) + Number(item.sgst) + Number(item.igst),
                  ).toFixed(2)
                : 'xyz'
            }
          </td>`
              : ' '
          }
         
          <td class="text-end" style="border: 1px solid black; border-top: none; border-bottom: none; border-right: none; width: ${
            columnWidths.subTotal
          }mm; padding: .3em; padding-top: 0; padding-bottom: 0; margin: 0; word-wrap: break-word; overflow-wrap: break-word; vertical-align: top;">
            ${
              index < displayItems.length
                ? Number(item.subTotal).toFixed(2)
                : 'xyz'
            }
          </td>
        </tr>
      `;
    }
    return rows;
  };
  const generateHTMLTotalRow = (
    totalQty,
    totalGrossAmt,
    totalGst,
    totalAmt,
  ) => `
    <tr style="border: none;">
      <th style="border: 1px solid black; border-bottom: ${
        isHsnCodeExistInInvoice === 1 ? 'none' : undefined
      }; border-left: none;" colspan="2">Total</th>
      ${
        isHsnCodeExistInInvoice === 1
          ? `<th style="border: 1px solid black; border-bottom: ${
              isHsnCodeExistInInvoice === 1 ? 'none' : undefined
            };"></th>`
          : ''
      }
      ${
        isDescriptionExistInInvoice === 1 && isDescriptionExistAsAColumn === 1
          ? `
          <th style="border: 1px solid black; border-bottom: ${
            isHsnCodeExistInInvoice === 1 ? 'none' : undefined
          };"></th>
        `
          : ``
      }
      ${
        isMrpExistInInvoice === 1
          ? `
          <th style="border: 1px solid black; border-bottom: ${
            isHsnCodeExistInInvoice === 1 ? 'none' : undefined
          };"></th>
        `
          : ``
      }
      <th class="text-end" style="border: 1px solid black; border-bottom: ${
        isHsnCodeExistInInvoice === 1 ? 'none' : undefined
      };">${totalQty}</th>
      ${
        isUnitExist === 1
          ? `
          <th style="border: 1px solid black; border-bottom: ${
            isHsnCodeExistInInvoice === 1 ? 'none' : undefined
          };"></th>
        `
          : ``
      }
      <th style="border: 1px solid black; border-bottom: ${
        isHsnCodeExistInInvoice === 1 ? 'none' : undefined
      };"></th>
      <th class="text-end" style="border: 1px solid black; border-bottom: ${
        isHsnCodeExistInInvoice === 1 ? 'none' : undefined
      };">${Number(totalGrossAmt).toFixed(2)}</th>
      ${
        isGstExistInInvoice === 1
          ? `<th style="border: 1px solid black; border-bottom: ${
              isHsnCodeExistInInvoice === 1 ? 'none' : undefined
            };"></th>`
          : ''
      }
      ${
        isGstAmtExistInInvoice === 1
          ? `<th class="text-end" style="border: 1px solid black; border-bottom: ${
              isHsnCodeExistInInvoice === 1 ? 'none' : undefined
            };">${Number(totalGst).toFixed(2)}</th>`
          : ''
      }
     
      <th class="text-end" style="border: 1px solid black; border-bottom: ${
        isHsnCodeExistInInvoice === 1 ? 'none' : undefined
      }; border-right: none;">${Number(totalAmt).toFixed(2)}</th>
    </tr>
  `;
  const generateFooterTableRows = (hsnItemsCount, sumMap, formDataFooter) => {
    let rows = '';
    const keys = Object.keys(sumMap);
    for (let index = 0; index < hsnItemsCount; index++) {
      const key = keys[index];
      const {cgstSum, sgstSum, igstSum, taxableSum} =
        index < keys.length ? sumMap[key] : '';
      const [hsnCode, igstP] = index < keys.length ? key.split('-') : '';
      rows += `
        <tr style="visibility: ${index >= keys.length ? 'hidden' : 'visible'};">
          <td style="border: 1px solid black; border-top: none; border-bottom: none;">
            ${index < keys.length ? hsnCode : 'xyz'}
          </td>
          <td style="border: 1px solid black; border-top: none; border-bottom: none;" class="text-end">
            ${index < keys.length ? Number(taxableSum).toFixed(2) : 'xyz'}
          </td>
          ${
            formDataFooter.tax.value === 'GST'
              ? `
            <td class="text-end" style="border: 1px solid black; border-top: none; border-bottom: none;">
              ${index < keys.length ? igstP / 2 : 'xyz'}
            </td>
            <td class="text-end" style="border: 1px solid black; border-top: none; border-bottom: none;">
              ${index < keys.length ? Number(cgstSum).toFixed(2) : 'xyz'}
            </td>
            <td class="text-end" style="border: 1px solid black; border-top: none; border-bottom: none;">
              ${index < keys.length ? igstP / 2 : 'xyz'}
            </td>
            <td class="text-end" style="border: 1px solid black; border-top: none; border-bottom: none;">
              ${index < keys.length ? Number(sgstSum).toFixed(2) : 'xyz'}
            </td>`
              : ''
          }
          ${
            formDataFooter.tax.value === 'IGST'
              ? `
            <td class="text-end" style="border: 1px solid black; border-top: none; border-bottom: none;">
              ${index < keys.length ? igstP : 'xyz'}
            </td>
            <td class="text-end" style="border: 1px solid black; border-top: none; border-bottom: none;">
              ${index < keys.length ? Number(igstSum).toFixed(2) : 'xyz'}
            </td>`
              : ''
          }
          <td class="text-end" style="border: 1px solid black; border-top: none; border-bottom: none;">
            ${
              index < keys.length
                ? Number(cgstSum + sgstSum + igstSum).toFixed(2)
                : 'xyz'
            }
          </td>
        </tr>
      `;
    }
    return rows;
  };
  const generateFooterTableTotal = (
    formDataFooter,
    totalTaxable,
    totalCgst,
    totalSgst,
    totalIgst,
  ) => `
    <tr>
      <th style="border: 1px solid black;">Total</th>
      <th class="text-end" style="border: 1px solid black;">${Number(
        totalTaxable,
      ).toFixed(2)}</th>
      ${
        formDataFooter.tax.value === 'GST'
          ? `
        <th style="border: 1px solid black;"></th>
        <th class="text-end" style="border: 1px solid black;">${Number(
          totalCgst,
        ).toFixed(2)}</th>
        <th style="border: 1px solid black;"></th>
        <th class="text-end" style="border: 1px solid black;">${Number(
          totalSgst,
        ).toFixed(2)}</th>`
          : ''
      }
      ${
        formDataFooter.tax.value === 'IGST'
          ? `
        <th style="border: 1px solid black;"></th>
        <th class="text-end" style="border: 1px solid black;">${Number(
          totalIgst,
        ).toFixed(2)}</th>`
          : ''
      }
      <th class="text-end" style="border: 1px solid black;">${Number(
        totalCgst + totalSgst + totalIgst,
      ).toFixed(2)}</th>
    </tr>
  `;
  return `
  <!DOCTYPE html>
  <html>
    <head>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>${pageTitle}</title>
        <style>
            .text-end { text-align: end; }
            .text-center { text-align: center; }
            @page { size: ${pageSize}; } ${additionalPrintStyles}
            @font-face {
                font-family: 'BookmanOldStyle';
                src: url('${API_BASE_URL}/fonts/BOOKOS.TTF') format('truetype');
                font-weight: normal;
                font-style: normal;
            }
            body {
                margin: 0;
                padding: 0;
                font-family: 'BookmanOldStyle';
              }
            table { border-collapse: collapse; }
            /* Apply responsive styles to the table */
            .responsive-table {
                width: 100%;
                border-collapse: collapse;
            }
           
            /* Apply styles to table header cells */
            .responsive-table th {
                border: 1px solid black;
                padding: .3em;
                text-align: left;
            }
           
            /* Apply styles to table data cells */
            .responsive-table td {
                border: 1px solid black;
                padding: .3em;
            }
            .float-start {
                float: left;
            }
           
            .float-end {
                float: right;
            }
           
            /* Clearfix for parent elements that contain floated elements */
            .clearfix::after {
                content: "";
                display: table;
                clear: both;
            }
           
            /* Apply responsive styles to the table for small screens */
            @media screen and (max-width: 600px) {
                .responsive-table {
                overflow-x: auto;
                }
            }
        </style>
    </head>
    <body>
        ${
          formDataFooter.invoice_print_type.value === 'A4 Size'
            ? `
              <div style="margin-right:30px; margin-left:30px;">
                  <table style="width: 100%;">
                      <thead>
                          <tr class="text-center">
                              <td colspan="4">
                                  <div style="position: relative; line-height: 1; margin-top: 30px;">
                                      ${
                                        imageLogoExists
                                          ? `
                                          <img
                                              src="${API_BASE_URL}/images/${company_name}/${profileData.image_name}"
                                              width="100"
                                              height="80"
                                              alt=""
                                              style="position: fixed; top: 40px; left: 40px;"
                                          />
                                          `
                                          : ''
                                      }
                                      ${
                                        addEstimateAddress === 'not allow'
                                          ? `<br />
                                            <br />
                                            <b style="font-size: 24px;">
                                              ESTIMATE
                                            </b>
                                            <br />
                                            <br />
                                            <br />
                                            <br />`
                                          : `<b style="font-size: 24px;">
                                              ${profileData.company_full_name}
                                            </b>
                                            <br />
                                            ${profileData.address}
                                            <br />
                                            ${
                                              profileData.city +
                                              ',' +
                                              profileData.state +
                                              '-' +
                                              profileData.pincode
                                            }
                                            <br />
                                            ${'Ph: ' + profileData.phone_no}
                                            <br />
                                            ${'Email: ' + profileData.email}
                                            <br />
                                            ${
                                              isTaxModeExistInInvoice === 1
                                                ? tax_type === 'GST'
                                                  ? 'GSTIN: ' +
                                                    profileData.gstin
                                                  : 'TRN: ' + profileData.gstin
                                                : ''
                                            }
                                                ${
                                                  isFssiExistInInvoice === 1
                                                    ? `<br />FSSI: ` +
                                                      profileData.fssi
                                                    : ''
                                                }
                                                `
                                      }
                                  </div>
                              </td>
                          </tr>
                          ${
                            isShippingAddressExist === 0 ||
                            (isShippingAddressExist === 1 &&
                              invoiceType !== 'sales')
                              ? `<tr style="font-size: 12px;">
                                <td colspan="2" rowspan="3" style="border: 1px solid black; padding: 10px; width: 50%;">
                                  <b>${
                                    type === 'PURCHASE'
                                      ? 'Supplier '
                                      : 'Customer'
                                  }Details:</b>
                                  <br />
                                  <b>Name: ${formDataHeader.name}</b>
                                  <br />
                                  Address: ${formDataHeader.address}
                                  <br />
                                  Ph: ${formDataHeader.phoneNo}
                                  <br />
                                  ${
                                    tax_type === 'GST'
                                      ? 'GSTIN: ' + formDataHeader.gstin
                                      : 'TRN: ' + formDataHeader.gstin
                                  }
                                </td>
                                <td style="border: 1px solid black; line-height: 0.5;">
                                  <b>${
                                    invoiceType === 'estimate'
                                      ? 'Estimate No: '
                                      : 'Invoice No: ' + invoiceNo
                                  }</b>
                                </td>
                                <td style="border: 1px solid black; line-height: 0.5;">
                                  <b>${
                                    invoiceType === 'estimate'
                                      ? 'Estimate Date: '
                                      : 'Date: ' +
                                        formatDate(formDataHeader.invoiceDate)
                                  }</b>
                                </td>
                              </tr>
                              <tr style="font-size: 12px; line-height: 0.5;">
                                <td style="border: 1px solid black;">
                                  <b>Payment Mode: ${
                                    formDataFooter.mop.value
                                  }</b>
                                </td>
                                <td style="border: 1px solid black;">
                                  ${
                                    isTaxModeExistInInvoice === 1
                                      ? `<b>Tax Mode: ${
                                          formDataFooter.tax.value === 'IGST' &&
                                          tax_type === 'VAT'
                                            ? 'VAT'
                                            : formDataFooter.tax.value
                                        }</b>`
                                      : ''
                                  }
                                </td>
                              </tr>
                              <tr style="font-size: 12px;">
                                <td colspan=${
                                  isSalesPersonExistInInvoice === 1 ? '1' : '2'
                                } style="border: 1px solid black; vertical-align: top;">
                                  <b>Remarks: </b>
                                </td>
                                ${
                                  isSalesPersonExistInInvoice === 1
                                    ? `<td style="border: 1px solid black; vertical-align: top;">
                                      <b>SP: </b> ${formDataFooter.user.username}
                                    </td>`
                                    : ''
                                }
                              </tr>`
                              : ''
                          }
                          ${
                            isShippingAddressExist === 1 &&
                            invoiceType === 'sales'
                              ? `<tr style="font-size: 12px;">
                              <td style="border: 1px solid black; line-height: 0.5; padding: 5px;" colspan="1">
                                <b>
                                  ${
                                    (invoiceType === 'estimate'
                                      ? 'Estimate No: '
                                      : 'Invoice No: ') + invoiceNo
                                  }
                                </b>
                              </td>
                              <td style="border: 1px solid black; line-height: 0.5; padding: 5px;" colspan="1">
                                <b>
                                  ${
                                    (invoiceType === 'estimate'
                                      ? 'Estimate Date: '
                                      : 'Date: ') +
                                    formatDate(formDataHeader.invoiceDate)
                                  }
                                </b>
                              </td>
                              <td style="border: 1px solid black; padding: 5px;" colspan="2">
                                <b>Remarks: </b>
                              </td>
                            </tr>
                            <tr style="font-size: 12px;">
                              <td style="border: 1px solid black; line-height: 0.5; padding: 5px;" colspan="1">
                                ${
                                  isTaxModeExistInInvoice === 1
                                    ? `<b>Tax Mode: ${
                                        formDataFooter.tax.value === 'IGST' &&
                                        tax_type === 'VAT'
                                          ? 'VAT'
                                          : formDataFooter.tax.value
                                      }</b>`
                                    : ''
                                }
                              </td>
                              <td style="border: 1px solid black; line-height: 0.5; padding: 5px;" colspan="1">
                                <b>Payment Mode: ${formDataFooter.mop.value}</b>
                              </td>
                              ${
                                isSalesPersonExistInInvoice === 1
                                  ? `<td style="border: 1px solid black; padding: 5px;" colspan="2">
                                  <b>SP: </b> ${formDataFooter.user.username}
                                </td>`
                                  : ''
                              }
                            </tr>
                            <tr style="font-size: 12px;">
                              <td style="border: 1px solid black; padding: 10px; width: 50%;" colspan="2">
                                <b>
                                  ${
                                    type === 'PURCHASE'
                                      ? 'Supplier '
                                      : 'Customer'
                                  }
                                  Details:
                                </b>
                                <br />
                                <b>${'Name: ' + formDataHeader.name}</b>
                                <br />
                                ${'Address: ' + formDataHeader.address}
                                <br />
                                ${'Ph: ' + formDataHeader.phoneNo}
                                <br />
                                ${
                                  tax_type === 'GST'
                                    ? 'GSTIN: ' + formDataHeader.gstin
                                    : 'TRN: ' + formDataHeader.gstin
                                }
                              </td>
                              <td style="border: 1px solid black; padding: 10px; vertical-align: top;" colspan="2">
                                <b>Shipping Address:</b>
                                <br />
                                <pre style="font-family: inherit;">${
                                  formDataFooter.shippingAddress
                                }</pre>
                              </td>
                            </tr>`
                              : ''
                          }
                      </thead>
                      <tbody>
                              <tr>
                                  <td colspan="4">
                                      <div style="margin: 0; padding: 0; border: none;">
                                          <table style="table-layout: fixed; width: 100%;">
                                              <thead style="font-size: 10px;">
                                                  <tr>
                                                      <th style="border: 1px solid black; border-left: none; border-top: none; width: ${
                                                        columnWidths.no
                                                      }mm; word-wrap: break-word; overflow-wrap: break-word;">No.</th>
                                                      <th style="border: 1px solid black; border-top: none; width: ${productCodeWidth}mm; word-wrap: break-word; overflow-wrap: break-word;">Product Description</th>
                                                      ${
                                                        isHsnCodeExistInInvoice ===
                                                        1
                                                          ? ` <th style="border: 1px solid black; border-top: none; width: ${columnWidths.hsn}mm; word-wrap: break-word; overflow-wrap: break-word;">HSN SAC</th>`
                                                          : ``
                                                      }
                                                      ${
                                                        isDescriptionExistInInvoice ===
                                                          1 &&
                                                        isDescriptionExistAsAColumn ===
                                                          1
                                                          ? `
                                                          <th style="border: 1px solid black; border-top: none; width: ${columnWidths.description}mm; word-wrap: break-word; overflow-wrap: break-word;">Desc</th>
                                                        `
                                                          : ``
                                                      }
                                                      ${
                                                        isMrpExistInInvoice ===
                                                        1
                                                          ? `
                                                          <th style="border: 1px solid black; border-top: none; width: ${columnWidths.mrp}mm; word-wrap: break-word; overflow-wrap: break-word;">MRP</th>
                                                        `
                                                          : ``
                                                      }
                                                      <th style="border: 1px solid black; border-top: none; width: ${
                                                        columnWidths.qty
                                                      }mm; word-wrap: break-word; overflow-wrap: break-word;">Qty</th>
                                                      ${
                                                        isUnitExist === 1
                                                          ? `
                                                          <th style="border: 1px solid black; border-top: none; width: ${columnWidths.unit}mm; word-wrap: break-word; overflow-wrap: break-word;">Unit</th>
                                                        `
                                                          : ``
                                                      }
                                                      <th style="border: 1px solid black; border-top: none; width: ${
                                                        columnWidths.rate
                                                      }mm; word-wrap: break-word; overflow-wrap: break-word;">Rate</th>
                                                      <th style="border: 1px solid black; border-top: none; width: ${
                                                        columnWidths.grossAmt
                                                      }mm; word-wrap: break-word; overflow-wrap: break-word;">Gross Amt</th>
                                                      ${
                                                        isGstExistInInvoice ===
                                                        1
                                                          ? `<th style="border: 1px solid black; border-top: none; width: ${
                                                              columnWidths.gstp
                                                            }mm; word-wrap: break-word; overflow-wrap: break-word;">${
                                                              tax_type === 'GST'
                                                                ? 'GST%'
                                                                : 'VAT%'
                                                            }</th>`
                                                          : ''
                                                      }
                                                      ${
                                                        isGstAmtExistInInvoice ===
                                                        1
                                                          ? `<th style="border: 1px solid black; border-top: none; width: ${
                                                              columnWidths.gstAmt
                                                            }mm; word-wrap: break-word; overflow-wrap: break-word;">${
                                                              tax_type === 'GST'
                                                                ? 'GST Amt'
                                                                : 'VAT Amt'
                                                            }</th>`
                                                          : ' '
                                                      }
                                                     
                                                      <th style="border: 1px solid black; border-right: none; border-top: none; width: ${
                                                        columnWidths.subTotal
                                                      }mm; word-wrap: break-word; overflow-wrap: break-word;">Sub Total</th>
                                                  </tr>
                                              </thead>
                                              <tbody style="font-size: 12px; line-height: 1;">
                                                  ${generateHTMLTableRows(
                                                    items,
                                                    displayItems,
                                                    itemsCount,
                                                    rowsWithPageBreaks,
                                                    type,
                                                  )}
                                                  ${generateHTMLTotalRow(
                                                    totalQty,
                                                    totalGrossAmt,
                                                    totalGst,
                                                    totalAmt,
                                                  )}
                                              </tbody>
                                          </table>
                                          <div style="page-break-inside: avoid;">
                                          ${
                                            isHsnCodeExistInInvoice === 1
                                              ? `<table class="responsive-table" style="width: 100%; line-height:0.5; margin: 0; padding: 0; border: none;">
                                                  <tbody>
                                                      <tr>
                                                      <td rowSpan=${rowSpanWithDiscountExpense} style="width: 60%; border: 1px solid black; border-left: none;">
                                                          ${
                                                            formDataFooter.tax
                                                              .value !==
                                                            'Non Tax'
                                                              ? `
                                                          <table class="responsive-table" style="font-size: 8px; line-height: 0.5; margin: 0; padding: 0; border-collapse: collapse;">
                                                              <thead>
                                                              <tr>
                                                                  <th style="border: 1px solid black;">HSN SAC</th>
                                                                  <th style="border: 1px solid black;">Taxable Value</th>
                                                                  ${
                                                                    formDataFooter
                                                                      .tax
                                                                      .value ===
                                                                    'GST'
                                                                      ? `
                                                                  <th style="border: 1px solid black;" class="text-center">CGST %</th>
                                                                  <th style="border: 1px solid black;" class="text-center">CGST Amt</th>
                                                                  <th style="border: 1px solid black;" class="text-center">SGST %</th>
                                                                  <th style="border: 1px solid black;" class="text-center">SGST Amt</th>`
                                                                      : ''
                                                                  }
                                                                  ${
                                                                    formDataFooter
                                                                      .tax
                                                                      .value ===
                                                                    'IGST'
                                                                      ? `
                                                                  <th style="border: 1px solid black;" class="text-center">${
                                                                    tax_type ===
                                                                    'GST'
                                                                      ? 'IGST %'
                                                                      : 'VAT %'
                                                                  }</th>
                                                                  <th style="border: 1px solid black;" class="text-center">${
                                                                    tax_type ===
                                                                    'GST'
                                                                      ? 'IGST Amt'
                                                                      : 'VAT Amt'
                                                                  }</th>`
                                                                      : ''
                                                                  }
                                                                  <th style="border: 1px solid black;">Total Tax Amt</th>
                                                              </tr>
                                                              </thead>
                                                              <tbody>
                                                              ${generateFooterTableRows(
                                                                hsnItemsCount,
                                                                sumMap,
                                                                formDataFooter,
                                                              )}
                                                              </tbody>
                                                              <tfoot>
                                                              ${generateFooterTableTotal(
                                                                formDataFooter,
                                                                totalTaxable,
                                                                totalCgst,
                                                                totalSgst,
                                                                totalIgst,
                                                              )}
                                                              </tfoot>
                                                          </table>`
                                                              : ''
                                                          }
                                                      </td>
                                                      ${
                                                        isDiscountExistInInvoice ===
                                                        1
                                                          ? `<td
                                                            style="border: 1px solid black; border-right: none;"
                                                            class="text-end">
                                                            ${
                                                              'Discount Amt: ' +
                                                              formDataFooter.discountOnTotal
                                                            }
                                                          </td>`
                                                          : ''
                                                      }
                                                          ${
                                                            isDiscountExistInInvoice ===
                                                              0 &&
                                                            isExpenseExistInInvoice ===
                                                              1
                                                              ? `<td
                                                              style="border: 1px solid black; border-right: none;"
                                                              class="text-end">
                                                              ${
                                                                expenseAliasInInvoice +
                                                                ': ' +
                                                                formDataFooter.otherExpenses
                                                              }
                                                            </td>`
                                                              : ''
                                                          }
                                                          ${
                                                            isDiscountExistInInvoice ===
                                                              0 &&
                                                            isExpenseExistInInvoice ===
                                                              0
                                                              ? `<td
                                                                style="border: 1px solid black; border-right: none;"
                                                                class="text-end">
                                                                ${
                                                                  'Round Off: ' +
                                                                  Number(
                                                                    roundOff,
                                                                  ).toFixed(2)
                                                                }
                                                              </td>`
                                                              : ''
                                                          }
                                                      </tr>
                                                      ${
                                                        isDiscountExistInInvoice ===
                                                          1 &&
                                                        isExpenseExistInInvoice ===
                                                          1
                                                          ? `<tr>
                                                          <td
                                                            style="border: 1px solid black; border-right: none;"
                                                            class="text-end">
                                                            ${
                                                              expenseAliasInInvoice +
                                                              ': ' +
                                                              formDataFooter.otherExpenses
                                                            }
                                                          </td>
                                                        </tr>`
                                                          : ''
                                                      }
                                                      ${
                                                        isDiscountExistInInvoice ===
                                                          1 ||
                                                        isExpenseExistInInvoice ===
                                                          1
                                                          ? `<tr>
                                                            <td
                                                              style="border: 1px solid black; border-right: none;"
                                                              class="text-end">
                                                              ${
                                                                'Round Off: ' +
                                                                Number(
                                                                  roundOff,
                                                                ).toFixed(2)
                                                              }
                                                            </td>
                                                          </tr>`
                                                          : ''
                                                      }
                                                      <tr>
                                                      <th style="border: 1px solid black; border-right: none; font-size: 20px; text-align: end;">
                                                          ${
                                                            'Bill Amount: ' +
                                                            Number(
                                                              billAmount,
                                                            ).toFixed(2)
                                                          }
                                                      </th>
                                                      </tr>
                                                  </tbody>
                                              </table>`
                                              : ''
                                          }
                                              <b style="display: flex; justify-content: flex-end;text-align: right;">
                                              ${
                                                isHsnCodeExistInInvoice ===
                                                0 ?
                                                  'Round Off: ' +
                                                  Number(roundOff).toFixed(2) +
                                                  '<br />' +
                                                  'Bill Amount: ' +
                                                  Number(billAmount).toFixed(2) +
                                                  '<br />'
                                                : ''
                                              }
                                              </b>
                                              <div style="line-height: 1;">
                                                ${
                                                  isNarrationExistInInvoice ===
                                                  1
                                                    ? `<span style="font-size:10px;">
                                                        <b>Narration: </b>
                                                        ${formDataFooter.narration}
                                                        <br />
                                                      </span>`
                                                    : ''
                                                }
                                                <b>
                                                    In Words: ${numberToWordsWithDecimal(
                                                      billAmount,
                                                    )} Only
                                                    <br />
                                                    <u>Declaration:</u>
                                                </b>
                                              </div>
                                              <span style="line-height: 0.5; display: block; height: ${declaration_height}px; font-family: inherit;">
                                                  <pre style="line-height: 0.9; overflow: hidden; margin: 0; font-family: inherit; font-size: 12px;">${
                                                    profileData.declaration
                                                  }
                                                  </pre>
                                              </span>
                                              <table class="responsive-table"
                                                  style="
                                                  line-height: 0.5;
                                                  margin: 0;
                                                  padding: 0;
                                                  border-collapse: separate;
                                                  border-top: 1px solid black;
                                                  "
                                              >
                                                  <tbody style="font-size: 12px;">
                                                  <tr>
                                                      <td style="border: none;">
                                                          ${
                                                            addEstimateAddress ===
                                                            'not allow'
                                                              ? `<br />`
                                                              : `<span style="display: inline-block;width: 80px;">A/C Name</span>:${profileData.accountName}`
                                                          }
                                                      </td>
                                                      <td
                                                      rowspan="6"
                                                      style="border: none; text-align: center;"
                                                      >
                                                      ${
                                                        imageQRExists
                                                          ? `
                                                              <img
                                                                  src="${API_BASE_URL}/images/${company_name}/${profileData.qr_image_name}"
                                                                  width="60"
                                                                  height="60"
                                                                  alt=""
                                                              />
                                                              `
                                                          : ''
                                                      }
                                                      </td>
                                                      <th
                                                      rowspan="3"
                                                      style="border: none; text-align: end;"
                                                      >
                                                      ${
                                                        addEstimateAddress ===
                                                        'not allow'
                                                          ? `<br />`
                                                          : 'For ' +
                                                            profileData.company_full_name
                                                      }
                                                      </th>
                                                  </tr>
                                                  <tr>
                                                      <td style="border: none;">
                                                          ${
                                                            addEstimateAddress ===
                                                            'not allow'
                                                              ? `<br />`
                                                              : `<span style="display: inline-block;width: 80px;">A/C No</span>:${profileData.account_no}`
                                                          }
                                                      </td>
                                                  </tr>
                                                  <tr>
                                                      <td style="border: none;">
                                                          ${
                                                            addEstimateAddress ===
                                                            'not allow'
                                                              ? `<br />`
                                                              : `<span style="display: inline-block;width: 80px;">IFSC Code</span>:${profileData.ifsc_code}`
                                                          }
                                                      </td>
                                                  </tr>
                                                  <tr>
                                                      <td style="border: none;">
                                                          ${
                                                            addEstimateAddress ===
                                                            'not allow'
                                                              ? `<br />`
                                                              : `<span style="display: inline-block;width: 80px;">Bank Name</span>:${profileData.bank_name}`
                                                          }
                                                      </td>
                                                  </tr>
                                                  <tr>
                                                      <td style="border: none;">
                                                          ${
                                                            addEstimateAddress ===
                                                            'not allow'
                                                              ? `<br />`
                                                              : `<span style="display: inline-block;width: 80px;">Branch</span>:${profileData.branch}`
                                                          }
                                                      </td>
                                                  </tr>
                                                  <tr>
                                                      <td style="border: none;">
                                                          ${
                                                            addEstimateAddress ===
                                                            'not allow'
                                                              ? `<br />`
                                                              : `<span style="display: inline-block;width: 80px;">PAN No</span>:${profileData.panNo}`
                                                          }
                                                      </td>
                                                      <th style="border: none; text-align: end;">
                                                      ${
                                                        invoiceType ===
                                                          'sales' ||
                                                        invoiceType ===
                                                          'estimate'
                                                          ? `
                                                        <div style="position: relative;">
                                                          ${
                                                            imageCompanySealExists &&
                                                            (invoiceType ===
                                                            'sales'
                                                              ? isCompanySealExistInSales
                                                              : isCompanySealExistInEstimate) ===
                                                              1
                                                              ? `
                                                            <img
                                                              src="${API_BASE_URL}/images/${company_name}/${profileData.companySealImageName}"
                                                              width="60"
                                                              height="60"
                                                              alt="Company Seal"
                                                              style="
                                                                position: absolute;
                                                                bottom: 0;
                                                                right: 60px;
                                                                image-rendering: crisp-edges;
                                                                object-fit: contain;
                                                                filter: contrast(1.1) brightness(1.1);
                                                              "
                                                            />
                                                          `
                                                              : ''
                                                          }
                                                          ${
                                                            imageAuthorisedSignatureExists &&
                                                            (invoiceType ===
                                                            'sales'
                                                              ? isSignatureImageExistInSales
                                                              : isSignatureImageExistInEstimate) ===
                                                              1
                                                              ? `
                                                            <img
                                                              src="${API_BASE_URL}/images/${company_name}/${profileData.authorisedSignatureImageName}"
                                                              width="80"
                                                              height="60"
                                                              alt="Authorized Signature"
                                                              style="
                                                                position: absolute;
                                                                bottom: 0;
                                                                right: 60px;
                                                                z-index: 1;
                                                                image-rendering: crisp-edges;
                                                                object-fit: contain;
                                                                filter: contrast(1.1) brightness(1.1);
                                                              "
                                                            />
                                                          `
                                                              : ''
                                                          }
                                                        </div>
                                                      `
                                                          : ''
                                                      }
                                                      Authorized Signature
                                                      </th>
                                                  </tr>
                                                  </tbody>
                                              </table>
                                          </div>
                                      </div>
                                  </td>
                              </tr>
                      </tbody>
                  </table>
              </div>
`
            : ''
        }
        ${
          formDataFooter.invoice_print_type.value === 'A4 Landscape'
            ? `
              <style>
                @page { 
                  size: A4 landscape; 
                  margin: 0; 
                }
                @media print {
                  @page {
                    size: A4 landscape;
                    margin: 0;
                  }
                  html, body {
                    width: 297mm;
                    height: 210mm;
                    margin: 0;
                    margin-left: -5px;
                    padding: 0;
                  }
                  body {
                    -webkit-print-color-adjust: exact;
                    print-color-adjust: exact;
                  }
                  .page-break-header {
                    page-break-before: never;
                  }
                  .page-break-header td {
                    padding-top: 0px !important;
                  }
                  .last-row-before-break td {
                    border-bottom: 2px solid black !important;
                  }
                }
              </style>
              
              <!-- TAX INVOICE Title -->
              <div style="
                font-size: 14px; 
                font-weight: 900; 
                text-align: center;
                margin-bottom: 10px;
                letter-spacing: 2px;
                font-family: 'BookmanOldStyle';
              ">
                TAX INVOICE
              </div>
              
              <div style="margin-right:10px; margin-left:30px; margin-top:-4px; margin-bottom:0px;">
                  <table style="
                    width: 100%; 
                    font-family: Arial, sans-serif; 
                    border: 0px solid black; 
                    border-collapse: collapse; 
                    font-weight: 900; 
                    table-layout: auto;
                  ">
                      <thead>
                          <!-- Header Section -->
                          <tr style="border: 1px solid black;">
                              <td colspan="${landscapeColumnCount}" style="border: 1px; padding: 6px; text-align: center;">
                                  <div style="
                                    display: flex; 
                                    justify-content: space-between; 
                                    align-items: flex-start; 
                                    margin-bottom: 5px;
                                  ">
                                    <!-- Left Section - Logo -->
                                    <div style="width: 20%; text-align: left;">
                                      ${
                                        imageLogoExists
                                          ? `<img
                                              src="${API_BASE_URL}/images/${company_name}/${profileData.image_name}"
                                              width="120"
                                              height="85"
                                              alt="Company Logo"
                                              style="margin-bottom: 3px;"
                                            />`
                                          : ''
                                      }
                                    </div>

                                    <!-- Center Section - Company Details -->
                                    <div style="width: 50%; text-align: center;">
                                      ${
                                        addEstimateAddress === 'not allow'
                                          ? `<br /><br />
                                            <b style="font-size: 24px;">ESTIMATE</b>
                                            <br /><br /><br /><br />`
                                          : `<div style="font-size: 24px; font-weight: 900; margin-bottom: 3px; letter-spacing: 1px;">
                                              ${profileData.company_full_name && profileData.company_full_name.toUpperCase()}
                                            </div>
                                            ${profileData.company_subtitle ? `<div style="font-size: 11px; margin-bottom: 3px; font-weight: 900;">
                                              (${profileData.company_subtitle})
                                            </div>` : ''}
                                            <div style="font-size: 13px; margin-bottom: 2px; font-weight: 900;">
                                              ${profileData.address}
                                            </div>
                                            <div style="font-size: 13px; margin-bottom: 2px; font-weight: 900;">
                                              ${profileData.city}${profileData.city && profileData.state ? ", " : ""}${profileData.state}${profileData.pincode ? " - " + profileData.pincode : ""}
                                            </div>
                                            <div style="font-size: 11px; margin-bottom: 2px; font-weight: 900;">
                                              PHONE : ${profileData.phone_no}
                                            </div>
                                            ${
                                              isTaxModeExistInInvoice === 1
                                                ? `<div style="font-size: 12px; font-weight: 900; margin-top: 3px;">
                                                    GSTIN : ${profileData.gstin}
                                                  </div>`
                                                : ''
                                            }`
                                      }
                                    </div>

                                    <!-- Right Section - Checkboxes -->
                                    <div style="
                                      width: 15%; 
                                      text-align: left; 
                                      font-size: 10px; 
                                      border: 1px solid black; 
                                      padding: 6px; 
                                      margin-top: 4px; 
                                      font-weight: 900;
                                    ">
                                      <div style="margin-bottom: 4px;">
                                        ☐ <b>Original for Receipient</b>
                                      </div>
                                      <div style="margin-bottom: 4px;">
                                        ☐ <b>Duplicate for Transport</b>
                                      </div>
                                      <div>
                                        ☐ <b>Triplicate for Supplie</b>
                                      </div>
                                    </div>
                                  </div>
                              </td>
                          </tr>

                          <!-- Invoice Details Rows -->
                          <tr style="font-size: 11px; font-weight: 900;">
                            <td colspan="${Math.ceil(landscapeColumnCount / 3)}" style="border: 1px solid black; padding: 5px; text-align: left;">
                              <b>${(invoiceType === "estimate" ? "Estimate No: " : "Invoice No: ") + (formDataHeader.customInvoiceNo || invoiceNo)}</b>
                            </td>
                            <td colspan="${Math.ceil(landscapeColumnCount / 3)}" style="border: 1px solid black; padding: 5px; text-align: left;">
                              <b>Vehicle No : ${formDataFooter.vehicleNo || "0"}</b>
                            </td>
                            <td colspan="${landscapeColumnCount - 2 * Math.ceil(landscapeColumnCount / 3)}" style="border: 1px solid black; padding: 5px; text-align: left;">
                              ${isNarrationExistInInvoice === 1 ? `<b>Narration : ${formDataFooter.narration || ""}</b>` : ''}
                            </td>
                          </tr>
                          
                          <tr style="font-size: 11px; font-weight: 900;">
                            <td colspan="${Math.ceil(landscapeColumnCount / 3)}" style="border: 1px solid black; padding: 5px; text-align: left;">
                              <b>${(invoiceType === "estimate" ? "Estimate Date: " : "Invoice Date: ") + formatDate(formDataHeader.invoiceDate)}</b>
                            </td>
                            <td colspan="${Math.ceil(landscapeColumnCount / 3)}" style="border: 1px solid black; padding: 5px; text-align: left;">
                              <b>Payment Mode : ${formDataFooter.mop.value}</b>
                            </td>
                            <td colspan="${landscapeColumnCount - 2 * Math.ceil(landscapeColumnCount / 3)}" style="border: 1px solid black; padding: 5px; text-align: left;">
                              ${isRemarksExistInInvoice === 1 ? `<b>Remarks : ${formDataFooter.remarks || ""}</b>` : ''}
                            </td>
                          </tr>

                          <!-- Customer Details Row -->
                          <tr style="font-size: 11px; font-weight: 900;">
                            <td colspan="${Math.ceil(landscapeColumnCount / 2)}" style="border: 1px solid black; padding: 6px; vertical-align: top;">
                              <div style="font-weight: 900; margin-bottom: 5px; text-decoration: underline; text-underline-offset: 4px;">
                                Details of Receiver | Billed to:
                              </div>
                              <div style="margin-top: 4px; font-size: 12px; font-weight: 900; margin-left: 15px;">
                                ${formDataHeader.name}
                              </div>
                              <div style="margin-top: 3px; font-weight: 900; margin-left: 15px;">
                                ${formDataHeader.address}
                              </div>
                              <div style="margin-top: 2px; font-weight: 900; margin-left: 15px;">
                                ${formDataHeader.city}${formDataHeader.city && formDataHeader.state ? ", " : ""}${formDataHeader.state}
                              </div>
                              <div style="margin-top: 3px; font-weight: 900; margin-left: 15px;">
                                ${tax_type === "GST" ? "GSTIN: " : "TRN: "}${formDataHeader.gstin} &nbsp;&nbsp;&nbsp; Phone No : ${formDataHeader.phoneNo}
                              </div>
                            </td>
                            <td colspan="${landscapeColumnCount - Math.ceil(landscapeColumnCount / 2)}" style="border: 1px solid black; padding: 6px; vertical-align: top;">
                              <div style="font-weight: 900; margin-bottom: 5px; text-decoration: underline; text-underline-offset: 4px;">
                                Details of Consignee | Shipped to:
                              </div>
                              <div style="margin-top: 4px; font-size: 12px; font-weight: 900; margin-left: 15px;">
                                ${formDataFooter.shippingAddress || formDataHeader.name}
                              </div>
                            </td>
                          </tr>

                          <!-- Table Headers -->
                          <tr style="font-size: 10px; font-weight: 900; text-align: center; background-color: white;">
                            <th style="width: 15mm; border: 1px solid black; padding: 4px 2px; font-weight: 900;">No.</th>
                            <th style="width: 80mm; border: 1px solid black; padding: 4px 12px; font-weight: 900;">Description</th>
                            ${
                              isHsnCodeExistInInvoice === 1
                                ? `<th style="width: 20mm; border: 1px solid black; padding: 4px 2px; font-weight: 900;">${
                                    tax_type === 'GST' ? 'HSN SAC' : 'Hanscode'
                                  }</th>`
                                : ''
                            }
                            ${
                              isDescriptionExistInInvoice === 1 && isDescriptionExistAsAColumn === 1
                                ? `<th style="width: 25mm; border: 1px solid black; padding: 4px 2px; font-weight: 900; text-align: center;">Desc</th>`
                                : ''
                            }
                            ${
                              isMrpExistInInvoice === 1
                                ? `<th style="width: 18mm; border: 1px solid black; padding: 4px 2px; font-weight: 900; text-align: center;">MRP</th>`
                                : ''
                            }
                            <th style="width: 15mm; border: 1px solid black; padding: 4px 2px; font-weight: 900; text-align: center;">Qty</th>
                            ${
                              isUnitExist === 1
                                ? `<th style="width: 15mm; border: 1px solid black; padding: 4px 2px; font-weight: 900; text-align: center;">Unit</th>`
                                : ''
                            }
                            <th style="width: 18mm; border: 1px solid black; padding: 4px 2px; font-weight: 900; text-align: center;">Rate</th>
                            <th style="width: 20mm; border: 1px solid black; padding: 4px 2px; font-weight: 900; text-align: center;">Gross Amt</th>
                            ${
                              isDiscountExistInInvoice === 1
                                ? `<th style="width: 18mm; border: 1px solid black; padding: 4px 2px; font-weight: 900; text-align: center;">Disc Amt</th>`
                                : ''
                            }
                            ${
                              isGstExistInInvoice === 1 && formDataFooter.tax.value === 'GST'
                                ? `<th style="width: 15mm; border: 1px solid black; padding: 4px 2px; font-weight: 900; text-align: center;">CGST %</th>`
                                : ''
                            }
                            ${
                              isGstAmtExistInInvoice === 1 && formDataFooter.tax.value === 'GST'
                                ? `<th style="width: 18mm; border: 1px solid black; padding: 4px 2px; font-weight: 900; text-align: center;">CGST Amt</th>`
                                : ''
                            }
                            ${
                              isGstExistInInvoice === 1 && formDataFooter.tax.value === 'GST'
                                ? `<th style="width: 15mm; border: 1px solid black; padding: 4px 2px; font-weight: 900; text-align: center;">SGST %</th>`
                                : ''
                            }
                            ${
                              isGstAmtExistInInvoice === 1 && formDataFooter.tax.value === 'GST'
                                ? `<th style="width: 18mm; border: 1px solid black; padding: 4px 2px; font-weight: 900; text-align: center;">SGST Amt</th>`
                                : ''
                            }
                            ${
                              isGstExistInInvoice === 1 && formDataFooter.tax.value === 'IGST'
                                ? `<th style="width: 15mm; border: 1px solid black; padding: 4px 2px; font-weight: 900; text-align: center;">${
                                    tax_type === 'GST' ? 'IGST %' : 'VAT %'
                                  }</th>`
                                : ''
                            }
                            ${
                              isGstAmtExistInInvoice === 1 && formDataFooter.tax.value === 'IGST'
                                ? `<th style="width: 18mm; border: 1px solid black; padding: 4px 2px; font-weight: 900; text-align: center;">${
                                    tax_type === 'GST' ? 'IGST Amt' : 'VAT Amt'
                                  }</th>`
                                : ''
                            }
                            <th style="width: 20mm; border: 1px solid black; padding: 4px 2px; font-weight: 900; text-align: center;">Total</th>
                          </tr>
                      </thead>
                      <tbody style="font-size: 10px; font-weight: 900;">
                        ${(() => {
                          const rows = [];
                          const itemsPerPage = a4_item_count;
                          const totalPages = Math.ceil(displayItems.length / itemsPerPage);
                          
                          // Render items with pagination
                          for (let index = 0; index < displayItems.length; index++) {
                            const item = displayItems[index];
                            const currentPage = Math.floor(index / itemsPerPage) + 1;
                            const isLastItemOnPage = (index + 1) % itemsPerPage === 0;
                            const isLastItem = index === displayItems.length - 1;
                            
                            // Add page break before new page (except first page)
                            if (index > 0 && index % itemsPerPage === 0) {
                              rows.push(`</tbody></table></div><div style="page-break-before: always;"></div>`);
                              
                              // Add complete header for new page
                              rows.push(`
                                <div style="font-size: 14px; font-weight: 900; text-align: center; margin-bottom: 10px; letter-spacing: 2px; font-family: 'BookmanOldStyle';">
                                  TAX INVOICE
                                </div>
                                 <div style="margin-right:10px; margin-left:30px; margin-top:-3px; margin-bottom:0px;">
                                  <table style="width: 100%; font-family: Arial, sans-serif; border: 0px solid black; border-collapse: collapse; font-weight: 900; table-layout: auto;">
                                    <thead>
                                      <!-- Header Section -->
                                      <tr style="border: 1px solid black;">
                                        <td colspan="${landscapeColumnCount}" style="border: 1px; padding: 6px; text-align: center;">
                                          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 5px;">
                                            <!-- Left Section - Logo -->
                                            <div style="width: 20%; text-align: left;">
                                              ${imageLogoExists ? `<img src="${API_BASE_URL}/images/${company_name}/${profileData.image_name}" width="120" height="85" alt="Company Logo" style="margin-bottom: 3px;" />` : ''}
                                            </div>
                                            
                                            <!-- Center Section - Company Details -->
                                            <div style="width: 50%; text-align: center;">
                                              ${addEstimateAddress === 'not allow' ? `
                                                <div style="font-size: 18px; font-weight: 900; margin-bottom: 8px;">
                                                  ESTIMATE
                                                </div>
                                              ` : `
                                                <div style="font-size: 18px; font-weight: 900; margin-bottom: 4px;">
                                                  ${profileData.company_full_name}
                                                </div>
                                                <div style="font-size: 11px; font-weight: 900; margin-bottom: 2px;">
                                                  ${profileData.address}
                                                </div>
                                                <div style="font-size: 11px; font-weight: 900; margin-bottom: 2px;">
                                                  ${profileData.city}, ${profileData.state} - ${profileData.pincode}
                                                </div>
                                                <div style="font-size: 11px; font-weight: 900; margin-bottom: 2px;">
                                                  Ph: ${profileData.phone_no}
                                                </div>
                                                <div style="font-size: 11px; font-weight: 900; margin-bottom: 2px;">
                                                  Email: ${profileData.email}
                                                </div>
                                                ${isTaxModeExistInInvoice === 1 ? `
                                                  <div style="font-size: 11px; font-weight: 900;">
                                                    ${tax_type === 'GST' ? 'GSTIN: ' : 'TRN: '}${profileData.gstin}
                                                  </div>
                                                ` : ''}
                                                ${isFssiExistInInvoice === 1 ? `
                                                  <div style="font-size: 11px; font-weight: 900;">
                                                    FSSI: ${profileData.fssi}
                                                  </div>
                                                ` : ''}
                                              `}
                                            </div>
                                            
                                            <!-- Right Section - Checkboxes -->
                                            <div style="width: 15%; text-align: left; font-size: 10px; border: 1px solid black; padding: 6px; margin-top: 4px; font-weight: 900;">
                                              <div style="margin-bottom: 3px;">
                                                ☐ <b>Original for Recipient</b>
                                              </div>
                                              <div style="margin-bottom: 3px;">
                                                ☐ <b>Duplicate for Transport</b>
                                              </div>
                                              <div>
                                                ☐ <b>Triplicate for Supplier</b>
                                              </div>
                                            </div>
                                          </div>
                                        </td>
                                      </tr>
                                      
                                      <!-- Table Headers for Items -->
                                      <tr style="font-size: 10px; font-weight: 900; background-color: #f0f0f0;">
                                        <th style="width: 15mm; border: 1px solid black; padding: 4px 2px; font-weight: 900; text-align: center;">No.</th>
                                        <th style="width: 80mm; border: 1px solid black; padding: 4px 2px; font-weight: 900; text-align: center;">Description</th>
                                        ${isHsnCodeExistInInvoice === 1 ? `<th style="width: 20mm; border: 1px solid black; padding: 4px 2px; font-weight: 900; text-align: center;">HSN/SAC</th>` : ''}
                                        ${isDescriptionExistInInvoice === 1 && isDescriptionExistAsAColumn === 1 ? `<th style="width: 25mm; border: 1px solid black; padding: 4px 2px; font-weight: 900; text-align: center;">Description</th>` : ''}
                                        ${isMrpExistInInvoice === 1 ? `<th style="width: 18mm; border: 1px solid black; padding: 4px 2px; font-weight: 900; text-align: center;">MRP</th>` : ''}
                                        <th style="width: 15mm; border: 1px solid black; padding: 4px 2px; font-weight: 900; text-align: center;">Qty</th>
                                        ${isUnitExist === 1 ? `<th style="width: 15mm; border: 1px solid black; padding: 4px 2px; font-weight: 900; text-align: center;">Unit</th>` : ''}
                                        <th style="width: 18mm; border: 1px solid black; padding: 4px 2px; font-weight: 900; text-align: center;">Rate</th>
                                        <th style="width: 20mm; border: 1px solid black; padding: 4px 2px; font-weight: 900; text-align: center;">Gross Amt</th>
                                        ${isDiscountExistInInvoice === 1 ? `<th style="width: 18mm; border: 1px solid black; padding: 4px 2px; font-weight: 900; text-align: center;">Disc Amt</th>` : ''}
                                        ${isGstExistInInvoice === 1 && formDataFooter.tax.value === 'GST' ? `<th style="width: 15mm; border: 1px solid black; padding: 4px 2px; font-weight: 900; text-align: center;">CGST %</th>` : ''}
                                        ${isGstAmtExistInInvoice === 1 && formDataFooter.tax.value === 'GST' ? `<th style="width: 18mm; border: 1px solid black; padding: 4px 2px; font-weight: 900; text-align: center;">CGST Amt</th>` : ''}
                                        ${isGstExistInInvoice === 1 && formDataFooter.tax.value === 'GST' ? `<th style="width: 15mm; border: 1px solid black; padding: 4px 2px; font-weight: 900; text-align: center;">SGST %</th>` : ''}
                                        ${isGstAmtExistInInvoice === 1 && formDataFooter.tax.value === 'GST' ? `<th style="width: 18mm; border: 1px solid black; padding: 4px 2px; font-weight: 900; text-align: center;">SGST Amt</th>` : ''}
                                        ${isGstExistInInvoice === 1 && formDataFooter.tax.value === 'IGST' ? `<th style="width: 15mm; border: 1px solid black; padding: 4px 2px; font-weight: 900; text-align: center;">${tax_type === 'GST' ? 'IGST %' : 'VAT %'}</th>` : ''}
                                        ${isGstAmtExistInInvoice === 1 && formDataFooter.tax.value === 'IGST' ? `<th style="width: 18mm; border: 1px solid black; padding: 4px 2px; font-weight: 900; text-align: center;">${tax_type === 'GST' ? 'IGST Amt' : 'VAT Amt'}</th>` : ''}
                                        <th style="width: 20mm; border: 1px solid black; padding: 4px 2px; font-weight: 900; text-align: center;">Total</th>
                                      </tr>
                                    </thead>
                                    <tbody style="font-size: 10px; font-weight: 900;">
                              `);
                            }
                            
                            rows.push(`
                              <tr class="row-item ${isLastItemOnPage && currentPage < totalPages ? 'last-row-before-break' : ''}">
                                <!-- No -->
                                <td style="width: 15mm; border: 1px solid black; border-top: none; border-bottom: none; padding: 4px 2px; text-align: center; font-weight: 900;">
                                  ${index + 1}
                                </td>
                                
                                <!-- Description -->
                                <td style="width: 80mm; border: 1px solid black; border-top: none; border-bottom: none; padding: 4px 12px; text-align: left; font-weight: 900;">
                                  ${item.productName}
                                  ${isDescriptionExistInInvoice === 1 && isDescriptionExistAsAColumn === 0 ? `<br/>${item.description}` : ''}
                                  ${isBarcodeExistInInvoice === 1 && isBarcodeSummarizeItemAllowInInvoice === 0 ? ` ${item.barcode}` : ''}
                                  ${isBarcodeExistInInvoice === 1 && isBarcodeSummarizeItemAllowInInvoice === 1 ? item.barcodes.map(barcode => `<br/>${barcode}`).join('') : ''}
                                  ${isRemarksExistInInvoice === 1 ? `<br/>${item.remarks}` : ''}
                                </td>
                                
                                ${isHsnCodeExistInInvoice === 1 ? `
                                <!-- Hanscode -->
                                <td style="width: 20mm; border: 1px solid black; border-top: none; border-bottom: none; padding: 4px 2px; text-align: center; font-weight: 900;">
                                  ${item.hsnCode || ''}
                                </td>` : ''}
                                
                                ${isDescriptionExistInInvoice === 1 && isDescriptionExistAsAColumn === 1 ? `
                                <!-- Desc Column -->
                                <td style="width: 25mm; border: 1px solid black; border-top: none; border-bottom: none; padding: 4px 2px; text-align: center; font-weight: 900;">
                                  ${item.description}
                                </td>` : ''}
                                
                                ${isMrpExistInInvoice === 1 ? `
                                <!-- MRP -->
                                <td style="width: 18mm; border: 1px solid black; border-top: none; border-bottom: none; padding: 4px 2px; text-align: center; font-weight: 900;">
                                  ${item.newMrp}
                                </td>` : ''}
                                
                                <!-- Qty -->
                                <td style="width: 15mm; border: 1px solid black; border-top: none; border-bottom: none; padding: 4px 2px; text-align: center; font-weight: 900;">
                                  ${Number(item.qty).toFixed(2)}
                                </td>
                                
                                ${isUnitExist === 1 ? `
                                <!-- Unit -->
                                <td style="width: 15mm; border: 1px solid black; border-top: none; border-bottom: none; padding: 4px 2px; text-align: center; font-weight: 900;">
                                  ${item.selectedUnit}
                                </td>` : ''}
                                
                                <!-- Rate -->
                                <td style="width: 18mm; border: 1px solid black; border-top: none; border-bottom: none; padding: 4px 2px; text-align: center; font-weight: 900;">
                                  ${type === 'PURCHASE' ? Number(item.newPurchasePrice).toFixed(2) : Number(item.newSalesPrice).toFixed(2)}
                                </td>
                                
                                <!-- Gross Amt -->
                                <td style="width: 20mm; border: 1px solid black; border-top: none; border-bottom: none; padding: 4px 2px; text-align: center; font-weight: 900;">
                                  ${Number(item.grossAmt).toFixed(2)}
                                </td>
                                
                                ${isDiscountExistInInvoice === 1 ? `
                                <!-- Disc Amt -->
                                <td style="width: 18mm; border: 1px solid black; border-top: none; border-bottom: none; padding: 4px 2px; text-align: center; font-weight: 900;">
                                  ${Number(item.discount || 0).toFixed(2)}
                                </td>` : ''}
                                
                                ${isGstExistInInvoice === 1 && formDataFooter.tax.value === 'GST' ? `
                                <!-- CGST % -->
                                <td style="width: 15mm; border: 1px solid black; border-top: none; border-bottom: none; padding: 4px 2px; text-align: center; font-weight: 900;">
                                  ${Number(item.cgstP || 0).toFixed(2)}
                                </td>` : ''}
                                
                                ${isGstAmtExistInInvoice === 1 && formDataFooter.tax.value === 'GST' ? `
                                <!-- CGST Amt -->
                                <td style="width: 18mm; border: 1px solid black; border-top: none; border-bottom: none; padding: 4px 2px; text-align: center; font-weight: 900;">
                                  ${Number(item.cgst || 0).toFixed(2)}
                                </td>` : ''}
                                
                                ${isGstExistInInvoice === 1 && formDataFooter.tax.value === 'GST' ? `
                                <!-- SGST % -->
                                <td style="width: 15mm; border: 1px solid black; border-top: none; border-bottom: none; padding: 4px 2px; text-align: center; font-weight: 900;">
                                  ${Number(item.sgstP || 0).toFixed(2)}
                                </td>` : ''}
                                
                                ${isGstAmtExistInInvoice === 1 && formDataFooter.tax.value === 'GST' ? `
                                <!-- SGST Amt -->
                                <td style="width: 18mm; border: 1px solid black; border-top: none; border-bottom: none; padding: 4px 2px; text-align: center; font-weight: 900;">
                                  ${Number(item.sgst || 0).toFixed(2)}
                                </td>` : ''}
                                
                                ${isGstExistInInvoice === 1 && formDataFooter.tax.value === 'IGST' ? `
                                <!-- IGST % -->
                                <td style="width: 15mm; border: 1px solid black; border-top: none; border-bottom: none; padding: 4px 2px; text-align: center; font-weight: 900;">
                                  ${Number(item.igstP || 0).toFixed(2)}
                                </td>` : ''}
                                
                                ${isGstAmtExistInInvoice === 1 && formDataFooter.tax.value === 'IGST' ? `
                                <!-- IGST Amt -->
                                <td style="width: 18mm; border: 1px solid black; border-top: none; border-bottom: none; padding: 4px 2px; text-align: center; font-weight: 900;">
                                  ${Number(item.igst || 0).toFixed(2)}
                                </td>` : ''}
                                
                                <!-- Total -->
                                <td style="width: 20mm; border: 1px solid black; border-top: none; border-bottom: none; padding: 4px 2px; text-align: center; font-weight: 900;">
                                  ${Number(item.subTotal).toFixed(2)}
                                </td>
                              </tr>
                            `);
                          }
                          
                          // Add empty rows to fill the last page only
                          const itemsOnLastPage = displayItems.length % itemsPerPage;
                          const emptyRowsNeeded = itemsOnLastPage === 0 ? 0 : itemsPerPage - itemsOnLastPage;
                          
                          // Only add empty rows on the last page
                          for (let i = 0; i < emptyRowsNeeded; i++) {
                            rows.push(`
                              <tr>
                                <td style="border: 1px solid black; border-top: none; border-bottom: none; padding: 4px 2px; visibility: hidden; height: 20px;">&nbsp;</td>
                                <td style="width: 80mm; border: 1px solid black; border-top: none; border-bottom: none; padding: 4px 12px; text-align: left; font-weight: 900; visibility: hidden;">&nbsp;</td>
                                ${isHsnCodeExistInInvoice === 1 ? `<td style="width: 20mm; border: 1px solid black; border-top: none; border-bottom: none; padding: 4px 2px; text-align: center; font-weight: 900; visibility: hidden;">&nbsp;</td>` : ''}
                                ${isDescriptionExistInInvoice === 1 && isDescriptionExistAsAColumn === 1 ? `<td style="width: 25mm; border: 1px solid black; border-top: none; border-bottom: none; padding: 4px 2px; text-align: center; font-weight: 900; visibility: hidden;">&nbsp;</td>` : ''}
                                ${isMrpExistInInvoice === 1 ? `<td style="width: 18mm; border: 1px solid black; border-top: none; border-bottom: none; padding: 4px 2px; text-align: center; font-weight: 900; visibility: hidden;">&nbsp;</td>` : ''}
                                <td style="width: 15mm; border: 1px solid black; border-top: none; border-bottom: none; padding: 4px 2px; text-align: center; font-weight: 900; visibility: hidden;">&nbsp;</td>
                                ${isUnitExist === 1 ? `<td style="width: 15mm; border: 1px solid black; border-top: none; border-bottom: none; padding: 4px 2px; text-align: center; font-weight: 900; visibility: hidden;">&nbsp;</td>` : ''}
                                <td style="width: 18mm; border: 1px solid black; border-top: none; border-bottom: none; padding: 4px 2px; text-align: center; font-weight: 900; visibility: hidden;">&nbsp;</td>
                                <td style="width: 20mm; border: 1px solid black; border-top: none; border-bottom: none; padding: 4px 2px; text-align: center; font-weight: 900; visibility: hidden;">&nbsp;</td>
                                ${isDiscountExistInInvoice === 1 ? `<td style="width: 18mm; border: 1px solid black; border-top: none; border-bottom: none; padding: 4px 2px; text-align: center; font-weight: 900; visibility: hidden;">&nbsp;</td>` : ''}
                                ${isGstExistInInvoice === 1 && formDataFooter.tax.value === 'GST' ? `<td style="width: 15mm; border: 1px solid black; border-top: none; border-bottom: none; padding: 4px 2px; text-align: center; font-weight: 900; visibility: hidden;">&nbsp;</td>` : ''}
                                ${isGstAmtExistInInvoice === 1 && formDataFooter.tax.value === 'GST' ? `<td style="width: 18mm; border: 1px solid black; border-top: none; border-bottom: none; padding: 4px 2px; text-align: center; font-weight: 900; visibility: hidden;">&nbsp;</td>` : ''}
                                ${isGstExistInInvoice === 1 && formDataFooter.tax.value === 'GST' ? `<td style="width: 15mm; border: 1px solid black; border-top: none; border-bottom: none; padding: 4px 2px; text-align: center; font-weight: 900; visibility: hidden;">&nbsp;</td>` : ''}
                                ${isGstAmtExistInInvoice === 1 && formDataFooter.tax.value === 'GST' ? `<td style="width: 18mm; border: 1px solid black; border-top: none; border-bottom: none; padding: 4px 2px; text-align: center; font-weight: 900; visibility: hidden;">&nbsp;</td>` : ''}
                                ${isGstExistInInvoice === 1 && formDataFooter.tax.value === 'IGST' ? `<td style="width: 15mm; border: 1px solid black; border-top: none; border-bottom: none; padding: 4px 2px; text-align: center; font-weight: 900; visibility: hidden;">&nbsp;</td>` : ''}
                                ${isGstAmtExistInInvoice === 1 && formDataFooter.tax.value === 'IGST' ? `<td style="width: 18mm; border: 1px solid black; border-top: none; border-bottom: none; padding: 4px 2px; text-align: center; font-weight: 900; visibility: hidden;">&nbsp;</td>` : ''}
                                <td style="width: 20mm; border: 1px solid black; border-top: none; border-bottom: none; padding: 4px 2px; text-align: center; font-weight: 900; visibility: hidden;">&nbsp;</td>
                              </tr>
                            `);
                          }
                          
                          // Add footer sections only on the last page
                          if (displayItems.length > 0) {
                            rows.push(`
                              <!-- Summary Section with Totals and Bill Amount -->
                              <tr>
                                <td colspan="${Math.ceil(landscapeColumnCount * 0.6)}" style="border: 1px solid black; padding: 8px; font-size: 10px; font-weight: 900; vertical-align: top;">
                                  <table style="width: 100%; border-collapse: collapse; font-size: 9px; margin-top: 0px; margin-bottom: 0px; font-weight: 900; table-layout: fixed;">
                                    <thead>
                                      <tr>
                                        <th style="border: 1px solid black; padding: 4px 2px; text-align: center; width: 25%;">Total Taxable</th>
                                        <th style="border: 1px solid black; padding: 4px 2px; text-align: center; width: 25%;">Total CGST</th>
                                        <th style="border: 1px solid black; padding: 4px 2px; text-align: center; width: 25%;">Total SGST</th>
                                        <th style="border: 1px solid black; padding: 4px 2px; text-align: center; width: 25%;">Total IGST</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      <tr>
                                        <td style="border: 1px solid black; padding: 4px 2px; text-align: center;">${Number(totalTaxable).toFixed(2)}</td>
                                        <td style="border: 1px solid black; padding: 4px 2px; text-align: center;">${Number(totalCgst).toFixed(2)}</td>
                                        <td style="border: 1px solid black; padding: 4px 2px; text-align: center;">${Number(totalSgst).toFixed(2)}</td>
                                        <td style="border: 1px solid black; padding: 4px 2px; text-align: center;">${Number(totalIgst).toFixed(2)}</td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </td>
                                <td colspan="${landscapeColumnCount - Math.ceil(landscapeColumnCount * 0.6)}" style="border: 1px solid black; padding: 8px; font-size: 10px; vertical-align: middle; font-weight: 900; text-align: center;">
                                  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px; padding-left: 10px; padding-right: 10px;">
                                    <span style="font-weight: 900;">RoundOff :</span>
                                    <span style="font-weight: 900;">${Number(roundOff).toFixed(2)}</span>
                                  </div>
                                  <div style="display: flex; justify-content: space-between; align-items: center; font-size: 13px; font-weight: 900; border-top: 1px solid black; padding-top: 6px; margin-top: 6px; padding-left: 10px; padding-right: 10px;">
                                    <span style="font-weight: 900;">Bill Amount :</span>
                                    <span style="font-weight: 900;">${Number(billAmount).toFixed(2)}</span>
                                  </div>
                                </td>
                              </tr>

                              <!-- Bank Details and Signature Section -->
                              <tr>
                                <td colspan="${Math.ceil(landscapeColumnCount / 2)}" style="border: 1px solid black; margin-bottom: 2px; padding: 8px; font-size: 10px; font-weight: 900; vertical-align: top;">
                                  <div style="margin-bottom: 4px; text-decoration: underline; text-underline-offset: 4px;">
                                    <b>Amount Chargeable (in words):</b>
                                  </div>
                                  <div style="text-transform: capitalize; margin-bottom: 10px;">
                                    ${numberToWordsWithDecimal(billAmount)} only
                                  </div>
                                  <div style="margin-bottom: 4px; text-decoration: underline; text-underline-offset: 4px;">
                                    <b>Company's Bank Details:</b>
                                  </div>
                                  <div>Bank Name: ${profileData.bank_name || 'N/A'}</div>
                                  <div>A/c No.: ${profileData.account_no || 'N/A'}</div>
                                  <div>Branch & IFS Code: ${profileData.ifsc_code || 'N/A'}</div>
                                </td>
                                <td colspan="${landscapeColumnCount - Math.ceil(landscapeColumnCount / 2)}" style="border: 1px solid black; padding: 8px; font-size: 10px; font-weight: 900; vertical-align: top;">
                                  <div style="margin-bottom: 4px; text-decoration: underline; text-underline-offset: 4px;">
                                    <b>Declaration:</b>
                                  </div>
                                  <div style="margin-bottom: 15px;">
                                    We declare that this invoice shows the actual price of the goods described and that all particulars are true and correct.
                                  </div>
                                  <div style="text-align: center; margin-top: 20px;">
                                    ${imageAuthorisedSignatureExists ? `<img src="${API_BASE_URL}/images/${company_name}/${profileData.authorisedSignatureImageName}" width="80" height="40" alt="Authorized Signature" style="margin-bottom: 5px;" />` : '<div style="height: 40px;"></div>'}
                                    <div style="font-weight: 900;">
                                      <b>for ${profileData.company_full_name}</b><br/>
                                      <b>Authorised Signatory</b>
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            `);
                          }
                          
                          return rows.join('');
                        })()}
                      </tbody>
                  </table>
              </div>
            `
            : ''
        }
        ${
          formDataFooter.invoice_print_type.value === 'A5 Size'
            ? `
          <div style="margin-left:30px; margin-right:30px;">
            <table style="width: 100%;">
                <thead>
                    <tr class="text-center" style="font-size: 10px;">
                        <td colspan="4">
                            <div style="position: relative; line-height:1; margin-top:30px;">
                            ${
                              imageLogoExists
                                ? `
                                  <img
                                      src="${API_BASE_URL}/images/${company_name}/${profileData.image_name}"
                                      width="80"
                                      height="60"
                                      alt=""
                                      style="position: fixed; top: 40px; left: 40px;"
                                  />
                                  `
                                : ''
                            }
                            ${
                              addEstimateAddress === 'not allow'
                                ? `<br />
                                    <br />
                                    <b style="font-size: 18px;">
                                      ESTIMATE
                                    </b>
                                    <br />
                                    <br />
                                    <br />`
                                : `<b style="font-size: 18px;">
                                      ${profileData.company_full_name}
                                    </b>
                                    <br />
                                    ${profileData.address}
                                    <br />
                                    ${
                                      profileData.city +
                                      ',' +
                                      profileData.state +
                                      '-' +
                                      profileData.pincode
                                    }
                                    <br />
                                    ${'Ph: ' + profileData.phone_no}
                                    <br />
                                    ${'Email: ' + profileData.email}
                                    <br />
                                    ${
                                      isTaxModeExistInInvoice === 1
                                        ? tax_type === 'GST'
                                          ? 'GSTIN: ' + profileData.gstin
                                          : 'TRN: ' + profileData.gstin
                                        : ''
                                    }
                                        ${
                                          isFssiExistInInvoice === 1
                                            ? `<br />FSSI: ` + profileData.fssi
                                            : ''
                                        }
                                        `
                            }
                            </div>
                        </td>
                    </tr>
                    <tr style="font-size: 12px;">
                        <td colspan="2" rowspan="3" style="border: 1px solid black; padding: 3px; width: 50%;">
                            <b>${
                              type === 'PURCHASE' ? 'Supplier ' : 'Customer'
                            } Details:</b>
                            <br />
                            <b>Name: ${formDataHeader.name}</b>
                            <br />
                            Address: ${formDataHeader.address}
                            <br />
                            Ph: ${formDataHeader.phoneNo}
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <b>${
                              tax_type === 'GST' ? 'GSTIN: ' : 'TRN: '
                            }${formDataHeader.gstin}</b>
                        </td>
                        <td style="border: 1px solid black; line-height: 0.5; padding: 3px;">
                            <b>${
                              invoiceType === 'estimate'
                                ? 'Estimate No: '
                                : 'Invoice No: ' + invoiceNo
                            }</b>
                        </td>
                        <td style="border: 1px solid black; line-height: 0.5; padding: 3px;">
                            <b>${
                              invoiceType === 'estimate'
                                ? 'Estimate Date: '
                                : 'Date: ' +
                                  formatDate(formDataHeader.invoiceDate)
                            }</b>
                        </td>
                        </tr>
                        <tr style="font-size: 12px; line-height: 0.5;">
                        <td style="border: 1px solid black; padding: 3px;">
                            <b>Payment Mode: ${formDataFooter.mop.value}</b>
                        </td>
                        <td style="border: 1px solid black; padding: 3px;">
                           ${
                             isTaxModeExistInInvoice === 1
                               ? `
                                <b>Tax Mode: ${
                                  formDataFooter.tax.value === 'IGST' &&
                                  tax_type === 'VAT'
                                    ? 'VAT'
                                    : formDataFooter.tax.value
                                }</b>
                              `
                               : ''
                           }
                        </td>
                        </tr>
                        <tr style="font-size: 12px;">
                        <td colspan=${
                          isSalesPersonExistInInvoice === 1 ? '1' : '2'
                        } style="border: 1px solid black; vertical-align: top; padding: 3px;">
                            <b>Remarks: </b>
                        </td>
                        ${
                          isSalesPersonExistInInvoice === 1
                            ? `
                            <td style="border: 1px solid black; vertical-align: top;">
                              <b>SP: </b> ${formDataFooter.user.username}
                            </td>
                          `
                            : ''
                        }
                        </tr>
                </thead>
                <tbody>
                    <tr>
                        <td colspan="4">
                            <div style="margin: 0; padding: 0; border: none;">
                                <table style="table-layout: fixed; width: 100%;">
                                    <thead>
                                        <tr style="font-size: 10px; line-height: 1;">
                                            <th style="border: 1px solid black; border-left: none; border-top: none; width: ${
                                              columnWidths.no
                                            }mm; word-wrap: break-word; overflow-wrap: break-word;">No.</th>
                                            <th style="border: 1px solid black; border-top: none; width: ${productCodeWidth}mm; word-wrap: break-word; overflow-wrap: break-word;">Product Description</th>
                                            ${
                                              isHsnCodeExistInInvoice === 1
                                                ? `<th style="border: 1px solid black; border-top: none; width: ${columnWidths.hsn}mm; word-wrap: break-word; overflow-wrap: break-word;">HSN SAC</th>`
                                                : ``
                                            }
                                            ${
                                              isDescriptionExistInInvoice ===
                                                1 &&
                                              isDescriptionExistAsAColumn === 1
                                                ? `
                                              <th style="border: 1px solid black; border-top: none; width: ${columnWidths.description}mm; word-wrap: break-word; overflow-wrap: break-word;">Description</th>
                                            `
                                                : ''
                                            }
                                            ${
                                              isMrpExistInInvoice === 1
                                                ? `
                                              <th style="border: 1px solid black; border-top: none; width: ${columnWidths.mrp}mm; word-wrap: break-word; overflow-wrap: break-word;">MRP</th>
                                            `
                                                : ''
                                            }
                                            <th style="border: 1px solid black; border-top: none; width: ${
                                              columnWidths.qty
                                            }mm; word-wrap: break-word; overflow-wrap: break-word;">Qty</th>
                                            ${
                                              isUnitExist === 1
                                                ? `
                                              <th style="border: 1px solid black; border-top: none; width: ${columnWidths.unit}mm; word-wrap: break-word; overflow-wrap: break-word;">Unit</th>
                                            `
                                                : ''
                                            }
                                            <th style="border: 1px solid black; border-top: none; width: ${
                                              columnWidths.rate
                                            }mm; word-wrap: break-word; overflow-wrap: break-word;">Rate</th>
                                            <th style="border: 1px solid black; border-top: none; width: ${
                                              columnWidths.grossAmt
                                            }mm; word-wrap: break-word; overflow-wrap: break-word;">Gross Amt</th>
                                            ${
                                              isGstExistInInvoice === 1
                                                ? `<th style="border: 1px solid black; border-top: none; width: ${
                                                    columnWidths.gstp
                                                  }mm; word-wrap: break-word; overflow-wrap: break-word;">${
                                                    tax_type === 'GST'
                                                      ? 'GST%'
                                                      : 'VAT%'
                                                  }</th>`
                                                : ''
                                            }
                                            ${
                                              isGstAmtExistInInvoice === 1
                                                ? `<th style="border: 1px solid black; border-top: none; width: ${
                                                    columnWidths.gstAmt
                                                  }mm; word-wrap: break-word; overflow-wrap: break-word;">${
                                                    tax_type === 'GST'
                                                      ? 'GST Amt'
                                                      : 'VAT Amt'
                                                  }</th>`
                                                : ''
                                            }
                                           
                                            <th style="border: 1px solid black; border-right: none; border-top: none; width: ${
                                              columnWidths.subTotal
                                            }mm; word-wrap: break-word; overflow-wrap: break-word;">Sub Total</th>
                                        </tr>
                                    </thead>
                                    <tbody style="font-size: 12px; line-height: 1;">
                                        ${generateHTMLTableRows(
                                          items,
                                          displayItems,
                                          itemsCount,
                                          rowsWithPageBreaks,
                                          type,
                                        )}
                                        ${generateHTMLTotalRow(
                                          totalQty,
                                          totalGrossAmt,
                                          totalGst,
                                          totalAmt,
                                        )}
                                    </tbody>
                                </table>
                                <div style="page-break-inside: avoid;">
                                ${
                                  isHsnCodeExistInInvoice === 1
                                    ? `<table class="responsive-table" style="width: 100%; line-height:0.5; margin: 0; padding: 0; border: none;">
                                        <tbody>
                                            <tr>
                                            <td rowSpan=${rowSpanWithDiscountExpense} style="width: 60%; border: 1px solid black; border-left: none;">
                                                ${
                                                  formDataFooter.tax.value !==
                                                  'Non Tax'
                                                    ? `
                                                <table class="responsive-table" style="font-size: 8px; line-height: 0.5; margin: 0; padding: 0; border-collapse: collapse;">
                                                    <thead>
                                                    <tr>
                                                        <th style="border: 1px solid black;">HSN SAC</th>
                                                        <th style="border: 1px solid black;">Taxable Value</th>
                                                        ${
                                                          formDataFooter.tax
                                                            .value === 'GST'
                                                            ? `
                                                        <th style="border: 1px solid black;" class="text-center">CGST %</th>
                                                        <th style="border: 1px solid black;" class="text-center">CGST Amt</th>
                                                        <th style="border: 1px solid black;" class="text-center">SGST %</th>
                                                        <th style="border: 1px solid black;" class="text-center">SGST Amt</th>`
                                                            : ''
                                                        }
                                                        ${
                                                          formDataFooter.tax
                                                            .value === 'IGST'
                                                            ? `
                                                        <th style="border: 1px solid black;" class="text-center">${
                                                          tax_type === 'GST'
                                                            ? 'IGST %'
                                                            : 'VAT %'
                                                        }</th>
                                                        <th style="border: 1px solid black;" class="text-center">${
                                                          tax_type === 'GST'
                                                            ? 'IGST Amt'
                                                            : 'VAT Amt'
                                                        }</th>`
                                                            : ''
                                                        }
                                                        <th style="border: 1px solid black;">Total Tax Amt</th>
                                                    </tr>
                                                    </thead>
                                                    <tbody>
                                                    ${generateFooterTableRows(
                                                      hsnItemsCount,
                                                      sumMap,
                                                      formDataFooter,
                                                    )}
                                                    </tbody>
                                                    <tfoot>
                                                    ${generateFooterTableTotal(
                                                      formDataFooter,
                                                      totalTaxable,
                                                      totalCgst,
                                                      totalSgst,
                                                      totalIgst,
                                                    )}
                                                    </tfoot>
                                                </table>`
                                                    : ''
                                                }
                                            </td>
                                            ${
                                              isDiscountExistInInvoice === 1
                                                ? `<td style="border: 1px solid black; border-right: none;" class="text-end">
                                                ${
                                                  'Discount Amt: ' +
                                                  formDataFooter.discountOnTotal
                                                }
                                            </td>`
                                                : ''
                                            }
                                                ${
                                                  isDiscountExistInInvoice ===
                                                    0 &&
                                                  isExpenseExistInInvoice === 1
                                                    ? `<td
                                                      style="border: 1px solid black; border-right: none;"
                                                      class="text-end">
                                                      ${
                                                        expenseAliasInInvoice +
                                                        ': ' +
                                                        formDataFooter.otherExpenses
                                                      }
                                                    </td>`
                                                    : ''
                                                }
                                                  ${
                                                    isDiscountExistInInvoice ===
                                                      0 &&
                                                    isExpenseExistInInvoice ===
                                                      0
                                                      ? `<td
                                                        style="border: 1px solid black; border-right: none;"
                                                        class="text-end">
                                                        ${
                                                          'Round Off: ' +
                                                          Number(
                                                            roundOff,
                                                          ).toFixed(2)
                                                        }
                                                      </td>`
                                                      : ''
                                                  }
                                            </tr>
                                            ${
                                              isDiscountExistInInvoice === 1 &&
                                              isExpenseExistInInvoice === 1
                                                ? `<tr>
                                                  <td
                                                    style="border: 1px solid black; border-right: none;"
                                                    class="text-end">
                                                    ${
                                                      expenseAliasInInvoice +
                                                      ': ' +
                                                      formDataFooter.otherExpenses
                                                    }
                                                  </td>
                                                </tr>`
                                                : ''
                                            }
                                              ${
                                                isDiscountExistInInvoice ===
                                                  1 ||
                                                isExpenseExistInInvoice === 1
                                                  ? `<tr>
                                                    <td
                                                      style="border: 1px solid black; border-right: none;"
                                                      class="text-end">
                                                      ${
                                                        'Round Off: ' +
                                                        Number(
                                                          roundOff,
                                                        ).toFixed(2)
                                                      }
                                                    </td>
                                                  </tr>`
                                                  : ''
                                              }
                                            <tr>
                                            <th style="border: 1px solid black; border-right: none; font-size: 20px; text-align: end;">
                                                ${
                                                  'Bill Amount: ' +
                                                  Number(billAmount).toFixed(2)
                                                }
                                            </th>
                                            </tr>
                                        </tbody>
                                    </table>`
                                    : ''
                                }
                                    <b style="display: flex; justify-content: flex-end;text-align: right;font-size: 12px;">
                                    ${
                                      isHsnCodeExistInInvoice === 0 ?
                                        'Round Off: ' +
                                        Number(roundOff).toFixed(2) +
                                        '<br />' +
                                        'Bill Amount: ' +
                                        Number(billAmount).toFixed(2) +
                                        '<br />'
                                      : ''
                                    }
                                    </b>
                                    <div style="line-height: 1; font-size: 10px; margin: 0; padding: 0;">
                                      ${
                                        isNarrationExistInInvoice === 1
                                          ? `<span>
                                                <b>Narration: </b>
                                                ${formDataFooter.narration}
                                                <br />
                                              </span>`
                                          : ''
                                      }
                                      <b>
                                          In Words: ${numberToWordsWithDecimal(
                                            billAmount,
                                          )} Only
                                          <br />
                                          <span style="display: block; margin:0; padding: 0;">Declaration:</span>
                                      </b>
                                    </div>
                                    <span style="display: block; height: ${declaration_height}px; font-family: inherit; font-size: 10px;">
                                        <pre style="overflow: hidden; margin: 0; font-family: inherit; font-size: 12px;">${
                                          profileData.declaration
                                        }
                                        </pre>
                                    </span>
                                    <table class="responsive-table"
                                        style="
                                        line-height: 0.5;
                                        margin: 0;
                                        padding: 0;
                                        border-collapse: separate;
                                        border-top: 1px solid black;
                                        "
                                    >
                                        <tbody style="font-size: 10px;">
                                        <tr>
                                            <td style="border: none;">
                                              ${
                                                addEstimateAddress ===
                                                'not allow'
                                                  ? `<br />`
                                                  : `<span style="display: inline-block;width: 80px;">A/C Name</span>${profileData.accountName}`
                                              }
                                            </td>
                                            <td
                                            rowspan="6"
                                            style="border: none; text-align: center;"
                                            >
                                            ${
                                              imageQRExists
                                                ? `
                                                  <img
                                                      src="${API_BASE_URL}/images/${company_name}/${profileData.qr_image_name}"
                                                      width="60"
                                                      height="60"
                                                      alt=""
                                                  />
                                                  `
                                                : ''
                                            }
                                            </td>
                                            <th
                                            rowspan="3"
                                            style="border: none; text-align: end;"
                                            >
                                            ${
                                              addEstimateAddress === 'not allow'
                                                ? `<br />`
                                                : 'For ' +
                                                  profileData.company_full_name
                                            }
                                            </th>
                                        </tr>
                                        <tr>
                                            <td style="border: none;">
                                            ${
                                              addEstimateAddress === 'not allow'
                                                ? `<br />`
                                                : `<span style="display: inline-block;width: 80px;">A/C No</span>${profileData.account_no}`
                                            }
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style="border: none;">
                                             ${
                                               addEstimateAddress ===
                                               'not allow'
                                                 ? `<br />`
                                                 : `<span style="display: inline-block;width: 80px;">IFSC Code</span>:${profileData.ifsc_code}`
                                             }
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style="border: none;">
                                             ${
                                               addEstimateAddress ===
                                               'not allow'
                                                 ? `<br />`
                                                 : `<span style="display: inline-block;width: 80px;">Bank Name</span>:${profileData.bank_name}`
                                             }
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style="border: none;">
                                            ${
                                              addEstimateAddress === 'not allow'
                                                ? `<br />`
                                                : `<span style="display: inline-block;width: 80px;">Branch</span>:${profileData.branch}`
                                            }
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style="border: none;">
                                             ${
                                               addEstimateAddress ===
                                               'not allow'
                                                 ? `<br />`
                                                 : `<span style="display: inline-block;width: 80px;">PAN No</span>:${profileData.panNo}`
                                             }
                                            </td>
                                            <th style="border: none; text-align: end;">
                                              ${
                                                invoiceType === 'sales' ||
                                                invoiceType === 'estimate'
                                                  ? `
                                                <div style="position: relative;">
                                                  ${
                                                    imageCompanySealExists &&
                                                    (invoiceType === 'sales'
                                                      ? isCompanySealExistInSales
                                                      : isCompanySealExistInEstimate) ===
                                                      1
                                                      ? `
                                                    <img
                                                      src="${API_BASE_URL}/images/${company_name}/${profileData.companySealImageName}"
                                                      width="60"
                                                      height="60"
                                                      alt="Company Seal"
                                                      style="
                                                        position: absolute;
                                                        bottom: 0;
                                                        right: 60px;
                                                        image-rendering: crisp-edges;
                                                        object-fit: contain;
                                                        filter: contrast(1.1) brightness(1.1);
                                                      "
                                                    />
                                                  `
                                                      : ''
                                                  }
                                                  ${
                                                    imageAuthorisedSignatureExists &&
                                                    (invoiceType === 'sales'
                                                      ? isSignatureImageExistInSales
                                                      : isSignatureImageExistInEstimate) ===
                                                      1
                                                      ? `
                                                    <img
                                                      src="${API_BASE_URL}/images/${company_name}/${profileData.authorisedSignatureImageName}"
                                                      width="80"
                                                      height="60"
                                                      alt="Authorized Signature"
                                                      style="
                                                        position: absolute;
                                                        bottom: 0;
                                                        right: 60px;
                                                        z-index: 1;
                                                        image-rendering: crisp-edges;
                                                        object-fit: contain;
                                                        filter: contrast(1.1) brightness(1.1);
                                                      "
                                                    />
                                                  `
                                                      : ''
                                                  }
                                                </div>
                                              `
                                                  : ''
                                              }
                                              Authorized Signature
                                              </th>
                                        </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
          </div>
            `
            : ''
        }
        ${
          formDataFooter.invoice_print_type.value === 'Thermal Printer'
            ? `
            <div class="text-center">
                <b>${profileData.company_full_name}</b>
                <br />
                ${profileData.address}
                <br />
                ${profileData.city}, ${profileData.state}-${profileData.pincode}
                <br />
                Ph: ${profileData.phone_no}
                <br />
                Email: ${profileData.email}
                <br />
               ${
                 isTaxModeExistInInvoice === 1
                   ? tax_type === 'GST'
                     ? 'GSTIN: ' + profileData.gstin
                     : 'TRN: ' + profileData.gstin
                   : ''
               }
                <br />
                ${
                  isFssiExistInInvoice === 1
                    ? `FSSI: ` + profileData.fssi + `<br />`
                    : ''
                }
                <b>============INVOICE============</b>
            </div>
            <div class="clearfix">
                <div class="float-start">
                    <b>Invoice No: ${invoiceNo}</b>
                </div>
                <div class="float-end">
                    <b> Date: ${formatDate(formDataHeader.invoiceDate)}</b>
                </div>
            </div>
            <br />
            <b>Customer: ${formDataHeader.name}</b>
            <table style="margin: 0; padding: 0; border: none;">
                <thead>
                <tr>
                    <th class="text-end">No</th>
                    <th>Item Desc</th>
                    ${isHsnCodeExistInInvoice === 1 ? '<th>HSN SAC</th>' : ''}
                    <th class="text-end">Qty</th>
                    <th class="text-end">Price</th>
                    ${
                      isGstExistInInvoice === 1
                        ? `<th class="text-end">
                       ${tax_type === 'GST' ? 'GST %' : 'VAT %'}
                    </th>`
                        : ''
                    }
                    ${
                      isGstAmtExistInInvoice === 1
                        ? `<th class="text-end">
                      ${tax_type === 'GST' ? 'GST Amt' : 'VAT Amt'}
                    </th>`
                        : ''
                    }
                    <th class="text-end">Sub Total</th>
                </tr>
                </thead>
                <tbody style="border: none;">
                ${displayItems
                  .map(
                    (item, index) => `
                    <tr key=${index} style="border: none;">
                    <td style="border: none;" class="text-end">${index + 1}</td>
                    <td style="border: none;">${item.productCode}</td>
                    ${
                      isHsnCodeExistInInvoice === 1
                        ? '<td style="border: none;">${item.hsnCode}</td>'
                        : ''
                    }
                    <td style="border: none;" class="text-end">${item.qty}</td>
                    <td style="border: none;" class="text-end">${
                      type === 'PURCHASE'
                        ? item.newPurchasePrice
                        : item.newSalesPrice
                    }</td>
                    ${
                      isGstExistInInvoice === 1
                        ? `<td style="border: none;" class="text-end">${item.igstP}</td>`
                        : ''
                    }
                    ${
                      isGstAmtExistInInvoice === 1
                        ? `<td style="border: none;" class="text-end">${Number(
                            Number(item.cgst) +
                              Number(item.sgst) +
                              Number(item.igst),
                          ).toFixed(2)}</td>`
                        : ''
                    }
                    <td style="border: none;" class="text-end">${
                      item.subTotal
                    }</td>
                    </tr>
                `,
                  )
                  .join('')}
                <tr style="border-top: 1px solid black;">
                    <td colspan=${
                      isHsnCodeExistInInvoice === 1 ? 3 : 2
                    }>Total</td>
                    <td class="text-end">${totalQty}</td>
                    <td></td>
                    ${isGstExistInInvoice === 1 ? '<td></td>' : ''}
                    ${
                      isGstAmtExistInInvoice === 1
                        ? `<td class="text-end">${Number(totalGst).toFixed(
                            2,
                          )}</td>`
                        : ''
                    }
                    <td class="text-end">${Number(totalAmt).toFixed(2)}</td>
                </tr>
                </tbody>
            </table>
            <div class="text-center">
                <b>::::::SUMMARY::::::</b>
            </div>
            ${
              formDataFooter.tax.value !== 'Non Tax'
                ? `
                ${
                  isHsnCodeExistInInvoice === 1
                    ? `<table class="responsive-table" style="font-size: 12px; margin: 0; padding: 0; border-collapse: collapse;">
                <thead>
                    <tr>
                    <th style="border: 1px solid black;">HSN SAC</th>
                    <th style="border: 1px solid black;">Taxable Value</th>
                    ${
                      formDataFooter.tax.value === 'GST'
                        ? `
                        <th style="border: 1px solid black;" class="text-center">CGST %</th>
                        <th style="border: 1px solid black;" class="text-center">CGST Amt</th>
                        <th style="border: 1px solid black;" class="text-center">SGST %</th>
                        <th style="border: 1px solid black;" class="text-center">SGST Amt</th>
                    `
                        : ''
                    }
                    ${
                      formDataFooter.tax.value === 'IGST'
                        ? `
                        <th style="border: 1px solid black;" class="text-center">${
                          tax_type === 'GST' ? 'IGST %' : 'VAT %'
                        }</th>
                        <th style="border: 1px solid black;" class="text-center">${
                          tax_type === 'GST' ? 'IGST Amt' : 'VAT Amt'
                        }</th>
                    `
                        : ''
                    }
                    <th style="border: 1px solid black;">Total Tax Amt</th>
                    </tr>
                </thead>
                <tbody>
                    ${Object.keys(sumMap)
                      .map((key, index) => {
                        const {cgstSum, sgstSum, igstSum, taxableSum} =
                          sumMap[key];
                        const [hsnCode, igstP] = key.split('-');
                        return `
                        <tr key=${index}>
                        <td style="border: 1px solid black; border-top: none; border-bottom: none;">${hsnCode}</td>
                        <td style="border: 1px solid black; border-top: none; border-bottom: none;" class="text-end">${Number(
                          taxableSum,
                        ).toFixed(2)}</td>
                        ${
                          formDataFooter.tax.value === 'GST'
                            ? `
                            <td class="text-end" style="border: 1px solid black; border-top: none; border-bottom: none;">${
                              igstP / 2
                            }</td>
                            <td class="text-end" style="border: 1px solid black; border-top: none; border-bottom: none;">${Number(
                              cgstSum,
                            ).toFixed(2)}</td>
                            <td class="text-end" style="border: 1px solid black; border-top: none; border-bottom: none;">${
                              igstP / 2
                            }</td>
                            <td class="text-end" style="border: 1px solid black; border-top: none; border-bottom: none;">${Number(
                              sgstSum,
                            ).toFixed(2)}</td>
                        `
                            : ''
                        }
                        ${
                          formDataFooter.tax.value === 'IGST'
                            ? `
                            <td class="text-end" style="border: 1px solid black; border-top: none; border-bottom: none;">${igstP}</td>
                            <td class="text-end" style="border: 1px solid black; border-top: none; border-bottom: none;">${Number(
                              igstSum,
                            ).toFixed(2)}</td>
                        `
                            : ''
                        }
                        <td class="text-end" style="border: 1px solid black; border-top: none; border-bottom: none;">${Number(
                          cgstSum + sgstSum + igstSum,
                        ).toFixed(2)}</td>
                        </tr>
                    `;
                      })
                      .join('')}
                </tbody>
                <tfoot>
                    <tr>
                    <th style="border: 1px solid black;">Total</th>
                    <th class="text-end" style="border: 1px solid black;">${Number(
                      totalTaxable,
                    ).toFixed(2)}</th>
                    ${
                      formDataFooter.tax.value === 'GST'
                        ? `
                        <th style="border: 1px solid black;"></th>
                        <th class="text-end" style="border: 1px solid black;">${Number(
                          totalCgst,
                        ).toFixed(2)}</th>
                        <th style="border: 1px solid black;"></th>
                        <th class="text-end" style="border: 1px solid black;">${Number(
                          totalSgst,
                        ).toFixed(2)}</th>
                    `
                        : ''
                    }
                    ${
                      formDataFooter.tax.value === 'IGST'
                        ? `
                        <th style="border: 1px solid black;"></th>
                        <th class="text-end" style="border: 1px solid black;">${Number(
                          totalIgst,
                        ).toFixed(2)}</th>
                    `
                        : ''
                    }
                    <th class="text-end" style="border: 1px solid black;">${Number(
                      totalCgst + totalSgst + totalIgst,
                    ).toFixed(2)}</th>
                    </tr>
                </tfoot>
                </table>`
                    : ''
                }
                ${
                  isDiscountExistInInvoice === 1
                    ? `<div class="text-end">Round Off: ${
                        'Discount Amt: ' + formDataFooter.discountOnTotal
                      }</div>`
                    : ``
                }
                ${
                  isExpenseExistInInvoice === 1
                    ? `<div class="text-end">Round Off: ${
                        expenseAliasInInvoice +
                        ': ' +
                        formDataFooter.otherExpenses
                      }</div>`
                    : ``
                }
                <div class="text-end">Round Off: ${Number(roundOff).toFixed(
                  2,
                )}</div>
                <div class="text-end">
                <h1>Bill Amount: ${Number(billAmount).toFixed(2)}</h1>
                </div>
                <div>In words: ${numberToWordsWithDecimal(
                  billAmount,
                )} only</div>
                <div class="text-center">
                <b>***THANK YOU. VISIT AGAIN***</b>
            </div>
            `
                : ''
            }
            `
            : ''
        }
    </body>
  </html>
  `;
};
export default GenerateInvoicePrint;
const styles = StyleSheet.create({});