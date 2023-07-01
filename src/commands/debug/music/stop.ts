import { 
    SlashCommandBuilder, 
    EmbedBuilder 
} from "discord.js";
import {
    joinVoiceChannel,
    VoiceConnection,
    DiscordGatewayAdapterCreator
} from "@discordjs/voice";
import { queue, numQueue, nameQueue } from "./constants";

import { command } from "../../../utils";

const meta = new SlashCommandBuilder()
    .setName("stop")
    .setDescription("Berhenti memainkan musik")

export default command(meta, ({interaction, client}) => {
    const guildId = interaction.guild?.id;
    const users = client.guilds.cache.get(interaction.guild?.id!);
    const member = users?.members.cache.get(interaction.user.id);
    const channelId = member?.voice.channelId;
    if (!channelId){
        const msg = new EmbedBuilder()
            .setDescription("Kamu harus join voice channel dulu nak!")
            .setColor("Red")
        return interaction.reply({
            ephemeral: true,
            embeds: [
                msg
            ]
        })
    }
    const voiceConnection = joinVoiceChannel({
        channelId: channelId!,
        guildId: guildId!,
        adapterCreator: interaction.guild?.voiceAdapterCreator as DiscordGatewayAdapterCreator
    });

    // voiceConnection.disconnect();
    queue.splice(0, queue.length);
    numQueue.splice(0, numQueue.length);
    nameQueue.splice(0, nameQueue.length);
    voiceConnection.disconnect();

    const message = new EmbedBuilder()
        .setDescription("Musik telah berhenti! :white_check_mark:")
        .setColor("Random")

    interaction.reply({
        embeds: [
            message
        ]
    })
})