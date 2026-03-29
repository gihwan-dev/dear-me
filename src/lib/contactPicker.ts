import { normalizePhoneNumber } from '@/lib/phone';

type ContactProperty = 'name' | 'tel';

interface ContactRecord {
  name?: string[];
  tel?: string[];
}

interface ContactsManager {
  getProperties(): Promise<ContactProperty[]>;
  select(
    properties: ContactProperty[],
    options: { multiple: boolean },
  ): Promise<ContactRecord[]>;
}

declare global {
  interface Navigator {
    contacts?: ContactsManager;
  }
}

export interface ContactSelection {
  name?: string;
  phone?: string;
}

function isTopLevelSecureContext(): boolean {
  if (typeof window === 'undefined' || !window.isSecureContext) {
    return false;
  }

  try {
    return window.top === window.self;
  } catch {
    return false;
  }
}

export async function canUseContactPicker(): Promise<boolean> {
  if (typeof navigator === 'undefined' || !isTopLevelSecureContext() || !navigator.contacts) {
    return false;
  }

  try {
    const supportedProperties = await navigator.contacts.getProperties();
    return supportedProperties.includes('name') || supportedProperties.includes('tel');
  } catch {
    return false;
  }
}

export async function selectSingleContact(): Promise<ContactSelection | null> {
  if (typeof navigator === 'undefined' || !(await canUseContactPicker()) || !navigator.contacts) {
    return null;
  }

  const supportedProperties = await navigator.contacts.getProperties();
  const properties = (['name', 'tel'] as const).filter((property) =>
    supportedProperties.includes(property),
  );

  if (properties.length === 0) {
    return null;
  }

  const contacts = await navigator.contacts.select(properties, { multiple: false });
  const selected = contacts[0];

  if (!selected) {
    return null;
  }

  return {
    name: selected.name?.[0]?.trim() || undefined,
    phone: normalizePhoneNumber(selected.tel?.[0] || ''),
  };
}
