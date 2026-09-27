// 📦 React와 화면 구성 라이브러리
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  PanResponder,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import MapView, { Marker } from 'react-native-maps';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import {
  createUserWithEmailAndPassword,
  deleteUser,
  onAuthStateChanged,
  reload,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updatePassword,
} from 'firebase/auth';
import {
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  where,
} from 'firebase/firestore';
import { auth, db } from './firebase';
import ChatScreen from './screens/ChatScreen';
import ChatListScreen from './screens/ChatListScreen';
const REMEMBERED_EMAIL_KEY = 'rememberedLoginEmail';
const VERIFICATION_EMAIL_SENT_AT_KEY = 'verificationEmailSentAt';
const VERIFICATION_EMAIL_SEND_COUNT_KEY = 'verificationEmailSendCount';
const VERIFICATION_EMAIL_COOLDOWN_MS = 5 * 60 * 1000;
const BACKGROUND_LOCATION_TASK = 'dowajwo-background-location';
const BACKGROUND_LOCATION_DATA_KEY = 'backgroundLocationData';
const BACKGROUND_LOCATION_LAST_UPLOAD_KEY = 'backgroundLocationLastUpload';
const BACKGROUND_LOCATION_INTERVAL_MS = 10 * 60 * 1000;

// 앱 화면이 백그라운드에 있을 때 전달받은 위치를 최대 10분마다 Firebase에 저장합니다.
if (!TaskManager.isTaskDefined(BACKGROUND_LOCATION_TASK)) {
  TaskManager.defineTask(BACKGROUND_LOCATION_TASK, async ({ data, error }) => {
    if (error || !data?.locations?.length) return;

    try {
      const [savedConfig, lastUploadValue] = await Promise.all([
        AsyncStorage.getItem(BACKGROUND_LOCATION_DATA_KEY),
        AsyncStorage.getItem(BACKGROUND_LOCATION_LAST_UPLOAD_KEY),
      ]);
      const config = savedConfig ? JSON.parse(savedConfig) : null;
      if (!config?.sharing || !config?.myCode) return;

      const now = Date.now();
      const lastUpload = Number(lastUploadValue || 0);
      if (now - lastUpload < BACKGROUND_LOCATION_INTERVAL_MS) return;

      const location = data.locations[data.locations.length - 1];
      await setDoc(
        doc(db, 'locations', config.myCode),
        {
          name: config.name || '익명가치',
          sharing: true,
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          speed:
            typeof location.coords.speed === 'number' && location.coords.speed > 0
              ? Math.round(location.coords.speed * 3.6)
              : 0,
          updatedAt: serverTimestamp(),
        },
        { merge: true },
      );
      await AsyncStorage.setItem(BACKGROUND_LOCATION_LAST_UPLOAD_KEY, String(now));
    } catch (taskError) {
      // 다음 위치 이벤트에서 다시 시도합니다.
    }
  });
}
// =====================================================
// 🔑 6자리 위치공유 코드 생성
// 혼동하기 쉬운 I, O, 0, 1 문자는 사용하지 않습니다.
// =====================================================
// 🎲 새 사용자에게 중복 가능성이 낮은 6자리 위치공유 코드를 만듭니다.
function makeCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let result = '';
  for (let i = 0; i < 6; i += 1) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
}

// 이메일 인증 전 Firebase 계정을 만들 때만 사용하는 임시 비밀번호입니다.
// 인증이 끝나면 사용자가 입력한 실제 비밀번호로 즉시 교체합니다.
function makeTemporaryPassword() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#';
  let result = '';
  for (let i = 0; i < 24; i += 1) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
}
// =====================================================
// 🧩 앱의 상태, 기능, 화면을 구성하는 메인 컴포넌트
// =====================================================
// 🧩 앱에서 사용하는 상태·기능·화면 전체를 관리하는 메인 컴포넌트입니다.
function AppContent() {
  const [showStartupScreen, setShowStartupScreen] = useState(true);

  // ===================================================
  // 🔐 로그인 화면과 로그인 상태
  // ===================================================
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberEmail, setRememberEmail] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [user, setUser] = useState(null);
  const [registrationUser, setRegistrationUser] = useState(null);
  const [verificationSent, setVerificationSent] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [signUpLoading, setSignUpLoading] = useState(false);

  // ===================================================
  // 👤 내 계정에 저장되는 정보
  // myName은 입력 중인 값, savedName은 실제 저장된 이름입니다.
  // ===================================================
  const [myName, setMyName] = useState('');
  const [savedName, setSavedName] = useState('');
  const [isEditingName, setIsEditingName] = useState(true);
  const [myCode, setMyCode] = useState('');
  const [sharing, setSharing] = useState(true);

  // ===================================================
  // 🤝 저장한 친구와 현재 연결된 친구 정보
  // 저장된 친구들의 실시간 위치를 지도와 친구 목록에 표시합니다.
  // ===================================================
  const [friendCode, setFriendCode] = useState('');
  const [savedFriends, setSavedFriends] = useState([]);
  const [savedChatCodes, setSavedChatCodes] = useState([]);
  const [hiddenChats, setHiddenChats] = useState({});
  const [chatContactProfiles, setChatContactProfiles] = useState({});
  const [friendList, setFriendList] = useState([]);
  const [incomingFriendRequests, setIncomingFriendRequests] = useState([]);
  const [isFriendListVisible, setIsFriendListVisible] = useState(false);
  const [friendName, setFriendName] = useState('');
  const [friendLocation, setFriendLocation] = useState(null);
  const [friendSpeed, setFriendSpeed] = useState(0);
  const chatFriends = useMemo(
    () => [
      ...friendList,
      ...savedChatCodes
        .filter((code) => !friendList.some((friend) => friend.code === code))
        .map((code) => ({
          code,
          name: chatContactProfiles[code]?.name || '익명가치',
          profileImageUrl: chatContactProfiles[code]?.profileImageUrl || '',
        })),
    ],
    [friendList, savedChatCodes, chatContactProfiles],
  );

  // 친구목록에서 삭제된 대화 상대도 이름과 프로필 변경을 계속 실시간으로 받습니다.
  useEffect(() => {
    if (!user || savedChatCodes.length === 0) {
      setChatContactProfiles({});
      return undefined;
    }

    const unsubscribes = savedChatCodes.map((code) =>
      onSnapshot(doc(db, 'locations', code), (snapshot) => {
        const data = snapshot.exists() ? snapshot.data() : {};
        setChatContactProfiles((current) => ({
          ...current,
          [code]: {
            name: data.name?.trim() || '익명가치',
            profileImageUrl: data.profileImageUrl || '',
          },
        }));
      }),
    );

    return () => unsubscribes.forEach((unsubscribe) => unsubscribe());
  }, [user, savedChatCodes]);
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowStartupScreen(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);
  useEffect(() => {
    // 📧 기기에 저장된 로그인 이메일을 불러와 로그인 입력칸에 복원합니다.
    async function restoreRememberedEmail() {
      try {
        const savedEmail = await AsyncStorage.getItem(REMEMBERED_EMAIL_KEY);
        if (savedEmail) {
          setEmail(savedEmail);
          setRememberEmail(true);
        }
      } catch (error) {
        // 이메일 복원 실패
      }
    }
    restoreRememberedEmail();
  }, []);
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [selectedFriendAddress, setSelectedFriendAddress] = useState('');
  const [chatFriend, setChatFriend] = useState(null);
  const [isChatListVisible, setIsChatListVisible] = useState(false);
  const [unreadChatByFriend, setUnreadChatByFriend] = useState({});

  // 채팅방을 열어 둔 동안 상대방이 이름을 바꾸면 제목에도 바로 반영합니다.
  useEffect(() => {
    if (!chatFriend?.code) return;
    const latestChatFriend = chatFriends.find((friend) => friend.code === chatFriend.code);
    if (latestChatFriend) {
      setChatFriend(latestChatFriend);
    }
  }, [chatFriends, chatFriend?.code]);

  useEffect(() => {
    if (!myCode) {
      setUnreadChatByFriend({});
      return undefined;
    }

    const unsubscribeList = chatFriends.map((friend) => {
      const chatRoomId = [myCode, friend.code].sort().join('_');
      const latestMessageQuery = query(
        collection(db, 'chats', chatRoomId, 'messages'),
        orderBy('createdAt', 'desc'),
        limit(1),
      );

      return onSnapshot(latestMessageQuery, (snapshot) => {
        const hiddenBefore = Number(hiddenChats[friend.code] || 0);
        const latestVisibleDocument = snapshot.docs.find((messageDocument) => {
          const createdAt = messageDocument.data().createdAt?.toMillis?.() || 0;
          return createdAt > hiddenBefore;
        });
        const latestMessage = latestVisibleDocument?.data();
        const hasUnreadMessage = Boolean(
          latestMessage &&
            latestMessage.senderCode !== myCode &&
            !latestMessage.readByCodes?.includes(myCode),
        );

        setUnreadChatByFriend((current) => ({
          ...current,
          [friend.code]: hasUnreadMessage,
        }));
      });
    });

    return () => unsubscribeList.forEach((unsubscribe) => unsubscribe());
  }, [chatFriends, myCode, hiddenChats]);

  const hasUnreadChat = Object.values(unreadChatByFriend).some(Boolean);

  // ===================================================
  // 📍 위치, 상태 안내, 프로필 사진
  // 프로필 사진은 현재 기기에만 표시되며 Firebase에는 저장하지 않습니다.
  // ===================================================
  const [myLocation, setMyLocation] = useState(null);
  const [status, setStatus] = useState('로그인 정보를 확인하는 중...');
  const [profileImage, setProfileImage] = useState(null);
  const watcherRef = useRef(null);
  const mapRef = useRef(null);
  const friendUnsubscribeRef = useRef(null);
  const requestResultAlertsRef = useRef(new Set());
  // ===================================================
  // 🪟 정보창 드래그
  // 실제 앱 영역 높이를 기준으로 두 OS에서 같은 위치를 계산합니다.
  // ===================================================
  const [panelHeight, setPanelHeight] = useState(0);
  const panelTranslateY = useRef(new Animated.Value(0)).current;
  const panelPositionRef = useRef(0);
  const panelLimitsRef = useRef({
    expanded: 0,
    default: 0,
    collapsed: 0,
  });
  const panelInitializedRef = useRef(false);
  // 📐 실제 앱 화면 높이를 측정해 정보창의 열림·닫힘 위치를 계산합니다.
  function handleAppLayout(event) {
    const height = event.nativeEvent.layout.height;
    if (!height) return;
    const limits = {
      expanded: height * 0.08,
      default: height * 0.52,
      collapsed: height * 0.9,
    };
    panelLimitsRef.current = limits;
    setPanelHeight(height);
    if (!panelInitializedRef.current) {
      panelInitializedRef.current = true;
      panelPositionRef.current = limits.default;
      panelTranslateY.setValue(limits.default);
    }
  }
  // ↕️ 개인정보 창을 지정한 세로 위치까지 부드럽게 이동시킵니다.
  function movePanel(toValue) {
    panelPositionRef.current = toValue;
    Animated.spring(panelTranslateY, {
      toValue,
      useNativeDriver: true,
      friction: 8,
      tension: 60,
    }).start();
  }
  const panelResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gesture) => Math.abs(gesture.dy) > 6,
      onPanResponderGrant: () => panelTranslateY.stopAnimation(),
      onPanResponderMove: (_, gesture) => {
        const { expanded, collapsed } = panelLimitsRef.current;
        const nextPosition = Math.max(
          expanded,
          Math.min(collapsed, panelPositionRef.current + gesture.dy),
        );
        panelTranslateY.setValue(nextPosition);
      },
      onPanResponderRelease: (_, gesture) => {
        const { expanded, default: defaultY, collapsed } = panelLimitsRef.current;
        const nextPosition = panelPositionRef.current + gesture.dy;
        if (gesture.vy < -0.7) {
          movePanel(expanded);
          return;
        }
        if (gesture.vy > 0.7) {
          movePanel(collapsed);
          return;
        }
        const expandedBoundary = (expanded + defaultY) / 2;
        const collapsedBoundary = (defaultY + collapsed) / 2;
        if (nextPosition < expandedBoundary) {
          movePanel(expanded);
        } else if (nextPosition > collapsedBoundary) {
          movePanel(collapsed);
        } else {
          movePanel(defaultY);
        }
      },
      onPanResponderTerminate: () => movePanel(panelPositionRef.current),
    }),
  ).current;

  // ===================================================
  // 🔐 로그인 상태 감지 및 사용자 정보 복원
  // 이름, 고정 공유코드, 친구코드와 공유 설정을 다시 불러옵니다.
  // ===================================================
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        setUser(null);
        setRegistrationUser(null);
        setVerificationSent(false);
        setEmailVerified(false);
        setAuthLoading(false);
        resetUserScreen();
        return;
      }
      setAuthLoading(true);
      try {
        const userRef = doc(db, 'users', currentUser.uid);
        const snapshot = await getDoc(userRef);
        const data = snapshot.exists() ? snapshot.data() : {};
        // 이메일 인증이나 이전 단계에서 남은 registrationComplete 값만으로는
        // 가입 완료로 인정하지 않습니다. 비밀번호를 설정한 뒤 사용자가
        // '가입하기' 버튼을 눌렀을 때 기록되는 전용 값만 확인합니다.
        const isRegistrationComplete = data.registrationCompletedByButton === true;

        if (snapshot.exists() && isRegistrationComplete) {
          // 가입 완료 기록이 있는 기존 사용자는 정보를 복원한 뒤
          // 로그인 화면에서 바로 위치공유 화면으로 이동합니다.
          // 위치공유 화면으로 이동합니다.
          const restoredName = data.name || '';
          const restoredFriends = Array.isArray(data.friendCodes) ? data.friendCodes : [];
          const restoredChatCodes = Array.isArray(data.chatCodes) ? data.chatCodes : [];
          const restoredHiddenChats =
            data.hiddenChats && typeof data.hiddenChats === 'object' ? data.hiddenChats : {};
          let restoredCode = data.myCode || '';

          // 예전 사용자 문서에 공유코드가 없으면 한 번 생성해 저장합니다.
          if (!restoredCode) {
            restoredCode = makeCode();
            await setDoc(
              userRef,
              {
                myCode: restoredCode,
                updatedAt: serverTimestamp(),
              },
              {
                merge: true,
              },
            );
          }
          setMyName(restoredName);
          setSavedName(restoredName);
          setIsEditingName(!restoredName);
          setMyCode(restoredCode);
          setSharing(data.sharing !== false);
          setSavedFriends(restoredFriends);
          setSavedChatCodes(restoredChatCodes);
          setHiddenChats(restoredHiddenChats);
          setFriendCode(restoredFriends[0] || '');
          setUser(currentUser);
          setRegistrationUser(null);
          setEmailVerified(currentUser.emailVerified);
          setAuthMode('login');
        } else {
          // 이메일 인증 여부와 관계없이 가입 완료 버튼을 누르지 않은 계정은
          // 회원가입 화면에 그대로 머무릅니다.
          setUser(null);
          setRegistrationUser(currentUser);
          setEmail(currentUser.email || '');
          setVerificationSent(true);
          // 이메일 링크를 눌렀더라도 앱에서 '인증 완료 확인'을 직접 누르기 전에는
          // 비밀번호 설정 단계로 자동 이동하지 않습니다.
          setEmailVerified(false);
          setAuthMode('signup');
        }
      } catch (error) {
        Alert.alert('정보 불러오기 실패', '저장된 사용자 정보를 불러오지 못했습니다.');
      } finally {
        setAuthLoading(false);
      }
    });
    return unsubscribe;
  }, []);

  // ===================================================
  // 📍 로그인 후 내 위치 추적 시작
  // 로그아웃하면 위치 추적과 친구 위치 구독을 모두 종료합니다.
  // ===================================================
  useEffect(() => {
    if (!user) return undefined;
    startLocation();
    return () => {
      if (watcherRef.current) {
        watcherRef.current.remove();
        watcherRef.current = null;
      }
      if (friendUnsubscribeRef.current) {
        friendUnsubscribeRef.current();
        friendUnsubscribeRef.current = null;
      }
    };
  }, [user]);

  // ===================================================
  // 🔥 Firebase에 내 위치 전송
  // 로그인과 공유코드 복원이 끝난 뒤에만 저장합니다.
  // 입력 중인 이름이 아닌 savedName만 상대방에게 보냅니다.
  // ===================================================
  useEffect(() => {
    if (!user || !myCode || !myLocation) return;
    const locationData = {
      name: savedName || '익명가치',
      sharing,
      updatedAt: serverTimestamp(),
    };
    if (sharing) {
      locationData.latitude = myLocation.latitude;
      locationData.longitude = myLocation.longitude;
      locationData.speed = Math.round(myLocation.speed || 0);
    }
    setDoc(doc(db, 'locations', myCode), locationData, {
      merge: true,
    }).catch(() => setStatus('Firebase 연결을 확인해주세요.'));
  }, [user, myCode, myLocation, savedName, sharing]);

  // ===================================================
  // 🔄 로그인할 때 저장된 첫 번째 친구 자동 연결
  // ===================================================
  useEffect(() => {
    if (!user || authLoading || !friendCode) return undefined;
    return subscribeToFriend(friendCode, false);
  }, [user, authLoading]);

  // ===================================================
  // 🧹 로그아웃 시 화면의 사용자 정보 초기화
  // Firebase에 저장된 정보는 삭제하지 않습니다.
  // ===================================================
  // 🧹 로그아웃한 사용자의 화면 상태를 초기값으로 되돌립니다.
  function resetUserScreen() {
    setMyName('');
    setSavedName('');
    setIsEditingName(true);
    setMyCode('');
    setSharing(true);
    setFriendCode('');
    setSavedFriends([]);
    setSavedChatCodes([]);
    setHiddenChats({});
    setFriendName('');
    setFriendLocation(null);
    setMyLocation(null);
    setProfileImage(null);
    setStatus('로그인이 필요합니다.');
  }

  // ===================================================
  // ✉️ 회원가입 계정 생성 및 이메일 인증메일 전송
  // 인증이 끝나기 전에는 위치공유 화면에 들어갈 수 없습니다.
  // ===================================================
  // ✉️ 신규 또는 가입 미완료 계정을 확인하고 이메일 인증메일을 보냅니다.
  async function sendSignUpVerification() {
    const trimmedEmail = email.trim();
    const validEmailFormat = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(trimmedEmail);
    if (!validEmailFormat) {
      Alert.alert(
        '이메일 확인',
        '현재 사용 중이며 인증메일을 받을 수 있는 올바른 이메일 주소를 입력해주세요.',
      );
      return;
    }
    setSignUpLoading(true);
    try {
      const result = await createUserWithEmailAndPassword(
        auth,
        trimmedEmail,
        makeTemporaryPassword(),
      );
      const verificationUser = result.user;
      // 이메일 인증만으로는 회원가입을 완료하지 않습니다.
      // 사용자가 '가입하기'를 눌렀을 때만 completeSignUp에서 완료 처리합니다.
      setUser(null);
      setRegistrationUser(verificationUser);
      setVerificationSent(true);
      auth.languageCode = 'ko';
      await sendEmailVerification(verificationUser);
      await AsyncStorage.multiSet([
        [VERIFICATION_EMAIL_SENT_AT_KEY, String(Date.now())],
        [VERIFICATION_EMAIL_SEND_COUNT_KEY, '1'],
      ]);
      setEmailVerified(false);
      Alert.alert('인증메일 전송', '스팸함도 확인해주세요.');
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        Alert.alert(
          '이미 사용 중인 이메일',
          '이미 등록된 이메일입니다. 로그인하거나 비밀번호 찾기를 이용해주세요.',
        );
      } else {
        Alert.alert(
          '인증메일 전송 실패',
          '인증메일을 받을 수 있는 실제 사용 중인 이메일인지 확인해주세요.',
        );
      }
    } finally {
      setSignUpLoading(false);
    }
  }

  // 인증메일을 보낸 뒤 주소가 잘못된 것을 발견하면 즉시 다시 입력할 수 있게 합니다.
  // 주소를 변경하는 순간 이전 임시 계정과 인증 진행 상태는 폐기합니다.
  function changeSignUpEmail(nextEmail) {
    setEmail(nextEmail);
    if (!verificationSent) return;

    const unfinishedUser = registrationUser || auth.currentUser;
    setRegistrationUser(null);
    setVerificationSent(false);
    setEmailVerified(false);
    setPassword('');
    AsyncStorage.multiRemove([
      VERIFICATION_EMAIL_SENT_AT_KEY,
      VERIFICATION_EMAIL_SEND_COUNT_KEY,
    ]).catch(() => {});

    if (unfinishedUser) {
      deleteUser(unfinishedUser).catch(() => signOut(auth).catch(() => {}));
    }
  }

  // 가입하기 전 회원가입을 중단하면 인증메일 발송용 임시 계정을 남기지 않습니다.
  async function cancelSignUp() {
    const unfinishedUser = registrationUser || auth.currentUser;
    setSignUpLoading(true);
    try {
      if (unfinishedUser) {
        await deleteUser(unfinishedUser);
      }
    } catch (error) {
      await signOut(auth).catch(() => {});
    } finally {
      await AsyncStorage.multiRemove([
        VERIFICATION_EMAIL_SENT_AT_KEY,
        VERIFICATION_EMAIL_SEND_COUNT_KEY,
      ]).catch(() => {});
      setPassword('');
      setVerificationSent(false);
      setEmailVerified(false);
      setRegistrationUser(null);
      setSignUpLoading(false);
      setAuthMode('login');
    }
  }

  // 이메일 링크를 누른 뒤 Firebase의 최신 인증 상태를 확인합니다.
  // ✅ Firebase에서 최신 이메일 인증 상태를 다시 확인합니다.
  async function checkEmailVerification() {
    const currentUser = registrationUser || auth.currentUser;
    if (!currentUser) {
      Alert.alert('확인 실패', '회원가입을 처음부터 다시 진행해주세요.');
      return;
    }
    try {
      setSignUpLoading(true);
      await reload(currentUser);
      const verified = currentUser.emailVerified === true;
      setRegistrationUser(currentUser);
      setVerificationSent(true);
      setEmailVerified(verified);
      Alert.alert(
        verified ? '인증 완료' : '인증 실패',
        verified ? '인증 되었습니다.' : '인증되지 않았습니다.',
      );
    } catch (error) {
      Alert.alert('확인 실패', '이메일 인증 상태를 확인하지 못했습니다.');
    } finally {
      setSignUpLoading(false);
    }
  }

  // 인증메일을 받지 못했을 때 같은 이메일로 다시 전송합니다.
  // 🔁 사용자가 인증메일을 받지 못했을 때 같은 주소로 다시 전송합니다.
  async function resendVerificationEmail() {
    const currentUser = registrationUser || auth.currentUser;
    if (!currentUser) {
      Alert.alert('재전송 실패', '회원가입을 처음부터 다시 진행해주세요.');
      return;
    }
    try {
      const storedValues = await AsyncStorage.multiGet([
        VERIFICATION_EMAIL_SENT_AT_KEY,
        VERIFICATION_EMAIL_SEND_COUNT_KEY,
      ]);
      const lastSentAt = Number(storedValues[0][1] || 0);
      const sendCount = Number(storedValues[1][1] || 1);
      const remainingMs = VERIFICATION_EMAIL_COOLDOWN_MS - (Date.now() - lastSentAt);

      // 최초 발송을 포함해 5회까지는 즉시 보낼 수 있습니다.
      // 6번째 발송부터는 마지막 발송 시각을 기준으로 5분을 기다립니다.
      if (sendCount >= 5 && remainingMs > 0) {
        const remainingMinutes = Math.floor(remainingMs / 60000);
        const remainingSeconds = Math.ceil((remainingMs % 60000) / 1000);
        Alert.alert(
          '재전송 대기',
          `인증메일은 5분마다 다시 보낼 수 있습니다. ${remainingMinutes}분 ${remainingSeconds}초 후 다시 시도해주세요.`,
        );
        return;
      }
      setSignUpLoading(true);
      auth.languageCode = 'ko';
      await sendEmailVerification(currentUser);
      const nextSendCount = sendCount + 1;
      await AsyncStorage.multiSet([
        [VERIFICATION_EMAIL_SENT_AT_KEY, String(Date.now())],
        [VERIFICATION_EMAIL_SEND_COUNT_KEY, String(nextSendCount)],
      ]);
      Alert.alert(
        '인증메일 재전송',
        nextSendCount >= 5
          ? '인증메일을 다시 보냈습니다. 다음 전송은 5분 후 가능합니다. 받은편지함과 스팸함을 확인해주세요.'
          : `인증메일을 다시 보냈습니다. 현재 ${nextSendCount}/5회 발송했습니다.`,
      );
    } catch (error) {
      Alert.alert(
        '재전송 실패',
        '요청이 너무 많거나 메일을 전송할 수 없습니다. 5분 뒤 다시 시도해주세요.',
      );
    } finally {
      setSignUpLoading(false);
    }
  }

  // 인증된 사용자의 기본 정보와 고정 공유코드를 만든 뒤 가입을 완료합니다.
  // 🎉 인증된 계정의 사용자 문서와 공유코드를 저장해 가입을 완료합니다.
  async function completeSignUp() {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      Alert.alert('가입 실패', '회원가입 정보를 찾을 수 없습니다.');
      return;
    }
    if (!password || password.length < 6) {
      Alert.alert('비밀번호 확인', '로그인에 사용할 비밀번호를 6자 이상 입력해주세요.');
      return;
    }
    setSignUpLoading(true);
    try {
      await reload(currentUser);
      if (!auth.currentUser?.emailVerified) {
        setEmailVerified(false);
        Alert.alert('이메일 인증 필요', '이메일 인증을 먼저 완료해주세요.');
        return;
      }
      await updatePassword(auth.currentUser, password);
      const userRef = doc(db, 'users', currentUser.uid);
      const snapshot = await getDoc(userRef);
      const existingData = snapshot.exists() ? snapshot.data() : {};
      const fixedCode = existingData.myCode || makeCode();
      await setDoc(
        userRef,
        {
          email: currentUser.email || '',
          emailVerified: true,
          registrationComplete: true,
          registrationCompletedByButton: true,
          name: existingData.name || '',
          myCode: fixedCode,
          friendCodes: Array.isArray(existingData.friendCodes) ? existingData.friendCodes : [],
          chatCodes: Array.isArray(existingData.chatCodes) ? existingData.chatCodes : [],
          hiddenChats:
            existingData.hiddenChats && typeof existingData.hiddenChats === 'object'
              ? existingData.hiddenChats
              : {},
          sharing: existingData.sharing !== false,
          updatedAt: serverTimestamp(),
        },
        {
          merge: true,
        },
      );
      setMyCode(fixedCode);
      setRegistrationUser(null);
      setVerificationSent(false);
      setEmailVerified(true);
      setPassword('');
      setUser(auth.currentUser);
      await AsyncStorage.multiRemove([
        VERIFICATION_EMAIL_SENT_AT_KEY,
        VERIFICATION_EMAIL_SEND_COUNT_KEY,
      ]);
      Alert.alert('가입 완료', '이제 우리 가치 앱을 사용할 수 있습니다.');
    } catch (error) {
      Alert.alert('가입 실패', '사용자 정보를 저장하지 못했습니다.');
    } finally {
      setSignUpLoading(false);
    }
  }

  // ===================================================
  // 🔓 기존 계정 로그인
  // 성공하면 onAuthStateChanged가 저장 정보를 자동으로 복원합니다.
  // ===================================================
  // 🔓 이메일과 비밀번호로 로그인하고 이메일 저장 설정을 반영합니다.
  async function login() {
    const trimmedEmail = email.trim();
    if (!trimmedEmail || !password) {
      Alert.alert('입력 확인', '이메일과 비밀번호를 입력해주세요.');
      return;
    }
    try {
      await signInWithEmailAndPassword(auth, trimmedEmail, password);
      if (rememberEmail) {
        await AsyncStorage.setItem(REMEMBERED_EMAIL_KEY, trimmedEmail);
      } else {
        await AsyncStorage.removeItem(REMEMBERED_EMAIL_KEY);
      }

      // 비밀번호는 로그인 성공 후 항상 삭제합니다.
      setPassword('');
    } catch (error) {
      Alert.alert('로그인 실패', getAuthErrorMessage(error));
    }
  }

  // ===================================================
  // 🚪 로그아웃
  // Firebase 데이터는 유지되고 현재 기기의 로그인만 해제합니다.
  // ===================================================
  // 🚪 Firebase에서 로그아웃해 현재 기기의 로그인 세션을 종료합니다.
  async function logout() {
    try {
      await stopBackgroundLocationUpdates();
      await AsyncStorage.multiRemove([
        BACKGROUND_LOCATION_DATA_KEY,
        BACKGROUND_LOCATION_LAST_UPLOAD_KEY,
      ]);
      await signOut(auth);
    } catch (error) {
      Alert.alert('로그아웃 실패', '다시 시도해주세요.');
    }
  }

  // ===================================================
  // 🔑 비밀번호 재설정
  // 가입 이메일로 Firebase의 비밀번호 재설정 링크를 보냅니다.
  // 기존 비밀번호는 보안상 확인하거나 표시할 수 없습니다.
  // ===================================================
  // 🔑 입력한 이메일로 비밀번호 재설정 링크를 전송합니다.
  async function resetPassword() {
    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      Alert.alert('이메일 입력', '가입할 때 사용한 이메일을 입력해주세요.');
      return;
    }
    try {
      auth.languageCode = 'ko';
      await sendPasswordResetEmail(auth, trimmedEmail);
      Alert.alert(
        '재설정 메일 전송',
        '이메일로 보낸 링크를 열어 새 비밀번호를 설정해주세요. 스팸함도 확인해주세요.',
      );
    } catch (error) {
      Alert.alert('메일 전송 실패', '이메일 형식과 인터넷 연결을 확인한 뒤 다시 시도해주세요.');
    }
  }

  // Firebase 오류코드를 사용자에게 쉬운 문장으로 안내합니다.
  // 🗣️ Firebase 인증 오류코드를 사용자가 이해하기 쉬운 문장으로 바꿉니다.
  function getAuthErrorMessage(error) {
    if (error.code === 'auth/email-already-in-use') {
      return '이미 가입된 이메일입니다.';
    }
    if (error.code === 'auth/invalid-email') {
      return '올바른 이메일 주소를 입력해주세요.';
    }
    if (error.code === 'auth/weak-password') {
      return '비밀번호는 6자 이상으로 입력해주세요.';
    }
    if (
      error.code === 'auth/invalid-credential' ||
      error.code === 'auth/user-not-found' ||
      error.code === 'auth/wrong-password'
    ) {
      return '이메일 또는 비밀번호를 확인해주세요.';
    }
    return '잠시 후 다시 시도해주세요.';
  }

  // 백그라운드 작업이 화면 상태 없이도 공유코드와 이름을 확인할 수 있게 저장합니다.
  useEffect(() => {
    if (!user || !myCode) return;
    AsyncStorage.setItem(
      BACKGROUND_LOCATION_DATA_KEY,
      JSON.stringify({
        myCode,
        name: savedName || '익명가치',
        sharing,
      }),
    ).catch(() => {});
  }, [user, myCode, savedName, sharing]);

  async function stopBackgroundLocationUpdates() {
    const started = await Location.hasStartedLocationUpdatesAsync(BACKGROUND_LOCATION_TASK).catch(
      () => false,
    );
    if (started) {
      await Location.stopLocationUpdatesAsync(BACKGROUND_LOCATION_TASK);
    }
  }

  async function startBackgroundLocationUpdates(sharingEnabled = sharing) {
    if (!user || !myCode || !sharingEnabled) return;

    const taskManagerAvailable = await TaskManager.isAvailableAsync();
    if (!taskManagerAvailable) {
      setStatus('백그라운드 위치 공유는 개발용 앱 또는 설치 앱에서 사용할 수 있습니다.');
      return;
    }

    await AsyncStorage.setItem(
      BACKGROUND_LOCATION_DATA_KEY,
      JSON.stringify({
        myCode,
        name: savedName || '익명가치',
        sharing: true,
      }),
    );

    let backgroundPermission = await Location.getBackgroundPermissionsAsync();
    if (!backgroundPermission.granted && backgroundPermission.canAskAgain) {
      backgroundPermission = await Location.requestBackgroundPermissionsAsync();
    }
    if (!backgroundPermission.granted) {
      setStatus('앱이 닫힌 동안 공유하려면 위치 권한을 “항상 허용”으로 설정해주세요.');
      return;
    }

    const started = await Location.hasStartedLocationUpdatesAsync(BACKGROUND_LOCATION_TASK);
    if (started) return;

    await Location.startLocationUpdatesAsync(BACKGROUND_LOCATION_TASK, {
      accuracy: Location.Accuracy.Balanced,
      timeInterval: BACKGROUND_LOCATION_INTERVAL_MS,
      deferredUpdatesInterval: BACKGROUND_LOCATION_INTERVAL_MS,
      pausesUpdatesAutomatically: false,
      showsBackgroundLocationIndicator: true,
      foregroundService: {
        notificationTitle: '우리 가치 위치 공유 중',
        notificationBody: '앱이 백그라운드에서도 10분마다 위치를 갱신합니다.',
        killServiceOnDestroy: false,
      },
    });
  }

  // ===================================================
  // 📍 위치 권한 요청 및 실시간 위치 추적
  // ===================================================
  // 📍 위치 권한을 확인하고 내 위치와 속도의 실시간 추적을 시작합니다.
  async function startLocation() {
    try {
      let permission = await Location.getForegroundPermissionsAsync();

      // 아직 권한을 선택하지 않은 경우에만 휴대폰 권한창을 띄웁니다.
      if (!permission.granted && permission.canAskAgain) {
        permission = await Location.requestForegroundPermissionsAsync();
      }
      if (!permission.granted) {
        setStatus('위치 권한이 필요합니다.');
        Alert.alert(
          '위치 권한 필요',
          '휴대폰 설정에서 이 앱의 위치 접근을 “앱을 사용하는 동안”으로 허용해주세요.',
        );
        return;
      }
      const current = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      setMyLocation({
        latitude: current.coords.latitude,
        longitude: current.coords.longitude,
        // expo-location의 속도는 m/s이므로 km/h로 변환합니다.
        speed:
          typeof current.coords.speed === 'number' && current.coords.speed > 0
            ? current.coords.speed * 3.6
            : 0,
      });
      setStatus('내 위치 공유 준비 완료');
      watcherRef.current = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 5000,
          distanceInterval: 10,
        },
        (location) => {
          setMyLocation({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            speed:
              typeof location.coords.speed === 'number' && location.coords.speed > 0
                ? location.coords.speed * 3.6
                : 0,
          });
        },
      );
      await startBackgroundLocationUpdates();
    } catch (error) {
      setStatus('현재 위치를 가져오지 못했습니다.');
    }
  }

  // ===================================================
  // 📸 휴대폰 사진첩에서 프로필 사진 선택
  // 현재 기기에서만 표시되며 영구 저장 기능은 포함하지 않습니다.
  // ===================================================
  // 🖼️ 사진첩에서 내 프로필로 사용할 이미지를 선택합니다.
  async function pickProfileImage() {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('사진 권한 필요', '프로필 사진을 선택하려면 사진 접근 권한이 필요합니다.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      // Android의 강제 자르기/화면 조절 단계를 건너뜁니다.
      // 원본 사진의 가로세로 비율을 그대로 유지합니다.
      allowsEditing: false,
      quality: 1,
    });
    if (!result.canceled && result.assets?.[0]?.uri) {
      const selectedImageUri = result.assets[0].uri;
      Alert.alert('프로필 사진', '선택한 사진을 프로필에 적용할까요?', [
        {
          text: '취소',
          style: 'cancel',
        },
        {
          text: '선택',
          onPress: () => setProfileImage(selectedImageUri),
        },
      ]);
    }
  }

  // ===================================================
  // 👤 이름 저장
  // 저장 버튼을 누른 이름만 사용자 문서와 위치 문서에 저장합니다.
  // ===================================================
  // 💾 입력한 내 이름을 검사한 뒤 Firebase 사용자 정보에 저장합니다.
  async function saveMyName() {
    const trimmedName = myName.trim();
    if (!trimmedName) {
      Alert.alert('이름 확인', '이름을 입력해주세요.');
      return;
    }
    if (!user || !myCode) {
      Alert.alert('저장 실패', '로그인 정보를 다시 확인해주세요.');
      return;
    }
    try {
      await setDoc(
        doc(db, 'users', user.uid),
        {
          name: trimmedName,
          email: user.email || '',
          updatedAt: serverTimestamp(),
        },
        {
          merge: true,
        },
      );
      await setDoc(
        doc(db, 'locations', myCode),
        {
          name: trimmedName,
          updatedAt: serverTimestamp(),
        },
        {
          merge: true,
        },
      );
      setSavedName(trimmedName);
      setIsEditingName(false);
      Alert.alert('저장 완료', '이름이 저장되었습니다.');
    } catch (error) {
      Alert.alert('저장 실패', 'Firebase 연결과 권한을 확인해주세요.');
    }
  }

  // ===================================================
  // ✏️ 이름 수정 확인
  // 새 이름을 저장하기 전까지 상대방에게는 기존 이름이 유지됩니다.
  // ===================================================
  // ✏️ 저장된 이름을 다시 편집할지 사용자에게 확인합니다.
  function confirmEditName() {
    Alert.alert('이름 수정', '정말 수정하겠습니까?', [
      {
        text: '아니요',
        style: 'cancel',
      },
      {
        text: '네',
        onPress: () => {
          setMyName('');
          setIsEditingName(true);
        },
      },
    ]);
  }

  // ===================================================
  // 📡 위치공유 설정 저장
  // 앱을 다시 실행해도 이전 스위치 설정이 유지됩니다.
  // ===================================================
  // 📡 위치 공유 스위치 상태를 화면과 Firebase에 함께 반영합니다.
  async function changeSharing(nextSharing) {
    setSharing(nextSharing);
    if (!user) return;
    try {
      await AsyncStorage.setItem(
        BACKGROUND_LOCATION_DATA_KEY,
        JSON.stringify({
          myCode,
          name: savedName || '익명가치',
          sharing: nextSharing,
        }),
      );
      if (nextSharing) {
        await startBackgroundLocationUpdates(true);
      } else {
        await stopBackgroundLocationUpdates();
        await AsyncStorage.removeItem(BACKGROUND_LOCATION_LAST_UPLOAD_KEY);
      }
      await setDoc(
        doc(db, 'users', user.uid),
        {
          sharing: nextSharing,
          updatedAt: serverTimestamp(),
        },
        {
          merge: true,
        },
      );
    } catch (error) {
      Alert.alert('설정 저장 실패', '위치공유 설정을 저장하지 못했습니다.');
    }
  }

  // ===================================================
  // 🤝 친구코드 연결 버튼
  // 유효한 친구만 저장하고 해당 친구의 위치를 실시간 구독합니다.
  // ===================================================
  // 🤝 입력한 공유코드를 검사하고 해당 친구 연결을 시작합니다.
  function showInvalidFriendCodeAlert() {
    Alert.alert('코드 확인', '없는 코드입니다.\n다시 작성하세요.');
  }

  async function connectFriend() {
    const code = friendCode.trim().toUpperCase();
    if (!/^[A-HJ-NP-Z2-9]{6}$/.test(code)) {
      showInvalidFriendCodeAlert();
      return;
    }
    if (code === myCode) {
      Alert.alert('코드 확인', '내 공유코드는 친구로 추가할 수 없습니다.');
      return;
    }
    if (savedFriends.includes(code)) {
      Alert.alert('친구 확인', '이미 친구목록에 등록된 사용자입니다.');
      return;
    }

    try {
      const targetSnapshot = await getDoc(doc(db, 'locations', code));
      if (!targetSnapshot.exists()) {
        showInvalidFriendCodeAlert();
        return;
      }

      setFriendCode(code);
      const targetUsersSnapshot = await getDocs(
        query(collection(db, 'users'), where('myCode', '==', code), limit(1)),
      );
      const targetUserData = targetUsersSnapshot.docs[0]?.data();
      const targetAlreadyHasMe =
        Array.isArray(targetUserData?.friendCodes) && targetUserData.friendCodes.includes(myCode);

      if (targetAlreadyHasMe) {
        await saveFriendCode(code);
        await saveChatCode(code);
        Alert.alert(
          '친구 추가 완료',
          '상대방의 친구목록에 이미 등록되어 있어 내 목록에 다시 추가했습니다.',
        );
        return;
      }

      Alert.alert('친구 추가', '상대방에게 친구 요청을 보내시겠습니까?', [
        {
          text: '취소',
          style: 'cancel',
        },
        {
          text: '요청 보내기',
          onPress: () => sendFriendRequest(code),
        },
      ]);
    } catch (error) {
      Alert.alert('요청 실패', '공유코드를 확인하지 못했습니다. 다시 시도해주세요.');
    }
  }

  async function sendFriendRequest(targetCode) {
    if (!user || !myCode) return;
    try {
      const requestRef = doc(db, 'friendRequests', `${user.uid}_${targetCode}`);
      await setDoc(requestRef, {
        fromUid: user.uid,
        fromCode: myCode,
        fromName: savedName || '익명가치',
        toCode: targetCode,
        status: 'pending',
        senderHandled: false,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      Alert.alert('요청 완료', '상대방에게 친구 요청을 보냈습니다.');
    } catch (error) {
      Alert.alert('요청 실패', '친구 요청을 보내지 못했습니다. 다시 시도해주세요.');
    }
  }

  // ===================================================
  // 📥 친구 위치 실시간 구독
  // saveWhenFound가 true이면 존재하는 친구코드를 내 계정에 저장합니다.
  // ===================================================
  // 🔄 친구의 Firebase 위치 문서를 실시간 구독하고 필요하면 목록에 저장합니다.
  function subscribeToFriend(code, saveWhenFound) {
    setStatus(`${code} 위치 연결 중...`);
    let invalidCodeAlertShown = false;
    const unsubscribe = onSnapshot(
      doc(db, 'locations', code),
      async (snapshot) => {
        if (!snapshot.exists()) {
          setFriendLocation(null);
          setFriendSpeed(0);
          setFriendName('');
          setStatus('아직 상대방 위치가 공유되지 않았습니다.');
          if (saveWhenFound && !invalidCodeAlertShown) {
            invalidCodeAlertShown = true;
            showInvalidFriendCodeAlert();
          }
          return;
        }
        if (saveWhenFound) return;
        const data = snapshot.data();
        const receivedName = data.name || '익명가치';
        setFriendName(receivedName);
        setFriendProfileImageUrl(data.profileImageUrl || '');
        if (data.sharing === false) {
          setFriendLocation(null);
          setFriendSpeed(0);
          setStatus(`${receivedName}님이 위치 공유를 중지했습니다.`);
          return;
        }
        if (typeof data.latitude !== 'number' || typeof data.longitude !== 'number') {
          setFriendLocation(null);
          setFriendSpeed(0);
          setStatus('상대방의 위치를 기다리는 중입니다.');
          return;
        }
        setFriendLocation({
          latitude: data.latitude,
          longitude: data.longitude,
        });
        setFriendSpeed(typeof data.speed === 'number' ? Math.max(0, data.speed) : 0);
        setStatus(`${receivedName}님의 위치를 실시간으로 받고 있습니다.`);
      },
      () => setStatus('Firebase 읽기 권한을 확인해주세요.'),
    );
    return unsubscribe;
  }
  // 지도 아래의 내 아이콘을 누르면 내 현재 위치로 이동합니다.
  // 🎯 지도의 중심을 현재 내 위치로 부드럽게 이동합니다.
  function moveToMyLocation() {
    if (!myLocation || !mapRef.current) {
      Alert.alert('위치 확인', '내 현재 위치를 확인할 수 없습니다.');
      return;
    }
    mapRef.current.animateToRegion(
      {
        latitude: myLocation.latitude,
        longitude: myLocation.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      },
      600,
    );
  }

  // 저장된 모든 친구 정보를 실시간으로 구독합니다.
  // 친구가 이름·사진·위치를 변경하면 지도 아래 아이콘에도 바로 반영됩니다.
  useEffect(() => {
    if (!user) {
      setFriendList([]);
      return undefined;
    }
    setFriendList(
      savedFriends.map((code) => ({
        code,
        name: '익명가치',
        profileImageUrl: '',
        sharing: true,
        speed: 0,
        location: null,
      })),
    );
    const unsubscribes = savedFriends.map((code) =>
      onSnapshot(
        doc(db, 'locations', code),
        (snapshot) => {
          const data = snapshot.exists() ? snapshot.data() : {};
          const hasLocation =
            typeof data.latitude === 'number' && typeof data.longitude === 'number';
          const updatedFriend = {
            code,
            name: data.name?.trim() || '익명가치',
            profileImageUrl: data.profileImageUrl || '',
            sharing: data.sharing !== false,
            speed: typeof data.speed === 'number' ? Math.max(0, data.speed) : 0,
            location: hasLocation
              ? {
                  latitude: data.latitude,
                  longitude: data.longitude,
                }
              : null,
          };
          setFriendList((current) =>
            savedFriends.map((savedCode) =>
              savedCode === code
                ? updatedFriend
                : current.find((friend) => friend.code === savedCode) || {
                    code: savedCode,
                    name: '익명가치',
                    profileImageUrl: '',
                    location: null,
                  },
            ),
          );
        },
        () => setStatus('친구 정보를 실시간으로 불러오지 못했습니다.'),
      ),
    );
    return () => {
      unsubscribes.forEach((unsubscribe) => unsubscribe());
    };
  }, [user, savedFriends]);
  useEffect(() => {
    if (!selectedFriend?.code) return;
    const latestFriend = friendList.find((friend) => friend.code === selectedFriend.code);
    if (latestFriend) {
      setSelectedFriend(latestFriend);
    }
  }, [friendList, selectedFriend?.code]);
  // 👤 선택한 친구의 위치·주소·속도 정보를 하단 상세창에 표시합니다.
  async function openFriendDetail(friend) {
    if (!friend) return;
    setSelectedFriend(friend);
    setSelectedFriendAddress('주소 확인 중...');
    if (!friend.location) {
      setSelectedFriendAddress('현재 위치를 확인할 수 없습니다.');
      return;
    }
    mapRef.current?.animateToRegion(
      {
        latitude: friend.location.latitude,
        longitude: friend.location.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      },
      600,
    );
    try {
      const addresses = await Location.reverseGeocodeAsync({
        latitude: friend.location.latitude,
        longitude: friend.location.longitude,
      });
      const address = addresses[0];
      if (!address) {
        setSelectedFriendAddress('주소를 찾을 수 없습니다.');
        return;
      }
      setSelectedFriendAddress(
        [address.region, address.city, address.district, address.street, address.name]
          .filter(Boolean)
          .join(' '),
      );
    } catch (error) {
      setSelectedFriendAddress('주소를 불러오지 못했습니다.');
    }
  }
  // ⚠️ 저장된 친구를 삭제하기 전에 확인창을 표시합니다.
  function confirmDeleteFriend(code) {
    Alert.alert('친구 삭제', '이 친구를 목록에서 삭제하시겠습니까?', [
      {
        text: '아니요',
        style: 'cancel',
      },
      {
        text: '네',
        style: 'destructive',
        onPress: () => deleteFriend(code),
      },
    ]);
  }

  //저장된 친구 삭제
  // 🗑️ 선택한 친구 코드를 Firebase와 현재 화면 목록에서 제거합니다.
  async function deleteFriend(code) {
    const nextFriendCodes = savedFriends.filter((savedCode) => savedCode !== code);
    await setDoc(
      doc(db, 'users', user.uid),
      {
        friendCodes: nextFriendCodes,
        chatCodes: arrayUnion(code),
        updatedAt: serverTimestamp(),
      },
      {
        merge: true,
      },
    );
    setSavedFriends(nextFriendCodes);
    setSavedChatCodes((current) => (current.includes(code) ? current : [...current, code]));
    setFriendList((current) => current.filter((friend) => friend.code !== code));
    if (friendCode === code) {
      setFriendCode('');
      setFriendName('');
      setFriendLocation(null);
    }
  }

  // 친구코드를 중복 없이 사용자 문서에 저장합니다.
  // 💾 새 친구 공유코드를 중복 없이 Firebase 사용자 문서에 저장합니다.
  async function saveFriendCode(code) {
    if (!user) return;
    try {
      await setDoc(
        doc(db, 'users', user.uid),
        {
          friendCodes: arrayUnion(code),
          updatedAt: serverTimestamp(),
        },
        {
          merge: true,
        },
      );
      setSavedFriends((current) => (current.includes(code) ? current : [...current, code]));
    } catch (error) {
      Alert.alert('친구 저장 실패', '친구코드를 저장하지 못했습니다.');
    }
  }

  // 친구 관계와 별개로 기존 대화방을 계속 찾을 수 있도록 대화 상대 코드를 저장합니다.
  async function saveChatCode(code) {
    if (!user || !code) return;
    await setDoc(
      doc(db, 'users', user.uid),
      {
        chatCodes: arrayUnion(code),
        updatedAt: serverTimestamp(),
      },
      { merge: true },
    );
    setSavedChatCodes((current) => (current.includes(code) ? current : [...current, code]));
  }

  // 채팅 삭제는 상대방 데이터나 공용 메시지를 지우지 않고 내 화면에서만 숨깁니다.
  async function hideChat(code) {
    if (!user || !code) return;
    const nextHiddenChats = {
      ...hiddenChats,
      [code]: Date.now(),
    };
    await setDoc(
      doc(db, 'users', user.uid),
      {
        hiddenChats: nextHiddenChats,
        updatedAt: serverTimestamp(),
      },
      { merge: true },
    );
    setHiddenChats(nextHiddenChats);
  }

  async function respondToFriendRequest(requestRef, requestData, accepted) {
    try {
      if (accepted) {
        await saveFriendCode(requestData.fromCode);
        await saveChatCode(requestData.fromCode);
      }
      await setDoc(
        requestRef,
        {
          status: accepted ? 'accepted' : 'rejected',
          respondedAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        },
        { merge: true },
      );
      Alert.alert(
        accepted ? '친구 추가 완료' : '요청 거절',
        accepted
          ? '친구 요청을 수락했습니다. 서로의 친구목록에 등록됩니다.'
          : '친구 요청을 거절했습니다.',
      );
    } catch (error) {
      Alert.alert('처리 실패', '친구 요청을 처리하지 못했습니다. 다시 시도해주세요.');
    }
  }

  // 내 공유코드로 도착한 친구 요청을 친구 목록 창에 실시간으로 표시합니다.
  useEffect(() => {
    if (!user || !myCode) {
      setIncomingFriendRequests([]);
      return undefined;
    }

    const incomingRequestsQuery = query(
      collection(db, 'friendRequests'),
      where('toCode', '==', myCode),
    );
    return onSnapshot(incomingRequestsQuery, (snapshot) => {
      setIncomingFriendRequests(
        snapshot.docs
          .filter((requestDocument) => requestDocument.data().status === 'pending')
          .map((requestDocument) => ({
            id: requestDocument.id,
            ref: requestDocument.ref,
            ...requestDocument.data(),
          })),
      );
      snapshot.docs.forEach((requestDocument) => {
        const requestData = requestDocument.data();
        if (requestData.status === 'accepted' && requestData.fromCode) {
          saveChatCode(requestData.fromCode).catch(() => {});
        }
      });
    });
  }, [user, myCode]);

  // 상대방이 수락하면 요청을 보낸 사용자 자신의 친구목록에도 상대 코드를 저장합니다.
  useEffect(() => {
    if (!user) return undefined;

    const sentRequestsQuery = query(
      collection(db, 'friendRequests'),
      where('fromUid', '==', user.uid),
    );
    return onSnapshot(sentRequestsQuery, (snapshot) => {
      snapshot.docs.forEach(async (requestDocument) => {
        const requestData = requestDocument.data();
        if (requestData.status === 'accepted' && requestData.toCode) {
          await saveChatCode(requestData.toCode).catch(() => {});
        }
        if (
          requestData.status === 'pending' ||
          requestData.senderHandled === true ||
          requestResultAlertsRef.current.has(requestDocument.id)
        ) {
          return;
        }

        requestResultAlertsRef.current.add(requestDocument.id);
        try {
          if (requestData.status === 'accepted') {
            await saveFriendCode(requestData.toCode);
            Alert.alert('친구 추가 완료', '상대방이 요청을 수락하여 친구목록에 등록됐습니다.');
          } else if (requestData.status === 'rejected') {
            Alert.alert('친구 요청 거절', '상대방이 친구 요청을 거절했습니다.');
          }
          await setDoc(
            requestDocument.ref,
            {
              senderHandled: true,
              updatedAt: serverTimestamp(),
            },
            { merge: true },
          );
        } catch (error) {
          requestResultAlertsRef.current.delete(requestDocument.id);
        }
      });
    });
  }, [user]);

  // ===================================================
  // 🗺️ 지도 시작 위치
  // 내 위치를 얻기 전에는 서울 중심을 표시합니다.
  // ===================================================
  const region = myLocation
    ? {
        ...myLocation,
        latitudeDelta: 0.015,
        longitudeDelta: 0.015,
      }
    : {
        latitude: 37.5665,
        longitude: 126.978,
        latitudeDelta: 0.1,
        longitudeDelta: 0.1,
      };

  // 내 위치와 친구 위치가 거의 같으면 지도 표시만 살짝 벌립니다.
  // Firebase에 저장된 실제 좌표는 변경하지 않습니다.
  // 🧭 내 아이콘과 친구 아이콘이 겹칠 때 친구 마커의 표시 위치를 조정합니다.
  function getDisplayedFriendLocation(location, code, name) {
    if (!myLocation || !location) return location;
    const latitudeMeters = (location.latitude - myLocation.latitude) * 111320;
    const longitudeMeters =
      (location.longitude - myLocation.longitude) *
      111320 *
      Math.cos((myLocation.latitude * Math.PI) / 180);
    const distanceMeters = Math.hypot(latitudeMeters, longitudeMeters);

    // 약 25m 안에 있으면 실제 좌표는 유지하고 지도 아이콘만 옆으로 표시합니다.
    if (distanceMeters >= 25) return location;
    const codeText = code || name || 'friend';
    const codeNumber = [...codeText].reduce(
      (total, character) => total + character.charCodeAt(0),
      0,
    );
    const angle = ((codeNumber % 360) * Math.PI) / 180;
    const displayDistanceMeters = 18;
    const latitudeOffset = (Math.cos(angle) * displayDistanceMeters) / 111320;
    const longitudeOffset =
      (Math.sin(angle) * displayDistanceMeters) /
      (111320 * Math.cos((myLocation.latitude * Math.PI) / 180));
    return {
      latitude: myLocation.latitude + latitudeOffset,
      longitude: myLocation.longitude + longitudeOffset,
    };
  }
  const displayedFriendLocation = getDisplayedFriendLocation(
    friendLocation,
    friendCode,
    friendName,
  );
  if (showStartupScreen) {
    return (
      <View style={styles.startupScreen}>
        <Image source={require('./asset/mainIMG.png')} style={styles.startupImage} />
      </View>
    );
  }

  // Firebase가 저장된 로그인 정보를 확인하는 동안 표시합니다.
  if (authLoading) {
    return (
      <SafeAreaView style={styles.centerScreen}>
        <Text style={styles.loadingText}>로그인 정보를 확인하는 중...</Text>
      </SafeAreaView>
    );
  }

  // ===================================================
  // 🔐 로그인하지 않은 사용자 화면
  // ===================================================
  if (!user) {
    // =================================================
    // 🪪 아이디 찾기 화면
    // 받은편지함에서 회원가입 인증메일을 검색하도록 안내합니다.
    // =================================================
    if (authMode === 'findEmail') {
      return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <SafeAreaView style={styles.authContainer}>
            <Text style={styles.authTitle}>아이디 찾기</Text>
            <Text style={styles.authDescription}>아이디는 회원가입에 사용한 이메일입니다.</Text>
            <View style={styles.guideBox}>
              <Text style={styles.guideTitle}>이메일 확인 방법</Text>
              <Text style={styles.guideText}>
                사용하는 이메일 앱의 받은편지함에서{`\n`}
                “우리 가치” 또는 “Firebase”를 검색해주세요.{`\n\n`}
                회원가입할 때 받은 인증메일에서 가입에 사용한 이메일을 확인할 수 있습니다.
              </Text>
            </View>
            <TouchableOpacity style={styles.signUpButton} onPress={() => setAuthMode('login')}>
              <Text style={styles.signUpButtonText}>로그인 화면으로 돌아가기</Text>
            </TouchableOpacity>
          </SafeAreaView>
        </TouchableWithoutFeedback>
      );
    }

    // =================================================
    // 🔑 비밀번호 찾기 화면
    // 가입 이메일로 새 비밀번호 설정 링크를 보냅니다.
    // =================================================
    if (authMode === 'resetPassword') {
      return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <SafeAreaView style={styles.authContainer}>
            <Text style={styles.authTitle}>비밀번호 찾기</Text>
            <Text style={styles.authDescription}>
              가입한 이메일을 입력하면 비밀번호 재설정 링크를 보내드립니다.
            </Text>

            <TextInput
              style={styles.authInput}
              value={email}
              onChangeText={setEmail}
              placeholder="가입한 이메일"
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
              returnKeyType="done"
              onSubmitEditing={Keyboard.dismiss}
            />
            <TouchableOpacity style={styles.authButton} onPress={resetPassword}>
              <Text style={styles.authButtonText}>메일 보내기</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.signUpButton}
              onPress={() => {
                setEmail('');
                setAuthMode('login');
              }}
            >
              <Text style={styles.signUpButtonText}>로그인 화면으로 돌아가기</Text>
            </TouchableOpacity>
          </SafeAreaView>
        </TouchableWithoutFeedback>
      );
    }

    // 이메일 인증을 거쳐 최종 가입을 완료하는 화면입니다.
    if (authMode === 'signup') {
      return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <SafeAreaView style={styles.authContainer}>
            <Text style={[styles.authTitle, styles.signUpTitle]}>회원가입</Text>

            {!emailVerified ? (
              <>
                {/* 이메일 입력칸 위에 인증 상태를 글자로만 표시합니다. */}
                <Text
                  style={[
                    styles.verificationStatusText,
                    verificationSent
                      ? styles.verificationPendingText
                      : styles.verificationRequiredText,
                  ]}
                >
                  이메일 인증: {verificationSent ? '⏳' : '인증 필요'}
                </Text>

                <TextInput
                  style={styles.authInput}
                  value={email}
                  onChangeText={changeSignUpEmail}
                  placeholder="이메일"
                  autoCapitalize="none"
                  autoCorrect={false}
                  keyboardType="email-address"
                  returnKeyType="next"
                  editable={!signUpLoading}
                />

                {!verificationSent ? (
                  <TouchableOpacity
                    style={styles.authButton}
                    onPress={sendSignUpVerification}
                    disabled={signUpLoading}
                  >
                    <Text style={styles.authButtonText}>
                      {signUpLoading ? '⏳ 인증메일 보내는 중...' : '인증메일 보내기'}
                    </Text>
                  </TouchableOpacity>
                ) : (
                  <>
                    <TouchableOpacity
                      style={styles.authButton}
                      onPress={checkEmailVerification}
                      disabled={signUpLoading}
                    >
                      <Text style={styles.authButtonText}>
                        {signUpLoading ? '⏳ 인증 확인 중...' : '인증 완료 확인'}
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.signUpButton}
                      onPress={resendVerificationEmail}
                      disabled={signUpLoading}
                    >
                      <Text style={styles.signUpButtonText}>
                        {signUpLoading ? '⏳ 처리 중...' : '인증메일 다시 보내기'}
                      </Text>
                    </TouchableOpacity>
                  </>
                )}
              </>
            ) : (
              <>
                <Text style={[styles.verificationStatusText, styles.verifiedText]}>
                  ✅ 이메일 인증 완료
                </Text>
                <TextInput
                  style={styles.authInput}
                  value={password}
                  onChangeText={setPassword}
                  placeholder="로그인 비밀번호(6자 이상)"
                  secureTextEntry
                  returnKeyType="done"
                  onSubmitEditing={Keyboard.dismiss}
                  editable={!signUpLoading}
                />
                <TouchableOpacity
                  style={styles.completeButton}
                  onPress={completeSignUp}
                  disabled={signUpLoading}
                >
                  <Text style={styles.authButtonText}>
                    {signUpLoading ? '⏳ 가입 처리 중...' : '가입하기'}
                  </Text>
                </TouchableOpacity>
              </>
            )}
            <TouchableOpacity
              style={styles.signUpButton}
              onPress={cancelSignUp}
              disabled={signUpLoading}
            >
              <Text style={styles.signUpButtonText}>로그인 화면으로 돌아가기</Text>
            </TouchableOpacity>
          </SafeAreaView>
        </TouchableWithoutFeedback>
      );
    }

    // 앱을 처음 열었을 때 표시되는 로그인 전용 화면입니다.
    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <SafeAreaView style={styles.authContainer}>
          <Text style={styles.authDescription}>
            소중한 사람들과 위치를 공유하여 서로를 확인해보세요.
          </Text>

          <TextInput
            style={styles.authInput}
            value={email}
            onChangeText={setEmail}
            placeholder="이메일"
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
            returnKeyType="next"
          />
          <TextInput
            style={styles.authInput}
            value={password}
            onChangeText={setPassword}
            placeholder="비밀번호(6자 이상)"
            secureTextEntry
            returnKeyType="done"
            onSubmitEditing={Keyboard.dismiss}
          />

          <TouchableOpacity
            style={styles.rememberEmailRow}
            onPress={async () => {
              const nextValue = !rememberEmail;
              setRememberEmail(nextValue);
              if (!nextValue) {
                await AsyncStorage.removeItem(REMEMBERED_EMAIL_KEY);
              }
            }}
            activeOpacity={0.7}
          >
            <View style={[styles.rememberEmailCheckbox, rememberEmail]}>
              {rememberEmail ? <Text style={styles.rememberEmailCheckmark}>✓</Text> : null}
            </View>

            <Text style={styles.rememberEmailText}>이메일 기억하기</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.authButton} onPress={login}>
            <Text style={styles.authButtonText}>로그인</Text>
          </TouchableOpacity>
          {/* 로그인 아래의 계정 관련 메뉴 */}
          <View style={styles.accountHelpRow}>
            <TouchableOpacity
              onPress={() => {
                setEmail('');
                setPassword('');
                setAuthMode('findEmail');
              }}
            >
              <Text style={styles.accountHelpText}>아이디 찾기</Text>
            </TouchableOpacity>
            <Text style={styles.accountHelpDivider}>|</Text>
            <TouchableOpacity
              onPress={() => {
                setEmail('');
                setPassword('');
                setAuthMode('resetPassword');
              }}
            >
              <Text style={styles.accountHelpText}>비밀번호 찾기</Text>
            </TouchableOpacity>
            <Text style={styles.accountHelpDivider}>|</Text>
            <TouchableOpacity
              onPress={() => {
                setEmail('');
                setPassword('');
                setAuthMode('signup');
              }}
            >
              <Text style={styles.accountHelpText}>회원가입</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </TouchableWithoutFeedback>
    );
  }

  // ===================================================
  // 🗺️ 로그인한 사용자 위치공유 화면
  // ===================================================
  return (
    <View style={styles.container} onLayout={handleAppLayout}>
      <KeyboardAvoidingView style={styles.container} behavior="padding" keyboardVerticalOffset={0}>
        {/* 💬 채팅 친구 목록을 여는 지도 우측 상단 버튼 */}
        <TouchableOpacity
          style={styles.mapChatButton}
          activeOpacity={0.75}
          onPress={() => setIsChatListVisible(true)}
        >
          <Image source={require('./asset/chatIMG.png')} style={styles.mapChatIcon} />
          {hasUnreadChat ? <View style={styles.mapChatUnreadBadge} /> : null}
        </TouchableOpacity>

        {/* 🗺️ 내 위치와 친구 위치 */}
        <MapView
          ref={mapRef}
          style={styles.map}
          region={region}
          googleRenderer="LEGACY"
          showsUserLocation
          onPress={() => setSelectedFriend(null)}
        >
          {/* ⭐ 내 위치 아이콘: 친구와 같은 프로필 형태이며 빨간색으로 표시 */}

          {/* 내 위치 아이콘: 빨간색 프로필 마커 */}
          {myLocation && (
            <Marker
              key={`me-${profileImage || 'default'}`}
              coordinate={myLocation}
              tracksViewChanges={true}
              anchor={{
                x: 0.5,
                y: 1,
              }}
            >
              <View
                collapsable={false}
                renderToHardwareTextureAndroid
                style={styles.friendMapMarker}
              >
                <View
                  collapsable={false}
                  renderToHardwareTextureAndroid
                  style={[styles.friendMarkerProfile, styles.myMarkerProfile]}
                >
                  <Image
                    source={
                      profileImage
                        ? {
                            uri: profileImage,
                          }
                        : require('./asset/defaultImage.png')
                    }
                    style={styles.friendMarkerProfileImage}
                    fadeDuration={0}
                  />

                  <View style={styles.friendMarkerNameOverlay}>
                    <Text
                      style={styles.friendMarkerNameText}
                      numberOfLines={1}
                      adjustsFontSizeToFit
                      minimumFontScale={0.55}
                    >
                      나
                    </Text>
                  </View>
                </View>
              </View>
            </Marker>
          )}

          {/* ⭐ 저장된 친구들의 실시간 위치 아이콘 */}
          {friendList
            .filter((friend) => friend.location && friend.sharing !== false)
            .map((friend) => (
              <Marker
                key={`friend-list-marker-${friend.code}-${friend.profileImageUrl || 'default'}`}
                coordinate={getDisplayedFriendLocation(friend.location, friend.code, friend.name)}
                tracksViewChanges={true}
                anchor={{
                  x: 0.5,
                  y: 1,
                }}
                stopPropagation
                onPress={() => openFriendDetail(friend)}
              >
                <View
                  collapsable={false}
                  renderToHardwareTextureAndroid
                  style={styles.friendMapMarker}
                >
                  <View
                    collapsable={false}
                    renderToHardwareTextureAndroid
                    style={styles.friendMarkerProfile}
                  >
                    <Image
                      source={
                        friend.profileImageUrl
                          ? {
                              uri: friend.profileImageUrl,
                            }
                          : require('./asset/defaultImage.png')
                      }
                      style={styles.friendMarkerProfileImage}
                      fadeDuration={0}
                    />
                    <View style={styles.friendMarkerNameOverlay}>
                      <Text
                        style={styles.friendMarkerNameText}
                        numberOfLines={1}
                        adjustsFontSizeToFit
                        minimumFontScale={0.55}
                      >
                        {friend.name || '익명가치'}
                      </Text>
                    </View>
                  </View>
                </View>
              </Marker>
            ))}

          {/* 친구 목록이 아직 준비되지 않았을 때 기존 실시간 구독 위치를 표시 */}
          {friendList.length === 0 && friendLocation && (
            <Marker
              key={`friend-${friendCode}-${friendName}`}
              coordinate={displayedFriendLocation}
              anchor={{
                x: 0.5,
                y: 1,
              }}
              tracksViewChanges={true}
              stopPropagation
              onPress={() => {
                openFriendDetail({
                  code: friendCode,
                  name: friendName,
                  profileImageUrl: friendProfileImageUrl,
                  location: friendLocation,
                  speed: friendSpeed,
                  sharing: true,
                });
              }}
            >
              <View
                collapsable={false}
                renderToHardwareTextureAndroid
                style={styles.friendMapMarker}
              >
                {/* 친구 이름을 프로필 사진 내부에 표시합니다. */}
                <View
                  collapsable={false}
                  renderToHardwareTextureAndroid
                  style={styles.friendMarkerProfile}
                >
                  <Image
                    source={
                      friendProfileImageUrl
                        ? {
                            uri: friendProfileImageUrl,
                          }
                        : require('./asset/defaultImage.png')
                    }
                    style={styles.friendMarkerProfileImage}
                    fadeDuration={0}
                  />
                  <View style={styles.friendMarkerNameOverlay}>
                    <Text
                      style={styles.friendMarkerNameText}
                      numberOfLines={1}
                      adjustsFontSizeToFit
                      minimumFontScale={0.55}
                    >
                      {friendName || '익명가치'}
                    </Text>
                  </View>
                </View>
              </View>
            </Marker>
          )}
        </MapView>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.mapFriendList}
          contentContainerStyle={styles.mapFriendListContent}
        >
          {/* ⭐ 내 아이콘은 친구 목록의 맨 앞에 표시하고 이름 영역만 빨간색으로 구분합니다. */}
          <TouchableOpacity style={styles.mapFriendButton} onPress={moveToMyLocation}>
            <Image
              source={
                profileImage
                  ? {
                      uri: profileImage,
                    }
                  : require('./asset/defaultImage.png')
              }
              style={styles.mapFriendImage}
            />
            <View style={[styles.mapFriendNameOverlay, styles.mapMyNameOverlay]}>
              <Text
                style={styles.mapFriendNameText}
                numberOfLines={1}
                adjustsFontSizeToFit
                minimumFontScale={0.5}
              >
                {savedName || '나'}
              </Text>
            </View>
          </TouchableOpacity>

          {friendList.map((friend) => (
            <TouchableOpacity
              key={friend.code}
              style={styles.mapFriendButton}
              onPress={() => openFriendDetail(friend)}
            >
              <Image
                source={
                  friend.profileImageUrl
                    ? {
                        uri: friend.profileImageUrl,
                      }
                    : require('./asset/defaultImage.png')
                }
                style={styles.mapFriendImage}
              />
              <View style={styles.mapFriendNameOverlay}>
                <Text
                  style={styles.mapFriendNameText}
                  numberOfLines={1}
                  adjustsFontSizeToFit
                  minimumFontScale={0.5}
                >
                  {friend.name || '익명가치'}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {selectedFriend ? (
          <View style={styles.friendPanelDetail}>
            <TouchableOpacity
              style={styles.friendPanelClose}
              onPress={() => setSelectedFriend(null)}
            >
              <Text style={styles.friendPanelCloseText}>닫기</Text>
            </TouchableOpacity>

            <View style={styles.friendDetailProfileColumn}>
              <Image
                source={
                  selectedFriend.profileImageUrl
                    ? {
                        uri: selectedFriend.profileImageUrl,
                      }
                    : require('./asset/defaultImage.png')
                }
                style={styles.friendDetailImage}
              />
              <TouchableOpacity
                style={styles.friendChatButton}
                onPress={() => {
                  saveChatCode(selectedFriend.code).catch(() => {});
                  setChatFriend(selectedFriend);
                }}
              >
                <Text style={styles.friendChatButtonText}>채팅하기</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.friendPanelText}>
              <Text style={styles.friendDetailName}>{selectedFriend.name || '익명가치'}</Text>
              <Text style={styles.friendDetailValue}>{selectedFriendAddress}</Text>

              <Text
                style={[
                  styles.friendDetailSpeed,
                  (!selectedFriend.location || selectedFriend.sharing === false) &&
                    styles.hiddenFriendSpeed,
                ]}
              >
                {`${selectedFriend.speed >= 3 ? Math.round(selectedFriend.speed) : 0} km/h`}
              </Text>
            </View>
          </View>
        ) : null}

        <Modal
          visible={isChatListVisible}
          animationType="slide"
          presentationStyle="fullScreen"
          onRequestClose={() => setIsChatListVisible(false)}
        >
          <ChatListScreen
            friends={chatFriends}
            myCode={myCode}
            hiddenChats={hiddenChats}
            onDeleteChat={hideChat}
            onClose={() => setIsChatListVisible(false)}
            onSelectFriend={(friend) => {
              setIsChatListVisible(false);
              saveChatCode(friend.code).catch(() => {});
              setChatFriend(friend);
            }}
          />
        </Modal>

        <Modal
          visible={chatFriend !== null}
          animationType="slide"
          presentationStyle="fullScreen"
          onRequestClose={() => setChatFriend(null)}
        >
          {chatFriend ? (
            <ChatScreen
              user={user}
              myCode={myCode}
              friend={chatFriend}
              hiddenBefore={Number(hiddenChats[chatFriend.code] || 0)}
              onClose={() => setChatFriend(null)}
            />
          ) : null}
        </Modal>

        {/* 🪟 접고 펼칠 수 있는 내 정보창 */}
        <Animated.View
          style={[
            styles.bottomSheet,
            {
              height: panelHeight,
              transform: [
                {
                  translateY: panelTranslateY,
                },
              ],
            },
          ]}
        >
          <View style={styles.dragHandleArea} {...panelResponder.panHandlers}>
            <View style={styles.dragHandle} />
          </View>

          <ScrollView
            style={styles.panel}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="interactive"
            contentContainerStyle={styles.panelContent}
          >
            {/* 📸 프로필 사진 */}
            <TouchableOpacity style={styles.profileArea} onPress={pickProfileImage}>
              {profileImage ? (
                <Image
                  source={{
                    uri: profileImage,
                  }}
                  style={styles.profileImage}
                />
              ) : (
                <View style={styles.profilePlaceholder}>
                  <Text style={styles.profilePlaceholderText}>사진 추가</Text>
                </View>
              )}
            </TouchableOpacity>

            {/* 👤 처음에는 저장만, 저장 후에는 저장과 수정 표시 */}
            <Text style={styles.label}>내 이름</Text>
            <View style={styles.inputRow}>
              <TextInput
                style={[styles.input, !isEditingName && styles.inputDisabled]}
                value={myName}
                onChangeText={setMyName}
                placeholder="예: 홍길동"
                editable={isEditingName}
              />
              <TouchableOpacity style={styles.button} onPress={saveMyName}>
                <Text style={styles.buttonText}>저장</Text>
              </TouchableOpacity>
              {savedName ? (
                <TouchableOpacity style={styles.button} onPress={confirmEditName}>
                  <Text style={styles.buttonText}>수정</Text>
                </TouchableOpacity>
              ) : null}
            </View>

            {/* 🔑 계정에 고정 저장되는 내 공유코드 */}
            <Text style={[styles.label, styles.sectionGap]}>내 공유 코드</Text>

            <View style={styles.codeShareRow}>
              <Text style={styles.code}>{myCode || '불러오는 중'}</Text>

              <View style={styles.codeShareControl}>
                <Text style={styles.codeShareText}>공유</Text>
                <Switch value={sharing} onValueChange={changeSharing} />
              </View>
            </View>
            <Text style={styles.help}>이 코드를 위치를 공유할 사람에게 알려주세요.</Text>

            {/* 🤝 친구 공유코드 입력 */}
            <Text style={[styles.label, styles.sectionGap]}>친구 공유 코드</Text>
            <View style={styles.inputRow}>
              <TextInput
                style={styles.input}
                value={friendCode}
                onChangeText={setFriendCode}
                placeholder="예: A7K2PQ"
                autoCapitalize="characters"
                maxLength={6}
                returnKeyType="done"
              />
              <TouchableOpacity style={styles.button} onPress={connectFriend}>
                <Text style={styles.buttonText}>추가</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, styles.friendListButton]}
                onPress={() => setIsFriendListVisible(true)}
              >
                <Text style={styles.buttonText}>친구 목록</Text>
                {incomingFriendRequests.length > 0 ? (
                  <View style={styles.friendRequestBadge} />
                ) : null}
              </TouchableOpacity>
            </View>
            {savedFriends.length > 0 ? (
              <Text style={styles.help}>저장된 친구코드: {savedFriends.join(', ')}</Text>
            ) : null}

            {/* ℹ️ 위치 및 연결 상태 */}
            <View style={styles.statusBox}>
              <Text style={styles.status}>{status}</Text>
            </View>

            {/* 개인정보 화면의 가장 아래에 로그아웃 버튼을 표시합니다. */}
            <TouchableOpacity style={styles.panelLogoutButton} onPress={logout}>
              <Text style={styles.panelLogoutButtonText}>로그아웃</Text>
            </TouchableOpacity>
          </ScrollView>
        </Animated.View>

        <Modal
          visible={isFriendListVisible}
          transparent
          animationType="slide"
          onRequestClose={() => setIsFriendListVisible(false)}
        >
          <View style={styles.friendModalBackdrop}>
            <SafeAreaView style={styles.friendModalCard}>
              <View style={styles.friendModalHeader}>
                <Text style={styles.friendModalTitle}>친구 목록</Text>
                <TouchableOpacity onPress={() => setIsFriendListVisible(false)}>
                  <Text style={styles.friendModalClose}>닫기</Text>
                </TouchableOpacity>
              </View>

              <ScrollView contentContainerStyle={styles.friendListContent}>
                <Text style={styles.friendRequestSectionTitle}>친구 요청</Text>
                {incomingFriendRequests.length === 0 ? (
                  <Text style={styles.friendRequestEmptyText}>받은 친구 요청이 없습니다.</Text>
                ) : (
                  incomingFriendRequests.map((request) => (
                    <View key={request.id} style={styles.friendRequestItem}>
                      <View style={styles.friendListInfo}>
                        <Text style={styles.friendListName}>{request.fromName || '익명가치'}</Text>
                        <Text style={styles.friendListCode}>{request.fromCode}</Text>
                      </View>

                      <TouchableOpacity
                        style={styles.friendAcceptButton}
                        onPress={() => respondToFriendRequest(request.ref, request, true)}
                      >
                        <Text style={styles.friendActionText}>수락</Text>
                      </TouchableOpacity>

                      <Text style={styles.friendRequestDivider}>|</Text>

                      <TouchableOpacity
                        style={styles.friendRejectButton}
                        onPress={() => respondToFriendRequest(request.ref, request, false)}
                      >
                        <Text style={styles.friendActionText}>거부</Text>
                      </TouchableOpacity>
                    </View>
                  ))
                )}

                <Text style={styles.savedFriendSectionTitle}>등록된 친구</Text>
                {friendList.length === 0 ? (
                  <Text style={styles.friendEmptyText}>추가된 친구가 없습니다.</Text>
                ) : (
                  friendList.map((friend) => (
                    <View key={friend.code} style={styles.friendListItem}>
                      <View style={styles.friendListInfo}>
                        <Text style={styles.friendListName}>{friend.name || '익명가치'}</Text>
                        <Text style={styles.friendListCode}>{friend.code}</Text>
                      </View>

                      <TouchableOpacity
                        style={styles.friendViewButton}
                        onPress={() => {
                          setFriendCode(friend.code);
                          if (friendUnsubscribeRef.current) {
                            friendUnsubscribeRef.current();
                          }
                          friendUnsubscribeRef.current = subscribeToFriend(friend.code, false);
                          setIsFriendListVisible(false);
                        }}
                      >
                        <Text style={styles.friendActionText}>보기</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={styles.friendDeleteButton}
                        onPress={() => confirmDeleteFriend(friend.code)}
                      >
                        <Text style={styles.friendActionText}>삭제</Text>
                      </TouchableOpacity>
                    </View>
                  ))
                )}
              </ScrollView>
            </SafeAreaView>
          </View>
        </Modal>
      </KeyboardAvoidingView>
    </View>
  );
}

// iPhone과 Android에서 동일한 안전영역 계산을 사용하는 공통 진입점입니다.
export default function App() {
  return (
    <SafeAreaProvider>
      <AppContent />
    </SafeAreaProvider>
  );
}

// =====================================================
// 🎨 화면 디자인
// =====================================================
const styles = StyleSheet.create({
  startupScreen: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  startupImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  dragHandleArea: {
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dragHandle: {
    width: 45,
    height: 5,
    borderRadius: 10,
    backgroundColor: '#bbb',
  },
  rememberEmailRow: {
    width: '80%',
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 50,
  },
  rememberEmailCheckbox: {
    width: 22,
    height: 22,
    marginRight: 9,
    borderWidth: 2,
    borderColor: '#999',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  rememberEmailCheckmark: {
    color: '#222',
    fontSize: 15,
    fontWeight: '900',
  },
  rememberEmailText: {
    color: '#222',
    fontSize: 14,
    fontWeight: '700',
  },
  // 🧱 공통 화면과 로딩 화면
  container: {
    flex: 1,
    backgroundColor: '#f7f7fb',
  },
  centerScreen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f7f7fb',
  },
  loadingText: {
    color: '#555',
    fontSize: 15,
  },
  // 🔐 로그인, 회원가입, 계정 확인 화면
  authContainer: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
    backgroundColor: '#f7f7fb',
  },
  authTitle: {
    fontSize: 32,
    fontWeight: '900',
    textAlign: 'center',
  },
  signUpTitle: {
    marginBottom: 24,
  },
  authDescription: {
    marginTop: 8,
    marginBottom: 24,
    color: '#666',
    textAlign: 'center',
  },
  authInput: {
    height: 50,
    marginBottom: 12,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.65)',
    fontSize: 16,
  },
  authButton: {
    width: '80%',
    alignSelf: 'center',
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    backgroundColor: '#222',
  },
  authButtonText: {
    color: 'white',
    fontWeight: '800',
  },
  signUpButton: {
    width: '80%',
    alignSelf: 'center',
    height: 50,
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#222',
    borderRadius: 12,
  },
  signUpButtonText: {
    color: '#222',
    fontWeight: '800',
  },
  accountHelpRow: {
    marginTop: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  accountHelpText: {
    color: '#555',
    fontSize: 13,
    fontWeight: '700',
  },
  accountHelpDivider: {
    marginHorizontal: 12,
    color: '#bbb',
  },
  guideBox: {
    padding: 18,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    backgroundColor: 'white',
  },
  guideTitle: {
    fontSize: 16,
    fontWeight: '800',
  },
  guideText: {
    marginTop: 10,
    fontSize: 14,
    lineHeight: 22,
    color: '#555',
  },
  verificationStatusText: {
    width: '80%',
    alignSelf: 'center',
    marginBottom: 50,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '800',
  },
  verifiedText: {
    color: '#16a34a',
    fontWeight: '800',
  },
  verificationPendingText: {
    color: '#d97706',
    fontWeight: '800',
  },
  verificationRequiredText: {
    color: '#555',
    fontWeight: '800',
  },
  completeButton: {
    width: '80%',
    alignSelf: 'center',
    height: 50,
    marginTop: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    backgroundColor: '#222',
  },
  disabledButton: {
    backgroundColor: '#aaa',
  },
  // 🗺️ 지도 영역
  map: {
    flex: 1,
  },
  mapChatButton: {
    position: 'absolute',
    top: 52,
    right: 16,
    zIndex: 20,
    elevation: 20,
    width: 54,
    height: 54,
    borderRadius: 27,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.88)',
  },
  mapChatIcon: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
  mapChatUnreadBadge: {
    position: 'absolute',
    top: 1,
    right: 1,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#ef4444',
  },
  // 🗺️ 위치 공유 컨트롤
  codeShareRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  codeShareControl: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 12,
  },
  codeShareText: {
    marginRight: 5,
    color: '#555',
    fontSize: 13,
    fontWeight: '700',
  },
  // 👥 지도에 표시되는 친구 프로필
  mapFriendImage: {
    width: 42,
    height: 42,
    borderRadius: 21,
    resizeMode: 'cover',
  },
  friendMarkerProfile: {
    width: 68,
    height: 68,
    borderRadius: 34,
    borderWidth: 3,
    borderColor: '#3b82f6',
    backgroundColor: '#eee',
    overflow: 'hidden',
  },
  myMarkerProfile: {
    borderColor: '#ef4444',
  },
  friendMarkerProfileImage: {
    width: 62,
    height: 62,
    borderRadius: 31,
    resizeMode: 'cover',
  },
  friendMarkerNameOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 22,
    paddingHorizontal: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.62)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  friendMarkerNameText: {
    width: '100%',
    color: 'white',
    fontSize: 11,
    fontWeight: '900',
    textAlign: 'center',
  },
  // 🚶 선택한 친구의 위치와 이동속도 하단창
  friendPanelDetail: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 40,
    elevation: 40,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 22,
    paddingTop: 32,
    paddingBottom: 28,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.70)',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 12,
    shadowOffset: {
      width: 0,
      height: -4,
    },
  },
  friendPanelText: {
    flex: 1,
    marginLeft: 16,
  },
  friendPanelClose: {
    position: 'absolute',
    top: 10,
    right: 16,
    paddingHorizontal: 8,
    paddingVertical: 5,
  },
  friendPanelCloseText: {
    color: '#666',
    fontSize: 13,
    fontWeight: '700',
  },
  friendDetailImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#ddd',
  },
  friendDetailProfileColumn: {
    alignItems: 'center',
    transform: [{ translateY: -20 }],
  },
  friendDetailName: {
    fontSize: 22,
    fontWeight: '900',
  },
  friendDetailValue: {
    marginTop: 5,
    color: '#222',
    fontSize: 15,
  },
  friendDetailSpeed: {
    marginTop: 5,
    color: '#2563eb',
    fontSize: 28,
    fontWeight: '900',
  },
  friendChatButton: {
    marginTop: 8,
    paddingHorizontal: 13,
    paddingVertical: 7,
    borderRadius: 16,
    backgroundColor: '#222',
  },
  friendChatButtonText: {
    color: 'white',
    fontSize: 13,
    fontWeight: '800',
  },
  // ===================================================
  // ⭐ 지도 닉네임 핀 디자인
  // ===================================================

  // ⭐ 이름 상자와 위치 점을 세로로 정렬합니다.

  hiddenFriendSpeed: {
    opacity: 0,
  },
  friendMapMarker: {
    width: 76,
    height: 76,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'visible',
  },
  mapFriendList: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 180,
    height: 50,
    zIndex: 26,
    elevation: 26,
  },
  mapFriendListContent: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  mapFriendButton: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#eee',
    borderWidth: 2,
    borderColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  mapFriendNameOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 16,
    paddingHorizontal: 2,
    backgroundColor: 'rgba(0, 0, 0, 0.62)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapMyNameOverlay: {
    backgroundColor: 'rgba(239, 68, 68, 0.86)',
  },
  mapFriendNameText: {
    width: '100%',
    color: 'white',
    fontSize: 8,
    fontWeight: '900',
    textAlign: 'center',
  },
  // 👤 내 개인정보를 표시하는 창
  bottomSheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 12,
    shadowOffset: {
      width: 0,
      height: -4,
    },
    elevation: 30,
    zIndex: 30,
  },
  panel: {
    flex: 1,
  },
  // 이 paddingTop 하나로 제목부터 아래의 모든 개인정보를 함께 이동합니다.
  panelContent: {
    paddingTop: 80,
    paddingHorizontal: 18,
    paddingBottom: 35,
  },
  profileArea: {
    alignItems: 'center',
    marginBottom: 16,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    resizeMode: 'contain',
    backgroundColor: '#eee',
  },
  profilePlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#eee',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profilePlaceholderText: {
    fontSize: 12,
    color: '#666',
  },
  label: {
    fontSize: 13,
    color: '#666',
    fontWeight: '700',
  },
  sectionGap: {
    marginTop: 16,
  },
  code: {
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: 5,
    marginTop: 4,
  },
  help: {
    marginTop: 4,
    fontSize: 12,
    color: '#888',
  },
  inputRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 7,
  },
  input: {
    flex: 1,
    minWidth: 0,
    height: 46,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    paddingHorizontal: 14,
    fontSize: 16,
  },
  inputDisabled: {
    backgroundColor: '#f2f2f2',
    color: '#666',
  },
  button: {
    height: 46,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: '#222',
    alignItems: 'center',
    justifyContent: 'center',
  },
  friendListButton: {
    position: 'relative',
  },
  friendRequestBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 12,
    height: 12,
    borderWidth: 2,
    borderColor: 'white',
    borderRadius: 6,
    backgroundColor: '#ef4444',
  },
  buttonText: {
    color: 'white',
    fontWeight: '800',
  },
  panelLogoutButton: {
    alignSelf: 'center',
    marginTop: 100,
    marginBottom: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  panelLogoutButtonText: {
    color: '#666',
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
  },
  // 🤝 저장된 친구 목록 모달
  friendModalBackdrop: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
  },
  friendModalCard: {
    maxHeight: '75%',
    backgroundColor: 'white',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 8,
  },
  friendModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  friendModalTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#222',
  },
  friendModalClose: {
    fontSize: 15,
    fontWeight: '700',
    color: '#555',
  },
  friendListContent: {
    padding: 16,
    paddingBottom: 30,
  },
  friendEmptyText: {
    paddingVertical: 40,
    textAlign: 'center',
    color: '#888',
  },
  friendRequestSectionTitle: {
    marginBottom: 8,
    fontSize: 16,
    fontWeight: '900',
    color: '#222',
  },
  friendRequestEmptyText: {
    paddingVertical: 18,
    textAlign: 'center',
    color: '#888',
  },
  friendRequestItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  friendAcceptButton: {
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 10,
    backgroundColor: '#222',
  },
  friendRejectButton: {
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 10,
    backgroundColor: '#ef4444',
  },
  friendRequestDivider: {
    color: '#bbb',
    fontWeight: '700',
  },
  savedFriendSectionTitle: {
    marginTop: 24,
    marginBottom: 8,
    fontSize: 16,
    fontWeight: '900',
    color: '#222',
  },
  friendListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  friendListInfo: {
    flex: 1,
  },
  friendListName: {
    fontSize: 16,
    fontWeight: '800',
    color: '#222',
  },
  friendListCode: {
    marginTop: 3,
    fontSize: 12,
    color: '#888',
  },
  friendViewButton: {
    paddingHorizontal: 13,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: '#222',
  },
  friendDeleteButton: {
    paddingHorizontal: 13,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: '#ef4444',
  },
  friendActionText: {
    color: 'white',
    fontWeight: '800',
  },
  statusBox: {
    marginTop: 12,
    padding: 11,
    backgroundColor: '#f3f3f8',
    borderRadius: 10,
  },
  status: {
    fontSize: 12,
    color: '#555',
  },
});
