import {sleep} from './sleep';
import {ImapClient} from './imap-client';
import {Rule} from './rules/rule';

export async function handlerLoop(imapClient: ImapClient, rules: Rule[]) {
  while (true) {
    const unreadMails = await imapClient.fetchUnreadMails();

    for (const mail of unreadMails) {
      for (const rule of rules) {
        await rule.apply(mail, imapClient);
      }
    }

    await sleep(300_000);
  }
}
