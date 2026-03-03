import React, { useState } from "react";

const SCREENS = {
  HOME: "home",
  REQUEST: "request",
  CONNECTORS: "connectors",
  PROFILE: "profile",
  CONFIRMATION: "confirmation",
};

const connectors = [
  {
    id: 1,
    name: "Sophia Chen",
    role: "Partner @ Sequoia",
    domain: "Venture / SaaS",
    score: 97,
    intros: 34,
    avatar: "SC",
    color: "#C8A97E",
  },
  {
    id: 2,
    name: "Marcus Leblanc",
    role: "VP Sales @ Salesforce",
    domain: "Enterprise / BD",
    score: 91,
    intros: 28,
    avatar: "ML",
    color: "#8AAFC8",
  },
  {
    id: 3,
    name: "Anika Patel",
    role: "CTO @ Stripe",
    domain: "Fintech / Eng",
    score: 95,
    intros: 19,
    avatar: "AP",
    color: "#A8C89A",
  },
];

const recentRequests = [
  { id: 1, target: "Daniel Park", via: "Sophia Chen", status: "pending", time: "2h ago" },
  { id: 2, target: "Lena Müller", via: "Marcus Leblanc", status: "accepted", time: "1d ago" },
  { id: 3, target: "James Osei", via: "Anika Patel", status: "delivered", time: "3d ago" },
];

const statusColors = {
  pending: "#C8A97E",
  accepted: "#A8C89A",
  delivered: "#8AAFC8",
};

const statusLabels = {
  pending: "En attente",
  accepted: "Accepté",
  delivered: "Livré",
};

export default function RelayApp() {
  const [screen, setScreen] = useState(SCREENS.HOME);
  const [activeTab, setActiveTab] = useState("home");
  const [selectedConnector, setSelectedConnector] = useState(null);
  const [form, setForm] = useState({ target: "", context: "", reason: "" });

  const navigate = (sc, tab) => {
    setScreen(sc);
    if (tab) setActiveTab(tab);
  };

  return (
    <div style={styles.shell}>
      <div style={styles.phone}>
        <div style={styles.statusBar}>
          <span style={styles.time}>9:41</span>
          <div style={styles.notch} />
          <div style={styles.statusIcons}>
            <span style={styles.statusDot} />
            <span style={styles.statusDot} />
            <span style={styles.statusDot} />
          </div>
        </div>

        <div style={styles.screen}>
          {screen === SCREENS.HOME && (
            <HomeScreen
              onRequest={() => navigate(SCREENS.REQUEST, "request")}
              onConnector={(c) => { setSelectedConnector(c); navigate(SCREENS.PROFILE); }}
            />
          )}
          {screen === SCREENS.REQUEST && (
            <RequestScreen
              form={form}
              setForm={setForm}
              connectors={connectors}
              onSubmit={() => navigate(SCREENS.CONFIRMATION)}
            />
          )}
          {screen === SCREENS.CONNECTORS && (
            <ConnectorsScreen
              connectors={connectors}
              onSelect={(c) => { setSelectedConnector(c); navigate(SCREENS.PROFILE); }}
            />
          )}
          {screen === SCREENS.PROFILE && selectedConnector && (
            <ProfileScreen
              connector={selectedConnector}
              onBack={() => navigate(SCREENS.HOME, "home")}
              onRequest={() => navigate(SCREENS.REQUEST, "request")}
            />
          )}
          {screen === SCREENS.CONFIRMATION && (
            <ConfirmationScreen onDone={() => navigate(SCREENS.HOME, "home")} />
          )}
        </div>

        <div style={styles.navbar}>
          {[
            { id: "home", label: "Accueil", icon: "⌂" },
            { id: "request", label: "Demande", icon: "⇢" },
            { id: "connectors", label: "Relais", icon: "◈" },
          ].map((tab) => (
            <button
              key={tab.id}
              style={{
                ...styles.navBtn,
                color: activeTab === tab.id ? "#C8A97E" : "#555",
              }}
              onClick={() => {
                setActiveTab(tab.id);
                if (tab.id === "home") navigate(SCREENS.HOME);
                if (tab.id === "request") navigate(SCREENS.REQUEST);
                if (tab.id === "connectors") navigate(SCREENS.CONNECTORS);
              }}
            >
              <span style={styles.navIcon}>{tab.icon}</span>
              <span style={styles.navLabel}>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function HomeScreen({ onRequest, onConnector }) {
  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div>
          <p style={styles.greeting}>Bonjour, Alex</p>
          <h1 style={styles.heroTitle}>Relay</h1>
        </div>
        <div style={styles.avatarSm}>A</div>
      </div>

      <div style={styles.heroBanner}>
        <p style={styles.heroSub}>Accès de confiance</p>
        <p style={styles.heroDesc}>Transformez les introductions informelles en connexions structurées.</p>
        <button style={styles.primaryBtn} onClick={onRequest}>
          Nouvelle demande →
        </button>
      </div>

      <div style={styles.section}>
        <div style={styles.sectionHeader}>
          <span style={styles.sectionTitle}>Demandes récentes</span>
          <span style={styles.seeAll}>Voir tout</span>
        </div>
        {recentRequests.map((r) => (
          <div key={r.id} style={styles.requestCard}>
            <div style={styles.requestInfo}>
              <p style={styles.requestTarget}>{r.target}</p>
              <p style={styles.requestVia}>via {r.via}</p>
            </div>
            <div style={{ textAlign: "right" }}>
              <span style={{ ...styles.badge, background: statusColors[r.status] + "22", color: statusColors[r.status] }}>
                {statusLabels[r.status]}
              </span>
              <p style={styles.requestTime}>{r.time}</p>
            </div>
          </div>
        ))}
      </div>

      <div style={styles.section}>
        <div style={styles.sectionHeader}>
          <span style={styles.sectionTitle}>Relais suggérés</span>
        </div>
        <div style={styles.connectorRow}>
          {connectors.slice(0, 2).map((c) => (
            <button key={c.id} style={styles.connectorChip} onClick={() => onConnector(c)}>
              <div style={{ ...styles.chipAvatar, background: c.color + "33", color: c.color }}>{c.avatar}</div>
              <p style={styles.chipName}>{c.name.split(" ")[0]}</p>
              <p style={styles.chipScore}>{c.score}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function RequestScreen({ form, setForm, connectors, onSubmit }) {
  const [step, setStep] = useState(1);

  return (
    <div style={styles.page}>
      <div style={styles.pageHeader}>
        <h2 style={styles.pageTitle}>Nouvelle demande</h2>
        <div style={styles.stepDots}>
          {[1, 2, 3].map((s) => (
            <div key={s} style={{ ...styles.dot, background: step >= s ? "#C8A97E" : "#333" }} />
          ))}
        </div>
      </div>

      {step === 1 && (
        <div style={styles.formStep}>
          <p style={styles.stepLabel}>Qui souhaitez-vous contacter ?</p>
          <input
            style={styles.input}
            placeholder="Nom, titre ou entreprise"
            value={form.target}
            onChange={(e) => setForm({ ...form, target: e.target.value })}
          />
          <p style={styles.stepLabel}>Pourquoi cette introduction ?</p>
          <textarea
            style={{ ...styles.input, height: 80, resize: "none" }}
            placeholder="Décrivez votre objectif..."
            value={form.reason}
            onChange={(e) => setForm({ ...form, reason: e.target.value })}
          />
          <button style={styles.primaryBtn} onClick={() => setStep(2)}>Continuer →</button>
        </div>
      )}

      {step === 2 && (
        <div style={styles.formStep}>
          <p style={styles.stepLabel}>Choisir un relais</p>
          {connectors.map((c) => (
            <button
              key={c.id}
              style={{ ...styles.connectorSelectCard, border: form.connector === c.id ? `1px solid ${c.color}` : "1px solid #222" }}
              onClick={() => setForm({ ...form, connector: c.id })}
            >
              <div style={{ ...styles.chipAvatar, background: c.color + "22", color: c.color, marginRight: 12 }}>{c.avatar}</div>
              <div style={{ flex: 1 }}>
                <p style={styles.connName}>{c.name}</p>
                <p style={styles.connRole}>{c.role}</p>
              </div>
              <div style={{ textAlign: "right" }}>
                <p style={{ ...styles.scoreVal, color: c.color }}>{c.score}</p>
                <p style={styles.scoreLabel}>score</p>
              </div>
            </button>
          ))}
          <button style={styles.primaryBtn} onClick={() => setStep(3)}>Continuer →</button>
        </div>
      )}

      {step === 3 && (
        <div style={styles.formStep}>
          <p style={styles.stepLabel}>Contexte additionnel</p>
          <textarea
            style={{ ...styles.input, height: 100, resize: "none" }}
            placeholder="Informations que le relais devrait savoir..."
            value={form.context}
            onChange={(e) => setForm({ ...form, context: e.target.value })}
          />
          <div style={styles.reviewCard}>
            <p style={styles.reviewLabel}>Récapitulatif</p>
            <p style={styles.reviewItem}>🎯 {form.target || "—"}</p>
            <p style={styles.reviewItem}>⇢ {form.connector ? connectors.find(c => c.id === form.connector)?.name : "—"}</p>
          </div>
          <button style={styles.primaryBtn} onClick={onSubmit}>Envoyer la demande</button>
        </div>
      )}
    </div>
  );
}

function ConnectorsScreen({ connectors, onSelect }) {
  return (
    <div style={styles.page}>
      <div style={styles.pageHeader}>
        <h2 style={styles.pageTitle}>Relais</h2>
      </div>
      <p style={styles.subtitle}>Nœuds de confiance dans votre écosystème</p>
      {connectors.map((c) => (
        <button key={c.id} style={styles.connectorFullCard} onClick={() => onSelect(c)}>
          <div style={{ ...styles.avatarMd, background: c.color + "22", color: c.color }}>{c.avatar}</div>
          <div style={{ flex: 1, marginLeft: 14 }}>
            <p style={styles.connName}>{c.name}</p>
            <p style={styles.connRole}>{c.role}</p>
            <p style={styles.connDomain}>{c.domain}</p>
          </div>
          <div style={styles.scoreBlock}>
            <p style={{ ...styles.scoreVal, color: c.color }}>{c.score}</p>
            <p style={styles.scoreLabel}>Crédibilité</p>
            <p style={{ ...styles.scoreVal, fontSize: 13, color: "#888" }}>{c.intros}</p>
            <p style={styles.scoreLabel}>Intros</p>
          </div>
        </button>
      ))}
    </div>
  );
}

function ProfileScreen({ connector, onBack, onRequest }) {
  return (
    <div style={styles.page}>
      <button style={styles.backBtn} onClick={onBack}>← Retour</button>
      <div style={styles.profileHero}>
        <div style={{ ...styles.avatarLg, background: connector.color + "22", color: connector.color }}>
          {connector.avatar}
        </div>
        <h2 style={styles.profileName}>{connector.name}</h2>
        <p style={styles.profileRole}>{connector.role}</p>
        <p style={styles.profileDomain}>{connector.domain}</p>
      </div>

      <div style={styles.statsRow}>
        {[
          { label: "Score Relay", value: connector.score, color: connector.color },
          { label: "Introductions", value: connector.intros, color: "#888" },
          { label: "Taux accept.", value: "92%", color: "#A8C89A" },
        ].map((s) => (
          <div key={s.label} style={styles.statCard}>
            <p style={{ ...styles.statVal, color: s.color }}>{s.value}</p>
            <p style={styles.statLabel}>{s.label}</p>
          </div>
        ))}
      </div>

      <div style={styles.infoCard}>
        <p style={styles.infoTitle}>Domaines d'accès</p>
        <p style={styles.infoText}>Venture Capital · SaaS B2B · Early-stage · Series A/B · Product-led growth</p>
      </div>

      <button style={styles.primaryBtn} onClick={onRequest}>
        Demander une introduction via {connector.name.split(" ")[0]}
      </button>
    </div>
  );
}

function ConfirmationScreen({ onDone }) {
  return (
    <div style={{ ...styles.page, alignItems: "center", justifyContent: "center", display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={styles.confirmIcon}>⇢</div>
      <h2 style={styles.confirmTitle}>Demande envoyée</h2>
      <p style={styles.confirmText}>Votre demande a été transmise au relais. Vous serez notifié dès qu'une décision est prise.</p>
      <div style={styles.confirmBadge}>Consentement · Traçabilité · Confiance</div>
      <button style={{ ...styles.primaryBtn, marginTop: 32 }} onClick={onDone}>Retour à l'accueil</button>
    </div>
  );
}

const styles = {
  shell: {
    minHeight: "100vh",
    background: "#0A0A0A",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "'Georgia', 'Times New Roman', serif",
  },
  phone: {
    width: 375,
    height: 812,
    background: "#0E0E0E",
    borderRadius: 44,
    border: "1px solid #222",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    boxShadow: "0 40px 120px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.05)",
    position: "relative",
  },
  statusBar: {
    height: 44,
    padding: "0 24px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexShrink: 0,
  },
  time: { color: "#fff", fontSize: 14, fontWeight: "bold", fontFamily: "monospace" },
  notch: { width: 120, height: 20, background: "#0E0E0E", borderRadius: 10, border: "1px solid #222" },
  statusIcons: { display: "flex", gap: 4, alignItems: "center" },
  statusDot: { width: 6, height: 6, borderRadius: "50%", background: "#444" },
  screen: { flex: 1, overflowY: "auto", overflowX: "hidden" },
  navbar: {
    height: 80,
    background: "#111",
    borderTop: "1px solid #1E1E1E",
    display: "flex",
    flexShrink: 0,
  },
  navBtn: {
    flex: 1,
    background: "none",
    border: "none",
    cursor: "pointer",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    transition: "color 0.2s",
  },
  navIcon: { fontSize: 20 },
  navLabel: { fontSize: 10, letterSpacing: "0.05em" },
  page: { padding: "20px 20px 20px", minHeight: "100%" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 },
  greeting: { color: "#555", fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 4, fontFamily: "sans-serif" },
  heroTitle: { color: "#fff", fontSize: 36, letterSpacing: "-0.02em", margin: 0 },
  avatarSm: {
    width: 36, height: 36, borderRadius: "50%",
    background: "#C8A97E22", color: "#C8A97E",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: 14, fontWeight: "bold", fontFamily: "sans-serif",
  },
  heroBanner: {
    background: "linear-gradient(135deg, #1A1510 0%, #161616 100%)",
    border: "1px solid #2A2015",
    borderRadius: 16,
    padding: 20,
    marginBottom: 28,
  },
  heroSub: { color: "#C8A97E", fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 8, fontFamily: "sans-serif" },
  heroDesc: { color: "#888", fontSize: 13, lineHeight: 1.6, marginBottom: 16, fontFamily: "sans-serif" },
  primaryBtn: {
    background: "#C8A97E",
    color: "#0A0A0A",
    border: "none",
    borderRadius: 10,
    padding: "12px 20px",
    fontSize: 13,
    fontWeight: "bold",
    cursor: "pointer",
    fontFamily: "sans-serif",
    letterSpacing: "0.02em",
    width: "100%",
  },
  section: { marginBottom: 24 },
  sectionHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  sectionTitle: { color: "#fff", fontSize: 14, letterSpacing: "-0.01em" },
  seeAll: { color: "#555", fontSize: 11, fontFamily: "sans-serif" },
  requestCard: {
    background: "#141414",
    border: "1px solid #1E1E1E",
    borderRadius: 12,
    padding: "12px 14px",
    marginBottom: 8,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  requestInfo: {},
  requestTarget: { color: "#fff", fontSize: 13, marginBottom: 2, fontFamily: "sans-serif" },
  requestVia: { color: "#555", fontSize: 11, fontFamily: "sans-serif" },
  badge: { fontSize: 10, padding: "3px 8px", borderRadius: 20, fontFamily: "sans-serif", letterSpacing: "0.05em" },
  requestTime: { color: "#444", fontSize: 10, marginTop: 4, fontFamily: "sans-serif" },
  connectorRow: { display: "flex", gap: 10 },
  connectorChip: {
    flex: 1,
    background: "#141414",
    border: "1px solid #1E1E1E",
    borderRadius: 12,
    padding: "12px 8px",
    cursor: "pointer",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 6,
  },
  chipAvatar: {
    width: 36, height: 36, borderRadius: "50%",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: 12, fontWeight: "bold", fontFamily: "sans-serif",
  },
  chipName: { color: "#ccc", fontSize: 11, fontFamily: "sans-serif" },
  chipScore: { color: "#555", fontSize: 11, fontFamily: "sans-serif" },
  pageHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
  pageTitle: { color: "#fff", fontSize: 24, letterSpacing: "-0.02em", margin: 0 },
  stepDots: { display: "flex", gap: 6 },
  dot: { width: 8, height: 8, borderRadius: "50%" },
  formStep: { display: "flex", flexDirection: "column", gap: 12 },
  stepLabel: { color: "#888", fontSize: 12, letterSpacing: "0.05em", fontFamily: "sans-serif", textTransform: "uppercase" },
  input: {
    background: "#141414",
    border: "1px solid #222",
    borderRadius: 10,
    padding: "12px 14px",
    color: "#fff",
    fontSize: 14,
    fontFamily: "sans-serif",
    outline: "none",
    width: "100%",
    boxSizing: "border-box",
  },
  connectorSelectCard: {
    background: "#141414",
    borderRadius: 12,
    padding: "14px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    width: "100%",
    marginBottom: 8,
  },
  connName: { color: "#fff", fontSize: 13, marginBottom: 2, fontFamily: "sans-serif", textAlign: "left" },
  connRole: { color: "#666", fontSize: 11, fontFamily: "sans-serif", textAlign: "left" },
  connDomain: { color: "#444", fontSize: 10, fontFamily: "sans-serif", textAlign: "left", marginTop: 2 },
  scoreVal: { fontSize: 18, fontWeight: "bold", fontFamily: "monospace" },
  scoreLabel: { color: "#444", fontSize: 9, fontFamily: "sans-serif", letterSpacing: "0.05em", textTransform: "uppercase" },
  reviewCard: {
    background: "#141414",
    border: "1px solid #222",
    borderRadius: 12,
    padding: 16,
  },
  reviewLabel: { color: "#555", fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: "sans-serif", marginBottom: 10 },
  reviewItem: { color: "#ccc", fontSize: 13, fontFamily: "sans-serif", marginBottom: 6 },
  subtitle: { color: "#555", fontSize: 12, fontFamily: "sans-serif", marginBottom: 16 },
  connectorFullCard: {
    background: "#141414",
    border: "1px solid #1E1E1E",
    borderRadius: 14,
    padding: 16,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    width: "100%",
    marginBottom: 10,
    textAlign: "left",
  },
  avatarMd: {
    width: 44, height: 44, borderRadius: "50%",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: 15, fontWeight: "bold", fontFamily: "sans-serif",
    flexShrink: 0,
  },
  scoreBlock: { textAlign: "right" },
  backBtn: {
    background: "none",
    border: "none",
    color: "#C8A97E",
    cursor: "pointer",
    fontFamily: "sans-serif",
    fontSize: 13,
    padding: 0,
    marginBottom: 20,
  },
  profileHero: { display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 28 },
  avatarLg: {
    width: 72, height: 72, borderRadius: "50%",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: 24, fontWeight: "bold", fontFamily: "sans-serif",
    marginBottom: 14,
  },
  profileName: { color: "#fff", fontSize: 22, letterSpacing: "-0.02em", margin: "0 0 4px" },
  profileRole: { color: "#888", fontSize: 13, fontFamily: "sans-serif", marginBottom: 4 },
  profileDomain: { color: "#555", fontSize: 11, fontFamily: "sans-serif" },
  statsRow: { display: "flex", gap: 8, marginBottom: 20 },
  statCard: {
    flex: 1,
    background: "#141414",
    border: "1px solid #1E1E1E",
    borderRadius: 12,
    padding: "12px 8px",
    textAlign: "center",
  },
  statVal: { fontSize: 20, fontWeight: "bold", fontFamily: "monospace", marginBottom: 4 },
  statLabel: { color: "#555", fontSize: 9, fontFamily: "sans-serif", letterSpacing: "0.05em", textTransform: "uppercase" },
  infoCard: {
    background: "#141414",
    border: "1px solid #1E1E1E",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  infoTitle: { color: "#888", fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: "sans-serif", marginBottom: 8 },
  infoText: { color: "#ccc", fontSize: 13, fontFamily: "sans-serif", lineHeight: 1.6 },
  confirmIcon: {
    fontSize: 56,
    color: "#C8A97E",
    marginBottom: 20,
    width: 80, height: 80,
    background: "#C8A97E11",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  confirmTitle: { color: "#fff", fontSize: 24, letterSpacing: "-0.02em", marginBottom: 12 },
  confirmText: { color: "#666", fontSize: 13, fontFamily: "sans-serif", lineHeight: 1.7, textAlign: "center", maxWidth: 260, marginBottom: 20 },
  confirmBadge: {
    background: "#141414",
    border: "1px solid #222",
    borderRadius: 20,
    padding: "6px 16px",
    color: "#555",
    fontSize: 10,
    fontFamily: "sans-serif",
    letterSpacing: "0.08em",
  },
};
