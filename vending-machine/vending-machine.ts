import Joi from "joi";
import { BankEvent, buildBank, Change, UpdateChangeOutcome } from "./bank";
import {
  AddProductOutcome,
  buildInventory,
  InventoryEvent,
  ProductInventory,
  TopUpProductOutcome,
} from "./inventory";
import { addTwoChanges, calculateChange, sumChange } from "./change-utils";

export type SellOutcome =
  | {
      outcome: "success";
      data: {
        productId: string;
        change?: Change;
      };
    }
  | {
      outcome: "failure";
      reason:
        | "INSUFFICIENT_CASH"
        | "PRODUCT_DOES_NOT_EXIST"
        | "PRODUCT_IS_SOLD_OUT"
        | "NO_CHANGE_POSSIBLE";
    };

export type FailedValidationOutcome = {
  outcome: "failure";
  reason: "INVALID_INPUT";
  data: any;
};

export interface VendingMachine {
  addProductToInventory(
    product: ProductInventory
  ): AddProductOutcome | FailedValidationOutcome;
  topUpInventory(product: {
    productId: string;
    quantityToAdd: number;
  }): TopUpProductOutcome | FailedValidationOutcome;
  topUpBank(
    change: Partial<Change>
  ): UpdateChangeOutcome | FailedValidationOutcome;

  getBankState(): { bank: Change; balance: number };
  getBankHistory(): BankEvent[];
  getInventoryState(): ProductInventory[];
  getInventoryHistory(): InventoryEvent[];

  sell(
    productId: string,
    change: Partial<Change>,
    acceptNoChange?: boolean
  ): SellOutcome | FailedValidationOutcome;
}

const changeValidationSchema = Joi.object()
  .keys({
    "1p": Joi.number().integer().min(0).default(0),
    "2p": Joi.number().integer().min(0).default(0),
    "5p": Joi.number().integer().min(0).default(0),
    "10p": Joi.number().integer().min(0).default(0),
    "20p": Joi.number().integer().min(0).default(0),
    "50p": Joi.number().integer().min(0).default(0),
    "100p": Joi.number().integer().min(0).default(0),
    "200p": Joi.number().integer().min(0).default(0),
  })
  .required()
  .strict();

const productInventoryValidationSchema = Joi.object()
  .keys({
    id: Joi.string().required(),
    price: Joi.number().integer().min(0).required(),
    quantity: Joi.number().integer().min(0).required(),
  })
  .required()
  .strict();

const productInventoriesValidationSchema = Joi.array().items(
  productInventoryValidationSchema
);

const productInventoryTopUpValidationSchema = Joi.object()
  .keys({
    productId: Joi.string().required(),
    quantityToAdd: Joi.number().integer().min(0).required(),
  })
  .required()
  .strict();

export function buildVendingMachine(init?: {
  initialInventory?: ProductInventory[];
  initialBank?: Change;
}): VendingMachine {
  // setup
  const bank = buildBank();
  const inventory = buildInventory();

  if (init?.initialInventory) {
    const inventoryValidation = productInventoriesValidationSchema.validate(
      init.initialInventory
    );

    if (inventoryValidation.error) {
      throw inventoryValidation.error;
    }

    for (const product of inventoryValidation.value) {
      const addProductResult = inventory.addProduct(product);

      if (addProductResult.outcome === "failure") {
        throw new Error(
          `Failed to set up inventory: ${addProductResult.reason}`
        );
      }
    }
  }

  if (init?.initialBank) {
    const addInitialBankResult = topUpBank(init.initialBank);

    if (addInitialBankResult.outcome === "failure") {
      throw new Error(
        `Failed to set up inventory: ${addInitialBankResult.reason}`
      );
    }
  }

  function addProductToInventory(
    product: ProductInventory
  ): AddProductOutcome | FailedValidationOutcome {
    const productionValidation =
      productInventoryValidationSchema.validate(product);

    if (productionValidation.error) {
      return {
        outcome: "failure",
        reason: "INVALID_INPUT",
        data: productionValidation.error,
      };
    }

    return inventory.addProduct(productionValidation.value);
  }

  function topUpInventory(product: {
    productId: string;
    quantityToAdd: number;
  }): TopUpProductOutcome | FailedValidationOutcome {
    const inventoryValidation =
      productInventoryTopUpValidationSchema.validate(product);

    if (inventoryValidation.error) {
      return {
        outcome: "failure",
        reason: "INVALID_INPUT",
        data: inventoryValidation.error,
      };
    }

    return inventory.topUpProduct(
      inventoryValidation.value.productId,
      inventoryValidation.value.quantityToAdd
    );
  }

  function topUpBank(
    change: Change
  ): UpdateChangeOutcome | FailedValidationOutcome {
    const changeValidation = changeValidationSchema.validate(change);

    if (changeValidation.error) {
      return {
        outcome: "failure",
        reason: "INVALID_INPUT",
        data: changeValidation.error,
      };
    }

    return bank.addChange(changeValidation.value);
  }

  function sell(
    productId: string,
    change: Partial<Change>,
    acceptNoChange: boolean = false
  ): SellOutcome | FailedValidationOutcome {
    const changeValidation = changeValidationSchema.validate(change);

    if (changeValidation.error) {
      return {
        outcome: "failure",
        reason: "INVALID_INPUT",
        data: changeValidation.error,
      };
    }
    const insertedChange = changeValidation.value;

    const retrieveProductResult = inventory.retrieveProduct(productId);
    if (retrieveProductResult.outcome === "failure") {
      return {
        outcome: "failure",
        reason: retrieveProductResult.reason,
      };
    }
    const product = retrieveProductResult.data.product;

    if (sumChange(insertedChange) < product.price) {
      return {
        outcome: "failure",
        reason: "INSUFFICIENT_CASH",
      };
    }

    if (product.quantity < 1) {
      return {
        outcome: "failure",
        reason: "PRODUCT_IS_SOLD_OUT",
      };
    }

    var changeReturn: Change | undefined = undefined;

    if (sumChange(insertedChange) - product.price > 0) {
      const calculateChangeResult = calculateChange(
        addTwoChanges(bank.getState(), insertedChange),
        sumChange(insertedChange) - product.price
      );

      if (calculateChangeResult.outcome === "failure") {
        if (calculateChangeResult.reason === "INVALID_AMOUNT_PROVIDED") {
          throw new Error("Something went wrong");
        }

        if (!acceptNoChange) {
          // TODO: we could let buyer override this by accepting that they will not be given change
          return {
            outcome: "failure",
            reason: "NO_CHANGE_POSSIBLE",
          };
        }
      } else {
        changeReturn = calculateChangeResult.data.change;
      }
    }

    // NOTE: the following block should be transactional
    // -----
    const saleResult = inventory.sellProduct(productId);

    if (saleResult.outcome === "failure") {
      throw new Error("Something went wrong");
    }

    const saleAddChangeResult = bank.addChange(insertedChange, {
      saleId: saleResult.data.saleId,
    });
    if (saleAddChangeResult.outcome === "failure") {
      throw new Error("Something went wrong");
    }

    if (changeReturn) {
      const saleRemoveChangeResult = bank.removeChange(changeReturn, {
        saleId: saleResult.data.saleId,
      });
      if (saleRemoveChangeResult.outcome === "failure") {
        throw new Error("Something went wrong");
      }
    }
    // -----

    return {
      outcome: "success",
      data: {
        productId,
        change: changeReturn,
      },
    };
  }

  return {
    getBankState: () => ({ bank: bank.getState(), balance: bank.getBalance() }),
    getBankHistory: bank.getHistory,
    getInventoryState: inventory.getState,
    getInventoryHistory: inventory.getHistory,
    addProductToInventory,
    topUpInventory,
    topUpBank,
    sell,
  };
}
