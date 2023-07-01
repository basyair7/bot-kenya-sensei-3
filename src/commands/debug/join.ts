import { 
    SlashCommandBuilder,
    EmbedBuilder,
    ChannelType
} from "discord.js";
// import { QueryType } from "discord-player";
import { command } from "../../utils";
import { DiscordGatewayAdapterCreator, getVoiceConnections, joinVoiceChannel } from "@discordjs/voice";

const meta = new SlashCommandBuilder()
    .setName("join")
    .setDescription("Sensei join ke voice channel")
    .addChannelOption((option) => {
        return option
        .setName("channel")
        .setDescription("The channel to join")
        .setRequired(true)
        .addChannelTypes(ChannelType.GuildVoice)
    });

export default command(meta, async ({interaction, client}) => {
    const voiceChannel = interaction.options.getChannel('channel');
    const voiceConnection = joinVoiceChannel({
        channelId: voiceChannel?.id!,
        guildId: interaction.guildId!,
        adapterCreator: interaction.guild?.voiceAdapterCreator as DiscordGatewayAdapterCreator
    });
    
    const message = new EmbedBuilder()
        .setColor("Random")
        .setDescription(`**Joined the voice channel ${voiceChannel?.name} :white_check_mark: **`);
    
    await interaction.reply({
        embeds: [
            message
        ]
    });
});