import {Config} from '../config';
import {readFileSync} from 'fs';
import {Validator} from 'jsonschema';
import {Rule} from './rule';
import {FilterRule} from './filter-rule';
import {Action} from './action';

export class ConfigParser {
  loadRules(): Rule[] {
    const config = this.load();

    return config.rules.map(
      ruleConfig =>
        new Rule(
          new FilterRule(ruleConfig.filter),
          ruleConfig.actions.map(actionConfig => new Action(actionConfig))
        )
    );
  }

  load(): Config {
    const config = JSON.parse(readFileSync('config.json').toString());
    const validationSchema = JSON.parse(
      readFileSync('config-schema.json').toString()
    );
    const validator = new Validator();
    validator.validate(config, validationSchema);

    return config;
  }
}
