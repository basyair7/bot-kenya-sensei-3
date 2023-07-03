import { 
    SlashCommandBuilder, 
    EmbedBuilder,
} from "discord.js";

import { command } from "../../../utils";
import { loopState } from "./constants";

const meta = new SlashCommandBuilder()
    .setName("loop")
    .setDescription("Memutarkan lagu secara berulang")
    .addBooleanOption(option =>
        option
            .setName("boolean_opsi")
            .setDescription("Pilih opsi")
            .setRequired(true)
    );

// execute program
export default command(meta, async ({ interaction, client }) => {
    const bool = interaction.options.getBoolean("boolean_opsi");
    if (bool) {
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
        .setDescription(`Loop is ${(bool == true? " Enabled " : " Disabled ")} for current song :white_check_mark:`)
        .setColor("Blue");
    
    return interaction.reply({ fetchReply: true, embeds: [ msg ]});

});