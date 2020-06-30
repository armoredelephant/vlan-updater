const request = require("request");
const headers = require("./headers").headers;

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

const putVLANData = async (data, networks) => {
  try {
    const network = data["Network name"]; // 25_88_meraki
    const networkSplit = network.split("_"); // [25, 88, meraki];

    const networkSplitPlusOne = parseInt(networkSplit[1]) + 1; // 89?
    const applianceId = `192.168.${networkSplit[0]}.${networkSplitPlusOne}`; // 192.168.25.89
    const subnet = `192.168.${networkSplit[0]}.${networkSplit[1]}/29`; // 192.168.25.88

    const body = generateResponseBody(subnet, applianceId);

    let url;
    let networkId;

    for (let i = 0; i < networks.length; i++) {
      if (networks[i].name === network) {
        networkId = networks[i].id;
        url = ``; // edit with url
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
      request(put, function(error, _response) {
        if (error) {
          console.log(error.message);
          throw new Error(error);
        }
        console.log(`Network: ${network} has been updated`);
      });
    }
  } catch (error) {
    console.log(error.message);
  }
};

exports.putVLANData = putVLANData;
