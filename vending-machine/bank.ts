import { addTwoChanges, subtractTwoChanges, sumChange } from "./change-utils";

export type Change = {
  "1p": number;
  "2p": number;
  "5p": number;
  "10p": number;
  "20p": number;
  "50p": number;
  "100p": number;
  "200p": number;
};

export type UpdateChangeOutcome =
  | {
      outcome: "success";
    }
  | {
      outcome: "failure";
      reason: "INVALID_CHANGE";
    };

export interface Bank {
  // TODO: we assume bank has infinite capacity for now
  getState(): Change;
  getHistory(): BankEvent[];
  getBalance(): number;
  addChange(change: Change, context?: { saleId: string }): UpdateChangeOutcome;
  removeChange(
    change: Change,
    context?: { saleId: string }
  ): UpdateChangeOutcome;
}

export type BankEvent = {
  name: "ChangeAdded" | "ChangeRemoved";
  sequence: number;
  data: {
    change: Change;
    relatedSaleId?: string;
  };
};

export function isChangeStateValid(state: Change): boolean {
  const changes: (keyof Change)[] = [
    "1p",
    "2p",
    "5p",
    "10p",
    "20p",
    "50p",
    "100p",
    "200p",
  ];

  for (const value of changes) {
    if (state[value] < 0) {
      return false;
    }
  }

  return true;
}

export function buildBank(): Bank {
  var state: Change = {
    "1p": 0,
    "2p": 0,
    "5p": 0,
    "10p": 0,
    "20p": 0,
    "50p": 0,
    "100p": 0,
    "200p": 0,
  };

  const events: BankEvent[] = [];

  function addChange(
    change: Change,
    context?: { saleId: string }
  ): UpdateChangeOutcome {
    if (!isChangeStateValid(change)) {
      return {
        outcome: "failure",
        reason: "INVALID_CHANGE",
      };
    }

    const newState = addTwoChanges(state, change);

    if (isChangeStateValid(newState)) {
      state = newState;
      const eventToAdd: BankEvent = {
        name: "ChangeAdded",
        data: {
          change: { ...change },
          relatedSaleId: context?.saleId,
        },
        sequence: events.length + 1,
      };

      events.push(eventToAdd);

      return {
        outcome: "success",
      };
    }

    return {
      outcome: "failure",
      reason: "INVALID_CHANGE",
    };
  }

  function removeChange(
    change: Change,
    context?: { saleId: string }
  ): UpdateChangeOutcome {
    if (!isChangeStateValid(change)) {
      return {
        outcome: "failure",
        reason: "INVALID_CHANGE",
      };
    }

    const newState = subtractTwoChanges(state, change);

    if (isChangeStateValid(newState)) {
      state = newState;
      const eventToAdd: BankEvent = {
        name: "ChangeRemoved",
        data: {
          change: { ...change },
          relatedSaleId: context?.saleId,
        },
        sequence: events.length + 1,
      };

      events.push(eventToAdd);

      return {
        outcome: "success",
      };
    }

    return {
      outcome: "failure",
      reason: "INVALID_CHANGE",
    };
  }

  return {
    getState: () => ({ ...state }),
    getHistory: () => events.map((e) => ({ ...e, data: { ...e.data } })),
    getBalance: () => sumChange(state),
    addChange,
    removeChange,
  };
}
