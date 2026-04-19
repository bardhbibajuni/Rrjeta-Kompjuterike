
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

function showMenu() {
    console.log("===============================");
    console.log(`Menu e klientit (${MY_ROLE})`);
    console.log("===============================");

    if (MY_ROLE ==="admin") {
        console.log("1. READ_FILE");
        console.log("2. WRITE_FILE");
        console.log("3. LIST_PERMISSIONS");
        console.log("4. SEND_MESSAGE");
        console.log("5. EXIT");
    }
    else {
        console.log("1. READ_FILE");
        console.log("2. SEND_MESSAGE");
        console.log("3. EXIT");
    }

    rl.question("\nZgjedh opsionin: ", handleInput);
}
    
function handleInput(input) {
    const choice = input.trim();

    if (CLIENT_ROLE === "admin") {
        switch (choice) {
            case "1":
                sendToServer("READ_FILE");
                break;

            case "2":
                rl.question("Shkruj permbajtjen e re: ", (content) => {
                    if (content.trim() === "") {
                        console.log("Teksti nuk mund te jete bosh.\n");
                        showMenu();
                    } else {
                        sendToServer(`WRITE_FILE:${content.trim()}`);
                    }
                });
                break;

            case "3":
                sendToServer("LIST_PERMISSIONS");
                break;
          case "4":
                rl.question("Shkruj mesazhin: ", (msg) => {
                    if (msg.trim() === "") {
                        console.log("Mesazhi nuk mund te jete bosh.\n");
                        showMenu();
                    } else {
                        sendToServer(msg.trim());
                    }
                });
                break;

            case "5":
                console.log("\nKlienti u mbyll.\n");
                rl.close();
                client.close();
                process.exit(0);
                break;

            default:
                console.log("Opsion i pavlefshem.\n");
                showMenu();
        }

 } else if (CLIENT_ROLE === "readonly") {
        switch (choice) {
            case "1":
                sendToServer("READ_FILE");
                break;

            case "2":
                rl.question("Shkruaj mesazhin: ", (msg) => {
                    if (msg.trim() === "") {
                        console.log("Mesazhi nuk mund të jetë bosh.\n");
                        showMenu();
                    } else {
                        sendToServer(msg.trim());
                    }
                });
                break;

            case "3":
                console.log("\nKlienti u mbyll.\n");
                rl.close();
                client.close();
                process.exit(0);
                break;

            default:
                console.log("Opsion i pavlefshem.\n");
                showMenu();
        }
    }
}
                
     

