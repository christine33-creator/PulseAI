import { useEffect } from 'react';
import { Stack, useSegments, useRouter } from 'expo-router';
import { PaperProvider } from 'react-native-paper';
import { AuthProvider, useAuth } from '../src/contexts/AuthContext';
import { ThemeProvider, useTheme } from '../src/contexts/ThemeContext';
import { ThemeTransitionProvider } from '../src/contexts/ThemeTransitionContext';

function RootLayoutNav() {
  const { session, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    const inAuthGroup = segments[0] === '(auth)';
    const inMainGroup = segments[0] === '(main)';

    if (!session && !inAuthGroup) {
      router.replace('/welcome');
    } else if (session && !inMainGroup) {
      router.replace('/home');
    }
  }, [session, loading, segments]);

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    />
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <ThemeTransitionProvider>
          <ThemedApp />
        </ThemeTransitionProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

function ThemedApp() {
  const { theme } = useTheme();
  
  return (
    <PaperProvider theme={theme}>
      <RootLayoutNav />
    </PaperProvider>
  );
} 