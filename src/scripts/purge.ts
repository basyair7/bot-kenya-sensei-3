import { config } from 'dotenv';
import { resolve } from 'path';

config({ path: resolve(__dirname, '..', '..', '.env') });

import {
    REST,
    Routes
} from 'discord.js';
import keys from '../keys';

const rest = new REST({ version: '10' }).setToken(keys.clientToken);

// ....

// for guild-based commands
rest.put(Routes.applicationGuildCommands(keys.clientId, keys.testGuild), { body: [] })
    .then(() => console.log('Successfully deleted all guild commands.'))
	.catch(console.error);

// for global commands
rest.put(Routes.applicationCommands(keys.clientId), { body: [] })
	.then(() => console.log('Successfully deleted all application commands.'))
	.catch(console.error);