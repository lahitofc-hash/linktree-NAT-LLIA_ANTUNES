import "./globals.css";

// app/layout.tsx

export const metadata = {
  title: "Nome da Artista | Links Oficiais",
  description: "Bio links e lançamentos",
  icons: {
    icon: "/icon.png", // Certifique-se de que o arquivo icon.png está na pasta /public ou /app
    shortcut: "/icon.png",
    apple: "/icon.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-br">
      <body className="antialiased selection:bg-purple-500/30">
        {children}
      </body>
    </html>
  );
}


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-br">
      <body className="antialiased">{children}</body>
    </html>
  );
}
