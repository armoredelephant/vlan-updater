const updateVlans = require("./updateVlans").updateVlans;
const dotenv = require("dotenv");

const args = process.argv.slice(2);

const filePath = args[0];

(async () => {
  try {
    await dotenv.config();
    await updateVlans(filePath);
  } catch (error) {
    throw new Error(error);
  }
})();
