import {connect, ImapSimple, ImapSimpleOptions} from 'imap-simple';
import {EmailMetadata} from './email-metadata';
import {EmailParser} from './email-parser';

export class ImapClient {
  constructor(
    private readonly client: ImapSimple,
    private readonly emailParser: EmailParser
  ) {}

  async markAsRead(emailMetadata: EmailMetadata) {
    await this.client.addFlags(emailMetadata.messageId, '\\SEEN');
  }

  async move(emailMetadata: EmailMetadata, destination: string) {
    await this.client.openBox(emailMetadata.mailbox);
    await this.client.moveMessage(
      emailMetadata.messageId.toString(),
      destination
    );
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
    const results = await this.client.search(['SEEN', '1:20'], {
      markSeen: false,
      bodies: ['HEADER', 'TEXT'],
    });
    return results.map(msg => this.emailParser.parse(msg, inbox));
  }

  static async create(options: ImapSimpleOptions): Promise<ImapClient> {
    return new ImapClient(await connect(options), new EmailParser());
  }
}
