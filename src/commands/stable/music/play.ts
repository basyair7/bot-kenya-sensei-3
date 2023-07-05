// masukan library discord.js
import {
    SlashCommandBuilder,
    EmbedBuilder,
} from "discord.js";
// masukan library @discordjs/voice
import { 
    DiscordGatewayAdapterCreator,
    getVoiceConnection,
    joinVoiceChannel, 
    createAudioPlayer,
    createAudioResource,
    NoSubscriberBehavior,
    AudioPlayerStatus,
    VoiceConnectionStatus,
    StreamType
} from "@discordjs/voice";
// masukan library yt-search, ytdl-core
import ytdl from "ytdl-core";
import { search } from "yt-search";
// masukan library utils dan constants 
import { command } from "../../../utils";
import { queue, numQueue, loopState } from "./constants";

// buat state dan infoSong jika musik sedang dimainkan
let isPlaying = false;
var infoSong;

// buat fungsi antrian musik
async function addToQueue(config: any, query: any, interaction: any) 
{
    try {
        // ambil data antrian
        const data = query;
        infoSong = {
            name: data.title,
            thumbnail: data.image,
            requested: interaction.user.tag,
            duration: data.duration.toString(),
            image: data.image,
            url: data.url,
        };

        // masukan infoSong ke dalam list query
        queue.push(infoSong);

        // tampilkan informasi antrian
        const message = new EmbedBuilder()
            .setAuthor({
                name: "Tambah antrian musik",
                iconURL: "https://img.icons8.com/color/2x/cd--v3.gif"
            })
            .setDescription(`${infoSong.name}`)
            .setColor("Random")
            .addFields({
                name: "durasi", value: infoSong.duration, inline: true
            }, {
                name: "requested by", value: infoSong.requested, inline: true
            }, {
                name: "positioned", value: `${queue.length.toString()} in the queue`, inline: true
            }, {
                name: "url", value: infoSong.url
            });
        
        interaction.channel?.send({
            embeds: [ message ]
        });

        // jika musik belum dijalankan maka putar musik
        if (!isPlaying) await playAudio(config, queue[0], interaction);
    }
    // tampilkan pesan diconsole jika terjadi error pada program
    catch(e) {
        queue.splice(0, queue.length);
        numQueue.splice(0, numQueue.length);
        console.error(e);
    }
}

// buat fungsi StopMusic
async function StopMusic(interaction: any, connection: any) {
    // cek jika antrian sudah habis maka bot berhenti memutarkan musik
    try {
        if(queue.length === 0) {
            // Disconnect bot dari voice channel
            isPlaying = false;
            /*
            const message = new EmbedBuilder()
                .setAuthor({
                    name: "Memutar musik",
                    iconURL: "https://img.icons8.com/color/2x/cd--v3.gif"
                })
                .setDescription("Musik telah berhenti! :white_check_mark:");
                
            return interaction.channel?.send({ embeds: [ message ] });
            */
        }
    }
    // tampilkan pesan diconsole jika terjadi error pada program
    catch(e) {
        console.error(`Something went error in StopMusic Function :( ${e}`);
    }
}

// buat fungsi playAudio
async function playAudio(config: any, data: any, interaction: any)
{
    isPlaying = true;
    try{
        // buat object joinVoiceChannel
        const connection = joinVoiceChannel({
            channelId: config.channelID!,
            guildId: config.guildID!,
            adapterCreator: interaction.guild?.voiceAdapterCreator as DiscordGatewayAdapterCreator
        });

        // buat object createAudioPlayer
        const player = createAudioPlayer({
            behaviors: {
                noSubscriber: NoSubscriberBehavior.Play
            }
        });

        // ambil informasi lagu yang sedang diputar
        const title = data["name"];
        const duration = data["duration"];
        const thumbnail = data["image"];
        const URL = data["url"];
        const user = data["requested"];
        numQueue.push(queue.length.toString());
        
        // tampilkan informasi lagu yang sedang diputar
        const message = new EmbedBuilder()
            .setAuthor({
                name: "Memutar musik",
                iconURL: "https://img.icons8.com/color/2x/cd--v3.gif"
            })
            .setDescription(`${title}`)
            .setFields({
                name: "Durasi", value: duration, inline: true
            }, {
                name: "Request", value: user,
            }, {
                name: "Positioned", value: `${numQueue.length.toString()} in the queue`
            }, {
                name: "URL", value: URL
            })
            .setImage(thumbnail)
            .setColor("Random")
        
        interaction.channel?.send({
            embeds: [ message ]
        });

        // cek jika bot sudah di voice channel, maka putrakan musik
        connection.on(VoiceConnectionStatus.Ready, async() => {
            const stream = await ytdl(URL, { filter: "audioonly" });
            const res = createAudioResource(stream);
            player.play(res);
            connection.subscribe(player);

            // cek jika bot tiba-tiba mengalami error saat putar music maka tampilkan pesan diconsole
            player.on('error', async (err) => {
                console.error(`Ada yang error pada playAudio ${err}`);
                if(queue.length !== 0) return await playAudio(config, queue[0], interaction);
                else connection.destroy();
            });

            /*jika bot sudah seleai putar lagu
            * 1. cek queue jika masih tersedia
            * 2. berhenti putar musik dan disconnect bot
            */
            player.on(AudioPlayerStatus.Idle, async() => {
                if (player.state.status === AudioPlayerStatus.Idle
                    && connection.state.status === VoiceConnectionStatus.Ready)
                {
                    if (loopState[0] === false) {
                        queue.shift();
                        connection.destroy();
                    } else {
                        queue.push(queue[0]);
                        queue.shift();
                        numQueue.shift();
                        connection.destroy();
                    }
                }
            });

        });
        
        connection.on(VoiceConnectionStatus.Destroyed, async() => {          
            if (queue.length === 0) {
                isPlaying = false;
                queue.splice(0, queue.length);
                numQueue.splice(0, numQueue.length);
                return StopMusic(interaction, connection);
            }

            if(connection.state.status === VoiceConnectionStatus.Disconnected 
                || connection.state.status === VoiceConnectionStatus.Destroyed) return await playAudio(config, queue[0], interaction);
            
        });
        
    }
    // tampilkan pesan diconsole jika terjadi error pada program
    // dan putar kembali musik jika masih ada antrian
    catch(e) {
        console.error(`Something went error in playAudio Function :( ${e}`);
        if (queue.length !== 0) await playAudio(config, queue[0], interaction);
    }
}

// membuat Slash Command
const meta = new SlashCommandBuilder()
    .setName("play")
    .setDescription("Loads a single song from url youtube")
    .addStringOption((option) => 
        option
        .setName("youtube")
        .setDescription("Masukan nama/url lagu yang ingin di putar")
        .setRequired(true)
        .setMinLength(1)
        .setMaxLength(2000)
    );

// export semua program play ke command
export default command(meta, async({ interaction, client }) => {
    try {
        // ambil data users (query, id users, id member, id guild dan id channel)
        const users = client.guilds.cache.get(interaction.guild?.id!);
        const member = users?.members.cache.get(interaction.user.id);
        const guildId = interaction.guild?.id;
        const channelId = member?.voice.channelId;

        // jika member melakukan query tapi tidak ada di voice channel
        if (!channelId) {
            const message = new EmbedBuilder()
                .setDescription("Kamu harus join voice channel dulu nak! :negative_squared_cross_mark:")
                .setColor("Red");
            return interaction.reply({
                ephemeral: true,
                embeds: [ message ]
            });
        }

        // ambil data lagu yang ingin diputar
        const ytquery = interaction.options.getString('youtube') as string;
        await interaction.reply({
            content: `Play music ${ytquery} :notes:`,
            fetchReply: true
        });

        // masukan konfigurasi id
        var config = {
            channelID: channelId,
            guildID: guildId,
        };

        // cari lagu yang ingin diputar
        const searchResult = (await search(ytquery)).videos;
        if(searchResult.length === 0 || !searchResult) return await interaction.editReply({
            content: "I couldn't find the song you request! :negative_squared_cross_mark:"
        });

        const res = searchResult[0];
        if(!res) {
            const msgError = new EmbedBuilder()
                .setDescription(`Tidak ditemukan lagu ${ytquery}`)
                .setColor("Red");
            
            return await interaction.editReply({
                embeds: [ msgError ]
            });
        }

        // masukan lagu ke antrian
        return await addToQueue(config, res, interaction);
    }
    // tampilkan pesan diconsole jika terjadi error pada program
    catch(e) {
        console.error(`Something went error in command Function :( ${e}`);
    }    
});