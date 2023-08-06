import {connect, ImapSimpleOptions} from 'imap-simple';
import {EmailMetadata} from './email-metadata';
import {EmailParser} from './email-parser';
import {DryRunImapClient} from './dry-run-imap-client';

export class ImapClient extends DryRunImapClient {
  async markAsRead(emailMetadata: EmailMetadata) {
    await super.markAsRead(emailMetadata);

    await this.client.addFlags(emailMetadata.messageId, '\\SEEN');
  }

  async move(emailMetadata: EmailMetadata, destination: string) {
    await super.move(emailMetadata, destination);

    await this.client.openBox(emailMetadata.mailbox);
    await this.client.moveMessage(
      emailMetadata.messageId.toString(),
      destination
    );
  }

  static async create(options: ImapSimpleOptions): Promise<ImapClient> {
    return new ImapClient(await connect(options), new EmailParser());
  }
}
