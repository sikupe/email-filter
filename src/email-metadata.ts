export interface EmailMetadata {
  messageId: number;
  from: string;
  to: string[];
  cc: string[];
  subject: string;
  date: Date;
  mailbox: string;
}
