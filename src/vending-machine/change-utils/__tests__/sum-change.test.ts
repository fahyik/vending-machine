import { sumChange } from "..";

describe("sumChange()", () => {
  describe("given a change object", () => {
    it("returns the correct sum", () => {
      const change = {
        "1p": 1,
        "2p": 1,
        "5p": 1,
        "10p": 1,
        "20p": 1,
        "50p": 1,
        "100p": 1,
        "200p": 1,
      };

      const sum = sumChange(change);
      expect(sum).toEqual(388);
    });
  });
});
