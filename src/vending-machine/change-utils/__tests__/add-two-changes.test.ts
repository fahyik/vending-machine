import { addTwoChanges } from "..";

describe("addTwoChanges()", () => {
  describe("given two change objects", () => {
    it("returns the correct addition", () => {
      const changeOne = {
        "1p": 1,
        "2p": 1,
        "5p": 1,
        "10p": 1,
        "20p": 1,
        "50p": 1,
        "100p": 1,
        "200p": 1,
      };

      const changeTwo = {
        "1p": 1,
        "2p": 2,
        "5p": 3,
        "10p": 4,
        "20p": 5,
        "50p": 6,
        "100p": 7,
        "200p": 8,
      };

      const newChange = addTwoChanges(changeOne, changeTwo);
      expect(newChange).toStrictEqual({
        "1p": changeOne["1p"] + changeTwo["1p"],
        "2p": changeOne["2p"] + changeTwo["2p"],
        "5p": changeOne["5p"] + changeTwo["5p"],
        "10p": changeOne["10p"] + changeTwo["10p"],
        "20p": changeOne["20p"] + changeTwo["20p"],
        "50p": changeOne["50p"] + changeTwo["50p"],
        "100p": changeOne["100p"] + changeTwo["100p"],
        "200p": changeOne["200p"] + changeTwo["200p"],
      });
    });
  });
});
