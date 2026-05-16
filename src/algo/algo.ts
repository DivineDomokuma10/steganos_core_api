export function staircase(n: number): void {
  // Write your code here
  let hashChar = "#";
  let emptyChar = " ";
  let placeholder = "";

  function dupSymb(symb: string, dup: number): string {
    let holder = "";

    for (let i = 0; i < dup; i++) {
      holder += symb;
    }
    return holder;
  }

  if (n === 1) {
    placeholder = hashChar;
  }

  if (n > 1) {
    for (let x = n, y = 1; x > 0; x--, y++) {
      placeholder += `${dupSymb(emptyChar, x - 1)}${dupSymb(hashChar, y)}${
        x !== 1 ? "\n" : ""
      }`;
    }
  }

  console.log(placeholder);
}

export function miniMaxSum(arr: number[]): void {
  // Write your code here
  const sortedArr = arr.sort((a, b) => a - b);

  const miniSum = sortedArr.reduce((acc, cur, curIndex) =>
    curIndex !== arr.length - 1 ? acc + cur : acc,
  );

  const maxSum = sortedArr.reduce(
    (acc, cur, curIndex) => (curIndex !== 0 ? acc + cur : acc),
    0,
  );

  console.log(miniSum, maxSum);
}

export function birthdayCakeCandles(candles: number[]): number {
  // Write your code here
  let noOfDup = 0;

  const max = Math.max(...candles);

  for (let i = 0; i < candles.length; i++) {
    if (candles[i] === max) {
      noOfDup += 1;
    }
  }

  return noOfDup;
}

export function timeConversion(s: string): string {
  // Write your code here
  let millitryTimeFormat = "";

  const HH = parseInt(s.slice(0, 2));
  const isAM = !!(s.slice(s.length - 2) === "AM");

  if (isAM && HH === 12) {
    millitryTimeFormat = `00${s.slice(2, s.length - 2)}`;
  } else if (isAM && HH !== 12) {
    millitryTimeFormat = `${s.slice(0, s.length - 2)}`;
  } else if (!isAM && HH === 12) {
    millitryTimeFormat = `${s.slice(0, s.length - 2)}`;
  } else {
    millitryTimeFormat = `${12 + HH}${s.slice(2, s.length - 2)}`;
  }

  return millitryTimeFormat;
}

export function to8bitBinary(num: number): number[] {
  const bits = [];

  for (let i = 7; i >= 0; i--) {
    bits.push((num >> i) & 1);
  }

  return bits;
}

export function toBase10(bits: number[]) {
  return bits.reduce((acc, bit) => (acc << 1) | bit, 0);
}
