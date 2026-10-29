'use client';

// The kiosk screen (Clover Kiosk, tablet or touch screen in a browser in full screen). Big buttons, photos,
// French / English, the real Clover menu. Pairing: open /kiosk?key=dk_… once; the key stays on this screen.
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

type Mod = { id: string; name: string; priceCents: number };
type Group = { id: string; name: string; min: number; max: number | null; modifiers: Mod[] };
type Item = { id: string; name: string; priceCents: number; taxPct: number; photo: string | null; groups: Group[] };
type Menu = { categories: Array<{ id: string; name: string; itemIds: string[] }>; items: Record<string, Item> };
type Line = { itemId: string; quantity: number; modifierIds: string[] };
const KEY = 't4ctile-kiosk-key';
const $ = (c: number, lang: 'fr' | 'en') => new Intl.NumberFormat(lang === 'en' ? 'en-CA' : 'fr-CA', { style: 'currency', currency: 'CAD' }).format(c / 100);

export function Kiosk() {
  const [key, setKey] = useState<string | null>(null);
  const [lang, setLang] = useState<'fr' | 'en'>('fr');
  const [menu, setMenu] = useState<Menu | null>(null);
  const [settings, setSettings] = useState({ welcomeFr: '', welcomeEn: '', idleSeconds: 90 });
  const [err, setErr] = useState('');
  const [started, setStarted] = useState(false);
  const [cat, setCat] = useState<string | null>(null);
  const [open, setOpen] = useState<Item | null>(null);
  const [cart, setCart] = useState<Line[]>([]);
  const [done, setDone] = useState<number | null>(null);
  const [busy, setBusy] = useState(false);
  const idle = useRef<ReturnType<typeof setTimeout> | null>(null);
  const t = (fr: string, en: string) => (lang === 'en' ? en : fr);

  useEffect(() => {
    const url = new URL(window.location.href);
    const fromUrl = url.searchParams.get('key');
    try { if (fromUrl) { localStorage.setItem(KEY, fromUrl); url.searchParams.delete('key'); window.history.replaceState(null, '', url.toString()); } } catch { /* private mode */ }
    let k: string | null = fromUrl;
    try { k = k ?? localStorage.getItem(KEY); } catch { /* ignore */ }
    setKey(k);
  }, []);

  const load = useCallback(async () => {
    if (!key) return;
    const res = await fetch('/api/kiosk/menu', { headers: { authorization: `Bearer ${key}` } }).catch(() => null);
    const j = res ? await res.json().catch(() => ({})) : {};
    if (!res?.ok) { setErr(j.error ?? 'Menu indisponible / Menu unavailable'); return; }
    setMenu(j.menu); setSettings(j.settings); setErr('');
    setCat((c) => c ?? j.menu.categories[0]?.id ?? null);
  }, [key]);
  useEffect(() => { void load(); const id = setInterval(load, 5 * 60_000); return () => clearInterval(id); }, [load]);

  const reset = useCallback(() => { setStarted(false); setCart([]); setOpen(null); setDone(null); setLang('fr'); }, []);
  const touch = useCallback(() => {
    if (idle.current) clearTimeout(idle.current);
    idle.current = setTimeout(reset, (settings.idleSeconds || 90) * 1000);
  }, [reset, settings.idleSeconds]);
  useEffect(() => { window.addEventListener('pointerdown', touch); return () => window.removeEventListener('pointerdown', touch); }, [touch]);

  const lineCents = useCallback((l: Line) => {
    const it = menu?.items[l.itemId];
    if (!it) return 0;
    const mods = it.groups.flatMap((g) => g.modifiers).filter((m) => l.modifierIds.includes(m.id)).reduce((s, m) => s + m.priceCents, 0);
    return (it.priceCents + mods) * l.quantity;
  }, [menu]);
  const totals = useMemo(() => {
    let sub = 0; let tax = 0;
    for (const l of cart) { const c = lineCents(l); sub += c; tax += Math.round((c * (menu?.items[l.itemId]?.taxPct ?? 0)) / 100); }
    return { sub, tax, total: sub + tax };
  }, [cart, lineCents, menu]);

  async function send() {
    if (!key || !cart.length) return;
    setBusy(true); setErr('');
    const res = await fetch('/api/kiosk/orders', { method: 'POST', headers: { 'content-type': 'application/json', authorization: `Bearer ${key}` }, body: JSON.stringify({ lines: cart }) }).catch(() => null);
    const j = res ? await res.json().catch(() => ({})) : {};
    setBusy(false);
    if (!res?.ok) { setErr(j.error ?? t('Commande non envoyée. Demandez au comptoir.', 'Order not sent. Please ask at the counter.')); return; }
    setDone(j.number); setCart([]);
    setTimeout(reset, 20_000);
  }

  if (!key) return <main style={{ padding: 32 }}><h1>T4CTILE</h1><p>{t('Borne non jumelée : ouvrez l’adresse de jumelage du tableau de bord (…/kiosk?key=dk_…).', 'Kiosk not paired: open the pairing address from the dashboard (…/kiosk?key=dk_…).')}</p></main>;
  if (err && !menu) return <main style={{ padding: 32 }}><h1>T4CTILE</h1><p className="banner banner-stop">{err}</p><button onClick={load}>{t('Réessayer', 'Try again')}</button></main>;
  if (!menu) return <main style={{ padding: 32 }}><p>…</p></main>;

  if (done !== null) return (
    <div className="kiosk-full" onClick={reset}>
      <p style={{ fontSize: 28 }}>{t('Merci ! Votre numéro :', 'Thank you! Your number:')}</p>
      <p style={{ fontSize: 120, fontWeight: 900, margin: 0, color: 'var(--cyan)' }}>{done}</p>
      <p style={{ fontSize: 24 }}>{t('Payez au comptoir. Nous vous appelons quand c’est prêt.', 'Pay at the counter. We will call you when it is ready.')}</p>
    </div>
  );

  if (!started) return (
    <div className="kiosk-full" onClick={() => setStarted(true)}>
      <p style={{ fontSize: 56, fontWeight: 900 }}>{lang === 'en' ? settings.welcomeEn : settings.welcomeFr}</p>
      <div className="row" style={{ justifyContent: 'center' }}>
        <button style={{ minHeight: 72, fontSize: 24 }} onClick={(e) => { e.stopPropagation(); setLang('fr'); setStarted(true); }}>Français</button>
        <button style={{ minHeight: 72, fontSize: 24 }} onClick={(e) => { e.stopPropagation(); setLang('en'); setStarted(true); }}>English</button>
      </div>
    </div>
  );

  const items = (menu.categories.find((c) => c.id === cat)?.itemIds ?? []).map((id) => menu.items[id]).filter(Boolean);
  return (
    <div className="kiosk">
      <nav className="kiosk-cats">{menu.categories.map((c) => <button key={c.id} className={c.id === cat ? '' : 'ghost'} onClick={() => setCat(c.id)}>{c.name}</button>)}</nav>
      <section className="kiosk-items">
        {items.map((it) => (
          <button key={it.id} className="kiosk-item ghost" onClick={() => (it.groups.length ? setOpen(it) : setCart((c) => [...c, { itemId: it.id, quantity: 1, modifierIds: [] }]))}>
            {it.photo && <img src={it.photo} alt="" loading="lazy" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />}
            <span style={{ fontSize: 20, fontWeight: 800 }}>{it.name}</span><span>{$(it.priceCents, lang)}</span>
          </button>
        ))}
      </section>
      <aside className="kiosk-cart">
        <h2>{t('Votre commande', 'Your order')}</h2>
        {cart.map((l, i) => (
          <div key={i} className="row" style={{ justifyContent: 'space-between' }}>
            <span>{l.quantity} × {menu.items[l.itemId]?.name}</span>
            <span>{$(lineCents(l), lang)} <button className="ghost" aria-label={t('Retirer', 'Remove')} onClick={() => setCart((c) => c.filter((_, j) => j !== i))}>✕</button></span>
          </div>
        ))}
        <p className="muted">{t('Taxes (estimées)', 'Taxes (estimate)')} {$(totals.tax, lang)}</p>
        <p style={{ fontSize: 24, fontWeight: 900 }}>{t('Total', 'Total')} {$(totals.total, lang)}</p>
        {err && <p className="banner banner-stop">{err}</p>}
        <button style={{ width: '100%', minHeight: 64, fontSize: 22 }} disabled={!cart.length || busy} onClick={send}>{busy ? '…' : t('Commander', 'Order')}</button>
        <button className="ghost" style={{ width: '100%', marginTop: 8 }} onClick={reset}>{t('Annuler', 'Cancel')}</button>
      </aside>
      {open && <Options item={open} lang={lang} onClose={() => setOpen(null)} onAdd={(ids) => { setCart((c) => [...c, { itemId: open.id, quantity: 1, modifierIds: ids }]); setOpen(null); }} />}
    </div>
  );
}

function Options({ item, lang, onClose, onAdd }: { item: Item; lang: 'fr' | 'en'; onClose: () => void; onAdd: (ids: string[]) => void }) {
  const [chosen, setChosen] = useState<string[]>([]);
  const t = (fr: string, en: string) => (lang === 'en' ? en : fr);
  const missing = item.groups.find((g) => item.groups && g.modifiers.filter((m) => chosen.includes(m.id)).length < g.min);
  function toggle(g: Group, m: Mod) {
    setChosen((cur) => {
      if (cur.includes(m.id)) return cur.filter((x) => x !== m.id);
      const inGroup = cur.filter((x) => g.modifiers.some((y) => y.id === x));
      if (g.max === 1) return [...cur.filter((x) => !inGroup.includes(x)), m.id];
      if (g.max !== null && inGroup.length >= g.max) return cur;
      return [...cur, m.id];
    });
  }
  return (
    <div className="kiosk-modal" role="dialog" aria-modal="true">
      <div className="card" style={{ maxWidth: 720, width: '100%', maxHeight: '90vh', overflow: 'auto' }}>
        <h2 style={{ fontSize: 28 }}>{item.name}</h2>
        {item.groups.map((g) => (
          <div key={g.id}>
            <h3>{g.name} <span className="muted" style={{ fontSize: 14 }}>{g.min > 0 ? t(`(obligatoire${g.max ? `, max ${g.max}` : ''})`, `(required${g.max ? `, max ${g.max}` : ''})`) : g.max ? `(max ${g.max})` : ''}</span></h3>
            <div className="row">{g.modifiers.map((m) => (
              <button key={m.id} className={chosen.includes(m.id) ? '' : 'ghost'} style={{ minHeight: 56 }} onClick={() => toggle(g, m)}>{m.name}{m.priceCents ? ` +${$(m.priceCents, lang)}` : ''}</button>
            ))}</div>
          </div>
        ))}
        <div className="row" style={{ marginTop: 16 }}>
          <button style={{ minHeight: 64, fontSize: 20 }} disabled={!!missing} onClick={() => onAdd(chosen)}>{missing ? t(`Choisissez : ${missing.name}`, `Choose: ${missing.name}`) : t('Ajouter', 'Add')}</button>
          <button className="ghost" style={{ minHeight: 64 }} onClick={onClose}>{t('Retour', 'Back')}</button>
        </div>
      </div>
    </div>
  );
}
