import {sleep} from './sleep';
import {ImapClient} from './imap-client';
import {EmailMetadata, formatEmailMetadata} from './email-metadata';
import {ConfigParser} from './rules/config-parser';

export async function handlerLoop(
  imapClient: ImapClient,
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

    const rules = new ConfigParser().loadRules();

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
