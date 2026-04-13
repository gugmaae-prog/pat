import './globals.css';

export const metadata = {
  title: 'PAT AI',
  description: 'Minimalist AI assistant and build dashboard.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
