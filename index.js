const parseCronExpression = require("./src/cron-expression-parser.js");

main();

function main() {

  // IF insufficient or extra fields passed to node script call
  if (process.argv.length != 3) {
    throw new Error("Use format: node index.js <cron_expression>")
  }

  parseCronExpression(process.argv[2]);
}