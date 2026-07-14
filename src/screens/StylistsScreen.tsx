import React, { useState } from 'react';
import {
  FlatList,
  Image,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { useApp } from '../context/AppContext';
import { stylists } from '../data';
import { Stylist } from '../types';
import { Button, colors, Header, Screen } from '../ui';

export function StylistsScreen() {
  const { bookedSlots, bookSlot } = useApp();
  const [selected, setSelected] = useState<Stylist | null>(null);
  const [chosenSlot, setChosenSlot] = useState<string | null>(null);
  const [confirmation, setConfirmation] = useState('');

  function confirmBooking() {
    if (!selected || !chosenSlot) return;
    bookSlot(selected.id, chosenSlot);
    setConfirmation(`${chosenSlot} with ${selected.name}`);
    setChosenSlot(null);
    setSelected(null);
  }

  return (
    <Screen>
      <Header
        eyebrow="One-on-one advice"
        title="Find your stylist"
      />
      <Text style={styles.intro}>
        Book a focused 30-minute session with a stylist who gets your taste.
      </Text>

      {confirmation ? (
        <View style={styles.confirmation}>
          <Text style={styles.confirmationIcon}>✓</Text>
          <View style={styles.confirmationBody}>
            <Text style={styles.confirmationTitle}>You’re booked</Text>
            <Text style={styles.confirmationText}>{confirmation}</Text>
          </View>
          <Pressable onPress={() => setConfirmation('')}>
            <Text style={styles.dismiss}>×</Text>
          </Pressable>
        </View>
      ) : null}

      <FlatList
        contentContainerStyle={styles.list}
        data={stylists}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const available = item.slots.filter(
            (slot) => !bookedSlots.includes(`${item.id}:${slot}`),
          );
          return (
            <Pressable
              onPress={() => {
                setSelected(item);
                setChosenSlot(null);
              }}
              style={({ pressed }) => [
                styles.card,
                pressed && styles.cardPressed,
              ]}
            >
              <Image source={{ uri: item.image }} style={styles.avatar} />
              <View style={styles.cardBody}>
                <View style={styles.nameRow}>
                  <Text style={styles.name}>{item.name}</Text>
                  <Text style={styles.rating}>★ {item.rating.toFixed(1)}</Text>
                </View>
                <Text style={styles.specialty}>{item.specialty}</Text>
                <View style={styles.priceRow}>
                  <Text style={styles.price}>${item.price}</Text>
                  <Text style={styles.session}> / session</Text>
                  <Text style={styles.availability}>
                    {available.length} slots
                  </Text>
                </View>
              </View>
              <Text style={styles.chevron}>›</Text>
            </Pressable>
          );
        }}
        showsVerticalScrollIndicator={false}
      />

      <Modal
        animationType="slide"
        onRequestClose={() => setSelected(null)}
        transparent
        visible={Boolean(selected)}
      >
        <Pressable style={styles.scrim} onPress={() => setSelected(null)}>
          <Pressable style={styles.sheet}>
            {selected ? (
              <>
                <View style={styles.handle} />
                <View style={styles.sheetProfile}>
                  <Image source={{ uri: selected.image }} style={styles.sheetAvatar} />
                  <View>
                    <Text style={styles.sheetName}>{selected.name}</Text>
                    <Text style={styles.sheetSpecialty}>{selected.specialty}</Text>
                  </View>
                </View>
                <Text style={styles.slotLabel}>CHOOSE AN AVAILABLE TIME</Text>
                <View style={styles.slots}>
                  {selected.slots.map((slot) => {
                    const booked = bookedSlots.includes(`${selected.id}:${slot}`);
                    return (
                      <Pressable
                        disabled={booked}
                        key={slot}
                        onPress={() => setChosenSlot(slot)}
                        style={[
                          styles.slot,
                          chosenSlot === slot && styles.slotSelected,
                          booked && styles.slotBooked,
                        ]}
                      >
                        <Text
                          style={[
                            styles.slotText,
                            chosenSlot === slot && styles.slotTextSelected,
                          ]}
                        >
                          {booked ? 'Booked' : slot}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
                <View style={styles.summary}>
                  <Text style={styles.summaryLabel}>30-minute video session</Text>
                  <Text style={styles.summaryPrice}>${selected.price}</Text>
                </View>
                <Button
                  disabled={!chosenSlot}
                  label={chosenSlot ? `Book ${chosenSlot}` : 'Select a time'}
                  onPress={confirmBooking}
                />
              </>
            ) : null}
          </Pressable>
        </Pressable>
      </Modal>
    </Screen>
  );
}

const styles = StyleSheet.create({
  intro: {
    color: colors.muted,
    paddingHorizontal: 20,
    fontSize: 15,
    lineHeight: 22,
    marginTop: -7,
    marginBottom: 15,
    maxWidth: 370,
  },
  confirmation: {
    marginHorizontal: 20,
    marginBottom: 12,
    padding: 13,
    borderRadius: 16,
    backgroundColor: '#E8F4D4',
    flexDirection: 'row',
    alignItems: 'center',
  },
  confirmationIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.accent,
    color: colors.ink,
    lineHeight: 32,
    textAlign: 'center',
    fontWeight: '900',
  },
  confirmationBody: { flex: 1, marginLeft: 10 },
  confirmationTitle: { fontWeight: '900', color: colors.ink },
  confirmationText: { color: colors.muted, fontSize: 12, marginTop: 2 },
  dismiss: { color: colors.muted, fontSize: 24, padding: 5 },
  list: { paddingHorizontal: 20, paddingBottom: 110 },
  card: {
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.line,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 11,
  },
  cardPressed: { opacity: 0.78, transform: [{ scale: 0.99 }] },
  avatar: { width: 82, height: 96, borderRadius: 16, backgroundColor: colors.line },
  cardBody: { flex: 1, paddingLeft: 13 },
  nameRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  name: { color: colors.ink, fontSize: 17, fontWeight: '900' },
  rating: { color: '#746327', fontSize: 11, fontWeight: '700' },
  specialty: { color: colors.muted, fontSize: 13, marginTop: 4 },
  priceRow: { flexDirection: 'row', alignItems: 'baseline', marginTop: 16 },
  price: { color: colors.ink, fontSize: 16, fontWeight: '900' },
  session: { color: colors.muted, fontSize: 11 },
  availability: {
    color: colors.accentDark,
    backgroundColor: '#EBF7D7',
    fontSize: 10,
    fontWeight: '800',
    paddingHorizontal: 7,
    paddingVertical: 4,
    borderRadius: 10,
    marginLeft: 'auto',
  },
  chevron: { color: colors.muted, fontSize: 28, paddingLeft: 8 },
  scrim: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(10,12,10,.5)' },
  sheet: {
    backgroundColor: colors.canvas,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 20,
    paddingBottom: 34,
  },
  handle: {
    width: 42,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#CAC8C1',
    alignSelf: 'center',
    marginBottom: 20,
  },
  sheetProfile: { flexDirection: 'row', alignItems: 'center', marginBottom: 25 },
  sheetAvatar: { width: 68, height: 68, borderRadius: 22, marginRight: 13 },
  sheetName: { color: colors.ink, fontSize: 22, fontWeight: '900' },
  sheetSpecialty: { color: colors.muted, marginTop: 3 },
  slotLabel: { color: colors.muted, fontWeight: '900', letterSpacing: 1.2, fontSize: 11 },
  slots: { gap: 9, marginTop: 11, marginBottom: 20 },
  slot: {
    minHeight: 49,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.card,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  slotSelected: { backgroundColor: colors.ink, borderColor: colors.ink },
  slotBooked: { opacity: 0.35 },
  slotText: { color: colors.ink, fontWeight: '700' },
  slotTextSelected: { color: colors.accent },
  summary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: colors.line,
  },
  summaryLabel: { color: colors.muted },
  summaryPrice: { color: colors.ink, fontWeight: '900', fontSize: 18 },
});
