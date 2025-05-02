import { Inter } from "next/font/google";
import AuthProvider from "./components/AuthProvider";
import ThemeRegistry from "./components/ThemeRegistry";
import ClientLayoutWrapper from "./components/ClientLayoutWrapper";
import { ToastContainer, toast } from "react-toastify";
import ReactQueryProvider from "./reeact-query-provider";
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "AutoChat App",
  description: "Next.js application with MongoDB Atlas integration",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
        className={inter.className}
      >
        <AuthProvider>
          <ThemeRegistry>
            <ClientLayoutWrapper>
              <ReactQueryProvider> {children}</ReactQueryProvider>
            </ClientLayoutWrapper>
            <ToastContainer />
          </ThemeRegistry>
        </AuthProvider>
      </body>
    </html>
  );
}
