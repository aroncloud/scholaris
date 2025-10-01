import { NextRequest, NextResponse } from 'next/server'
import { decrypt } from './lib/session'
import { cookies } from 'next/headers'

// 👉 Routes autorisées par rôle
const routeRoles: Record<string, string[]> = {
  'STUDENT': ['/dashboard/student', '/dashboard/settings', '/dashboard/profile', '/dashboard/images'],
  'TEACHER': ['/dashboard/teacher', '/dashboard/support', '/dashboard/settings', '/dashboard/profile', '/dashboard/images'],
  'ADMIN_SUPER': ['/dashboard/admin', '/dashboard/settings', '/dashboard/profile', '/dashboard/images'],
  'ADMIN_ACADEMIC': ['/dashboard/admin', '/dashboard/settings', '/dashboard/profile', '/dashboard/images'],
};

const publicRoutes = [
  '/signin',
  '/about',
  '/actualites',
  '/admission-request',
  '/admissions',
  '/contacts',
  '/faq',
  '/formations',
  '/recrutement',
  '/not-found',
  '/unauthorized'
];

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  // Vérification des routes publiques (root inclus)
  const isPublic = publicRoutes.some(publicPath => path.startsWith(publicPath)) || path === '/';
  if (isPublic) {
    return NextResponse.next();
  }

  try {
    // 🔒 Lire et décrypter le cookie
    const cookie = (await cookies()).get('session')?.value;
    const session = await decrypt(cookie);

    // ⛔️ Pas de session
    if (!session) {
      return NextResponse.redirect(new URL('/signin', req.nextUrl));
    }

    // 🔐 Vérification des autorisations
    const userRoles: string[] = Array.isArray(session.roles) ? session.roles : [session.roles];

    // Agréger toutes les routes autorisées pour tous les rôles de l’utilisateur
    const userRoutes = userRoles.flatMap(role => routeRoles[role] || []);

    // Vérifier si l’utilisateur peut accéder à la route actuelle
    const isAuthorized = userRoutes.some(route => path.startsWith(route));

    if (!isAuthorized) {
      return NextResponse.redirect(new URL('/unauthorized', req.nextUrl));
    }

    return NextResponse.next();

  } catch (error) {
    console.error('💥 Middleware error:', error);
    return NextResponse.redirect(new URL('/signin', req.nextUrl));
  }
}

export const config = {
  matcher: [
    // Exclut: api, _next/static, _next/image, favicon.ico et fichiers statiques
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|images).*)',
  ],
};
