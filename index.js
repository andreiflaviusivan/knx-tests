const {KNXTunnelSocket, DataPoints, KNXAddress} = require("knx-ip");

const knxClient = new KNXTunnelSocket("1.1.1");

knxClient.on(KNXTunnelSocket.KNXTunnelSocketEvents.error, err => {
    if (err) {
        console.log(err);
    }
});

const wait = (t=3000) => {
    return new Promise(resolve => {
        setTimeout(() => { resolve(); }, t);
    });
};

const handleBusEvent = function(srcAddress, dstAddress, npdu) {
    console.log(`${srcAddress.toString()} -> ${dstAddress.toString()} :`, npdu.dataValue);
};

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

const randomDesiredTemp = getRandomInt(6) + 20;

const addressCurrentTemperature = KNXAddress.createFromString("1/0/0", KNXAddress.TYPE_GROUP);
const addressDesiredTemperatureIn = KNXAddress.createFromString("1/0/3", KNXAddress.TYPE_GROUP);
const addressDesiredTemperatureOut = KNXAddress.createFromString("1/0/2", KNXAddress.TYPE_GROUP);

const dataPointCurrentTemperature = new DataPoints.Temperature(addressCurrentTemperature);
const dataPointDesiredTemperatureIn = new DataPoints.Temperature(addressDesiredTemperatureIn);
const dataPointDesiredTemperatureOut = new DataPoints.Temperature(addressDesiredTemperatureOut);

dataPointCurrentTemperature.bind(knxClient);
dataPointDesiredTemperatureIn.bind(knxClient);
dataPointDesiredTemperatureOut.bind(knxClient);

knxClient.connectAsync("192.168.0.125", 3671)
	.then(() => console.log("Connected through channel id ", knxClient.channelID))
	.then(() => {
        console.log("Starting bus monitoring");
        knxClient.on("indication", handleBusEvent);
        //knxClient.monitorBus()
    })
	.then(() => console.log("Reading current temp"))
	.then(() => dataPointCurrentTemperature.read())
	.then(current => console.log("Current temp:", current))	
	.then(() => console.log("Reading desired temp"))
	.then(() => dataPointDesiredTemperatureOut.read())
	.then(desired => console.log("Desired temp:", desired))
	// .then(() => wait(10000))
	.then(() => console.log("Setting desired temp to ", randomDesiredTemp, dataPointDesiredTemperatureIn.value))
	.then(() => dataPointDesiredTemperatureIn.write(randomDesiredTemp))
	// .then(() => wait())
	.then(() => console.log("Reading desired temp again"))
	.then(() => dataPointDesiredTemperatureOut.read())
	.then(desired => console.log("Desired temp again:", desired))
	.catch(err => {console.log(err);})
    .then(() => {
		knxClient.close();
		
		process.exit(0);
	});

