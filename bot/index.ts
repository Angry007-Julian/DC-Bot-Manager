import { Client, GatewayIntentBits } from "npm:discord.js";
import "jsr:@std/dotenv/load";
import { loadCommands, runCommand } from "./commands.ts";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildVoiceStates,
  ],
});

client.once("ready", async () => {
  console.log("Bot is online!");
  console.log("Logged in as " + client.user!.tag);
  const commandRegister = await loadCommands();
  client.guilds.cache.forEach((guild) => {
    guild.commands.set(commandRegister);
  });
});

// async function loadEvents() {
//     const eventFiles = Deno.readDir("./bot/events");

//     for await (const file of eventFiles) {
//         const filePath = `./events/${file.name}`;
//         try {
//             const eventModule = await import(filePath);
//             const eventHandler = eventModule.default;

//             if (typeof eventHandler === 'function') {
//                 const eventName = file.name.split('.')[0];
//                 client.on(eventName, eventHandler);
//                 console.log(`Event "${eventName}" geladen.`);
//             } else {
//                 const eventName = file.name.split('.')[0];
//                 console.warn(`Kein gültiger Handler für Event "${eventName}" in ${filePath} gefunden.`);
//             }
//         } catch (error) {
//             console.error(`Fehler beim Laden des Events aus ${filePath}:`, error);
//         }
//     }
// }

// await loadEvents();

client.on("interactionCreate", (interaction) => {
  runCommand(interaction);
});

client.login(Deno.env.get("DISCORD_TOKEN")); // Discord-Token wird aus der .env geladen
