// ============================================================
// sprites.js  —  Character sprites
// 스페이스 마린: 레퍼런스 이미지(assets/marine.png) 직접 사용
//   · 배경색(top-left 픽셀 기준) 자동 제거
//   · ctx.scale(-1,1) 로 방향 전환 (entities.js 처리)
// 나머지 캐릭터: fillRect 기반 픽셀아트
// ============================================================

// ── 스페이스 마린 이미지 로드 + 배경 제거 ──────────────────────
const _marineCanvas = document.createElement('canvas');
let   _marineReady  = false;

(function loadMarine() {
  const img = new Image();
  img.onload = () => {
    const W = img.naturalWidth, H = img.naturalHeight;
    _marineCanvas.width  = W;
    _marineCanvas.height = H;
    const c  = _marineCanvas.getContext('2d');
    c.drawImage(img, 0, 0);

    try {
      const id   = c.getImageData(0, 0, W, H);
      const data = id.data;

      // 좌상단 픽셀 = 배경색 기준
      const bgR = data[0], bgG = data[1], bgB = data[2];

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i], g = data[i+1], b = data[i+2];
        const dr = Math.abs(r - bgR);
        const dg = Math.abs(g - bgG);
        const db = Math.abs(b - bgB);
        // 배경색에 가까운 픽셀 투명 처리 (허용 오차 90)
        if (dr + dg + db < 90) { data[i + 3] = 0; continue; }
        // 빨강/주황 폭발 파티클 제거 (R 채널이 지배적이고 밝은 경우)
        if (r > 160 && r - g > 80 && r - b > 80) data[i + 3] = 0;
      }
      c.putImageData(id, 0, 0);
    } catch (e) {
      // CORS 제한(file:// 프로토콜 등)으로 getImageData 실패 시
      // 배경 제거 없이 원본 이미지 그대로 사용
      console.warn('[sprites] 배경 제거 실패, 원본 이미지 사용:', e.message);
    }
    _marineReady = true;
  };
  img.onerror = () => console.warn('[sprites] marine.png 로드 실패');
  img.src = './assets/marine.png';
})();

// ── 픽셀아트 엔진 ─────────────────────────────────────────────
// grid : 문자열 배열 (모든 행 동일 길이, 'x' = 투명)
// pal  : { 글자: '#hex' }
// pw   : 픽셀 한 칸 크기(px)
function pxDraw(ctx, grid, pal, pw) {
  const cols = grid[0].length;
  const rows = grid.length;
  const ox   = Math.round(-(cols * pw) / 2);
  const oy   = Math.round(-(rows * pw) / 2);
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      const c = grid[y][x];
      if (c === 'x' || !pal[c]) continue;
      ctx.fillStyle = pal[c];
      ctx.fillRect(ox + x * pw, oy + y * pw, pw, pw);
    }
  }
}

// 특정 글자만 글로우 효과로 한 번 더 그리기
function pxGlow(ctx, grid, pal, pw, keys, color, blur) {
  const cols = grid[0].length;
  const ox   = Math.round(-(cols * pw) / 2);
  const oy   = Math.round(-(grid.length * pw) / 2);
  ctx.shadowColor = color;
  ctx.shadowBlur  = blur;
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      const c = grid[y][x];
      if (!keys.includes(c) || !pal[c]) continue;
      ctx.fillStyle = pal[c];
      ctx.fillRect(ox + x * pw, oy + y * pw, pw, pw);
    }
  }
  ctx.shadowBlur  = 0;
  ctx.shadowColor = 'transparent';
}

function dropShadow(ctx, r) {
  ctx.fillStyle = 'rgba(0,0,0,0.32)';
  ctx.beginPath();
  ctx.ellipse(0, r * 0.90, r * 0.70, r * 0.20, 0, 0, Math.PI * 2);
  ctx.fill();
}

// ============================================================
// SPACE MARINE  —  레퍼런스 이미지(assets/marine.png) 직접 렌더링
//
// 이미지가 로드되면 배경 제거 후 ctx.drawImage 로 그림.
// 로드 전 또는 실패 시 단색 실루엣 폴백.
// flash: CSS filter brightness 로 흰 플래시 연출.
// ============================================================
export function drawSpaceMarine(ctx, r, flash) {
  dropShadow(ctx, r);

  if (!_marineReady) {
    // 폴백: 이미지 로드 전 파란 원 실루엣
    ctx.fillStyle = flash ? '#aabbff' : '#0b31ad';
    ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.fill();
    return;
  }

  // 캐릭터 높이를 r * 5.0 에 맞춰 스케일
  // → r=14 기준 70px: 오크보이(52px), 타이라니드 워리어(56px)보다 명확히 큼
  const scale = (r * 5.0) / _marineCanvas.height;
  const dw = _marineCanvas.width  * scale;
  const dh = _marineCanvas.height * scale;

  if (flash) {
    // 흰색 플래시: 원본을 밝게
    ctx.filter = 'brightness(4) saturate(0.2)';
  }
  ctx.drawImage(_marineCanvas, -dw / 2, -dh / 2, dw, dh);
  ctx.filter = 'none';
}

// ── 오크 이미지 로더 ─────────────────────────────────────────
// 배경색(좌상단 픽셀 기준) 자동 제거, CORS 실패 시 원본 그대로.
function _loadOrkImage(src) {
  const cv = document.createElement('canvas');
  cv._ready = false;
  const img = new Image();
  img.onload = () => {
    cv.width  = img.naturalWidth;
    cv.height = img.naturalHeight;
    const c = cv.getContext('2d');
    c.drawImage(img, 0, 0);
    try {
      const id   = c.getImageData(0, 0, cv.width, cv.height);
      const data = id.data;
      const bgR  = data[0], bgG = data[1], bgB = data[2];
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i], g = data[i+1], b = data[i+2];
        if (Math.abs(r-bgR)+Math.abs(g-bgG)+Math.abs(b-bgB) < 90) data[i+3] = 0;
      }
      c.putImageData(id, 0, 0);
    } catch (e) {
      console.warn('[sprites] 배경 제거 실패:', src, e.message);
    }
    cv._ready = true;
  };
  img.onerror = () => console.warn('[sprites] 이미지 로드 실패:', src);
  img.src = src;
  return cv;
}

// ork1.png (210×158) → Ork Boy (r≈13)
// ork2.png (232×227) → Nob     (r≈17)
const _ork1Canvas = _loadOrkImage('./assets/ork1.png');
const _ork2Canvas = _loadOrkImage('./assets/ork2.png');

/**
 * 오크 이미지 공통 렌더
 *   dh = r * M  (M 배율로 시각적 높이 결정; 이미지 원본 해상도 무관)
 */
function _drawOrkImage(ctx, orkCv, r, flash, M) {
  dropShadow(ctx, r);
  if (!orkCv._ready) {
    ctx.fillStyle = flash ? '#88dd88' : '#3a8022';
    ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.fill();
    return;
  }
  const scale = (r * M) / orkCv.height;
  const dw    = orkCv.width  * scale;
  const dh    = orkCv.height * scale;
  if (flash) ctx.filter = 'brightness(4) saturate(0.2)';
  ctx.drawImage(orkCv, -dw / 2, -dh / 2, dw, dh);
  ctx.filter = 'none';
}

// ============================================================
// GRETCHIN  (r ≈ 8)
// 11칸 × 12행  pw = r * 0.36
//
// 오크 하수인 — 작고 빠른 잡졸
//   크고 뾰족한 귀, 노란 눈(글로우), 꼽추 자세
//   오른손에 조잡한 스텁건(n=건메탈)
//
// k=아웃라인  g=초록 피부  e=눈(노란 글로우)
// b=갈색 누더기  n=건메탈  t=이빨
// ============================================================
export function drawHormagaunt(ctx, r, flash) {
  dropShadow(ctx, r);
  const pw  = Math.max(2, Math.round(r * 0.36));
  const pal = flash
    ? { k:'#88bb88', g:'#aaddaa', e:'#eeffaa', b:'#ccaa88', n:'#aaaacc', t:'#eeeebb' }
    : { k:'#0a0a08', g:'#3a8022', e:'#c8e000', b:'#5a3010', n:'#1a1a22', t:'#c0c0a0' };

  // 모든 행 11글자 고정
  const grid = [
    'kgkxxxxxkgk',  //  0: 뾰족한 귀 끝
    'kggkxxxkggk',  //  1: 귀
    'xkgggggggkx',  //  2: 두상 상단
    'xkggeegggkx',  //  3: 눈 (e=노란 글로우)
    'xkgggggggkx',  //  4: 뺨
    'xkgktttkgkx',  //  5: 이빨
    'xxkbbbbbkxx',  //  6: 토르소 (누더기)
    'xkgbbbbgnkx',  //  7: 팔 + 무기(n)
    'xxkgbbgnnnx',  //  8: 손 + 무기 손잡이
    'xxxkgkgnnnx',  //  9: 다리 + 무기 날
    'xxxkbkbkxxx',  // 10: 발
    'xxxxxxxxxxx',  // 11: 패딩
  ];

  if (!flash) pxGlow(ctx, grid, pal, pw, 'e', '#c8e000', pw * 5);
  pxDraw(ctx, grid, pal, pw);
}

// ============================================================
// ORK BOY  (r ≈ 13)
// 레퍼런스 이미지 ork1.png 직접 렌더링  (dh = r × 4.5 ≈ 58px)
// ============================================================
export function drawOrkBoy(ctx, r, flash) {
  _drawOrkImage(ctx, _ork1Canvas, r, flash, 4.5);
}

// ============================================================
// NOB  (r ≈ 17)
// 레퍼런스 이미지 ork2.png 직접 렌더링  (dh = r × 4.5 ≈ 76px)
// ============================================================
export function drawTyranidWarrior(ctx, r, flash) {
  _drawOrkImage(ctx, _ork2Canvas, r, flash, 4.5);
}

// ============================================================
// DEFF DREAD  boss  (r ≈ 34)
// 16칸 × 16행  pw = r * 0.18
//
// 오크 기계 워커 — 철판 장갑 동체, 파워 클로, 배기관
//   행  0- 1: 배기관 (p)
//   행  2- 6: 사각 콕핏 (조종석 그릴 g, 센서 눈 e)
//   행  7   : 전폭 어깨 플레이트
//   행  8-10: 파워 클로 (c) + 팔 암부 (M)
//   행 11-13: 두꺼운 토르소 + 용접선 (w)
//   행 14-15: 짧고 굵은 다리 + 발
//
// k=리벳/아웃라인  m=암부 금속  M=밝은 금속
// r=녹(러스트)  g=오크 조종석(초록)  e=센서 눈(빨강 글로우)
// c=파워 클로(골드)  p=배기관  w=용접선
// ============================================================
export function drawCarnifex(ctx, r, flash) {
  dropShadow(ctx, r);
  const pw = Math.max(3, Math.round(r * 0.18));

  if (!flash) {
    const pulse = 0.40 + 0.20 * Math.sin(Date.now() * 0.004);
    const grad  = ctx.createRadialGradient(0, 0, r * 0.2, 0, 0, r * 1.6);
    grad.addColorStop(0, `rgba(30,80,200,${pulse * 0.45})`);
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.ellipse(0, 0, r * 1.6, r * 1.6, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  const pal = flash
    ? { k:'#aaaacc', m:'#ccccee', M:'#ddddff', r:'#ddbbaa', g:'#aaddaa', e:'#ffaaaa', c:'#eeddaa', p:'#888888', w:'#ccccff' }
    : { k:'#080814', m:'#181828', M:'#2a2a40', r:'#6a2800', g:'#104010', e:'#ee2000', c:'#806000', p:'#101010', w:'#38385a' };

  // 모든 행 16글자 고정
  const grid = [
    'xxxxxxpxxxxpxxxx',  //  0: 배기관
    'xxxxxxpxxxxpxxxx',  //  1: 배기관
    'xxxxxkMMMMMMkxxx',  //  2: 헤드/콕핏 상단
    'xxxxkMMMMMMMMkxx',  //  3: 콕핏
    'xxxxkMeMMMMeMkxx',  //  4: 센서 눈
    'xxxxkMggggggMkxx',  //  5: 조종석 그릴 (초록)
    'xxxxkMmmmmmmMkxx',  //  6: 어두운 그릴 슬릿
    'kkMMMMMMMMMMMMkk',  //  7: 어깨 플레이트 (전폭)
    'ckkMrMMMMMMrMkkc',  //  8: 클로 마운트 + 녹
    'cckkMMMMMMMMkkcc',  //  9: 파워 클로 상단
    'cxkMMMMMMMMMkxcc',  // 10: 파워 클로 하단
    'xxkMMMMMMMMMMkxx',  // 11: 토르소
    'xxkMMwwMMwwMMkxx',  // 12: 용접 라인
    'xxkMMMMMMMMMMkxx',  // 13: 하단 토르소
    'xxxkMMkxxkMMkxxx',  // 14: 다리
    'xxkMMMkxxkMMMkxx',  // 15: 발
  ];

  if (!flash) pxGlow(ctx, grid, pal, pw, 'e', '#ee2000', pw * 4);
  pxDraw(ctx, grid, pal, pw);
}

// ============================================================
// WARBOSS  boss  (r ≈ 38)
// 18칸 × 18행  pw = r * 0.17
//
// 핵심 실루엣:
//   뿔 달린 메가 아머 헬멧 (행0-4)
//   거대한 오크 두상 (행5-8) — 눈, 엄니
//   위험 줄무늬 메가 아머 (행9-11)
//   파워 클로 (오른쪽, 청백 글로우)
//
// k=외곽 g=초록피부 m=메가아머 c=위험노랑 t=엄니 e=눈(오렌지) w=파워클로(청백)
// ============================================================
export function drawWarboss(ctx, r, flash) {
  dropShadow(ctx, r);
  const pw  = Math.max(3, Math.round(r * 0.17));

  if (!flash) {
    const pulse = 0.40 + 0.20 * Math.sin(Date.now() * 0.004);
    const g = ctx.createRadialGradient(0, 0, r * 0.2, 0, 0, r * 1.55);
    g.addColorStop(0, `rgba(60,140,10,${pulse * 0.5})`);
    g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.ellipse(0, 0, r * 1.55, r * 1.55, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  const pal = flash
    ? { k:'#88aa88', g:'#aaddaa', m:'#aaaacc', c:'#eeee88', t:'#eeeebb', e:'#ffcc88', w:'#ccdeff' }
    : { k:'#0a1808', g:'#3a8020', m:'#1a1a2c', c:'#d4a000', t:'#e0d090', e:'#ff4000', w:'#99bbff' };

  // 모든 행 18글자 고정
  const grid = [
    'xxxxxxkxkxxxxxxxxx', // 0 뿔 끝
    'xxxxxkmmmkxxxxxxxx', // 1 뿔
    'xxxxkmmmmmmkxxxxxx', // 2 뿔+헬멧위
    'xxxkmmmmmmmmmkxxxx', // 3 헬멧
    'xxxkmmmmmmmmmkxxxx', // 4 헬멧
    'xxxkmeeeeemmkxwwwk', // 5 눈(e) + 파워클로(w)
    'xxxkgtttttgkxkwwwk', // 6 엄니(t) + 클로날
    'xxxkggggggkxxxkwwk', // 7 얼굴 + 클로
    'xxxkmmmmmmmkxxxkwk', // 8 목/어깨 + 클로끝
    'xxkmmmmmmmmmmmkxxx', // 9 어깨 최대폭
    'xkmmcccmmmcccmmkxx', //10 메가아머 위험줄무늬
    'xkmmcccmmmcccmmkxx', //11 메가아머 위험줄무늬
    'xxkmmmmmmmmmmmkxxx', //12 허리
    'xxxkggggggggkxxxxx', //13 허벅지
    'xxxxkggxxggkxxxxxx', //14 다리
    'xxxxkggxxggkxxxxxx', //15 다리
    'xxxxkmmxxmmkxxxxxx', //16 부츠
    'xxxxxxxxxxxxxxxxxx', //17 패딩
  ];

  if (!flash) {
    pxGlow(ctx, grid, pal, pw, 'e', '#ff4000', pw * 4);
    pxGlow(ctx, grid, pal, pw, 'w', '#4488ff', pw * 5);
  }
  pxDraw(ctx, grid, pal, pw);
}
