import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { useApp } from '../context/AppContext';
import { RootStackParamList } from '../types';
import { Button, colors, Screen } from '../ui';

type Props = NativeStackScreenProps<RootStackParamList, 'Recommendation'>;
type JobState = 'loading' | 'success' | 'error';

const stages = [
  { at: 0, text: 'Reading the shape and color of your piece' },
  { at: 28, text: 'Searching your wardrobe for strong pairings' },
  { at: 58, text: 'Balancing color, texture, and silhouette' },
  { at: 82, text: 'Finishing your personalized look' },
];

export function RecommendationScreen({ navigation, route }: Props) {
  const { wardrobe } = useApp();
  const selected = wardrobe.find((item) => item.id === route.params.itemId);
  const [state, setState] = useState<JobState>('loading');
  const [progress, setProgress] = useState(4);
  const [attempt, setAttempt] = useState(0);
  const forceFailure = useRef(false);
  const pulse = useRef(new Animated.Value(0.7)).current;

  const recommendations = useMemo(() => {
    if (!selected) return [];
    const otherCategories = wardrobe.filter(
      (item) => item.id !== selected.id && item.category !== selected.category,
    );
    return [...otherCategories].sort(() => 0.5 - Math.random()).slice(0, 3);
  }, [attempt, selected, wardrobe]);

  useEffect(() => {
    setState('loading');
    setProgress(4);

    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          duration: 800,
          toValue: 1,
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          duration: 800,
          toValue: 0.7,
          useNativeDriver: true,
        }),
      ]),
    );
    pulseAnimation.start();

    const progressTimer = setInterval(() => {
      setProgress((current) => Math.min(current + 2 + Math.random() * 4, 94));
    }, 420);
    let completionTimer: ReturnType<typeof setTimeout> | undefined;
    const jobTimer = setTimeout(() => {
      clearInterval(progressTimer);
      setProgress(100);
      completionTimer = setTimeout(() => {
        setState(forceFailure.current || Math.random() < 0.2 ? 'error' : 'success');
        forceFailure.current = false;
      }, 350);
    }, 6500);

    return () => {
      clearInterval(progressTimer);
      clearTimeout(jobTimer);
      if (completionTimer) clearTimeout(completionTimer);
      pulseAnimation.stop();
    };
  }, [attempt, pulse]);

  const status =
    [...stages].reverse().find((stage) => progress >= stage.at)?.text ??
    stages[0].text;

  function retry(shouldFail = false) {
    forceFailure.current = shouldFail;
    setAttempt((current) => current + 1);
  }

  if (!selected) {
    return (
      <Screen>
        <View style={styles.center}>
          <Text style={styles.errorTitle}>That piece is no longer here.</Text>
          <Button label="Back to wardrobe" onPress={navigation.goBack} />
        </View>
      </Screen>
    );
  }

  if (state === 'loading') {
    return (
      <Screen backgroundColor={colors.ink}>
        <View style={styles.loadingHeader}>
          <Pressable onPress={navigation.goBack} style={styles.close}>
            <Text style={styles.closeText}>×</Text>
          </Pressable>
          <Text style={styles.loadingEyebrow}>AI STYLIST AT WORK</Text>
        </View>
        <View style={styles.loadingBody}>
          <Animated.View style={[styles.orbit, { opacity: pulse }]}>
            <Image source={{ uri: selected.image }} style={styles.loadingImage} />
            <View style={styles.sparkle}>
              <Text style={styles.sparkleText}>✦</Text>
            </View>
          </Animated.View>
          <Text style={styles.loadingTitle}>Building your look</Text>
          <Text style={styles.loadingStatus}>{status}…</Text>

          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${progress}%` }]} />
          </View>
          <View style={styles.progressMeta}>
            <Text style={styles.progressText}>{Math.round(progress)}%</Text>
            <Text style={styles.progressTime}>Usually takes 5–10 seconds</Text>
          </View>

          <View style={styles.tip}>
            <Text style={styles.tipIcon}>✦</Text>
            <Text style={styles.tipText}>
              We are only pairing pieces you already own—no shopping required.
            </Text>
          </View>
        </View>
      </Screen>
    );
  }

  if (state === 'error') {
    return (
      <Screen>
        <View style={styles.errorWrap}>
          <View style={styles.errorVisual}>
            <View style={styles.errorBadge}>
              <Text style={styles.errorBadgeText}>↻</Text>
            </View>
            <Image source={{ uri: selected.image }} style={styles.errorImage} />
          </View>
          <Text style={styles.errorEyebrow}>NOT QUITE THE ONE</Text>
          <Text style={styles.errorTitle}>This look needs another take.</Text>
          <Text style={styles.errorCopy}>
            Sometimes the pieces need a second introduction. Nothing changed
            in your wardrobe—let’s shuffle the rack and style it again.
          </Text>
          <View style={styles.errorActions}>
            <Button label="Shuffle & try again" onPress={() => retry()} />
            <Button
              label="Back to wardrobe"
              onPress={navigation.goBack}
              tone="secondary"
            />
          </View>
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      <ScrollView
        contentContainerStyle={styles.resultContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.resultTop}>
          <Pressable onPress={navigation.goBack} style={styles.back}>
            <Text style={styles.backText}>‹</Text>
          </Pressable>
          <Text style={styles.done}>LOOK COMPLETE</Text>
          <View style={styles.backPlaceholder} />
        </View>

        <LinearGradient colors={['#394737', '#151915']} style={styles.hero}>
          <Image source={{ uri: selected.image }} style={styles.heroImage} />
          <View style={styles.heroOverlay}>
            <Text style={styles.heroKicker}>A LOOK BUILT AROUND</Text>
            <Text style={styles.heroName}>{selected.name}</Text>
          </View>
        </LinearGradient>

        <View style={styles.resultIntro}>
          <Text style={styles.resultTitle}>Quiet confidence.</Text>
          <Text style={styles.resultCopy}>
            Keep the base grounded and let {selected.name.toLowerCase()} carry
            the look. The mix of tones feels considered without trying too hard.
          </Text>
        </View>

        <Text style={styles.sectionLabel}>COMPLETE THE LOOK</Text>
        {recommendations.map((item, index) => (
          <View key={item.id} style={styles.recommendation}>
            <Image source={{ uri: item.image }} style={styles.recommendationImage} />
            <View style={styles.recommendationBody}>
              <Text style={styles.recommendationNumber}>0{index + 1}</Text>
              <Text style={styles.recommendationName}>{item.name}</Text>
              <Text style={styles.recommendationCategory}>{item.category}</Text>
            </View>
            <Text style={styles.check}>✓</Text>
          </View>
        ))}

        <Button label="Done" onPress={navigation.goBack} />
        <Pressable onPress={() => retry(true)} style={styles.demoError}>
          <Text style={styles.demoErrorText}>Preview failure state</Text>
        </Pressable>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', padding: 24, gap: 20 },
  loadingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  close: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderColor: '#4B514C',
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeText: { color: '#FFFFFF', fontSize: 27, lineHeight: 29 },
  loadingEyebrow: {
    color: colors.accent,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.5,
    marginLeft: 16,
  },
  loadingBody: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
  },
  orbit: {
    width: 210,
    height: 250,
    borderRadius: 105,
    borderWidth: 1,
    borderColor: '#596357',
    padding: 16,
    marginBottom: 30,
  },
  loadingImage: { width: '100%', height: '100%', borderRadius: 88 },
  sparkle: {
    position: 'absolute',
    right: -4,
    top: 25,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sparkleText: { color: colors.ink, fontSize: 22 },
  loadingTitle: {
    color: '#FFFFFF',
    fontSize: 30,
    fontWeight: '900',
    letterSpacing: -1,
  },
  loadingStatus: {
    color: '#AEB5AD',
    fontSize: 15,
    textAlign: 'center',
    minHeight: 44,
    lineHeight: 21,
    marginTop: 8,
  },
  progressTrack: {
    width: '100%',
    height: 7,
    borderRadius: 4,
    backgroundColor: '#343A35',
    overflow: 'hidden',
    marginTop: 16,
  },
  progressFill: { height: '100%', borderRadius: 4, backgroundColor: colors.accent },
  progressMeta: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  progressText: { color: '#FFFFFF', fontWeight: '800', fontSize: 12 },
  progressTime: { color: '#858C85', fontSize: 12 },
  tip: {
    marginTop: 34,
    borderWidth: 1,
    borderColor: '#373E38',
    borderRadius: 16,
    padding: 15,
    flexDirection: 'row',
    gap: 11,
  },
  tipIcon: { color: colors.accent, fontSize: 17 },
  tipText: { color: '#AEB5AD', lineHeight: 19, fontSize: 13, flex: 1 },
  errorWrap: { flex: 1, justifyContent: 'center', paddingHorizontal: 24 },
  errorVisual: { alignSelf: 'center', marginBottom: 30 },
  errorImage: { width: 180, height: 220, borderRadius: 90, opacity: 0.55 },
  errorBadge: {
    position: 'absolute',
    right: -10,
    top: 8,
    zIndex: 1,
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.danger,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorBadgeText: { color: '#FFFFFF', fontSize: 25, fontWeight: '900' },
  errorEyebrow: {
    color: colors.danger,
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1.2,
    marginBottom: 9,
  },
  errorTitle: {
    color: colors.ink,
    fontSize: 30,
    lineHeight: 35,
    letterSpacing: -1,
    fontWeight: '900',
  },
  errorCopy: {
    color: colors.muted,
    fontSize: 16,
    lineHeight: 23,
    marginTop: 12,
  },
  errorActions: { gap: 10, marginTop: 25 },
  resultContent: { paddingHorizontal: 20, paddingBottom: 40 },
  resultTop: {
    paddingTop: 14,
    paddingBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  back: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.card,
    borderColor: colors.line,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backText: { fontSize: 33, color: colors.ink, marginTop: -4 },
  backPlaceholder: { width: 42 },
  done: { fontSize: 11, fontWeight: '900', letterSpacing: 1.4, color: colors.muted },
  hero: {
    height: 390,
    borderRadius: 26,
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  heroImage: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
    opacity: 0.72,
  },
  heroOverlay: { padding: 22 },
  heroKicker: {
    color: colors.accent,
    fontWeight: '900',
    fontSize: 10,
    letterSpacing: 1.3,
  },
  heroName: { color: '#FFFFFF', fontWeight: '900', fontSize: 28, marginTop: 4 },
  resultIntro: { paddingVertical: 24 },
  resultTitle: {
    color: colors.ink,
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: -0.8,
  },
  resultCopy: { color: colors.muted, fontSize: 15, lineHeight: 23, marginTop: 8 },
  sectionLabel: {
    color: colors.muted,
    fontWeight: '900',
    letterSpacing: 1.3,
    fontSize: 11,
    marginBottom: 10,
  },
  recommendation: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 18,
    padding: 9,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  recommendationImage: { width: 72, height: 82, borderRadius: 13 },
  recommendationBody: { flex: 1, paddingHorizontal: 13 },
  recommendationNumber: { color: colors.muted, fontSize: 10, fontWeight: '800' },
  recommendationName: { color: colors.ink, fontWeight: '800', fontSize: 15, marginTop: 3 },
  recommendationCategory: { color: colors.muted, fontSize: 12, marginTop: 3 },
  check: {
    color: colors.accentDark,
    backgroundColor: colors.accent,
    width: 28,
    height: 28,
    borderRadius: 14,
    textAlign: 'center',
    lineHeight: 28,
    fontWeight: '900',
    marginRight: 5,
  },
  demoError: { alignItems: 'center', paddingTop: 18, paddingBottom: 6 },
  demoErrorText: { color: colors.muted, fontSize: 12, textDecorationLine: 'underline' },
});
