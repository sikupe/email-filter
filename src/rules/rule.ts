import {EmailMetadata} from '../email-metadata';
import {ImapClient} from '../imap-client';
import {FilterRule} from './filter-rule';
import {Action} from './action';

export class Rule {
  constructor(
    private readonly filter: FilterRule,
    private readonly actions: Action[]
  ) {}
  async apply(
    emailMetadata: EmailMetadata,
    imapClient: ImapClient
  ): Promise<void> {
    if (this.filter.isApplicable(emailMetadata)) {
      console.log(`Email filtered: ${JSON.stringify(emailMetadata)}`);

      for (const action of this.actions) {
        await action.perform(emailMetadata, imapClient);
      }
    }
  }
}
