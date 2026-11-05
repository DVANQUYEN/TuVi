import { NextResponse, type NextRequest } from 'next/server';
import { decodeChartUrl } from '@/lib/utils/share';
import { EARTHLY_BRANCHES } from '@/lib/ziwei/types/enums';

const VALID_BRANCHES = new Set<string>(EARTHLY_BRANCHES);

export function proxy(request: NextRequest): NextResponse | undefined {
  const { pathname, searchParams } = request.nextUrl;

  const branchMatch = pathname.match(/^\/tu-vi-hang-ngay\/([^/]+)\/?$/);
  if (branchMatch && !VALID_BRANCHES.has(branchMatch[1])) {
    return new NextResponse('Not Found', { status: 404 });
  }

  if (/^\/chia-se\/[^/]+\/?$/.test(pathname)) {
    const data = searchParams.get('data');
    if (!data || !decodeChartUrl(data)) {
      return new NextResponse('Not Found', { status: 404 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/tu-vi-hang-ngay/:path*', '/chia-se/:path*'],
};
