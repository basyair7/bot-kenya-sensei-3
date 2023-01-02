import {
    SlashCommandBuilder,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
} from 'discord.js';
import { Player } from '@discordx/music'
import { command } from '../../../utils';

const meta = new SlashCommandBuilder()
    .setName("play")
    .setDescription("loads song from youtube")
    .addStringOption((option) =>
        option
            .setName("url")
            .setDescription("the song's url")
            .setRequired(true)
    )

export default command(meta, async ({ interaction, client }) => {
    const player = new Player();
    const queue = player.queue(interaction);
})