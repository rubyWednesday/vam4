'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { UNIT_SPRITES } from './sprites'

// ── TYPES ──────────────────────────────────────────────────────────────────────

type FactionId = 'sm' | 'ork' | 'chaos' | 'nid'
type Phase = 'faction' | 'deploy' | 'battle' | 'result'

interface UnitDef {
  id: string
  name: string
  hp: number
  atk: number
  def: number
  spd: number
  cost: number
  lore: string
}

interface Fighter {
  uid: string
  def: UnitDef
  faction: FactionId
  curHp: number
  alive: boolean
  side: 'player' | 'enemy'
  animClass: '' | 'atk' | 'hit'
}

// ── DATA ───────────────────────────────────────────────────────────────────────

const UNITS: Record<FactionId, UnitDef[]> = {
  sm: [
    { id: 'tac',  name: 'TACTICAL',  hp: 10, atk: 4, def: 2, spd: 3, cost: 2, lore: '"Ultramarines never yield."' },
    { id: 'term', name: 'TERMNATR',  hp: 22, atk: 5, def: 5, spd: 1, cost: 4, lore: '"Cataphractii plate. Unbreakable."' },
    { id: 'sct',  name: 'SCOUT',     hp:  6, atk: 3, def: 1, spd: 5, cost: 1, lore: '"Unseen. Precise."' },
    { id: 'lib',  name: 'LIBRARIAN', hp:  8, atk: 7, def: 2, spd: 4, cost: 3, lore: '"Psyker. Warp-touched."' },
  ],
  ork: [
    { id: 'boy',  name: 'ORK BOY',   hp:  8, atk: 3, def: 1, spd: 2, cost: 1, lore: '"WAAAAGH!"' },
    { id: 'nob',  name: 'NOB',       hp: 14, atk: 5, def: 2, spd: 2, cost: 3, lore: '"Biggest Ork in da mob."' },
    { id: 'wbss', name: 'WARBOSS',   hp: 26, atk: 8, def: 3, spd: 2, cost: 5, lore: '"Da strongest. Period."' },
    { id: 'gret', name: 'GRETCHIN',  hp:  4, atk: 2, def: 0, spd: 4, cost: 1, lore: '"Grot lives. Barely."' },
  ],
  chaos: [
    { id: 'csm',  name: 'CHAOS MRN', hp: 11, atk: 5, def: 2, spd: 3, cost: 2, lore: '"Blessed by dark gods."' },
    { id: 'bzrk', name: 'BERZERKER', hp:  9, atk: 8, def: 1, spd: 4, cost: 3, lore: '"Khorne demands blood."' },
    { id: 'clrd', name: 'CHOS LORD', hp: 20, atk: 6, def: 4, spd: 2, cost: 4, lore: '"Champion of Chaos Undivided."' },
    { id: 'plg',  name: 'PLAGUE MRN',hp: 18, atk: 3, def: 5, spd: 1, cost: 3, lore: '"Nurgle\'s embrace."' },
  ],
  nid: [
    { id: 'hrm',  name: 'HORMAGNT',  hp:  4, atk: 2, def: 0, spd: 5, cost: 1, lore: '"Swarm. Devour. Evolve."' },
    { id: 'war',  name: 'WARRIOR',   hp: 12, atk: 5, def: 2, spd: 3, cost: 3, lore: '"Synapse node. Hive mind."' },
    { id: 'cfx',  name: 'CARNIFEX',  hp: 24, atk: 9, def: 3, spd: 1, cost: 5, lore: '"Living battering ram."' },
    { id: 'lct',  name: 'LICTOR',    hp:  8, atk: 6, def: 1, spd: 5, cost: 3, lore: '"Hunt. Ambush. Vanish."' },
  ],
}

const FACTIONS: Record<FactionId, { name: string; color: string; dim: string; enemy: FactionId; cry: string; desc: string }> = {
  sm:    { name: 'SPACE MARINES', color: '#4488ff', dim: '#112244', enemy: 'ork',   cry: 'FOR THE EMPEROR!',   desc: 'Balanced. Righteous. Relentless.' },
  ork:   { name: 'ORKS',          color: '#44cc22', dim: '#112200', enemy: 'sm',    cry: 'WAAAAGH!!',          desc: 'Brute force. Tons of HP.' },
  chaos: { name: 'CHAOS',         color: '#ff4422', dim: '#330000', enemy: 'nid',   cry: 'BLOOD FOR KHORNE!', desc: 'High attack. Unpredictable.' },
  nid:   { name: 'TYRANIDS',      color: '#cc44ff', dim: '#220033', enemy: 'chaos', cry: 'THE HIVE HUNGERS.', desc: 'Swarm tactics. Speed kills.' },
}

const DEPLOY_POINTS = 8

// ── SVG SPRITE COMPONENT ──────────────────────────────────────────────────────

function UnitSprite({ unitId, size = 56 }: { unitId: string; size?: number }) {
  const Sprite = UNIT_SPRITES[unitId]
  if (!Sprite) return <div style={{ width: size * 0.7, height: size }} />
  return <Sprite size={size} />
}

// ── HP BAR ─────────────────────────────────────────────────────────────────────

function HpBar({ cur, max, color }: { cur: number; max: number; color: string }) {
  const pct = Math.max(0, (cur / max) * 100)
  return (
    <div className="w-full h-2 bg-black border border-gray-700 mt-1">
      <div
        style={{ width: `${pct}%`, backgroundColor: pct > 50 ? '#44ff44' : pct > 25 ? '#ffaa00' : '#ff2222', transition: 'width 0.3s' }}
        className="h-full"
      />
    </div>
  )
}

// ── UNIT CARD (deploy phase) ────────────────────────────────────────────────────

function UnitCard({ def, faction, count, onAdd, onRemove, disabled }: {
  def: UnitDef; faction: FactionId; count: number
  onAdd: () => void; onRemove: () => void; disabled: boolean
}) {
  const fc = FACTIONS[faction]
  return (
    <div
      className="border p-2 flex flex-col gap-1 cursor-pointer select-none"
      style={{ borderColor: fc.color, background: `${fc.dim}cc`, minWidth: 130 }}
    >
      <div className="flex justify-center mb-1">
        <UnitSprite unitId={def.id} size={52} />
      </div>
      <div className="text-center text-xs font-bold" style={{ color: fc.color, fontFamily: 'monospace', fontSize: 9 }}>
        {def.name}
      </div>
      <div className="grid grid-cols-2 gap-x-2 text-xs" style={{ fontSize: 8, fontFamily: 'monospace', color: '#aaa' }}>
        <span>HP:{def.hp}</span><span>ATK:{def.atk}</span>
        <span>DEF:{def.def}</span><span>SPD:{def.spd}</span>
      </div>
      <div style={{ fontSize: 7, color: '#888', fontFamily: 'monospace' }}>{def.lore}</div>
      <div className="flex items-center justify-between mt-1">
        <span style={{ fontSize: 9, color: '#ffaa00', fontFamily: 'monospace' }}>COST:{def.cost}</span>
        <div className="flex gap-1 items-center">
          <button
            onClick={onRemove} disabled={count === 0}
            className="w-5 h-5 text-center leading-none border disabled:opacity-30"
            style={{ borderColor: fc.color, color: fc.color, fontSize: 12 }}
          >-</button>
          <span style={{ fontSize: 10, color: '#fff', fontFamily: 'monospace', minWidth: 10, textAlign: 'center' }}>{count}</span>
          <button
            onClick={onAdd} disabled={disabled}
            className="w-5 h-5 text-center leading-none border disabled:opacity-30"
            style={{ borderColor: fc.color, color: fc.color, fontSize: 12 }}
          >+</button>
        </div>
      </div>
    </div>
  )
}

// ── FIGHTER CARD (battle phase) ─────────────────────────────────────────────────

function FighterCard({ f }: { f: Fighter }) {
  const fc = FACTIONS[f.faction]
  const isHurt = f.animClass === 'hit'
  const isAtk  = f.animClass === 'atk'
  return (
    <div
      className="flex flex-col items-center p-1 border transition-all duration-100"
      style={{
        borderColor: f.alive ? fc.color : '#333',
        background: f.alive ? `${fc.dim}cc` : '#111',
        opacity: f.alive ? 1 : 0.35,
        transform: isHurt ? 'translateX(4px)' : isAtk ? (f.side === 'player' ? 'translateX(6px)' : 'translateX(-6px)') : 'none',
        filter: isHurt ? 'brightness(3)' : 'none',
        minWidth: 60,
      }}
    >
      <UnitSprite unitId={f.def.id} size={44} />
      <div style={{ fontSize: 7, color: fc.color, fontFamily: 'monospace', marginTop: 2 }}>{f.def.name}</div>
      {f.alive
        ? <HpBar cur={f.curHp} max={f.def.hp} color={fc.color} />
        : <div style={{ fontSize: 8, color: '#ff2222', fontFamily: 'monospace' }}>DEAD</div>
      }
      {f.alive && (
        <div style={{ fontSize: 6, color: '#888', fontFamily: 'monospace' }}>{f.curHp}/{f.def.hp}</div>
      )}
    </div>
  )
}

// ── BATTLE ENGINE ──────────────────────────────────────────────────────────────

function buildEnemyArmy(faction: FactionId): UnitDef[] {
  const pool = UNITS[faction]
  const result: UnitDef[] = []
  let pts = DEPLOY_POINTS
  // Greedy fill: pick cheapest available units first
  const sorted = [...pool].sort((a, b) => a.cost - b.cost)
  while (pts > 0) {
    const affordable = sorted.filter(u => u.cost <= pts)
    if (!affordable.length) break
    const pick = affordable[Math.floor(Math.random() * affordable.length)]
    result.push(pick)
    pts -= pick.cost
  }
  return result
}

function makeFighters(defs: UnitDef[], faction: FactionId, side: 'player' | 'enemy'): Fighter[] {
  return defs.map((def, i) => ({
    uid: `${side}-${faction}-${def.id}-${i}`,
    def,
    faction,
    curHp: def.hp,
    alive: true,
    side,
    animClass: '',
  }))
}

interface BattleStep {
  attackerUid: string
  targetUid: string
  damage: number
  log: string
  state: Fighter[]
}

function simulateBattle(playerFighters: Fighter[], enemyFighters: Fighter[]): BattleStep[] {
  const steps: BattleStep[] = []
  const all: Fighter[] = [...playerFighters.map(f => ({ ...f })), ...enemyFighters.map(f => ({ ...f }))]

  const getAlive = (side: 'player' | 'enemy') => all.filter(f => f.side === side && f.alive)

  let rounds = 0
  while (getAlive('player').length > 0 && getAlive('enemy').length > 0 && rounds < 200) {
    rounds++
    const sorted = all.filter(f => f.alive).sort((a, b) => b.def.spd - a.def.spd)

    for (const attacker of sorted) {
      if (!attacker.alive) continue
      const enemies = getAlive(attacker.side === 'player' ? 'enemy' : 'player')
      if (!enemies.length) break

      const target = enemies[Math.floor(Math.random() * enemies.length)]
      const raw = attacker.def.atk - target.def.def
      const dmg = Math.max(1, raw + Math.floor(Math.random() * 3) - 1)  // ±1 variance
      target.curHp = Math.max(0, target.curHp - dmg)
      if (target.curHp === 0) target.alive = false

      const fc1 = FACTIONS[attacker.faction]
      const fc2 = FACTIONS[target.faction]
      const log = target.alive
        ? `${attacker.def.name} → ${target.def.name}  [-${dmg}HP]  (${target.curHp}/${target.def.hp} left)`
        : `${attacker.def.name} → ${target.def.name}  [-${dmg}HP]  ☠ SLAIN`

      steps.push({
        attackerUid: attacker.uid,
        targetUid: target.uid,
        damage: dmg,
        log,
        state: all.map(f => ({ ...f, animClass: '' as '' | 'atk' | 'hit' })),
      })

      if (getAlive('player').length === 0 || getAlive('enemy').length === 0) break
    }
  }

  return steps
}

// ── MAIN COMPONENT ─────────────────────────────────────────────────────────────

export default function GamePage() {
  const [phase, setPhase] = useState<Phase>('faction')
  const [playerFaction, setPlayerFaction] = useState<FactionId | null>(null)
  const [roster, setRoster] = useState<Record<string, number>>({})   // unitId → count
  const [fighters, setFighters] = useState<Fighter[]>([])
  const [battleSteps, setBattleSteps] = useState<BattleStep[]>([])
  const [stepIdx, setStepIdx] = useState(0)
  const [battleLog, setBattleLog] = useState<string[]>([])
  const [isPlaying, setIsPlaying] = useState(false)
  const [winner, setWinner] = useState<'player' | 'enemy' | null>(null)
  const logRef = useRef<HTMLDivElement>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // ── points used
  const usedPoints = playerFaction
    ? Object.entries(roster).reduce((sum, [id, cnt]) => {
        const u = UNITS[playerFaction].find(u => u.id === id)
        return sum + (u ? u.cost * cnt : 0)
      }, 0)
    : 0

  const deployedCount = Object.values(roster).reduce((a, b) => a + b, 0)

  // ── scroll log
  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight
  }, [battleLog])

  // ── auto-play battle
  useEffect(() => {
    if (!isPlaying || stepIdx >= battleSteps.length) {
      if (isPlaying && stepIdx >= battleSteps.length) {
        setIsPlaying(false)
        // determine winner
        const last = battleSteps[battleSteps.length - 1]
        if (last) {
          const pAlive = last.state.filter(f => f.side === 'player' && f.alive).length
          const eAlive = last.state.filter(f => f.side === 'enemy' && f.alive).length
          setWinner(pAlive > 0 ? 'player' : 'enemy')
          setPhase('result')
        }
      }
      return
    }

    timerRef.current = setTimeout(() => {
      const step = battleSteps[stepIdx]

      // apply anim
      setFighters(prev => prev.map(f => ({
        ...f,
        ...step.state.find(s => s.uid === f.uid),
        animClass: f.uid === step.attackerUid ? 'atk' : f.uid === step.targetUid ? 'hit' : '',
      })))

      setBattleLog(prev => [...prev, step.log])
      setStepIdx(i => i + 1)

      // clear anim after 200ms
      timerRef.current = setTimeout(() => {
        setFighters(prev => prev.map(f => ({ ...f, animClass: '' })))
      }, 200)
    }, 350)

    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [isPlaying, stepIdx, battleSteps])

  // ── HANDLERS ────────────────────────────────────────────────────────────────

  const selectFaction = (f: FactionId) => {
    setPlayerFaction(f)
    setRoster({})
    setPhase('deploy')
  }

  const addUnit = (unitId: string, cost: number) => {
    if (usedPoints + cost > DEPLOY_POINTS) return
    setRoster(r => ({ ...r, [unitId]: (r[unitId] ?? 0) + 1 }))
  }

  const removeUnit = (unitId: string) => {
    setRoster(r => {
      const next = { ...r }
      if ((next[unitId] ?? 0) > 0) next[unitId]--
      return next
    })
  }

  const startBattle = useCallback(() => {
    if (!playerFaction || deployedCount === 0) return
    const enemy = FACTIONS[playerFaction].enemy

    const playerDefs: UnitDef[] = Object.entries(roster).flatMap(([id, cnt]) => {
      const u = UNITS[playerFaction].find(u => u.id === id)!
      return Array(cnt).fill(u)
    })
    const enemyDefs = buildEnemyArmy(enemy)

    const pf = makeFighters(playerDefs, playerFaction, 'player')
    const ef = makeFighters(enemyDefs, enemy, 'enemy')
    const steps = simulateBattle(pf, ef)

    setFighters([...pf, ...ef])
    setBattleSteps(steps)
    setStepIdx(0)
    setBattleLog([`═══ BATTLE START ═══`, `${FACTIONS[playerFaction].name} vs ${FACTIONS[enemy].name}`])
    setWinner(null)
    setPhase('battle')

    setTimeout(() => setIsPlaying(true), 600)
  }, [playerFaction, roster, deployedCount])

  const reset = () => {
    setPhase('faction')
    setPlayerFaction(null)
    setRoster({})
    setFighters([])
    setBattleSteps([])
    setStepIdx(0)
    setBattleLog([])
    setIsPlaying(false)
    setWinner(null)
  }

  // ── RENDER ───────────────────────────────────────────────────────────────────

  const pixelFont: React.CSSProperties = {
    fontFamily: '"Courier New", Courier, monospace',
    letterSpacing: '0.05em',
  }

  return (
    <div className="min-h-screen bg-black text-white" style={pixelFont}>
      {/* CRT scanlines overlay */}
      <div
        className="fixed inset-0 pointer-events-none z-50"
        style={{
          background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.08) 2px, rgba(0,0,0,0.08) 4px)',
        }}
      />

      {/* Header */}
      <div className="border-b border-gray-800 p-3 text-center" style={{ background: '#0a0a0a' }}>
        <div style={{ fontSize: 11, color: '#ffaa00', letterSpacing: 4 }}>WARHAMMER 40.000</div>
        <div style={{ fontSize: 18, color: '#ffffff', letterSpacing: 3, marginTop: 2 }}>AUTO-BATTLER</div>
        <div style={{ fontSize: 8, color: '#555', marginTop: 2 }}>8-BIT EDITION • {new Date().getFullYear()}</div>
      </div>

      <div className="max-w-5xl mx-auto p-4">

        {/* ── PHASE: FACTION SELECT ── */}
        {phase === 'faction' && (
          <div>
            <div className="text-center mb-6" style={{ fontSize: 10, color: '#888', letterSpacing: 2 }}>
              CHOOSE YOUR FACTION
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {(Object.entries(FACTIONS) as [FactionId, typeof FACTIONS[FactionId]][]).map(([id, f]) => (
                <button
                  key={id}
                  onClick={() => selectFaction(id)}
                  className="border p-4 text-left hover:opacity-90 active:scale-95 transition-transform"
                  style={{ borderColor: f.color, background: `${f.dim}`, cursor: 'pointer' }}
                >
                  {/* preview sprites */}
                  <div className="flex gap-1 mb-3 justify-center">
                    {UNITS[id].slice(0, 2).map(u => (
                      <UnitSprite key={u.id} unitId={u.id} size={40} />
                    ))}
                  </div>
                  <div style={{ fontSize: 11, color: f.color, fontWeight: 'bold', letterSpacing: 1 }}>{f.name}</div>
                  <div style={{ fontSize: 8, color: '#aaa', marginTop: 4 }}>{f.desc}</div>
                  <div style={{ fontSize: 9, color: f.color, marginTop: 6, fontStyle: 'italic' }}>{f.cry}</div>
                  <div style={{ fontSize: 7, color: '#555', marginTop: 4 }}>
                    ENEMY: {FACTIONS[f.enemy].name}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── PHASE: DEPLOYMENT ── */}
        {phase === 'deploy' && playerFaction && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <button onClick={reset} style={{ fontSize: 9, color: '#666' }}>← BACK</button>
              <div style={{ fontSize: 10, color: FACTIONS[playerFaction].color, letterSpacing: 2 }}>
                DEPLOY — {FACTIONS[playerFaction].name}
              </div>
              <div style={{ fontSize: 10, color: usedPoints >= DEPLOY_POINTS ? '#ff4422' : '#ffaa00' }}>
                PTS: {usedPoints}/{DEPLOY_POINTS}
              </div>
            </div>

            {/* point bar */}
            <div className="w-full h-3 bg-black border border-gray-700 mb-4">
              <div
                style={{
                  width: `${(usedPoints / DEPLOY_POINTS) * 100}%`,
                  background: usedPoints >= DEPLOY_POINTS ? '#ff4422' : FACTIONS[playerFaction].color,
                  height: '100%',
                  transition: 'width 0.2s'
                }}
              />
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              {UNITS[playerFaction].map(u => (
                <UnitCard
                  key={u.id}
                  def={u}
                  faction={playerFaction}
                  count={roster[u.id] ?? 0}
                  onAdd={() => addUnit(u.id, u.cost)}
                  onRemove={() => removeUnit(u.id)}
                  disabled={usedPoints + u.cost > DEPLOY_POINTS}
                />
              ))}
            </div>

            <div className="text-center">
              <button
                onClick={startBattle}
                disabled={deployedCount === 0}
                className="border px-8 py-3 disabled:opacity-30 hover:opacity-90 active:scale-95 transition-transform"
                style={{
                  borderColor: FACTIONS[playerFaction].color,
                  color: FACTIONS[playerFaction].color,
                  fontSize: 14,
                  letterSpacing: 3,
                  background: `${FACTIONS[playerFaction].dim}`,
                  cursor: deployedCount > 0 ? 'pointer' : 'default',
                }}
              >
                ▶ BATTLE!
              </button>
              {deployedCount === 0 && (
                <div style={{ fontSize: 8, color: '#555', marginTop: 8 }}>ADD UNITS TO DEPLOY</div>
              )}
            </div>
          </div>
        )}

        {/* ── PHASE: BATTLE ── */}
        {phase === 'battle' && playerFaction && (
          <div>
            <div className="flex justify-between items-center mb-3">
              <div style={{ fontSize: 9, color: FACTIONS[playerFaction].color }}>
                ▶ {FACTIONS[playerFaction].name}
              </div>
              <div style={{ fontSize: 9, color: '#555' }}>
                STEP {Math.min(stepIdx, battleSteps.length)}/{battleSteps.length}
              </div>
              <div style={{ fontSize: 9, color: FACTIONS[FACTIONS[playerFaction].enemy].color }}>
                {FACTIONS[FACTIONS[playerFaction].enemy].name} ◀
              </div>
            </div>

            {/* Battlefield */}
            <div className="border border-gray-800 p-3 mb-3" style={{ background: '#0a0a0a' }}>
              <div className="flex gap-2 justify-start flex-wrap mb-2">
                <div style={{ fontSize: 8, color: '#555' }}>YOUR FORCES</div>
                <div className="flex flex-wrap gap-1">
                  {fighters.filter(f => f.side === 'player').map(f => (
                    <FighterCard key={f.uid} f={f} />
                  ))}
                </div>
              </div>
              <div className="border-t border-dashed border-gray-800 my-2" />
              <div className="flex gap-2 justify-start flex-wrap">
                <div style={{ fontSize: 8, color: '#555' }}>ENEMY FORCES</div>
                <div className="flex flex-wrap gap-1">
                  {fighters.filter(f => f.side === 'enemy').map(f => (
                    <FighterCard key={f.uid} f={f} />
                  ))}
                </div>
              </div>
            </div>

            {/* Battle Log */}
            <div
              ref={logRef}
              className="border border-gray-800 p-2 h-36 overflow-y-auto"
              style={{ background: '#050505' }}
            >
              {battleLog.map((line, i) => (
                <div
                  key={i}
                  style={{
                    fontSize: 8,
                    color: line.includes('SLAIN') ? '#ff4422' : line.includes('═══') ? '#ffaa00' : '#888',
                    marginBottom: 1,
                    fontFamily: 'monospace',
                  }}
                >
                  {line}
                </div>
              ))}
              {isPlaying && (
                <div style={{ fontSize: 8, color: '#444', animation: 'pulse 1s infinite' }}>▮</div>
              )}
            </div>
          </div>
        )}

        {/* ── PHASE: RESULT ── */}
        {phase === 'result' && playerFaction && (
          <div className="text-center py-12">
            <div style={{ fontSize: 9, color: '#555', letterSpacing: 3, marginBottom: 12 }}>
              BATTLE COMPLETE
            </div>
            {winner === 'player' ? (
              <>
                <div style={{ fontSize: 28, color: '#44ff44', letterSpacing: 4 }}>VICTORY!</div>
                <div style={{ fontSize: 10, color: FACTIONS[playerFaction].color, marginTop: 8 }}>
                  {FACTIONS[playerFaction].cry}
                </div>
                <div style={{ fontSize: 8, color: '#555', marginTop: 12 }}>
                  {FACTIONS[playerFaction].name} CRUSHED {FACTIONS[FACTIONS[playerFaction].enemy].name}
                </div>
              </>
            ) : (
              <>
                <div style={{ fontSize: 28, color: '#ff2222', letterSpacing: 4 }}>DEFEAT.</div>
                <div style={{ fontSize: 10, color: FACTIONS[FACTIONS[playerFaction].enemy].color, marginTop: 8 }}>
                  {FACTIONS[FACTIONS[playerFaction].enemy].cry}
                </div>
                <div style={{ fontSize: 8, color: '#555', marginTop: 12 }}>
                  YOUR FORCES HAVE BEEN ANNIHILATED
                </div>
              </>
            )}

            {/* survivor count */}
            <div className="flex justify-center gap-8 mt-8 mb-8">
              {(['player', 'enemy'] as const).map(side => {
                const lastStep = battleSteps[battleSteps.length - 1]
                const alive = lastStep?.state.filter(f => f.side === side && f.alive).length ?? 0
                const total = lastStep?.state.filter(f => f.side === side).length ?? 0
                const fc = side === 'player' ? playerFaction : FACTIONS[playerFaction].enemy
                return (
                  <div key={side}>
                    <div style={{ fontSize: 8, color: '#555' }}>{side === 'player' ? 'YOUR' : 'ENEMY'} FORCES</div>
                    <div style={{ fontSize: 18, color: FACTIONS[fc].color, marginTop: 4 }}>
                      {alive}/{total}
                    </div>
                    <div style={{ fontSize: 7, color: '#555' }}>SURVIVED</div>
                  </div>
                )
              })}
            </div>

            <button
              onClick={reset}
              className="border px-8 py-3 hover:opacity-90 active:scale-95 transition-transform"
              style={{ borderColor: '#555', color: '#aaa', fontSize: 10, letterSpacing: 3, cursor: 'pointer' }}
            >
              ↺ PLAY AGAIN
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
