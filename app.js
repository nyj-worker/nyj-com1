/**
 * ==========================================================================
 * Company Pulse - 남양주시 기업현황 스마트 인사이트 대시보드
 * 프론트엔드 핵심 컨트롤러 (HTML, CSS, 바닐라 JavaScript)
 * ==========================================================================
 */

// 1. 전역 상태 관리 객체 (State Management)
const state = {
  allCompanies: [],        // 33,559개 전체 기업 원본 배열
  meta: null,              // 메타 서머리 통계 및 분류 정보
  filteredCompanies: [],   // 현재 검색·필터 조건이 적용된 결과 배열
  renderedCount: 0,        // 현재 화면에 렌더링된 카드/행 개수
  pageSize: 36,            // 1회 렌더링할 청크 크기 (36개씩 렉 없이 렌더링)
  
  // 뷰 모드 ('card' 또는 'table')
  viewMode: 'card',

  // 테마 상태 ('slate' 다크 모드 또는 'light' 라이트 모드)
  currentTheme: localStorage.getItem('company_pulse_theme') || 'slate',

  // 필터 및 정렬 상태
  searchKeyword: '',
  selectedPreset: 'all',
  selectedDong: 'all',
  selectedIndustry: 'all',
  selectedScale: 'all',
  selectedCerts: new Set(),
  sortBy: 'rev-desc',

  // UI 제어 상태
  currentModalCompany: null,
  financialChartInstance: null,
  modalZoomLevel: 100,     // 모달 확대 비율 (80% ~ 140%)
  isFullscreen: false
};

// 2. DOM 요소 캐싱 (DOM Cache)
const elements = {
  // 로그인 게이트 (DeepMind Intelligence Slate)
  loginGateOverlay: document.getElementById('loginGateOverlay'),
  loginCard: document.getElementById('loginCard'),
  loginForm: document.getElementById('loginForm'),
  loginPasswordInput: document.getElementById('loginPasswordInput'),
  togglePasswordVisibilityBtn: document.getElementById('togglePasswordVisibilityBtn'),
  togglePasswordEyeIcon: document.getElementById('togglePasswordEyeIcon'),
  loginErrorMessage: document.getElementById('loginErrorMessage'),
  loginErrorText: document.getElementById('loginErrorText'),
  loginSubmitBtn: document.getElementById('loginSubmitBtn'),
  logoutBtn: document.getElementById('logoutBtn'),

  // 로더
  loadingOverlay: document.getElementById('loadingOverlay'),
  loadingProgressBar: document.getElementById('loadingProgressBar'),
  loadingStatusText: document.getElementById('loadingStatusText'),

  // 사이드바 & 헤더
  sidebar: document.getElementById('sidebar'),
  sidebarOverlay: document.getElementById('sidebarOverlay'),
  mobileMenuBtn: document.getElementById('mobileMenuBtn'),
  closeSidebarBtn: document.getElementById('closeSidebarBtn'),
  navItems: document.querySelectorAll('.nav-item'),
  navCountAll: document.getElementById('navCountAll'),
  quickDongTags: document.getElementById('quickDongTags'),
  resetAllFiltersBtn: document.getElementById('resetAllFiltersBtn'),
  themeToggleBtn: document.getElementById('themeToggleBtn'),
  themeIcon: document.getElementById('themeIcon'),
  themeLabel: document.getElementById('themeLabel'),
  keyInsightsBtn: document.getElementById('keyInsightsBtn'),
  resetSortBtn: document.getElementById('resetSortBtn'),
  insightsModal: document.getElementById('insightsModal'),
  closeInsightsModalBtn: document.getElementById('closeInsightsModalBtn'),

  // KPI 위젯
  kpiTotalCompanies: document.getElementById('kpiTotalCompanies'),
  kpiTotalEmployees: document.getElementById('kpiTotalEmployees'),
  kpiTotalRevenue: document.getElementById('kpiTotalRevenue'),
  kpiTotalCerts: document.getElementById('kpiTotalCerts'),

  // 검색 & 필터
  searchInput: document.getElementById('searchInput'),
  clearSearchBtn: document.getElementById('clearSearchBtn'),
  sortSelect: document.getElementById('sortSelect'),
  filterDong: document.getElementById('filterDong'),
  filterIndustry: document.getElementById('filterIndustry'),
  filterScale: document.getElementById('filterScale'),
  certCheckboxes: document.querySelectorAll('.cert-chips-group input[type="checkbox"]'),

  // 뷰 모드 토글 & 컨테이너
  btnViewCard: document.getElementById('btnViewCard'),
  btnViewTable: document.getElementById('btnViewTable'),
  companyGrid: document.getElementById('companyGrid'),
  companyTableWrapper: document.getElementById('companyTableWrapper'),
  companyTableBody: document.getElementById('companyTableBody'),
  filteredCount: document.getElementById('filteredCount'),
  renderedCountLabel: document.getElementById('renderedCountLabel'),
  scrollSentinel: document.getElementById('scrollSentinel'),
  sentinelLoader: document.getElementById('sentinelLoader'),
  emptyState: document.getElementById('emptyState'),
  emptyResetBtn: document.getElementById('emptyResetBtn'),

  // 플로팅 탑 버튼 & 프로그레스 링
  floatingTopBtn: document.getElementById('floatingTopBtn'),
  progressRingCircle: document.getElementById('progressRingCircle'),
  topPercentLabel: document.getElementById('topPercentLabel'),

  // 모달 컴포넌트
  detailModal: document.getElementById('detailModal'),
  modalContainer: document.getElementById('modalContainer'),
  modalZoomTarget: document.getElementById('modalZoomTarget'),
  closeModalBtn: document.getElementById('closeModalBtn'),
  fullscreenToggleBtn: document.getElementById('fullscreenToggleBtn'),
  fullscreenIcon: document.getElementById('fullscreenIcon'),
  zoomInBtn: document.getElementById('zoomInBtn'),
  zoomOutBtn: document.getElementById('zoomOutBtn'),
  zoomResetBtn: document.getElementById('zoomResetBtn'),
  zoomLevelText: document.getElementById('zoomLevelText'),

  // 모달 상세 필드들
  modalHeaderCompanyCode: document.getElementById('modalHeaderCompanyCode'),
  modalCompanyName: document.getElementById('modalCompanyName'),
  modalScaleBadge: document.getElementById('modalScaleBadge'),
  modalMarketBadge: document.getElementById('modalMarketBadge'),
  modalStatusBadge: document.getElementById('modalStatusBadge'),
  modalEarlyWarningBadge: document.getElementById('modalEarlyWarningBadge'),
  modalIndustryDesc: document.getElementById('modalIndustryDesc'),
  modalCeo: document.getElementById('modalCeo'),
  modalEstDate: document.getElementById('modalEstDate'),
  modalScaleDetail: document.getElementById('modalScaleDetail'),
  modalMarketDetail: document.getElementById('modalMarketDetail'),
  modalStatusDetail: document.getElementById('modalStatusDetail'),
  modalEmployees: document.getElementById('modalEmployees'),
  modalAvgSalary: document.getElementById('modalAvgSalary'),
  modalHired: document.getElementById('modalHired'),
  modalLeft: document.getElementById('modalLeft'),
  modalPatent: document.getElementById('modalPatent'),
  modalUtility: document.getElementById('modalUtility'),
  modalCertBadgesContainer: document.getElementById('modalCertBadgesContainer'),
  modalRoadAddress: document.getElementById('modalRoadAddress'),
  modalJibunAddress: document.getElementById('modalJibunAddress'),
  modalDongAddress: document.getElementById('modalDongAddress'),
  modalNaverMapBtn: document.getElementById('modalNaverMapBtn'),
  modalKakaoMapBtn: document.getElementById('modalKakaoMapBtn'),
  modalFinTableBody: document.getElementById('modalFinTableBody'),
  modalFinUnitLabel: document.getElementById('modalFinUnitLabel'),
  financialChart: document.getElementById('financialChart')
};

// 3. 유틸리티 함수 (Utility Functions)

/**
 * 재무제표 수치 포맷팅 (CSV 원본 단위: 천원)
 * 예: 1,258,734,635 (천원) -> 1조 2,587억 원
 */
function formatFinancial(amountInThousands) {
  if (!amountInThousands || amountInThousands === 0) return '0원';
  const isNegative = amountInThousands < 0;
  const absThousand = Math.abs(amountInThousands);
  // 실제 원화 금액 = 천원 * 1,000
  const won = absThousand * 1000;

  let formatted = '';
  if (won >= 1_000_000_000_000) {
    const jo = Math.floor(won / 1_000_000_000_000);
    const uk = Math.floor((won % 1_000_000_000_000) / 100_000_000);
    formatted = uk > 0 ? `${jo}조 ${uk.toLocaleString('ko-KR')}억 원` : `${jo}조 원`;
  } else if (won >= 100_000_000) {
    const uk = Math.floor(won / 100_000_000);
    const man = Math.floor((won % 100_000_000) / 10_000);
    formatted = man > 0 ? `${uk.toLocaleString('ko-KR')}억 ${man.toLocaleString('ko-KR')}만 원` : `${uk.toLocaleString('ko-KR')}억 원`;
  } else if (won >= 10_000) {
    const man = Math.floor(won / 10_000);
    formatted = `${man.toLocaleString('ko-KR')}만 원`;
  } else {
    formatted = `${won.toLocaleString('ko-KR')}원`;
  }

  return isNegative ? `-${formatted}` : formatted;
}

/**
 * 일반 금액 포맷팅 (평균급여 등, 단위: 원)
 */
function formatCurrency(amount) {
  if (!amount || amount === 0) return '0원';
  const isNegative = amount < 0;
  const abs = Math.abs(amount);

  let formatted = '';
  if (abs >= 100_000_000) {
    const uk = Math.floor(abs / 100_000_000);
    const man = Math.floor((abs % 100_000_000) / 10_000);
    formatted = man > 0 ? `${uk.toLocaleString('ko-KR')}억 ${man.toLocaleString('ko-KR')}만 원` : `${uk.toLocaleString('ko-KR')}억 원`;
  } else if (abs >= 10_000) {
    const man = Math.floor(abs / 10_000);
    formatted = `${man.toLocaleString('ko-KR')}만 원`;
  } else {
    formatted = `${abs.toLocaleString('ko-KR')}원`;
  }

  return isNegative ? `-${formatted}` : formatted;
}

/**
 * 콤마가 포함된 일반 정수 포맷
 */
function formatNumber(num) {
  if (!num && num !== 0) return '-';
  return Number(num).toLocaleString('ko-KR');
}

/**
 * 설립일자(YYYYMMDD)를 YYYY년 MM월 DD일 형식으로 변환
 */
function formatDate(dateStr) {
  if (!dateStr || dateStr.length < 8) return dateStr || '-';
  const y = dateStr.substring(0, 4);
  const m = dateStr.substring(4, 6);
  const d = dateStr.substring(6, 8);
  return `${y}.${m}.${d}`;
}

/**
 * 디바운스 함수 (검색어 입력 지연 실행)
 */
function debounce(func, wait = 200) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

/**
 * 테마 적용 및 전환 함수 (다크 슬레이트 <-> 토스 라이트)
 */
function applyTheme(theme) {
  state.currentTheme = theme;
  if (theme === 'light') {
    document.body.classList.add('theme-light');
    if (elements.themeIcon) elements.themeIcon.className = 'fa-solid fa-moon';
    if (elements.themeLabel) elements.themeLabel.textContent = '다크 모드';
  } else {
    document.body.classList.remove('theme-light');
    if (elements.themeIcon) elements.themeIcon.className = 'fa-solid fa-sun';
    if (elements.themeLabel) elements.themeLabel.textContent = '라이트 모드';
  }
  localStorage.setItem('company_pulse_theme', theme);

  // 차트가 현재 열려있는 경우 색상 갱신
  if (state.financialChartInstance) {
    const isLight = theme === 'light';
    const textColor = isLight ? '#475569' : '#94a3b8';
    const gridColor = isLight ? 'rgba(0, 0, 0, 0.06)' : 'rgba(255, 255, 255, 0.05)';
    state.financialChartInstance.options.scales.x.ticks.color = textColor;
    state.financialChartInstance.options.scales.x.grid.color = gridColor;
    state.financialChartInstance.options.scales.y.ticks.color = textColor;
    state.financialChartInstance.options.scales.y.grid.color = gridColor;
    state.financialChartInstance.options.plugins.legend.labels.color = textColor;
    state.financialChartInstance.update();
  }
}

function toggleTheme() {
  const nextTheme = state.currentTheme === 'light' ? 'slate' : 'light';
  applyTheme(nextTheme);
}

/**
 * 뷰 모드 전환 함수 ('card' 또는 'table')
 */
function setViewMode(mode) {
  state.viewMode = mode;
  if (mode === 'card') {
    elements.companyGrid.style.display = 'grid';
    elements.companyTableWrapper.style.display = 'none';
    elements.btnViewCard.classList.add('active');
    elements.btnViewTable.classList.remove('active');
  } else {
    elements.companyGrid.style.display = 'none';
    elements.companyTableWrapper.style.display = 'block';
    elements.btnViewCard.classList.remove('active');
    elements.btnViewTable.classList.add('active');
  }
}

// 4. 초기 데이터 로드 및 초기화 (Data Initialization)
async function initializeDashboard() {
  try {
    // 0) 저장된 테마 즉시 적용
    applyTheme(state.currentTheme);

    // 1) 프로그레스 바 20% - 메타데이터 로드
    updateLoadingProgress(20, '기본 통계 요약 메타데이터를 불러오는 중...');
    const metaRes = await fetch('meta_summary.json');
    state.meta = await metaRes.json();

    // 2) 프로그레스 바 35% ~ 85% - 3MB 분할 데이터셋 병렬 로딩
    updateLoadingProgress(35, '3MB 분할 고속 데이터셋(1~6 파트)을 병렬 다운로드하는 중...');
    const parts = state.meta.dataParts && state.meta.dataParts.length > 0
      ? state.meta.dataParts
      : ['companies_part1.json', 'companies_part2.json', 'companies_part3.json', 'companies_part4.json', 'companies_part5.json', 'companies_part6.json'];

    let loadedPartsCount = 0;
    const fetchPromises = parts.map(async (partFile) => {
      const res = await fetch(partFile);
      const data = await res.json();
      loadedPartsCount++;
      const currentProgress = 35 + Math.round((loadedPartsCount / parts.length) * 50);
      updateLoadingProgress(currentProgress, `데이터 파트 로드 중 (${loadedPartsCount}/${parts.length} 완료)...`);
      return data;
    });

    const results = await Promise.all(fetchPromises);
    state.allCompanies = results.flat();
    console.log(`[Company Pulse] 전체 기업 데이터 ${state.allCompanies.length.toLocaleString('ko-KR')}건 탑재 완료`);

    // 3) 프로그레스 바 90%
    updateLoadingProgress(90, '필터 인덱싱 및 벤토 그리드 렌더링 준비 중...');
    bindMetaToUI();
    initEventListeners();
    setupIntersectionObserver();
    setupScrollProgressRing();

    // 4) 초기 필터 및 렌더링
    applyFiltersAndSort();

    // 5) 로딩 완료 애니메이션
    updateLoadingProgress(100, '모든 데이터셋 탑재 완료!');
    setTimeout(() => {
      elements.loadingOverlay.classList.add('fade-out');
    }, 350);

  } catch (error) {
    console.error('데이터 로드 실패:', error);
    elements.loadingStatusText.textContent = '데이터를 불러오는 중 오류가 발생했습니다. 새로고침해 주세요.';
  }
}

function updateLoadingProgress(percent, text) {
  elements.loadingProgressBar.style.width = `${percent}%`;
  if (text) elements.loadingStatusText.textContent = text;
}

// 남양주시 행정구역 표준 정렬 순서 (읍면동 순: 첨부 이미지 기준)
const NAMYANGJU_DONG_ORDER = [
  '와부읍',
  '진접읍',
  '화도읍',
  '화도읍남부출장소',
  '진건읍',
  '호평동',
  '다산1동',
  '별내동',
  '금곡동',
  '오남읍',
  '퇴계원읍',
  '별내면',
  '수동면',
  '조안면',
  '평내동',
  '양정동',
  '다산2동'
];

function getOrderedDongs(dongs) {
  if (!dongs || !Array.isArray(dongs)) return [];
  const excluded = new Set(['퇴계원면', '미사1동']);
  return dongs
    .filter(d => d && !excluded.has(d))
    .sort((a, b) => {
      const idxA = NAMYANGJU_DONG_ORDER.indexOf(a);
      const idxB = NAMYANGJU_DONG_ORDER.indexOf(b);
      if (idxA !== -1 && idxB !== -1) return idxA - idxB;
      if (idxA !== -1) return -1;
      if (idxB !== -1) return 1;
      return a.localeCompare(b, 'ko-KR');
    });
}

// 5. 메타데이터 UI 바인딩 (KPI 카드, 드롭다운 옵션)
function bindMetaToUI() {
  if (!state.meta) return;

  // 사이드바 카운트
  elements.navCountAll.textContent = state.meta.totalCount.toLocaleString('ko-KR');

  // 상단 KPI 벤토 카드 바인딩
  elements.kpiTotalCompanies.textContent = state.meta.totalCount.toLocaleString('ko-KR');
  elements.kpiTotalEmployees.textContent = state.meta.totalEmployees.toLocaleString('ko-KR');

  // 총 매출 (천원 단위 -> 조 원 단위: 1조 = 1,000,000,000 천원)
  const totalRevJo = (state.meta.totalRev2024 / 1_000_000_000).toFixed(2);
  elements.kpiTotalRevenue.textContent = totalRevJo;

  // 혁신 인증 합계
  const certSum = Object.values(state.meta.certs).reduce((a, b) => a + b, 0);
  elements.kpiTotalCerts.textContent = certSum.toLocaleString('ko-KR');

  // 지역 (읍면동) 드롭다운 옵션 추가 (남양주시 읍면동 표준 행정 순서 적용)
  const orderedDongs = getOrderedDongs(state.meta.dongs);
  orderedDongs.forEach(dong => {
    if (!dong) return;
    const option = document.createElement('option');
    option.value = dong;
    option.textContent = dong;
    elements.filterDong.appendChild(option);
  });

  // 사이드바 주요 읍면동 퀵 태그 생성 (표준 읍면동 순서 상위 10개)
  elements.quickDongTags.innerHTML = '';
  const topDongs = orderedDongs.slice(0, 10);
  topDongs.forEach(dong => {
    const tag = document.createElement('button');
    tag.className = 'quick-dong-tag';
    tag.textContent = dong;
    tag.dataset.dong = dong;
    tag.addEventListener('click', () => {
      // 이미 선택된 경우 토글 해제
      if (state.selectedDong === dong) {
        state.selectedDong = 'all';
        elements.filterDong.value = 'all';
        tag.classList.remove('active');
      } else {
        state.selectedDong = dong;
        elements.filterDong.value = dong;
        document.querySelectorAll('.quick-dong-tag').forEach(t => t.classList.remove('active'));
        tag.classList.add('active');
      }
      applyFiltersAndSort();
    });
    elements.quickDongTags.appendChild(tag);
  });

  // 업종 대분류 드롭다운 옵션 추가
  state.meta.industries.forEach(ind => {
    if (!ind) return;
    const option = document.createElement('option');
    option.value = ind;
    option.textContent = ind;
    elements.filterIndustry.appendChild(option);
  });
}

// 6. 실시간 필터 및 정렬 로직 (High Performance Filtering & Sorting)
function applyFiltersAndSort() {
  const keyword = state.searchKeyword.toLowerCase().trim();
  const preset = state.selectedPreset;
  const dong = state.selectedDong;
  const industry = state.selectedIndustry;
  const scale = state.selectedScale;
  const certs = state.selectedCerts;

  // 1) 고속 배열 필터링
  state.filteredCompanies = state.allCompanies.filter(comp => {
    // A. 빠른 탐색 프리셋 필터
    if (preset === 'large-medium') {
      if (comp.sc !== '대기업' && comp.sc !== '중견기업') return false;
    } else if (preset === 'venture') {
      if (!comp.cV && !comp.cI && !comp.cM) return false;
    } else if (preset === 'lab') {
      if (!comp.cL && !comp.cR) return false;
    } else if (preset === 'financial') {
      if (!comp.fin) return false;
    } else if (preset === 'manufacturing') {
      if (!comp.indL.includes('제조업')) return false;
    }

    // B. 지역(읍면동) 필터
    if (dong !== 'all' && comp.dg !== dong) {
      return false;
    }

    // C. 업종 대분류 필터
    if (industry !== 'all' && comp.indL !== industry) {
      return false;
    }

    // D. 기업 규모 필터
    if (scale !== 'all') {
      if (scale === '기타') {
        if (comp.sc === '대기업' || comp.sc === '중견기업' || comp.sc === '중기업') return false;
      } else if (comp.sc !== scale) {
        return false;
      }
    }

    // E. 혁신 인증 다중 선택 필터 (선택된 모든 인증을 만족해야 함)
    if (certs.size > 0) {
      for (const certKey of certs) {
        if (!comp[certKey]) return false;
      }
    }

    // F. 검색어 필터 (기업명, 대표자명, 주소, 업종 통합 검색)
    if (keyword) {
      const matchName = comp.n && comp.n.toLowerCase().includes(keyword);
      const matchCeo = comp.ceo && comp.ceo.toLowerCase().includes(keyword);
      const matchRoad = comp.rd && comp.rd.toLowerCase().includes(keyword);
      const matchJibun = comp.jb && comp.jb.toLowerCase().includes(keyword);
      const matchIndL = comp.indL && comp.indL.toLowerCase().includes(keyword);
      const matchIndM = comp.indM && comp.indM.toLowerCase().includes(keyword);
      const matchDong = comp.dg && comp.dg.toLowerCase().includes(keyword);

      if (!matchName && !matchCeo && !matchRoad && !matchJibun && !matchIndL && !matchIndM && !matchDong) {
        return false;
      }
    }

    return true;
  });

  // 2) 정렬 (Sorting)
  sortFilteredData();

  // 3) UI 갱신 및 첫 청크 렌더링
  elements.filteredCount.textContent = state.filteredCompanies.length.toLocaleString('ko-KR');
  renderInitialCards();
}

/**
 * 정렬 기준에 따라 필터링된 배열을 정렬 (테이블 헤더 클릭 및 셀렉트 박스 연동)
 */
const SCALE_ORDER = { '대기업': 4, '중견기업': 3, '중기업': 2, '중소기업': 2, '소기업': 2, '대상아님': 1 };
const MARKET_ORDER = { '유가': 4, '코스피': 4, '코스닥': 3, '코넥스': 2, '외감': 2, '기타': 1, '비상장': 1 };

function getCertCount(comp) {
  return (comp.cV || 0) + (comp.cI || 0) + (comp.cM || 0) + (comp.cL || 0) + (comp.cR || 0);
}

function sortFilteredData() {
  const sortBy = state.sortBy;

  state.filteredCompanies.sort((a, b) => {
    switch (sortBy) {
      // 1. 기업명
      case 'name-asc':
        return (a.n || '').localeCompare(b.n || '', 'ko-KR');
      case 'name-desc':
        return (b.n || '').localeCompare(a.n || '', 'ko-KR');

      // 2. 기업 규모
      case 'scale-desc':
        return (SCALE_ORDER[b.sc] || 0) - (SCALE_ORDER[a.sc] || 0) || (b.r24 || 0) - (a.r24 || 0);
      case 'scale-asc':
        return (SCALE_ORDER[a.sc] || 0) - (SCALE_ORDER[b.sc] || 0) || (b.r24 || 0) - (a.r24 || 0);

      // 3. 상장 구분
      case 'market-desc':
        return (MARKET_ORDER[b.m] || 0) - (MARKET_ORDER[a.m] || 0) || (a.n || '').localeCompare(b.n || '', 'ko-KR');
      case 'market-asc':
        return (MARKET_ORDER[a.m] || 0) - (MARKET_ORDER[b.m] || 0) || (a.n || '').localeCompare(b.n || '', 'ko-KR');

      // 4. 지역 (읍면동)
      case 'dong-asc':
        return (a.dg || '').localeCompare(b.dg || '', 'ko-KR') || (b.r24 || 0) - (a.r24 || 0);
      case 'dong-desc':
        return (b.dg || '').localeCompare(a.dg || '', 'ko-KR') || (b.r24 || 0) - (a.r24 || 0);

      // 5. 업종 대분류
      case 'industry-asc':
        return (a.indL || '').localeCompare(b.indL || '', 'ko-KR') || (b.r24 || 0) - (a.r24 || 0);
      case 'industry-desc':
        return (b.indL || '').localeCompare(a.indL || '', 'ko-KR') || (b.r24 || 0) - (a.r24 || 0);

      // 6. 대표자명
      case 'ceo-asc':
        return (a.ceo || '').localeCompare(b.ceo || '', 'ko-KR') || (a.n || '').localeCompare(b.n || '', 'ko-KR');
      case 'ceo-desc':
        return (b.ceo || '').localeCompare(a.ceo || '', 'ko-KR') || (a.n || '').localeCompare(b.n || '', 'ko-KR');

      // 7. 2024년 매출액
      case 'rev-desc':
        return (b.r24 || 0) - (a.r24 || 0) || (b.emp || 0) - (a.emp || 0);
      case 'rev-asc':
        return (a.r24 || 0) - (b.r24 || 0) || (a.emp || 0) - (b.emp || 0);

      // 8. 2024년 영업익
      case 'op-desc':
        return (b.op24 || 0) - (a.op24 || 0) || (b.r24 || 0) - (a.r24 || 0);
      case 'op-asc':
        return (a.op24 || 0) - (b.op24 || 0) || (a.r24 || 0) - (b.r24 || 0);

      // 9. 종업원수
      case 'emp-desc':
        return (b.emp || 0) - (a.emp || 0) || (b.r24 || 0) - (a.r24 || 0);
      case 'emp-asc':
        return (a.emp || 0) - (b.emp || 0) || (a.r24 || 0) - (b.r24 || 0);

      // 10. 혁신인증 보유건수
      case 'cert-desc':
        return getCertCount(b) - getCertCount(a) || (b.r24 || 0) - (a.r24 || 0);
      case 'cert-asc':
        return getCertCount(a) - getCertCount(b) || (a.r24 || 0) - (b.r24 || 0);

      // 11. 특허 및 설립일 (기존 셀렉트 옵션 호환)
      case 'pat-desc':
        return (b.pat || 0) - (a.pat || 0);
      case 'est-desc':
        return (b.ed || '').localeCompare(a.ed || '');
      case 'est-asc':
        return (a.ed || '').localeCompare(b.ed || '');

      default:
        return 0;
    }
  });

  // 정렬 화살표 아이콘 및 헤더 활성 상태 갱신
  updateTableSortIcons();
}

/**
 * 테이블 헤더의 정렬 아이콘(▲, ▼, 기본) 및 활성 클래스 동기화
 */
function updateTableSortIcons() {
  const currentSort = state.sortBy || '';
  const thList = document.querySelectorAll('.company-table thead th.th-sortable');

  thList.forEach(th => {
    const colKey = th.getAttribute('data-sort-col');
    const icon = th.querySelector('.sort-icon');
    if (!icon) return;

    if (currentSort.startsWith(colKey + '-')) {
      if (currentSort.endsWith('-asc')) {
        th.classList.add('sorted-asc');
        th.classList.remove('sorted-desc');
        icon.className = 'fa-solid fa-arrow-up-long sort-icon';
      } else {
        th.classList.add('sorted-desc');
        th.classList.remove('sorted-asc');
        icon.className = 'fa-solid fa-arrow-down-long sort-icon';
      }
    } else {
      th.classList.remove('sorted-asc', 'sorted-desc');
      icon.className = 'fa-solid fa-sort sort-icon';
    }
  });
}

// 7. 카드보드 & 테이블 뷰 청크 렌더링 (Intersection Observer 기반 Infinite Scroll)
function renderInitialCards() {
  elements.companyGrid.innerHTML = '';
  elements.companyTableBody.innerHTML = '';
  state.renderedCount = 0;

  if (state.filteredCompanies.length === 0) {
    elements.emptyState.style.display = 'flex';
    elements.renderedCountLabel.textContent = '표시 중: 0 / 0';
    elements.scrollSentinel.style.display = 'none';
    elements.companyTableWrapper.style.display = 'none';
    elements.companyGrid.style.display = 'none';
    return;
  }

  elements.emptyState.style.display = 'none';
  elements.scrollSentinel.style.display = 'flex';
  
  // 현재 뷰 모드에 맞춰 화면 표시
  setViewMode(state.viewMode);

  // 첫 청크 렌더링 (36개)
  renderMoreCards();
}

function renderMoreCards() {
  if (state.renderedCount >= state.filteredCompanies.length) {
    elements.sentinelLoader.style.display = 'none';
    return;
  }

  elements.sentinelLoader.style.display = 'flex';

  const startIndex = state.renderedCount;
  const endIndex = Math.min(startIndex + state.pageSize, state.filteredCompanies.length);
  const chunk = state.filteredCompanies.slice(startIndex, endIndex);

  const cardFragment = document.createDocumentFragment();
  const tableFragment = document.createDocumentFragment();

  chunk.forEach((comp, idx) => {
    const rowNum = startIndex + idx + 1;
    // 카드 DOM 생성
    const card = createCompanyCardElement(comp);
    cardFragment.appendChild(card);

    // 테이블 행 DOM 생성
    const row = createCompanyTableRowElement(comp, rowNum);
    tableFragment.appendChild(row);
  });

  elements.companyGrid.appendChild(cardFragment);
  elements.companyTableBody.appendChild(tableFragment);

  state.renderedCount = endIndex;

  elements.renderedCountLabel.textContent = `표시 중: ${state.renderedCount.toLocaleString('ko-KR')} / ${state.filteredCompanies.length.toLocaleString('ko-KR')}`;
  elements.sentinelLoader.style.display = 'none';
}

/**
 * 토스 스타일 벤토 카드 DOM 생성 함수
 */
function createCompanyCardElement(comp) {
  const card = document.createElement('div');
  card.className = 'company-card';
  card.dataset.id = comp.id;

  // 기업 규모 뱃지 스타일
  let scaleClass = 'badge-scale';
  if (comp.sc === '대기업') scaleClass += ' scale-large';
  else if (comp.sc === '중견기업') scaleClass += ' scale-mid';

  // 상장시장 뱃지
  const marketBadge = comp.m && comp.m !== '대상아님' && comp.m !== '기타'
    ? `<span class="badge-market">${comp.m}</span>`
    : '';

  // 조기경보 뱃지
  const isAlert = comp.ew && comp.ew !== '정상';
  const ewBadge = `<span class="badge-warning ${isAlert ? 'alert' : ''}">${comp.ew || '정상'}</span>`;

  // 설립일
  const estFormatted = comp.ed ? `${comp.ed.substring(0, 4)}년 설립` : '';

  // 재무 하이라이트 (2024년 기준, 단위: 천원)
  const revText = comp.r24 > 0 ? formatFinancial(comp.r24) : '-';
  const opText = comp.op24 !== 0 ? formatFinancial(comp.op24) : '-';
  const opHighlightClass = comp.op24 > 0 ? 'highlight' : (comp.op24 < 0 ? 'text-rose' : '');

  // 보유 혁신 인증 뱃지들
  let certHtml = '';
  if (comp.cV) certHtml += '<span class="cert-mini-badge venture"><i class="fa-solid fa-rocket"></i> 벤처</span>';
  if (comp.cI) certHtml += '<span class="cert-mini-badge inno"><i class="fa-solid fa-lightbulb"></i> 이노비즈</span>';
  if (comp.cM) certHtml += '<span class="cert-mini-badge main"><i class="fa-solid fa-star"></i> 메인비즈</span>';
  if (comp.cL) certHtml += '<span class="cert-mini-badge lab"><i class="fa-solid fa-microscope"></i> 연구소</span>';
  if (comp.cR) certHtml += '<span class="cert-mini-badge rnd"><i class="fa-solid fa-vial"></i> R&D부서</span>';
  if (!certHtml) {
    certHtml = '<span class="cert-mini-badge" style="background: rgba(255,255,255,0.04); color: var(--text-muted); font-weight: 500;">일반기업</span>';
  }

  // 주소 간략 표시
  const shortAddress = comp.rd || comp.jb || `${comp.dg || '남양주시'} 소재`;

  card.innerHTML = `
    <div class="card-top">
      <div class="card-badges">
        <span class="${scaleClass}">${comp.sc || '중소기업'}</span>
        ${marketBadge}
        ${ewBadge}
      </div>
      <span class="badge-status">${comp.st || '정상'}</span>
    </div>

    <div class="card-title-box">
      <h3 class="card-company-name">${comp.n}</h3>
      <div class="card-ceo-meta">
        <span><i class="fa-solid fa-user-tie"></i> ${comp.ceo || '대표자 미공표'}</span>
        ${estFormatted ? `<span><i class="fa-regular fa-calendar"></i> ${estFormatted}</span>` : ''}
      </div>
    </div>

    <div class="card-industry-tag">
      <i class="fa-solid fa-industry"></i>
      <span>${comp.indL || '기타 업종'}</span>
    </div>

    <div class="card-location-row">
      <i class="fa-solid fa-location-dot"></i>
      <span>${comp.dg ? `[${comp.dg}] ` : ''}${shortAddress}</span>
    </div>

    <div class="card-stats-grid">
      <div class="card-stat-item">
        <span class="card-stat-label">2024 매출액</span>
        <span class="card-stat-value">${revText}</span>
      </div>
      <div class="card-stat-item">
        <span class="card-stat-label">2024 영업익</span>
        <span class="card-stat-value ${opHighlightClass}">${opText}</span>
      </div>
      <div class="card-stat-item">
        <span class="card-stat-label">종업원수</span>
        <span class="card-stat-value indigo">${comp.emp ? `${formatNumber(comp.emp)}명` : '-'}</span>
      </div>
    </div>

    <div class="card-cert-row">
      ${certHtml}
    </div>

    <div class="card-footer">
      <span>관리번호: ${comp.id || '-'}</span>
      <span class="card-action-text">상세 프로필 보기 <i class="fa-solid fa-arrow-right"></i></span>
    </div>
  `;

  // 클릭 시 상세 모달 열기
  card.addEventListener('click', () => {
    openDetailModal(comp);
  });

  return card;
}

/**
 * 테이블 행 DOM 생성 함수 (Table View Row)
 */
function createCompanyTableRowElement(comp, rowNum) {
  const tr = document.createElement('tr');
  tr.dataset.id = comp.id;

  // 기업 규모 뱃지 스타일
  let scaleClass = 'badge-scale';
  if (comp.sc === '대기업') scaleClass += ' scale-large';
  else if (comp.sc === '중견기업') scaleClass += ' scale-mid';

  // 상장시장
  const marketText = comp.m && comp.m !== '대상아님' ? comp.m : '비상장';

  // 재무 금액
  const revText = comp.r24 > 0 ? formatFinancial(comp.r24) : '-';
  const opText = comp.op24 !== 0 ? formatFinancial(comp.op24) : '-';
  const opColor = comp.op24 > 0 ? 'color: var(--accent-emerald-light);' : (comp.op24 < 0 ? 'color: var(--accent-rose-light);' : '');

  // 혁신 인증 칩
  let certHtml = '';
  if (comp.cV) certHtml += '<span class="cert-mini-badge venture">벤처</span> ';
  if (comp.cI) certHtml += '<span class="cert-mini-badge inno">이노</span> ';
  if (comp.cM) certHtml += '<span class="cert-mini-badge main">메인</span> ';
  if (comp.cL) certHtml += '<span class="cert-mini-badge lab">연구소</span> ';
  if (comp.cR) certHtml += '<span class="cert-mini-badge rnd">R&D</span> ';
  if (!certHtml) certHtml = '<span style="color: var(--text-muted); font-size: 0.75rem;">-</span>';

  tr.innerHTML = `
    <td class="table-col-num">${rowNum}</td>
    <td class="table-col-name">${comp.n}</td>
    <td><span class="${scaleClass}">${comp.sc || '중소기업'}</span></td>
    <td><span class="badge-market">${marketText}</span></td>
    <td><i class="fa-solid fa-location-dot" style="font-size: 0.7rem; color: var(--accent-indigo); margin-right: 4px;"></i>${comp.dg || '-'}</td>
    <td style="max-width: 180px; overflow: hidden; text-overflow: ellipsis;" title="${comp.indL}">${comp.indL || '-'}</td>
    <td>${comp.ceo || '-'}</td>
    <td class="table-col-amount">${revText}</td>
    <td class="table-col-amount" style="${opColor}">${opText}</td>
    <td style="text-align: right; font-weight: 600;">${comp.emp ? `${formatNumber(comp.emp)}명` : '-'}</td>
    <td>${certHtml}</td>
    <td style="text-align: center;">
      <button class="table-btn-detail"><i class="fa-solid fa-magnifying-glass"></i> 보기</button>
    </td>
  `;

  // 행 클릭 시 상세 모달 열기
  tr.addEventListener('click', () => {
    openDetailModal(comp);
  });

  return tr;
}

// 8. 무한 스크롤 옵저버 설정 (Intersection Observer)
function setupIntersectionObserver() {
  const options = {
    root: null,
    rootMargin: '200px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && state.renderedCount < state.filteredCompanies.length) {
        renderMoreCards();
      }
    });
  }, options);

  observer.observe(elements.scrollSentinel);
}

// 9. 기업 상세 정보 모달 (Modal with Fullscreen, Zoom & Chart.js)
function openDetailModal(comp) {
  state.currentModalCompany = comp;

  // 헤더 및 기본 프로필 바인딩
  elements.modalHeaderCompanyCode.textContent = `기업관리코드: ${comp.id || '-'}`;
  elements.modalCompanyName.textContent = comp.n;
  elements.modalIndustryDesc.textContent = `${comp.indL || '업종 미분류'} > ${comp.indM || '세부업종 미지정'}`;

  // 배지 설정
  elements.modalScaleBadge.textContent = comp.sc || '중소기업';
  elements.modalScaleBadge.className = 'badge-scale' + (comp.sc === '대기업' ? ' scale-large' : (comp.sc === '중견기업' ? ' scale-mid' : ''));
  
  elements.modalMarketBadge.textContent = comp.m && comp.m !== '대상아님' ? comp.m : '비상장';
  elements.modalStatusBadge.textContent = comp.st || '정상영업';
  
  const isAlert = comp.ew && comp.ew !== '정상';
  elements.modalEarlyWarningBadge.textContent = `조기경보: ${comp.ew || '정상'}`;
  elements.modalEarlyWarningBadge.className = 'badge-warning' + (isAlert ? ' alert' : '');

  // 개요 및 대표자
  elements.modalCeo.textContent = comp.ceo || '정보 없음';
  elements.modalEstDate.textContent = formatDate(comp.ed);
  elements.modalScaleDetail.textContent = comp.sc || '-';
  elements.modalMarketDetail.textContent = comp.m || '비상장';
  elements.modalStatusDetail.textContent = comp.st || '정상';

  // 고용 및 임금
  elements.modalEmployees.textContent = comp.emp ? `${formatNumber(comp.emp)}명` : '미등록';
  elements.modalAvgSalary.textContent = comp.sal ? formatCurrency(comp.sal) : '미등록';
  elements.modalHired.textContent = comp.hi ? `+${formatNumber(comp.hi)}명` : '0명';
  elements.modalLeft.textContent = comp.lf ? `-${formatNumber(comp.lf)}명` : '0명';

  // 지식재산권
  elements.modalPatent.textContent = `${formatNumber(comp.pat)}건`;
  elements.modalUtility.textContent = `${formatNumber(comp.ut)}건`;

  // 인증 현황 뱃지 컨테이너
  renderModalCertBadges(comp);

  // 주소 및 지도 길찾기 버튼 바인딩
  const roadAddr = comp.rd || '도로명 주소 없음';
  const jibunAddr = comp.jb || '지번 주소 없음';
  elements.modalRoadAddress.textContent = roadAddr;
  elements.modalJibunAddress.textContent = jibunAddr;
  elements.modalDongAddress.textContent = `경기도 남양주시 ${comp.dg || ''}`;

  const queryAddress = encodeURIComponent(comp.rd || comp.jb || `${comp.dg || ''} ${comp.n}`);
  elements.modalNaverMapBtn.href = `https://map.naver.com/v5/search/${queryAddress}`;
  elements.modalKakaoMapBtn.href = `https://map.kakao.com/link/search/${queryAddress}`;

  // 3개년 재무 차트 및 요약 테이블 렌더링
  renderFinancialSection(comp);

  // 줌 레벨 초기화 (100%)
  setModalZoomLevel(100);

  // 모달 표시
  elements.detailModal.classList.add('open');
  elements.detailModal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden'; // 배경 스크롤 방지
}

function closeDetailModal() {
  elements.detailModal.classList.remove('open');
  elements.detailModal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';

  // 전체화면 해제
  if (state.isFullscreen) {
    toggleModalFullscreen();
  }

  // 차트 파괴 (메모리 누수 방지)
  if (state.financialChartInstance) {
    state.financialChartInstance.destroy();
    state.financialChartInstance = null;
  }
}

/**
 * 핵심 인사이트 분석 모달 열기/닫기 제어
 */
function openInsightsModal() {
  if (!elements.insightsModal) return;
  elements.insightsModal.classList.add('open');
  elements.insightsModal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeInsightsModal() {
  if (!elements.insightsModal) return;
  elements.insightsModal.classList.remove('open');
  elements.insightsModal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

/**
 * 모달 내 혁신 인증 배지 그리드 생성
 */
function renderModalCertBadges(comp) {
  const container = elements.modalCertBadgesContainer;
  container.innerHTML = '';

  const certList = [
    { key: 'cV', label: '벤처기업', icon: 'fa-rocket' },
    { key: 'cI', label: '이노비즈', icon: 'fa-lightbulb' },
    { key: 'cM', label: '메인비즈', icon: 'fa-star' },
    { key: 'cL', label: '기업부설연구소', icon: 'fa-microscope' },
    { key: 'cR', label: 'R&D전담부서', icon: 'fa-vial' }
  ];

  certList.forEach(item => {
    const isOwned = Boolean(comp[item.key]);
    const badge = document.createElement('div');
    badge.className = `cert-status-item ${isOwned ? 'active' : ''}`;
    badge.innerHTML = `<i class="fa-solid ${item.icon}"></i> <span>${item.label} ${isOwned ? '보유' : '미보유'}</span>`;
    container.appendChild(badge);
  });
}

/**
 * 3개년 재무 지표 차트 & 테이블 렌더링
 */
function renderFinancialSection(comp) {
  const fin = comp.fin;
  const tableBody = elements.modalFinTableBody;
  tableBody.innerHTML = '';

  if (state.financialChartInstance) {
    state.financialChartInstance.destroy();
    state.financialChartInstance = null;
  }

  // 재무 정보가 없는 기업 대응
  if (!fin || (!fin['22'] && !fin['23'] && !fin['24'])) {
    elements.modalFinUnitLabel.textContent = '공시 대상 외 기업';
    tableBody.innerHTML = `
      <tr>
        <td colspan="4" style="text-align: center; padding: 24px; color: var(--text-muted);">
          <i class="fa-solid fa-circle-info" style="margin-right: 6px;"></i>
          외부감사 및 결산공시 비대상 기업으로 3개년 세부 재무제표가 공표되지 않았습니다.
        </td>
      </tr>
    `;
    // 빈 차트 캔버스 클리어
    const ctx = elements.financialChart.getContext('2d');
    ctx.clearRect(0, 0, elements.financialChart.width, elements.financialChart.height);
    return;
  }

  elements.modalFinUnitLabel.textContent = '단위: 억 원';

  const f22 = fin['22'] || { rev: 0, op: 0, np: 0, ast: 0, dbt: 0, cap: 0 };
  const f23 = fin['23'] || { rev: 0, op: 0, np: 0, ast: 0, dbt: 0, cap: 0 };
  const f24 = fin['24'] || { rev: 0, op: 0, np: 0, ast: 0, dbt: 0, cap: 0 };

  // 테이블 행 구성
  const rows = [
    { label: '매출액', k22: f22.rev, k23: f23.rev, k24: f24.rev, highlight: true },
    { label: '영업이익', k22: f22.op, k23: f23.op, k24: f24.op, color: true },
    { label: '당기순이익', k22: f22.np, k23: f23.np, k24: f24.np, color: true },
    { label: '자산총계', k22: f22.ast, k23: f23.ast, k24: f24.ast },
    { label: '부채총계', k22: f22.dbt, k23: f23.dbt, k24: f24.dbt },
    { label: '자본총계', k22: f22.cap, k23: f23.cap, k24: f24.cap }
  ];

  rows.forEach(r => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${r.label}</td>
      <td>${formatFinancial(r.k22)}</td>
      <td>${formatFinancial(r.k23)}</td>
      <td style="font-weight: 700; color: ${r.color ? (r.k24 >= 0 ? 'var(--accent-emerald-light)' : 'var(--accent-rose-light)') : 'var(--text-white)'}">
        ${formatFinancial(r.k24)}
      </td>
    `;
    tableBody.appendChild(tr);
  });

  // Chart.js 인터랙티브 차트 생성 (천원 -> 억 원 단위 환산: 1억원 = 100,000천원)
  const toUk = (val) => Math.round((val || 0) / 100_000 * 10) / 10;

  const labels = ['2022년', '2023년', '2024년'];
  const revData = [toUk(f22.rev), toUk(f23.rev), toUk(f24.rev)];
  const opData = [toUk(f22.op), toUk(f23.op), toUk(f24.op)];

  const isLight = state.currentTheme === 'light';
  const textColor = isLight ? '#475569' : '#94a3b8';
  const gridColor = isLight ? 'rgba(0, 0, 0, 0.06)' : 'rgba(255, 255, 255, 0.05)';

  const ctx = elements.financialChart.getContext('2d');
  state.financialChartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [
        {
          label: '매출액 (억원)',
          data: revData,
          backgroundColor: 'rgba(99, 102, 241, 0.65)',
          borderColor: '#6366f1',
          borderWidth: 1.5,
          borderRadius: 6,
          yAxisID: 'y'
        },
        {
          label: '영업이익 (억원)',
          data: opData,
          type: 'line',
          borderColor: '#10b981',
          backgroundColor: 'rgba(16, 185, 129, 0.2)',
          pointBackgroundColor: '#10b981',
          pointRadius: 5,
          pointHoverRadius: 7,
          borderWidth: 2.5,
          tension: 0.3,
          yAxisID: 'y'
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
          labels: {
            color: textColor,
            font: { family: 'Pretendard', size: 12 }
          }
        },
        tooltip: {
          backgroundColor: isLight ? '#ffffff' : '#0f172a',
          titleColor: isLight ? '#0f172a' : '#fff',
          bodyColor: isLight ? '#334155' : '#cbd5e1',
          borderColor: isLight ? '#e2e8f0' : 'rgba(255,255,255,0.1)',
          borderWidth: 1,
          padding: 10,
          callbacks: {
            label: function (context) {
              return ` ${context.dataset.label}: ${context.raw.toLocaleString('ko-KR')}억 원`;
            }
          }
        }
      },
      scales: {
        x: {
          grid: { color: gridColor },
          ticks: { color: textColor, font: { family: 'Pretendard' } }
        },
        y: {
          grid: { color: gridColor },
          ticks: {
            color: textColor,
            font: { family: 'Pretendard' },
            callback: (val) => `${val.toLocaleString('ko-KR')}억`
          }
        }
      }
    }
  });
}

// 10. 모달 전체화면 및 줌(확대/축소) 제어
function toggleModalFullscreen() {
  state.isFullscreen = !state.isFullscreen;
  elements.modalContainer.classList.toggle('is-fullscreen', state.isFullscreen);

  if (state.isFullscreen) {
    elements.fullscreenIcon.className = 'fa-solid fa-compress';
    elements.fullscreenToggleBtn.title = '전체화면 종료';
  } else {
    elements.fullscreenIcon.className = 'fa-solid fa-expand';
    elements.fullscreenToggleBtn.title = '전체화면 토글';
  }

  // 리사이즈 시 Chart 재조정
  if (state.financialChartInstance) {
    setTimeout(() => {
      state.financialChartInstance.resize();
    }, 200);
  }
}

function setModalZoomLevel(level) {
  // 최소 80%, 최대 140%
  const clamped = Math.max(80, Math.min(140, level));
  state.modalZoomLevel = clamped;
  elements.zoomLevelText.textContent = `${clamped}%`;

  // 확대/축소 적용
  elements.modalZoomTarget.style.zoom = `${clamped}%`;
}

// 11. 플로팅 탑(Top) 버튼 & 스크롤 프로그레스 링 구현
function setupScrollProgressRing() {
  const circle = elements.progressRingCircle;
  const radius = circle.r.baseVal.value;
  const circumference = 2 * Math.PI * radius; // 원의 둘레: 약 150.8

  circle.style.strokeDasharray = `${circumference} ${circumference}`;
  circle.style.strokeDashoffset = `${circumference}`;

  function updateScroll() {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    
    // 1) 250px 초과 시 부드러운 페이드/스케일 등장
    if (scrollTop > 250) {
      elements.floatingTopBtn.classList.add('active');
    } else {
      elements.floatingTopBtn.classList.remove('active');
    }

    // 2) 스크롤 진행률(0% ~ 100%) 및 원형 프로그레스 링 오프셋 계산
    const progress = scrollHeight > 0 ? Math.min(100, Math.max(0, (scrollTop / scrollHeight) * 100)) : 0;
    const offset = circumference - (progress / 100) * circumference;
    circle.style.strokeDashoffset = offset;
    elements.topPercentLabel.textContent = `${Math.round(progress)}%`;
  }

  window.addEventListener('scroll', () => {
    window.requestAnimationFrame(updateScroll);
  });

  // 클릭 시 최상단으로 부드러운 스크롤 이동
  elements.floatingTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/**
 * 테이블 헤더 텍스트 클릭 시 실시간 컬럼 정렬 이벤트 리스너
 */
function setupTableHeaderSortEvents() {
  const thList = document.querySelectorAll('.company-table thead th.th-sortable');

  thList.forEach(th => {
    th.addEventListener('click', () => {
      const colKey = th.getAttribute('data-sort-col');
      if (!colKey) return;

      const isCurrentCol = state.sortBy.startsWith(colKey + '-');
      let nextDirection = 'desc';

      if (isCurrentCol) {
        // 이미 해당 컬럼으로 정렬 중인 경우: 오름차순 <-> 내림차순 반전
        nextDirection = state.sortBy.endsWith('-desc') ? 'asc' : 'desc';
      } else {
        // 새로 클릭한 컬럼: 텍스트 컬럼(이름, 지역, 업종, 대표자)은 가나다순(asc), 수치 및 인증 컬럼은 높은순(desc) 우선
        const textCols = ['name', 'dong', 'industry', 'ceo'];
        nextDirection = textCols.includes(colKey) ? 'asc' : 'desc';
      }

      state.sortBy = `${colKey}-${nextDirection}`;

      // 상단 정렬 셀렉트 박스 동기화
      if (elements.sortSelect) {
        const matchingOption = elements.sortSelect.querySelector(`option[value="${state.sortBy}"]`);
        if (matchingOption) {
          elements.sortSelect.value = state.sortBy;
        }
      }

      // 정렬 적용 및 첫 청크 렌더링
      applyFiltersAndSort();
    });
  });
}

// 12. 전체 이벤트 리스너 바인딩 (Event Listeners Setup)
function initEventListeners() {
  // 테이블 헤더 클릭 정렬 이벤트 연결
  setupTableHeaderSortEvents();

  // 뷰 모드 토글 (카드형 / 테이블형)
  if (elements.btnViewCard && elements.btnViewTable) {
    elements.btnViewCard.addEventListener('click', () => setViewMode('card'));
    elements.btnViewTable.addEventListener('click', () => setViewMode('table'));
  }

  // 테마 전환 버튼 (다크 / 라이트 모드)
  if (elements.themeToggleBtn) {
    elements.themeToggleBtn.addEventListener('click', toggleTheme);
  }

  // 검색어 입력 이벤트 (디바운스 200ms)
  elements.searchInput.addEventListener('input', debounce((e) => {
    state.searchKeyword = e.target.value;
    elements.clearSearchBtn.style.display = state.searchKeyword ? 'block' : 'none';
    applyFiltersAndSort();
  }, 200));

  // 검색어 지우기 버튼
  elements.clearSearchBtn.addEventListener('click', () => {
    elements.searchInput.value = '';
    state.searchKeyword = '';
    elements.clearSearchBtn.style.display = 'none';
    applyFiltersAndSort();
  });

  // 정렬 기준 변경
  elements.sortSelect.addEventListener('change', (e) => {
    state.sortBy = e.target.value;
    applyFiltersAndSort();
  });

  // 지역 (읍면동) 필터 변경
  elements.filterDong.addEventListener('change', (e) => {
    state.selectedDong = e.target.value;
    // 사이드바 퀵태그 동기화
    document.querySelectorAll('.quick-dong-tag').forEach(t => {
      t.classList.toggle('active', t.dataset.dong === e.target.value);
    });
    applyFiltersAndSort();
  });

  // 업종 대분류 필터 변경
  elements.filterIndustry.addEventListener('change', (e) => {
    state.selectedIndustry = e.target.value;
    applyFiltersAndSort();
  });

  // 기업 규모 필터 변경
  elements.filterScale.addEventListener('change', (e) => {
    state.selectedScale = e.target.value;
    applyFiltersAndSort();
  });

  // 혁신 인증 체크박스 필터 이벤트
  elements.certCheckboxes.forEach(cb => {
    cb.addEventListener('change', () => {
      if (cb.checked) {
        state.selectedCerts.add(cb.value);
      } else {
        state.selectedCerts.delete(cb.value);
      }
      applyFiltersAndSort();
    });
  });

  // 사이드바 빠른 탐색 프리셋 버튼들
  elements.navItems.forEach(btn => {
    btn.addEventListener('click', () => {
      elements.navItems.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.selectedPreset = btn.dataset.preset;
      applyFiltersAndSort();

      // 모바일인 경우 사이드바 닫기
      if (window.innerWidth <= 1024) {
        closeMobileSidebar();
      }
    });
  });

  // 모든 필터 초기화 버튼
  const resetFilters = () => {
    state.searchKeyword = '';
    state.selectedPreset = 'all';
    state.selectedDong = 'all';
    state.selectedIndustry = 'all';
    state.selectedScale = 'all';
    state.selectedCerts.clear();
    state.sortBy = 'rev-desc';

    elements.searchInput.value = '';
    elements.clearSearchBtn.style.display = 'none';
    elements.sortSelect.value = 'rev-desc';
    elements.filterDong.value = 'all';
    elements.filterIndustry.value = 'all';
    elements.filterScale.value = 'all';

    elements.certCheckboxes.forEach(cb => cb.checked = false);
    elements.navItems.forEach(b => b.classList.toggle('active', b.dataset.preset === 'all'));
    document.querySelectorAll('.quick-dong-tag').forEach(t => t.classList.remove('active'));

    applyFiltersAndSort();
  };

  elements.resetAllFiltersBtn.addEventListener('click', resetFilters);
  elements.emptyResetBtn.addEventListener('click', resetFilters);

  // 모바일 사이드바 토글
  elements.mobileMenuBtn.addEventListener('click', () => {
    elements.sidebar.classList.add('open');
    elements.sidebarOverlay.classList.add('active');
  });

  const closeMobileSidebar = () => {
    elements.sidebar.classList.remove('open');
    elements.sidebarOverlay.classList.remove('active');
  };

  elements.closeSidebarBtn.addEventListener('click', closeMobileSidebar);
  elements.sidebarOverlay.addEventListener('click', closeMobileSidebar);

  // 기업 상세 모달 닫기
  elements.closeModalBtn.addEventListener('click', closeDetailModal);
  elements.detailModal.addEventListener('click', (e) => {
    // 배경 클릭 시 닫기 (모달 컨테이너 내부 클릭 제외)
    if (e.target === elements.detailModal) {
      closeDetailModal();
    }
  });

  // 핵심 인사이트 모달 열기 및 닫기
  if (elements.keyInsightsBtn) {
    elements.keyInsightsBtn.addEventListener('click', openInsightsModal);
  }
  if (elements.closeInsightsModalBtn) {
    elements.closeInsightsModalBtn.addEventListener('click', closeInsightsModal);
  }
  if (elements.insightsModal) {
    elements.insightsModal.addEventListener('click', (e) => {
      if (e.target === elements.insightsModal) {
        closeInsightsModal();
      }
    });
  }

  // 요구사항: 정렬 기준 초기화 버튼 이벤트 (처음 기준인 매출액 높은순으로 되돌리기)
  if (elements.resetSortBtn) {
    elements.resetSortBtn.addEventListener('click', () => {
      state.sortBy = 'rev-desc';
      if (elements.sortSelect) {
        elements.sortSelect.value = 'rev-desc';
      }
      applyFiltersAndSort();
    });
  }

  // 모달 전체화면 토글
  elements.fullscreenToggleBtn.addEventListener('click', toggleModalFullscreen);

  // 모달 확대/축소 버튼
  elements.zoomInBtn.addEventListener('click', () => setModalZoomLevel(state.modalZoomLevel + 10));
  elements.zoomOutBtn.addEventListener('click', () => setModalZoomLevel(state.modalZoomLevel - 10));
  elements.zoomResetBtn.addEventListener('click', () => setModalZoomLevel(100));

  // ESC 키 단축키 (모달 닫기)
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (elements.insightsModal && elements.insightsModal.classList.contains('open')) {
        closeInsightsModal();
      } else if (elements.detailModal.classList.contains('open')) {
        closeDetailModal();
      } else if (elements.sidebar.classList.contains('open')) {
        closeMobileSidebar();
      }
    }
  });
}

// ==========================================================================
// 14. Google DeepMind Intelligence Slate 테마 로그인 게이트 제어
// ==========================================================================
const AUTH_CONFIG = {
  sessionKey: 'company_pulse_authenticated',
  // 요구사항 비밀번호: '2026', 'nyj2026', 'NYH2026' (대소문자 친화성 지원)
  validPasswords: ['2026', 'nyj2026', 'NYH2026', 'NYJ2026', 'nyh2026']
};

function initAuthGate() {
  const isAuth = sessionStorage.getItem(AUTH_CONFIG.sessionKey) === 'true';

  if (isAuth) {
    // 이미 로그인되어 있으면 로그인 게이트 오버레이 즉시 비활성화
    if (elements.loginGateOverlay) {
      elements.loginGateOverlay.classList.add('unlocked');
      elements.loginGateOverlay.style.display = 'none';
    }
  } else {
    // 미로그인 상태면 로그인 게이트 활성화 및 입력창 자동 포커스
    if (elements.loginGateOverlay) {
      elements.loginGateOverlay.classList.remove('unlocked');
      elements.loginGateOverlay.style.display = 'flex';
    }
    if (elements.loginPasswordInput) {
      setTimeout(() => elements.loginPasswordInput.focus(), 250);
    }
  }

  // 1) 로그인 폼 제출 이벤트 (Enter 키 지원)
  if (elements.loginForm) {
    elements.loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      handleLoginAttempt();
    });
  }

  // 2) 로그인 버튼 클릭
  if (elements.loginSubmitBtn) {
    elements.loginSubmitBtn.addEventListener('click', (e) => {
      e.preventDefault();
      handleLoginAttempt();
    });
  }

  // 3) 비밀번호 보기/숨기기 토글
  if (elements.togglePasswordVisibilityBtn && elements.loginPasswordInput) {
    elements.togglePasswordVisibilityBtn.addEventListener('click', () => {
      const isPassword = elements.loginPasswordInput.type === 'password';
      elements.loginPasswordInput.type = isPassword ? 'text' : 'password';
      if (elements.togglePasswordEyeIcon) {
        elements.togglePasswordEyeIcon.className = isPassword ? 'fa-regular fa-eye-slash' : 'fa-regular fa-eye';
      }
    });
  }

  // 4) 로그아웃 버튼 이벤트 (대시보드 상단 헤더)
  if (elements.logoutBtn) {
    elements.logoutBtn.addEventListener('click', () => {
      handleLogout();
    });
  }
}

function handleLoginAttempt() {
  if (!elements.loginPasswordInput) return;
  const inputPwd = elements.loginPasswordInput.value.trim();

  if (AUTH_CONFIG.validPasswords.includes(inputPwd)) {
    // 성공 처리: 세션 저장 및 부드러운 언락 전환 애니메이션
    sessionStorage.setItem(AUTH_CONFIG.sessionKey, 'true');
    if (elements.loginErrorMessage) {
      elements.loginErrorMessage.style.display = 'none';
    }
    if (elements.loginGateOverlay) {
      elements.loginGateOverlay.classList.add('unlocked');
      setTimeout(() => {
        elements.loginGateOverlay.style.display = 'none';
      }, 500);
    }
    elements.loginPasswordInput.value = '';
    console.log('[Company Pulse] 인증 성공: 대시보드 진입 허용');
  } else {
    // 실패 처리: 오류 문구 표시 및 부드러운 흔들림(Shake) 피드백
    if (elements.loginErrorMessage) {
      elements.loginErrorMessage.style.display = 'flex';
      if (!inputPwd) {
        elements.loginErrorText.textContent = '비밀번호를 입력해 주세요.';
      } else {
        elements.loginErrorText.textContent = '비밀번호가 올바르지 않습니다. 다시 입력해 주세요.';
      }
    }
    if (elements.loginCard) {
      elements.loginCard.classList.remove('shake');
      void elements.loginCard.offsetWidth; // DOM 리플로우 강제 트리거
      elements.loginCard.classList.add('shake');
      setTimeout(() => {
        elements.loginCard.classList.remove('shake');
      }, 500);
    }
    elements.loginPasswordInput.focus();
    elements.loginPasswordInput.select();
  }
}

function handleLogout() {
  // 세션 파기 및 로그인 화면 복귀
  sessionStorage.removeItem(AUTH_CONFIG.sessionKey);
  if (elements.loginGateOverlay) {
    elements.loginGateOverlay.style.display = 'flex';
    void elements.loginGateOverlay.offsetWidth;
    elements.loginGateOverlay.classList.remove('unlocked');
  }
  if (elements.loginPasswordInput) {
    elements.loginPasswordInput.value = '';
    setTimeout(() => elements.loginPasswordInput.focus(), 250);
  }
  if (elements.loginErrorMessage) {
    elements.loginErrorMessage.style.display = 'none';
  }
  console.log('[Company Pulse] 로그아웃 완료: 인증 게이트로 잠금');
}

// 15. DOM 로드 완료 시 애플리케이션 시작
document.addEventListener('DOMContentLoaded', () => {
  initAuthGate();
  initializeDashboard();
});
