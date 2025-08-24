import { NextRequest, NextResponse } from 'next/server';
import { decrypt } from './lib/session';
import { cookies } from 'next/headers';

// Définir les routes et leurs autorisations par rôle
const routeRoles: Record<string, string[]> = {
  STUDENT: ['/student', '/settings', '/profile', '/images'],
  TEACHER: ['/support', '/settings', '/profile', '/images'],
  ADMIN: ['/admin', '/settings', '/profile', '/images'],
};

// Routes qui sont explicitement publiques et ne nécessitent aucune vérification
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

  // 1. Vérifier si la route est publique
  const isPublicRoute = publicRoutes.includes(path);
  if (isPublicRoute) {
    return NextResponse.next();
  }

  // 2. Traiter les routes protégées
  try {
    // Lire le cookie de session et le décrypter
    const cookie = (await cookies()).get('session')?.value;
    const session = await decrypt(cookie);

    // Si pas de session, rediriger vers la page de connexion
    if (!session) {
      return NextResponse.redirect(new URL('/signin', req.nextUrl));
    }

    // Récupérer le rôle de l'utilisateur et les routes associées
    const userRole = session.profile as string;
    const userRoutes = routeRoles[userRole] || [];

    // Vérifier l'autorisation de l'utilisateur pour le chemin actuel
    const isAuthorized = userRoutes.some(route => path.startsWith(route));

    // Si l'utilisateur n'est pas autorisé, le rediriger
    if (!isAuthorized) {
      return NextResponse.redirect(new URL('/unauthorized', req.nextUrl));
    }

    // Autoriser l'accès à la route
    return NextResponse.next();
  } catch (error) {
    // En cas d'erreur (cookie invalide, etc.), rediriger vers la connexion
    console.error('💥 Middleware error:', error);
    return NextResponse.redirect(new URL('/signin', req.nextUrl));
  }
}

// Configuration pour le middleware : exclure les fichiers statiques et API
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)'],
};