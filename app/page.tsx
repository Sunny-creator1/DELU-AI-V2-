html, body {
  margin: 0;
  padding: 0;
  font-family: Arial, Helvetica, sans-serif;
  background: #f5f2ed;
  color: #0b0b0c;
}

* { box-sizing: border-box; }

a { color: inherit; text-decoration: none; }

button, input, select, textarea { font: inherit; }

img { display: block; max-width: 100%; }

.container { width: min(1200px, calc(100% - 32px)); margin: 0 auto; }

.hero { background: linear-gradient(135deg, #0b0b0c 0%, #17171b 35%, #920d2b 100%); color: white; padding: 36px 0 54px; }
.hero-inner { display: grid; grid-template-columns: 1.1fr 0.9fr; gap: 28px; align-items: center; }
.kicker { color: #f0a7b8; letter-spacing: 0.18em; text-transform: uppercase; font-size: 0.72rem; font-weight: 800; }
.hero h1 { margin: 12px 0 16px; font-size: clamp(2.7rem, 5vw, 5rem); letter-spacing: -0.06em; line-height: 0.95; }
.hero p { color: rgba(255,255,255,0.8); max-width: 620px; }
.cta-row { display: flex; gap: 12px; flex-wrap: wrap; margin-top: 24px; }
.btn { display: inline-flex; align-items: center; justify-content: center; background: #c81035; color: white; border: none; border-radius: 999px; padding: 12px 18px; font-weight: 700; cursor: pointer; }
.btn.secondary { background: transparent; border: 1px solid rgba(255,255,255,0.3); }
.hero-visual { min-height: 420px; background: linear-gradient(145deg, rgba(255,255,255,0.18), rgba(255,255,255,0.04)); position: relative; overflow: hidden; border-radius: 24px; }
.hero-visual::before, .hero-visual::after { content: ''; position: absolute; inset: 15% 18% 18% 12%; border: 1px solid rgba(200,16,53,0.7); transform: rotate(-12deg); border-radius: 22px; }
.hero-visual::after { inset: 22% 9% 12% 20%; background: linear-gradient(160deg, #f6f1ed, #dccfc9); }
.section { padding: 64px 0; }
.section-heading { display: flex; align-items: end; justify-content: space-between; gap: 16px; margin-bottom: 24px; }
.section-heading h2 { margin: 8px 0 0; font-size: clamp(2.1rem, 4vw, 3rem); letter-spacing: -0.05em; }
.grid-3 { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 24px; }
.card { background: white; border: 1px solid rgba(11,11,12,0.08); border-radius: 20px; overflow: hidden; box-shadow: 0 14px 32px rgba(11,11,12,0.04); }
.card-image { aspect-ratio: 4 / 5; background: linear-gradient(135deg, #efe8e3, #d8d0cb); display: flex; align-items: center; justify-content: center; text-transform: uppercase; font-size: 0.7rem; letter-spacing: 0.12em; font-weight: 800; color: #0b0b0c; }
.card-body { padding: 20px; }
.card-body h3 { margin: 0 0 8px; }
.card-body p { color: #4e5053; margin: 0; line-height: 1.6; }
.meta-row, .price-row { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-top: 16px; }
.chip { display: inline-flex; padding: 6px 10px; border-radius: 999px; background: rgba(200,16,53,0.08); color: #920d2b; font-size: 0.72rem; font-weight: 800; text-transform: uppercase; }
.price { font-size: 1.1rem; font-weight: 900; }
.page-shell { padding: 56px 0 72px; }
.page-header { margin-bottom: 24px; }
.page-header h1, .page-header h2 { margin: 8px 0 0; letter-spacing: -0.05em; }
.two-col { display: grid; grid-template-columns: 1.15fr 0.85fr; gap: 28px; }
.panel-box { background: white; border: 1px solid rgba(11,11,12,0.07); border-radius: 20px; padding: 24px; box-shadow: 0 12px 26px rgba(11,11,12,0.03); }
.form, .form-grid { display: grid; gap: 14px; }
.field { display: grid; gap: 8px; }
.field label { font-weight: 700; }
.field input, .field textarea, .field select { width: 100%; background: white; border: 1px solid rgba(11,11,12,0.12); border-radius: 12px; padding: 12px 14px; }
.summary-block { background: #0b0b0c; color: #fff; border-radius: 20px; padding: 24px; }
.summary-block .line { display: flex; justify-content: space-between; gap: 10px; padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.08); }
.list { display: grid; gap: 10px; }
.list-item { display: flex; justify-content: space-between; gap: 16px; padding: 12px 0; border-bottom: 1px solid rgba(11,11,12,0.08); }
.table-wrap { overflow-x: auto; }
.table { width: 100%; border-collapse: collapse; }
.table th, .table td { text-align: left; padding: 12px 14px; border-bottom: 1px solid rgba(11,11,12,0.1); }
.topbar { background: #0b0b0c; color: white; border-bottom: 1px solid rgba(200,16,53,0.18); }
.topbar-inner { display: flex; align-items: center; justify-content: space-between; gap: 16px; min-height: 68px; }
.brand { font-weight: 900; letter-spacing: 0.18em; text-transform: uppercase; }
.nav { display: flex; align-items: center; gap: 18px; flex-wrap: wrap; }
.nav a { color: rgba(255,255,255,0.8); }
.nav a:hover { color: white; }
.footer { background: #0b0b0c; color: #f5f2ed; padding: 42px 0 30px; }
.footer-grid { display: grid; grid-template-columns: 1.2fr 1fr 1fr 1fr; gap: 24px; }
.footer h4 { margin: 0 0 12px; color: white; font-size: 0.8rem; letter-spacing: 0.08em; text-transform: uppercase; }
.footer ul { list-style: none; margin: 0; padding: 0; display: grid; gap: 8px; }
.footer a, .footer p { color: rgba(255,255,255,0.72); }
.admin-shell { display: grid; grid-template-columns: 240px 1fr; min-height: calc(100vh - 68px); }
.admin-sidebar { background: #0b0b0c; color: white; padding: 24px 16px; }
.admin-sidebar nav { display: grid; gap: 8px; }
.admin-sidebar a { display: block; padding: 10px 12px; border-radius: 10px; color: rgba(255,255,255,0.76); }
.admin-sidebar a:hover { background: rgba(200,16,53,0.12); color: white; }
.admin-content { padding: 28px; }
.status-pill { display: inline-flex; align-items: center; padding: 6px 10px; border-radius: 999px; background: rgba(106,164,111,0.14); color: #256c3d; font-size: 0.72rem; font-weight: 700; }
.alert { padding: 12px 14px; border-radius: 12px; background: rgba(200,16,53,0.08); color: #920d2b; border: 1px solid rgba(200,16,53,0.15); margin-bottom: 20px; }
.auth-box { max-width: 420px; }
.center { display: flex; justify-content: center; }
.text-link { color: #920d2b; font-weight: 700; }
.notice { color: #4f5054; }
@media (max-width: 900px) {
  .hero-inner, .grid-3, .two-col, .footer-grid, .admin-shell { grid-template-columns: 1fr; }
  .section-heading { flex-direction: column; align-items: flex-start; }
}
