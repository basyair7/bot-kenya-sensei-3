import { 
    SlashCommandBuilder, 
    EmbedBuilder,
} from "discord.js";
import { command } from "../../../utils";
import { nameQueue, numQueue } from "./constants";

const meta = new SlashCommandBuilder()
    .setName("queue")
    .setDescription("Melihat list antrian lagu");

export default command(meta, ({ interaction, client }) => {
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
            let number = i+1;
            msg.addFields({ 
                name: "Antrian musik", value: `${number.toString()}. ${nameQueue[i]}`
            });
        }
    }

    interaction.reply({
        embeds: [
            msg
        ]
    })
});