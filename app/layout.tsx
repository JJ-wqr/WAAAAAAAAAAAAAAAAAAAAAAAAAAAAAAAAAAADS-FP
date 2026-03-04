import "./globals.css"

export const metadata = {
  title: "Linguiny",
  description: "Language Learning App",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-100">
        {children}
      </body>
    </html>
  )
};