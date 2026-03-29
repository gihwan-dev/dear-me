export default function PaymentLoadingFallback() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-6 text-center">
      <div className="w-20 h-20 rounded-full bg-white/80 border border-blush/40 flex items-center justify-center shadow-soft mb-6">
        <div className="w-9 h-9 rounded-full border-2 border-rose-gold/25 border-t-rose-gold motion-safe:animate-spin motion-reduce:animate-none" />
      </div>
      <div aria-live="polite" className="space-y-2 max-w-xs">
        <p className="font-[family-name:var(--font-heading)] text-xl text-soft-black">
          결제를 확인하고 있어요…
        </p>
        <p className="text-sm text-warm-gray/70 font-[family-name:var(--font-body)] leading-relaxed">
          창을 닫지 말아주세요. 편지를 안전하게 봉인하고 있어요.
        </p>
      </div>
    </div>
  );
}
