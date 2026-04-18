
//  UDP CLIENT - Group 7 | JavaScript
//  Rrjeta Kompjuterike 2025/26


const dgram    = require("dgram");
const readline = require("readline");
const os       = require("os");


const SERVER_PORT = 4444;
const SERVER_HOST = "127.0.0.1";  // me ndrru ip me e shkru te fk
const CLIENT_PORT = 5000;         

const clientRoles = {
    "192.168.1.10": "admin",
    "192.168.1.11": "reader",
    "192.168.1.12": "reader",
    "192.168.1.13": "reader",
    
};
function getLocalIP() {
    const nets = os.networkInterfaces();
    for (const name of Object.keys(nets)) {
        for (const net of nets[name]) {
            if(net.family === "IPv4" && !net.internal) {
                return net.address;
            }
        }
    }
    return "127.0.0.1";
}
    const MY_IP = getLocalIP();
    const MY_ROLE = clientRoles[MY_IP] || "reader";
    const client = dgram.createSocket("udp4");
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
 client.bind(CLIENT_PORT, () => {
    console.log("\nUDP klienti u nis me sukses.");
    console.log(`Roli: ${MY_ROLE}`);
    console.log(`IP e klientit: ${MY_IP}`);
    console.log(`Porti i klientit: ${CLIENT_PORT}`);
    console.log(`Serveri: ${SERVER_HOST}:${SERVER_PORT}\n`);

     showMenu();
 });
    
client.on("message", (msg) => {
    const response = msg.toString();
    
    console.log("\n Pergjigje nga serveri:");
    console.log("--------------------------------");

    response.split("\n").forEach((line) => {
        console.log("> " + line);
    });

    console.log("--------------------------------\n");

    showMenu();
});

client.on("error", (err) => {
    console.error(`Gabim ne socket: ${err.message}`);
    client.close();
    process.exit(1);
});

function sendToServer(command) {
    const message = `${MY_IP}:${CLIENT_PORT}:${command}`;
    const buffer = Buffer.from(message);

    client.send(buffer, SERVER_PORT, SERVER_HOST, (err) => {
        if(err) {
            console.error(`Dergimi deshtoi: ${err.message}`);
            showMenu();
        }
        else {
            console.log(`\n>> U dergua: "${message}"`);
            console.log("Ne pritje te pergjigjes nga serveri...\n");
        }
    });
}

    




                
     

