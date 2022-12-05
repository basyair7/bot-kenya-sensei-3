import {
    SlashCommandBuilder,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
} from 'discord.js';
import { command } from "../../utils";

const meta = new SlashCommandBuilder()
    .setName('servericon')
    .setDescription('Show Icon Server')

export default command(meta, 
    async function ({ interaction, client }) {
        const message = new EmbedBuilder()
            .setColor("#7289da")
            .setTitle("Server Icon")
            .setImage(`${interaction.guild?.iconURL()}?size=4096`);

        const buttonDelete = new ActionRowBuilder<ButtonBuilder>()
            .setComponents(
                new ButtonBuilder()
                    .setCustomId('delete')
                    .setLabel('Delete')
                    .setStyle(ButtonStyle.Danger)
            );

        await interaction.reply({
            fetchReply: true,
            content: "Server Icon"
        });

        return interaction.editReply({
            embeds: [
                message
            ],
            components: [
                buttonDelete
            ]
        })
    }
)