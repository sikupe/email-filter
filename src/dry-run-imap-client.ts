import {ImapClient} from './imap-client';
import {EmailMetadata, formatEmailMetadata} from './email-metadata';
import {connect, ImapSimple, ImapSimpleOptions} from 'imap-simple';
import {EmailParser} from './email-parser';

export class DryRunImapClient {
  constructor(
    protected readonly client: ImapSimple,
    protected readonly emailParser: EmailParser
  ) {}

  async markAsRead(emailMetadata: EmailMetadata) {
    this.log(emailMetadata, 'Mark as read');
  }

  async move(emailMetadata: EmailMetadata, destination: string): Promise<void> {
    this.log(emailMetadata, `Move to '${destination}'`);
  }

  async fetchUnreadMails(): Promise<EmailMetadata[]> {
    const inbox = 'INBOX';
    await this.client.openBox(inbox);
    const results = await this.client.search(['UNSEEN'], {
      markSeen: false,
      bodies: ['HEADER', 'TEXT'],
    });
    return results.map(msg => this.emailParser.parse(msg, inbox));
  }

  async fetchReadMails(): Promise<EmailMetadata[]> {
    const inbox = 'INBOX';
    await this.client.openBox(inbox);
    const results = await this.client.search(['SEEN'], {
      markSeen: false,
      bodies: ['HEADER', 'TEXT'],
    });
    return results.map(msg => this.emailParser.parse(msg, inbox));
  }

  close() {
    this.client.end();
  }

  log(emailMetadata: EmailMetadata, operation: string) {
    console.log(`${operation}: ${formatEmailMetadata(emailMetadata)}`);
  }

  static async create(options: ImapSimpleOptions): Promise<ImapClient> {
    return new DryRunImapClient(await connect(options), new EmailParser());
  }
}
