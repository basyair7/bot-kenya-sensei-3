import {
    SlashCommandBuilder,
    EmbedBuilder
} from 'discord.js';
import { command } from '../../utils';

const meta = new SlashCommandBuilder()
    .setName('help')
    .setDescription('Show List Menu Bot')

export default command(meta, 
    async ({ interaction, client }) => {
        let listHelp = `ping\`\` => cek kecepatan internet, 
            says (ks.says pesan)\`\` => perintah mengirimkan ulang pesan ke bot, 
            servericon\`\` => menampilkan gambar icon server, 
            mukaku (ks.mukaku atau ks.mukaku @tag)\`\` => menampilkan gambar avatar member,
            stats\`\`=> status bot, 
            uptime\`\`=> waktu start bot, 
            clear\`\`=> membersihkan pesan channel, 
            sendch (ks.sendch info) \`\` => perintah bot mengirimkan ulang pesan ke channel lain,
            afk (ks.afk reason)\`\`=> perintah mengaktifkan afk, 
            nonafk\`\`=> menonaktifkan afk,
            restart\`\`=> restart ulang bot,
            google\`\`=> mesin pencarian google (ks.google halo)
            snipe\`\` => menampilkan pesan member yang dihapus`;

        let cmd1 = '`indonesia`, `ping`, `bajul`, `hmm/hm`, `iya buk`, `yaa buk`, `y`, `iya buk`, `ya buk`, `iyaa buk`';
        let cmd2 = '`gak mau buk`, `engga mau buk`, `ga mau buk`, `gak mau`, `halo`, `hallo`, `alo`, `hello`, `helo`';
        let cmd3 = '`p`, `assalamualaikum`, `assalamualaikum warahmatullahi wabarakatuh`';
        let cmd4 = '`buk kenya, gimana cara kita cepat lulus sekolah?`, `sensei, gimana cara cepat lulus sekolah?`, `curhat dong sensei`, `buk kenya, curhat dong`';
        let cmd5 = '`ngakak`, `ohayou!`, `ohayou`, `oha`, `konnichiwa`, `konbanwa`, `anyeonghaseo`';
        let cmd6 = '`diam`, `diam!`, `diem lu`, `diem`, `diem lo`, `nugas`, `belajar`, `ada tugas`, `mau belajar`, `mau bljr`, `bljr`';

        let revisedCore = listHelp
            .split("\n")
            .map((x) => "• " + "``" + "/" + x.trim())
            .join("\n");

        const messageHelp = new EmbedBuilder()
            .setTitle("Kenya-sensei Commands Help")
            .setColor("Random")
            .setThumbnail(`${client.user?.displayAvatarURL()}`)
            .setTimestamp()
            .addFields({
                name: 'Core', value: revisedCore,
            })
            .addFields({
                name: 'Commands 1', value: cmd1, inline: true

            }, {
                name: 'Commands 2', value: cmd2, inline: true
            }, {
                name: 'Commands 3', value: cmd3, inline: true
            }, {
                name: 'Commands 4', value: cmd4, inline: true
            }, {
                name: 'Commands 5', value: cmd5, inline: true
            }, {
                name: 'Commands 6', value: cmd6, inline: true
            })
            
        return interaction.reply({
            ephemeral: true,
            embeds: [
                messageHelp
            ]
        })
    }
)