import { Change } from "../bank";
import { DENOMINATIONS, DENOMINATION_VALUE } from "./constants";

export function sumChange(change: Change): number {
  var sum = 0;

  for (const value of DENOMINATIONS) {
    sum += DENOMINATION_VALUE[value] * change[value];
  }

  return sum;
}
