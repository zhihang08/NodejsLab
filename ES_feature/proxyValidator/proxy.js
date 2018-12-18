import ValidationError from './error';
import { checkRules, applySanitizers } from './validation';

export default function ProxyValidator(schema, sanitizersSchema) {
  const handler = {
    set(object, prop, value) {
      let sanitizedValue = value;
      if (sanitizersSchema) {
        const { [prop]: sanitizers } = sanitizersSchema;
        // save sanitized value for later validation
        sanitizedValue = applySanitizers(sanitizers, value);
      }

      // apply validation rules on sanitizedValue
      const { [prop]: rules } = schema;
      const { success, errors } = checkRules(rules, sanitizedValue);
      if (success) {
        object[prop] = sanitizedValue;
        return success;
      }

      throw new ValidationError({ [prop]: errors });
    }
  };
  return function Proxied() {
    const target = {};
    return new Proxy(target, handler);
  };
}
