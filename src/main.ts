import {ImapClient} from './imap-client';
import {ImapSimpleOptions} from 'imap-simple';

async function main() {
  console.log('test 3');
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
  const unreadMails = await client.fetchUnreadMails();
  const readMails = await client.fetchReadMails();
  console.log(unreadMails);
}

main();
