import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import StoreProvider from '@/components/atoms/StoreProvider';
// import favicon from '@/assets/logo.png'
import { GoogleOAuthProvider } from '@react-oauth/google';
import { Toaster } from 'react-hot-toast';
import '@mantine/core/styles.css';

import {
  MantineProvider,
  ColorSchemeScript,
  mantineHtmlProps,
} from '@mantine/core';
import { Suspense } from 'react';
import PageLoader from '@/components/atoms/pageLoader';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'PostBuddy.Ai',
  description: 'PostBuddy AI | Amplify Your Social Needs',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  /**
  
   */
  return (
    <html lang="en" {...mantineHtmlProps}>
      <head>
        <ColorSchemeScript />
        <link rel="icon" href="/favicon.svg" />
        <link rel="shortcut icon" href="/favicon.svg" />
        <script
          type="text/javascript"
          dangerouslySetInnerHTML={{
            __html: `
      function initTawk() {
        var path = window.location.pathname;
        // Only load Tawk.to on the landing page (root path)
        if(path === '/' || path === '') {
          var Tawk_API = Tawk_API || {}, Tawk_LoadStart = new Date();
          (function(){
            var s1 = document.createElement("script"),
                s0 = document.getElementsByTagName("script")[0];
            s1.async = true;
            s1.src = 'https://embed.tawk.to/67d7bebccffb4321b781d942/1imhc24ej';
            s1.charset = 'UTF-8';
            s1.setAttribute('crossorigin', '*');
            s0.parentNode.insertBefore(s1, s0);
          })();
        } else {
          // Remove Tawk widget if not on landing page
          if (typeof window !== 'undefined' && window.Tawk_API && window.Tawk_API.hideWidget) {
            window.Tawk_API.hideWidget();
          }
        }
      }
      
      // Initialize when the page loads
      if (typeof window !== 'undefined') {
        if (document.readyState === 'complete') {
          initTawk();
        } else {
          window.addEventListener('load', initTawk);
        }
        
        // Listen for Next.js route changes
        document.addEventListener('visibilitychange', function() {
          if (document.visibilityState === 'visible') {
            initTawk();
          }
        });
        
        // Additional listener for navigation events
        window.addEventListener('popstate', initTawk);
      }
    `,
          }}
        />

        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no"
        />
      </head>
      <body className={inter.className}>
        <MantineProvider>
          <div className="text-white overflow-x-hidden">
            <GoogleOAuthProvider clientId={process.env.CLIENT_ID!}>
              <StoreProvider>
                <Suspense fallback={<PageLoader />}>
                  {children}
                </Suspense>
                <Toaster position="top-center" reverseOrder={false} />
              </StoreProvider>
            </GoogleOAuthProvider>
          </div>
        </MantineProvider>
      </body>
    </html>
  );
}
