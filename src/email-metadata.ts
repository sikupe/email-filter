export interface EmailMetadata {
  messageId: number;
  from?: string;
  to: string[];
  cc: string[];
  subject?: string;
  date: Date;
  mailbox: string;
}

export function formatEmailMetadata(emailMetadata: EmailMetadata) {
  return `${emailMetadata.subject?.substring(0, 30)} (sender: ${
    emailMetadata.from
  })`;
}
