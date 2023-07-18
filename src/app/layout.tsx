// 'use client';
import './globals.css';
import { Kanit } from 'next/font/google';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import DataProvider from '@/components/DataProvider';
import React from 'react';
import { SnackbarProvider } from 'notistack';

// const inter = Noto_Sans_TC({
//   subsets: ['latin'],
//   weight: ['100', '300', '400', '500', '700', '900'],
// });
const outer = Kanit({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
});
// const tester = Russo_One({
//   subsets: ['latin'],
//   weight: '400'
// });

export const metadata = {
  title: 'Wave To Go',
  description: 'Wave it easy,wave to go!',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={outer.className}>
        {/* <SnackbarProvider maxSnack={2}> */}
        <DataProvider />
        <Header />
        {children}
        <Footer />
        {/* </SnackbarProvider> */}
      </body>
    </html>
  );
}
