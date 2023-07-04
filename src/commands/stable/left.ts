import { 
    SlashCommandBuilder,
    EmbedBuilder,
    ChannelType
} from "discord.js";
import {
    getVoiceConnection
} from "@discordjs/voice";
import { command } from "../../utils";

const meta = new SlashCommandBuilder()
    .setName("left")
    .setDescription("Sensei keluar dari voice channel");

export default command(meta, async ({ interaction, client }) => {
    const guildId = interaction.guild?.id;
    const users = client.guilds.cache.get(interaction.guild?.id!);
    const member = users?.members.cache.get(interaction.user.id);
    const channelId = member?.voice.channelId;
    if (!channelId) {
        const msg = new EmbedBuilder()
            .setDescription("Kamu harus join voice channel dulu nak!")
            .setColor("Red");
        return interaction.reply({
            ephemeral: true,
            embeds: [ msg ]
        });
    }
    const connection = getVoiceConnection(guildId!);
    if (!connection) {
        const msg = new EmbedBuilder()
            .setDescription("Sensei-bot tidak ada di dalam voice channel ini! :negative_squared_cross_mark:")
            .setColor("Red");
        return interaction.reply({
            ephemeral: true,
            embeds: [ msg ]
        });
    }

    const message = new EmbedBuilder()
        .setDescription("Sensei keluar dari voice channel :white_check_mark:")
        .setColor("Red");
    
    interaction.reply({
        fetchReply: true,
        embeds: [ message ]
    });
    return connection.destroy();
});