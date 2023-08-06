import {EmailMetadata} from '../email-metadata';
import {FilterConfig} from '../config';
import {createContext, runInContext} from 'vm';

export class FilterRule {
  constructor(private readonly filterConfig: FilterConfig) {}

  isApplicable(
    message: EmailMetadata,
    filterConfig = this.filterConfig
  ): boolean {
    if (filterConfig.type === 'not') {
      return this.isApplicable(message, filterConfig.filter);
    } else if (filterConfig.type === 'and') {
      return filterConfig.filters
        .map(rule => this.isApplicable(message, rule))
        .reduce((previousValue, currentValue) => previousValue && currentValue);
    } else if (filterConfig.type === 'or') {
      return filterConfig.filters
        .map(rule => this.isApplicable(message, rule))
        .reduce((previousValue, currentValue) => previousValue || currentValue);
    } else if (filterConfig.type === 'matcher') {
      const pattern = new RegExp(filterConfig.regex);
      if (filterConfig.field === 'to' || filterConfig.field === 'cc') {
        return message[filterConfig.field]
          .map(field => pattern.test(field))
          .reduce(
            (previousValue, currentValue) => previousValue || currentValue
          );
      } else {
        return pattern.test(message[filterConfig.field].toString());
      }
    } else if (filterConfig.type === 'datematcher') {
      const context = createContext({
        messageDate: message.date,
        date: filterConfig.date,
      });

      runInContext(
        `result = messageDate.getTime() ${filterConfig.comparator} date;`,
        context
      );

      return context.result;
    } else {
      throw new Error(`Unknown rule: ${JSON.stringify(filterConfig)}`);
    }
  }
}