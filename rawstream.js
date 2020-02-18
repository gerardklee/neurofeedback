const localPath = '/Users/gerardlee/Desktop/raw.csv'
const Wifi = require('@openbci/wifi');
const shield = 'OpenBCI-9630';
const OpenBCIConsts = require("openbci-utilities").Constants;
const createCsvWriter = require('csv-writer').createArrayCsvWriter;
const csvWriter = createCsvWriter({
  path: localPath,
  header: ['t', 'sample']
});

function init() {
    let wifi = new Wifi({
        debug: false,
        verbose: true,
        latency: 5
    });
    let t = 0;
    wifi.on('sample',(sample) => {
        try {
          const records = [[t, -sample.channelData[0]/1000000]];
          t += 0.004;
          console.log("raw data: "); 
          console.log(-sample.channelData[0]/1000000);
          csvWriter.writeRecords(records)
            .then(() => {
              
            });
        } catch (err) {
          console.log(err);
        }
    })

    wifi.searchToStream({
        sampleRate: 250, 
        shieldName: shield, 
        streamStart: true
      }).catch(console.log);
   
}
init();