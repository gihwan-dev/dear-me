import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildPaymentFailurePath,
  describePaymentFailure,
  extractPaymentErrorCode,
} from './paymentOutcome.ts';

test('maps cancellation codes to neutral copy', () => {
  const presentation = describePaymentFailure({
    code: 'PAY_PROCESS_CANCELED',
    message: '사용자가 결제를 취소했습니다.',
    source: 'redirect',
  });

  assert.equal(presentation.category, 'cancelled');
  assert.equal(presentation.tone, 'neutral');
  assert.match(presentation.inlineMessage, /결제를 취소했어요/);
});

test('maps rejection codes to rejected copy', () => {
  const presentation = describePaymentFailure({
    code: 'REJECT_CARD_COMPANY',
    message: '카드사에서 거절했습니다.',
    source: 'redirect',
  });

  assert.equal(presentation.category, 'rejected');
  assert.match(presentation.description, /다른 결제수단/);
});

test('maps unknown codes to internal copy', () => {
  const presentation = describePaymentFailure({
    code: 'PAYMENT_CONFIRM_SAVE_FAILED',
    message: '결제는 승인됐지만 주문 상태를 저장하지 못했습니다.',
    source: 'confirm',
  });

  assert.equal(presentation.category, 'internal');
  assert.match(presentation.inlineMessage, /결제 확인 중 문제가 생겼어요/);
});

test('extracts sdk cancel errors from error names', () => {
  const error = new Error('사용자가 취소했습니다.');
  error.name = 'UserCancelError';

  assert.equal(extractPaymentErrorCode(error), 'USER_CANCEL');
});

test('builds fail paths with preserved query params', () => {
  const path = buildPaymentFailurePath({
    orderId: 'dearme_123',
    code: 'PAY_PROCESS_ABORTED',
    message: '처리 중 오류',
    source: 'confirm',
  });

  assert.match(path, /^\/payment\/fail\?/);
  assert.match(path, /orderId=dearme_123/);
  assert.match(path, /code=PAY_PROCESS_ABORTED/);
  assert.match(path, /source=confirm/);
});
