import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { useApp } from '../context/AppContext';
import { Button, colors, Screen } from '../ui';

export function LoginScreen() {
  const { signIn } = useApp();
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  async function submit() {
    if (!email.includes('@') || password.length < 4) {
      setError('Enter a valid email and a password with at least 4 characters.');
      return;
    }
    setError('');
    setIsSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 650));
      await signIn(email);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Screen backgroundColor={colors.ink}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.flex}
      >
        <LinearGradient
          colors={['#303B2D', colors.ink]}
          style={styles.hero}
        >
          <View style={styles.mark}>
            <Text style={styles.markText}>D</Text>
          </View>
          <Text style={styles.kicker}>YOUR WARDROBE, REIMAGINED</Text>
          <Text style={styles.heroTitle}>Dress like{'\n'}you mean it.</Text>
          <Text style={styles.heroCopy}>
            Build your digital closet and discover combinations hiding in
            plain sight.
          </Text>
        </LinearGradient>

        <View style={styles.form}>
          <View style={styles.authToggle}>
            <Text
              onPress={() => setIsSignup(false)}
              style={[styles.authToggleText, !isSignup && styles.authToggleActive]}
            >
              Sign in
            </Text>
            <Text
              onPress={() => setIsSignup(true)}
              style={[styles.authToggleText, isSignup && styles.authToggleActive]}
            >
              Create account
            </Text>
          </View>
          <Text style={styles.formTitle}>
            {isSignup ? 'Start your wardrobe' : 'Welcome back'}
          </Text>
          <Text style={styles.formSubtitle}>
            {isSignup
              ? 'Create a local demo account in seconds.'
              : 'Sign in to open your wardrobe.'}
          </Text>

          <Text style={styles.label}>Email</Text>
          <TextInput
            autoCapitalize="none"
            autoComplete="email"
            keyboardType="email-address"
            onChangeText={setEmail}
            placeholder="you@example.com"
            placeholderTextColor="#929792"
            style={styles.input}
            value={email}
          />

          <Text style={styles.label}>Password</Text>
          <TextInput
            onChangeText={setPassword}
            placeholder="At least 4 characters"
            placeholderTextColor="#929792"
            secureTextEntry
            style={styles.input}
            value={password}
          />
          {error ? <Text style={styles.error}>{error}</Text> : null}

          <Button
            label={isSignup ? 'Create my wardrobe' : 'Enter my wardrobe'}
            loading={isSubmitting}
            onPress={submit}
          />
          <Text style={styles.note}>
            Demo authentication · Your session stays on this device
          </Text>
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  hero: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 28,
    justifyContent: 'center',
  },
  mark: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 28,
  },
  markText: { color: colors.ink, fontSize: 22, fontWeight: '900' },
  kicker: {
    color: colors.accent,
    fontWeight: '800',
    fontSize: 11,
    letterSpacing: 1.8,
    marginBottom: 10,
  },
  heroTitle: {
    color: '#FFFFFF',
    fontSize: 46,
    lineHeight: 49,
    fontWeight: '900',
    letterSpacing: -2,
  },
  heroCopy: {
    color: '#C4C9C3',
    fontSize: 16,
    lineHeight: 24,
    marginTop: 14,
    maxWidth: 330,
  },
  form: {
    backgroundColor: colors.canvas,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 24,
    paddingBottom: Platform.OS === 'ios' ? 20 : 28,
  },
  authToggle: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    backgroundColor: '#EAE7DF',
    borderRadius: 12,
    padding: 3,
    marginBottom: 17,
  },
  authToggleText: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: '800',
    paddingHorizontal: 13,
    paddingVertical: 8,
    borderRadius: 9,
  },
  authToggleActive: {
    color: colors.ink,
    backgroundColor: colors.card,
  },
  formTitle: { color: colors.ink, fontSize: 24, fontWeight: '800' },
  formSubtitle: { color: colors.muted, marginTop: 4, marginBottom: 18 },
  label: {
    color: colors.ink,
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 7,
    marginTop: 8,
  },
  input: {
    minHeight: 50,
    borderRadius: 14,
    backgroundColor: colors.card,
    borderColor: colors.line,
    borderWidth: 1,
    paddingHorizontal: 15,
    fontSize: 16,
    color: colors.ink,
    marginBottom: 8,
  },
  error: { color: colors.danger, fontSize: 13, marginVertical: 7 },
  note: {
    textAlign: 'center',
    color: colors.muted,
    fontSize: 12,
    marginTop: 14,
  },
});
