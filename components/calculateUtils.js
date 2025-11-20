// Precomputed character width data for Georgia font at size 14
const charWidthData14px = {
  a: 7.119140625,
  b: 7.83203125,
  c: 6.470703125,
  d: 7.83203125,
  e: 7.431640625,
  f: 4.205078125,
  g: 7.83203125,
  h: 7.83203125,
  i: 3.41796875,
  j: 3.41796875,
  k: 6.83203125,
  l: 3.41796875,
  m: 11.619140625,
  n: 7.83203125,
  o: 7.83203125,
  p: 7.83203125,
  q: 7.83203125,
  r: 4.970703125,
  s: 6.470703125,
  t: 4.205078125,
  u: 7.83203125,
  v: 7.119140625,
  w: 10.119140625,
  x: 7.119140625,
  y: 7.119140625,
  z: 6.470703125,
  A: 9.119140625,
  B: 8.470703125,
  C: 8.970703125,
  D: 9.470703125,
  E: 7.970703125,
  F: 7.470703125,
  G: 9.470703125,
  H: 9.470703125,
  I: 3.970703125,
  J: 5.970703125,
  K: 8.470703125,
  L: 7.470703125,
  M: 11.470703125,
  N: 9.470703125,
  O: 9.470703125,
  P: 8.470703125,
  Q: 9.470703125,
  R: 8.470703125,
  S: 8.470703125,
  T: 7.970703125,
  U: 9.470703125,
  V: 9.119140625,
  W: 12.119140625,
  X: 9.119140625,
  Y: 9.119140625,
  Z: 8.470703125,
  ' ': 3.470703125,
  '.': 3.470703125,
  ',': 3.470703125,
  '!': 3.470703125,
  '?': 6.970703125,
  '-': 4.470703125,
  _: 7.970703125,
  0: 7.970703125,
  1: 7.970703125,
  2: 7.970703125,
  3: 7.970703125,
  4: 7.970703125,
  5: 7.970703125,
  6: 7.970703125,
  7: 7.970703125,
  8: 7.970703125,
  9: 7.970703125,
};

// Scale factor calculation
const scaleFactor = 12 / 14; // Scale down from 14px to 12px

// Function to scale down character width data
const scaleCharWidthData = (charWidthData, scaleFactor) => {
  const scaledData = {};
  for (const char in charWidthData) {
    scaledData[char] = charWidthData[char] * scaleFactor;
  }
  return scaledData;
};

// Get scaled character width data for 12px
const charWidthData12px = scaleCharWidthData(charWidthData14px, scaleFactor);

const mmToPixels = mm => {
  // Assuming a conversion factor suitable for your needs
  return mm * 3.779528; // Approximation for A4 paper width in pixels
};

const calculateTextWidth = (text, charWidthData) => {
  return text.split('').reduce((totalWidth, char) => {
    return totalWidth + (charWidthData[char] || charWidthData[' ']);
  }, 0);
};

const calculateLines = (text, maxWidth, charWidthData) => {
  const words = text.split(' ');
  let currentLine = '';
  let lines = 1; // Start with one line

  words.forEach(word => {
    const testLine = currentLine + word + ' ';
    const testLineWidth = calculateTextWidth(testLine, charWidthData);

    if (testLineWidth > maxWidth) {
      lines += 1;
      currentLine = word + ' ';
    } else {
      currentLine = testLine;
    }
  });

  return lines;
};

const getPageBreaks = (
  items,
  maxLinesPerPage,
  productCodeWidthMm,
  unitWidthMm,
  fontSize,
) => {
  const productCodeWidth = mmToPixels(productCodeWidthMm);
  const unitWidth = mmToPixels(unitWidthMm);
  const rowsWithPageBreaks = [];
  let currentLineCount = 0;
  const charWidthData = fontSize === 14 ? charWidthData14px : charWidthData12px;

  items.forEach((item, index) => {
    const productCodeLines = calculateLines(
      item.productCode,
      productCodeWidth,
      charWidthData,
    );
    const unitLines = calculateLines(
      item.selectedUnit,
      unitWidth,
      charWidthData,
    );
    const rowLineCount = Math.max(productCodeLines, unitLines);

    console.log(index + ': rowLineCount: ' + rowLineCount);

    currentLineCount += rowLineCount;

    if (currentLineCount > maxLinesPerPage) {
      rowsWithPageBreaks.push(index);
      currentLineCount = rowLineCount;
    }
  });

  const remainingRowCount = maxLinesPerPage - currentLineCount;
  return {rowsWithPageBreaks, remainingRowCount};
};

export {getPageBreaks};
