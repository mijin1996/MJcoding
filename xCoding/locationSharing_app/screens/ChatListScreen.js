import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  FlatList,
  Image,
  PanResponder,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { collection, doc, onSnapshot, orderBy, query } from 'firebase/firestore';
import { db } from '../firebase';

function TypingIndicator() {
  const dots = React.useRef([
    new Animated.Value(0.25),
    new Animated.Value(0.25),
    new Animated.Value(0.25),
  ]).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.stagger(
        160,
        dots.map((dot) =>
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

    animation.start();
    return () => animation.stop();
  }, [dots]);

  return (
    <View style={styles.typingRow}>
      <Text style={styles.typingText}>입력 중</Text>
      {dots.map((dot, index) => (
        <Animated.Text
          key={`list-typing-dot-${index}`}
          style={[styles.typingDot, { opacity: dot }]}
        >
          ●
        </Animated.Text>
      ))}
    </View>
  );
}

function SwipeableChatRow({ children, friendName, onDelete }) {
  const translateX = useRef(new Animated.Value(0)).current;
  const openedDirectionRef = useRef(0);
  const dragStartPositionRef = useRef(0);
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gesture) =>
        Math.abs(gesture.dx) > 8 && Math.abs(gesture.dx) > Math.abs(gesture.dy) * 1.15,
      onMoveShouldSetPanResponderCapture: (_, gesture) =>
        Math.abs(gesture.dx) > 8 && Math.abs(gesture.dx) > Math.abs(gesture.dy) * 1.15,
      onPanResponderGrant: () => {
        translateX.stopAnimation((currentPosition) => {
          dragStartPositionRef.current = currentPosition;
        });
      },
      onPanResponderMove: (_, gesture) => {
        const nextPosition = Math.max(-82, Math.min(82, dragStartPositionRef.current + gesture.dx));
        translateX.setValue(nextPosition);
      },
      onPanResponderRelease: (_, gesture) => {
        const releasedPosition = dragStartPositionRef.current + gesture.dx;
        const direction = Math.abs(releasedPosition) >= 45 ? (releasedPosition > 0 ? 1 : -1) : 0;
        openedDirectionRef.current = direction;
        Animated.spring(translateX, {
          toValue: direction * 76,
          useNativeDriver: true,
        }).start();
      },
      onPanResponderTerminate: () => {
        Animated.spring(translateX, {
          toValue: openedDirectionRef.current * 76,
          useNativeDriver: true,
        }).start();
      },
      onPanResponderTerminationRequest: () => false,
      onShouldBlockNativeResponder: () => true,
    }),
  ).current;

  function confirmDelete() {
    Alert.alert(
      '대화 삭제',
      `${friendName || '상대방'}님과의 대화를 내 목록에서 삭제하시겠습니까?`,
      [
        { text: '취소', style: 'cancel' },
        {
          text: '삭제',
          style: 'destructive',
          onPress: onDelete,
        },
      ],
    );
  }

  return (
    <View style={styles.swipeContainer}>
      <TouchableOpacity
        style={[styles.swipeDeleteButton, styles.swipeDeleteLeft]}
        onPress={confirmDelete}
      >
        <Text style={styles.swipeDeleteText}>삭제</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.swipeDeleteButton, styles.swipeDeleteRight]}
        onPress={confirmDelete}
      >
        <Text style={styles.swipeDeleteText}>삭제</Text>
      </TouchableOpacity>
      <Animated.View
        style={[styles.swipeContent, { transform: [{ translateX }] }]}
        {...panResponder.panHandlers}
      >
        {children}
      </Animated.View>
    </View>
  );
}

export default function ChatListScreen({
  friends,
  myCode,
  hiddenChats = {},
  onClose,
  onSelectFriend,
  onDeleteChat,
}) {
  const [chatRooms, setChatRooms] = useState([]);
  const [typingFriends, setTypingFriends] = useState({});

  useEffect(() => {
    if (!myCode) {
      setChatRooms([]);
      return undefined;
    }

    setChatRooms([]);

    const unsubscribeList = friends.flatMap((friend) => {
      const chatRoomId = [myCode, friend.code].sort().join('_');
      const hiddenBefore = Number(hiddenChats[friend.code] || 0);
      const latestMessageQuery = query(
        collection(db, 'chats', chatRoomId, 'messages'),
        orderBy('createdAt', 'desc'),
      );

      const unsubscribeMessages = onSnapshot(latestMessageQuery, (snapshot) => {
        setChatRooms((currentRooms) => {
          const otherRooms = currentRooms.filter((room) => room.friendCode !== friend.code);
          const visibleMessageDocs = snapshot.docs.filter((messageDoc) => {
            if (messageDoc.metadata.hasPendingWrites) return true;
            const createdAt = messageDoc.data().createdAt?.toMillis?.() || 0;
            return createdAt > hiddenBefore;
          });

          if (visibleMessageDocs.length === 0) return otherRooms;

          const latestMessage = visibleMessageDocs[0].data();
          const unreadCount = visibleMessageDocs.filter((messageDoc) => {
            const messageData = messageDoc.data();
            return messageData.senderCode !== myCode && !messageData.readByCodes?.includes(myCode);
          }).length;

          return [
            ...otherRooms,
            {
              id: chatRoomId,
              friendCode: friend.code,
              lastMessage:
                latestMessage.type === 'image' || latestMessage.imageUrl
                  ? '사진'
                  : latestMessage.type === 'file' || latestMessage.fileUrl
                    ? `파일: ${latestMessage.fileName || '첨부 파일'}`
                    : latestMessage.text || '',
              updatedAt: latestMessage.createdAt,
              unreadCount,
            },
          ];
        });
      });

      const friendTypingRef = doc(db, 'chats', chatRoomId, 'typing', friend.code);
      const unsubscribeTyping = onSnapshot(friendTypingRef, (snapshot) => {
        setTypingFriends((current) => ({
          ...current,
          [friend.code]: snapshot.exists() && snapshot.data().isTyping === true,
        }));
      });

      return [unsubscribeMessages, unsubscribeTyping];
    });

    return () => unsubscribeList.forEach((unsubscribe) => unsubscribe());
  }, [friends, myCode, hiddenChats]);

  const chattedFriends = useMemo(
    () =>
      chatRooms
        .map((chatRoom) => {
          const friend = friends.find((item) => item.code === chatRoom.friendCode);

          return friend ? { ...friend, chatRoom } : null;
        })
        .filter(Boolean)
        .sort(
          (a, b) => (b.chatRoom.updatedAt?.seconds || 0) - (a.chatRoom.updatedAt?.seconds || 0),
        ),
    [chatRooms, friends, myCode],
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onClose}>
          <Text style={styles.closeText}>닫기</Text>
        </TouchableOpacity>
        <Text style={styles.title}>채팅</Text>
        <View style={styles.headerSpacer} />
      </View>

      <FlatList
        data={chattedFriends}
        directionalLockEnabled
        keyExtractor={(item) => item.code}
        contentContainerStyle={
          chattedFriends.length === 0 ? styles.emptyContainer : styles.listContent
        }
        ListEmptyComponent={
          <View style={styles.emptyContent}>
            <Image source={require('../asset/emptyChat.png')} style={styles.emptyImage} />
            <Text style={styles.emptyText}>아직 나눈 채팅이 없습니다.</Text>
          </View>
        }
        renderItem={({ item }) => (
          <SwipeableChatRow friendName={item.name} onDelete={() => onDeleteChat(item.code)}>
            <TouchableOpacity
              style={styles.friendRow}
              activeOpacity={0.7}
              onPress={() => onSelectFriend(item)}
            >
              <Image
                source={
                  item.profileImageUrl
                    ? { uri: item.profileImageUrl }
                    : require('../asset/defaultImage.png')
                }
                style={styles.profileImage}
              />
              <View style={styles.friendInfo}>
                <Text style={styles.friendName}>{item.name || '익명가치'}</Text>
                {typingFriends[item.code] ? (
                  <TypingIndicator />
                ) : (
                  <Text style={styles.friendMessage} numberOfLines={1}>
                    {item.chatRoom.lastMessage || '채팅방 열기'}
                  </Text>
                )}
              </View>
              <View style={styles.friendRowRight}>
                {item.chatRoom.unreadCount > 0 ? (
                  <Text style={styles.unreadCountText}>
                    {item.chatRoom.unreadCount > 99 ? '99+' : item.chatRoom.unreadCount}
                  </Text>
                ) : null}
                <Text style={styles.arrow}>›</Text>
              </View>
            </TouchableOpacity>
          </SwipeableChatRow>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
  header: {
    height: 56,
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  closeText: { color: '#555', fontSize: 15, fontWeight: '700' },
  title: { color: '#222', fontSize: 18, fontWeight: '900' },
  headerSpacer: { width: 30 },
  listContent: { paddingVertical: 8 },
  emptyContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  emptyContent: { alignItems: 'center', justifyContent: 'center' },
  emptyImage: { width: 50, height: 50, marginBottom: 18, resizeMode: 'contain' },
  emptyText: { color: '#888', fontSize: 15 },
  swipeContainer: {
    overflow: 'hidden',
    backgroundColor: '#ef4444',
  },
  swipeContent: {
    backgroundColor: '#fff',
  },
  swipeDeleteButton: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 76,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ef4444',
  },
  swipeDeleteLeft: { left: 0 },
  swipeDeleteRight: { right: 0 },
  swipeDeleteText: { color: '#fff', fontSize: 14, fontWeight: '900' },
  friendRow: {
    minHeight: 76,
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  profileImage: { width: 52, height: 52, borderRadius: 26, backgroundColor: '#eee' },
  friendInfo: { flex: 1, marginLeft: 14 },
  friendName: { color: '#222', fontSize: 16, fontWeight: '800' },
  friendMessage: { marginTop: 5, color: '#888', fontSize: 13 },
  typingRow: { marginTop: 5, flexDirection: 'row', alignItems: 'center' },
  typingText: { color: '#777', fontSize: 13, fontWeight: '600' },
  typingDot: { marginLeft: 3, color: '#777', fontSize: 7 },
  friendRowRight: { marginLeft: 10, flexDirection: 'row', alignItems: 'center' },
  unreadCountText: {
    marginRight: 8,
    minWidth: 21,
    height: 21,
    paddingHorizontal: 6,
    paddingTop: 3,
    textAlign: 'center',
    overflow: 'hidden',
    borderRadius: 11,
    backgroundColor: '#ef4444',
    color: '#fff',
    fontSize: 12,
    fontWeight: '900',
  },
  arrow: { color: '#aaa', fontSize: 28 },
});
