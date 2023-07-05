import {
    SlashCommandBuilder,
    EmbedBuilder,
} from 'discord.js'
import {
    AudioPlayerStatus,
    getVoiceConnection,
    VoiceConnectionStatus,
} from '@discordjs/voice'
import { command } from '../../../utils'
import { queue, loopState } from './constants'

const meta = new SlashCommandBuilder()
    .setName("skip")
    .setDescription("Skip lagu selanjutnya")

export default command(
    meta, 
    async ({ interaction, client }) => {
    try {
        const users = client.guilds.cache.get(interaction.guild?.id!);
        const member = users?.members.cache.get(interaction.user.id);
        const guildId = interaction.guild!.id;
        const channelId = member?.voice.channelId;

        // jika melakukan skip tapi tidak ada di voice channel, maka
        if(!channelId) {
            const msg = new EmbedBuilder()
                .setDescription("Kamu harus join voice channel dulu nak! :negative_squared_cross_mark:")
                .setColor("Red");
            return interaction.reply({
                ephemeral: true,
                embeds: [ msg ]
            });
        }

        // Periksa apakah bot berada di voice channel yang sama dengan pengguna
        const connection = getVoiceConnection(guildId);
        if (!connection) {
            const msg = new EmbedBuilder()
                .setDescription("Sensei-bot tidak ada di dalam voice channel ini! :negative_squared_cross_mark:")
                .setColor("Red");

            return interaction.reply({
                ephemeral: true,
                embeds: [ msg ]
            });
        }

        // skip lagu saat ini
        if (connection.state.status === VoiceConnectionStatus.Ready){
            if(queue.length === 0) {
                const message = new EmbedBuilder()
                    .setDescription("Tidak ada antrian lagu");
                
                return interaction.reply({
                    ephemeral: true,
                    embeds: [ message ]
                });
                
            } else {
                if (loopState[0] === true) {
                    queue.push(queue[0]);
                    queue.shift();
                    // connection.disconnect();
                    connection.destroy();
                } else {
                    queue.shift();
                    // connection.disconnect();
                    connection.destroy();
                }
                
                const message = new EmbedBuilder()
                    .setDescription("Skip musik :white_check_mark:")
                    .setColor("Random");

                return interaction.reply({
                    fetchReply: true,
                    embeds: [ message ]
                });
            }
        }

    } catch(e) {
        console.error(`Something went error in skip.ts ${e}`);
    }
});