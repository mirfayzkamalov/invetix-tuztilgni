import { useEffect, useRef, useState } from 'react'
import { exportPng } from '../utils/exportImage.js'
import { COLORS } from '../data/templates.js'

const DEF = {
  name: 'Elyor Karimov', role: 'Frontend dasturchi', phone: '+998 90 123 45 67', email: 'elyor@mail.com', city: 'Toshkent',
  about: "React va zamonaviy CSS bilan tez, qulay veb-ilovalar yarataman. 3 yillik amaliy tajriba.",
  skills: 'React, JavaScript, CSS, Git, Figma',
  exp: '2023–2026 | Frontend dasturchi | Tech LLC\n2021–2023 | Web dizayner | Studio Nur',
  edu: '2017–2021 | Bakalavr, Axborot texnologiyalari | TATU', color: '#c9a24b',
}
const rows = (s) => s.split('\n').map((l) => l.split('|').map((x) => x.trim())).filter((r) => r[0])

export default function Resume({ tab }) {
  const [d, setD] = useState(() => { try { return { ...DEF, ...JSON.parse(localStorage.getItem('invitex-cv') || '{}') } } catch { return DEF } })
  const ref = useRef(null)
  const set = (k) => (e) => setD((s) => ({ ...s, [k]: e.target.value }))
  useEffect(() => { try { localStorage.setItem('invitex-cv', JSON.stringify(d)) } catch {} }, [d])
  const download = async () => { try { await exportPng(ref.current, 'rezyume.png', '#ffffff') } catch (e) { console.error(e); alert("Yuklab olishda xatolik.") } }
  const F = ([k, label, area]) => <label key={k}>{label}{area ? <textarea rows="3" value={d[k]} onChange={set(k)} /> : <input value={d[k]} onChange={set(k)} />}</label>
  const Block = ({ title, list }) => list.length > 0 && (
    <section><h4>{title}</h4>{list.map((r, i) => <div className="cv-row" key={i}><b>{r[0]}</b><span><strong>{r[1]}</strong>{r[2] && <em>{r[2]}</em>}</span></div>)}</section>
  )
  return (
    <main className={`layout show-${tab}`}>
      <aside className="left"><div className="editor">
        <section className="sec"><h3>Shaxsiy ma'lumotlar</h3>{[['name', 'Ism familiya'], ['role', 'Lavozim'], ['phone', 'Telefon'], ['email', 'Email'], ['city', 'Shahar']].map(F)}</section>
        <section className="sec"><h3>Haqimda</h3>{F(['about', 'Qisqacha', true])}</section>
        <section className="sec"><h3>Ko'nikmalar</h3>{F(['skills', 'Vergul bilan ajrating'])}</section>
        <section className="sec"><h3>Tajriba</h3><p className="hint">Har qator: yillar | lavozim | kompaniya</p>{F(['exp', 'Tajriba', true])}</section>
        <section className="sec"><h3>Ta'lim</h3><p className="hint">Har qator: yillar | daraja | o'quv yurti</p>{F(['edu', "Ta'lim", true])}</section>
        <section className="sec"><h3>Rang</h3><div className="swatches">{COLORS.map(([n, c]) => <button key={n} className={`sw ${d.color === c ? 'on' : ''}`} style={{ background: c }} aria-label={n} onClick={() => setD((s) => ({ ...s, color: c }))} />)}</div></section>
        <button className="btn ghost wide-btn" onClick={() => setD(DEF)}>Tozalash</button>
      </div></aside>
      <section className="right" aria-label="Rezyume ko'rinishi">
        <div className="stage">
          <article className="cv" ref={ref} style={{ '--ac': d.color }}>
            <header><h1>{d.name}</h1><p>{d.role}</p><small>{[d.phone, d.email, d.city].filter(Boolean).join('  ·  ')}</small></header>
            {d.about && <section><h4>Haqimda</h4><p>{d.about}</p></section>}
            {d.skills && <section><h4>Ko'nikmalar</h4><div className="tags">{d.skills.split(',').map((s) => s.trim()).filter(Boolean).map((s) => <span key={s}>{s}</span>)}</div></section>}
            <Block title="Tajriba" list={rows(d.exp)} />
            <Block title="Ta'lim" list={rows(d.edu)} />
          </article>
        </div>
        <div className="actions"><button className="btn gold big" onClick={download}>⬇ Yuklab olish</button><button className="btn" onClick={() => window.print()}>Chop etish</button></div>
      </section>
    </main>
  )
}
