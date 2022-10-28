import { Client, GatewayIntentBits } from "discord.js"
import { registerEvent } from '../utils'
import events from '../events'
import keys from "../keys"


const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildIntegrations,
        GatewayIntentBits.GuildVoiceStates,
    ]
});

registerEvent(client, events)

client.login(keys.clientToken).catch((err) => {
        console.log(`Bot Error : ${err}`);
        process.exit(1);
    })