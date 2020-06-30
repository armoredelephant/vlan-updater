const fs = require("fs");
const csv = require("csv-parser");
const putVLANData = require("./helpers").putVLANData;

const updateVlans = async (filePath, networks) => {
  try {
    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", data => {
        putVLANData(data, networks);
      });
  } catch (error) {
    throw new Error(error);
  }
};

exports.updateVlans = updateVlans;
