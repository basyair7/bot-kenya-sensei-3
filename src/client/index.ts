import { Client, GatewayIntentBits, Partials } from "discord.js"
import { registerEvents } from '../utils'
import events from '../events'
import keys from "../keys";


try {
    const client = new Client({
        intents: [
            GatewayIntentBits.Guilds,
            GatewayIntentBits.GuildMembers,
            GatewayIntentBits.GuildIntegrations,
            GatewayIntentBits.GuildVoiceStates,
            GatewayIntentBits.MessageContent,
        ],
        partials: [Partials.Channel]
    });
    
    registerEvents(client, events);
    
    client.login(keys.clientToken).catch((err) => {
        console.log(`Bot Error : ${err}`);
        process.exit(1);
    });

} catch (e) {
    console.error(e);
}