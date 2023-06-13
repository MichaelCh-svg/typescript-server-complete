import * as dotenv from 'dotenv'
dotenv.config()

export function getEnvValue(val: string) : string{
    let env_val = process.env[val];
    if (env_val === undefined) throw new Error(val + ' not found in the environment');
    return env_val;
}