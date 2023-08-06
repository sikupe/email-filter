import {ImapClient} from './imap-client';
import {ImapSimpleOptions} from 'imap-simple';
import {handlerLoop} from './handler-loop';
import {ConfigParser} from './rules/config-parser';

async function main() {
  const config: ImapSimpleOptions = {
    imap: {
      host: process.env.EMAIL_HOST!,
      user: process.env.EMAIL_USERNAME!,
      port: parseInt(process.env.EMAIL_PORT!),
      password: process.env.EMAIL_PASSWORD!,
      tls: !!process.env.EMAIL_TLS,
      authTimeout: 5000,
    },
  };
  const client = await ImapClient.create(config);
  const rules = new ConfigParser().loadRules();
  await handlerLoop(client, rules);
}

main();
