import { redirect } from 'next/navigation';

interface PaymentSuccessPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function PaymentSuccessPage({
  searchParams,
}: PaymentSuccessPageProps) {
  const resolvedSearchParams = await searchParams;
  const redirectParams = new URLSearchParams();

  for (const [key, value] of Object.entries(resolvedSearchParams)) {
    if (typeof value === 'string') {
      redirectParams.set(key, value);
      continue;
    }

    if (Array.isArray(value)) {
      for (const item of value) {
        if (item != null) {
          redirectParams.append(key, item);
        }
      }
    }
  }

  const query = redirectParams.toString();
  redirect(query ? `/payment/loading?${query}` : '/payment/loading');
}
