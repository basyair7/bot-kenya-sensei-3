import { 
    SlashCommandBuilder, 
    EmbedBuilder,
} from "discord.js";
import {
    queue, numQueue
} from "./constants";
import { command } from "../../../utils";

const meta = new SlashCommandBuilder()
    .setName("remove")
    .setDescription("Hapus antrian lagu")
    .addIntegerOption((option) => 
        option
        .setName("queue_number")
        .setDescription("Pilih urutan lagu yang mau dihapus?")
        .setRequired(true)
    );

export default command(meta, async ({ interaction, client }) => {
    const numDelete: number = interaction.options.getInteger("queue_number") as number;
    if(queue.length == 1) {
        const msg: object = new EmbedBuilder()
            .setDescription(
                `:x: **Can't remove when only one song is playing, Use command stop**`
            )
            .setTimestamp()
            .setColor("Blue");
        return interaction.reply({
            ephemeral: true,
            embeds: [ msg ]
        });
    }
    if(numDelete > queue.length) {
        const msg: object = new EmbedBuilder()
            .setDescription(
                `:x: **The queue doesn't have that much songs**`
            )
            .setTimestamp()
            .setColor("Blue");
        return interaction.reply({
            ephemeral: true,
            embeds: [ msg ]
        });
    }
    if(queue.length === 0) {
        const msg: object = new EmbedBuilder()
            .setDescription(
                `:x: **There are no songs playing in this server**`
            )
            .setTimestamp()
            .setColor("Blue");
        return interaction.reply({
            ephemeral: true,
            embeds: [ msg ]
        });
    }
    const title: string = await queue[numDelete-1]["name"];
    queue.splice(numDelete - 1);

    const msg: object = new EmbedBuilder()
        .setDescription(
            `**Removed ${title} from queue :white_check_mark: **`
        )
        .setTimestamp()
        .setColor("Blue");
    return interaction.reply({
        ephemeral: true,
        embeds: [ msg ]
    });
});