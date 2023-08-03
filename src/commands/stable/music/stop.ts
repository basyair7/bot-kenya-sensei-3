import { 
    SlashCommandBuilder, 
    EmbedBuilder 
} from "discord.js";
import {
    joinVoiceChannel,
    VoiceConnection,
    DiscordGatewayAdapterCreator,
    getVoiceConnection
} from "@discordjs/voice";
import { queue, numQueue, loopState } from "./constants";

import { command } from "../../../utils";

const meta = new SlashCommandBuilder()
    .setName("stop")
    .setDescription("Berhenti memainkan musik");

export default command(meta, ({interaction, client}) => {
    const guildId = interaction.guild?.id;
    const users = client.guilds.cache.get(interaction.guild?.id!);
    const member = users?.members.cache.get(interaction.user.id);
    const channelId = member?.voice.channelId;
    if (!channelId){
        const msg = new EmbedBuilder()
            .setDescription("Kamu harus join voice channel dulu nak!")
            .setColor("Red");
        return interaction.reply({
            ephemeral: true,
            embeds: [ msg ]
        });
    }
    const voiceConnection = getVoiceConnection(guildId!);
    if (!voiceConnection) {
        const msg = new EmbedBuilder()
            .setDescription("Sensei-bot tidak ada di dalam voice channel ini! :negative_squared_cross_mark:")
            .setColor("Red");

        return interaction.reply({
            ephemeral: true,
            embeds: [ msg ]
        });
    }
    if (queue.length === 0){
        const message = new EmbedBuilder()
            .setDescription("Tidak ada musik yang sendang dimainkan... :negative_squared_cross_mark:")
            .setColor("Yellow");

        return interaction.reply({
            ephemeral: true,
            embeds: [ message ]
        });

    } else {
        loopState[0] = false;
        queue.splice(0, queue.length);
        numQueue.splice(0, numQueue.length);
        voiceConnection.destroy();
        const message = new EmbedBuilder()
            .setDescription("Musik telah berhenti! :white_check_mark:")
            .setColor("Random");

        return interaction.reply({
            embeds: [ message ]
        });
    }
})