import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { Link, router } from 'expo-router';
import { supabase } from '../../src/services/supabase';
import { ThemedSurface } from '../../src/components/themed/ThemedSurface';
import { ThemedButton } from '../../src/components/themed/ThemedButton';
import { ThemedInput } from '../../src/components/themed/ThemedInput';

export default function SignupScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSignup = async () => {
    try {
      setLoading(true);
      setError('');

      if (password !== confirmPassword) {
        throw new Error('Passwords do not match');
      }

      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            settings: {
              theme: 'system',
              dailyGoal: 240,
              enableNotifications: true,
              focusDuration: 25,
              breakDuration: 5,
              longBreakDuration: 15,
              sessionsUntilLongBreak: 4,
            },
          },
        },
      });

      if (error) throw error;
      router.replace('/home');
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ThemedSurface style={styles.content}>
        <Text variant="headlineMedium" style={styles.title}>Create Account</Text>

        <ThemedInput
          label="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <ThemedInput
          label="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <ThemedInput
          label="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
        />

        {error ? (
          <Text style={styles.error}>{error}</Text>
        ) : null}

        <ThemedButton
          mode="contained"
          onPress={handleSignup}
          loading={loading}
          style={styles.button}
        >
          Sign Up
        </ThemedButton>

        <Link href="/login" asChild>
          <ThemedButton mode="text">
            Already have an account? Sign in
          </ThemedButton>
        </Link>
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
    padding: 24,
  },
  title: {
    marginBottom: 24,
    textAlign: 'center',
  },
  error: {
    color: 'red',
    marginBottom: 16,
    textAlign: 'center',
  },
  button: {
    marginTop: 8,
    marginBottom: 16,
  },
}); 