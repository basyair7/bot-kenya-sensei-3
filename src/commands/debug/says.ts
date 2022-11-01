import {
    SlashCommandBuilder,
    ActionRowBuilder, 
    ButtonBuilder, 
    ButtonStyle
} from 'discord.js'
import { command } from '../../utils'

const meta = new SlashCommandBuilder()
    .setName('says')
    .setDescription('return your message in bot')
    .addStringOption((option) =>
        option
            .setName('message')
            .setDescription('Provide the bot a message to respond with.')
            .setMinLength(1)
            .setMaxLength(2000)
            .setRequired(false)
    )

export default command(meta, async ({ interaction, client }) => {
    const message = await interaction.options.getString('message');

    // const message = await interaction.reply({
    //     content: 'Pong!',
    //     fetchReply: true
    // });

    interaction.deferReply();
    interaction.deleteReply();
    interaction.channel?.send(`${message}`)

})