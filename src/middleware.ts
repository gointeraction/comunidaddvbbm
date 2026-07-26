// BBMDev — SaaS Multi-Tenant Subdomain Resolver Middleware

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const hostname = req.headers.get('host') || '';

  // Extract subdomain from hostname (e.g. acme.bbmdev.io -> acme)
  const currentHost =
    process.env.NODE_ENV === 'production' && process.env.NEXT_PUBLIC_VERCEL_URL
      ? hostname.replace(`.${process.env.NEXT_PUBLIC_VERCEL_URL}`, '')
      : hostname.replace(`.localhost:3000`, '').replace(`.localhost:3001`, '');

  // Default to main tenant if root or localhost
  const tenantId = currentHost && !currentHost.includes('localhost') && !currentHost.includes('bbmdev.web.app')
    ? currentHost.split('.')[0]
    : 'bbmdev';

  const response = NextResponse.next();
  response.headers.set('x-tenant-id', tenantId);

  return response;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
