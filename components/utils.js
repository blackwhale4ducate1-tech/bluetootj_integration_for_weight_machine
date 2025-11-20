export function numberToIndianWords(number) {
  const ones = [
    '',
    'One',
    'Two',
    'Three',
    'Four',
    'Five',
    'Six',
    'Seven',
    'Eight',
    'Nine',
    'Ten',
    'Eleven',
    'Twelve',
    'Thirteen',
    'Fourteen',
    'Fifteen',
    'Sixteen',
    'Seventeen',
    'Eighteen',
    'Nineteen',
  ];
  const tens = [
    '',
    '',
    'Twenty',
    'Thirty',
    'Forty',
    'Fifty',
    'Sixty',
    'Seventy',
    'Eighty',
    'Ninety',
  ];
  const units = ['', 'Thousand', 'Lakh', 'Crore'];

  if (number === 0) return 'Zero';

  function convertToWords(num) {
    if (num < 20) {
      return ones[num];
    } else if (num < 100) {
      return (
        tens[Math.floor(num / 10)] +
        (num % 10 !== 0 ? ' ' + ones[num % 10] : '')
      );
    } else {
      return (
        ones[Math.floor(num / 100)] +
        ' Hundred' +
        (num % 100 !== 0 ? ' and ' + convertToWords(num % 100) : '')
      );
    }
  }

  let words = '';
  let i = 0;

  while (number > 0) {
    const segment =
      i === 1
        ? number % 100 // For thousands, take two digits
        : number % 1000; // For others, take three digits

    if (segment > 0) {
      const segmentWords = convertToWords(segment);
      words = segmentWords + (units[i] ? ' ' + units[i] : '') + ' ' + words;
    }

    number = Math.floor(number / (i === 1 ? 100 : 1000));
    i++;
  }

  return words.trim();
}
