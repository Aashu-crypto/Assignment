import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import React, { useRef, useState } from 'react';
import {
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { initialMessages, stylists } from '../data';
import { MainTabParamList, Message } from '../types';
import { colors, Screen } from '../ui';

type Props = BottomTabScreenProps<MainTabParamList, 'Chat'>;

export function ChatScreen({ navigation }: Props) {
  const stylist = stylists[0];
  const [messages, setMessages] = useState(initialMessages);
  const [draft, setDraft] = useState('');
  const listRef = useRef<FlatList<Message>>(null);

  function send() {
    const text = draft.trim();
    if (!text) return;
    setMessages((current) => [
      ...current,
      {
        id: `${Date.now()}`,
        text,
        sender: 'me',
        sentAt: 'Now',
      },
    ]);
    setDraft('');
    requestAnimationFrame(() => listRef.current?.scrollToEnd({ animated: true }));
  }

  return (
    <Screen>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}
      >
        <View style={styles.header}>
          <Pressable
            accessibilityLabel="Back to wardrobe"
            accessibilityRole="button"
            onPress={() => navigation.navigate('Wardrobe')}
            style={styles.back}
          >
            <Text style={styles.backText}>‹</Text>
          </Pressable>
          <Image source={{ uri: stylist.image }} style={styles.avatar} />
          <View style={styles.headerBody}>
            <Text style={styles.name}>{stylist.name}</Text>
            <View style={styles.onlineRow}>
              <View style={styles.onlineDot} />
              <Text style={styles.online}>Online · usually replies quickly</Text>
            </View>
          </View>
          <Pressable style={styles.more}>
            <Text style={styles.moreText}>•••</Text>
          </Pressable>
        </View>

        <FlatList
          ref={listRef}
          contentContainerStyle={styles.messages}
          data={messages}
          keyExtractor={(item) => item.id}
          keyboardShouldPersistTaps="handled"
          onContentSizeChange={() =>
            listRef.current?.scrollToEnd({ animated: true })
          }
          renderItem={({ item, index }) => {
            const isMe = item.sender === 'me';
            const previous = messages[index - 1];
            const grouped = previous?.sender === item.sender;
            return (
              <View
                style={[
                  styles.messageRow,
                  isMe && styles.messageRowMe,
                  grouped && styles.messageGrouped,
                ]}
              >
                {!isMe && !grouped ? (
                  <Image source={{ uri: stylist.image }} style={styles.messageAvatar} />
                ) : !isMe ? (
                  <View style={styles.messageAvatarSpace} />
                ) : null}
                <View style={styles.bubbleWrap}>
                  <View
                    style={[
                      styles.bubble,
                      isMe ? styles.bubbleMe : styles.bubbleStylist,
                    ]}
                  >
                    <Text style={[styles.messageText, isMe && styles.messageTextMe]}>
                      {item.text}
                    </Text>
                  </View>
                  <Text style={[styles.time, isMe && styles.timeMe]}>
                    {item.sentAt}
                  </Text>
                </View>
              </View>
            );
          }}
          showsVerticalScrollIndicator={false}
        />

        <View style={styles.composer}>
          <Pressable style={styles.attach}>
            <Text style={styles.attachText}>＋</Text>
          </Pressable>
          <TextInput
            accessibilityLabel="Message Maya"
            multiline
            onChangeText={setDraft}
            onSubmitEditing={send}
            placeholder="Message Maya…"
            placeholderTextColor="#8A8F89"
            style={styles.input}
            value={draft}
          />
          <Pressable
            accessibilityLabel="Send message"
            accessibilityRole="button"
            disabled={!draft.trim()}
            onPress={send}
            style={[styles.send, !draft.trim() && styles.sendDisabled]}
          >
            <Text style={styles.sendText}>↑</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  header: {
    paddingHorizontal: 18,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
    backgroundColor: colors.canvas,
  },
  back: {
    width: 38,
    height: 38,
    borderRadius: 14,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.line,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  backText: {
    color: colors.ink,
    fontSize: 29,
    lineHeight: 31,
    marginTop: -3,
  },
  avatar: { width: 48, height: 48, borderRadius: 17 },
  headerBody: { flex: 1, marginLeft: 11 },
  name: { color: colors.ink, fontSize: 17, fontWeight: '900' },
  onlineRow: { flexDirection: 'row', alignItems: 'center', marginTop: 3 },
  onlineDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: '#69A83F', marginRight: 5 },
  online: { color: colors.muted, fontSize: 11 },
  more: { padding: 10 },
  moreText: { color: colors.muted, fontWeight: '900', letterSpacing: 2 },
  messages: { paddingHorizontal: 16, paddingTop: 25, paddingBottom: 20 },
  messageRow: { flexDirection: 'row', alignItems: 'flex-end', marginTop: 15 },
  messageRowMe: { justifyContent: 'flex-end' },
  messageGrouped: { marginTop: 5 },
  messageAvatar: { width: 28, height: 28, borderRadius: 10, marginRight: 8, marginBottom: 18 },
  messageAvatarSpace: { width: 36 },
  bubbleWrap: { maxWidth: '78%' },
  bubble: { borderRadius: 20, paddingHorizontal: 15, paddingVertical: 12 },
  bubbleStylist: { backgroundColor: colors.card, borderBottomLeftRadius: 6 },
  bubbleMe: { backgroundColor: colors.ink, borderBottomRightRadius: 6 },
  messageText: { color: colors.ink, fontSize: 15, lineHeight: 21 },
  messageTextMe: { color: '#FFFFFF' },
  time: { color: colors.muted, fontSize: 10, marginTop: 5, marginLeft: 4 },
  timeMe: { textAlign: 'right', marginRight: 4 },
  composer: {
    paddingHorizontal: 14,
    paddingTop: 10,
    paddingBottom: Platform.OS === 'ios' ? 7 : 13,
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
    borderTopColor: colors.line,
    borderTopWidth: 1,
    backgroundColor: colors.canvas,
  },
  attach: {
    width: 43,
    height: 43,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  attachText: { color: colors.ink, fontSize: 23 },
  input: {
    flex: 1,
    minHeight: 43,
    maxHeight: 100,
    borderRadius: 17,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.line,
    paddingHorizontal: 14,
    paddingTop: 11,
    paddingBottom: 10,
    color: colors.ink,
    fontSize: 15,
  },
  send: {
    width: 43,
    height: 43,
    borderRadius: 15,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendDisabled: { opacity: 0.35 },
  sendText: { color: colors.ink, fontSize: 23, fontWeight: '900', marginTop: -2 },
});
