import dotenvFlow from 'dotenv-flow';
dotenvFlow.config();

export const clientid = process.env.CLIENTID;
export const token = process.env.TOKEN;
export const version = process.env.VERSION;