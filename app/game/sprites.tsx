// WH40K Unit SVG Sprites — miniature-inspired pixel/vector art

type SP = { size?: number }

// ── SPACE MARINES ─────────────────────────────────────────────────────────────

export function SpriteTactical({ size = 64 }: SP) {
  const w = size * 0.7, h = size
  return (
    <svg width={w} height={h} viewBox="0 0 42 60" fill="none">
      {/* Backpack */}
      <rect x="14" y="5" width="14" height="10" rx="1" fill="#1e3a8a"/>
      <rect x="16" y="6" width="3" height="8" rx="0.5" fill="#0f172a"/>
      <rect x="21" y="6" width="3" height="8" rx="0.5" fill="#0f172a"/>
      {/* Helmet dome */}
      <path d="M13 16 Q13 6 21 6 Q29 6 29 16 Z" fill="#1d4ed8"/>
      <rect x="13" y="13" width="16" height="8" rx="1.5" fill="#1d4ed8"/>
      {/* T-visor gold bar */}
      <rect x="12" y="14" width="18" height="3" rx="1" fill="#d97706"/>
      {/* T-visor vertical */}
      <rect x="18.5" y="12" width="5" height="7" rx="0.5" fill="#92400e"/>
      {/* Eye lenses - red glowing */}
      <ellipse cx="16" cy="15.5" rx="2.5" ry="1.8" fill="#dc2626"/>
      <ellipse cx="26" cy="15.5" rx="2.5" ry="1.8" fill="#dc2626"/>
      <ellipse cx="16" cy="15.5" rx="1.2" ry="0.9" fill="#fca5a5"/>
      <ellipse cx="26" cy="15.5" rx="1.2" ry="0.9" fill="#fca5a5"/>
      {/* Chin guard */}
      <rect x="16" y="21" width="10" height="4" rx="1" fill="#1d4ed8"/>
      {/* Left shoulder pad */}
      <ellipse cx="7" cy="28" rx="8" ry="5" fill="#1e40af"/>
      <ellipse cx="7" cy="28" rx="6.5" ry="3.8" fill="#3b82f6"/>
      <text x="3.5" y="30.5" fontSize="5" fill="#fff" fontWeight="bold">U</text>
      {/* Right shoulder pad */}
      <ellipse cx="35" cy="28" rx="8" ry="5" fill="#1e40af"/>
      <ellipse cx="35" cy="28" rx="6.5" ry="3.8" fill="#3b82f6"/>
      {/* Torso */}
      <rect x="13" y="25" width="16" height="16" rx="2" fill="#2563eb"/>
      <rect x="13" y="25" width="16" height="1.5" fill="#d97706"/>
      <rect x="13" y="39.5" width="16" height="1" fill="#d97706"/>
      {/* Aquila wings */}
      <path d="M21 31 Q17 28 13 30 Q16 28 21 32Z" fill="#d97706"/>
      <path d="M21 31 Q25 28 29 30 Q26 28 21 32Z" fill="#d97706"/>
      <ellipse cx="21" cy="31" rx="2.5" ry="2" fill="#d97706"/>
      <circle cx="21" cy="29.5" r="1.5" fill="#d97706"/>
      {/* Left arm */}
      <rect x="7" y="28" width="7" height="13" rx="2" fill="#2563eb"/>
      {/* Right arm */}
      <rect x="28" y="28" width="7" height="13" rx="2" fill="#2563eb"/>
      {/* Bolter */}
      <rect x="28" y="32" width="14" height="6" rx="1.5" fill="#1f2937"/>
      <rect x="29" y="33" width="11" height="4" rx="1" fill="#374151"/>
      <rect x="31" y="37" width="4" height="3.5" rx="0.5" fill="#111827"/>
      <rect x="40" y="33.5" width="4" height="2.5" fill="#0f172a"/>
      {/* Belt */}
      <rect x="13" y="41" width="16" height="4" rx="1" fill="#6b7280"/>
      <rect x="18" y="41.5" width="6" height="3" rx="0.5" fill="#d97706"/>
      {/* Legs */}
      <rect x="13" y="45" width="7" height="11" rx="1.5" fill="#2563eb"/>
      <rect x="22" y="45" width="7" height="11" rx="1.5" fill="#2563eb"/>
      {/* Knee pads */}
      <ellipse cx="16.5" cy="47" rx="3.5" ry="2.5" fill="#6b7280"/>
      <ellipse cx="25.5" cy="47" rx="3.5" ry="2.5" fill="#6b7280"/>
      <circle cx="16.5" cy="47" r="2" fill="#d97706"/>
      <circle cx="25.5" cy="47" r="2" fill="#d97706"/>
      {/* Boots */}
      <rect x="12" y="54" width="9" height="5" rx="1.5" fill="#1e3a8a"/>
      <rect x="21" y="54" width="9" height="5" rx="1.5" fill="#1e3a8a"/>
    </svg>
  )
}

export function SpriteTerminator({ size = 64 }: SP) {
  const w = size * 0.8, h = size
  return (
    <svg width={w} height={h} viewBox="0 0 48 60" fill="none">
      {/* Very bulky - Cataphractii pattern */}
      {/* Helmet - broader, squarer */}
      <rect x="14" y="4" width="20" height="16" rx="3" fill="#1d4ed8"/>
      <path d="M14 10 Q14 4 24 4 Q34 4 34 10 Z" fill="#1e40af"/>
      {/* Visor gold slit */}
      <rect x="13" y="12" width="22" height="4" rx="1.5" fill="#d97706"/>
      <rect x="20" y="10" width="8" height="8" rx="0.5" fill="#92400e"/>
      <rect x="16" y="13" width="5" height="2" fill="#dc2626"/>
      <rect x="27" y="13" width="5" height="2" fill="#dc2626"/>
      {/* Gorget - thick */}
      <rect x="16" y="20" width="16" height="5" rx="1" fill="#1e40af"/>
      {/* Cataphractii - huge curved shoulder pads */}
      <path d="M0 28 Q0 18 10 20 L15 30 Q7 32 0 28Z" fill="#1e40af"/>
      <path d="M2 28 Q2 20 10 21 L14 29 Q8 30 2 28Z" fill="#3b82f6"/>
      <path d="M48 28 Q48 18 38 20 L33 30 Q41 32 48 28Z" fill="#1e40af"/>
      <path d="M46 28 Q46 20 38 21 L34 29 Q40 30 46 28Z" fill="#3b82f6"/>
      {/* Torso - thick slab */}
      <rect x="12" y="25" width="24" height="18" rx="2" fill="#2563eb"/>
      <rect x="12" y="25" width="24" height="2" fill="#d97706"/>
      {/* Aquila */}
      <path d="M24 33 Q19 29 14 32 Q18 29 24 34Z" fill="#d97706"/>
      <path d="M24 33 Q29 29 34 32 Q30 29 24 34Z" fill="#d97706"/>
      <circle cx="24" cy="32" r="3" fill="#d97706"/>
      {/* Left arm - power fist */}
      <rect x="4" y="28" width="10" height="16" rx="2" fill="#2563eb"/>
      {/* Power fist knuckles */}
      <rect x="2" y="40" width="12" height="6" rx="2" fill="#3b82f6"/>
      <rect x="3" y="38" width="3" height="5" rx="1" fill="#6b7280"/>
      <rect x="7" y="38" width="3" height="5" rx="1" fill="#6b7280"/>
      <rect x="11" y="38" width="3" height="5" rx="1" fill="#6b7280"/>
      {/* Right arm - storm bolter */}
      <rect x="34" y="28" width="10" height="14" rx="2" fill="#2563eb"/>
      {/* Storm bolter - twin barrels */}
      <rect x="34" y="34" width="16" height="8" rx="1.5" fill="#1f2937"/>
      <rect x="35" y="35" width="14" height="3" rx="1" fill="#374151"/>
      <rect x="35" y="38" width="14" height="3" rx="1" fill="#374151"/>
      <rect x="48" y="35" width="3" height="2" fill="#0f172a"/>
      <rect x="48" y="38" width="3" height="2" fill="#0f172a"/>
      {/* Belt */}
      <rect x="12" y="43" width="24" height="4" rx="1" fill="#6b7280"/>
      {/* Thick legs */}
      <rect x="12" y="47" width="10" height="10" rx="2" fill="#2563eb"/>
      <rect x="26" y="47" width="10" height="10" rx="2" fill="#2563eb"/>
      {/* Greaves */}
      <rect x="11" y="54" width="12" height="5" rx="2" fill="#1e3a8a"/>
      <rect x="25" y="54" width="12" height="5" rx="2" fill="#1e3a8a"/>
    </svg>
  )
}

export function SpriteScout({ size = 64 }: SP) {
  const w = size * 0.65, h = size
  return (
    <svg width={w} height={h} viewBox="0 0 38 60" fill="none">
      {/* Scout helmet - lighter, no backpack */}
      <path d="M11 16 Q11 8 19 8 Q27 8 27 16 Z" fill="#1d4ed8"/>
      <rect x="11" y="13" width="16" height="8" rx="1.5" fill="#1d4ed8"/>
      {/* Visor - smaller, scout style */}
      <rect x="12" y="14.5" width="14" height="3" rx="1" fill="#374151"/>
      <rect x="14" y="15" width="4" height="2" fill="#22d3ee" opacity="0.8"/>
      <rect x="20" y="15" width="4" height="2" fill="#22d3ee" opacity="0.8"/>
      {/* Chin */}
      <rect x="14" y="21" width="10" height="3" rx="1" fill="#1d4ed8"/>
      {/* Smaller shoulder pads */}
      <ellipse cx="8" cy="26" rx="6" ry="4" fill="#1e40af"/>
      <ellipse cx="8" cy="26" rx="5" ry="3" fill="#3b82f6"/>
      <ellipse cx="30" cy="26" rx="6" ry="4" fill="#1e40af"/>
      <ellipse cx="30" cy="26" rx="5" ry="3" fill="#3b82f6"/>
      {/* Torso - lighter scout armor */}
      <rect x="12" y="24" width="14" height="14" rx="1.5" fill="#1e40af"/>
      <rect x="14" y="26" width="10" height="10" rx="1" fill="#1d4ed8"/>
      {/* Cloak/camocloak behind */}
      <path d="M8 24 L5 50 L33 50 L30 24Z" fill="#166534" opacity="0.4"/>
      {/* Arms */}
      <rect x="7" y="26" width="6" height="12" rx="1.5" fill="#1d4ed8"/>
      <rect x="25" y="26" width="6" height="12" rx="1.5" fill="#1d4ed8"/>
      {/* Sniper rifle */}
      <rect x="24" y="29" width="16" height="3.5" rx="1" fill="#1f2937"/>
      <rect x="25" y="29.5" width="14" height="2.5" rx="0.5" fill="#374151"/>
      {/* Scope */}
      <rect x="28" y="27.5" width="6" height="2.5" rx="0.5" fill="#111827"/>
      <rect x="38" y="30" width="4" height="1.5" fill="#0f172a"/>
      {/* Belt - webbing */}
      <rect x="12" y="38" width="14" height="3.5" rx="1" fill="#374151"/>
      <rect x="14" y="38.5" width="3" height="2.5" fill="#6b7280"/>
      <rect x="19" y="38.5" width="3" height="2.5" fill="#6b7280"/>
      {/* Legs - fatigue trousers */}
      <rect x="12" y="41" width="6" height="13" rx="1.5" fill="#1d4ed8"/>
      <rect x="20" y="41" width="6" height="13" rx="1.5" fill="#1d4ed8"/>
      {/* Boots */}
      <rect x="11" y="52" width="8" height="6" rx="1.5" fill="#1e3a8a"/>
      <rect x="19" y="52" width="8" height="6" rx="1.5" fill="#1e3a8a"/>
    </svg>
  )
}

export function SpriteLibrarian({ size = 64 }: SP) {
  const w = size * 0.7, h = size
  return (
    <svg width={w} height={h} viewBox="0 0 42 60" fill="none">
      {/* Psychic hood - large cowl behind head */}
      <path d="M8 14 Q8 2 21 2 Q34 2 34 14 Q34 20 21 22 Q8 20 8 14Z" fill="#1e3a8a"/>
      <path d="M10 14 Q10 5 21 5 Q32 5 32 14 Q32 19 21 21 Q10 19 10 14Z" fill="#1d4ed8"/>
      {/* Hood aura */}
      <ellipse cx="21" cy="12" rx="13" ry="11" fill="none" stroke="#818cf8" strokeWidth="0.8" opacity="0.7"/>
      {/* Helmet */}
      <rect x="13" y="10" width="16" height="10" rx="2" fill="#1d4ed8"/>
      <path d="M13 14 Q13 8 21 8 Q29 8 29 14Z" fill="#1e40af"/>
      {/* Visor - blue psychic energy */}
      <rect x="12" y="13" width="18" height="3" rx="1" fill="#4338ca"/>
      <rect x="14" y="13.5" width="6" height="2" fill="#818cf8" opacity="0.9"/>
      <rect x="22" y="13.5" width="6" height="2" fill="#818cf8" opacity="0.9"/>
      {/* Psychic glow effect */}
      <ellipse cx="17" cy="14.5" rx="3" ry="1.5" fill="#c7d2fe" opacity="0.7"/>
      <ellipse cx="25" cy="14.5" rx="3" ry="1.5" fill="#c7d2fe" opacity="0.7"/>
      {/* Shoulders */}
      <ellipse cx="7" cy="27" rx="8" ry="5" fill="#1e3a8a"/>
      <ellipse cx="7" cy="27" rx="6.5" ry="4" fill="#3730a3"/>
      <ellipse cx="35" cy="27" rx="8" ry="5" fill="#1e3a8a"/>
      <ellipse cx="35" cy="27" rx="6.5" ry="4" fill="#3730a3"/>
      {/* Torso - purple blue mix */}
      <rect x="13" y="23" width="16" height="16" rx="2" fill="#3730a3"/>
      <rect x="13" y="23" width="16" height="1.5" fill="#818cf8"/>
      {/* Tome/book icon on chest */}
      <rect x="17" y="27" width="8" height="10" rx="0.5" fill="#4338ca"/>
      <rect x="18" y="28" width="6" height="8" rx="0.5" fill="#1e1b4b"/>
      <rect x="19" y="30" width="4" height="0.5" fill="#818cf8"/>
      <rect x="19" y="32" width="4" height="0.5" fill="#818cf8"/>
      <rect x="19" y="34" width="4" height="0.5" fill="#818cf8"/>
      {/* Left arm */}
      <rect x="7" y="28" width="7" height="13" rx="2" fill="#3730a3"/>
      {/* Right arm - force staff */}
      <rect x="28" y="28" width="7" height="13" rx="2" fill="#3730a3"/>
      {/* Force Staff */}
      <rect x="34" y="5" width="3" height="36" rx="1" fill="#374151"/>
      <rect x="34.5" y="6" width="2" height="35" rx="0.5" fill="#6b7280"/>
      {/* Staff top - psychic gem */}
      <polygon points="35.5,2 32,7 39,7" fill="#818cf8"/>
      <ellipse cx="35.5" cy="6" rx="3" ry="3" fill="#a5b4fc"/>
      <ellipse cx="35.5" cy="6" rx="1.5" ry="1.5" fill="#e0e7ff"/>
      {/* Staff glow */}
      <ellipse cx="35.5" cy="6" rx="5" ry="5" fill="none" stroke="#818cf8" strokeWidth="0.5" opacity="0.6"/>
      {/* Belt */}
      <rect x="13" y="39" width="16" height="4" rx="1" fill="#4338ca"/>
      <rect x="18" y="39.5" width="6" height="3" rx="0.5" fill="#818cf8"/>
      {/* Legs */}
      <rect x="13" y="43" width="7" height="12" rx="1.5" fill="#3730a3"/>
      <rect x="22" y="43" width="7" height="12" rx="1.5" fill="#3730a3"/>
      {/* Boots */}
      <rect x="12" y="53" width="9" height="5" rx="1.5" fill="#1e3a8a"/>
      <rect x="21" y="53" width="9" height="5" rx="1.5" fill="#1e3a8a"/>
      {/* Psychic energy emanating */}
      <circle cx="10" cy="35" r="2" fill="#818cf8" opacity="0.4"/>
      <circle cx="8" cy="40" r="1.5" fill="#a5b4fc" opacity="0.3"/>
    </svg>
  )
}

// ── ORKS ──────────────────────────────────────────────────────────────────────

export function SpriteOrkBoy({ size = 64 }: SP) {
  const w = size * 0.7, h = size
  return (
    <svg width={w} height={h} viewBox="0 0 42 60" fill="none">
      {/* Hunched posture - head forward */}
      {/* Crude steel helmet */}
      <path d="M10 16 Q10 7 21 7 Q32 7 32 16Z" fill="#374151"/>
      <rect x="10" y="14" width="22" height="8" rx="2" fill="#4b5563"/>
      {/* Rivets on helmet */}
      <circle cx="13" cy="17" r="1" fill="#9ca3af"/>
      <circle cx="29" cy="17" r="1" fill="#9ca3af"/>
      <circle cx="21" cy="16" r="1" fill="#9ca3af"/>
      {/* Green ork face */}
      <ellipse cx="21" cy="20" rx="9" ry="7" fill="#16a34a"/>
      {/* Single red eye (left) + yellow right */}
      <ellipse cx="17" cy="19" rx="3" ry="2.5" fill="#111827"/>
      <circle cx="17" cy="19" r="1.5" fill="#ef4444"/>
      <ellipse cx="25" cy="19" rx="3" ry="2.5" fill="#111827"/>
      <circle cx="25" cy="19" r="1.5" fill="#fbbf24"/>
      {/* Ork jaw & teef (tusks) */}
      <path d="M13 23 Q21 28 29 23 Q29 27 21 27 Q13 27 13 23Z" fill="#15803d"/>
      {/* Teef sticking up */}
      <path d="M16 27 L15 22 L17 22Z" fill="#fefce8"/>
      <path d="M20 27 L19 21 L21 21Z" fill="#fefce8"/>
      <path d="M24 27 L23 22 L25 22Z" fill="#fefce8"/>
      <path d="M27 27 L26 23 L28 23Z" fill="#fefce8"/>
      {/* Crude shoulder armor plates */}
      <rect x="2" y="25" width="12" height="8" rx="2" fill="#374151"/>
      <rect x="3" y="26" width="10" height="6" rx="1" fill="#4b5563"/>
      <rect x="28" y="25" width="12" height="8" rx="2" fill="#374151"/>
      <rect x="29" y="26" width="10" height="6" rx="1" fill="#4b5563"/>
      {/* Torso - ork gut, crude chest */}
      <rect x="12" y="27" width="18" height="16" rx="2" fill="#15803d"/>
      {/* Crude armor plates on torso */}
      <rect x="12" y="27" width="8" height="8" rx="1" fill="#374151"/>
      <rect x="22" y="27" width="8" height="8" rx="1" fill="#374151"/>
      {/* Gut */}
      <ellipse cx="21" cy="38" rx="7" ry="5" fill="#15803d"/>
      <path d="M15 37 Q21 42 27 37" fill="none" stroke="#166534" strokeWidth="1.5"/>
      {/* Arms - long ork arms */}
      <rect x="3" y="27" width="10" height="16" rx="3" fill="#15803d"/>
      <rect x="29" y="27" width="10" height="16" rx="3" fill="#15803d"/>
      {/* Choppa in right hand */}
      {/* Handle */}
      <rect x="37" y="35" width="4" height="12" rx="1" fill="#78350f"/>
      {/* Blade */}
      <path d="M35 22 L42 28 L40 35 L34 35 L33 28Z" fill="#6b7280"/>
      <path d="M36 23 L41 28 L39 34 L35 34Z" fill="#9ca3af"/>
      {/* Notches on blade */}
      <rect x="36" y="28" width="2" height="1" fill="#374151"/>
      <rect x="37" y="31" width="2" height="1" fill="#374151"/>
      {/* Belt with skull */}
      <rect x="12" y="43" width="18" height="4" rx="1" fill="#374151"/>
      <circle cx="21" cy="45" r="2.5" fill="#4b5563"/>
      <circle cx="21" cy="44.5" r="1.5" fill="#6b7280"/>
      {/* Legs - green ork skin below knee */}
      <rect x="12" y="47" width="8" height="10" rx="2" fill="#374151"/>
      <rect x="22" y="47" width="8" height="10" rx="2" fill="#374151"/>
      {/* Ork feet */}
      <ellipse cx="16" cy="57" rx="5" ry="3" fill="#15803d"/>
      <ellipse cx="26" cy="57" rx="5" ry="3" fill="#15803d"/>
    </svg>
  )
}

export function SpriteNob({ size = 64 }: SP) {
  const w = size * 0.75, h = size
  return (
    <svg width={w} height={h} viewBox="0 0 46 60" fill="none">
      {/* Bigger ork, more armor */}
      {/* Iron gob (metal jaw plate) */}
      <rect x="13" y="23" width="20" height="8" rx="2" fill="#6b7280"/>
      {/* Helmet - spiked */}
      <path d="M11 18 Q11 6 23 6 Q35 6 35 18Z" fill="#374151"/>
      <rect x="11" y="15" width="24" height="10" rx="2" fill="#4b5563"/>
      {/* Helmet spike */}
      <polygon points="23,1 20,8 26,8" fill="#6b7280"/>
      {/* Ork face - lower portion visible */}
      <ellipse cx="23" cy="19" rx="10" ry="6" fill="#16a34a"/>
      {/* Eyes */}
      <ellipse cx="18" cy="18" rx="3.5" ry="3" fill="#111827"/>
      <circle cx="18" cy="18" r="2" fill="#ef4444"/>
      <circle cx="18" cy="17.5" r="0.8" fill="#fca5a5"/>
      <ellipse cx="28" cy="18" rx="3.5" ry="3" fill="#111827"/>
      <circle cx="28" cy="18" r="2" fill="#ef4444"/>
      {/* Big teef from iron gob */}
      <path d="M16 31 L15 25 L17 25Z" fill="#fefce8"/>
      <path d="M21 31 L20 24 L22 24Z" fill="#fefce8"/>
      <path d="M26 31 L25 25 L27 25Z" fill="#fefce8"/>
      {/* Big shoulder plates */}
      <rect x="1" y="26" width="14" height="12" rx="2" fill="#374151"/>
      <rect x="2" y="27" width="12" height="10" rx="1.5" fill="#4b5563"/>
      <circle cx="5" cy="30" r="1.2" fill="#9ca3af"/>
      <circle cx="5" cy="34" r="1.2" fill="#9ca3af"/>
      <rect x="31" y="26" width="14" height="12" rx="2" fill="#374151"/>
      <rect x="32" y="27" width="12" height="10" rx="1.5" fill="#4b5563"/>
      {/* Torso - heavy armor */}
      <rect x="11" y="31" width="24" height="16" rx="2" fill="#4b5563"/>
      <rect x="13" y="33" width="8" height="12" rx="1" fill="#374151"/>
      <rect x="25" y="33" width="8" height="12" rx="1" fill="#374151"/>
      {/* Gut plate */}
      <ellipse cx="23" cy="43" rx="8" ry="5" fill="#16a34a"/>
      {/* Arms - big ork arms */}
      <rect x="2" y="30" width="11" height="18" rx="3" fill="#16a34a"/>
      <rect x="33" y="30" width="11" height="18" rx="3" fill="#16a34a"/>
      {/* Power Klaw on left arm */}
      <rect x="1" y="46" width="10" height="8" rx="2" fill="#374151"/>
      <path d="M0 46 Q-2 42 2 40 L5 46Z" fill="#6b7280"/>
      <path d="M4 46 Q2 41 6 39 L8 46Z" fill="#6b7280"/>
      <path d="M8 46 Q6 42 10 40 L12 46Z" fill="#6b7280"/>
      {/* Shoota in right */}
      <rect x="38" y="38" width="14" height="8" rx="2" fill="#1f2937"/>
      <rect x="39" y="39" width="12" height="6" rx="1" fill="#374151"/>
      <rect x="41" y="45" width="6" height="4" rx="0.5" fill="#111827"/>
      <rect x="51" y="40" width="4" height="4" fill="#0f172a"/>
      {/* Belt */}
      <rect x="11" y="47" width="24" height="5" rx="1" fill="#374151"/>
      <circle cx="23" cy="49.5" r="3" fill="#4b5563"/>
      {/* Legs */}
      <rect x="11" y="52" width="10" height="8" rx="2" fill="#4b5563"/>
      <rect x="25" y="52" width="10" height="8" rx="2" fill="#4b5563"/>
    </svg>
  )
}

export function SpriteWarboss({ size = 64 }: SP) {
  const w = size * 0.9, h = size
  return (
    <svg width={w} height={h} viewBox="0 0 56 60" fill="none">
      {/* WARBOSS - massive, fills frame */}
      {/* Mega Armor chassis */}
      <rect x="8" y="22" width="40" height="30" rx="3" fill="#374151"/>
      {/* Helmet - huge ornate */}
      <path d="M14 18 Q14 4 28 4 Q42 4 42 18Z" fill="#374151"/>
      <rect x="14" y="14" width="28" height="12" rx="2" fill="#4b5563"/>
      {/* Helmet crest / topknot */}
      <path d="M25 0 Q28 5 31 0 Q29 3 28 2 Q27 3 25 0Z" fill="#dc2626"/>
      <path d="M22 1 Q26 6 28 4 Q26 5 24 3Z" fill="#dc2626"/>
      <path d="M28 4 Q30 6 34 1 Q32 3 30 3Z" fill="#dc2626"/>
      {/* Big green face */}
      <ellipse cx="28" cy="20" rx="12" ry="9" fill="#16a34a"/>
      {/* Cybork eye - red glowing */}
      <ellipse cx="22" cy="19" rx="4.5" ry="4" fill="#111827"/>
      <circle cx="22" cy="19" r="2.5" fill="#ef4444"/>
      <circle cx="22" cy="18" r="1" fill="#fca5a5"/>
      {/* Mechanical eye on right */}
      <ellipse cx="34" cy="19" rx="4.5" ry="4" fill="#111827"/>
      <circle cx="34" cy="19" r="2.5" fill="#fbbf24"/>
      <path d="M31 17 L37 17 M31 21 L37 21 M31 17 L31 21 M37 17 L37 21" stroke="#6b7280" strokeWidth="0.8"/>
      {/* Massive jaw */}
      <path d="M16 25 Q28 33 40 25 Q40 30 28 30 Q16 30 16 25Z" fill="#15803d"/>
      <path d="M19 30 L17 24 L21 24Z" fill="#fefce8"/>
      <path d="M24 30 L22 22 L26 22Z" fill="#fefce8"/>
      <path d="M32 30 L30 22 L34 22Z" fill="#fefce8"/>
      <path d="M37 30 L35 24 L39 24Z" fill="#fefce8"/>
      {/* MEGA ARMOR - shoulder towers */}
      <rect x="0" y="20" width="16" height="22" rx="2" fill="#374151"/>
      <rect x="1" y="21" width="14" height="20" rx="1.5" fill="#4b5563"/>
      <polygon points="8,18 4,21 12,21" fill="#6b7280"/>
      <rect x="40" y="20" width="16" height="22" rx="2" fill="#374151"/>
      <rect x="41" y="21" width="14" height="20" rx="1.5" fill="#4b5563"/>
      {/* Ork glyph on right shoulder */}
      <circle cx="48" cy="29" r="4" fill="#dc2626"/>
      <text x="45.5" y="31.5" fontSize="5" fill="#fff" fontWeight="bold">W</text>
      {/* Huge Power Klaw arm */}
      <rect x="0" y="36" width="14" height="12" rx="2" fill="#374151"/>
      <path d="M-2 36 Q-5 30 2 27 L8 36Z" fill="#6b7280"/>
      <path d="M4 36 Q1 29 7 26 L12 36Z" fill="#6b7280"/>
      <path d="M10 36 Q7 30 13 27 L16 36Z" fill="#6b7280"/>
      {/* Power Klaw lightning */}
      <path d="M4 34 L2 38 L5 37 L3 42" stroke="#fbbf24" strokeWidth="1" fill="none" opacity="0.8"/>
      {/* Big Shoota arm */}
      <rect x="40" y="36" width="14" height="12" rx="2" fill="#4b5563"/>
      <rect x="50" y="32" width="18" height="10" rx="2" fill="#1f2937"/>
      <rect x="51" y="33" width="16" height="4" rx="1" fill="#374151"/>
      <rect x="51" y="37" width="16" height="4" rx="1" fill="#374151"/>
      <rect x="67" y="33" width="4" height="3" fill="#0f172a"/>
      <rect x="67" y="37" width="4" height="3" fill="#0f172a"/>
      {/* Belt - heavy plates */}
      <rect x="8" y="52" width="40" height="6" rx="1" fill="#374151"/>
      <rect x="22" y="52.5" width="12" height="5" rx="0.5" fill="#4b5563"/>
      <circle cx="28" cy="55" r="3" fill="#dc2626"/>
      {/* Massive legs */}
      <rect x="10" y="58" width="14" height="2" rx="1" fill="#4b5563"/>
      <rect x="32" y="58" width="14" height="2" rx="1" fill="#4b5563"/>
    </svg>
  )
}

export function SpriteGretchin({ size = 64 }: SP) {
  const w = size * 0.5, h = size
  return (
    <svg width={w} height={h} viewBox="0 0 30 60" fill="none">
      {/* Small grot - big head, tiny body */}
      {/* Big dome head */}
      <ellipse cx="15" cy="14" rx="11" ry="12" fill="#16a34a"/>
      {/* Huge ears */}
      <ellipse cx="4" cy="14" rx="3.5" ry="5" fill="#15803d"/>
      <ellipse cx="26" cy="14" rx="3.5" ry="5" fill="#15803d"/>
      {/* Eyes - big scared */}
      <ellipse cx="11" cy="13" rx="4" ry="4.5" fill="#fbbf24"/>
      <circle cx="11" cy="13" r="2.5" fill="#111827"/>
      <circle cx="10.5" cy="12" r="0.8" fill="#fff" opacity="0.7"/>
      <ellipse cx="19" cy="13" rx="4" ry="4.5" fill="#fbbf24"/>
      <circle cx="19" cy="13" r="2.5" fill="#111827"/>
      <circle cx="18.5" cy="12" r="0.8" fill="#fff" opacity="0.7"/>
      {/* Grot nose */}
      <ellipse cx="15" cy="17" rx="2.5" ry="2" fill="#15803d"/>
      <circle cx="14" cy="17" r="0.8" fill="#166534"/>
      <circle cx="16" cy="17" r="0.8" fill="#166534"/>
      {/* Grot mouth + few teef */}
      <path d="M11 20 Q15 23 19 20" fill="none" stroke="#166534" strokeWidth="1.5"/>
      <path d="M13 23 L12 20 L14 20Z" fill="#fefce8"/>
      <path d="M17 23 L16 20 L18 20Z" fill="#fefce8"/>
      {/* Tiny body */}
      <rect x="11" y="26" width="8" height="12" rx="2" fill="#374151"/>
      {/* Scrap gun */}
      <rect x="18" y="30" width="11" height="4" rx="1" fill="#1f2937"/>
      <rect x="28" y="30.5" width="4" height="3" fill="#0f172a"/>
      <rect x="20" y="34" width="5" height="2" fill="#374151"/>
      {/* Skinny arms */}
      <rect x="5" y="27" width="6" height="10" rx="3" fill="#16a34a"/>
      <rect x="19" y="27" width="6" height="10" rx="3" fill="#16a34a"/>
      {/* Skinny legs */}
      <rect x="11" y="38" width="4" height="14" rx="2" fill="#16a34a"/>
      <rect x="15" y="38" width="4" height="14" rx="2" fill="#16a34a"/>
      {/* Tiny feet */}
      <ellipse cx="13" cy="52" rx="3.5" ry="2.5" fill="#15803d"/>
      <ellipse cx="17" cy="52" rx="3.5" ry="2.5" fill="#15803d"/>
    </svg>
  )
}

// ── CHAOS ─────────────────────────────────────────────────────────────────────

export function SpriteChaosMarine({ size = 64 }: SP) {
  const w = size * 0.7, h = size
  return (
    <svg width={w} height={h} viewBox="0 0 42 60" fill="none">
      {/* Backpack with corruption spikes */}
      <rect x="14" y="5" width="14" height="11" rx="1" fill="#450a0a"/>
      <polygon points="17,2 15,6 19,6" fill="#6b7280"/>
      <polygon points="21,1 19,6 23,6" fill="#6b7280"/>
      <polygon points="25,2 23,6 27,6" fill="#6b7280"/>
      {/* Spiked helmet */}
      <path d="M13 17 Q13 7 21 7 Q29 7 29 17Z" fill="#7f1d1d"/>
      <rect x="13" y="14" width="16" height="9" rx="1.5" fill="#991b1b"/>
      {/* Helmet horn spikes */}
      <polygon points="16,7 13,13 18,13" fill="#4b5563"/>
      <polygon points="26,7 24,13 28,13" fill="#4b5563"/>
      {/* Eye of Terror slit visor */}
      <rect x="12" y="15.5" width="18" height="3" rx="1" fill="#7c2d12"/>
      <ellipse cx="21" cy="17" rx="5" ry="1.5" fill="#dc2626"/>
      <ellipse cx="21" cy="17" rx="3" ry="0.8" fill="#fca5a5" opacity="0.7"/>
      {/* Mouth grille */}
      <rect x="15" y="19" width="12" height="4" rx="1" fill="#450a0a"/>
      <rect x="16" y="20" width="2" height="2" fill="#7f1d1d"/>
      <rect x="19" y="20" width="2" height="2" fill="#7f1d1d"/>
      <rect x="22" y="20" width="2" height="2" fill="#7f1d1d"/>
      <rect x="25" y="20" width="2" height="2" fill="#7f1d1d"/>
      {/* Spiky shoulder pads */}
      <path d="M0 28 Q0 19 9 21 L14 31 Q7 33 0 28Z" fill="#7f1d1d"/>
      <polygon points="3,19 1,23 5,23" fill="#6b7280"/>
      <polygon points="7,17 5,22 9,22" fill="#6b7280"/>
      <path d="M42 28 Q42 19 33 21 L28 31 Q35 33 42 28Z" fill="#7f1d1d"/>
      <polygon points="39,19 37,23 41,23" fill="#6b7280"/>
      <polygon points="35,17 33,22 37,22" fill="#6b7280"/>
      {/* Torso - corrupted armor */}
      <rect x="13" y="23" width="16" height="17" rx="2" fill="#991b1b"/>
      {/* Chaos star on chest */}
      <circle cx="21" cy="31" r="5" fill="#7f1d1d"/>
      <path d="M21 26 L21 36 M16 31 L26 31 M17.5 27.5 L24.5 34.5 M24.5 27.5 L17.5 34.5" stroke="#dc2626" strokeWidth="1.2"/>
      <circle cx="21" cy="31" r="2" fill="#dc2626"/>
      {/* Arms with spikes */}
      <rect x="7" y="27" width="7" height="14" rx="2" fill="#991b1b"/>
      <polygon points="8,28 6,31 10,31" fill="#6b7280"/>
      <rect x="28" y="27" width="7" height="14" rx="2" fill="#991b1b"/>
      {/* Bolter - corrupted */}
      <rect x="27" y="31" width="15" height="7" rx="1.5" fill="#1c1917"/>
      <rect x="28" y="32" width="12" height="5" rx="1" fill="#292524"/>
      <rect x="30" y="38" width="4" height="4" rx="0.5" fill="#1c1917"/>
      {/* Chaos rune on bolter */}
      <path d="M35 33.5 L35 36.5 M33 35 L37 35" stroke="#dc2626" strokeWidth="0.8"/>
      <rect x="41" y="33" width="4" height="2.5" fill="#0f172a"/>
      {/* Belt */}
      <rect x="13" y="40" width="16" height="4" rx="1" fill="#450a0a"/>
      {/* Skull belt buckle */}
      <circle cx="21" cy="42" r="2.5" fill="#374151"/>
      <circle cx="20" cy="41.5" r="0.8" fill="#111827"/>
      <circle cx="22" cy="41.5" r="0.8" fill="#111827"/>
      <path d="M19.5 43 L22.5 43" stroke="#111827" strokeWidth="0.8"/>
      {/* Legs */}
      <rect x="13" y="44" width="7" height="12" rx="1.5" fill="#991b1b"/>
      <rect x="22" y="44" width="7" height="12" rx="1.5" fill="#991b1b"/>
      {/* Spikes on shins */}
      <polygon points="14,48 12,51 15,51" fill="#6b7280"/>
      <polygon points="27,48 25,51 28,51" fill="#6b7280"/>
      {/* Boots */}
      <rect x="12" y="54" width="9" height="5" rx="1.5" fill="#450a0a"/>
      <rect x="21" y="54" width="9" height="5" rx="1.5" fill="#450a0a"/>
    </svg>
  )
}

export function SpriteBerzerker({ size = 64 }: SP) {
  const w = size * 0.7, h = size
  return (
    <svg width={w} height={h} viewBox="0 0 42 60" fill="none">
      {/* Khorne Berzerker - blood red, chains, chainaxe */}
      {/* Bunny-ear style Khorne helmet */}
      <path d="M13 17 Q13 7 21 7 Q29 7 29 17Z" fill="#991b1b"/>
      <rect x="13" y="14" width="16" height="9" rx="1.5" fill="#dc2626"/>
      {/* Distinctive Khorne bunny ears */}
      <rect x="14" y="4" width="5" height="10" rx="1" fill="#7f1d1d"/>
      <rect x="23" y="4" width="5" height="10" rx="1" fill="#7f1d1d"/>
      {/* Ear tips */}
      <polygon points="16.5,2 14,5 19,5" fill="#6b7280"/>
      <polygon points="25.5,2 23,5 28,5" fill="#6b7280"/>
      {/* Visor - full red */}
      <rect x="12" y="15" width="18" height="4" rx="1" fill="#450a0a"/>
      <ellipse cx="21" cy="17" rx="6" ry="2" fill="#dc2626" opacity="0.6"/>
      {/* Grille */}
      <rect x="15" y="20" width="12" height="4" rx="0.5" fill="#7f1d1d"/>
      <rect x="16" y="21" width="2" height="2" fill="#450a0a"/>
      <rect x="19.5" y="21" width="2" height="2" fill="#450a0a"/>
      <rect x="23" y="21" width="2" height="2" fill="#450a0a"/>
      {/* Shoulder pads - studded */}
      <ellipse cx="7" cy="27" rx="8" ry="5" fill="#7f1d1d"/>
      <ellipse cx="7" cy="27" rx="6.5" ry="4" fill="#dc2626"/>
      <circle cx="5" cy="26" r="1" fill="#fbbf24"/>
      <circle cx="9" cy="25" r="1" fill="#fbbf24"/>
      <circle cx="7" cy="30" r="1" fill="#fbbf24"/>
      {/* Khorne symbol on left shoulder */}
      <circle cx="7" cy="27" r="3" fill="#7f1d1d"/>
      <path d="M7 24 L7 30 M4 27 L10 27" stroke="#fbbf24" strokeWidth="1"/>
      <ellipse cx="35" cy="27" rx="8" ry="5" fill="#7f1d1d"/>
      <ellipse cx="35" cy="27" rx="6.5" ry="4" fill="#dc2626"/>
      {/* Torso */}
      <rect x="13" y="23" width="16" height="17" rx="2" fill="#dc2626"/>
      {/* Brass trim - Khorne colors */}
      <rect x="13" y="23" width="16" height="1.5" fill="#b45309"/>
      <rect x="13" y="38.5" width="16" height="1" fill="#b45309"/>
      {/* Khorne rune on chest */}
      <polygon points="21,26 17,32 25,32" fill="#7f1d1d"/>
      <polygon points="21,35 17,29 25,29" fill="#7f1d1d"/>
      <circle cx="21" cy="30.5" r="2.5" fill="#b45309"/>
      {/* Blood splatter */}
      <circle cx="15" cy="28" r="1" fill="#450a0a" opacity="0.8"/>
      <circle cx="27" cy="30" r="0.8" fill="#450a0a" opacity="0.8"/>
      <circle cx="17" cy="35" r="1.2" fill="#450a0a" opacity="0.8"/>
      {/* Arms */}
      <rect x="7" y="27" width="7" height="14" rx="2" fill="#dc2626"/>
      <rect x="28" y="27" width="7" height="14" rx="2" fill="#dc2626"/>
      {/* CHAINAXE - iconic */}
      {/* Axe shaft */}
      <rect x="33" y="15" width="4" height="28" rx="1" fill="#78350f"/>
      <rect x="34" y="16" width="2" height="27" rx="0.5" fill="#92400e"/>
      {/* Chainsaw blade on axe */}
      <rect x="30" y="10" width="14" height="18" rx="2" fill="#374151"/>
      <rect x="31" y="11" width="12" height="16" rx="1.5" fill="#4b5563"/>
      {/* Chain teeth */}
      <rect x="31" y="11" width="1.5" height="2" fill="#9ca3af"/>
      <rect x="33.5" y="11" width="1.5" height="2" fill="#9ca3af"/>
      <rect x="36" y="11" width="1.5" height="2" fill="#9ca3af"/>
      <rect x="38.5" y="11" width="1.5" height="2" fill="#9ca3af"/>
      <rect x="31" y="24" width="1.5" height="2" fill="#9ca3af"/>
      <rect x="33.5" y="24" width="1.5" height="2" fill="#9ca3af"/>
      <rect x="36" y="24" width="1.5" height="2" fill="#9ca3af"/>
      {/* Blood on axe */}
      <path d="M32 15 Q35 17 33 20 Q36 18 35 22" fill="none" stroke="#dc2626" strokeWidth="1.2"/>
      {/* Belt */}
      <rect x="13" y="40" width="16" height="4" rx="1" fill="#450a0a"/>
      {/* Legs */}
      <rect x="13" y="44" width="7" height="12" rx="1.5" fill="#dc2626"/>
      <rect x="22" y="44" width="7" height="12" rx="1.5" fill="#dc2626"/>
      {/* Brass knee */}
      <ellipse cx="16.5" cy="46" rx="3.5" ry="2.5" fill="#b45309"/>
      <ellipse cx="25.5" cy="46" rx="3.5" ry="2.5" fill="#b45309"/>
      {/* Boots */}
      <rect x="12" y="54" width="9" height="5" rx="1.5" fill="#450a0a"/>
      <rect x="21" y="54" width="9" height="5" rx="1.5" fill="#450a0a"/>
    </svg>
  )
}

export function SpriteChaosMarine2({ size = 64 }: SP) { return <SpriteChaosMarine size={size}/> }

export function SpritePlagueMarine({ size = 64 }: SP) {
  const w = size * 0.75, h = size
  return (
    <svg width={w} height={h} viewBox="0 0 44 60" fill="none">
      {/* Plague Marine - bloated, Nurgle green/brown */}
      {/* Bloated backpack with tubes */}
      <ellipse cx="22" cy="10" rx="9" ry="8" fill="#365314"/>
      <rect x="14" y="8" width="5" height="4" rx="0.5" fill="#0f172a"/>
      <rect x="25" y="8" width="5" height="4" rx="0.5" fill="#0f172a"/>
      {/* Gas/corruption tubes */}
      <path d="M14 12 Q10 16 12 22" fill="none" stroke="#4d7c0f" strokeWidth="2"/>
      <path d="M30 12 Q34 16 32 22" fill="none" stroke="#4d7c0f" strokeWidth="2"/>
      {/* Bloated helmet - rounded, plague-worn */}
      <ellipse cx="22" cy="18" rx="11" ry="10" fill="#365314"/>
      {/* Helm corrosion marks */}
      <circle cx="16" cy="16" r="2" fill="#4d7c0f" opacity="0.5"/>
      <circle cx="28" cy="19" r="1.5" fill="#4d7c0f" opacity="0.5"/>
      {/* Plague helmet visor - single cyclopean eye */}
      <ellipse cx="22" cy="17" rx="8" ry="3.5" fill="#1a2e05"/>
      <ellipse cx="22" cy="17" rx="4" ry="2" fill="#4d7c0f"/>
      <circle cx="22" cy="17" r="2.5" fill="#84cc16"/>
      <circle cx="22" cy="17" r="1.2" fill="#bef264"/>
      {/* Rebreather/death's head on chin */}
      <ellipse cx="22" cy="23" rx="6" ry="4" fill="#1a2e05"/>
      <circle cx="19" cy="23" r="1.5" fill="#4d7c0f"/>
      <circle cx="25" cy="23" r="1.5" fill="#4d7c0f"/>
      <path d="M18 24.5 Q22 27 26 24.5" fill="none" stroke="#4d7c0f" strokeWidth="1"/>
      {/* BLOATED massive shoulders */}
      <ellipse cx="7" cy="28" rx="9" ry="7" fill="#365314"/>
      <ellipse cx="7" cy="28" rx="7.5" ry="5.5" fill="#4d7c0f"/>
      {/* Nurgle flies/corruption */}
      <circle cx="5" cy="26" r="1.5" fill="#1a2e05"/>
      <ellipse cx="37" cy="28" rx="9" ry="7" fill="#365314"/>
      <ellipse cx="37" cy="28" rx="7.5" ry="5.5" fill="#4d7c0f"/>
      {/* Torso - bloated gut */}
      <ellipse cx="22" cy="36" rx="12" ry="14" fill="#4d7c0f"/>
      <rect x="11" y="25" width="22" height="16" rx="2" fill="#4d7c0f"/>
      {/* Nurgle symbol - three circles */}
      <circle cx="22" cy="32" r="6" fill="none" stroke="#84cc16" strokeWidth="1.2"/>
      <circle cx="18" cy="29" r="2" fill="#84cc16" opacity="0.8"/>
      <circle cx="26" cy="29" r="2" fill="#84cc16" opacity="0.8"/>
      <circle cx="22" cy="35" r="2" fill="#84cc16" opacity="0.8"/>
      {/* Pustules on torso */}
      <circle cx="15" cy="36" r="2" fill="#65a30d"/>
      <circle cx="29" cy="38" r="1.5" fill="#65a30d"/>
      <circle cx="24" cy="41" r="2" fill="#65a30d"/>
      {/* Arms - fat and nurgle-ish */}
      <ellipse cx="7" cy="38" rx="6" ry="10" fill="#4d7c0f"/>
      <ellipse cx="37" cy="38" rx="6" ry="10" fill="#4d7c0f"/>
      {/* Plague bolter - corroded */}
      <rect x="39" y="34" width="14" height="7" rx="1.5" fill="#1c1917"/>
      <rect x="40" y="35" width="11" height="5" rx="1" fill="#292524"/>
      <path d="M41 34 Q45 32 48 34" fill="none" stroke="#84cc16" strokeWidth="0.8"/>
      <rect x="42" y="41" width="5" height="3.5" rx="0.5" fill="#1c1917"/>
      <rect x="52" y="35.5" width="4" height="3" fill="#0f172a"/>
      {/* Gut tube attached to bolter */}
      <path d="M39 38 Q36 44 30 42" fill="none" stroke="#4d7c0f" strokeWidth="1.5"/>
      {/* Belt - barely visible under gut */}
      <rect x="11" y="48" width="22" height="4" rx="1" fill="#1a2e05"/>
      {/* Fat legs */}
      <ellipse cx="16" cy="54" rx="6" ry="6" fill="#4d7c0f"/>
      <ellipse cx="28" cy="54" rx="6" ry="6" fill="#4d7c0f"/>
    </svg>
  )
}

export function SpriteChaosLord({ size = 64 }: SP) {
  const w = size * 0.8, h = size
  return (
    <svg width={w} height={h} viewBox="0 0 48 60" fill="none">
      {/* Chaos Lord - ornate, commanding */}
      {/* Spiked backpack */}
      <rect x="16" y="3" width="16" height="12" rx="1" fill="#450a0a"/>
      <polygon points="19,1 17,5 21,5" fill="#9ca3af"/>
      <polygon points="24,0 22,4 26,4" fill="#9ca3af"/>
      <polygon points="29,1 27,5 31,5" fill="#9ca3af"/>
      {/* Ornate crested helmet */}
      <path d="M14 18 Q14 6 24 6 Q34 6 34 18Z" fill="#7f1d1d"/>
      <rect x="14" y="15" width="20" height="10" rx="2" fill="#991b1b"/>
      {/* Crest */}
      <path d="M20 4 Q24 1 28 4 Q26 2 24 2.5 Q22 2 20 4Z" fill="#b45309"/>
      <rect x="22" y="1" width="4" height="6" rx="0.5" fill="#d97706"/>
      {/* Ornate horns */}
      <path d="M14 14 Q10 8 13 5 Q12 9 16 12Z" fill="#6b7280"/>
      <path d="M34 14 Q38 8 35 5 Q36 9 32 12Z" fill="#6b7280"/>
      {/* Eye slit visor */}
      <rect x="13" y="16.5" width="22" height="3.5" rx="1" fill="#450a0a"/>
      <rect x="14" y="17" width="9" height="2.5" fill="#dc2626" opacity="0.8"/>
      <rect x="25" y="17" width="9" height="2.5" fill="#dc2626" opacity="0.8"/>
      {/* Fanged grille */}
      <rect x="17" y="21" width="14" height="5" rx="1" fill="#7f1d1d"/>
      <path d="M18 26 L18 22 L20 22Z" fill="#d1d5db"/>
      <path d="M22 26 L21 22 L23 22Z" fill="#d1d5db"/>
      <path d="M26 26 L25 22 L27 22Z" fill="#d1d5db"/>
      <path d="M30 26 L29 22 L31 22Z" fill="#d1d5db"/>
      {/* Huge ornate shoulders */}
      <path d="M0 30 Q0 18 12 20 L17 34 Q8 36 0 30Z" fill="#7f1d1d"/>
      <path d="M2 30 Q2 20 12 21 L16 33 Q9 34 2 30Z" fill="#991b1b"/>
      <polygon points="4,18 2,22 6,22" fill="#6b7280"/>
      <polygon points="9,16 7,21 11,21" fill="#6b7280"/>
      <path d="M48 30 Q48 18 36 20 L31 34 Q40 36 48 30Z" fill="#7f1d1d"/>
      <path d="M46 30 Q46 20 36 21 L32 33 Q39 34 46 30Z" fill="#991b1b"/>
      <polygon points="44,18 42,22 46,22" fill="#6b7280"/>
      <polygon points="39,16 37,21 41,21" fill="#6b7280"/>
      {/* Ornate torso */}
      <rect x="14" y="26" width="20" height="18" rx="2" fill="#991b1b"/>
      <rect x="14" y="26" width="20" height="2" fill="#b45309"/>
      {/* Chaos star - 8 pointed */}
      <path d="M24 30 L24 40 M19 32 L29 38 M19 38 L29 32 M17 35 L31 35" stroke="#b45309" strokeWidth="1.2"/>
      <circle cx="24" cy="35" r="3" fill="#7f1d1d"/>
      <circle cx="24" cy="35" r="1.5" fill="#dc2626"/>
      {/* Arms */}
      <rect x="8" y="28" width="8" height="16" rx="2" fill="#991b1b"/>
      <rect x="32" y="28" width="8" height="16" rx="2" fill="#991b1b"/>
      {/* Daemon sword */}
      <rect x="36" y="10" width="4" height="30" rx="1" fill="#78350f"/>
      <path d="M34 8 L38 14 L34 40 L32 40 L36 14Z" fill="#6b7280"/>
      <path d="M34 8 L38 14 L40 40 L42 40 L38 14Z" fill="#9ca3af"/>
      {/* Glowing rune on sword */}
      <path d="M36 20 L36 28 M34 24 L38 24" stroke="#dc2626" strokeWidth="0.8"/>
      {/* Power shield on left */}
      <ellipse cx="8" cy="42" rx="7" ry="8" fill="#7f1d1d"/>
      <ellipse cx="8" cy="42" rx="5.5" ry="6.5" fill="#991b1b"/>
      {/* Shield chaos star */}
      <path d="M8 37 L8 47 M3 42 L13 42 M4.5 38.5 L11.5 45.5 M4.5 45.5 L11.5 38.5" stroke="#b45309" strokeWidth="0.8"/>
      {/* Belt */}
      <rect x="14" y="44" width="20" height="4" rx="1" fill="#450a0a"/>
      <circle cx="24" cy="46" r="2.5" fill="#b45309"/>
      {/* Legs */}
      <rect x="14" y="48" width="8" height="11" rx="2" fill="#991b1b"/>
      <rect x="26" y="48" width="8" height="11" rx="2" fill="#991b1b"/>
      <rect x="13" y="57" width="10" height="3" rx="1.5" fill="#450a0a"/>
      <rect x="25" y="57" width="10" height="3" rx="1.5" fill="#450a0a"/>
    </svg>
  )
}

// ── TYRANIDS ──────────────────────────────────────────────────────────────────

export function SpriteHormagaunt({ size = 64 }: SP) {
  const w = size * 0.85, h = size
  return (
    <svg width={w} height={h} viewBox="0 0 50 60" fill="none">
      {/* Four-limbed - low crouching posture */}
      {/* Body/torso - chitinous carapace */}
      <ellipse cx="28" cy="32" rx="12" ry="9" fill="#7e22ce"/>
      {/* Bone-colored underbelly */}
      <ellipse cx="28" cy="34" rx="9" ry="7" fill="#e7d5b3"/>
      {/* Carapace plates */}
      <path d="M18 28 Q28 20 38 28 Q34 24 28 23 Q22 24 18 28Z" fill="#6d28d9"/>
      {/* Head - elongated alien */}
      <ellipse cx="42" cy="24" rx="9" ry="7" fill="#7e22ce"/>
      <path d="M34 22 Q42 15 50 22 Q46 18 42 17 Q38 18 34 22Z" fill="#6d28d9"/>
      {/* No distinct face - just sensory pits */}
      <circle cx="46" cy="22" r="2" fill="#4c1d95"/>
      <circle cx="38" cy="22" r="2" fill="#4c1d95"/>
      <circle cx="46" cy="22" r="1" fill="#dc2626" opacity="0.8"/>
      <circle cx="38" cy="22" r="1" fill="#dc2626" opacity="0.8"/>
      {/* Neck connection */}
      <path d="M34 27 Q38 25 42 28" fill="#7e22ce" stroke="#6d28d9" strokeWidth="1"/>
      {/* Scything talons - FRONT (upper arms) */}
      {/* Left talon arm */}
      <path d="M18 28 Q10 24 6 18 Q8 22 12 25 L18 30Z" fill="#7e22ce"/>
      {/* Talon blade */}
      <path d="M6 18 Q2 14 0 8 Q4 14 8 17Z" fill="#e7d5b3"/>
      <path d="M6 18 Q4 12 2 6 Q6 12 10 16Z" fill="#d1b896"/>
      {/* Right talon arm */}
      <path d="M38 28 Q46 24 50 18 Q48 22 44 25 L38 30Z" fill="#7e22ce"/>
      {/* Talon blade right */}
      <path d="M50 18 Q54 14 56 8 Q52 14 48 17Z" fill="#e7d5b3"/>
      {/* Running legs - 4 of them */}
      {/* Front left leg */}
      <path d="M22 38 Q16 44 12 52 Q15 46 19 41Z" fill="#7e22ce"/>
      <path d="M12 52 Q10 56 8 60 Q11 55 14 51Z" fill="#6d28d9"/>
      {/* Front right leg */}
      <path d="M34 38 Q40 44 44 52 Q41 46 37 41Z" fill="#7e22ce"/>
      <path d="M44 52 Q46 56 48 60 Q45 55 42 51Z" fill="#6d28d9"/>
      {/* Back left leg */}
      <path d="M20 36 Q13 42 9 50 Q13 44 18 38Z" fill="#6d28d9"/>
      {/* Back right leg */}
      <path d="M36 36 Q43 42 47 50 Q43 44 38 38Z" fill="#6d28d9"/>
      {/* Tail */}
      <path d="M18 36 Q8 40 4 50 Q10 40 20 38Z" fill="#7e22ce"/>
      <path d="M4 50 Q2 55 4 60 Q4 55 6 50Z" fill="#6d28d9"/>
    </svg>
  )
}

export function SpriteWarrior({ size = 64 }: SP) {
  const w = size * 0.75, h = size
  return (
    <svg width={w} height={h} viewBox="0 0 44 60" fill="none">
      {/* Tyranid Warrior - upright, synapse creature */}
      {/* Upper carapace - shoulder plates */}
      <path d="M4 24 Q4 14 14 18 L19 30 Q11 32 4 24Z" fill="#6d28d9"/>
      <path d="M40 24 Q40 14 30 18 L25 30 Q33 32 40 24Z" fill="#6d28d9"/>
      {/* Crest/head carapace */}
      <path d="M16 6 Q22 2 28 6 Q26 3 22 3 Q18 3 16 6Z" fill="#5b21b6"/>
      {/* Head */}
      <ellipse cx="22" cy="14" rx="9" ry="11" fill="#7e22ce"/>
      <path d="M14 10 Q22 4 30 10 Q26 6 22 5 Q18 6 14 10Z" fill="#6d28d9"/>
      {/* Alien face - no eyes/mouth, synapse creature */}
      <circle cx="18" cy="13" r="2.5" fill="#4c1d95"/>
      <circle cx="18" cy="13" r="1.5" fill="#7c3aed"/>
      <circle cx="26" cy="13" r="2.5" fill="#4c1d95"/>
      <circle cx="26" cy="13" r="1.5" fill="#7c3aed"/>
      {/* Feeder tendrils */}
      <path d="M22 22 Q18 26 16 30" fill="none" stroke="#a78bfa" strokeWidth="0.8"/>
      <path d="M22 22 Q24 26 26 30" fill="none" stroke="#a78bfa" strokeWidth="0.8"/>
      <path d="M22 22 Q21 27 19 32" fill="none" stroke="#a78bfa" strokeWidth="0.8"/>
      {/* Torso */}
      <ellipse cx="22" cy="34" rx="11" ry="12" fill="#7e22ce"/>
      <ellipse cx="22" cy="36" rx="8" ry="9" fill="#e7d5b3"/>
      {/* Upper arms - boneswords */}
      <rect x="5" y="26" width="8" height="16" rx="3" fill="#7e22ce"/>
      <rect x="31" y="26" width="8" height="16" rx="3" fill="#7e22ce"/>
      {/* Bonesword - left */}
      <path d="M5 26 Q0 22 2 12 Q4 20 7 24Z" fill="#e7d5b3"/>
      <path d="M2 12 Q1 7 4 4 Q3 9 4 14Z" fill="#d1b896"/>
      {/* Lash whip - right */}
      <path d="M39 28 Q46 24 50 18 Q46 23 42 28Z" fill="#6d28d9"/>
      <path d="M50 18 Q54 14 52 8 Q50 13 48 18Z" fill="#7e22ce"/>
      <path d="M52 8 Q54 4 50 2 Q52 5 50 10Z" fill="#a78bfa" opacity="0.8"/>
      {/* Lower arms - smaller grasping talons */}
      <path d="M14 34 Q8 36 4 44 Q10 38 16 36Z" fill="#6d28d9"/>
      <path d="M30 34 Q36 36 40 44 Q34 38 28 36Z" fill="#6d28d9"/>
      {/* Legs - digitigrade */}
      <path d="M16 44 Q12 50 10 58" fill="none" stroke="#7e22ce" strokeWidth="6" strokeLinecap="round"/>
      <path d="M28 44 Q32 50 34 58" fill="none" stroke="#7e22ce" strokeWidth="6" strokeLinecap="round"/>
      {/* Feet/talons */}
      <path d="M10 58 Q6 60 4 58 Q8 57 10 55Z" fill="#e7d5b3"/>
      <path d="M10 58 Q9 62 7 60 Q9 59 11 57Z" fill="#e7d5b3"/>
      <path d="M34 58 Q38 60 40 58 Q36 57 34 55Z" fill="#e7d5b3"/>
      <path d="M34 58 Q35 62 37 60 Q35 59 33 57Z" fill="#e7d5b3"/>
      {/* Tail */}
      <path d="M18 46 Q10 50 6 58" fill="none" stroke="#6d28d9" strokeWidth="3" strokeLinecap="round"/>
    </svg>
  )
}

export function SpriteCarnifex({ size = 64 }: SP) {
  const w = size * 0.95, h = size
  return (
    <svg width={w} height={h} viewBox="0 0 56 60" fill="none">
      {/* CARNIFEX - massive, fills entire frame */}
      {/* Thick heavy carapace back */}
      <path d="M10 6 Q28 2 46 6 Q52 14 50 30 Q48 38 28 38 Q8 38 6 30 Q4 14 10 6Z" fill="#5b21b6"/>
      {/* Main body carapace */}
      <ellipse cx="28" cy="28" rx="22" ry="20" fill="#7e22ce"/>
      {/* Underbelly */}
      <ellipse cx="28" cy="32" rx="16" ry="15" fill="#e7d5b3"/>
      {/* Head - low slung, no neck */}
      <ellipse cx="28" cy="14" rx="14" ry="10" fill="#7e22ce"/>
      <path d="M16 10 Q28 4 40 10 Q34 6 28 5 Q22 6 16 10Z" fill="#6d28d9"/>
      {/* Bio-plasma cannon eye/mouth area */}
      <ellipse cx="22" cy="13" rx="5" ry="4" fill="#4c1d95"/>
      <circle cx="22" cy="13" r="3" fill="#7c3aed"/>
      <circle cx="22" cy="13" r="1.5" fill="#a78bfa"/>
      <ellipse cx="34" cy="13" rx="5" ry="4" fill="#4c1d95"/>
      <circle cx="34" cy="13" r="3" fill="#7c3aed"/>
      <circle cx="34" cy="13" r="1.5" fill="#a78bfa"/>
      {/* Fanged maw */}
      <path d="M18 17 Q28 22 38 17 Q38 22 28 22 Q18 22 18 17Z" fill="#4c1d95"/>
      <path d="M20 22 L19 17 L22 17Z" fill="#e7d5b3"/>
      <path d="M25 22 L24 16 L27 16Z" fill="#e7d5b3"/>
      <path d="M31 22 L30 16 L33 16Z" fill="#e7d5b3"/>
      <path d="M36 22 L35 17 L38 17Z" fill="#e7d5b3"/>
      {/* CRUSHING CLAWS - upper pair (massive) */}
      {/* Left crushing claw */}
      <path d="M8 22 Q0 18 0 10 Q4 16 8 20Z" fill="#6d28d9"/>
      <path d="M8 28 Q-2 24 -2 16 Q4 20 10 26Z" fill="#6d28d9"/>
      {/* Claw fingers */}
      <path d="M0 10 Q-4 6 0 2 Q-1 6 2 9Z" fill="#e7d5b3"/>
      <path d="M-2 16 Q-6 12 -2 7 Q-2 12 1 15Z" fill="#e7d5b3"/>
      {/* Right crushing claw */}
      <path d="M48 22 Q56 18 56 10 Q52 16 48 20Z" fill="#6d28d9"/>
      <path d="M48 28 Q58 24 58 16 Q52 20 46 26Z" fill="#6d28d9"/>
      <path d="M56 10 Q60 6 56 2 Q57 6 54 9Z" fill="#e7d5b3"/>
      <path d="M58 16 Q62 12 58 7 Q58 12 55 15Z" fill="#e7d5b3"/>
      {/* Bio-plasma weapon arm - lower */}
      <path d="M10 34 Q2 38 0 48 Q6 40 12 36Z" fill="#7e22ce"/>
      {/* Bio weapon maw */}
      <ellipse cx="2" cy="50" rx="6" ry="5" fill="#4c1d95"/>
      <circle cx="2" cy="50" r="3" fill="#7c3aed"/>
      <circle cx="2" cy="50" r="1.5" fill="#c4b5fd"/>
      {/* Plasma glow */}
      <circle cx="2" cy="50" rx="8" ry="8" fill="none" stroke="#a78bfa" strokeWidth="0.8" opacity="0.5"/>
      {/* Lower grasping arm right */}
      <path d="M46 34 Q54 38 56 48 Q50 40 44 36Z" fill="#7e22ce"/>
      <path d="M56 48 Q60 54 58 58 Q56 52 54 48Z" fill="#e7d5b3"/>
      <path d="M56 48 Q62 50 60 56 Q58 52 56 50Z" fill="#e7d5b3"/>
      {/* Massive legs */}
      <path d="M16 44 Q10 50 6 60" fill="none" stroke="#6d28d9" strokeWidth="10" strokeLinecap="round"/>
      <path d="M40 44 Q46 50 50 60" fill="none" stroke="#6d28d9" strokeWidth="10" strokeLinecap="round"/>
      {/* Feet */}
      <ellipse cx="8" cy="58" rx="7" ry="4" fill="#5b21b6"/>
      <ellipse cx="48" cy="58" rx="7" ry="4" fill="#5b21b6"/>
    </svg>
  )
}

export function SpriteLictor({ size = 64 }: SP) {
  const w = size * 0.7, h = size
  return (
    <svg width={w} height={h} viewBox="0 0 40 60" fill="none">
      {/* Lictor - tall, lean, mantis-like predator */}
      {/* Rending claws - upper (mantis arms) */}
      {/* Left rending claw */}
      <path d="M12 18 Q4 12 0 4 Q6 10 10 16Z" fill="#7e22ce"/>
      <path d="M0 4 Q-2 0 2 -2 Q0 1 2 4Z" fill="#e7d5b3"/>
      <path d="M4 8 Q2 4 4 1 Q4 5 6 8Z" fill="#d1b896"/>
      {/* Right rending claw */}
      <path d="M28 18 Q36 12 40 4 Q34 10 30 16Z" fill="#7e22ce"/>
      <path d="M40 4 Q42 0 38 -2 Q40 1 38 4Z" fill="#e7d5b3"/>
      <path d="M36 8 Q38 4 36 1 Q36 5 34 8Z" fill="#d1b896"/>
      {/* Feeder tendrils (distinctive Lictor feature) */}
      <path d="M20 22 Q14 18 10 12" fill="none" stroke="#a78bfa" strokeWidth="1.5"/>
      <path d="M20 22 Q22 17 20 11" fill="none" stroke="#a78bfa" strokeWidth="1.5"/>
      <path d="M20 22 Q26 18 30 12" fill="none" stroke="#a78bfa" strokeWidth="1.5"/>
      <path d="M20 22 Q28 20 32 16" fill="none" stroke="#8b5cf6" strokeWidth="1"/>
      <path d="M20 22 Q12 20 8 16" fill="none" stroke="#8b5cf6" strokeWidth="1"/>
      {/* Head - elongated predator */}
      <ellipse cx="20" cy="18" rx="7" ry="9" fill="#7e22ce"/>
      <path d="M14 14 Q20 8 26 14 Q24 10 20 9 Q16 10 14 14Z" fill="#6d28d9"/>
      {/* Eyes - minimal */}
      <circle cx="17" cy="17" r="2" fill="#4c1d95"/>
      <circle cx="23" cy="17" r="2" fill="#4c1d95"/>
      <circle cx="17" cy="17" r="1" fill="#f43f5e"/>
      <circle cx="23" cy="17" r="1" fill="#f43f5e"/>
      {/* Neck */}
      <rect x="17" y="27" width="6" height="6" rx="2" fill="#7e22ce"/>
      {/* Torso - lean */}
      <ellipse cx="20" cy="36" rx="8" ry="10" fill="#7e22ce"/>
      <ellipse cx="20" cy="38" rx="5" ry="7" fill="#e7d5b3"/>
      {/* Carapace segments */}
      <path d="M13 30 Q20 26 27 30 Q24 27 20 26 Q16 27 13 30Z" fill="#6d28d9"/>
      {/* Rending talons on feet */}
      <path d="M16 44 Q10 50 8 58 Q12 51 18 46Z" fill="#7e22ce"/>
      <path d="M24 44 Q30 50 32 58 Q28 51 22 46Z" fill="#7e22ce"/>
      {/* Foot talons */}
      <path d="M8 58 Q4 62 2 58 Q5 57 8 56Z" fill="#e7d5b3"/>
      <path d="M8 58 Q6 64 4 60 Q6 59 8 57Z" fill="#e7d5b3"/>
      <path d="M32 58 Q36 62 38 58 Q35 57 32 56Z" fill="#e7d5b3"/>
      {/* Chameleonic shimmer effect */}
      <ellipse cx="20" cy="36" rx="10" ry="12" fill="none" stroke="#c4b5fd" strokeWidth="0.5" opacity="0.4"/>
    </svg>
  )
}

// ── UNIT SPRITE MAP ────────────────────────────────────────────────────────────

export const UNIT_SPRITES: Record<string, React.ComponentType<SP>> = {
  // Space Marines
  tac:  SpriteTactical,
  term: SpriteTerminator,
  sct:  SpriteScout,
  lib:  SpriteLibrarian,
  // Orks
  boy:  SpriteOrkBoy,
  nob:  SpriteNob,
  wbss: SpriteWarboss,
  gret: SpriteGretchin,
  // Chaos
  csm:  SpriteChaosMarine,
  bzrk: SpriteBerzerker,
  clrd: SpriteChaosLord,
  plg:  SpritePlagueMarine,
  // Tyranids
  hrm:  SpriteHormagaunt,
  war:  SpriteWarrior,
  cfx:  SpriteCarnifex,
  lct:  SpriteLictor,
}
