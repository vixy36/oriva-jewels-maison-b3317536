import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
  Link,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { SiteHeader } from "../components/site/SiteHeader";
import { SiteFooter } from "../components/site/SiteFooter";
import { MobileBottomNav } from "../components/site/MobileBottomNav";


function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <p className="eyebrow">Oriva Jewels</p>
        <h1 className="mt-4 font-serif text-7xl text-foreground">404</h1>
        <h2 className="mt-4 text-lg tracking-wide text-foreground">The page you seek is not here</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Return to the maison and continue exploring our collections.
        </p>
        <div className="mt-8">
          <Link
            to="/"
            className="inline-flex items-center justify-center border border-foreground px-8 py-3 text-xs tracking-[0.28em] uppercase transition hover:bg-foreground hover:text-background"
          >
            Return Home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <p className="eyebrow">A moment, please</p>
        <h1 className="mt-4 font-serif text-3xl text-foreground">Something didn't load</h1>
        <p className="mt-2 text-sm text-muted-foreground">Try again or return home.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <button
            onClick={() => { router.invalidate(); reset(); }}
            className="border border-foreground px-6 py-3 text-xs tracking-[0.28em] uppercase transition hover:bg-foreground hover:text-background"
          >
            Try again
          </button>
          <a href="/" className="border border-border px-6 py-3 text-xs tracking-[0.28em] uppercase transition hover:border-foreground">
            Home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Oriva Jewels — Timeless Brilliance in Natural & Lab Grown Diamonds" },
      {
        name: "description",
        content:
          "A Hong Kong fine jewellery house. Discover exceptional engagement rings, earrings, bracelets and bridal jewellery in Natural and Lab Grown diamonds.",
      },
      { name: "author", content: "Oriva Jewels" },
      { name: "theme-color", content: "#050505" },
      { property: "og:title", content: "Oriva Jewels — Timeless Brilliance in Natural & Lab Grown Diamonds" },
      {
        property: "og:description",
        content: "A Hong Kong fine jewellery house. Discover exceptional engagement rings, earrings, bracelets and bridal jewellery in Natural and Lab Grown diamonds.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Oriva Jewels — Timeless Brilliance in Natural & Lab Grown Diamonds" },
      { name: "twitter:description", content: "A Hong Kong fine jewellery house. Discover exceptional engagement rings, earrings, bracelets and bridal jewellery in Natural and Lab Grown diamonds." },
      { property: "og:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/attachments/og-images/13213527-747a-40d4-a9f0-8a08b12c219e" },
      { name: "twitter:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/attachments/og-images/13213527-747a-40d4-a9f0-8a08b12c219e" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Inter:wght@300;400;500;600&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <div className="relative min-h-screen bg-background text-foreground">
        <div className="relative z-10 flex min-h-screen flex-col">
          <SiteHeader />
          <main className="flex-1 pb-24 md:pb-0">
            <Outlet />
          </main>
          <SiteFooter />
          <MobileBottomNav />
        </div>
      </div>
    </QueryClientProvider>
  );
}
