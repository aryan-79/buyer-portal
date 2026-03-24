import { createIsomorphicFn } from '@tanstack/react-start';
import { getRequest } from '@tanstack/react-start/server';
import { clsx, type ClassValue } from 'clsx';
import { cache } from 'react';
import { twMerge } from 'tailwind-merge';
import { fetchGetAuthSession } from './queries/query-components';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type Locale = 'en-US' | 'en-IN';

type ParsePriceOptions = {
  locale?: Locale;
  currency?: string;
};

export function parsePrice(price: number, opts: ParsePriceOptions = {}): string {
  try {
    const currency = opts.currency || 'NPR';

    const locale: Locale = opts.locale
      ? opts.locale
      : ['npr', 'inr'].includes(currency.toLowerCase())
        ? 'en-IN'
        : 'en-US';

    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      maximumFractionDigits: 2,
    }).format(price);
  } catch {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'NPR',
      maximumFractionDigits: 2,
    }).format(price);
  }
}

export const getServerCookies = createIsomorphicFn()
  .server(() => {
    const req = getRequest();
    const headers = req.headers;
    return headers.get('cookie');
  })
  .client(() => {
    return;
  });

export const getSession = cache(fetchGetAuthSession);
