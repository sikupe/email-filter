import {EmailMetadata} from '../email-metadata';
import {ImapClient} from '../imap-client';
import {ActionConfig} from '../config';

export class Action {
  constructor(private readonly action: ActionConfig) {}
  async perform(emailMetadata: EmailMetadata, imapClient: ImapClient) {
    if (this.action.type === 'move') {
      return imapClient.move(emailMetadata, this.action.destination);
    } else if (this.action.type === 'mark-as-read') {
      return imapClient.markAsRead(emailMetadata);
    } else {
      return Promise.reject(new Error('Unknown action'));
    }
  }
}
