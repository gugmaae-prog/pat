import './globals.css';

export const metadata = {
  title: 'PAT AI',
  description: 'Minimal PAT AI interface',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
