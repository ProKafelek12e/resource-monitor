import { WebSocketServer } from "ws";
import si from "systeminformation";
import * as os from 'os'
import * as osu from 'node-os-utils';
import cpuStats from 'cpu-stats';

const wss = new WebSocketServer({ port: 8080 });

wss.on("connection", function connection(ws) {
  ws.on("message", function message(data) {
    console.log("received: %s", data);
  });
  
  setInterval(async () => {
    try {

      var system_info = {}

      //-------------------------------------------------
      // RAM 
      //-------------------------------------------------
      
      var totalmem = (os.totalmem()/1024/1024).toFixed(2)
      var freemem = (os.freemem()/1024/1204).toFixed(2)
      var usedmem = totalmem - freemem
      var usedmemp = (usedmem/totalmem * 100).toFixed(2)
      
      system_info.ram = {
        full:totalmem,
        used:usedmem,
        usedp:usedmemp
      }
      
      //-------------------------------------------------
      // CPU 
      //-------------------------------------------------
      
      cpuStats(300, function(err, result) {
          if (err) {
            console.error(err);
            return;
          }
        
          // Calculate the average CPU usage across all cores
          var totalUsage = 0;
          for (var i = 0; i < result.length; i++) {
            totalUsage += result[i].cpu;
          }
        
          var averageUsage = totalUsage / result.length;
      
          system_info.cpu = averageUsage.toFixed(2)
          console.log(system_info)
          ws.send(JSON.stringify(system_info))
        });
      
    } catch (error) {
      console.error("Error sending system information:", error);
    }
  }, 1000);
});