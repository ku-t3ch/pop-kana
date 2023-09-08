import numeral from "numeral";

export const formatBigNumber = (number: number) => {
  return numeral(number).format("0.0a").replace(".0", "");
};
