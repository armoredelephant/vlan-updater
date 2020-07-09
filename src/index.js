const axios = require("axios");
const csv = require("csv-parser");
const dotenv = require("dotenv");
const fs = require("fs");
const options = require("./headers").options;
const generateNetworkData = require("./helpers").generateNetworkData;
const loopNetworks = require("./helpers").loopNetworks;
const putVLANData = require("./helpers").putVLANData;

// handle script args
const args = process.argv.slice(2);
const filePath = args[0];

// stream setup
const file = fs.createReadStream(filePath);
const stream = file.pipe(csv());

const streamEnd = new Promise((resolve, reject) => {
  const networkData = new Map();
  stream.on("data", async data => {
    const { networkName, applianceId, subnet } = await generateNetworkData(
      data
    );

    networkData.set(networkName, {
      applianceId: applianceId,
      subnet: subnet
    });
  });
  stream.on("error", reject);
  stream.on("end", resolve(networkData));
});

// start calls
(async () => {
  try {
    dotenv.config();

    const response = await axios(options);
    const networks = await response.data;

    let networkData = await streamEnd;

    await loopNetworks(networks, networkData);

    for (const network of networkData) {
      await putVLANData(network[0], network[1]);
    }
  } catch (error) {
    throw new Error(error);
  }
})();
