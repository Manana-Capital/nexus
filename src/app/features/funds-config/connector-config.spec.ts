import { describe, expect, it } from 'vitest';
import { ConfigProperty } from '../../core/api/model';
import { configKind, findConfigProperties, isSecretProperty, parseConfiguration, withComplexDefaults } from './connector-config';

const property = (name: string, type: number, extra: Partial<ConfigProperty> = {}): ConfigProperty =>
  ({ name, type, ...extra }) as unknown as ConfigProperty;

describe('parseConfiguration', () => {
  it('reads the JSON string of the API', () => {
    expect(parseConfiguration('{"ApiKey":"abc"}')).toEqual({ ApiKey: 'abc' });
  });

  it('copies objects, editing must not touch the row in the table', () => {
    const original = { Nested: { a: 1 } };
    const parsed = parseConfiguration(original) as { Nested: { a: number } };
    parsed.Nested.a = 2;
    expect(original.Nested.a).toBe(1);
  });

  it('treats a missing configuration as empty', () => {
    expect(parseConfiguration(null)).toEqual({});
    expect(parseConfiguration(undefined)).toEqual({});
    expect(parseConfiguration('')).toEqual({});
  });

  it('refuses what it can not read instead of losing it', () => {
    expect(parseConfiguration('{broken')).toBeNull();
    expect(parseConfiguration('[1]')).toBeNull();
    expect(parseConfiguration('"text"')).toBeNull();
    expect(parseConfiguration(5)).toBeNull();
  });
});

describe('configKind', () => {
  it('reads numbers and strings of the enum', () => {
    expect(configKind(property('a', 0))).toBe('string');
    expect(configKind({ name: 'a', type: '1' })).toBe('number');
    expect(configKind(property('a', 3))).toBe('complex');
  });

  it('does not offer an editor for arrays and dates', () => {
    expect(configKind(property('a', 2))).toBe('unsupported');
    expect(configKind(property('a', 0, { isArray: true }))).toBe('unsupported');
  });
});

describe('isSecretProperty', () => {
  it('recognizes the credentials of the connectors', () => {
    for (const name of ['ApiKey', 'ApiSecret', 'AccessKey', 'SecretKey', 'Secret', 'PrivateKey', 'Passphrase', 'ApiPassphrase', 'AccessSecret']) {
      expect(isSecretProperty(name), name).toBe(true);
    }
  });

  it('leaves public values readable', () => {
    for (const name of ['PublicKey', 'Pair', 'ClientId', 'Account', 'Address1', 'XPub1']) {
      expect(isSecretProperty(name), name).toBe(false);
    }
    expect(isSecretProperty(undefined)).toBe(false);
  });
});

describe('findConfigProperties', () => {
  const definitions = [{ exchangeName: 'Kraken', configProperties: [property('ApiKey', 0)] }];

  it('ignores the letter case of the exchange', () => {
    expect(findConfigProperties(definitions, 'kraken')).toHaveLength(1);
  });

  it('is empty for an exchange without a definition', () => {
    expect(findConfigProperties(definitions, 'Unknown')).toEqual([]);
    expect(findConfigProperties(definitions, null)).toEqual([]);
    expect(findConfigProperties([], 'Kraken')).toEqual([]);
  });
});

describe('withComplexDefaults', () => {
  const properties = [property('Key', 0), property('Outer', 3, { children: [property('Inner', 3, { children: [property('A', 0)] })] })];

  it('creates nested sections', () => {
    expect(withComplexDefaults(properties, {})).toEqual({ Outer: { Inner: {} } });
  });

  it('keeps entered values and values outside of the definition', () => {
    const data = { Key: 'k', Legacy: 1, Outer: { Inner: { A: 'x' }, Other: 2 } };
    expect(withComplexDefaults(properties, data)).toEqual(data);
  });

  it('does not change the input', () => {
    const data = {};
    withComplexDefaults(properties, data);
    expect(data).toEqual({});
  });
});
