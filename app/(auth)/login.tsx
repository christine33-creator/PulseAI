import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { Link, router } from 'expo-router';
import { supabase } from '../../src/services/supabase';
import { ThemedSurface } from '../../src/components/themed/ThemedSurface';
import { ThemedButton } from '../../src/components/themed/ThemedButton';
import { ThemedInput } from '../../src/components/themed/ThemedInput';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    try {
      setLoading(true);
      setError('');
      
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
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
        <Text variant="headlineMedium" style={styles.title}>Welcome Back</Text>

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

        {error ? (
          <Text style={styles.error}>{error}</Text>
        ) : null}

        <ThemedButton
          mode="contained"
          onPress={handleLogin}
          loading={loading}
          style={styles.button}
        >
          Sign In
        </ThemedButton>

        <Link href="/signup" asChild>
          <ThemedButton mode="text">
            Don't have an account? Sign up
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