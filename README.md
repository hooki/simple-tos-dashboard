# TOS Simple Dashboard

TOS 스테이킹 정보와 Runway 데이터를 모니터링하는 대시보드입니다.

## 기술 스택

- **Bun** - JavaScript 런타임 & 패키지 매니저
- **Rsbuild** - 빌드 툴
- **React 18** - UI 라이브러리
- **Viem** - Ethereum 인터랙션
- **Tailwind CSS** - 스타일링

## 주요 기능

✅ **Runway 정보**
- 남은 이자 총량 (Runway TOS)
- LTOS 토큰 총량
- 이자 지급 기간 및 마지막 지급 시기 계산

✅ **스테이킹 정보**
- 여러 주소의 스테이킹 총량 조회
- Claimable ETH 계산
- 주소별 상세 정보 테이블

✅ **주소 관리**
- 주소 추가/삭제
- 주소 유효성 검증
- LocalStorage에 저장 (새로고침 시 유지)

## 설치 및 실행

```bash
# 의존성 설치
bun install

# 개발 서버 실행
bun run dev

# 프로덕션 빌드
bun run build

# 빌드 결과 미리보기
bun run preview
```

## 컨트랙트 주소

- **Staking Contract**: `0x14fb0933Ec45ecE75A431D10AFAa1DDF7BfeE44C`
- **Claimable Contract**: `0xD27A68a457005f822863199Af0F817f672588ad6`

## 프로젝트 구조

```
tos-lens/
├── src/
│   ├── hooks/
│   │   └── useContracts.js      # Viem 클라이언트 & 컨트랙트 호출
│   ├── components/
│   │   ├── RunwayCard.jsx       # Runway 정보 카드
│   │   ├── StakingCard.jsx      # 스테이킹 정보 카드
│   │   ├── AddressManager.jsx   # 주소 입력/관리
│   │   └── AddressTable.jsx     # 주소별 상세 테이블
│   ├── App.jsx                  # 메인 앱
│   ├── index.jsx                # 엔트리포인트
│   └── index.css                # Tailwind CSS
├── rsbuild.config.js
├── tailwind.config.js
└── package.json
```

## 라이선스

MIT
