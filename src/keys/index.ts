import { Keys } from "../types";
const keys: Keys = {
    clientToken: process.env.CLIENT_TOKEN ?? 'nil',
    testGuild: process.env.TEST_GUILD ?? 'nil',
    clientId: process.env.CLIENT_ID ?? 'nil',
}

if (Object.values(keys).includes('nil'))
    throw new Error("Not all ENV variables are defined!");

export default keys