// Rough "typical retail price" rules (PKR) used ONLY for items the old site had no price for and where
// no trustworthy similar priced item exists. These are market GUESSES, not facts: every row that uses
// them is marked `market-guess` in data/price-sheet.csv so you can find and correct them.
//
// Each rule: [list-slug test, name test, price, reference size (mm, optional), size exponent]

const L = (re) => (l) => re.test(l);
const N = (re) => (n) => re.test(n);
const any = () => true;

export const RULES = [
  // ---- PPR-C pipes and fittings (size in mm, reference 25 mm) -------------------------------
  [L(/^pprc/), N(/pipe/), 1000, 25, 1.4],
  [L(/^pprc/), N(/gate valve|ball valve|stop ?cock|valve/), 1400, 25, 1.0],
  [L(/^pprc/), N(/union/), 520, 25, 1.1],
  [L(/^pprc/), N(/male|female|thread|brass|metal/), 260, 25, 1.2],
  [L(/^pprc/), N(/tee|cross/), 110, 25, 1.3],
  [L(/^pprc/), N(/elbow|bend/), 80, 25, 1.3],
  [L(/^pprc/), N(/socket|coupling|reducer|reducing|nipple|bush/), 70, 25, 1.25],
  [L(/^pprc/), N(/cap|plug|end/), 55, 25, 1.25],
  [L(/^pprc/), N(/saddle|clip|clamp|wall ?plate|crossover|bridge/), 140, 25, 1.1],
  [L(/^pprc/), any, 120, 25, 1.2],
  // ---- PVC electrical conduit (reference 20 mm) ----------------------------------------------
  [L(/electrical/), N(/pipe/), 90, 20, 1.2],
  [L(/electrical/), any, 25, 20, 1.0],
  // ---- PVC / UPVC pressure + drain pipes and fittings (reference 25.4 mm = 1 inch) ------------
  [L(/^pvc/), N(/bottle|solvent|cement|glue/), 350],
  [L(/^pvc/), N(/pipe/), 520, 25.4, 1.4],
  [L(/^pvc/), N(/union|valve/), 650, 25.4, 1.0],
  [L(/^pvc/), N(/trap/), 260, 25.4, 1.2],
  [L(/^pvc/), N(/saddle|clamp|clip/), 100, 25.4, 1.2],
  [L(/^pvc/), N(/elbow|bend/), 70, 25.4, 1.4],
  [L(/^pvc/), N(/tee|cross/), 95, 25.4, 1.4],
  [L(/^pvc/), N(/socket|coupling|reducer|reducing|nipple|bush/), 55, 25.4, 1.4],
  [L(/^pvc/), N(/cap|plug/), 45, 25.4, 1.4],
  [L(/^pvc/), any, 80, 25.4, 1.3],
  // ---- Water tanks (price per litre; GL = gallons) ---------------------------------------------
  [L(/^tanks-cover/), any, 1800],
  [L(/^tanks-/), (n) => /(\d+)\s*(gl|l)\b/i.test(n), (n) => {
    const m = n.match(/(\d+)\s*(gl|l)\b/i);
    const litres = +m[1] * (m[2].toLowerCase() === 'gl' ? 4.546 : 1);
    const brand = /master/i.test(n) && !/prime/i.test(n) ? 0.85 : /suntuff/i.test(n) ? 0.95 : 1;
    return litres * 17 * brand;
  }],
  // ---- Geysers ------------------------------------------------------------------------------------
  [L(/^geysers/), N(/wire|thermocouple|knob|gasket|cable|cap|washer/), 600],
  [L(/^geysers/), N(/element/), 700],
  [L(/^geysers/), N(/thermostat|unitrol/), 500],
  [L(/^geysers/), (n) => /(\d+)\s*l\b/i.test(n), (n) => 4500 + 380 * +n.match(/(\d+)\s*l\b/i)[1]],
  [L(/^geysers/), N(/kit|spare|part|valve|rod/), 800],
  [L(/^geysers/), any, 9000],
  // ---- Folding ladders (price per foot) -----------------------------------------------------------
  [L(/^ladder/), (n) => /(\d+)\s*foot/i.test(n), (n) => 780 * +n.match(/(\d+)\s*foot/i)[1] * (/angle/i.test(n) ? 1.15 : 1)],
  // ---- Gas ----------------------------------------------------------------------------------------
  [L(/^gas-pipes/), N(/professional/), 420],
  [L(/^gas-pipes/), N(/super/), 330],
  [L(/^gas-pipes/), N(/heavy/), 280],
  [L(/^gas-pipes/), N(/2\.5/), 230],
  [L(/^gas-pipes/), any, 180],
  [L(/^gas-fittings/), N(/regulator/), 1100],
  [L(/^gas-fittings/), N(/valve/), 650],
  [L(/^gas-fittings/), N(/nozel|nozzle/), 250],
  [L(/^gas-fittings/), N(/cross/), 260],
  [L(/^gas-fittings/), N(/tee/), 200],
  [L(/^gas-fittings/), any, 150],
  // ---- Curtain pipes and brackets -----------------------------------------------------------------
  [L(/^curtain/), N(/bracket/), (n) => (/ss/i.test(n) ? 260 : 150) * (/heavy/i.test(n) ? 1.3 : 1) * (/chori/i.test(n) ? 0.7 : 1)],
  [L(/^curtain/), N(/pipe/), (n) => (/ss/i.test(n) ? 900 : /iron/i.test(n) ? 600 : 450) * (/heavy/i.test(n) ? 1.4 : 1)],
  [L(/^curtain/), any, 90],
  // ---- Waterproof plastic sheets (price per foot of width) -----------------------------------------
  [L(/^plastic-sheets/), (n) => /(\d+)\s*feet/i.test(n), (n) => 250 * +n.match(/(\d+)\s*feet/i)[1] * (/royal|pure/i.test(n) ? 1.35 : 1)],
  // ---- Main hole covers (reference 12 inch) ---------------------------------------------------------
  [L(/^manhole-ss/), any, 2400, 304.8, 1.5],
  [L(/^manhole-plastic/), any, 320, 304.8, 1.5],
  [L(/^manhole-daigy/), (n) => /square/i.test(n), 420, 304.8, 1.5],
  [L(/^manhole-daigy/), any, 380, 304.8, 1.5],
  // ---- Locks ----------------------------------------------------------------------------------------
  [L(/^main-door-locks/), any, 3500],
  [L(/^handle-locks/), any, 2200],
  // ---- Sanitary ware ----------------------------------------------------------------------------------
  [L(/^sanitary-commode/), N(/bolt/), (n) => (/ss/i.test(n) ? 350 : 150)],
  [L(/^sanitary-commode/), N(/seat cover|cover/), (n) => (/ifo/i.test(n) ? 3200 : /hydraulic/i.test(n) ? 1800 : 1100)],
  [L(/^sanitary-commode/), N(/fitting/), 450],
  [L(/^sanitary-commode/), N(/wall hang/), 18000],
  [L(/^sanitary-commode/), N(/one piece/), 28000],
  [L(/^sanitary-commode/), N(/ifo/), 13500],
  [L(/^sanitary-commode/), any, 9000],
  [L(/^sanitary-flush-tanks/), N(/bott?le|fitting/), 650],
  [L(/^sanitary-flush-tanks/), N(/gola/), 350],
  [L(/^sanitary-flush-tanks/), N(/dura/i), 4200],
  [L(/^sanitary-flush-tanks/), any, 3200],
  [L(/^sanitary-flush/), N(/trap/), (n) => (/4/.test(n) ? 700 : 520)],
  [L(/^sanitary-flush/), any, 900],
  [L(/^sanitary-wash/), (n) => /(\d+)\s*x\s*(\d+)/i.test(n), (n) => {
    const m = n.match(/(\d+)\s*x\s*(\d+)/i);
    return 600 + 11 * +m[1] * +m[2] + (/diamond/i.test(n) ? 1000 : 0) + (/corner/i.test(n) ? 200 : 0);
  }],
  [L(/^sanitary-wash/), N(/one piece/), 6500],
  [L(/^sanitary-wash/), N(/diamond/), 6300],
  [L(/^sanitary-wash/), N(/pedestal/), 8500],
  [L(/^sanitary-wash/), any, 5200],
  [L(/^kitchen-sinks/), (n) => /(\d+)\s*x\s*(\d+)/i.test(n), (n) => {
    const m = n.match(/(\d+)\s*x\s*(\d+)/i);
    return (1000 + 9 * +m[1] * +m[2]) * (/double/i.test(n) ? 1.6 : 1) * (/drain/i.test(n) ? 1.35 : 1);
  }],
  [L(/^kitchen-sinks/), any, 6500],
  // ---- Garden pipes (per metre) --------------------------------------------------------------------------
  [L(/^garden-suction/), (n) => true, (n, size) => (size ? 40 + 150 * Math.pow(size / 25.4, 0.9) : 300)],
  [L(/^garden-/), (n) => /(\d+(?:\.\d+)?)\s*mm/i.test(n), (n, size) => {
    const mm = +n.match(/(\d+(?:\.\d+)?)\s*mm/i)[1];
    const inch = (size || 25.4) / 25.4;
    return (20 + 70 * inch * Math.pow(mm / 2, 0.8)) * (/terebela/i.test(n) ? 0.9 : 1);
  }],
  // ---- Misc ------------------------------------------------------------------------------------------------
  [L(/^wall-cover/), (n) => /(\d+)\s*"/.test(n) || /(\d+)\s*inch/i.test(n), (n) => 30 + 70 * +(n.match(/(\d+)\s*("|inch)/i)?.[1] || 9)],
  [L(/^mirror$/), N(/round/), 2800],
  [L(/^mirror$/), N(/square/), 2400],
  [L(/^mirror$/), any, 1800],
  [L(/^accessory/), N(/cabinet/), (n) => (/ss/i.test(n) ? 5500 : 2200)],
  [L(/^accessory/), N(/hanger|hook|pin/), 550],
  [L(/^accessory/), N(/towel/), (n) => (/ss/i.test(n) ? 1400 : 700)],
  [L(/^accessory/), N(/holder|tumbler|paper/), 550],
  [L(/^accessory/), N(/rack|shelf/), 1300],
  [L(/^accessory/), N(/set/), (n) => (/ss/i.test(n) ? 6500 : 2400)],
  [L(/^accessory/), N(/dish/), 450],
  [L(/^accessory/), N(/dispenser/), 1500],
  [L(/^silicones/), N(/20\s*ml/i), 220],
  [L(/^silicones/), N(/50\s*ml/i), 380],
  [L(/^silicones/), any, 400],
  // ---- Faucets and showers (by type, then material) -----------------------------------------------------
  [L(/^faucet-instant/), any, 3500],
  [L(/^faucet-masjid/), any, 3800],
  [L(/^faucet-/), N(/basin mixer/), (n) => 4800 * mat(n, 1800 / 4800, 0.8, 1.15)],
  [L(/^faucet-/), N(/kitchen mixer/), (n) => 6500 * mat(n, 0.4, 0.8, 1.15)],
  [L(/^faucet-/), N(/wall mixer|mixer set/), (n) => 7200 * mat(n, 0.4, 0.8, 1.1)],
  [L(/^faucet-/), N(/double.?bib/), (n) => 1100 * mat(n, 0.4, 0.8, 1.1)],
  [L(/^faucet-/), N(/bib cock/), (n) => 650 * mat(n, 0.4, 1.05, 1.1)],
  [L(/^faucet-/), N(/side.?pillar|pillar/), (n) => 800 * mat(n, 0.4, 0.8, 1.1)],
  [L(/^faucet-/), N(/sink cock/), (n) => 900 * mat(n, 0.4, 0.8, 1.1)],
  [L(/^faucet-/), N(/tee cock|mixture pipe/), (n) => 700 * mat(n, 0.4, 0.85, 1.1)],
  [L(/^faucet-/), N(/nozz?el/), 650],
  [L(/^faucet-/), N(/jet shower/), (n) => (/plastic/i.test(n) ? 500 : 1500)],
  [L(/^faucet-/), N(/hand shower/), 900],
  [L(/^faucet-/), N(/toilet shower/), (n, s, p) => (/pipe/i.test(p.lists[0] || '') ? 1100 : 450)],
  [L(/^faucet-/), N(/neck/), (n) => 700 * mat(n, 0.4, 0.8, 1.1)],
  [L(/^faucet-/), N(/spindle/), 350],
  [L(/^faucet-/), N(/waste/), (n) => (/vanity|push/i.test(n) ? 1200 : /sink/i.test(n) ? 650 : 450)],
  [L(/^faucet-/), N(/head/), 900],
  [L(/^faucet-/), N(/lever/), 550],
  [L(/^faucet-/), N(/elbow/), 400],
  [L(/^faucet-/), N(/rod/), 1400],
  [L(/^faucet-/), N(/adop|divider/), 150],
];

function mat(name, plastic, steel, brass) {
  if (/plastic/i.test(name)) return plastic;
  if (/steel|ss\b/i.test(name)) return steel;
  if (/brass/i.test(name)) return brass;
  return 1;
}

// returns a rounded-by-caller price or null when no rule matches
export function ruleEstimate(p, sizeMM) {
  const list = p.lists[0] || '';
  const name = p.name;
  for (const [lt, nt, price, ref, exp] of RULES) {
    if (!lt(list) || !nt(name.toLowerCase())) continue;
    let v = typeof price === 'function' ? price(name, sizeMM, p) : price;
    if (ref && sizeMM && typeof price !== 'function') v = v * Math.pow(sizeMM / ref, exp || 1);
    return Math.max(10, v);
  }
  return null;
}
