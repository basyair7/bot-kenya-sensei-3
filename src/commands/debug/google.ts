import {
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} from 'discord.js';
import { command } from '../../utils';
import superagent from 'superagent';

const meta = new SlashCommandBuilder()
  .setName("google")
  .setDescription("Searching in google machine search")
  .addStringOption((option) => {
      return option
          .setName('query')
          .setDescription('Mesin percaian sensei dari google')
          .setMinLength(1)
          .setMaxLength(2000)
          .setRequired(false)
  });

export default command(meta, async({ interaction, client }) => {
  var query = await interaction.options.getString('query');
  if (!query) return interaction.reply({
      ephemeral: true,
      content: "No Query, Please Insert Your Search",
      fetchReply: true
  });

  let result = await superagent
      .get("https://customsearch.googleapis.com/customsearch/v1")
      .query({
          q: query,
          cx: "fabc838188055482f",
          key: "AIzaSyBzYYTqN_X90RKqQfJtXbr43m8sVn3UcvM",
      });

  if (!result.body.items) return interaction.reply({
      ephemeral: true,
      content: `Yang kamu cari ${query} tidak di temukan nak`,
  });

  let res = result.body.items[0];
  var message = new EmbedBuilder()
      .setColor(0x7289)
      .setTitle(res.title)
      .setDescription(res.snippet)
      .setURL(res.link)
      .setImage(res.pagemap.cse_image[0].src || res.pagemap.cse_thumbnail[0].src);

  const buttonDelete = new ActionRowBuilder<ButtonBuilder>()
      .setComponents(
          new ButtonBuilder()
              .setCustomId("delete")
              .setLabel("Delete")
              .setStyle(ButtonStyle.Danger)
      );

  return interaction.reply({
      embeds: [message],
      components: [buttonDelete]
  })
})