import { WebSocketServer } from "ws";
import si from "systeminformation";
import * as os from 'os'
import * as osu from 'node-os-utils';
import cpuStats from 'cpu-stats';
import { exec } from 'child_process';
const wss = new WebSocketServer({ port: 8080 });

wss.on("connection", function connection(ws) {
  ws.on("message", function message(data) {
    console.log("received: %s", data);
  });
  
  setInterval(async () => {
    try {

      var system_info = {}

      //-------------------------------------------------
      // DISK 
      //-------------------------------------------------
      
      const path = 'C:'; // Change the path to the drive or directory you want to check

      const command = `wmic logicaldisk where "DeviceID='${path}'" get Size,FreeSpace /value`;
      
      exec(command, (error, stdout) => {
        if (error) {
          console.error(error);
          return;
        }
      
        const lines = stdout.trim().split('\n');
        const data = {};
      
        for (const line of lines) {
          const [key, value] = line.split('=');
          data[key.trim()] = value.trim();
        }
      
        const totalSpaceGB = parseInt(data.Size, 10) / (1024 * 1024 * 1024);
        const freeSpaceGB = parseInt(data.FreeSpace, 10) / (1024 * 1024 * 1024);
        const usedSpaceGB = totalSpaceGB - freeSpaceGB;


        system_info.disk = {
          full:totalSpaceGB,
          free:freeSpaceGB,
          used:usedSpaceGB,
          usedp: (usedSpaceGB/totalSpaceGB *100)
        }
      });

      //-------------------------------------------------
      // IP 
      //-------------------------------------------------

      const networkInterfaces = os.networkInterfaces();
      
      // Filter and find the local (internal) IP address
      const localIpAddress = Object.keys(networkInterfaces)
        .map((interfaceName) =>
          networkInterfaces[interfaceName].find((info) => info.family === 'IPv4' && !info.internal)
        )
        .filter((info) => info !== undefined)[0].address;
      
      system_info.ip = localIpAddress

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
          ws.send(JSON.stringify(system_info))
        });
      
    } catch (error) {
      console.error("Error sending system information:", error);
    }
  }, 1000);
});