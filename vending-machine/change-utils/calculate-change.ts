import { sumChange } from ".";
import { Change } from "../bank";
import { DENOMINATIONS, DENOMINATION_VALUE } from "./constants";

export type CalculateChangeOutcome =
  | {
      outcome: "success";
      data: {
        change: Change;
      };
    }
  | {
      outcome: "failure";
      reason:
        | "INVALID_AMOUNT_PROVIDED"
        | "UNABLE_TO_GENERATE_CHANGE"
        | "INSUFFICIENT_BALANCE";
    };

// returns a change object given an amount
export function calculateChange(
  available: Change,
  amount: number
): CalculateChangeOutcome {
  if (amount < 0) {
    return {
      outcome: "failure",
      reason: "INVALID_AMOUNT_PROVIDED",
    };
  }

  const calculatedChange = {
    "1p": 0,
    "2p": 0,
    "5p": 0,
    "10p": 0,
    "20p": 0,
    "50p": 0,
    "100p": 0,
    "200p": 0,
  };

  if (amount === 0) {
    return { outcome: "success", data: { change: calculatedChange } };
  }

  if (amount > sumChange(available)) {
    return {
      outcome: "failure",
      reason: "INSUFFICIENT_BALANCE",
    };
  }

  var remainingAmount = amount;

  for (let i = DENOMINATIONS.length - 1; i >= 0; i--) {
    if (remainingAmount <= 0) {
      break;
    }

    const denomination = DENOMINATIONS[i];
    const denominationValue = DENOMINATION_VALUE[denomination];

    if (available[denomination] > 0 && denominationValue <= remainingAmount) {
      const qty = Math.floor(remainingAmount / denominationValue);

      calculatedChange[denomination] = Math.min(available[denomination], qty);
      remainingAmount -= calculatedChange[denomination] * denominationValue;
    }
  }

  if (remainingAmount > 0) {
    return {
      outcome: "failure",
      reason: "UNABLE_TO_GENERATE_CHANGE",
    };
  }

  return { outcome: "success", data: { change: calculatedChange } };
}
