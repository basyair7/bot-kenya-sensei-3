import { 
    SlashCommandBuilder, 
    ButtonStyle,
    ButtonBuilder
} from 'discord.js'
import { command } from '../../utils'

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

export default command ( meta, async ({ interaction, client }) => {
    // const message = await interaction.options.getString('message')

    // var ping = Date.now() - message.createdTimestamp;

    const message = await interaction.reply({
        content: 'Pong!',
        fetchReply: true
    });

    return interaction.editReply({
        content: `:ping_pong: Pong!\nBot Latency: \`${message.createdTimestamp - interaction.createdTimestamp}ms\`, Websocket Latency: \`${client.ws.ping}ms\``
    }).then(
        embedMessage => {
            const button = new ButtonBuilder()
                .setCustomId('primary')
                .setLabel('Remove')
                .setStyle(ButtonStyle.Primary)
                .setDisabled(true);
        }
    )
})