import { 
    SlashCommandBuilder, 
    EmbedBuilder,
} from "discord.js";

import { command } from "../../../utils";
import { queue, loopState } from "./constants";

const meta = new SlashCommandBuilder()
    .setName("loop")
    .setDescription("Memutarkan lagu secara berulang")
    .addBooleanOption(option =>
        option
            .setName("opsi_boolean")
            .setDescription("Pilih opsi")
            .setRequired(true)
    );

// execute program
export default command(meta, async ({ interaction, client }) => {
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

    // cek apakah lagu saat ini sedang diputar?
    if (queue.length !== 0) 
    {
        // ambil opsi boolean
        const opsi_boolean = interaction.options.getBoolean("opsi_boolean");
        if (opsi_boolean) {
            loopState[0] = true;
        }
        else {
            loopState[0] = false;
        }
        const msg = new EmbedBuilder()
            .setAuthor({
                name: "Music Loop Controller",
                iconURL: "https://img.icons8.com/color/2x/refresh--v2.gif"
            })
            .setDescription(`Loop is ${(opsi_boolean == true ? " Enabled " : " Disabled ")} for current song :white_check_mark:`)
            .setColor("Blue");
        
        return await interaction.reply({ fetchReply: true, embeds: [ msg ]});

    } else {
        const msg = new EmbedBuilder()
            .setAuthor({
                name: "Music Loop Controller",
                iconURL: "https://img.icons8.com/color/2x/refresh--v2.gif"
            })
            .setDescription("Tidak ada lagu yang sedang dimainkan")
            .setColor("Blue");

        return await interaction.reply({
            ephemeral: true,
            embeds: [ msg ]
        });
    }

});