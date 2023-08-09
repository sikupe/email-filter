import {ImapClient} from './imap-client';
import {ImapSimpleOptions} from 'imap-simple';
import {handlerLoop} from './handler-loop';
import {parseArgs} from 'util';
import {DryRunImapClient} from './dry-run-imap-client';

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

  const {
    values: {unread, dry, cron},
  } = parseArgs({
    options: {
      unread: {
        type: 'boolean',
        short: 'u',
      },
      dry: {
        type: 'boolean',
        short: 'd',
      },
      cron: {
        type: 'boolean',
        short: 'd',
      },
    },
  });

  let client: ImapClient;
  if (dry) {
    client = await DryRunImapClient.create(config);
  } else {
    client = await ImapClient.create(config);
  }
  await handlerLoop(client, !!unread, !!cron);
  client.close();
}

main();
