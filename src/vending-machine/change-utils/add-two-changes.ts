import { Change } from "../bank";

export function addTwoChanges(
  changeToBeAddedTo: Change,
  changeToAdd: Change
): Change {
  return {
    "1p": changeToBeAddedTo["1p"] + changeToAdd["1p"],
    "2p": changeToBeAddedTo["2p"] + changeToAdd["2p"],
    "5p": changeToBeAddedTo["5p"] + changeToAdd["5p"],
    "10p": changeToBeAddedTo["10p"] + changeToAdd["10p"],
    "20p": changeToBeAddedTo["20p"] + changeToAdd["20p"],
    "50p": changeToBeAddedTo["50p"] + changeToAdd["50p"],
    "100p": changeToBeAddedTo["100p"] + changeToAdd["100p"],
    "200p": changeToBeAddedTo["200p"] + changeToAdd["200p"],
  };
}
