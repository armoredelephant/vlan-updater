const fs = require("fs");
const csv = require("csv-parser");
const axios = require("axios");
const request = require("request");

const key = process.env.MERAKI_KEY;

const headers = {
  "Content-Type": "application/json",
  Accept: "application/json",
  "X-Cisco-Meraki-API-Key": key
};

const generateResponseBody = (subnet, applianceId) => {
  const body = {
    name: "",
    applianceIp: `${applianceId}`,
    subnet: `${subnet}`,
    groupPolicyId: "",
    fixedIpAssignments: {},
    reservedIpRanges: [],
    dnsNameservers: "",
    dhcpHandling: "Run a DHCP server",
    dhcpLeaseTime: "1 day",
    dhcpBootOptionsEnabled: false,
    dhcpOptions: [
      {
        code: "15",
        type: "text",
        value: ""
      },
      {
        code: "150",
        type: "IP",
        value: ""
      }
    ]
  };

  return body;
};

const updateVlans = async filePath => {
  try {
    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", data => {
        const network = data["Network name"]; // 25_88_meraki
        const networkSplit = network.split("_"); // [25, 88, meraki];

        const networkSplitPlusOne = parseInt(networkSplit[1]) + 1; // 89?
        const applianceId = `192.168.${networkSplit[0]}.${networkSplitPlusOne}`; // 192.168.25.89
        const subnet = `192.168.${networkSplit[0]}.${networkSplit[1]}/29`; // 192.168.25.88

        const body = generateResponseBody(subnet, applianceId);
        const getOptions = {
          method: "GET",
          url: ``,
          headers
        };

        axios(getOptions).then(res => {
          const data = res.data;
          let url;
          let networkId;

          for (let i = 0; i < data.length; i++) {
            if (data[i].name === network) {
              networkId = data[i].id;
              url = ``;
              break;
            }
          }

          if (!url || !networkId) {
            throw new Error(`No matched network for ${network}`);
          } else {
            const put = {
              method: "PUT",
              url: url,
              headers,
              body: JSON.stringify(body)
            };
            request(put, function(error, response) {
              if (error) {
                throw new Error(error);
              }
              console.log(`Network: ${network} has been updated`);
            });
          }
        });
      });
  } catch (error) {
    throw new Error(error);
  }
};

exports.updateVlans = updateVlans;
