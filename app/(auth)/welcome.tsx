import { StyleSheet, View } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { Link } from 'expo-router';
import { ThemedSurface } from '../../src/components/themed/ThemedSurface';
import { ThemedButton } from '../../src/components/themed/ThemedButton';

export default function WelcomeScreen() {
  return (
    <View style={styles.container}>
      <ThemedSurface style={styles.content}>
        <Text variant="headlineMedium" style={styles.title}>
          Welcome to PulseAI
        </Text>
        <Text variant="bodyLarge" style={styles.subtitle}>
          Your AI-powered productivity companion
        </Text>

        <View style={styles.buttons}>
          <Link href="/signup" asChild>
            <ThemedButton mode="contained">
              Get Started
            </ThemedButton>
          </Link>

          <Link href="/login" asChild>
            <ThemedButton mode="outlined" style={styles.loginButton}>
              I already have an account
            </ThemedButton>
          </Link>
        </View>
      </ThemedSurface>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
    padding: 24,
  },
  title: {
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    marginBottom: 32,
    textAlign: 'center',
    opacity: 0.7,
  },
  buttons: {
    width: '100%',
    gap: 12,
  },
  loginButton: {
    marginTop: 8,
  },
}); 