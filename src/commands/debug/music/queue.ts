import { 
    SlashCommandBuilder, 
    EmbedBuilder,
} from "discord.js";
import { command } from "../../../utils";
import { nameQueue, numQueue, queue } from "./constants";

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
            embeds: [
                msg
            ]
        })
    }

    const msg = new EmbedBuilder()
        .setAuthor({
            name: "Daftar antrian musik bot sensei",
            iconURL: "https://img.icons8.com/color/2x/rhombus-loader.gif"
        });
    // mengambil judul lagu antrian
    if (nameQueue.length === 0) {
        msg.setDescription("Tidak ada antrian lagu");
    }
    else {
        for (let i = 0; i < nameQueue.length; i++)
        {
            for (let j = 0; j < queue.length; j++) {
                let number = i+1;
                msg.addFields({ 
                    name: `${number.toString()}. ${nameQueue[i]}`, value: `${queue[j]}` 
                });
            }
        }
    }

    interaction.reply({
        embeds: [
            msg
        ]
    })
});