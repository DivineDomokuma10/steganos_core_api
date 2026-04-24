export const queryParser = (queryObj: Prettify<Record<string, string>>) => {
  let parsedQuery: Prettify<Record<any, string>> = {};

  for (const key in queryObj) {
    let parsedKeyValue: any;

    if (queryObj[key].includes(",")) {
      const pair = queryObj[key]
        .split(",")
        .map((item) => item.split(":"))
        .map((e) => [`$${e[0]}`, e[1]]);

      parsedKeyValue = Object.fromEntries(pair);
    } else {
      const toNum = Number(queryObj[key]);

      if (isNaN(toNum)) {
        parsedKeyValue = toNum;
      }

      parsedKeyValue = JSON.parse(queryObj[key]);
    }

    parsedQuery[key] = parsedKeyValue;
  }

  return parsedQuery;
};

type Prettify<T> = { [k in keyof T]: T[k] } & {};
