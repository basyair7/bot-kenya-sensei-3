import { 
    SlashCommandBuilder, 
    EmbedBuilder,
} from "discord.js";

import { command } from "../../../utils";

// antrian untuk lagu
import { queue, numQueue } from "./constants";

const meta = new SlashCommandBuilder()
    .setName("nowplay")
    .setDescription("Menampilkan musik yang lagi dimainkan");

export default command(meta, ({ interaction, client }) => {
    // cek member ada masuk sama ke voice channel?
    const users = client.guilds.cache.get(interaction.guild?.id!);
    const member = users?.members.cache.get(interaction.user.id);
    const channelId = member?.voice.channelId;
    if (!channelId) {
        const msg = new EmbedBuilder()
            .setDescription("Kamu harus join voice channel dulu nak! :negative_squared_cross_mark:")
            .setColor("Red")
        return interaction.reply({
            ephemeral: true,
            embeds: [ msg ]
        });
    }
    
    if(queue.length === 0){
        const message = new EmbedBuilder()
            .setAuthor({
                name: "Memutar musik",
                iconURL: "https://img.icons8.com/color/2x/cd--v3.gif"
            })
            .setDescription("Tidak ada lagu yang sedang dimainkan");
        return interaction.reply({
            ephemeral: true,
            embeds: [ message ]
        });
    } else {
        const title: string = queue[0]["name"];
        const duration: string = queue[0]["duration"];
        const thumbnail: any = queue[0]["image"];
        const URLYt: string = queue[0]["url"];
        const user: string = queue[0]["requested"];

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
                name: "URL", value: URLYt
            })
            .setImage(thumbnail)
            .setColor("#F93CCA");

        return interaction.reply({
            fetchReply: true,
            embeds: [ message ]
        });
    }
});