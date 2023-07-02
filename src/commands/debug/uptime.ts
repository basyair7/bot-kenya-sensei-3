import {
    SlashCommandBuilder,
    ButtonStyle,
    ActionRowBuilder, 
    ButtonBuilder, 
    EmbedBuilder,
} from 'discord.js';
// import prettyMilliseconds from 'pretty-ms';
import { command, DateTimeBot } from '../../utils';

const meta = new SlashCommandBuilder()
    .setName('uptime')
    .setDescription('waktu aktif bot');

export default command(meta, async ({ interaction, client }) => {
    try {
        const prettyMilliseconds = require("pretty-ms");
        const upclient = client.uptime!;
        const option = {
            colonNotation: true,
            verbose: true,
        }
        const datetime = DateTimeBot();
        const uptime = prettyMilliseconds(upclient);
        const embed = new EmbedBuilder()
            .setTitle("Uptime Bot")
            .setColor("Random")
            .addFields({
                name: 'Date', value: datetime,
            }, {
                name: 'Bot Uptime', value: "uptime",
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