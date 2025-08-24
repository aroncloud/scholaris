import { NextRequest, NextResponse } from 'next/server'
import { decrypt } from './lib/session'
import { cookies } from 'next/headers'

// 👉 Routes autorisées par rôle
const routeRoles: Record<string, string[]> = {
  'STUDENT': ['/student', '/settings', '/profile', '/images'],
  'TEACHER': ['/support', '/settings', '/profile', '/images'],
  'ADMIN': ['/admin', '/settings', '/profile', '/images'],
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
  
  // 🚨 DIAGNOSTIC: Toujours logger l'exécution du middleware

  // ✅ Vérification des routes publiques (root path handled separately)
  const isPublic = publicRoutes.some(publicPath => path.startsWith(publicPath)) || path === '/';
  if (isPublic) {
    return NextResponse.next();
  }

  try {
    // 🔒 Lire et décrypter le cookie
    const cookie = (await cookies()).get('session')?.value;
    
    const session = await decrypt(cookie);

    // ⛔️ Pas de session, rediriger vers login
    if (!session) {
      return NextResponse.redirect(new URL('/signin', req.nextUrl));
    }

    // 🔐 Vérification des autorisations
    const userRole = session.profile || '';
    const userRoutes = routeRoles[userRole] || [];
    

    // Vérifier l'autorisation
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
    /*
     * Pattern recommandé par Next.js pour exclure les routes internes et fichiers statiques
     * Exclut: api, _next/static, _next/image, favicon.ico et tous les fichiers avec extension
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|images).*)',
  ],
}

// 🔧 Pour debug : exporter une fonction de test
export function testMiddleware() {
  console.log('Middleware file loaded successfully');
  return true;
}