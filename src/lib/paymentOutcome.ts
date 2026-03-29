export type PaymentFailureSource = 'sdk' | 'redirect' | 'confirm';
export type PaymentFailureCategory = 'cancelled' | 'retryable' | 'rejected' | 'internal';
export type PaymentTone = 'neutral' | 'critical';

const PAYMENT_FAILURE_SOURCES = ['sdk', 'redirect', 'confirm'] as const;

export interface PaymentFailureInput {
  code?: string | null;
  message?: string | null;
  source: PaymentFailureSource;
}

export interface PaymentFailurePresentation {
  code: string;
  rawMessage: string;
  category: PaymentFailureCategory;
  tone: PaymentTone;
  title: string;
  description: string;
  inlineMessage: string;
  ctaLabel: string;
}

const CANCELLED_CODES = new Set([
  'USER_CANCEL',
  'PAY_PROCESS_CANCELED',
]);

const RETRYABLE_CODES = new Set([
  'PAY_PROCESS_ABORTED',
  'PROVIDER_STATUS_UNHEALTHY',
  'PROVIDER_ERROR',
  'UNKNOWN',
]);

const REJECTED_CODES = new Set([
  'REJECT_CARD_COMPANY',
  'REJECT_CARD_PAYMENT',
  'REJECT_ACCOUNT_PAYMENT',
  'INVALID_REJECT_CARD',
]);

function normalizeFailureCode(code?: string | null): string {
  const normalized = code?.trim();
  return normalized ? normalized.toUpperCase() : 'UNKNOWN';
}

export function normalizePaymentFailureSource(
  value: string | null | undefined,
  fallback: PaymentFailureSource = 'redirect',
): PaymentFailureSource {
  return PAYMENT_FAILURE_SOURCES.includes(value as PaymentFailureSource)
    ? (value as PaymentFailureSource)
    : fallback;
}

export function readSingleValue(
  value: string | string[] | undefined,
): string | null {
  if (typeof value === 'string') {
    return value;
  }

  if (Array.isArray(value)) {
    return value[0] ?? null;
  }

  return null;
}

export function describePaymentFailure({
  code,
  message,
}: PaymentFailureInput): PaymentFailurePresentation {
  const normalizedCode = normalizeFailureCode(code);
  const rawMessage = message?.trim();

  if (CANCELLED_CODES.has(normalizedCode)) {
    return {
      code: normalizedCode,
      rawMessage: rawMessage || '결제를 취소했습니다.',
      category: 'cancelled',
      tone: 'neutral',
      title: '결제를 취소했어요.',
      description: '원하면 다시 편지를 보낼 수 있어요.',
      inlineMessage: '결제를 취소했어요. 원하면 다시 편지를 보낼 수 있어요.',
      ctaLabel: '다시 편지 쓰기',
    };
  }

  if (REJECTED_CODES.has(normalizedCode)) {
    return {
      code: normalizedCode,
      rawMessage: rawMessage || '결제수단 승인이 거절되었습니다.',
      category: 'rejected',
      tone: 'critical',
      title: '결제수단 승인이 거절되었어요.',
      description: '다른 결제수단으로 다시 시도해주세요.',
      inlineMessage:
        '결제수단 승인이 거절되었어요. 다른 결제수단으로 다시 시도해주세요.',
      ctaLabel: '다시 편지 쓰기',
    };
  }

  if (RETRYABLE_CODES.has(normalizedCode)) {
    return {
      code: normalizedCode,
      rawMessage: rawMessage || '결제를 완료하지 못했습니다.',
      category: 'retryable',
      tone: 'critical',
      title: '결제를 완료하지 못했어요.',
      description: '잠시 후 다시 시도해주세요.',
      inlineMessage: '결제를 완료하지 못했어요. 잠시 후 다시 시도해주세요.',
      ctaLabel: '다시 편지 쓰기',
    };
  }

  return {
    code: normalizedCode,
    rawMessage: rawMessage || '결제 확인 중 오류가 발생했습니다.',
    category: 'internal',
    tone: 'critical',
    title: '결제 확인 중 문제가 생겼어요.',
    description: '잠시 후 다시 시도해주세요.',
    inlineMessage: '결제 확인 중 문제가 생겼어요. 잠시 후 다시 시도해주세요.',
    ctaLabel: '다시 편지 쓰기',
  };
}

export function extractPaymentErrorCode(error: unknown): string | undefined {
  if (
    error &&
    typeof error === 'object' &&
    'code' in error &&
    typeof error.code === 'string'
  ) {
    return error.code;
  }

  if (error instanceof Error && error.name === 'UserCancelError') {
    return 'USER_CANCEL';
  }

  return undefined;
}

export function extractPaymentErrorMessage(error: unknown): string | undefined {
  if (
    error &&
    typeof error === 'object' &&
    'message' in error &&
    typeof error.message === 'string'
  ) {
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return undefined;
}

export function buildPaymentFailurePath({
  orderId,
  code,
  message,
  source,
}: {
  orderId?: string | null;
  code?: string | null;
  message?: string | null;
  source: PaymentFailureSource;
}): string {
  const params = new URLSearchParams();

  if (orderId) {
    params.set('orderId', orderId);
  }

  if (code) {
    params.set('code', code);
  }

  if (message) {
    params.set('message', message);
  }

  params.set('source', source);

  const query = params.toString();
  return query ? `/payment/fail?${query}` : '/payment/fail';
}
