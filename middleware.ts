import NextAuth from "next-auth";
import authConfig from "@/auth.config";
import {
  DEFAULT_LOGIN_REDIRECT,
  apiAuthPrefix,
  authRoutes,
  publicRoutes,
} from "@/routes";
import { getUserWorkspaces } from "./actions/workspace";

const { auth } = NextAuth(authConfig);

export default auth(async (req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);
  const isWorkspaceRoute = nextUrl.pathname.startsWith("/workspace");
  const isWorkspaceSelectRoute = nextUrl.pathname === "/workspace/select";

  if (isApiAuthRoute) {
    return null;
  }

  if (isAuthRoute) {
    if (isLoggedIn) {
      return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    }
    return null;
  }

  if (!isLoggedIn && !isPublicRoute) {
    let callbackUrl = nextUrl.pathname;
    if (nextUrl.search) {
      callbackUrl += nextUrl.search;
    }

    const encodedCallbackUrl = encodeURIComponent(callbackUrl);
    return Response.redirect(
      new URL(`/auth/login?callbackUrl=${encodedCallbackUrl}`, nextUrl)
    );
  }

  // If user is logged in, check for workspace
  if (isLoggedIn) {
    const { workspaces, error } = await getUserWorkspaces();
    const hasWorkspaces = !error && workspaces && workspaces.length > 0;

    // If user has no workspaces and isn't on the select page, redirect to select
    if (!hasWorkspaces && !isWorkspaceSelectRoute) {
      return Response.redirect(new URL("/workspace/select", nextUrl));
    }

    // If user has workspaces and is on the select page, redirect to first workspace
    if (hasWorkspaces && isWorkspaceSelectRoute) {
      return Response.redirect(new URL(`/workspace/${workspaces[0].id}`, nextUrl));
    }

    // If user has workspaces but tries to access root, redirect to first workspace
    if (hasWorkspaces && nextUrl.pathname === "/") {
      return Response.redirect(new URL(`/workspace/${workspaces[0].id}`, nextUrl));
    }

    // If user has workspaces and tries to access a workspace they're not part of
    if (hasWorkspaces && isWorkspaceRoute && !isWorkspaceSelectRoute) {
      const workspaceId = nextUrl.pathname.split("/")[2];
      const hasAccess = workspaces.some(w => w.id === workspaceId);
      
      if (!hasAccess) {
        return Response.redirect(new URL(`/workspace/${workspaces[0].id}`, nextUrl));
      }
    }
  }

  return null;
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};