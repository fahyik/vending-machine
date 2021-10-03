import { buildBank, Change } from "../bank";
import { sumChange } from "../change-utils";

describe("#bank", () => {
  describe("bank.addChange()", () => {
    describe("given an empty bank", () => {
      const emptyBank = buildBank();
      describe("and a valid change object", () => {
        const changeToAdd: Change = {
          "1p": 1,
          "2p": 0,
          "5p": 1,
          "10p": 0,
          "20p": 0,
          "50p": 1,
          "100p": 0,
          "200p": 0,
        };

        it("adds the change object to the bank", () => {
          const result = emptyBank.addChange(changeToAdd);

          expect(result).toHaveProperty("outcome", "success");
          expect(emptyBank.getState()).toEqual(changeToAdd);
          expect(emptyBank.getBalance()).toEqual(sumChange(changeToAdd));
        });

        it("creates an ChangeAdded event", () => {
          const createdEvent = emptyBank.getHistory().pop();
          expect(createdEvent).toHaveProperty("name", "ChangeAdded");
        });
      });
    });
  });
  describe("bank.removeChange()", () => {
    describe("given a bank with some change", () => {
      describe("and a change object to remove everything from the bank", () => {
        const bank = buildBank();
        const changeToRemove: Change = {
          "1p": 1,
          "2p": 0,
          "5p": 1,
          "10p": 0,
          "20p": 0,
          "50p": 1,
          "100p": 0,
          "200p": 0,
        };
        bank.addChange(changeToRemove);
        it("removes the change object from the bank", () => {
          const result = bank.removeChange(changeToRemove);

          expect(result).toHaveProperty("outcome", "success");
          expect(bank.getState()).toEqual({
            "1p": 0,
            "2p": 0,
            "5p": 0,
            "10p": 0,
            "20p": 0,
            "50p": 0,
            "100p": 0,
            "200p": 0,
          });
          expect(bank.getBalance()).toEqual(0);
        });

        it("creates an ChangeRemoved event", () => {
          const createdEvent = bank.getHistory().pop();
          expect(createdEvent).toHaveProperty("name", "ChangeRemoved");
        });
      });

      describe("and a change object to remove more than what there is in the bank", () => {
        const bank = buildBank();
        const changeToRemove: Change = {
          "1p": 1,
          "2p": 0,
          "5p": 1,
          "10p": 0,
          "20p": 0,
          "50p": 1,
          "100p": 0,
          "200p": 0,
        };
        bank.addChange(changeToRemove);
        it("fails to remove the change", () => {
          const result = bank.removeChange({ ...changeToRemove, "200p": 10 });

          expect(result).toHaveProperty("outcome", "failure");
          expect(result).toHaveProperty("reason", "INVALID_CHANGE");
          expect(bank.getState()).toEqual(changeToRemove);
        });
      });
    });
  });
});
