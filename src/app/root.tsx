import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import type { LinksFunction } from "@remix-run/cloudflare";

import "./tailwind.css";
import { Footer } from "./components/footer";
import { Header } from "./components/header";

export const links: LinksFunction = () => [
  { rel: "preconnect", href: "https://cdnjs.cloudflare.com" },
  {
    rel: "stylesheet",
    href: "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.2/css/all.min.css",
    integrity: "sha512-1sCRPdkRXhBV2PBLUdRb4tMg1w2YPf37qatUFeS7zlBy7jJI8Lf4VHwWfZZfpXtYSLy85pkm9GaYVYMfw5BC1A==",
    crossOrigin: "anonymous",
  },
  {
    rel: 'canonical',
    href: 'https://hayden.moe',
  },
  { rel: 'icon', href: '/favicon.ico' },
  { rel: 'icon', sizes: '32x32', href: '/favicon-32x32.png' },
  { rel: 'icon', sizes: '16x16', href: '/favicon-16x16.png' },
  { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="bg-black text-white font-mono tracking-normal leading-normal flex flex-col min-h-screen selection:bg-[var(--base0E)] selection:text-black">
        <div className="flex flex-col flex-grow">
          <Header />

          <main className="mt-20 flex flex-col gap-3 px-5 flex-grow">
            {children}
          </main>

          <footer className="page__footer">
            <Footer />
          </footer>
        </div>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
