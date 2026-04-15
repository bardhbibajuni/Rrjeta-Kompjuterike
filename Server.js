const dgram = require("dgram");
const fs = require("fs");

const PORT = 4444;
const HOST = "127.0.0.1";

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
    
    // Parse mesazhin: IP:PORT:actualMessage
    const parts = text.split(":");
    let clientPort = rinfo.port; // Default port
    let actualMessage = text;
    
    if (parts.length >= 3 && !isNaN(parts[1])) {
        // Format: IP:PORT:message
        clientIP_from_msg = parts[0];
        clientPort = parseInt(parts[1]);
        actualMessage = parts.slice(2).join(":"); // Mesazhi (mund të ketë :)
    }
    
    console.log("\n╔════════════════════════════════╗");
    console.log("║     MESAZH NGA KLIENTI        ║");
    console.log("╠════════════════════════════════╣");
    console.log(`║ IP: ${clientIP}`);
    console.log(`║ Port Klienti: ${clientPort}`);
    console.log(`║ Roli: ${client.role}`);
    console.log(`║ Mesazhi: ${actualMessage}`);
    console.log("╚════════════════════════════════╝\n");

    let response = "";

    // READ FILE (per krejt klientat)
    if (actualMessage === "READ_FILE") {
        try {
            const data = fs.readFileSync("data.txt", "utf8");
            response = ` Përmbajtja e data.txt:\n${data}`;
        } catch (err) {
            response = " ERROR READING FILE";
        }
        server.send(response, clientPort, clientIP);
        return;
    }

    // WRITE FILE (Vetem per admin)
    if (actualMessage.startsWith("WRITE_FILE:")) {
        if (client.role !== "admin") {
            response = "Nuk ke përmi për shkrim (write)";
        } else {
            const fileContent = actualMessage.substring(11); // Remove "WRITE_FILE:"
            try {
                fs.writeFileSync("data.txt", fileContent, "utf8");
                response = "Fajlli u shkrua me sukses!";
            } catch (err) {
                response = `Error writing file: ${err.message}`;
            }
        }
        server.send(response, clientPort, clientIP);
        return;
    }

   
    if (actualMessage === "LIST_PERMISSIONS") {
        if (client.role !== "admin") {
            response = " Nuk ke përmi të shohësh permisione (vetëm admin)";
        } else {
            response = ` Permisione për ${client.role}:\n`;
            response += `   Read:    ✅\n`;
            response += `   Write:   ✅\n`;
            response += `   Execute: ✅`;
        }
        server.send(response, clientPort, clientIP);
        return;
    }

    response = `✅ Serveri ka pranuar: "${actualMessage}"`;
    server.send(response, clientPort, clientIP);
});
server.bind(PORT, HOST, () => {
    console.log("\n╔════════════════════════════════╗");
    console.log("║    UDP SERVERI ËSHTË ONLINE    ║");
    console.log("╠════════════════════════════════╣");
    console.log(`║ IP:    ${HOST}               ╣` );
    console.log(`║ Port:  ${PORT}                    ╣` );
    console.log("╠════════════════════════════════╣");
});

