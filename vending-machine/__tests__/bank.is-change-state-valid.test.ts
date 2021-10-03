import { isChangeStateValid } from "../bank";

describe("isChangeStateValid()", () => {
  describe("given a valid bank state", () => {
    it("returns valid", () => {
      expect(
        isChangeStateValid({
          "1p": 5,
          "2p": 0,
          "5p": 1,
          "10p": 0,
          "20p": 1,
          "50p": 23,
          "100p": 0,
          "200p": 6,
        })
      ).toEqual(true);
    });
  });
  describe("given a zero bank state", () => {
    it("returns valid", () => {
      expect(
        isChangeStateValid({
          "1p": 0,
          "2p": 0,
          "5p": 0,
          "10p": 0,
          "20p": 0,
          "50p": 0,
          "100p": 0,
          "200p": 0,
        })
      ).toEqual(true);
    });
  });
  describe("given a some negative values in bank state", () => {
    it("returns invalid", () => {
      expect(
        isChangeStateValid({
          "1p": 5,
          "2p": 0,
          "5p": 1,
          "10p": 0,
          "20p": 1,
          "50p": 3,
          "100p": -6,
          "200p": 6,
        })
      ).toEqual(false);
    });
  });
});
