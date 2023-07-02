import {
    SlashCommandBuilder,
    EmbedBuilder,
} from 'discord.js'
import {
    AudioPlayerStatus,
    getVoiceConnection,
    createAudioPlayer,
    NoSubscriberBehavior,
    VoiceConnectionStatus,
} from '@discordjs/voice'
import { command } from '../../../utils'
import { queue, numQueue, nameQueue } from './constants'

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
        

        // skip lagu saat ini
        const connection = getVoiceConnection(guildId);
        const player = createAudioPlayer({
            behaviors: {
                noSubscriber: NoSubscriberBehavior.Pause,
            },
        });
        if (!connection) {
            const msg = new EmbedBuilder()
                .setDescription("Sensei-bot tidak ada di dalam voice channel ini! :negative_squared_cross_mark:")
                .setColor("Red");

            return interaction.reply({
                ephemeral: true,
                embeds: [ msg ]
            });
        }

        if (connection.state.status === VoiceConnectionStatus.Ready){
            queue.shift();
            numQueue.shift();
            nameQueue.shift();
            connection.disconnect();
        }

        const message = new EmbedBuilder()
            .setDescription("Skip musik :white_check_mark:")
            .setColor("Random");

        interaction.reply({
            fetchReply: true,
            embeds: [ message ]
        });

    } catch(e) {
        console.error(`Something went error in skip.ts ${e}`);
    }
});