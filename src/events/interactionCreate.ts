import { Message } from 'discord.js';
import commands from '../commands'
import { Command } from '../types'
import { EditReply, event, Reply } from '../utils'
import { idUser, idMember, idGuild } from '../commands/debug/constants';

const allCommands = commands.map(({ commands }) => commands).flat()
const allCommandsMap = new Map<string, Command>(
    allCommands.map((c) => [c.meta.name, c])
);

export default event('interactionCreate', async (
    {
        log,
        client,
    },
    interaction,
) => {
    if (interaction.isChatInputCommand())
    {
        try {
            const commandName = interaction.commandName
            const command = allCommandsMap.get(commandName)
    
            if (!command) throw new Error('Command not found...')
    
            await command.exec({
                client,
                interaction,
                log(...args) {
                    log(`[${command.meta.name}]`, ...args)
                },
            })
        } catch (error) {
            log('[Command Error]', error)
    
            if (interaction.deferred)
                return interaction.editReply(
                    EditReply.error('Something went wrong :(')
                )
    
            return interaction.reply(
                Reply.error('Something went wrong :(')
            )
        }
    }
    /*
    if (interaction.isButton())
    {
        if(interaction.customId === 'delete'){
            return await interaction.message.delete();
        }
    }
    */
    if (interaction.isButton())
    {
        if(interaction.customId === 'delete'){
            const user = client.guilds.cache.get(interaction.guild?.id!);
            const member = user?.members.cache.get(interaction.user.id);
            console.log(idMember[0]);
            for(let i = 0; i < idMember.length; i++) {
                const tagName = client.users.cache.get(idMember[i].id);
                if(idMember[i] == member){
                    idMember.splice(i - 1);
                    return await interaction.message.delete();
                }
                else return interaction.reply({
                    ephemeral: true,
                    content: `Pesan hanya bisa dihapus oleh ${tagName?.username}`
                });
            }
        }
    }

})