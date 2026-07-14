import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as ImagePicker from 'expo-image-picker';
import React, { useMemo, useState } from 'react';
import {
  Alert,
  FlatList,
  Image,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { useApp } from '../context/AppContext';
import { Category, RootStackParamList, WardrobeItem } from '../types';
import { Button, colors, Header, Screen } from '../ui';

const filters: Array<'All' | Category> = ['All', 'Tops', 'Bottoms', 'Shoes'];

export function WardrobeScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { wardrobe, addWardrobeItem, signOut } = useApp();
  const [filter, setFilter] = useState<(typeof filters)[number]>('All');
  const [selected, setSelected] = useState<WardrobeItem | null>(null);
  const [pendingImage, setPendingImage] = useState<string | null>(null);

  const visibleItems = useMemo(
    () =>
      filter === 'All'
        ? wardrobe
        : wardrobe.filter((item) => item.category === filter),
    [filter, wardrobe],
  );

  async function chooseImage(source: 'camera' | 'library') {
    const permission =
      source === 'camera'
        ? await ImagePicker.requestCameraPermissionsAsync()
        : await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert(
        'Permission needed',
        `Allow ${source === 'camera' ? 'camera' : 'photo library'} access to add an item.`,
      );
      return;
    }
    const result =
      source === 'camera'
        ? await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [4, 5],
            quality: 0.8,
          })
        : await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [4, 5],
            quality: 0.8,
          });
    if (!result.canceled) {
      setPendingImage(result.assets[0].uri);
    }
  }

  function saveImage(category: Category) {
    if (!pendingImage) return;
    addWardrobeItem(pendingImage, category);
    setPendingImage(null);
    setFilter('All');
  }

  return (
    <Screen>
      <Header
        action={
          <Pressable
            accessibilityLabel="Sign out"
            onPress={() => void signOut()}
            style={styles.profile}
          >
            <Text style={styles.profileText}>AG</Text>
          </Pressable>
        }
        eyebrow={`${wardrobe.length} pieces · your collection`}
        title="Wardrobe"
      />

      <View style={styles.actionRow}>
        <Pressable onPress={() => void chooseImage('camera')} style={styles.add}>
          <Text style={styles.addIcon}>＋</Text>
          <Text style={styles.addText}>Photograph</Text>
        </Pressable>
        <Pressable
          onPress={() => void chooseImage('library')}
          style={styles.upload}
        >
          <Text style={styles.uploadText}>Upload photo</Text>
        </Pressable>
      </View>

      <View style={styles.filters}>
        {filters.map((item) => (
          <Pressable
            key={item}
            onPress={() => setFilter(item)}
            style={[styles.filter, filter === item && styles.filterActive]}
          >
            <Text
              style={[
                styles.filterText,
                filter === item && styles.filterTextActive,
              ]}
            >
              {item}
            </Text>
          </Pressable>
        ))}
      </View>

      <FlatList
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.grid}
        data={visibleItems}
        keyExtractor={(item) => item.id}
        numColumns={2}
        renderItem={({ item }) => (
          <Pressable
            accessibilityLabel={`${item.name}, ${item.category}`}
            onPress={() => setSelected(item)}
            style={({ pressed }) => [
              styles.item,
              pressed && styles.itemPressed,
            ]}
          >
            <Image source={{ uri: item.image }} style={styles.itemImage} />
            <View style={styles.itemMeta}>
              <Text numberOfLines={1} style={styles.itemName}>
                {item.name}
              </Text>
              <Text style={styles.itemCategory}>{item.category}</Text>
            </View>
          </Pressable>
        )}
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
                <Image
                  source={{ uri: selected.image }}
                  style={styles.sheetImage}
                />
                <Text style={styles.sheetCategory}>{selected.category}</Text>
                <Text style={styles.sheetTitle}>{selected.name}</Text>
                <Text style={styles.sheetCopy}>
                  See how this piece works with items already in your wardrobe.
                </Text>
                <Button
                  label="✦ Get a recommendation"
                  onPress={() => {
                    const itemId = selected.id;
                    setSelected(null);
                    navigation.navigate('Recommendation', { itemId });
                  }}
                />
              </>
            ) : null}
          </Pressable>
        </Pressable>
      </Modal>

      <Modal
        animationType="fade"
        onRequestClose={() => setPendingImage(null)}
        transparent
        visible={Boolean(pendingImage)}
      >
        <View style={styles.scrim}>
          <View style={styles.categoryCard}>
            {pendingImage ? (
              <Image source={{ uri: pendingImage }} style={styles.preview} />
            ) : null}
            <Text style={styles.categoryTitle}>What kind of piece is this?</Text>
            <Text style={styles.categoryCopy}>
              Add a category so you can find it later.
            </Text>
            <View style={styles.categoryOptions}>
              {filters.slice(1).map((category) => (
                <Pressable
                  key={category}
                  onPress={() => saveImage(category as Category)}
                  style={styles.categoryOption}
                >
                  <Text style={styles.categoryOptionText}>{category}</Text>
                </Pressable>
              ))}
            </View>
            <Pressable onPress={() => setPendingImage(null)}>
              <Text style={styles.cancel}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </Screen>
  );
}

const styles = StyleSheet.create({
  profile: {
    width: 42,
    height: 42,
    borderRadius: 15,
    backgroundColor: colors.ink,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileText: { color: colors.accent, fontWeight: '900', fontSize: 12 },
  actionRow: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  add: {
    flex: 1,
    minHeight: 48,
    borderRadius: 15,
    backgroundColor: colors.accent,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
  },
  addIcon: { fontSize: 21, color: colors.ink, marginTop: -2 },
  addText: { fontSize: 14, fontWeight: '800', color: colors.ink },
  upload: {
    flex: 1,
    minHeight: 48,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadText: { fontSize: 14, fontWeight: '700', color: colors.ink },
  filters: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 8,
    marginBottom: 14,
  },
  filter: {
    paddingHorizontal: 15,
    paddingVertical: 9,
    borderRadius: 99,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.line,
  },
  filterActive: { backgroundColor: colors.ink, borderColor: colors.ink },
  filterText: { color: colors.muted, fontWeight: '700', fontSize: 13 },
  filterTextActive: { color: '#FFFFFF' },
  grid: { paddingHorizontal: 20, paddingBottom: 110 },
  row: { gap: 12 },
  item: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.line,
  },
  itemPressed: { opacity: 0.8, transform: [{ scale: 0.99 }] },
  itemImage: { width: '100%', aspectRatio: 0.82, backgroundColor: '#E9E5DD' },
  itemMeta: { padding: 12 },
  itemName: { color: colors.ink, fontSize: 14, fontWeight: '800' },
  itemCategory: {
    color: colors.muted,
    fontSize: 11,
    fontWeight: '600',
    marginTop: 3,
  },
  scrim: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(10, 12, 10, 0.55)',
  },
  sheet: {
    backgroundColor: colors.canvas,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 20,
    paddingBottom: 34,
  },
  sheetImage: {
    width: '100%',
    height: 210,
    borderRadius: 20,
    backgroundColor: colors.line,
    marginBottom: 18,
  },
  sheetCategory: {
    color: colors.muted,
    fontSize: 12,
    textTransform: 'uppercase',
    fontWeight: '800',
    letterSpacing: 1,
  },
  sheetTitle: {
    color: colors.ink,
    fontSize: 26,
    fontWeight: '900',
    marginTop: 4,
  },
  sheetCopy: {
    color: colors.muted,
    fontSize: 15,
    lineHeight: 21,
    marginTop: 7,
    marginBottom: 18,
  },
  categoryCard: {
    margin: 20,
    backgroundColor: colors.canvas,
    borderRadius: 25,
    padding: 18,
  },
  preview: {
    height: 230,
    width: '100%',
    borderRadius: 18,
    marginBottom: 16,
  },
  categoryTitle: { color: colors.ink, fontSize: 21, fontWeight: '900' },
  categoryCopy: { color: colors.muted, marginTop: 4, marginBottom: 15 },
  categoryOptions: { flexDirection: 'row', gap: 8 },
  categoryOption: {
    flex: 1,
    borderRadius: 13,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.line,
    paddingVertical: 13,
    alignItems: 'center',
  },
  categoryOptionText: { color: colors.ink, fontWeight: '800' },
  cancel: {
    color: colors.muted,
    textAlign: 'center',
    paddingTop: 17,
    fontWeight: '700',
  },
});
