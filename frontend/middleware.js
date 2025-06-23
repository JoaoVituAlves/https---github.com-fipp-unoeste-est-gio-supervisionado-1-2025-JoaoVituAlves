import { NextResponse } from 'next/server'
 
// This function can be marked `async` if using `await` inside
export function middleware(request) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("token");
  const tipo = request.cookies.get("tipo")?.value;

  // Protege /admin: exige login e bloqueia cliente
  if (pathname.startsWith('/admin')) {
    if (!token) {
      return NextResponse.redirect(new URL('/home/login', request.url));
    }

    if (tipo === 'cliente') {
      return NextResponse.redirect(new URL('/home/nao-autorizado', request.url));
    }
  }

  // Bloqueia funcionário acessando /home exceto para /home/login/logout
  if (
    pathname.startsWith('/home') && 
    tipo === 'funcionario' && 
    pathname !== '/home/login/logout'
  ) {
    return NextResponse.redirect(new URL('/home/login/logout', request.url));
  }

  return NextResponse.next();
}
 
// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/admin/:path*', '/home/:path*'],
}