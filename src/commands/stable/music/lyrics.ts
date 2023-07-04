import {
    SlashCommandBuilder,
    EmbedBuilder
} from "discord.js";
import { command } from "../../../utils";
import { queue } from "./constants";

const meta = new SlashCommandBuilder()
    .setName("lyric")
    .setDescription("Menampilkan lirik lagu saat ini")

export default command(meta, async ({interaction, client}) => {
    try {
        if(queue.length === 0) {
            return await interaction.reply({
                ephemeral: true,
                content: "There is noting playing."
            });
        }
        let lyrics: string = "";

        try {
            const lyricFinder = require("lyric-finder");
            lyrics = await lyricFinder(queue[0]["name"], "");
            if (!lyrics) lyrics = `No lyrics found for ${queue[0]["name"]} :x:`;

        } catch(e) {
            lyrics = `No lyrics found for ${queue[0]["name"]} :x:`;
        }
        let lyricsEmbed = new EmbedBuilder()
            .setAuthor({
                name: `Lyrics for ${queue[0]["name"]}`,
                iconURL: "https://img.icons8.com/color/2x/task--v2.gif"
            })
            .setDescription(lyrics)
            .setColor("Blue")
            .setTimestamp();
        
        return await interaction.reply({
            ephemeral: true,
            embeds: [ lyricsEmbed ]
        });

    } catch(e) {
        console.error(`Something went error in lyrics.ts ${e}`);
    }
})