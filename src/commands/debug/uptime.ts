import {
    SlashCommandBuilder,
    ButtonStyle,
    ActionRowBuilder, 
    ButtonBuilder, 
    EmbedBuilder,
} from 'discord.js';
import { command, DateTimeBot } from '../../utils';

const meta = new SlashCommandBuilder()
    .setName('uptime')
    .setDescription('waktu aktif bot')

export default command(meta, async ({ interaction, client }) => {
    try {
        const ms = require("pretty-ms");
        const datetime = DateTimeBot()
        const uptime = await ms(client.uptime, { verbose: true });
        const embed = new EmbedBuilder()
            .setTitle("Uptime Bot")
            .setColor("Random")
            .addFields({
                name: 'Date', value: datetime,
            }, {
                name: 'Bot Uptime', value: uptime,
            });
        
        const buttonDelete = new ActionRowBuilder<ButtonBuilder>()
            .setComponents(
                new ButtonBuilder()
                    .setCustomId('delete')
                    .setLabel('Delete')
                    .setStyle(ButtonStyle.Danger)
            );

        await interaction.reply({
            embeds: [
                embed
            ],
            components: [
                buttonDelete
            ]
        });
        
    } catch (e) {
        console.error(e);
    }
})