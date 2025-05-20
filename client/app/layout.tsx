import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/lib/auth-context"
import "./globals.css"
import { ToastContainer } from "react-toastify"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "StreakTracker",
  description: "Track your habits and manage your tasks",
    generator: 'v0.dev'
}

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/StreakTracker_logo.png" />
      </head>
      <body className={inter.className} suppressHydrationWarning>
        <AuthProvider>
          <ThemeProvider 
            attribute="class" 
            defaultTheme="light"
            enableSystem={false}
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </AuthProvider>
        <ToastContainer />
      </body>
    </html>
  )
}
