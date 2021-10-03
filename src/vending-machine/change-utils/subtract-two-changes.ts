import { Change } from "../bank";

export function subtractTwoChanges(
  changeToBeSubtractedFrom: Change,
  changeToSubtract: Change
): Change {
  return {
    "1p": changeToBeSubtractedFrom["1p"] - changeToSubtract["1p"],
    "2p": changeToBeSubtractedFrom["2p"] - changeToSubtract["2p"],
    "5p": changeToBeSubtractedFrom["5p"] - changeToSubtract["5p"],
    "10p": changeToBeSubtractedFrom["10p"] - changeToSubtract["10p"],
    "20p": changeToBeSubtractedFrom["20p"] - changeToSubtract["20p"],
    "50p": changeToBeSubtractedFrom["50p"] - changeToSubtract["50p"],
    "100p": changeToBeSubtractedFrom["100p"] - changeToSubtract["100p"],
    "200p": changeToBeSubtractedFrom["200p"] - changeToSubtract["200p"],
  };
}
