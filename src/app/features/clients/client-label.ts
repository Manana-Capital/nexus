import { FundClient, ProfileInfoDto } from '../../core/api/model';

type ClientLike = Pick<FundClient, 'firstName' | 'lastName' | 'email'>;

export function clientName(client: ClientLike | null | undefined): string {
  return `${client?.firstName ?? ''} ${client?.lastName ?? ''}`.trim() || 'Unknown';
}

/** Name with the email, which tells apart clients of the same name. */
export function clientLabel(client: ClientLike | null | undefined): string {
  return client?.email ? `${clientName(client)} (${client.email})` : clientName(client);
}

/** The company's own account has to stand out when confirming a transaction. */
export function clientConfirmationLabel(client: FundClient | null | undefined): string {
  return client?.isSystem ? `${clientName(client)} [COMPANY account]` : clientLabel(client);
}

export function clientInitials(client: Pick<ProfileInfoDto, 'firstName' | 'lastName'> | null | undefined): string {
  return `${client?.firstName?.[0] ?? ''}${client?.lastName?.[0] ?? ''}`.toUpperCase() || '?';
}
