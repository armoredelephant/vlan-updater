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

const delay = interval => new Promise(resolve => setTimeout(resolve, interval));

const putVLANData = async (network, { url, body }) => {
  await delay(500);

  const put = {
    method: "PUT",
    url: url,
    headers,
    body: JSON.stringify(body)
  };

  return request(put, function(error, _response) {
    if (error) {
      console.log(error.message);
      throw new Error(error);
    }
    console.log(`Network: ${network} has been updated`);
  });
};

const generateNetworkData = async data => {
  const networkName = data["Network name"];
  const networkSplit = networkName.split("_");
  const networkSplitPlusOne = parseInt(networkSplit[1]) + 1;

  const applianceId = `192.168.${networkSplit[0]}.${networkSplitPlusOne}`;
  const subnet = `192.168.${networkSplit[0]}.${networkSplit[1]}`;

  return { networkName: networkName, applianceId: applianceId, subnet: subnet };
};

const loopNetworks = async (networks, networkData) => {
  for (const network of networks) {
    if (networkData.has(network.name)) {
      const networkId = network.id;
      const url = ``; // Edit this with company url, networkId will be used in the url path
      const { subnet, applianceId } = networkData.get(network.name);
      const body = await generateResponseBody(subnet, applianceId);

      const updatedNetworkData = {
        url: url,
        body: body
      };

      networkData.set(network.name, { ...updatedNetworkData });
    }
  }
};

exports.putVLANData = putVLANData;
exports.generateNetworkData = generateNetworkData;
exports.loopNetworks = loopNetworks;
