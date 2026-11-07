import type { Metadata } from 'next';
import { Cormorant_Garamond, Noto_Serif, Fira_Code } from 'next/font/google';
import { ThemeProvider } from '@/components/layout/ThemeProvider';
import { GlobalSkyBackdrop } from '@/components/layout/GlobalSkyBackdrop';
import './globals.css';

const cormorant = Cormorant_Garamond({
  subsets: ['latin', 'vietnamese'],
  variable: '--font-cormorant',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

const notoSerif = Noto_Serif({
  subsets: ['latin', 'vietnamese'],
  variable: '--font-noto-serif',
  display: 'swap',
  weight: ['400', '600', '700'],
});

const firaCode = Fira_Code({
  subsets: ['latin'],
  variable: '--font-fira-code',
  display: 'swap',
  weight: ['400'],
});

export const metadata: Metadata = {
  title: 'Sao Mệnh - Tử Vi Đẩu Số Việt Nam',
  description: 'Lập lá số Tử Vi Đẩu Số chính xác theo trường phái Việt Nam, lịch âm UTC+7',
};

export default function RootLayout({ children }: { children: React.ReactNode }): React.ReactNode {
  return (
    <html lang="vi" data-theme="dark" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const theme = localStorage.getItem('theme');
                if (theme === 'light') {
                  document.documentElement.setAttribute('data-theme', 'light');
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body
        className={`${cormorant.variable} ${notoSerif.variable} ${firaCode.variable} overflow-x-clip bg-background font-sans text-foreground antialiased`}
      >
        <ThemeProvider>
          <GlobalSkyBackdrop />
          <div className="relative z-10 min-w-0 overflow-x-clip">{children}</div>
        </ThemeProvider>
      </body>
    </html>
  );
}
