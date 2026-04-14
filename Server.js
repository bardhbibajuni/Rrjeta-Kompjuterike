const dgram = require("dgram");
const fs = require("fs");

const PORT = 4444;
const HOST = "0.0.0.0";

const server = dgram.createSocket("udp4");


const clients = {
    "192.168.1.10": { role: "admin" },
    "192.168.1.11": { role: "reader" },
    "192.168.1.12": { role: "reader" },
    "192.168.1.13": { role: "reader" }
};

server.on("message", (msg, rinfo) => {
    const text = msg.toString();


    const clientIP = rinfo.address;
    const client = clients[clientIP] || { role: "reader" };
    
    console.log("\n==============================");
    console.log(`Client IP: ${ip}`);
    console.log(`Port: ${rinfo.port}`);
    console.log(`Role: ${client.role}`);
    console.log(`Message: ${text}`);
    console.log("\n==============================");


    console.log(`Client i lidhur: ${rinfo.address}:${rinfo.port}`);
    console.log("Mesazhi:", text);

    const response = `Serveri ka pranuar: ${text}`;
    server.send(response, rinfo.port, rinfo.address);
});
server.bind(PORT, HOST, () => {
    console.log(` UDP Serveri eshte on ne: 
         IP: ${HOST} 
         Porti:${PORT}`);
});

