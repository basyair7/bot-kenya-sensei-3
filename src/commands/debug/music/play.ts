import { 
    SlashCommandBuilder, 
    EmbedBuilder,
} from "discord.js";
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
import ytdl from "ytdl-core";
import { search } from "yt-search";
import SpotifyWebApi from "spotify-web-api-node";
import keys from "../../../keys";
import { command } from "../../../utils";


// antrian untuk lagu
import { queue, numQueue, loopState } from "./constants";
import { send } from "process";
let isPlaying = false;
var song;

async function addToQueue(config: any, query: any, interaction: any, source: string) {
    // proses memasukan data lagu antrian
    try {
        const data = query;
        if (source === "youtube") {
            song = {
                name: data.title,
                thumbnail: data.image,
                requested: interaction.user.tag,
                duration: data.duration.toString(),
                image: data.image,
                url: data.url,
                source: "youtube"
            };
        } else {
            song = {
                name: data.title,
                thumbnail: data.image,
                requested: interaction.user.tag,
                duration: data.duration,
                image: data.image,
                url: data.url,
                source: "spotify"
            };
        }

        queue.push(song);
        const message = new EmbedBuilder()
            .setAuthor({
                name: "Tambah antrian musik",
                iconURL: "https://img.icons8.com/color/2x/cd--v3.gif"
            })
            .setDescription(`${song.name}`)
            .setColor("#F93CCA")
            .addFields({
                name: "durasi", value: song.duration, inline: true
            },{
                name: "requested by", value: song.requested, inline: false
            })
            .addFields({
                name: "positioned", value: `${queue.length.toString()} in the queue`, inline: true
            }, {
                name: "url", value: song.url
            });

        interaction.editReply({
            embeds: [ message ]
        });
        if(isPlaying === false){
            await playAudio(config, queue[0], interaction);
        }

        // if (source === "spotify") {
        //     const data = query
        //     song = {
        //         name: data.name,
        //         image: data.image,
        //         requested: interaction.user.tag,
        //         duration: data.duration,
        //         source: "spotify",
        //         url: data.url
        //     };

        //     queue.push(song);

        //     const message = new EmbedBuilder()
        //         .setAuthor({
        //             name: "Tambah antrian musik",
        //             iconURL: "https://img.icons8.com/color/2x/cd--v3.gif"
        //         })
        //         .setDescription(`${song.name}`)
        //         .setColor("#F93CCA")
        //         .addFields({
        //             name: "durasi", value: song.duration, inline: true
        //         },{
        //             name: "requested by", value: song.requested, inline: false
        //         })
        //         .addFields({
        //             name: "positioned", value: `${queue.length.toString()} in the queue`, inline: true
        //         }, {
        //             name: "url", value: song.url
        //         });

        //         interaction.editReply({
        //             embeds: [ message ]
        //         });
        //         if(isPlaying === false){
        //             await playAudio(config, queue[0], interaction);
        //         }
        // }

    } catch(e) {
        queue.splice(0, queue.length);
        numQueue.splice(0, numQueue.length);
        console.error(e);
    }
}

async function StopMusic(interaction: any, connection: any){
    // cek jika antrian sudah habis maka bot berhenti memutarkan musik
    try {
        if(queue.length === 0){
            // Disconnect dari channel
            isPlaying = false;
            const msg = new EmbedBuilder()
                .setAuthor({
                    name: "Memutar musik",
                    iconURL: "https://img.icons8.com/color/2x/cd--v3.gif"
                })
                .setDescription("Musik telah berhenti! :white_check_mark:");
                
            // connection.disconnect();
            // connection.destroy();
            
            return interaction.editReply({
                embeds: [ msg ]
            });
        }
    } catch(e) {
        console.error(`Something went error in StopMusic :( ${e}`);
    }
}

async function playAudio(config: any, data: any, interaction: any) {
    isPlaying = true;
    try {
        // buat object joinVoiceChannel
        const connection = joinVoiceChannel({
            channelId: config.channelID!,
            guildId: config.guildID!,
            adapterCreator: interaction.guild?.voiceAdapterCreator as DiscordGatewayAdapterCreator
        });
        // buat object createAudio
        const player = createAudioPlayer({
            behaviors: {
                noSubscriber: NoSubscriberBehavior.Play,
            },
        });

        // ambil informasi lagu
        const title = data["name"];
        const duration = data["duration"];
        const thumbnail = data["image"];
        const URL = data["url"];
        const user = data["requested"];
        const source = data["source"];
        numQueue.push(queue.length.toString());

        const message = new EmbedBuilder()
            .setAuthor({
                name: "Memutar musik",
                iconURL: "https://img.icons8.com/color/2x/cd--v3.gif"
            })
            .setDescription(`${title}`)
            .setFields({
                name: "Durasi", value: duration, inline: true
            }, {
                name: "Request", value: user
            }, {
                name: "positioned", value: `${numQueue.length.toString()} in the queue`
            }, {
                name: "URL", value: URL
            })
            .setImage(thumbnail)
            .setColor("#F93CCA");

        interaction.channel?.send({
            embeds: [ message ]
        });
        
        connection.on(VoiceConnectionStatus.Ready, async () => {
            if (source === "youtube") {
                const stream = await ytdl(URL, { filter: "audioonly" });
                const res = createAudioResource(stream);
                player.play(res);
                connection.subscribe(player);
            }
            if (source === "spotify") {
                const spotifyToYoutube = `https://www.youtube.com/watch?v=${URL}`
                const stream = ytdl(spotifyToYoutube, { filter: "audioonly" });
                const res = createAudioResource(stream, { inputType: StreamType.Arbitrary });
                player.play(res);
                connection.subscribe(player);
            }

            player.on('error', async (err) =>{ 
                console.error(`Ada yang error pada program play.ts ${err}`);
                if(queue.length === 0) {
                    connection.destroy();
                }
                else {
                    return await playAudio(config, queue[0], interaction);
                }
            });

            player.on(AudioPlayerStatus.Idle, async () => {
                if (player.state.status === AudioPlayerStatus.Idle 
                    && connection.state.status === VoiceConnectionStatus.Ready)
                {
                    if(loopState[0] === false) {
                        queue.shift();
                        connection.disconnect();
                    } else { 
                        queue.push(queue[0]);
                        queue.shift();
                        numQueue.shift();
                        connection.disconnect();
                    }
                }
            });
        });

        connection.on(VoiceConnectionStatus.Disconnected, async () => {
            if (queue.length === 0) {
                isPlaying = false;
                queue.splice(0, queue.length);
                numQueue.splice(0, numQueue.length);
                return StopMusic(interaction, connection);
            } 
            if(connection.state.status === VoiceConnectionStatus.Disconnected) {
                return await playAudio(config, queue[0], interaction);
            }
        });
    
    } catch(err) {
        console.log(`Something went wrong in playAudioMain ${err}`);
        if(queue.length !== 0) await playAudio(config, queue[0], interaction);
    }
}

const meta = new SlashCommandBuilder()
    .setName("play")
    .setDescription("Loads a single song from url youtube")
    .addStringOption((option)=>
        option
            .setName("youtube")
            .setDescription("Masukan nama/url yang ingin di mainkan")
            .setRequired(true)
            .setMinLength(1)
            .setMaxLength(2000)
    )
    // .addStringOption((option) => 
    //     option
    //         .setName("spotify")
    //         .setDescription("Masukan nama/url yang ingin di mainkan")
    //         .setRequired(false)
    //         .setMinLength(1)
    //         .setMaxLength(2000)
    // );

export default command(meta, async ({interaction, client}) => {
    try {
        //  ambil data user (query, id user, id member, id guild dan id channel)
        const users = client.guilds.cache.get(interaction.guild?.id!);
        const member = users?.members.cache.get(interaction.user.id);
        const guildId = interaction.guild?.id;
        const channelId = member?.voice.channelId;

        // jika melakukan query tapi tidak ada di voice channel, maka
        if (!channelId){
            const msg = new EmbedBuilder()
                .setDescription("Kamu harus join voice channel dulu nak! :negative_squared_cross_mark:")
                .setColor("Red");
            return interaction.reply({
                ephemeral: true,
                embeds: [ msg ]
            });
        }

        const ytquery = interaction.options.getString('youtube') as string;
        const spotifyquery = interaction.options.getString('spotify') as string;
        if(ytquery === "" || ytquery === undefined || ytquery === null) 
        {
            if(spotifyquery === "" || spotifyquery === undefined || spotifyquery === null) {
                return interaction.reply({ ephemeral: true, content: "tidak ada lagu yang diputar"});
            }

            await interaction.reply({
                content: `Play music ${spotifyquery} :notes:`,
                fetchReply: true
            });
            const spotifyApi = new SpotifyWebApi({
                clientId: keys.spotifyClientId,
                clientSecret: keys.spotifySecret,
                redirectUri: 'http://localhost:3000/callback'
            });
            var configSpotify = {
                channelId: channelId,
                guildId: guildId
            };
            spotifyApi.setAccessToken(keys.spotifyToken);
            
            const searchTrack = await spotifyApi.searchTracks(spotifyquery);
            const tracks = searchTrack.body.tracks!.items;
            const URLReal = tracks[0].uri
            if(tracks.length === 0) {
                return interaction.editReply({ 
                    content: "I couldn't find the song you request! :negative_squared_cross_mark:" 
                });
            }
            // konversi durasi
            const trackDurationMinutes = Math.floor(tracks[0].duration_ms / 60000);
            const trackDurationSeconds = Math.floor((tracks[0].duration_ms % 60000) / 1000);
            const trackDurationFormatted = `${trackDurationMinutes}:${trackDurationSeconds.toString().padStart(2, '0')}`;

            // masukan ke info lagu
            var info = {
                id: tracks[0].id,
                title: tracks[0].name,
                artis: tracks[0].artists[0].name,
                album: tracks[0].album.name,
                image: tracks[0].album.images[0].url,
                duration: trackDurationFormatted,
                url: URLReal
            };

            return await addToQueue(configSpotify, info, interaction, "spotify");
        } else {
            await interaction.reply({
                content: `Play music ${ytquery} :notes:`,
                fetchReply: true
            });
    
            // masukan konfigurasi id
            var config = {
                channelID: channelId,
                guildID: guildId
            };
    
            // melakukan pencarian lagu
            const searchResult = (await search(ytquery)).videos;
            if(searchResult.length === 0 || !searchResult) {
                return await interaction.editReply({
                    content: "I couldn't find the song you request! :negative_squared_cross_mark:"
                });
            }
    
            const video = searchResult[0];
            if (!video){
                const msgError = new EmbedBuilder()
                    .setDescription(`Tidak ditemukan lagu ${ytquery}`)
                    .setColor("Red");
                
                return await interaction.editReply({
                    embeds: [ msgError ]
                });
            }
    
            // masukan ke antrian
            return await addToQueue(config, video, interaction, "youtube");
        }
    
    } catch(err) {
        console.error(`Something went error in play.ts : ${err}`);
    }
});