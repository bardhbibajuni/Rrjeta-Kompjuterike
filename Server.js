const dgram = require("dgram");
const fs = require("fs");

const PORT = 4444;
const HOST = "0.0.0.0";

const server = dgram.createSocket("udp4");

server.on("message", (msg, rinfo) => {
    const text = msg.toString();

    console.log(`Client connected: ${rinfo.address}:${rinfo.port}`);
    console.log("Message:", text);

    const response = text.toUpperCase();
    server.send(response, rinfo.port, rinfo.address);
});


