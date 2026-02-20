import { RouterProvider } from 'react-router';
import { AppProvider, useApp } from './context/AppContext';
import { LoginPage } from './components/LoginPage';
import { router } from './routes';
import { Toaster } from './components/ui/sonner';
import { LoadingScreen } from './components/LoadingScreen'; // Make sure this is imported
import { AnimatePresence, motion } from 'framer-motion';

function AppContent() {
  const { currentUser, loading } = useApp();

  return (
    <AnimatePresence mode="wait">
      {loading ? (
        // Smooth fade-out for the loading screen
        <motion.div
          key="loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <LoadingScreen />
        </motion.div>
      ) : !currentUser ? (
        // Smooth fade-in for the login page
        <motion.div
          key="login"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
        >
          <LoginPage />
        </motion.div>
      ) : (
        // Smooth fade-in for the main dashboard
        <motion.div
          key="app"
          className="h-screen w-full"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <RouterProvider router={router} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
      <Toaster position="top-right" expand={false} richColors />
    </AppProvider>
  );
}