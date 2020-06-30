const key = process.env.MERAKI_KEY;

const headers = {
  "Content-Type": "application/json",
  Accept: "application/json",
  "X-Cisco-Meraki-API-Key": key
};

const options = {
  method: "GET",
  url: ``, // edit with url
  headers
};

exports.headers = headers;
exports.options = options;
