import {
    SlashCommandBuilder,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} from 'discord.js'
import { command } from '../../utils'

const meta = new SlashCommandBuilder()
    .setName('stats')
    .setDescription('Bot Staticstic')

export default command(meta, async ({ interaction, client }) => {
    const { platform, arch, cpus } = require('os');
    const model = cpus()[0].model + " " + arch();
    const tanggalBuat = client.user?.createdAt;

    const message = new EmbedBuilder()
        .setColor("Random")
        .setTitle("Bot Staticstics")
        .setThumbnail(`${client.user?.displayAvatarURL()}`)
        .addFields(
            {
                name: "Bot", value: `Username : ${client.user?.username}\nTanggal Dibuat: ${tanggalBuat}`, inline: true
            },
            {
                name: "System", value: `CPU: ${model}\nPlatform: ${platform}\nWebsocket: ${client.ws.ping} ms(miliseconds)`, inline: true
            }
        )
        .setFooter({
            text: "Powered By Replit.com"
        });
    
    const buttonDelete = new ActionRowBuilder<ButtonBuilder>()
        .setComponents(
            new ButtonBuilder()
                .setCustomId('delete')
                .setLabel('Delete')
                .setStyle(ButtonStyle.Danger)
    );

    await interaction.reply({
        // fetchReply: true,
        embeds: [message],
        components:[
            buttonDelete
        ]
    });
    
})