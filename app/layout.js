import "./globals.css";

export const metadata = {
  title: "EduBot",
  description: "A ChatBot for your educational needs",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
