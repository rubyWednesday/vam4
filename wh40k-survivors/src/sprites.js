// ============================================================
// sprites.js  —  Pixel-art character sprites
// Warhammer Survivors 레퍼런스 스타일: fillRect 기반 픽셀아트
//
// 렌더링: ctx.fillRect 만 사용 (곡선 없음) → 선명한 픽셀아트 느낌
// 모든 스프라이트 오른쪽 방향. 왼쪽은 caller ctx.scale(-1,1).
// (0,0) 기준 중앙 정렬.
// ============================================================

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
// SPACE MARINE  (r ≈ 14)
// 14칸 × 12행  pw = r * 0.27
//
// 핵심 실루엣:
//   행0-2: 헬멧 (5칸 넓이)
//   행3-4: 파우달론 — 14칸 전폭!! (헬멧의 약 3배)
//   행5-7: 가슴/건
//   행8-10: 다리/부츠
//
// k=외곽(#050e20) b=울트라블루 v=바이저초록(글로우) d=다크턱 c=골드 n=건
// ============================================================
export function drawSpaceMarine(ctx, r, flash) {
  dropShadow(ctx, r);
  const pw  = Math.max(2, Math.round(r * 0.27));
  const pal = flash
    ? { k:'#8899cc', b:'#aabbff', v:'#aaffcc', d:'#7788bb', c:'#ffee88', n:'#888888' }
    : { k:'#050e20', b:'#0b31ad', v:'#00ff88', d:'#04163d', c:'#c9a227', n:'#181818' };

  // 모든 행 14글자 고정
  const grid = [
    'xxxxkbbbkxxxxx', // 0 헬멧
    'xxxxkbbbkxxxxx', // 1 헬멧
    'xxxxkvvvkxxxxx', // 2 GREEN VISOR ← 글로우
    'xxxxkdddkxxxxx', // 3 다크 턱
    'kkkkbbbbbbkkkk', // 4 파우달론 (14칸 전부!)
    'kbbbbbbbbbbbbk', // 5 파우달론 최대폭
    'xkbbbbbbbbknnx', // 6 가슴 + 건
    'xkbbcbbbbknnxx', // 7 아퀼라 + 건
    'xxkbbbbbbkxxxx', // 8 허리
    'xxxkbxbkxxxxxx', // 9 다리
    'xxxkbxbkxxxxxx', //10 다리
    'xxxknxnkxxxxxx', //11 부츠
  ];

  if (!flash) pxGlow(ctx, grid, pal, pw, 'v', '#00ff88', pw * 4);
  pxDraw(ctx, grid, pal, pw);
}

// ============================================================
// HORMAGAUNT  (r ≈ 8)
// 13칸 × 11행  pw = r * 0.36
//
// 핵심 실루엣:
//   오른쪽으로 크게 돌출한 낫 블레이드
//   왼쪽에 꼬리, 낮은 포복 자세
//
// k=외곽 p=퍼플몸통 b=뼈낫 e=눈(빨강 글로우)
// ============================================================
export function drawHormagaunt(ctx, r, flash) {
  dropShadow(ctx, r);
  const pw  = Math.max(2, Math.round(r * 0.36));
  const pal = flash
    ? { k:'#ccaadd', p:'#ddbbee', b:'#eeddaa', e:'#ffaaaa' }
    : { k:'#18062a', p:'#5a1878', b:'#d0c070', e:'#ff1010' };

  // 모든 행 13글자 고정
  const grid = [
    'xkpkxxxxxxxxx', // 0 꼬리 (뒤)
    'xkppkxxxxxxxx', // 1 꼬리/상체
    'xkppkxxkbbxxx', // 2 상체 + 낫 시작
    'xkepkxxxkbbkx', // 3 눈(e) + 낫날
    'xkppkxxxxkbbk', // 4 몸통 + 낫날 최대
    'xkppppkxxxxxx', // 5 배
    'xkppppkxxxxxx', // 6 배
    'xkpxxpkxxxxxx', // 7 다리
    'xkpxxpkxxxxxx', // 8 다리
    'xkbxxbkxxxxxx', // 9 발톱
    'xxxxxxxxxxxxx', //10 패딩
  ];

  if (!flash) pxGlow(ctx, grid, pal, pw, 'e', '#ff0000', pw * 5);
  pxDraw(ctx, grid, pal, pw);
}

// ============================================================
// ORK BOY  (r ≈ 13)
// 12칸 × 13행  pw = r * 0.27
//
// 핵심 실루엣:
//   행0-5: 두상 (10칸 넓이, 몸통보다 넓음!)
//   행6: 목 (좁아짐)
//   행7-9: 아머 가슴
//   행10-12: 다리
//   찹파: 오른쪽 위로 돌출
//
// k=외곽 g=초록피부 a=아머 t=엄니 e=눈(빨강 글로우) c=찹파 w=날빛
// ============================================================
export function drawOrkBoy(ctx, r, flash) {
  dropShadow(ctx, r);
  const pw  = Math.max(2, Math.round(r * 0.27));
  const pal = flash
    ? { k:'#668866', g:'#aaddaa', a:'#999999', t:'#eeeecc', e:'#ffbbaa', c:'#ccaa88', w:'#eeeeee' }
    : { k:'#0a1a08', g:'#3d8522', a:'#1e1e2e', t:'#e2d292', e:'#ff2000', c:'#7a3a10', w:'#c8c8d0' };

  // 모든 행 12글자 고정
  const grid = [
    'xkggggggkxxx', // 0 두상 상단
    'kggggggggkxx', // 1 두상 (10칸 — 매우 넓음!)
    'kggggggggkcx', // 2 두상 + 찹파
    'kgekgggekwcx', // 3 눈(e) + 찹파날(w)
    'kgkkkkkgkxxx', // 4 두꺼운 눈썹
    'xkgttttgkxxx', // 5 엄니(t)
    'xxkggggkxxxx', // 6 목 (좁아짐)
    'xxkaaaaakxxx', // 7 아머
    'xxkaaaaakxxx', // 8 아머
    'xxxkaaakxxxx', // 9 허리
    'xxxkgxgkxxxx', //10 다리
    'xxxkgxgkxxxx', //11 다리
    'xxxkaxakxxxx', //12 부츠
  ];

  if (!flash) pxGlow(ctx, grid, pal, pw, 'e', '#ff3300', pw * 4);
  pxDraw(ctx, grid, pal, pw);
}

// ============================================================
// TYRANID WARRIOR  (r ≈ 17)
// 14칸 × 14행  pw = r * 0.23
//
// 핵심 실루엣:
//   두개골 크레스트 (왼쪽 위로 뻗음)
//   낫팔 (오른쪽으로 돌출)
//   청록 눈 글로우
//
// k=외곽 p=퍼플몸통 s=카라파스 b=뼈낫 e=눈(청록 글로우)
// ============================================================
export function drawTyranidWarrior(ctx, r, flash) {
  dropShadow(ctx, r);
  const pw  = Math.max(2, Math.round(r * 0.23));
  const pal = flash
    ? { k:'#bbaacc', p:'#ddccee', s:'#ccbbdd', b:'#ddccaa', e:'#aaeeff' }
    : { k:'#10081e', p:'#2d1245', s:'#4a2068', b:'#d0c888', e:'#00ddff' };

  // 모든 행 14글자 고정
  const grid = [
    'kppkxxxxxxxxxx', // 0 두개골 크레스트 (뒤로 돌출)
    'xkppkxxxxxxxxx', // 1 크레스트
    'xxkspkxxxxxbxx', // 2 머리 + 낫 시작
    'xxkepkxxxxkbbx', // 3 눈(e) + 낫날
    'xxkpppkxxxkbbk', // 4 머리/목 + 낫날 최대
    'xxxkpppkxxxxxk', // 5 목
    'xxkpppppkxxxxx', // 6 흉부
    'xkssppppsskxxx', // 7 카라파스 (넓음)
    'xxkppppppkxxxx', // 8 복부
    'xxxkppkkpkxxxx', // 9 다리 분기
    'xxxkpkxxkpkxxx', //10 다리
    'xxxkpkxxkpkxxx', //11 다리
    'xxxkbkxxkbkxxx', //12 발톱
    'xxxxxxxxxxxxxx', //13 패딩
  ];

  if (!flash) pxGlow(ctx, grid, pal, pw, 'e', '#00ccff', pw * 5);
  pxDraw(ctx, grid, pal, pw);
}

// ============================================================
// CARNIFEX  boss  (r ≈ 34)
// 18칸 × 16행  pw = r * 0.18
//
// 핵심 실루엣:
//   보라색 카라파스 돔
//   좌우로 뻗은 거대 발톱(b)
//   열린 턱+이빨(t)
//   빨간 눈 글로우
//   보스 오라 (보라 방사)
//
// k=외곽 p=몸통(다크) c=카라파스(보라) b=뼈발톱 e=눈 t=이빨
// ============================================================
export function drawCarnifex(ctx, r, flash) {
  dropShadow(ctx, r);
  const pw  = Math.max(3, Math.round(r * 0.18));

  if (!flash) {
    const pulse = 0.40 + 0.20 * Math.sin(Date.now() * 0.004);
    const g = ctx.createRadialGradient(0, 0, r * 0.2, 0, 0, r * 1.6);
    g.addColorStop(0, `rgba(130,0,200,${pulse * 0.5})`);
    g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.ellipse(0, 0, r * 1.6, r * 1.6, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  const pal = flash
    ? { k:'#ccbbdd', p:'#ddccee', c:'#eeccff', b:'#eeddaa', e:'#ffbbaa', t:'#ffeebb' }
    : { k:'#0e0418', p:'#1e0c30', c:'#7a28b8', b:'#c8b060', e:'#ff2000', t:'#d4c060' };

  // 모든 행 18글자 고정
  const grid = [
    'xxxxxxkccccckxxxxx', // 0 카라파스 상단
    'xxxxxkccccccckxxxx', // 1 카라파스
    'xxxxkpccccccpkxxxb', // 2 머리+발톱시작
    'xxxkppcccppkxkxbbb', // 3 머리+발톱날
    'xxxketttttekkxkbbk', // 4 눈(e)+이빨(t)+발톱
    'xxxkptttttttxkxkbk', // 5 아랫턱+발톱끝
    'xxxkpppppppkxxxxxx', // 6 목/가슴
    'xxkpppppppppkxxxxx', // 7 가슴
    'xxkppcccccppkxxxxx', // 8 카라파스 가슴
    'xkpcccccccccpkxxxx', // 9 카라파스 넓음
    'kkppccccccccppkxxx', //10 최대 너비
    'xkbbbppppppbbbkxxx', //11 앞뒷다리
    'xxkbbkxxxxkbbkxxxx', //12 발톱
    'xxkbbkxxxxkbbkxxxx', //13 발톱
    'xxxxkppppkxxxxxxxx', //14 배 아래
    'xxxxxkppkxxxxxxxxx', //15 바닥
  ];

  if (!flash) pxGlow(ctx, grid, pal, pw, 'e', '#ff2000', pw * 4);
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
