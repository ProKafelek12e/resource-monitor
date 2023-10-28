import { WebSocketServer } from "ws";
import si from "systeminformation";
import * as os from 'os'
import osUtils from 'os-utils'

const wss = new WebSocketServer({ port: 8080 });

wss.on("connection", function connection(ws) {
  ws.on("message", function message(data) {
    console.log("received: %s", data);
  });
  
  setInterval(async () => {
    try {
      const systemInfo = {
        osUptime: os.uptime(),
        ramUsage: (1 - os.freemem() / os.totalmem()) * 100 + "%"
      };
      
      osUtils.cpuUsage(function (cpuUsage) {
        systemInfo.cpuUsage = cpuUsage * 100;
        ws.send(JSON.stringify(systemInfo));
      });
    } catch (error) {
      console.error("Error sending system information:", error);
    }
  }, 1000);
});
