import { ConfigProperty, ConnectorDefinitionDto } from '../../core/api/model';

export type ConnectorConfig = Record<string, unknown>;
export type ConfigKind = 'string' | 'number' | 'complex' | 'unsupported';

function isPlainObject(value: unknown): value is ConnectorConfig {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/**
 * The API returns the configuration as a JSON string, a connector created in this session has it as an object.
 * Null means it can't be read, saving would then overwrite the stored credentials.
 */
export function parseConfiguration(raw: unknown): ConnectorConfig | null {
  if (raw === undefined || raw === null || raw === '') {
    return {};
  }
  if (isPlainObject(raw)) {
    return JSON.parse(JSON.stringify(raw));
  }
  if (typeof raw !== 'string') {
    return null;
  }
  try {
    const parsed = JSON.parse(raw);
    return isPlainObject(parsed) ? parsed : null;
  } catch {
    // the error message quotes the input, which holds secrets, so it stays out of any log
    return null;
  }
}

/** The enum comes as a number from the API, although the generated model describes it as a string. */
export function configKind(property: ConfigProperty): ConfigKind {
  if (property.isArray) {
    return 'unsupported';
  }
  switch (Number(property.type)) {
    case 0:
      return 'string';
    case 1:
      return 'number';
    case 3:
      return 'complex';
    default:
      return 'unsupported';
  }
}

export function isSecretProperty(name: string | undefined): boolean {
  return !!name && /secret|key|pass|private|token/i.test(name) && !/public/i.test(name);
}

export function findConfigProperties(definitions: readonly ConnectorDefinitionDto[], exchangeName: string | null | undefined): ConfigProperty[] {
  const name = exchangeName?.toLowerCase();
  return definitions.find((x) => x.exchangeName?.toLowerCase() === name)?.configProperties ?? [];
}

/** Connectors read nested sections without checking them, so those have to exist. Values not in the definition stay. */
export function withComplexDefaults(properties: readonly ConfigProperty[], data: ConnectorConfig): ConnectorConfig {
  const result = { ...data };
  for (const property of properties) {
    if (property.name && configKind(property) === 'complex') {
      const current = result[property.name];
      result[property.name] = withComplexDefaults(property.children ?? [], isPlainObject(current) ? current : {});
    }
  }
  return result;
}
