import { useState, useMemo } from "react";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Permanent+Marker&family=Special+Elite&family=VT323&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  body { background: #f0ebe0; }

  @keyframes none {}

  .root {
    min-height: 100vh;
    background: #ede8dc;
    background-image:
      url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='400' height='400' filter='url(%23noise)' opacity='0.08'/%3E%3C/svg%3E");
    font-family: 'Special Elite', cursive;
    color: #1a1008;
    padding: 32px 18px 80px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  /* torn paper edge top */
  .root::before {
    content: '';
    display: block;
    width: 100%;
    height: 6px;
    background: repeating-linear-gradient(
      90deg,
      #ede8dc 0px, #ede8dc 8px,
      #c8b89a 8px, #c8b89a 9px,
      #ede8dc 9px, #ede8dc 14px,
      #b8a080 14px, #b8a080 15px,
      #ede8dc 15px, #ede8dc 22px
    );
    opacity: 0.6;
    position: fixed;
    top: 0; left: 0;
    z-index: 10;
  }

  .page {
    width: 100%;
    max-width: 560px;
  }

  /* ---- HEADER ---- */
  .header {
    margin-bottom: 28px;
    position: relative;
  }

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
    letter-spacing: -0.01em;
    /* slight hand-painted unevenness */
    text-shadow: 2px 2px 0 rgba(0,0,0,0.08);
  }

  .title-red {
    color: #9b1c1c;
    display: inline-block;
    transform: rotate(-1.5deg) translateY(2px);
  }

  .subtitle-row {
    margin-top: 10px;
    display: flex;
    gap: 0;
    flex-wrap: wrap;
  }

  .subtitle-pill {
    font-size: 11px;
    font-family: 'Special Elite', cursive;
    background: #1a0f08;
    color: #ede8dc;
    padding: 3px 10px;
    margin-right: 6px;
    margin-bottom: 4px;
    letter-spacing: 0.05em;
  }

  .subtitle-pill.red { background: #9b1c1c; }
  .subtitle-pill.blue { background: #1c3a6e; }

  /* hand-drawn divider */
  .hdivider {
    width: 100%;
    height: 14px;
    margin: 20px 0;
    background: none;
    position: relative;
    overflow: visible;
  }

  .hdivider svg {
    width: 100%;
    height: 14px;
    overflow: visible;
  }

  /* ---- INPUT CARD ---- */
  .card {
    background: #faf6ec;
    border: 2px solid #2a1a08;
    /* slightly off-angle border — hand taped feel */
    box-shadow:
      3px 3px 0 #2a1a08,
      6px 6px 0 rgba(42,26,8,0.15);
    padding: 22px 20px 20px;
    margin-bottom: 22px;
    position: relative;
  }

  /* tape corners */
  .tape {
    position: absolute;
    width: 44px; height: 16px;
    background: rgba(220, 200, 140, 0.7);
    border: 1px solid rgba(180,150,80,0.4);
    transform: rotate(-3deg);
    top: -9px; left: 18px;
  }
  .tape.tr {
    left: auto; right: 18px;
    transform: rotate(2deg);
    top: -8px;
  }

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
    letter-spacing: 0.04em;
    transition: border-color 0.15s;
  }

  .input-field:focus {
    border-bottom-color: #9b1c1c;
  }

  .input-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    margin-bottom: 18px;
  }

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
    letter-spacing: 0.02em;
    line-height: 1.6;
    padding-left: 10px;
    border-left: 3px solid #9b1c1c;
  }

  /* ---- RESULTS ---- */
  .section-label {
    font-family: 'Permanent Marker', cursive;
    font-size: 22px;
    color: #1a0f08;
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .section-label .dash {
    flex: 1;
    height: 2px;
    background: #2a1a08;
    opacity: 0.15;
    position: relative;
    top: 1px;
  }

  .section-label.green { color: #1a4a1a; }
  .section-label.orange { color: #8b3a0a; }

  /* column headers */
  .col-head-row {
    display: grid;
    grid-template-columns: 68px 68px 1fr 1fr;
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

  .result-row {
    display: grid;
    grid-template-columns: 68px 68px 1fr 1fr;
    gap: 6px;
    align-items: center;
    background: #faf6ec;
    border: 1.5px solid #d0c0a0;
    border-left: 4px solid #2a1a08;
    padding: 9px 10px;
    margin-bottom: 5px;
    position: relative;
    transition: border-left-color 0.12s;
  }

  .result-row:hover {
    border-left-color: #9b1c1c;
    background: #fff8f0;
  }

  /* every few rows slightly different left border color for hand-made feel */
  .result-row:nth-child(3n) { border-left-color: #3a2a10; }
  .result-row:nth-child(5n) { border-left-color: #4a2a10; }

  .val-u {
    font-family: 'Permanent Marker', cursive;
    font-size: 19px;
    color: #9b1c1c;
  }
  .val-u small { font-size: 10px; color: #a08060; font-family: 'Special Elite', cursive; margin-left: 2px; }

  .val-l {
    font-family: 'Permanent Marker', cursive;
    font-size: 19px;
    color: #1c3a6e;
  }
  .val-l small { font-size: 10px; color: #a08060; font-family: 'Special Elite', cursive; margin-left: 2px; }

  .val-rerolls {
    font-family: 'VT323', monospace;
    font-size: 18px;
    color: #5a4a30;
    letter-spacing: 0.05em;
  }

  .val-pity {
    font-family: 'VT323', monospace;
    font-size: 18px;
    color: #1a4a1a;
    letter-spacing: 0.05em;
  }

  .val-pity.over { color: #8b3a0a; }

  .eq-box {
    background: #faf6ec;
    border: 1.5px solid #d0c0a0;
    border-top: 2px dashed #b0a080;
    padding: 14px 14px;
    font-family: 'VT323', monospace;
    font-size: 16px;
    color: #7a6040;
    line-height: 2;
    letter-spacing: 0.04em;
    margin-top: 6px;
  }

  .eq-box b { color: #3a2a10; }

  /* ---- FOOTER ---- */
  .footer {
    margin-top: 48px;
    text-align: center;
    position: relative;
  }

  .footer-line {
    width: 80px;
    height: 2px;
    background: #2a1a08;
    opacity: 0.2;
    margin: 0 auto 16px;
  }

  .footer-made {
    font-size: 10px;
    color: #a08060;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    font-family: 'Special Elite', cursive;
    margin-bottom: 4px;
  }

  .footer-name {
    font-family: 'Permanent Marker', cursive;
    font-size: 20px;
    color: #2a1a08;
    letter-spacing: 0.02em;
  }

  .footer-name span {
    color: #9b1c1c;
  }

  .results-block {
    margin-bottom: 24px;
  }

  @media (max-width: 420px) {
    .input-row { grid-template-columns: 1fr; }
    .col-head-row, .result-row { grid-template-columns: 56px 56px 1fr 1fr; }
  }
`;

// hand-drawn squiggly line SVG path — randomised feel
function Divider() {
  return (
    <div className="hdivider">
      <svg viewBox="0 0 560 14" preserveAspectRatio="none">
        <path
          d="M0,7 C30,2 60,12 90,7 C120,2 150,11 180,7 C210,3 240,10 270,7 C300,4 330,11 360,6 C390,2 420,12 450,7 C480,3 510,10 540,7 L560,7"
          fill="none"
          stroke="#2a1a08"
          strokeWidth="1.8"
          opacity="0.25"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}

function solve(needed) {
  const exact = [];
  const overshoot = [];
  const maxU = Math.ceil(needed / 6) + 1;
  const maxL = Math.ceil(needed / 3) + 1;

  for (let u = 0; u <= maxU; u++) {
    for (let l = 0; l <= maxL; l++) {
      const pityGained = 6 * u + 3 * l;
      const rerollsSpent = u * 1 + l * 6;
      if (pityGained === needed) {
        exact.push({ u, l, pityGained, rerollsSpent });
      } else if (pityGained > needed && pityGained <= needed + 5) {
        overshoot.push({ u, l, pityGained, rerollsSpent, over: pityGained - needed });
      }
    }
  }

  exact.sort((a, b) => a.rerollsSpent - b.rerollsSpent || b.u - a.u);
  overshoot.sort((a, b) => a.over - b.over || a.rerollsSpent - b.rerollsSpent);
  return { exact: exact.slice(0, 10), overshoot: overshoot.slice(0, 6) };
}

export default function PityCalc() {
  const [start, setStart] = useState(183);
  const [target, setTarget] = useState(240);

  const needed = target - start;
  const valid = needed > 0 && Number.isInteger(needed);
  const divisible = needed % 3 === 0;

  const { exact, overshoot } = useMemo(() => {
    if (!valid) return { exact: [], overshoot: [] };
    return solve(needed);
  }, [needed, valid]);

  return (
    <>
      <style>{styles}</style>
      <div className="root">
        <div className="page">

          {/* Header */}
          <div className="header">
            <div className="stamp-bg">闘</div>
            <div className="eyebrow">Talent Reroll System</div>
            <div className="title">
              Pity <span className="title-red">Calc</span>
            </div>
            <div className="subtitle-row">
              <span className="subtitle-pill red">UNLOCK — 1 roll → +6 pity</span>
              <span className="subtitle-pill blue">LOCKED — 6 rolls → +3 pity</span>
            </div>
          </div>

          <Divider />

          {/* Inputs */}
          <div className="card">
            <div className="tape" />
            <div className="tape tr" />
            <div className="input-row">
              <div>
                <label className="input-label">Current Pity</label>
                <input
                  className="input-field"
                  type="number"
                  value={start}
                  onChange={e => setStart(Number(e.target.value))}
                />
              </div>
              <div>
                <label className="input-label">Target Pity</label>
                <input
                  className="input-field"
                  type="number"
                  value={target}
                  onChange={e => setTarget(Number(e.target.value))}
                />
              </div>
            </div>

            <div className="needed-strip">
              <span className="needed-label">Pity Needed</span>
              <span className="needed-val" style={{ color: !valid ? "#9b1c1c" : divisible ? "#1a0f08" : "#8b3a0a" }}>
                {valid ? needed : "—"}
                {valid && !divisible && <span style={{ fontSize: 14, marginLeft: 8, fontFamily: "'Special Elite', cursive", color: "#8b3a0a" }}>not ÷3</span>}
              </span>
            </div>

            {valid && !divisible && (
              <div className="warning">
                {needed} can't be divided evenly by 3.<br />
                No exact solution — showing closest overshoots.
              </div>
            )}
          </div>

          {/* Results */}
          {valid && (exact.length > 0 || overshoot.length > 0) && (
            <>
              <div className="col-head-row">
                <span className="col-head">Unlock</span>
                <span className="col-head">Locked</span>
                <span className="col-head">Rerolls</span>
                <span className="col-head">Pity</span>
              </div>

              {exact.length > 0 && (
                <div className="results-block">
                  <div className="section-label green">
                    Exact hit <div className="dash" />
                  </div>
                  {exact.map((sol) => (
                    <div className="result-row" key={`${sol.u}-${sol.l}`}>
                      <span className="val-u">{sol.u}<small>u</small></span>
                      <span className="val-l">{sol.l}<small>l</small></span>
                      <span className="val-rerolls">{sol.rerollsSpent}</span>
                      <span className="val-pity">+{sol.pityGained}</span>
                    </div>
                  ))}
                </div>
              )}

              {overshoot.length > 0 && (
                <div className="results-block">
                  <div className="section-label orange">
                    Overshoot <div className="dash" />
                  </div>
                  {overshoot.map((sol) => (
                    <div className="result-row" key={`${sol.u}-${sol.l}-o${sol.over}`}>
                      <span className="val-u">{sol.u}<small>u</small></span>
                      <span className="val-l">{sol.l}<small>l</small></span>
                      <span className="val-rerolls">{sol.rerollsSpent}</span>
                      <span className="val-pity over">+{sol.pityGained} <span style={{ fontSize: 13, opacity: 0.7 }}>(+{sol.over})</span></span>
                    </div>
                  ))}
                </div>
              )}

              <div className="eq-box">
                <b>eq:</b> &nbsp;6u + 3l = {needed}<br />
                <b>cost:</b> &nbsp;(u × 1) + (l × 6) = rerolls
              </div>
            </>
          )}

          <Divider />

          {/* Footer */}
          <div className="footer">
            <div className="footer-made">made by</div>
            <div className="footer-name">Silas <span>"The Original"</span> Sin</div>
          </div>

        </div>
      </div>
    </>
  );
}
