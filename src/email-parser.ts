import {Message} from 'imap-simple';
import {EmailMetadata} from './email-metadata';
import {matchAll} from './regex-matcher';

export class EmailParser {
  private readonly emailPatternWithBrackets =
    /<(?<email>(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\]))>/;

  private readonly emailPatternCompleteMatch =
    /^(?<email>(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\]))$/;
  parse(message: Message, mailbox: string): EmailMetadata {
    const headers = message.parts.find(part => part.which === 'HEADER')?.body;

    return {
      from: this.parseEmails(headers, 'from')[0],
      to: this.parseEmails(headers, 'to'),
      cc: this.parseEmails(headers, 'cc'),
      date: message.attributes.date,
      messageId: message.attributes.uid,
      subject: headers.subject[0],
      mailbox,
    };
  }

  parseEmails(
    headers: Record<string, string[]>,
    field: keyof Omit<
      EmailMetadata,
      'mailbox' | 'messageId' | 'date' | 'subject'
    >
  ): string[] {
    if (!(field in headers)) {
      return [];
    }
    return [
      ...new Set([
        ...headers[field]
          .map(item =>
            matchAll(this.emailPatternWithBrackets, item).map(
              match => match.groups?.email
            )
          )
          .flat()
          .filter(email => !!email),
        ...headers[field]
          .map(item =>
            matchAll(this.emailPatternCompleteMatch, item).map(
              match => match.groups?.email
            )
          )
          .flat()
          .filter(email => !!email),
      ]),
    ] as string[];
  }
}
