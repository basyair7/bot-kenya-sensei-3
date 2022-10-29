import commands from '../commands'
import { Command } from '../types'
import { EditReply, event, Reply } from '../utils'

const allCommands = commands.map(({ commands }) => commands).flat()
const allCommandsMap = new Map<string, Command>(
    allCommands.map((c) => [c.meta.name, c])
)

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
    // else if(interaction.isButton())
    // {
    //     const buttons = client;
    //     const { customId } = interaction;
    //     const button = buttons.get<unknown, any>(customId);
        
    //     if(!buttons) return new Error('There is not code for this button!');

    //     try{
    //         await button.exec(interaction, client)
    //     } catch (e) {
    //         console.error(e);
    //     }
    // }
})