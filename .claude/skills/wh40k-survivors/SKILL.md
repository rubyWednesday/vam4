---
name: wh40k-survivors
description: WH40K Survivors 바닐라 JS 캔버스 게임 작업. 무기/적 추가, 버그 수정, 로컬 실행, Vercel 배포에 사용.
---

# wh40k-survivors

Vanilla JS + HTML5 Canvas 2D. 빌드 도구 없음, ES Module 직접 실행.
배포: https://wh40k-survivors.vercel.app | 브랜치: ch02-03

---

## 로컬 실행

```powershell
cd wh40k-survivors
python -m http.server 8080   # ES Module은 file:// 불가
# → http://localhost:8080
```

---

## 파일 구조

```
wh40k-survivors/
  index.html
  src/
    main.js       # 진입점, 모바일 캔버스 크기 설정
    game.js       # 게임 루프, 풀 관리, 터치/키보드 이벤트
    engine.js     # ObjectPool(swap-and-pop), Camera, Input, 수학 유틸
    entities.js   # Player, Enemy, XpGem, Projectile, DamageField 등
    weapons.js    # 무기 클래스 + createWeapon() 팩토리
    sprites.js    # 캔버스 직접 렌더링 스프라이트
    ui.js         # HUD, 레벨업 카드(getCardLayout), 메뉴
    data.js       # CANVAS, WAVES, WEAPONS_DATA, PASSIVES_DATA, ENEMY_DATA
    world.js      # 타일맵, 장애물, 아이템
  vercel.json     # { "buildCommand": null, "outputDirectory": ".", "framework": null }
```

---

## 무기 추가 3단계

### 1. `data.js` — WEAPONS_DATA에 스탯 추가
```javascript
myWeapon: {
  id: 'myWeapon', name: 'My Weapon',
  desc: '설명 (레벨업 카드에 표시)',
  color: '#FF0000', type: 'weapon', maxLevel: 8,
  levels: [
    { dmg: 30, cd: 1.5 /*, 커스텀 스탯 */ },
    // ... 8개 레벨
  ],
},
```

### 2. `weapons.js` — 클래스 작성
```javascript
export class MyWeapon extends BaseWeapon {
  constructor(game) { super('myWeapon', game); }

  fire(player, enemies) {
    const { dmg } = this.stats;
    const baseDmg = dmg * player.damageMult;

    // 반드시 [...enemies] 스냅샷 사용 (아래 freeze 규칙 참고)
    for (const e of [...enemies]) {
      if (!e.active) continue;
      const died = e.takeDamage(baseDmg);
      this.game.pools.floatText.acquire(e.x, e.y - e.radius, `${Math.floor(baseDmg)}`, this.data.color, 12);
      if (died) this.game.onEnemyDeath(e);
    }
  }
}
```

### 3. `weapons.js` — createWeapon() 팩토리에 등록
```javascript
case 'myWeapon': return new MyWeapon(game);
```

---

## ⚠️ Freeze 방지 — 이터레이터 규칙

`onEnemyDeath(e)` 내부에서 `pools.enemies.release(e)` 호출 → **swap-and-pop**으로 `active[]` 즉시 변경.
`for...of` 도중 배열이 바뀌면 인덱스가 깨져 freeze 발생.

| 패턴 | 안전 여부 |
|---|---|
| `for (const e of [...enemies])` | ✅ 스냅샷 — 안전 |
| `for (let i = n-1; i >= 0; i--)` | ✅ 역순 인덱스 — 안전 |
| `for (const e of enemies)` + `onEnemyDeath` 호출 | 🔴 **절대 금지** |

읽기 전용 루프(`_nearest()`, 클러스터 탐색 등)는 live array 직접 사용 가능.

---

## 현재 무기 12종

| ID | 이름 | 메커닉 |
|---|---|---|
| `bolter` | Bolter | 최근접 적 추적 단발/연사 |
| `powerSword` | Power Sword | 360° 근접 스윕 |
| `plasmaGun` | Plasma Gun | 대형 추적 탄환 |
| `fragGrenades` | Frag Grenades | AoE 폭탄 + 잔화 필드 |
| `heavyFlamer` | Heavy Flamer | 전방 화염 콘 |
| `lascannon` | Lascannon | 즉발 관통 레이저 선 |
| `stormBolter` | Storm Bolter | 360° 전방위 탄환 spray |
| `meltaGun` | Melta Gun | 근접 진입 시 자동 발동 극고데미지 폭발 |
| `orbitalStrike` | Orbital Strike | 적 밀집지 자동 탐색 궤도 폭격 (10s 쿨) |
| `thunderHammer` | Thunder Hammer | 전방 호 강타 + 거대 넉백 |
| `whirlwind` | Whirlwind | N명 동시 추적 미사일 |
| `chainLightning` | Chain Lightning | 적 간 연쇄 아크 (hop마다 decay) |

---

## 적 추가 방법

```javascript
// data.js — ENEMY_DATA에 추가
newEnemy: {
  id: 'newEnemy', name: 'New Enemy',
  hp: 100, speed: 70, damage: 12, xp: 8,
  radius: 13, color: '#FF0000', scoreValue: 50, isBoss: false,
},
// WAVES의 types 배열에 'newEnemy' 추가
```
`entities.js` `draw()` switch에 케이스, `sprites.js`에 draw 함수 추가.

---

## 모바일 대응

- **캔버스 해상도**: `main.js` — `innerWidth < 900` 시 `CANVAS = 800×450`
- **터치 조이스틱**: `engine.js` Input 클래스 + `game.js` touchstart/move/end
- **레벨업 카드**: `ui.js` `getCardLayout(W, H, n)` — W≤900 시 소형 카드(140×155) 자동
- **일시정지**: 화면 우상단 90×90px 터치 영역

---

## 배포

`ch02-03` 브랜치 push → Vercel 자동 배포.
