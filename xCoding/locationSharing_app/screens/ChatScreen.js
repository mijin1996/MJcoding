import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Linking,
  Modal,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  writeBatch,
} from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { db, storage } from '../firebase';

export default function ChatScreen({ user, myCode, friend, hiddenBefore = 0, onClose }) {
  const [message, setMessage] = useState('');
  const [isUploadingAttachment, setIsUploadingAttachment] = useState(false);
  const [isAttachmentMenuVisible, setIsAttachmentMenuVisible] = useState(false);
  const [messages, setMessages] = useState([]);
  const [chatStatus, setChatStatus] = useState('메시지를 불러오는 중...');
  const [isFriendTyping, setIsFriendTyping] = useState(false);
  const [showNewContent, setShowNewContent] = useState(false);
  const messageListRef = useRef(null);
  const isNearBottomRef = useRef(true);
  const latestMessageIdRef = useRef(null);
  const typingTimerRef = useRef(null);
  const typingAnimationRef = useRef(null);
  const typingDots = useRef([
    new Animated.Value(0.25),
    new Animated.Value(0.25),
    new Animated.Value(0.25),
  ]).current;

  const chatRoomId = useMemo(() => [myCode, friend.code].sort().join('_'), [myCode, friend.code]);

  const myTypingRef = useMemo(
    () => doc(db, 'chats', chatRoomId, 'typing', myCode),
    [chatRoomId, myCode],
  );

  useEffect(() => {
    const friendTypingRef = doc(db, 'chats', chatRoomId, 'typing', friend.code);

    const unsubscribe = onSnapshot(friendTypingRef, (snapshot) => {
      setIsFriendTyping(snapshot.exists() && snapshot.data().isTyping === true);
    });

    return () => unsubscribe();
  }, [chatRoomId, friend.code]);

  useEffect(
    () => () => {
      if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
      setDoc(myTypingRef, { isTyping: false }, { merge: true }).catch(() => {});
    },
    [myTypingRef],
  );

  useEffect(() => {
    if (!isFriendTyping) {
      typingAnimationRef.current?.stop();
      typingDots.forEach((dot) => dot.setValue(0.25));
      return undefined;
    }

    typingAnimationRef.current = Animated.loop(
      Animated.stagger(
        160,
        typingDots.map((dot) =>
          Animated.sequence([
            Animated.timing(dot, {
              toValue: 1,
              duration: 280,
              useNativeDriver: true,
            }),
            Animated.timing(dot, {
              toValue: 0.25,
              duration: 280,
              useNativeDriver: true,
            }),
          ]),
        ),
      ),
    );
    typingAnimationRef.current.start();

    return () => typingAnimationRef.current?.stop();
  }, [isFriendTyping, typingDots]);

  useEffect(() => {
    const messagesRef = collection(db, 'chats', chatRoomId, 'messages');
    const messagesQuery = query(messagesRef, orderBy('createdAt', 'asc'));

    return onSnapshot(
      messagesQuery,
      (snapshot) => {
        const visibleMessageDocs = snapshot.docs.filter((messageDoc) => {
          if (messageDoc.metadata.hasPendingWrites) return true;
          const createdAt = messageDoc.data().createdAt?.toMillis?.() || 0;
          return createdAt > hiddenBefore;
        });
        const latestMessageDoc = visibleMessageDocs[visibleMessageDocs.length - 1];
        const previousLatestMessageId = latestMessageIdRef.current;

        if (
          previousLatestMessageId &&
          latestMessageDoc &&
          latestMessageDoc.id !== previousLatestMessageId &&
          latestMessageDoc.data().senderCode !== myCode &&
          !isNearBottomRef.current
        ) {
          setShowNewContent(true);
        }

        latestMessageIdRef.current = latestMessageDoc?.id || null;

        const receivedMessages = visibleMessageDocs.map((messageDoc) => ({
          id: messageDoc.id,
          ...messageDoc.data(),
        }));

        setMessages(receivedMessages);
        setChatStatus('');

        const unreadMessages = visibleMessageDocs.filter((messageDoc) => {
          const messageData = messageDoc.data();
          return messageData.senderCode !== myCode && !messageData.readByCodes?.includes(myCode);
        });

        if (unreadMessages.length > 0) {
          const readBatch = writeBatch(db);
          unreadMessages.forEach((messageDoc) => {
            readBatch.update(messageDoc.ref, {
              readByCodes: arrayUnion(myCode),
            });
          });
          readBatch.commit().catch(() => {
            setChatStatus('메시지 읽음 처리 권한을 확인해주세요.');
          });
        }
      },
      () => setChatStatus('채팅 읽기 권한을 확인해주세요.'),
    );
  }, [chatRoomId, hiddenBefore]);

  async function sendMessage() {
    const trimmedMessage = message.trim();

    if (!trimmedMessage) return;

    setMessage('');
    if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
    setDoc(myTypingRef, { isTyping: false }, { merge: true }).catch(() => {});

    try {
      await addDoc(collection(db, 'chats', chatRoomId, 'messages'), {
        type: 'text',
        text: trimmedMessage,
        senderUid: user.uid,
        senderCode: myCode,
        readByCodes: [myCode],
        createdAt: serverTimestamp(),
      });
    } catch (error) {
      setMessage(trimmedMessage);
      setChatStatus('메시지 전송 권한을 확인해주세요.');
    }
  }

  async function uploadAndSendAttachment(asset, attachmentType) {
    if (!asset?.uri || isUploadingAttachment) return;

    setIsUploadingAttachment(true);
    try {
      const response = await fetch(asset.uri);
      const blob = await response.blob();
      const originalName = asset.name || asset.fileName || `${attachmentType}-${Date.now()}`;
      const safeName = originalName.replace(/[^a-zA-Z0-9._-]/g, '_');
      const attachmentRef = ref(
        storage,
        `chat-attachments/${chatRoomId}/${user.uid}_${Date.now()}_${safeName}`,
      );
      await uploadBytes(attachmentRef, blob, {
        contentType: asset.mimeType || (attachmentType === 'image' ? 'image/jpeg' : undefined),
      });
      const downloadUrl = await getDownloadURL(attachmentRef);

      await addDoc(collection(db, 'chats', chatRoomId, 'messages'), {
        type: attachmentType,
        text: '',
        imageUrl: attachmentType === 'image' ? downloadUrl : '',
        fileUrl: attachmentType === 'file' ? downloadUrl : '',
        fileName: originalName,
        fileSize: asset.size || asset.fileSize || 0,
        mimeType: asset.mimeType || '',
        senderUid: user.uid,
        senderCode: myCode,
        readByCodes: [myCode],
        createdAt: serverTimestamp(),
      });
    } catch (error) {
      Alert.alert(
        '첨부 실패',
        '파일을 업로드하지 못했습니다. Firebase Storage 연결을 확인해주세요.',
      );
    } finally {
      setIsUploadingAttachment(false);
    }
  }

  async function takeChatPhoto() {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('카메라 권한 필요', '사진을 촬영하려면 카메라 접근을 허용해주세요.');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images'],
      allowsEditing: false,
      quality: 0.85,
    });
    if (!result.canceled && result.assets?.[0]) {
      await uploadAndSendAttachment(result.assets[0], 'image');
    }
  }

  async function pickChatPhoto() {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('사진 권한 필요', '사진을 공유하려면 사진 접근을 허용해주세요.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: false,
      quality: 0.85,
    });
    if (!result.canceled && result.assets?.[0]) {
      await uploadAndSendAttachment(result.assets[0], 'image');
    }
  }

  async function pickChatFile() {
    const result = await DocumentPicker.getDocumentAsync({
      copyToCacheDirectory: true,
      multiple: false,
    });
    if (!result.canceled && result.assets?.[0]) {
      await uploadAndSendAttachment(result.assets[0], 'file');
    }
  }

  function openAttachmentMenu() {
    if (isUploadingAttachment) return;
    setIsAttachmentMenuVisible(true);
  }

  function handleMessageChange(text) {
    setMessage(text);

    if (typingTimerRef.current) clearTimeout(typingTimerRef.current);

    const isTyping = text.trim().length > 0;
    setDoc(
      myTypingRef,
      {
        isTyping,
        updatedAt: serverTimestamp(),
      },
      { merge: true },
    ).catch(() => {});

    if (isTyping) {
      typingTimerRef.current = setTimeout(() => {
        setDoc(myTypingRef, { isTyping: false }, { merge: true }).catch(() => {});
      }, 1500);
    }
  }

  function handleMessageListScroll(event) {
    const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
    const distanceFromBottom = contentSize.height - layoutMeasurement.height - contentOffset.y;
    const isNearBottom = distanceFromBottom < 80;

    isNearBottomRef.current = isNearBottom;
    if (isNearBottom) setShowNewContent(false);
  }

  function moveToLatestMessage() {
    messageListRef.current?.scrollToEnd({ animated: true });
    isNearBottomRef.current = true;
    setShowNewContent(false);
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.closeText}>닫기</Text>
          </TouchableOpacity>
          <Text style={styles.title}>{friend.name || '친구'}</Text>
          <View style={styles.headerSpacer} />
        </View>

        {chatStatus ? <Text style={styles.status}>{chatStatus}</Text> : null}

        <FlatList
          ref={messageListRef}
          style={styles.messageList}
          contentContainerStyle={styles.messageListContent}
          data={messages}
          keyExtractor={(item) => item.id}
          keyboardShouldPersistTaps="handled"
          onScroll={handleMessageListScroll}
          scrollEventThrottle={16}
          onContentSizeChange={() => {
            if (isNearBottomRef.current) {
              messageListRef.current?.scrollToEnd({ animated: false });
            }
          }}
          renderItem={({ item }) => {
            const isMine = item.senderUid === user.uid;
            const isUnread = isMine && !item.readByCodes?.includes(friend.code);

            return (
              <View
                style={[styles.messageRow, isMine ? styles.myMessageRow : styles.friendMessageRow]}
              >
                {isUnread ? <Text style={styles.unreadCount}>1</Text> : null}
                <View
                  style={[styles.messageBubble, isMine ? styles.myMessage : styles.friendMessage]}
                >
                  {item.imageUrl ? (
                    <TouchableOpacity onPress={() => Linking.openURL(item.imageUrl)}>
                      <Image source={{ uri: item.imageUrl }} style={styles.attachmentImage} />
                    </TouchableOpacity>
                  ) : item.fileUrl ? (
                    <TouchableOpacity
                      style={styles.fileAttachment}
                      onPress={() =>
                        Linking.openURL(item.fileUrl).catch(() =>
                          Alert.alert('파일 열기 실패', '이 파일을 열 수 있는 앱을 확인해주세요.'),
                        )
                      }
                    >
                      <Text style={styles.fileAttachmentIcon}>📎</Text>
                      <Text style={styles.fileAttachmentName} numberOfLines={2}>
                        {item.fileName || '첨부 파일'}
                      </Text>
                    </TouchableOpacity>
                  ) : (
                    <Text style={styles.messageText}>{item.text}</Text>
                  )}
                </View>
              </View>
            );
          }}
        />

        {showNewContent ? (
          <TouchableOpacity
            style={styles.newContentButton}
            activeOpacity={0.8}
            onPress={moveToLatestMessage}
          >
            <Text style={styles.newContentButtonText}>새 내용 ↓</Text>
          </TouchableOpacity>
        ) : null}

        <View style={styles.typingContainer}>
          {isFriendTyping ? (
            <View style={styles.typingRow}>
              <Text style={styles.typingText}>{friend.name || '친구'}님이 입력 중</Text>
              {typingDots.map((dot, index) => (
                <Animated.Text
                  key={`typing-dot-${index}`}
                  style={[styles.typingDot, { opacity: dot }]}
                >
                  ●
                </Animated.Text>
              ))}
            </View>
          ) : null}
        </View>

        <Modal
          visible={isAttachmentMenuVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setIsAttachmentMenuVisible(false)}
        >
          <View style={styles.attachmentMenuBackdrop}>
            <View style={styles.attachmentMenuCard}>
              <Text style={styles.attachmentMenuTitle}>첨부하기</Text>
              <TouchableOpacity
                style={styles.attachmentMenuItem}
                onPress={() => {
                  setIsAttachmentMenuVisible(false);
                  takeChatPhoto();
                }}
              >
                <Text style={styles.attachmentMenuIcon}>📷</Text>
                <Text style={styles.attachmentMenuText}>카메라 촬영</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.attachmentMenuItem}
                onPress={() => {
                  setIsAttachmentMenuVisible(false);
                  pickChatPhoto();
                }}
              >
                <Text style={styles.attachmentMenuIcon}>🖼️</Text>
                <Text style={styles.attachmentMenuText}>앨범에서 선택</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.attachmentMenuItem}
                onPress={() => {
                  setIsAttachmentMenuVisible(false);
                  pickChatFile();
                }}
              >
                <Text style={styles.attachmentMenuIcon}>📎</Text>
                <Text style={styles.attachmentMenuText}>파일 선택</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.attachmentMenuCancel}
                onPress={() => setIsAttachmentMenuVisible(false)}
              >
                <Text style={styles.attachmentMenuCancelText}>취소</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <View style={styles.inputRow}>
          <TouchableOpacity
            style={styles.attachmentButton}
            onPress={openAttachmentMenu}
            disabled={isUploadingAttachment}
          >
            <Text style={styles.attachmentButtonText}>{isUploadingAttachment ? '…' : '+'}</Text>
          </TouchableOpacity>
          <TextInput
            style={styles.input}
            value={message}
            onChangeText={handleMessageChange}
            placeholder="메시지 입력"
            multiline
          />
          <TouchableOpacity
            style={styles.sendButton}
            onPress={sendMessage}
            disabled={isUploadingAttachment}
          >
            <Text style={styles.sendButtonText}>전송</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
  container: { flex: 1, backgroundColor: '#f7f7fb' },
  header: {
    height: 56,
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: '#fff',
  },
  closeText: { color: '#555', fontSize: 15, fontWeight: '700' },
  title: { color: '#222', fontSize: 18, fontWeight: '900' },
  headerSpacer: { width: 30 },
  status: { padding: 10, color: '#777', textAlign: 'center' },
  messageList: { flex: 1 },
  messageListContent: { padding: 16 },
  newContentButton: {
    position: 'absolute',
    alignSelf: 'center',
    bottom: 88,
    zIndex: 10,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 18,
    backgroundColor: '#222',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  newContentButtonText: { color: '#fff', fontSize: 13, fontWeight: '800' },
  messageRow: {
    width: '100%',
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  myMessageRow: { justifyContent: 'flex-end' },
  friendMessageRow: { justifyContent: 'flex-start' },
  unreadCount: {
    marginRight: 5,
    marginBottom: 3,
    color: '#f0a500',
    fontSize: 12,
    fontWeight: '800',
  },
  messageBubble: {
    maxWidth: '78%',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 16,
  },
  myMessage: { alignSelf: 'flex-end', backgroundColor: '#fee2e2' },
  friendMessage: { alignSelf: 'flex-start', backgroundColor: '#dbeafe' },
  messageText: { color: '#222', fontSize: 15, lineHeight: 21 },
  attachmentImage: {
    width: 210,
    height: 210,
    borderRadius: 12,
    resizeMode: 'cover',
    backgroundColor: '#eee',
  },
  fileAttachment: {
    width: 210,
    minHeight: 58,
    flexDirection: 'row',
    alignItems: 'center',
  },
  fileAttachmentIcon: { marginRight: 10, fontSize: 24 },
  fileAttachmentName: { flex: 1, color: '#222', fontSize: 14, fontWeight: '700' },
  typingContainer: {
    height: 24,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  typingRow: { flexDirection: 'row', alignItems: 'center' },
  typingText: { color: '#777', fontSize: 12, fontWeight: '600' },
  typingDot: { marginLeft: 3, color: '#777', fontSize: 7 },
  attachmentMenuBackdrop: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
  },
  attachmentMenuCard: {
    padding: 18,
    borderRadius: 22,
    backgroundColor: '#fff',
  },
  attachmentMenuTitle: {
    marginBottom: 12,
    color: '#222',
    fontSize: 18,
    fontWeight: '900',
  },
  attachmentMenuItem: {
    minHeight: 54,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  attachmentMenuIcon: { width: 38, fontSize: 22 },
  attachmentMenuText: { color: '#222', fontSize: 16, fontWeight: '700' },
  attachmentMenuCancel: {
    marginTop: 14,
    paddingVertical: 13,
    borderRadius: 14,
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
  },
  attachmentMenuCancelText: { color: '#555', fontSize: 15, fontWeight: '800' },
  inputRow: {
    padding: 12,
    flexDirection: 'row',
    alignItems: 'flex-end',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    minHeight: 44,
    maxHeight: 110,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    backgroundColor: '#fff',
  },
  attachmentButton: {
    width: 42,
    height: 42,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  attachmentButtonText: { color: '#444', fontSize: 28, lineHeight: 30, fontWeight: '400' },
  sendButton: {
    marginLeft: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    backgroundColor: '#222',
  },
  sendButtonText: { color: '#fff', fontWeight: '800' },
});
