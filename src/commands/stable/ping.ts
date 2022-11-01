import {
    SlashCommandBuilder,
    ActionRowBuilder, 
    ButtonBuilder, 
    ButtonStyle
} from 'discord.js'
import { command } from '../../utils'

const meta = new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Ping the bot for a response.')
    // .addStringOption((option) =>
    //     option
    //         .setName('message')
    //         .setDescription('Provide the bot a message to respond with.')
    //         .setMinLength(1)
    //         .setMaxLength(2000)
    //         .setRequired(false)
    // )

export default command(meta, async ({ interaction, client }) => {
    // const message = await interaction.options.getString('message')

    // var ping = Date.now() - message.createdTimestamp;

    const message = await interaction.reply({
        content: 'Pong!',
        fetchReply: true
    });

    const buttonDelete = new ActionRowBuilder<ButtonBuilder>()
        .setComponents(
            new ButtonBuilder()
                .setCustomId('delete')
                .setLabel('Delete')
                .setStyle(ButtonStyle.Danger)
            // .setDisabled(true)
        );

    return interaction.editReply({
        // fetchReply: true,
        content: `:ping_pong: Pong!\nBot Latency: \`${message.createdTimestamp - interaction.createdTimestamp}ms\`, Websocket Latency: \`${client.ws.ping}ms\``,
        components: [
            buttonDelete
        ]
    })
})