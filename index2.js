const knx = require('knx');

const addressCurrentTemperature = "1/0/0";
const addressDesiredTemperatureIn = "1/0/2";
const addressDesiredTemperatureOut = "1/0/3";

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }
  


const connection = new knx.Connection({
    ipAddr: '192.168.0.125',
    ipPort: 3671,
    physAddr: '1.1.1',
    handlers: {
        // wait for connection establishment before sending anything!
        connected: function () {
            console.log('Hurray, I can talk KNX!');

            const dataPointCurrentTemperature = new knx.Datapoint({
                ga: addressCurrentTemperature,
                dpt: 'DPT9'
            });
            const dataPointDesiredTemperatureIn = new knx.Datapoint({
                ga: addressDesiredTemperatureIn,
                dpt: 'DPT9'
            });
            const dataPointDesiredTemperatureOut = new knx.Datapoint({
                ga: addressDesiredTemperatureOut,
                dpt: 'DPT9'
            });

            dataPointCurrentTemperature.bind(connection);
            dataPointDesiredTemperatureIn.bind(connection);
            dataPointDesiredTemperatureOut.bind(connection);

            // console.log(dataPointDesiredTemperatureOut.eventNames());

            // dataPointDesiredTemperatureOut.on('change', (old, val) => {
            //     console.log(`Desired change from ${old} to ${val}`);
            // });

            connection.on(`GroupValue_Write_${addressDesiredTemperatureOut}`, (src, val) => {
                // console.log(`Desired changeto ${val}`);
                dataPointDesiredTemperatureOut.read((src, val) => console.log(`Desired temp is again ${val} \n`));
            })

            setInterval(() => {
                const randomDesiredTemp = getRandomInt(6) + 20;

                dataPointCurrentTemperature.read((src, val) => console.log('Current temp is ', val));
                // dataPointDesiredTemperatureOut.read((src, val) => console.log('Desired temp is ', val));

                console.log("Setting desired temp to ", randomDesiredTemp);
                dataPointDesiredTemperatureIn.write(randomDesiredTemp);
                // dataPointDesiredTemperatureOut.read((src, val) => console.log('Desired temp is again ', val));
                
            }, 5000);
        },
        // get notified for all KNX events:
        event: function (evt, src, dest, value) {
            // console.log(
            //     "event: %s, src: %j, dest: %j, value: %j",
            //     evt, src, dest, value
            // );
        },
        // get notified on connection errors
        error: function (connstatus) {
            console.log("**** ERROR: %j", connstatus);
        }
    }
});
