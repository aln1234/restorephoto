import "./globals.css";

export const metadata = {
  title: "Clearify",
  description:
    "Photo restorer application made in Next Js poowered by Replicate Api",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
