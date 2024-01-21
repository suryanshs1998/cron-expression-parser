const parseCronField = require("../src/cron-field-parser");
const { CronField } = require("../src/constants");

function generateNumberArray(start, end) {
  return Array.from({ length: end - start + 1 }, (_, i) => i + start);
}

test("Test Asterisk *", async () => {
  expect(parseCronField("*", CronField.MINUTE)).toStrictEqual(
    generateNumberArray(0, 59)
  );

  expect(parseCronField("*", CronField.HOUR)).toStrictEqual(
    generateNumberArray(0, 23)
  );

  expect(parseCronField("*", CronField.DAY)).toStrictEqual(
    generateNumberArray(1, 31)
  );

  expect(parseCronField("*", CronField.MONTH)).toStrictEqual(
    generateNumberArray(1, 12)
  );

  expect(parseCronField("*", CronField.WEEK_DAY)).toStrictEqual(
    generateNumberArray(0, 6)
  );
});

test("Test Range -", async () => {
  expect(parseCronField("1-54", CronField.MINUTE)).toStrictEqual(
    generateNumberArray(1, 54)
  );

  expect(parseCronField("1-10", CronField.HOUR)).toStrictEqual(
    generateNumberArray(1, 10)
  );

  expect(parseCronField("1-30", CronField.DAY)).toStrictEqual(
    generateNumberArray(1, 30)
  );

  expect(parseCronField("0-4", CronField.WEEK_DAY)).toStrictEqual(
    [0, 1, 2, 3, 4]
  );

  expect(() => parseCronField("1-13", CronField.MONTH)).toThrow();

  expect(() => parseCronField("26-31", CronField.WEEK_DAY)).toThrow();

  expect(() => parseCronField("2-2", CronField.HOUR)).toThrow();

  expect(() => parseCronField("5-2", CronField.HOUR)).toThrow();
});

test("Test List or Comma ,", async () => {
  expect(parseCronField("1,3", CronField.MINUTE)).toStrictEqual(
    [1, 3]
  );

  expect(parseCronField("1,10", CronField.HOUR)).toStrictEqual(
    [1, 10]
  );

  expect(parseCronField("30,3", CronField.DAY)).toStrictEqual(
    [30, 3]
  );

  expect(() => parseCronField("1,13", CronField.MONTH)).toThrow();

  expect(() => parseCronField("31,26", CronField.WEEK_DAY)).toThrow();
});

test("Test Interval /", async () => {
  expect(parseCronField("1/21", CronField.MINUTE)).toStrictEqual(
    [1, 22, 43]
  );

  expect(parseCronField("*/5", CronField.HOUR)).toStrictEqual(
    [0, 5, 10, 15, 20]
  );

  expect(parseCronField("7/6", CronField.DAY)).toStrictEqual(
    [7, 13, 19, 25, 31]
  );

  expect(() => parseCronField("7/15", CronField.MONTH)).toThrow();

  expect(() => parseCronField("31/2", CronField.WEEK_DAY)).toThrow();
});

test("Single value or Misc tests", async () => {
  expect(parseCronField("12", CronField.MINUTE)).toStrictEqual(
    [12]
  );

  expect(parseCronField("23", CronField.HOUR)).toStrictEqual(
    [23]
  );

  expect(parseCronField("31", CronField.DAY)).toStrictEqual(
    [31]
  );

  expect(() => parseCronField("14", CronField.MONTH)).toThrow();

  expect(() => parseCronField("-14", CronField.MINUTE)).toThrow();

  expect(() => parseCronField("12a", CronField.MONTH)).toThrow();

  expect(() => parseCronField("a12", CronField.MINUTE)).toThrow();

  expect(() => parseCronField("abc", CronField.WEEK_DAY)).toThrow();

  expect(() => parseCronField("*,3", CronField.HOUR)).toThrow();

  expect(() => parseCronField("*-4", CronField.DAY)).toThrow();

  expect(() => parseCronField("7/1/9", CronField.MINUTE)).toThrow();

});