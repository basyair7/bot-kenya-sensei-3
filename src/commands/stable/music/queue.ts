import { 
    SlashCommandBuilder, 
    EmbedBuilder,
} from "discord.js";
import { command } from "../../../utils";
import { queue } from "./constants";

const meta = new SlashCommandBuilder()
    .setName("queue")
    .setDescription("Melihat list antrian lagu");

export default command(meta, ({ interaction, client }) => {
    const users = client.guilds.cache.get(interaction.guild?.id!);
    const member = users?.members.cache.get(interaction.user.id);
    const channelId = member?.voice.channelId;
    if (!channelId){
        const msg = new EmbedBuilder()
            .setDescription("Kamu harus join voice channel dulu nak! :negative_squared_cross_mark:")
            .setColor("Red")
        return interaction.reply({
            ephemeral: true,
            embeds: [ msg ]
        });
    }

    const msg = new EmbedBuilder()
        .setAuthor({
            name: "Daftar antrian musik bot sensei",
            iconURL: "https://img.icons8.com/color/2x/rhombus-loader.gif"
        });
        
    // mengambil judul lagu antrian
    if (queue.length === 0) {
        const msgEmptry = new EmbedBuilder()
            .setAuthor({
                name: "Daftar antrian musik bot sensei",
                iconURL: "https://img.icons8.com/color/2x/rhombus-loader.gif"
            })
            .setDescription("Tidak ada antrian lagu");
        return interaction.reply({
            ephemeral: true,
            embeds: [ msgEmptry ]
        });
    }
    else {
        for (let i = 0; i < queue.length; i++)
        {
            let number = i+1;
            msg.addFields({ 
                name: `${number.toString()}. ${queue[i]["name"]}`, value: `${queue[i]["url"]}` 
            });
        }
    }

    interaction.reply({
        embeds: [ msg ]
    });
});