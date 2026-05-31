import { useState, useMemo, useEffect } from "react";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Permanent+Marker&family=Special+Elite&family=VT323&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #f0ebe0; }

  .root {
    min-height: 100vh;
    background: #ede8dc;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='400' height='400' filter='url(%23noise)' opacity='0.08'/%3E%3C/svg%3E");
    font-family: 'Special Elite', cursive;
    color: #1a1008;
    padding: 32px 18px 80px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .page { width: 100%; max-width: 560px; }

  .header { margin-bottom: 28px; position: relative; }

  .stamp-bg {
    position: absolute;
    top: -10px; right: -8px;
    font-family: 'Permanent Marker', cursive;
    font-size: 88px;
    color: rgba(160, 30, 20, 0.07);
    transform: rotate(12deg);
    user-select: none;
    pointer-events: none;
    line-height: 1;
  }

  .eyebrow {
    font-family: 'Special Elite', cursive;
    font-size: 11px;
    letter-spacing: 0.18em;
    color: #7a5a3a;
    text-transform: uppercase;
    margin-bottom: 6px;
  }

  .title {
    font-family: 'Permanent Marker', cursive;
    font-size: clamp(38px, 9vw, 62px);
    color: #1a0f08;
    line-height: 1;
    text-shadow: 2px 2px 0 rgba(0,0,0,0.08);
  }

  .title-red {
    color: #9b1c1c;
    display: inline-block;
    transform: rotate(-1.5deg) translateY(2px);
  }

  .hdivider { width: 100%; height: 14px; margin: 20px 0; }
  .hdivider svg { width: 100%; height: 14px; overflow: visible; }

  .card {
    background: #faf6ec;
    border: 2px solid #2a1a08;
    box-shadow: 3px 3px 0 #2a1a08, 6px 6px 0 rgba(42,26,8,0.15);
    padding: 22px 20px 20px;
    margin-bottom: 22px;
    position: relative;
  }

  .tape {
    position: absolute;
    width: 44px; height: 16px;
    background: rgba(220, 200, 140, 0.7);
    border: 1px solid rgba(180,150,80,0.4);
    transform: rotate(-3deg);
    top: -9px; left: 18px;
  }
  .tape.tr { left: auto; right: 18px; transform: rotate(2deg); top: -8px; }

  .input-label {
    font-size: 10px;
    letter-spacing: 0.2em;
    color: #7a5a3a;
    text-transform: uppercase;
    display: block;
    margin-bottom: 6px;
    font-family: 'Special Elite', cursive;
  }

  .input-field {
    width: 100%;
    background: transparent;
    border: none;
    border-bottom: 2.5px solid #2a1a08;
    padding: 6px 4px 8px;
    font-size: 28px;
    font-family: 'Permanent Marker', cursive;
    color: #1a0f08;
    outline: none;
    transition: border-color 0.15s;
  }
  .input-field:focus { border-bottom-color: #9b1c1c; }

  .input-row { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 22px; }

  .lock-section { margin-bottom: 18px; }

  .lock-buttons { display: flex; gap: 8px; margin-top: 8px; }

  .lock-btn {
    flex: 1;
    padding: 10px 4px;
    background: transparent;
    border: 2px solid #2a1a08;
    font-family: 'Permanent Marker', cursive;
    font-size: 18px;
    color: #2a1a08;
    cursor: pointer;
    transition: background 0.1s, color 0.1s;
  }

  .lock-btn small {
    display: block;
    font-family: 'Special Elite', cursive;
    font-size: 9px;
    letter-spacing: 0.08em;
    color: #7a5a3a;
    margin-top: 2px;
  }

  .lock-btn.active { background: #2a1a08; color: #ede8dc; }
  .lock-btn.active small { color: #a08060; }

  .lock-info {
    margin-top: 10px;
    display: flex;
    gap: 16px;
    font-size: 11px;
    color: #7a5a3a;
    font-family: 'Special Elite', cursive;
    letter-spacing: 0.05em;
    border-top: 1px dashed #c0a880;
    padding-top: 10px;
    flex-wrap: wrap;
  }

  .lock-info b { color: #9b1c1c; }
  .lock-info b.blue { color: #1c3a6e; }

  .needed-strip {
    border-top: 2px dashed #2a1a0844;
    padding-top: 14px;
    display: flex;
    justify-content: space-between;
    align-items: baseline;
  }

  .needed-label {
    font-size: 10px;
    letter-spacing: 0.2em;
    color: #7a5a3a;
    text-transform: uppercase;
    font-family: 'Special Elite', cursive;
  }

  .needed-val {
    font-family: 'Permanent Marker', cursive;
    font-size: 36px;
    color: #9b1c1c;
  }

  .warning {
    margin-top: 10px;
    font-size: 12px;
    color: #9b1c1c;
    font-family: 'Special Elite', cursive;
    line-height: 1.6;
    padding-left: 10px;
    border-left: 3px solid #9b1c1c;
  }

  /* Save button */
  .save-btn {
    width: 100%;
    margin-top: 16px;
    padding: 12px;
    background: #2a1a08;
    color: #ede8dc;
    border: none;
    font-family: 'Permanent Marker', cursive;
    font-size: 18px;
    letter-spacing: 0.05em;
    cursor: pointer;
    transition: background 0.15s;
    position: relative;
  }

  .save-btn:hover { background: #9b1c1c; }

  .save-btn.saved { background: #1a4a1a; }

  .col-head-row {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 6px;
    padding: 0 10px;
    margin-bottom: 4px;
  }

  .col-head {
    font-size: 9px;
    letter-spacing: 0.18em;
    color: #a08060;
    text-transform: uppercase;
    font-family: 'Special Elite', cursive;
  }

  .section-label {
    font-family: 'Permanent Marker', cursive;
    font-size: 22px;
    color: #1a0f08;
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .section-label .dash { flex: 1; height: 2px; background: #2a1a08; opacity: 0.15; position: relative; top: 1px; }
  .section-label.green { color: #1a4a1a; }
  .section-label.orange { color: #8b3a0a; }

  .result-row {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 6px;
    align-items: center;
    background: #faf6ec;
    border: 1.5px solid #d0c0a0;
    border-left: 4px solid #2a1a08;
    padding: 9px 10px;
    margin-bottom: 5px;
    transition: border-left-color 0.12s;
  }

  .result-row:hover { border-left-color: #9b1c1c; background: #fff8f0; }
  .result-row:nth-child(3n) { border-left-color: #3a2a10; }
  .result-row:nth-child(5n) { border-left-color: #4a2a10; }

  .val-rolls { font-family: 'Permanent Marker', cursive; font-size: 19px; color: #9b1c1c; }
  .val-rolls small { font-size: 10px; color: #a08060; font-family: 'Special Elite', cursive; margin-left: 2px; }

  .val-rerolls { font-family: 'VT323', monospace; font-size: 18px; color: #5a4a30; }
  .val-pity { font-family: 'VT323', monospace; font-size: 18px; color: #1a4a1a; }
  .val-pity.over { color: #8b3a0a; }

  .eq-box {
    background: #faf6ec;
    border: 1.5px solid #d0c0a0;
    border-top: 2px dashed #b0a080;
    padding: 14px;
    font-family: 'VT323', monospace;
    font-size: 16px;
    color: #7a6040;
    line-height: 2;
    margin-top: 6px;
  }
  .eq-box b { color: #3a2a10; }

  .results-block { margin-bottom: 24px; }

  /* History */
  .history-card {
    background: #faf6ec;
    border: 2px solid #2a1a08;
    box-shadow: 3px 3px 0 #2a1a08;
    padding: 18px 20px;
    margin-bottom: 22px;
    position: relative;
  }

  .history-title {
    font-family: 'Permanent Marker', cursive;
    font-size: 24px;
    color: #1a0f08;
    margin-bottom: 14px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .clear-btn {
    font-family: 'Special Elite', cursive;
    font-size: 10px;
    letter-spacing: 0.12em;
    color: #9b1c1c;
    background: none;
    border: 1px solid #9b1c1c;
    padding: 4px 10px;
    cursor: pointer;
    text-transform: uppercase;
  }

  .history-empty {
    font-size: 12px;
    color: #a08060;
    font-family: 'Special Elite', cursive;
    letter-spacing: 0.05em;
    text-align: center;
    padding: 12px 0;
  }

  .history-entry {
    border-bottom: 1px dashed #d0c0a0;
    padding: 10px 0;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 10px;
  }

  .history-entry:last-child { border-bottom: none; }

  .history-left { flex: 1; }

  .history-pity {
    font-family: 'Permanent Marker', cursive;
    font-size: 16px;
    color: #1a0f08;
  }

  .history-pity span { color: #9b1c1c; }

  .history-meta {
    font-size: 10px;
    color: #a08060;
    font-family: 'Special Elite', cursive;
    letter-spacing: 0.05em;
    margin-top: 3px;
  }

  .history-date {
    font-size: 10px;
    color: #c0a880;
    font-family: 'VT323', monospace;
    font-size: 13px;
    white-space: nowrap;
  }

  .history-delete {
    background: none;
    border: none;
    color: #c0a080;
    cursor: pointer;
    font-size: 14px;
    padding: 2px 6px;
    font-family: 'Special Elite', cursive;
    line-height: 1;
  }
  .history-delete:hover { color: #9b1c1c; }

  .footer { margin-top: 48px; text-align: center; }
  .footer-made { font-size: 10px; color: #a08060; letter-spacing: 0.15em; text-transform: uppercase; font-family: 'Special Elite', cursive; margin-bottom: 4px; }
  .footer-name { font-family: 'Permanent Marker', cursive; font-size: 20px; color: #2a1a08; }
  .footer-name span { color: #9b1c1c; }

  @media (max-width: 420px) {
    .input-row { grid-template-columns: 1fr; }
  }
`;

const LOCK_STATS = {
  0: { rerollCost: 1, pityGained: 6 },
  1: { rerollCost: 2, pityGained: 5 },
  2: { rerollCost: 4, pityGained: 4 },
  3: { rerollCost: 6, pityGained: 3 },
};

function solve(needed, locks) {
  const { rerollCost, pityGained } = LOCK_STATS[locks];
  const unlocked = LOCK_STATS[0];
  const exact = [];
  const overshoot = [];
  const maxU = Math.ceil(needed / unlocked.pityGained) + 2;
  const maxL = Math.ceil(needed / pityGained) + 2;

  for (let u = 0; u <= maxU; u++) {
    for (let l = 0; l <= maxL; l++) {
      const totalPity = unlocked.pityGained * u + pityGained * l;
      const totalRerolls = unlocked.rerollCost * u + rerollCost * l;
      if (totalPity === needed) exact.push({ u, l, totalPity, totalRerolls });
      else if (totalPity > needed && totalPity <= needed + 5)
        overshoot.push({ u, l, totalPity, totalRerolls, over: totalPity - needed });
    }
  }

  exact.sort((a, b) => a.totalRerolls - b.totalRerolls || b.u - a.u);
  overshoot.sort((a, b) => a.over - b.over || a.totalRerolls - b.totalRerolls);
  return { exact: exact.slice(0, 10), overshoot: overshoot.slice(0, 6) };
}

function Divider() {
  return (
    <div className="hdivider">
      <svg viewBox="0 0 560 14" preserveAspectRatio="none">
        <path d="M0,7 C30,2 60,12 90,7 C120,2 150,11 180,7 C210,3 240,10 270,7 C300,4 330,11 360,6 C390,2 420,12 450,7 C480,3 510,10 540,7 L560,7"
          fill="none" stroke="#2a1a08" strokeWidth="1.8" opacity="0.25" strokeLinecap="round" />
      </svg>
    </div>
  );
}

function formatDate(ts) {
  const d = new Date(ts);
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short" }) + " " +
    d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
}

const STORAGE_KEY = "pity-history";

export default function PityCalc() {
  const [start, setStart] = useState(183);
  const [target, setTarget] = useState(240);
  const [locks, setLocks] = useState(3);
  const [savedMsg, setSavedMsg] = useState(false);
  const [history, setHistory] = useState([]);

  // Load history from storage on mount
  useEffect(() => {
    (async () => {
      try {
        const res = await window.storage.get(STORAGE_KEY);
        if (res && res.value) setHistory(JSON.parse(res.value));
      } catch (_) {}
    })();
  }, []);

  const needed = target - start;
  const valid = needed > 0 && Number.isInteger(needed);
  const { rerollCost, pityGained } = LOCK_STATS[locks];

  const gcd = (a, b) => b === 0 ? a : gcd(b, a % b);
  const divisible = valid ? needed % gcd(6, pityGained) === 0 : false;

  const { exact, overshoot } = useMemo(() => {
    if (!valid) return { exact: [], overshoot: [] };
    return solve(needed, locks);
  }, [needed, locks, valid]);

  async function handleSave() {
    if (!valid) return;
    const entry = {
      id: Date.now(),
      ts: Date.now(),
      start,
      target,
      needed,
      locks,
      rerollCost,
      pityGained,
    };
    const updated = [entry, ...history].slice(0, 20);
    setHistory(updated);
    try {
      await window.storage.set(STORAGE_KEY, JSON.stringify(updated));
    } catch (_) {}
    setSavedMsg(true);
    setTimeout(() => setSavedMsg(false), 1500);
  }

  async function handleDelete(id) {
    const updated = history.filter(h => h.id !== id);
    setHistory(updated);
    try {
      await window.storage.set(STORAGE_KEY, JSON.stringify(updated));
    } catch (_) {}
  }

  async function handleClear() {
    setHistory([]);
    try {
      await window.storage.delete(STORAGE_KEY);
    } catch (_) {}
  }

  function handleLoad(entry) {
    setStart(entry.start);
    setTarget(entry.target);
    setLocks(entry.locks);
  }

  return (
    <>
      <style>{styles}</style>
      <div className="root">
        <div className="page">

          <div className="header">
            <div className="stamp-bg">闘</div>
            <div className="eyebrow">Talent Reroll System</div>
            <div className="title">Pity <span className="title-red">Calc</span></div>
          </div>

          <Divider />

          <div className="card">
            <div className="tape" />
            <div className="tape tr" />

            <div className="input-row">
              <div>
                <label className="input-label">Current Pity</label>
                <input className="input-field" type="number" value={start}
                  onChange={e => setStart(Number(e.target.value))} />
              </div>
              <div>
                <label className="input-label">Target Pity</label>
                <input className="input-field" type="number" value={target}
                  onChange={e => setTarget(Number(e.target.value))} />
              </div>
            </div>

            <div className="lock-section">
              <label className="input-label">Talents Locked</label>
              <div className="lock-buttons">
                {[0, 1, 2, 3].map(n => (
                  <button key={n} className={`lock-btn${locks === n ? " active" : ""}`}
                    onClick={() => setLocks(n)}>
                    {n}
                    <small>{LOCK_STATS[n].rerollCost} roll{LOCK_STATS[n].rerollCost > 1 ? "s" : ""}</small>
                  </button>
                ))}
              </div>
              <div className="lock-info">
                <span>cost <b>{rerollCost} reroll{rerollCost > 1 ? "s" : ""}</b></span>
                <span>gain <b className="blue">+{pityGained} pity</b></span>
                <span>unlocked <b>+6 / 1 roll</b></span>
              </div>
            </div>

            <div className="needed-strip">
              <span className="needed-label">Pity Needed</span>
              <span className="needed-val" style={{ color: !valid ? "#9b1c1c" : divisible ? "#1a0f08" : "#8b3a0a" }}>
                {valid ? needed : "—"}
                {valid && !divisible && <span style={{ fontSize: 14, marginLeft: 8, fontFamily: "'Special Elite', cursive", color: "#8b3a0a" }}>no exact hit</span>}
              </span>
            </div>

            {valid && !divisible && (
              <div className="warning">
                Can't hit {needed} exactly with this lock config.<br />
                Showing closest overshoots below.
              </div>
            )}

            {valid && (
              <button className={`save-btn${savedMsg ? " saved" : ""}`} onClick={handleSave}>
                {savedMsg ? "✓ Saved" : "Save Session"}
              </button>
            )}
          </div>

          {/* Results */}
          {valid && (exact.length > 0 || overshoot.length > 0) && (
            <>
              <div className="col-head-row">
                <span className="col-head">Actions</span>
                <span className="col-head">Rerolls spent</span>
                <span className="col-head">Pity gained</span>
              </div>

              {exact.length > 0 && (
                <div className="results-block">
                  <div className="section-label green">Exact hit <div className="dash" /></div>
                  {exact.map((sol) => (
                    <div className="result-row" key={`${sol.u}-${sol.l}`}>
                      <span className="val-rolls">
                        {sol.u > 0 && <>{sol.u}<small>u</small></>}
                        {sol.u > 0 && sol.l > 0 && " "}
                        {sol.l > 0 && <>{sol.l}<small>l</small></>}
                        {sol.u === 0 && sol.l === 0 && "0"}
                      </span>
                      <span className="val-rerolls">{sol.totalRerolls}</span>
                      <span className="val-pity">+{sol.totalPity}</span>
                    </div>
                  ))}
                </div>
              )}

              {overshoot.length > 0 && (
                <div className="results-block">
                  <div className="section-label orange">Overshoot <div className="dash" /></div>
                  {overshoot.map((sol) => (
                    <div className="result-row" key={`${sol.u}-${sol.l}-o${sol.over}`}>
                      <span className="val-rolls">
                        {sol.u > 0 && <>{sol.u}<small>u</small></>}
                        {sol.u > 0 && sol.l > 0 && " "}
                        {sol.l > 0 && <>{sol.l}<small>l</small></>}
                      </span>
                      <span className="val-rerolls">{sol.totalRerolls}</span>
                      <span className="val-pity over">+{sol.totalPity} <span style={{ fontSize: 13, opacity: 0.7 }}>(+{sol.over})</span></span>
                    </div>
                  ))}
                </div>
              )}

              <div className="eq-box">
                <b>unlocked:</b> &nbsp;1 action = 1 reroll = +6 pity<br />
                <b>locked ({locks}):</b> &nbsp;1 action = {rerollCost} reroll{rerollCost > 1 ? "s" : ""} = +{pityGained} pity<br />
                <b>solving:</b> &nbsp;6u + {pityGained}l = {needed}
              </div>
            </>
          )}

          <Divider />

          {/* History */}
          <div className="history-card">
            <div className="history-title">
              History
              {history.length > 0 && (
                <button className="clear-btn" onClick={handleClear}>Clear all</button>
              )}
            </div>

            {history.length === 0 && (
              <div className="history-empty">No sessions saved yet. Hit "Save Session" above.</div>
            )}

            {history.map(entry => (
              <div className="history-entry" key={entry.id}>
                <div className="history-left" style={{ cursor: "pointer" }} onClick={() => handleLoad(entry)}>
                  <div className="history-pity">
                    {entry.start} → <span>{entry.target}</span>
                    <span style={{ color: "#5a4a30", fontSize: 13, marginLeft: 6 }}>
                      (need {entry.needed})
                    </span>
                  </div>
                  <div className="history-meta">
                    {entry.locks} locked · {entry.rerollCost} reroll{entry.rerollCost > 1 ? "s" : ""} · +{entry.pityGained} pity per action
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 }}>
                  <span className="history-date">{formatDate(entry.ts)}</span>
                  <button className="history-delete" onClick={() => handleDelete(entry.id)}>✕</button>
                </div>
              </div>
            ))}
          </div>

          <div className="footer">
            <div className="footer-made">made by</div>
            <div className="footer-name">Silas <span>"The Original"</span> Sin</div>
          </div>

        </div>
      </div>
    </>
  );
}
