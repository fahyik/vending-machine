import { calculateChange } from "..";

const infiniteBank = {
  "1p": Number.MAX_SAFE_INTEGER,
  "2p": Number.MAX_SAFE_INTEGER,
  "5p": Number.MAX_SAFE_INTEGER,
  "10p": Number.MAX_SAFE_INTEGER,
  "20p": Number.MAX_SAFE_INTEGER,
  "50p": Number.MAX_SAFE_INTEGER,
  "100p": Number.MAX_SAFE_INTEGER,
  "200p": Number.MAX_SAFE_INTEGER,
};

describe("calculateChange()", () => {
  describe("given an infinite available change", () => {
    describe("given 0 amount", () => {
      const result = calculateChange(infiniteBank, 0);
      it("returns an empty change", () => {
        expect(result).toHaveProperty("outcome", "success");
        expect(result).toHaveProperty("data.change", {
          "1p": 0,
          "2p": 0,
          "5p": 0,
          "10p": 0,
          "20p": 0,
          "50p": 0,
          "100p": 0,
          "200p": 0,
        });
      });
    });

    describe("given a negative amount", () => {
      const result = calculateChange(infiniteBank, -10);
      it("returns a failure", () => {
        expect(result).toHaveProperty("outcome", "failure");
        expect(result).toHaveProperty("reason", "INVALID_AMOUNT_PROVIDED");
      });
    });

    describe("given an amount (10)", () => {
      const result = calculateChange(infiniteBank, 10);
      it("returns the correct change", () => {
        expect(result).toHaveProperty("outcome", "success");
        expect(result).toHaveProperty("data.change", {
          "1p": 0,
          "2p": 0,
          "5p": 0,
          "10p": 1,
          "20p": 0,
          "50p": 0,
          "100p": 0,
          "200p": 0,
        });
      });
    });

    describe("given an amount (9)", () => {
      const result = calculateChange(infiniteBank, 9);
      it("returns the correct change", () => {
        expect(result).toHaveProperty("outcome", "success");
        expect(result).toHaveProperty("data.change", {
          "1p": 0,
          "2p": 2,
          "5p": 1,
          "10p": 0,
          "20p": 0,
          "50p": 0,
          "100p": 0,
          "200p": 0,
        });
      });
    });

    describe("given an amount (8)", () => {
      const result = calculateChange(infiniteBank, 8);
      it("returns the correct change", () => {
        expect(result).toHaveProperty("outcome", "success");
        expect(result).toHaveProperty("data.change", {
          "1p": 1,
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

    describe("given an amount (7)", () => {
      const result = calculateChange(infiniteBank, 7);
      it("returns the correct change", () => {
        expect(result).toHaveProperty("outcome", "success");
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

    describe("given an amount (6)", () => {
      const result = calculateChange(infiniteBank, 6);
      it("returns the correct change", () => {
        expect(result).toHaveProperty("outcome", "success");
        expect(result).toHaveProperty("data.change", {
          "1p": 1,
          "2p": 0,
          "5p": 1,
          "10p": 0,
          "20p": 0,
          "50p": 0,
          "100p": 0,
          "200p": 0,
        });
      });
    });

    describe("given an amount (5)", () => {
      const result = calculateChange(infiniteBank, 5);
      it("returns the correct change", () => {
        expect(result).toHaveProperty("outcome", "success");
        expect(result).toHaveProperty("data.change", {
          "1p": 0,
          "2p": 0,
          "5p": 1,
          "10p": 0,
          "20p": 0,
          "50p": 0,
          "100p": 0,
          "200p": 0,
        });
      });
    });

    describe("given an amount (4)", () => {
      const result = calculateChange(infiniteBank, 4);
      it("returns the correct change", () => {
        expect(result).toHaveProperty("outcome", "success");
        expect(result).toHaveProperty("data.change", {
          "1p": 0,
          "2p": 2,
          "5p": 0,
          "10p": 0,
          "20p": 0,
          "50p": 0,
          "100p": 0,
          "200p": 0,
        });
      });
    });

    describe("given an amount (3)", () => {
      const result = calculateChange(infiniteBank, 3);
      it("returns the correct change", () => {
        expect(result).toHaveProperty("outcome", "success");
        expect(result).toHaveProperty("data.change", {
          "1p": 1,
          "2p": 1,
          "5p": 0,
          "10p": 0,
          "20p": 0,
          "50p": 0,
          "100p": 0,
          "200p": 0,
        });
      });
    });
    describe("given an amount (2)", () => {
      const result = calculateChange(infiniteBank, 2);
      it("returns the correct change", () => {
        expect(result).toHaveProperty("outcome", "success");
        expect(result).toHaveProperty("data.change", {
          "1p": 0,
          "2p": 1,
          "5p": 0,
          "10p": 0,
          "20p": 0,
          "50p": 0,
          "100p": 0,
          "200p": 0,
        });
      });
    });

    describe("given an amount (1)", () => {
      const result = calculateChange(infiniteBank, 1);
      it("returns the correct change", () => {
        expect(result).toHaveProperty("outcome", "success");
        expect(result).toHaveProperty("data.change", {
          "1p": 1,
          "2p": 0,
          "5p": 0,
          "10p": 0,
          "20p": 0,
          "50p": 0,
          "100p": 0,
          "200p": 0,
        });
      });
    });
  });

  describe("given an amount greater than what is available", () => {
    const bank = {
      "1p": 1,
      "2p": 1,
      "5p": 1,
      "10p": 1,
      "20p": 1,
      "50p": 1,
      "100p": 1,
      "200p": 1,
    };
    const result = calculateChange(bank, 10000);
    it("returns a failure", () => {
      expect(result).toHaveProperty("outcome", "failure");
      expect(result).toHaveProperty("reason", "INSUFFICIENT_BALANCE");
    });
  });

  describe("given an amount smaller or equal than what is available", () => {
    describe("but insufficient denominations", () => {
      const bank = {
        "1p": 0,
        "2p": 1,
        "5p": 1,
        "10p": 1,
        "20p": 1,
        "50p": 1,
        "100p": 1,
        "200p": 1,
      };
      const result = calculateChange(bank, 21);
      it("returns a failure", () => {
        expect(result).toHaveProperty("outcome", "failure");
        expect(result).toHaveProperty("reason", "UNABLE_TO_GENERATE_CHANGE");
      });
    });
  });

  describe("given an amount (9)", () => {
    describe("but with missing denominations", () => {
      const bank = {
        "1p": 9,
        "2p": 2,
        "5p": 0,
        "10p": 1,
        "20p": 1,
        "50p": 1,
        "100p": 1,
        "200p": 1,
      };
      const result = calculateChange(bank, 9);
      it("returns the correct change", () => {
        expect(result).toHaveProperty("outcome", "success");
        expect(result).toHaveProperty("data.change", {
          "1p": 5,
          "2p": 2,
          "5p": 0,
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
