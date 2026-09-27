# 도와줘 위치공유 앱 - 테스트용 MVP

이 프로젝트는 Expo + React Native + Firebase Cloud Firestore로 만든 위치공유 테스트 앱입니다.

## 들어있는 기능
- 휴대폰 현재 위치 표시
- 6자리 내 공유 코드 자동 생성
- 내 위치를 Firebase에 주기적으로 저장
- 상대방 공유 코드를 입력하면 상대 위치 실시간 표시
- 위치공유 ON/OFF
- SOS 버튼으로 현재 좌표 확인

## 1. 준비
PC에 Node.js LTS와 VS Code를 설치하고,
휴대폰에는 Expo Go를 설치합니다.

## 2. Firebase 만들기
1. Firebase Console에서 새 프로젝트 생성
2. Cloud Firestore 데이터베이스 생성
3. 프로젝트 설정 > 내 앱 > 웹 앱 추가
4. firebaseConfig 값을 복사
5. 이 폴더의 `firebase.js` 안의 `여기에_...` 값을 실제 값으로 교체

## 3. 테스트용 Firestore 규칙
처음 테스트할 때만 `firestore.rules.demo.txt` 내용을 Firestore Rules에 붙여넣어 사용할 수 있습니다.

주의: 이 규칙은 누구나 읽고 쓸 수 있는 개발용 규칙입니다.
실제 배포 전에는 반드시 로그인/인증 기반 보안 규칙으로 교체해야 합니다.

## 4. 실행
VS Code에서 이 폴더를 연 뒤 터미널에서:

npm install
npx expo start

화면의 QR 코드를 휴대폰 Expo Go로 실행합니다.

## 5. 두 기기에서 위치 공유 테스트
- 휴대폰 A에 표시된 6자리 코드를 휴대폰 B의 '상대방 공유 코드'에 입력
- 휴대폰 B에서 '위치 보기' 선택
- 반대로도 연결하고 싶다면 B의 코드를 A에도 입력

## 현재 버전 제한
- 앱이 열린 동안의 전경 위치 공유 중심
- 회원가입/친구 승인 기능 없음
- 공유 코드를 아는 사람이 데이터에 접근할 수 있는 테스트 구조
- 실제 배포용 백그라운드 위치공유/SOS 푸시 알림은 Development Build와 보안 설계가 추가로 필요

다음 개발 단계:
1. Firebase Authentication 로그인
2. 친구 초대/수락
3. 사용자별 접근 권한
4. 백그라운드 위치 업데이트
5. SOS 푸시 알림
6. 위치 공유 시간 설정
