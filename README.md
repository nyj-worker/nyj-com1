# 🏢 남양주시 기업현황 스마트 인사이트 대시보드 (Company Pulse)

> **경기도 남양주시 소재 33,559개 기업 데이터셋을 일목요연하게 탐색하고 분석하는 고성능 벤토 그리드(Bento Grid) 빅데이터 대시보드**

[![GitHub Pages Deployment](https://img.shields.io/badge/GitHub%20Pages-Live%20Demo-2ea44f?style=flat&logo=github)](https://nyj-worker.github.io/nyj-com1/)
[![License](https://img.shields.io/badge/License-Private%20Proprietary-blue.svg)](#)
[![Theme](https://img.shields.io/badge/Design%20System-Google%20DeepMind%20Slate-0ea5e9.svg)](#)

---

## 🌐 온라인 바로가기 (Web Live Demo)

인터넷이 연결된 브라우저(Chrome, Edge, Safari 등)에서 언제 어디서나 접속할 수 있습니다.

- **웹 대시보드 URL**: [https://nyj-worker.github.io/nyj-com1/](https://nyj-worker.github.io/nyj-com1/)
- **기본 접속 인증 비밀번호**: `2026` (또는 `nyj2026`)

---

## ✨ 핵심 기능 (Key Features)

### 1. ⚡ 초고속 33,559개 기업 데이터 병렬 인덱싱
- 전체 약 17MB의 방대한 JSON 데이터를 6개 파트(`companies_part1.json` ~ `part6.json`)로 최적 분할하여 브라우저에서 병렬(Promise.all) 다운로드
- 프로그레스 링 & 퍼센트 인디케이터를 통한 로딩 현황 시각화
- 가상화 무한 스크롤(IntersectionObserver) 기반 청크 렌더링으로 수만 건의 데이터도 버벅임 없이 렌더링

### 2. 🗂️ 다차원 스마트 필터 & 즉시 검색
- **통합 검색**: 기업명, 대표자명, 주소, 주요 업종 키워드 실시간 디바운스 검색
- **지역별 필터**: 남양주시 16개 읍·면·동 퀵 태그 원클릭 필터링 (화도읍, 진접읍, 와부읍, 다산동 등)
- **규모별 필터**: 소기업, 중기업, 중견기업, 대기업, 기타
- **인증 칩 필터**: 벤처기업, 이노비즈, 메인비즈, ISO 인증, 유망중소기업 등 다중 조건 선택
- **정렬 옵션**: 매출액 순, 종업원 수 순, 설립일자 순, 기업명 순 등 6종 정렬

### 3. 📊 인터랙티브 카드 & 테이블 듀얼 뷰 (Dual View)
- **카드 뷰 (Card View)**: 직관적인 비즈니스 메트릭, 재무 뱃지, 태그가 어우러진 현대적인 카드 형태
- **테이블 뷰 (Table View)**: 대량의 기업 리스트를 한눈에 비교할 수 있는 콤팩트 데이터 그리드

### 4. 🔍 기업 상세 인텔리전스 모달 & 3개년 재무 추이 시각화
- 선택한 기업의 대표자, 설립일, 자본금, 종업원 수, 평균연봉, 채용/퇴사 현황 종합 조회
- **Chart.js** 기반의 최근 3개년 매출액 및 영업이익 추이 시각화 그래프
- 도로명/지번 주소 확인 및 네이버 지도 / 카카오맵 원클릭 길찾기 연동
- 모달 내 화면 확대/축소(80% ~ 140%) 및 전체화면(Fullscreen) 토글 지원

### 5. 🎨 Google DeepMind Intelligence Slate 테마 & 토스 라이트 테마
- 고도화된 다크 모드(DeepMind Slate) 및 산뜻한 토스 라이트(Light) 테마 지원
- 실시간 테마 변경 및 사용자 브라우저 `localStorage` 자동 기억

---

## 📁 프로젝트 파일 구조

```text
nyj-com1/
├── index.html              # 메인 HTML (벤토 그리드 구조, 모달, 로그인 게이트)
├── style.css               # 디자인 시스템 및 테마 스타일시트
├── app.js                  # 프론트엔드 전체 데이터 제어 및 이벤트 컨트롤러
├── meta_summary.json       # 읍면동/산업군 분류 및 KPI 메타 요약 데이터
├── companies_part1.json    # 분할 기업 데이터 파트 1 (약 5,600개사)
├── companies_part2.json    # 분할 기업 데이터 파트 2 (약 5,600개사)
├── companies_part3.json    # 분할 기업 데이터 파트 3 (약 5,600개사)
├── companies_part4.json    # 분할 기업 데이터 파트 4 (약 5,600개사)
├── companies_part5.json    # 분할 기업 데이터 파트 5 (약 5,600개사)
├── companies_part6.json    # 분할 기업 데이터 파트 6 (약 5,600개사)
├── insights_data.json      # 주요 산업/기업 분석 인사이트 요약
├── *.png                   # 로고 및 브랜드 이미지 자산
└── README.md               # 프로젝트 매뉴얼 (본 문서)
```

---

## 🛠️ 기술 스택 (Tech Stack)

- **Frontend**: HTML5, CSS3 (Vanilla CSS, Custom Properties), Vanilla JavaScript (ES6+)
- **Visuals & Charts**: Chart.js v4, FontAwesome 6, Pretendard Font
- **Hosting**: GitHub Pages
