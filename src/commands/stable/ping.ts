import {
    SlashCommandBuilder,
} from 'discord.js';
import { command } from '../../utils';

const meta = new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Ping the bot for a response.')
    .addStringOption((option) =>
        option
            .setName('message')
            .setDescription('Provide the bot a message to respond with.')
            .setMinLength(1)
            .setMaxLength(2000)
            .setRequired(false)
    )

export default command(meta, async ({ interaction, client }) => {
    // const message = await interaction.options.getString('message')

    const message = await interaction.reply({
        content: `Pong! :ping_pong:`,
        fetchReply: true,
    })

    return interaction.editReply({
        content: `:ping_pong: Pong!\nBoy Latency: \`${message.createdTimestamp - interaction.createdTimestamp} ms\`, Websocket Latency: \`${client.ws.ping} ms\``,
    })
})
