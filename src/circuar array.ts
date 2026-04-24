function closestTarget(
  words: string[],
  target: string,
  startIndex: number,
): number {
  const wordsLen = words.length;

  const getNxt = (i: number) => words[i + (1 % wordsLen)];
  const getPrev = (i: number) => words[(i - 1 + wordsLen) % wordsLen];

  let nxti = 0;
  let startNxt = startIndex;
  while (target !== words[startNxt]) {
    getNxt(startNxt);
    startNxt++;
    nxti++;
    if (nxti > words.length) {
      nxti = -1;
      break;
    }
  }
  let previ = 0;
  let startPrev = startIndex;
  while (target !== words[startPrev]) {
    getPrev(startPrev);
    startPrev = (startPrev - 1 + wordsLen) % wordsLen;
    previ++;
    if (previ > words.length) {
      previ = -1;
      break;
    }
  }
  let ans = 0;
  ans = nxti <= previ ? nxti : previ;
  return ans;
}

export default closestTarget;
