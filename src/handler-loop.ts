import {sleep} from './sleep';
import {ImapClient} from './imap-client';
import {Rule} from './rules/rule';
import {EmailMetadata, formatEmailMetadata} from './email-metadata';

export async function handlerLoop(
  imapClient: ImapClient,
  rules: Rule[],
  unreadMails: boolean,
  cron: boolean
) {
  do {
    let mails: EmailMetadata[];
    if (unreadMails) {
      mails = await imapClient.fetchUnreadMails();
    } else {
      mails = await imapClient.fetchReadMails();
    }

    for (const mail of mails) {
      for (const rule of rules) {
        try {
          await rule.apply(mail, imapClient);
        } catch (e) {
          console.error(`Could not process ${formatEmailMetadata(mail)}: ${e}`);
        }
      }
    }

    if (cron) {
      await sleep(300_000);
    }
  } while (cron);
}
