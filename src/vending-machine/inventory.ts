import { v4 as uuidv4 } from "uuid";

interface Product {
  id: string;
  price: number; // cents in integer
}

export interface ProductInventory extends Product {
  quantity: number;
}

export type AddProductOutcome =
  | {
      outcome: "success";
    }
  | {
      outcome: "failure";
      reason: "INVALID_QUANTITY" | "INVALID_PRICE" | "PRODUCT_ALREADY_EXISTS";
    };

export type TopUpProductOutcome =
  | {
      outcome: "success";
    }
  | {
      outcome: "failure";
      reason: "INVALID_QUANTITY" | "PRODUCT_DOES_NOT_EXIST";
    };

export type RetrieveProductOutcome =
  | {
      outcome: "success";
      data: {
        product: ProductInventory;
      };
    }
  | {
      outcome: "failure";
      reason: "PRODUCT_DOES_NOT_EXIST";
    };

export type SellProductOutcome =
  | {
      outcome: "success";
      data: {
        saleId: string;
      };
    }
  | {
      outcome: "failure";
      reason: "INVALID_QUANTITY" | "PRODUCT_DOES_NOT_EXIST";
    };

export interface Inventory {
  // TODO: we assume inventory has infinite capacity for now
  // TODO: add a feature to update product price
  getState(): ProductInventory[];
  getHistory(): InventoryEvent[];

  addProduct(product: ProductInventory): AddProductOutcome;
  topUpProduct(productId: string, quantityToAdd: number): TopUpProductOutcome;
  retrieveProduct(productId: string): RetrieveProductOutcome;
  sellProduct(productId: string): SellProductOutcome;
}

export type InventoryEvent =
  | {
      name: "ProductAdded";
      sequence: number;
      data: {
        productId: string;
        quantity: number;
        price: number;
      };
    }
  | {
      name: "ProductToppedUp";
      sequence: number;
      data: {
        productId: string;
        quantity: number;
      };
    }
  | {
      name: "ProductSold";
      sequence: number;
      data: {
        saleId: string;
        productId: string;
        quantity: 1;
        price: number;
      };
    }
  | {
      name: "ProductPriceUpdated";
      sequence: number;
      data: {
        productId: string;
        newPrice: number;
      };
    };

export function buildInventory(): Inventory {
  const state: Map<string, ProductInventory> = new Map();
  const events: InventoryEvent[] = [];

  function addProduct(product: ProductInventory): AddProductOutcome {
    const existingProduct = state.get(product.id);

    if (existingProduct === undefined) {
      if (product.price < 0) {
        return {
          outcome: "failure",
          reason: "INVALID_PRICE",
        };
      }

      if (product.quantity < 0) {
        return {
          outcome: "failure",
          reason: "INVALID_QUANTITY",
        };
      }

      state.set(product.id, product);

      const eventToAdd: InventoryEvent = {
        name: "ProductAdded",
        sequence: events.length + 1,
        data: {
          productId: product.id,
          quantity: product.quantity,
          price: product.price,
        },
      };

      events.push(eventToAdd);
      return {
        outcome: "success",
      };
    }

    return {
      outcome: "failure",
      reason: "PRODUCT_ALREADY_EXISTS",
    };
  }

  function topUpProduct(
    productId: string,
    quantityToAdd: number
  ): TopUpProductOutcome {
    const existingProduct = state.get(productId);

    if (existingProduct === undefined) {
      return {
        outcome: "failure",
        reason: "PRODUCT_DOES_NOT_EXIST",
      };
    }

    if (quantityToAdd < 0) {
      return {
        outcome: "failure",
        reason: "INVALID_QUANTITY",
      };
    }

    const updatedExistingProduct = {
      ...existingProduct,
      quantity: existingProduct.quantity + quantityToAdd,
    };

    state.set(productId, updatedExistingProduct);

    const eventToAdd: InventoryEvent = {
      name: "ProductToppedUp",
      sequence: events.length + 1,
      data: {
        productId: productId,
        quantity: quantityToAdd,
      },
    };

    events.push(eventToAdd);
    return {
      outcome: "success",
    };
  }

  function retrieveProduct(productId: string): RetrieveProductOutcome {
    const existingProduct = state.get(productId);

    if (existingProduct === undefined) {
      return {
        outcome: "failure",
        reason: "PRODUCT_DOES_NOT_EXIST",
      };
    }

    return {
      outcome: "success",
      data: {
        product: existingProduct,
      },
    };
  }

  function sellProduct(productId: string): SellProductOutcome {
    const existingProduct = state.get(productId);

    if (existingProduct === undefined) {
      return {
        outcome: "failure",
        reason: "PRODUCT_DOES_NOT_EXIST",
      };
    }

    const updatedExistingProduct = {
      ...existingProduct,
      quantity: existingProduct.quantity - 1,
    };

    if (updatedExistingProduct.quantity < 0) {
      return {
        outcome: "failure",
        reason: "INVALID_QUANTITY",
      };
    }

    state.set(productId, updatedExistingProduct);

    const eventToAdd: InventoryEvent = {
      name: "ProductSold",
      sequence: events.length + 1,
      data: {
        productId: productId,
        quantity: 1,
        price: existingProduct.price,
        saleId: uuidv4(),
      },
    };

    events.push(eventToAdd);

    return {
      outcome: "success",
      data: {
        saleId: eventToAdd.data.saleId,
      },
    };
  }

  return {
    getState: () => Array.from(state).map(([, val]) => ({ ...val })),
    getHistory: () =>
      events.map((e) => ({ ...e, data: { ...e.data } } as InventoryEvent)),
    addProduct,
    topUpProduct,
    retrieveProduct,
    sellProduct,
  };
}
