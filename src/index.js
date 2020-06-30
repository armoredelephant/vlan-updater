const updateVlans = require("./updateVlans").updateVlans;
const dotenv = require("dotenv");
const axios = require("axios");
const options = require("./headers").options;

const args = process.argv.slice(2);

const filePath = args[0];

(async () => {
  try {
    dotenv.config();

    const response = await axios(options);
    const networks = response.data;

    await updateVlans(filePath, networks);
  } catch (error) {
    throw new Error(error);
  }
})();
