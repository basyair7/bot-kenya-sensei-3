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
    VoiceConnectionStatus
} from "@discordjs/voice";
import ytdl from "ytdl-core";
import { search } from "yt-search";
import { command } from "../../../utils";

// antrian untuk lagu
import { queue, numQueue, nameQueue } from "./constants";
let isPlaying = false;
var song;

async function addToQueue(config: any, query: any, interaction: any) {
    // proses memasukan data lagu antrian
    try {
        const data = query;
        song = {
            name: data.title,
            thumbnail: data.image,
            requested: interaction.user.tag,
            videoId: data.videoId,
            duration: data.duration.toString(),
            image: data.image,
            url: data.url
        };

        queue.push(song);
        numQueue.push(queue.length.toString());
        nameQueue.push(song.name);

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
        if(!isPlaying){
            await playAudio(config, queue[0], interaction);
        }
    } catch(e) {
        queue.splice(0, queue.length);
        numQueue.splice(0, numQueue.length);
        nameQueue.splice(0, nameQueue.length);
        console.error(e);
    }
}

async function StopMusic(interaction: any, connection: any){
    // cek jika antrian sudah habis maka bot berhenti memutarkan musik
    if(queue.length === 0){
        // Disconnect dari channel
        isPlaying = false;
        interaction.editReply({
            content: "Musik telah berhenti! :white_check_mark:"
        })
        connection.disconnect();
        // if(minute%10 === 0) {
        //     connection.destroy();
        // }
    }
}

async function playAudio(config: any, data: any, interaction: any) {
    // buat object joinVoiceChannel
    const connection = joinVoiceChannel({
        channelId: config.channelID!,
        guildId: config.guildID!,
        adapterCreator: interaction.guild?.voiceAdapterCreator as DiscordGatewayAdapterCreator
    });

    // buat object createAudio
    const player = createAudioPlayer({
        behaviors: {
            noSubscriber: NoSubscriberBehavior.Pause,
        },
    });
    isPlaying = true;

    try {
        // ambil informasi lagu
        const title = data["name"];
        const duration = data["duration"];
        const thumbnail = data["image"];
        const URLYt = data["url"];
        const {user} = interaction

        connection.on(VoiceConnectionStatus.Disconnected, async () => {
            if (queue.length === 0) {
                isPlaying = false;
                queue.splice(0, queue.length);
                numQueue.splice(0, numQueue.length);
                nameQueue.splice(0, nameQueue.length);
                await StopMusic(interaction, connection);
            } 
            else {
                if(connection.state.status === VoiceConnectionStatus.Disconnected) {
                    await playAudio(config, queue[0], interaction);
                }
            }
        });

        const message = new EmbedBuilder()
            .setAuthor({
                name: "Memutar musik",
                iconURL: "https://img.icons8.com/color/2x/cd--v3.gif"
            })
            .setDescription(`${title}`)
            .setFields({
                name: "Durasi", value: duration, inline: true
            }, {
                name: "Request", value: user.tag
            }, {
                name: "positioned", value: `${numQueue.length.toString()} in the queue`
            }, {
                name: "URL", value: URLYt
            })
            .setImage(thumbnail)
            .setColor("#F93CCA");

        interaction.followUp({
            embeds: [ message ]
        });
        
        connection.on(VoiceConnectionStatus.Ready, async () => {
            player.on(AudioPlayerStatus.Idle, async () => {
                if (player.state.status === AudioPlayerStatus.Idle 
                    && connection.state.status === VoiceConnectionStatus.Ready)
                {
                    queue.shift();
                    numQueue.shift();
                    nameQueue.shift();
                    await playAudio(config, queue[0], interaction);
                }
            });

            if(connection.state.status === VoiceConnectionStatus.Disconnected)
            {
                queue.splice(0, queue.length);
            }
    
            player.on('error', (err) =>{ return console.error(`Ada yang error pada program play.ts ${err}`);});
            
            connection.subscribe(player);
            const stream = ytdl(URLYt, { filter: 'audioonly' });
            const res = createAudioResource(stream);
            player.play(res);
        });
    
    } catch(err) {
        if (player.state.status === AudioPlayerStatus.Idle 
            && connection.state.status === VoiceConnectionStatus.Ready)
        {
            await StopMusic(interaction, connection);
        }
    }
}

const meta = new SlashCommandBuilder()
    .setName("play")
    .setDescription("Loads a single song from url youtube")
    .addStringOption((option)=>
        option
            .setName("query")
            .setDescription("Masukan nama/url yang ingin di mainkan")
            .setRequired(true)
            .setMinLength(1)
            .setMaxLength(2000)
    );

export default command(meta, async ({interaction, client}) => {
    try {
        //  ambil data user (query, id user, id member, id guild dan id channel)
        const query = interaction.options.getString('query') as string;
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

        await interaction.reply({
            content: `Play music ${query} :notes:`,
            fetchReply: true
        });

        // masukan konfigurasi id
        var config = {
            channelID: channelId,
            guildID: guildId
        };

        // melakukan pencarian lagu
        const searchResult = (await search(query)).videos;
        if(searchResult.length === 0 || !searchResult) {
            return interaction.editReply({
                content: "I couldn't find the song you request! :negative_squared_cross_mark:"
            });
        }

        const video = searchResult[0];
        if (!video){
            const msgError = new EmbedBuilder()
                .setDescription(`Tidak ditemukan lagu ${query}`)
                .setColor("Red");
            
            return interaction.editReply({
                embeds: [ msgError ]
            });
        }

        // masukan ke antrian
        await addToQueue(config, video, interaction);
    
    } catch(err) {
        console.error(`Something went error in play.ts : ${err}`);
    }
});