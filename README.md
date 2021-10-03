# vending-machine

Vending Machine Programme

## Getting Started

To install package:

- `$ npm install --save @xuffux/vending-machine`

To run the tests:

- `$ npm run test`

The vending machine is provided as an object with the following interface:

```typescript
interface VendingMachine {
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
```

## Example

```javascript
import { buildVendingMachine } from ("@xuffux/vending-machine");

const vendingMachine = buildVendingMachine();

vendingMachine.addProductToInventory({
  id: "coca-cola",
  price: 116,
  quantity: 10,
});
// { outcome: 'success' }

vendingMachine.getInventoryState();
// [ { id: 'coca-cola', price: 116, quantity: 10 } ]

vendingMachine.topUpInventory({ productId: "coca-cola", quantityToAdd: 4 });
// { outcome: 'success' }

vendingMachine.getInventoryState();
// [ { id: 'coca-cola', price: 116, quantity: 14 } ]

vendingMachine.getInventoryHistory();
// [
//   {
//     name: 'ProductAdded',
//     sequence: 1,
//     data: { productId: 'coca-cola', quantity: 10, price: 116 }
//   },
//   {
//     name: 'ProductToppedUp',
//     sequence: 2,
//     data: { productId: 'coca-cola', quantity: 4 }
//   }
// ]

vendingMachine.sell("coca-cola", { "20p": 1 });
// { outcome: 'failure', reason: 'INSUFFICIENT_CASH' }

vendingMachine.sell("coca-cola", { "20p": 6 });
// { outcome: 'failure', reason: 'NO_CHANGE_POSSIBLE' }

vendingMachine.topUpBank({ "1p": 10 });
// { outcome: 'success' }

vendingMachine.sell("coca-cola", { "20p": 6 });
// {
//   outcome: 'success',
//   data: {
//     productId: 'coca-cola',
//     change: {
//       '1p': 4,
//       '2p': 0,
//       '5p': 0,
//       '10p': 0,
//       '20p': 0,
//       '50p': 0,
//       '100p': 0,
//       '200p': 0
//     }
//   }
// }

vendingMachine.getBankState();
// {
//   bank: {
//     '1p': 6,
//     '2p': 0,
//     '5p': 0,
//     '10p': 0,
//     '20p': 6,
//     '50p': 0,
//     '100p': 0,
//     '200p': 0
//   },
//   balance: 126
// }

vendingMachine.getBankHistory();
// [
//   {
//     name: "ChangeAdded",
//     data: {
//       change: {
//         "1p": 10,
//         "2p": 0,
//         "5p": 0,
//         "10p": 0,
//         "20p": 0,
//         "50p": 0,
//         "100p": 0,
//         "200p": 0,
//       },
//       relatedSaleId: undefined,
//     },
//     sequence: 1,
//   },
//   {
//     name: "ChangeAdded",
//     data: {
//       change: {
//         "1p": 0,
//         "2p": 0,
//         "5p": 0,
//         "10p": 0,
//         "20p": 6,
//         "50p": 0,
//         "100p": 0,
//         "200p": 0,
//       },
//       relatedSaleId: "cded8487-8ad2-4765-ad7a-605189814fce",
//     },
//     sequence: 2,
//   },
//   {
//     name: "ChangeRemoved",
//     data: {
//       change: {
//         "1p": 4,
//         "2p": 0,
//         "5p": 0,
//         "10p": 0,
//         "20p": 0,
//         "50p": 0,
//         "100p": 0,
//         "200p": 0,
//       },
//       relatedSaleId: "cded8487-8ad2-4765-ad7a-605189814fce",
//     },
//     sequence: 3,
//   },
// ]
```

You can also choose to initialise the machine with change or products:

```typescript
const vendingMachine = buildVendingMachine({
  initialBank: {
    "1p": 10,
    "2p": 20,
    "5p": 10,
    "10p": 1,
    "20p": 2,
    "50p": 1,
    "100p": 0,
    "200p": 0,
  },
  initialInventory: [
    { id: "apple", price: 13, quantity: 2 },
    { id: "muesli-bar", price: 23, quantity: 2 },
    { id: "coca-cola", price: 7, quantity: 1 },
    { id: "bonbon", price: 17, quantity: 0 },
  ],
});
```

## TODOs / Improvements

### Technical

- vending machine instance is ephemeral, use a data store to persist data
- updates to state and events in the Inventory and Bank objects should be transactional
- concurrent updates to Inventory and Bank objects should also be transactional -> i.e. the sell action
- calculateChange() method can be further optimised (it's possible that it returns no change even if change is possible)

#### Features

- withdraw change from machine
- remove product from machine
- update price of product
- add capacity for bank and inventory
