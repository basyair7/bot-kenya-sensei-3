import {
    SlashCommandBuilder,
    EmbedBuilder
} from 'discord.js'
import { command } from '../../utils'

const meta = new SlashCommandBuilder()
    .setName('stats')
    .setDescription('Bot Staticstic')
    // .addStringOption((option) =>
    //     option
    //         .setName('message')
    //         .setDescription('Provide the bot statics')
    //         .setMinLength(1)
    //         .setMaxLength(2000)
    //         .setRequired(false)
    // )

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

    return interaction.reply({
        fetchReply: true,
        embeds: [
            message
        ]
    });
})