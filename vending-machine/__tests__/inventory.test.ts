import { buildInventory } from "../inventory";

describe("#inventory", () => {
  describe("inventory.addProduct()", () => {
    describe("given an empty inventory", () => {
      const inventory = buildInventory();
      describe("and a valid product", () => {
        const productToAdd = {
          id: "apple",
          price: 10,
          quantity: 10,
        };
        it("adds the product to the inventory", () => {
          const result = inventory.addProduct(productToAdd);
          expect(result).toHaveProperty("outcome", "success");

          expect(inventory.getState()[0]).toEqual(productToAdd);
        });

        it("creates a ProductAdded event", () => {
          const createdEvent = inventory.getHistory().pop();
          expect(createdEvent).toHaveProperty("name", "ProductAdded");
        });
      });

      describe("and a product with invalid price", () => {
        const productToAdd = {
          id: "orange",
          price: -10,
          quantity: 10,
        };
        it("does not add the product to the inventory", () => {
          const result = inventory.addProduct(productToAdd);
          expect(result).toHaveProperty("outcome", "failure");
          expect(result).toHaveProperty("reason", "INVALID_PRICE");
        });
      });

      describe("and a product with invalid quantity", () => {
        const productToAdd = {
          id: "coke",
          price: 10,
          quantity: -10,
        };
        it("does not add the product to the inventory", () => {
          const result = inventory.addProduct(productToAdd);
          expect(result).toHaveProperty("outcome", "failure");
          expect(result).toHaveProperty("reason", "INVALID_QUANTITY");
        });
      });
    });
    describe("given an inventory with a single product", () => {
      const inventory = buildInventory();

      describe("and the same product to add", () => {
        const productToAdd = {
          id: "apple",
          price: 10,
          quantity: 10,
        };
        inventory.addProduct(productToAdd);
        it("does not add the product to the inventory", () => {
          const result = inventory.addProduct(productToAdd);
          expect(result).toHaveProperty("outcome", "failure");
          expect(result).toHaveProperty("reason", "PRODUCT_ALREADY_EXISTS");

          expect(inventory.getState()).toHaveLength(1);
        });
      });
    });
  });

  describe("inventory.retrieve()", () => {
    describe("given an inventory with a single product", () => {
      const inventory = buildInventory();
      const product = {
        id: "apple",
        price: 10,
        quantity: 10,
      };
      inventory.addProduct(product);

      describe("and the same product to retrieve", () => {
        it("retrieves the product from the inventory", () => {
          const result = inventory.retrieveProduct(product.id);
          expect(result).toHaveProperty("outcome", "success");
          expect(result).toHaveProperty("data.product", product);
        });
      });

      describe("and another product to retrieve", () => {
        it("does not retrieve the product from the inventory", () => {
          const result = inventory.retrieveProduct("orange");
          expect(result).toHaveProperty("outcome", "failure");
          expect(result).toHaveProperty("reason", "PRODUCT_DOES_NOT_EXIST");
        });
      });
    });
  });

  describe("inventory.topUpProduct()", () => {
    describe("given an empty inventory", () => {
      const inventory = buildInventory();
      describe("and a product to top up", () => {
        it("does not top up the product", () => {
          const result = inventory.topUpProduct("apple", 10);
          expect(result).toHaveProperty("outcome", "failure");
          expect(result).toHaveProperty("reason", "PRODUCT_DOES_NOT_EXIST");
        });
      });
    });
    describe("given an inventory with a single product", () => {
      const inventory = buildInventory();

      describe("and the same product to top up with a valid quantity", () => {
        const productToAdd = {
          id: "apple",
          price: 10,
          quantity: 10,
        };
        inventory.addProduct(productToAdd);
        const quantityToAdd = 10;
        it("tops up the product in the inventory", () => {
          const result = inventory.topUpProduct("apple", quantityToAdd);
          expect(result).toHaveProperty("outcome", "success");

          expect(inventory.getState()[0]).toEqual({
            ...productToAdd,
            quantity: productToAdd.quantity + quantityToAdd,
          });
        });

        it("creates a ProductToppedUp event", () => {
          const createdEvent = inventory.getHistory().pop();
          expect(createdEvent).toHaveProperty("name", "ProductToppedUp");
        });
      });

      describe("and the same product to top up with an invalid quantity", () => {
        const productToAdd = {
          id: "apple",
          price: 10,
          quantity: 10,
        };
        inventory.addProduct(productToAdd);
        const quantityToAdd = -10;
        it("does not top up the product", () => {
          const result = inventory.topUpProduct("apple", quantityToAdd);
          expect(result).toHaveProperty("outcome", "failure");
          expect(result).toHaveProperty("reason", "INVALID_QUANTITY");
        });
      });
    });
  });

  describe("inventory.sellProduct()", () => {
    describe("given an inventory with a single available product", () => {
      const inventory = buildInventory();
      const productToAdd = {
        id: "apple",
        price: 10,
        quantity: 10,
      };
      inventory.addProduct(productToAdd);

      describe("and a different product to sell", () => {
        it("does not sell the product", () => {
          const result = inventory.sellProduct("orange");
          expect(result).toHaveProperty("outcome", "failure");
          expect(result).toHaveProperty("reason", "PRODUCT_DOES_NOT_EXIST");
        });
      });

      describe("and the same product to sell", () => {
        it("sells the product", () => {
          const result = inventory.sellProduct("apple");
          expect(result).toHaveProperty("outcome", "success");

          expect(inventory.getState()[0]).toEqual({
            ...productToAdd,
            quantity: productToAdd.quantity - 1,
          });
        });

        it("creates a ProductSold event", () => {
          const createdEvent = inventory.getHistory().pop();
          expect(createdEvent).toHaveProperty("name", "ProductSold");
        });
      });
    });

    describe("given an inventory with a single non-available product", () => {
      const inventory = buildInventory();
      const productToAdd = {
        id: "apple",
        price: 10,
        quantity: 0,
      };
      inventory.addProduct(productToAdd);

      describe("and the same product to sell", () => {
        it("does not sell the product", () => {
          const result = inventory.sellProduct("apple");
          expect(result).toHaveProperty("outcome", "failure");
          expect(result).toHaveProperty("reason", "INVALID_QUANTITY");
        });
      });
    });
  });
});
