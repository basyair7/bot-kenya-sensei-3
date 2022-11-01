import {
    SlashCommandBuilder,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
} from 'discord.js';
import { command } from '../../utils';

const meta = new SlashCommandBuilder()
    .setName('mukaku')
    .setDescription('View Your Avatars')
    .addUserOption((option) =>
        option
            .setName('user')
            .setDescription('Tag seseorang?')
            .setRequired(false)
    )

export default command(meta, async ({ interaction, client }) => {
    const target = await interaction.options.getUser('user')
    var user = client.users.cache.get(interaction.user.id)

    if (target !== null) {
        var message = new EmbedBuilder()
            .setColor("Random")
            .setTitle(`${target?.tag}`)
            .setDescription("Noh Muka mu nak.")
            .setImage(`${target?.displayAvatarURL()}?size=4096`);

        const buttonDelete = new ActionRowBuilder<ButtonBuilder>()
            .setComponents(
                new ButtonBuilder()
                    .setCustomId('delete')
                    .setLabel('Delete')
                    .setStyle(ButtonStyle.Danger)
            );

        await interaction.reply({
            fetchReply: true,
            content: "Noh Muka mu nak"
        });

        return interaction.editReply({
            embeds: [
                message
            ],
            components: [
                buttonDelete
            ]
        })
    } else {
        var message = new EmbedBuilder()
            .setColor("Random")
            .setTitle(`${user?.tag}`)
            .setDescription("Noh Muka mu nak.")
            .setImage(`${user?.displayAvatarURL()}?size=4096`);

        const buttonDelete = new ActionRowBuilder<ButtonBuilder>()
            .setComponents(
                new ButtonBuilder()
                    .setCustomId('delete')
                    .setLabel('Delete')
                    .setStyle(ButtonStyle.Danger)
            );

        await interaction.reply({
            fetchReply: true,
            content: "Noh Muka mu nak"
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
})

