const dgram = require("dgram");
const fs = require("fs");

const PORT = 4444;
const HOST = "0.0.0.0";

const server = dgram.createSocket("udp4");

server.on("message", (msg, rinfo) => {
    const text = msg.toString();
    
    console.log("\n==============================");
    console.log(`IP: ${rinfo.address}`);
    console.log(`PORT: ${rinfo.port}`);
    console.log("==============================");


    console.log(`Client i lidhur: ${rinfo.address}:${rinfo.port}`);
    console.log("Mesazhi:", text);

    const response = `Serveri ka pranuar: ${text}`;
    server.send(response, rinfo.port, rinfo.address);
});


