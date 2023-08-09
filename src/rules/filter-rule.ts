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
      const pattern = new RegExp(filterConfig.regex, filterConfig.regexFlags);
      if (filterConfig.field === 'to' || filterConfig.field === 'cc') {
        return message[filterConfig.field]
          .map(value => this.testPattern(value, pattern))
          .reduce(
            (previousValue, currentValue) => previousValue || currentValue
          );
      } else {
        return this.testPattern(
          message[filterConfig.field]?.toString(),
          pattern
        );
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

  private testPattern(value: string | undefined, pattern: RegExp): boolean {
    if (!value) {
      return false;
    }

    return pattern.test(value);
  }
}
