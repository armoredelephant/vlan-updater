## After using the bulk impor tool within the meraki dashboard, this tool can be ran to update the VLAN for each network so there's no need to individually edit each meraki.

## _ This tool will only work with meraki networks with the naming convention ###\_###\_meraki, where the numbers are the 3rd and 4th set of decimals. _

## How to use

- Clone the repo and run npm install at the path.
- Add network name and serial of each network that needs to be imported to the meraki_upload.csv.
- Use the bulk import tool in the Meraki dashboard on the meraki_upload.csv
- In a terminal, navigate to the vlan-updater folder and type the command npm start.
