import { buildVendingMachine } from "..";
import { calculateChange } from "../change-utils";

describe("#vendingMachine", () => {
  describe("vendingMachine.sell()", () => {
    describe("given a vending machine", () => {
      describe("with a set of products and change", () => {
        const machine = buildVendingMachine({
          initialBank: {
            "1p": 10,
            "2p": 20,
            "5p": 10,
            "10p": 1,
            "20p": 2,
            "50p": 1,
            "100p": 0,
            "200p": 0,
          }, // 200 in total
          initialInventory: [
            { id: "apple", price: 13, quantity: 2 },
            { id: "muesli-bar", price: 23, quantity: 2 },
            { id: "coca-cola", price: 7, quantity: 1 },
            { id: "bonbon", price: 17, quantity: 0 },
          ],
        });

        describe("and a non-existing product to sell", () => {
          it("does not sell", () => {
            const result = machine.sell("some-other-product", {});
            expect(result).toHaveProperty("outcome", "failure");
            expect(result).toHaveProperty("reason", "PRODUCT_DOES_NOT_EXIST");
          });
        });

        describe("and a non-available product to sell", () => {
          describe("and with sufficient change", () => {
            it("does not sell", () => {
              const result = machine.sell("bonbon", { "20p": 1 });
              expect(result).toHaveProperty("outcome", "failure");
              expect(result).toHaveProperty("reason", "PRODUCT_IS_SOLD_OUT");
            });
          });
        });

        describe("and a valid product to sell", () => {
          describe("but with insufficient change", () => {
            it("does not sell", () => {
              const result = machine.sell("apple", { "2p": 2 });
              expect(result).toHaveProperty("outcome", "failure");
              expect(result).toHaveProperty("reason", "INSUFFICIENT_CASH");
            });
          });

          describe("and with exact change", () => {
            it("sells and return no change", () => {
              const result = machine.sell("apple", {
                "10p": 1,
                "2p": 1,
                "1p": 1,
              });
              expect(result).toHaveProperty("outcome", "success");
              expect(result).toHaveProperty("data.productId", "apple");
              expect(result).toHaveProperty("data.change", undefined);
            });
          });

          describe("and with more than sufficient change", () => {
            it("sells and returns the correct change", () => {
              const result = machine.sell("muesli-bar", {
                "10p": 3,
              });
              expect(result).toHaveProperty("outcome", "success");
              expect(result).toHaveProperty("data.productId", "muesli-bar");
              expect(result).toHaveProperty("data.change", {
                "1p": 0,
                "2p": 1,
                "5p": 1,
                "10p": 0,
                "20p": 0,
                "50p": 0,
                "100p": 0,
                "200p": 0,
              });
            });
          });
        });
      });

      describe("with a set of products but NO change", () => {
        const machine = buildVendingMachine({
          initialInventory: [
            { id: "apple", price: 13, quantity: 2 },
            { id: "muesli-bar", price: 23, quantity: 2 },
            { id: "coca-cola", price: 7, quantity: 1 },
            { id: "bonbon", price: 17, quantity: 0 },
          ],
        });

        describe("and a valid product to sell", () => {
          describe("and with more than sufficient change than machine can return", () => {
            it("does not sell", () => {
              const result = machine.sell("muesli-bar", {
                "10p": 3,
              });
              expect(result).toHaveProperty("outcome", "failure");
              expect(result).toHaveProperty("reason", "NO_CHANGE_POSSIBLE");
            });
          });
        });

        describe("and a valid product to sell", () => {
          describe("and with more than sufficient change than machine can return", () => {
            describe("but buyer accepts that he/she will get no change", () => {
              it("sells and return no change", () => {
                const result = machine.sell(
                  "coca-cola",
                  {
                    "10p": 1,
                    "2p": 1,
                    "1p": 1,
                  },
                  true
                );
                expect(result).toHaveProperty("outcome", "success");
                expect(result).toHaveProperty("data.productId", "coca-cola");
                expect(result).toHaveProperty("data.change", undefined);
              });
            });
          });
        });
      });
    });
  });
});
