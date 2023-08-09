import {EmailMetadata} from './email-metadata';

export interface Config {
  rules: RuleConfig[];
}

export interface RuleConfig {
  filter: FilterConfig;
  actions: ActionConfig[];
}

export type ActionConfig = MoveActionConfig | MarkAsReadActionConfig;

export interface MoveActionConfig {
  type: 'move';
  destination: string;
}

export interface MarkAsReadActionConfig {
  type: 'mark-as-read';
}

export type FilterConfig =
  | AndFilterConfig
  | OrFilterConfig
  | NotFilterConfig
  | MatcherFilterConfig
  | DateMatcher;

export interface MatcherFilterConfig {
  type: 'matcher';
  field: keyof Omit<EmailMetadata, 'messageId'>;
  regex: string;
  regexFlags?: string;
}

export interface DateMatcher {
  type: 'datematcher';
  comparator: '>' | '>=' | '===' | '=<' | '<';
  date: number;
}

export interface AndFilterConfig {
  type: 'and';
  filters: FilterConfig[];
}
export interface OrFilterConfig {
  type: 'or';
  filters: FilterConfig[];
}
export interface NotFilterConfig {
  type: 'not';
  filter: FilterConfig;
}
