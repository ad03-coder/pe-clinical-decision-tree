/**
 * PE CLINICAL DECISION TREE
 * ─────────────────────────────────────────────────────────────────────────────
 * AHA 2026 Guidelines – Clinical Evaluation of Patients With Suspected Acute PE
 * Source: Volpicelli – UMG
 *
 * ISTRUZIONI PER IL REFINEMENT:
 * Ogni nodo ha un ID univoco e può essere di tipo:
 *   "info"     → schermata informativa / step narrativo
 *   "score"    → calcolo di un punteggio (Wells, Geneva, PERC)
 *   "question" → domanda binaria o multipla
 *   "result"   → esito finale (con severità: "safe" | "warning" | "danger")
 *
 * I campi "next" e "branches" definiscono la navigazione tra i nodi.
 * ─────────────────────────────────────────────────────────────────────────────
 */

const PE_DECISION_TREE = {

  // ══════════════════════════════════════════════════════
  // STEP 0 – ENTRY POINT
  // ══════════════════════════════════════════════════════

  start: {
    id: "start",
    type: "info",
    title: "Valutazione PE Acuta",
    subtitle: "AHA Guidelines 2026",
    body: "Paziente con sintomi sospetti per Embolia Polmonare Acuta.\n\nProcedi con la valutazione clinica seguendo il percorso guidato.",
    icon: "🫁", 
    cor: null,
    next: "symptoms_check",
    hint: "Sintomi tipici: dolore toracico pleuritico, dispnea, emottisi, sincope, shock.\nEsame Obiettivo (EO): \ntachicardia, ipotensione, tachipnea, ipossiemia, gonfiore/dolore gambe (DVT)."
  },


  // ══════════════════════════════════════════════════════
  // STEP 1 – ANAMNESI & ESAME OBIETTIVO
  // ══════════════════════════════════════════════════════
  symptoms_check: {
    id: "symptoms_check",
    type: "info",
    title: "Esegui H&P",
    subtitle: "Anamnesi ed Esame Obiettivo",
    body: "Valuta la probabilità clinica di PE acuta tramite:\n• Anamnesi mirata (fattori di rischio, comorbidità)\n• Esame obiettivo completo\n• Esclusione di diagnosi alternative",
    icon: "🩺",
    cor: "COR 1",
    cor_color: "#22c55e",
    next: "choose_score",
    hint: "COR 1 – Raccomandazione di Classe I: eseguire sempre H&P per valutare la probabilità clinica pre-test."
  },

  // ══════════════════════════════════════════════════════
  // STEP 2 – SCELTA DEL SCORE
  // ══════════════════════════════════════════════════════
  choose_score: {
    id: "choose_score",
    type: "question",
    title: "Quantifica la Probabilità Clinica",
    body: "Seleziona il tool validato che vuoi utilizzare:",
    icon: "📊",
    options: [
      { label: "Wells Score", next: "wells_score", desc: "Score più utilizzato in PS/emergenza" },
      { label: "Revised Geneva Score", next: "geneva_score", desc: "Alternativa validata, senza valutazione soggettiva" },
      { label: "Simplified Geneva Score", next: "geneva_simple_score", desc: "Versione semplificata del Geneva" }
    ]
  },

  // ══════════════════════════════════════════════════════
  // WELLS SCORE
  // ══════════════════════════════════════════════════════
  wells_score: {
    id: "wells_score",
    type: "score",
    title: "Wells Score per PE",
    icon: "📋",
    items: [
      { id: "w1", label: "Sintomi clinici di TVP (gonfiore gamba, dolore alla palpazione)", points: 3 },
      { id: "w2", label: "PE più probabile di diagnosi alternativa", points: 3 },
      { id: "w3", label: "Frequenza cardiaca > 100 bpm", points: 1.5 },
      { id: "w4", label: "Immobilizzazione ≥ 3 gg o chirurgia nelle ultime 4 settimane", points: 1.5 },
      { id: "w5", label: "TVP o PE precedente", points: 1.5 },
      { id: "w6", label: "Emottisi", points: 1 },
      { id: "w7", label: "Tumore maligno attivo", points: 1 }
    ],
    interpretation: [
      { label: "Standard Wells", rules: [
        { range: [0, 1.9], category: "Bassa (<15%)", next: "perc_check" },
        { range: [2, 6], category: "Intermedia (15–50%)", next: "ddimer_years" },
        { range: [6.1, 99], category: "Alta (>50%)", next: "diagnostic_imaging_direct" }
      ]},
      { label: "Modified Wells (dicotomica)", rules: [
        { range: [0, 4], category: "PE improbabile (≤4)", next: "perc_check" },
        { range: [4.1, 99], category: "PE probabile (>4)", next: "diagnostic_imaging_direct" }
      ]}
    ],
    scoreType: "wells"
  },

  // ══════════════════════════════════════════════════════
  // REVISED GENEVA SCORE
  // ══════════════════════════════════════════════════════
  geneva_score: {
    id: "geneva_score",
    type: "score",
    title: "Revised Geneva Score",
    icon: "📋",
    items: [
      { id: "g1", label: "Età > 65 anni", points: 1 },
      { id: "g2", label: "TVP o PE precedente", points: 3 },
      { id: "g3", label: "Chirurgia in anestesia generale o frattura arti inferiori nell'ultimo mese", points: 2 },
      { id: "g4", label: "Tumore maligno attivo", points: 2 },
      { id: "g5", label: "Dolore unilaterale all'arto inferiore", points: 3 },
      { id: "g6", label: "Emottisi", points: 2 },
      { id: "g7", label: "FC 75–94 bpm", points: 3 },
      { id: "g8", label: "FC ≥ 95 bpm", points: 5 },
      { id: "g9", label: "Dolore alla palpazione del circolo venoso profondo e edema unilaterale", points: 4 }
    ],
    interpretation: [
      { label: "Revised Geneva", rules: [
        { range: [0, 3], category: "Bassa (<15%)", next: "perc_check" },
        { range: [4, 10], category: "Intermedia (15–50%)", next: "ddimer_years" },
        { range: [11, 99], category: "Alta (>50%)", next: "diagnostic_imaging_direct" }
      ]}
    ],
    scoreType: "geneva"
  },

  // ══════════════════════════════════════════════════════
  // SIMPLIFIED REVISED GENEVA SCORE
  // ══════════════════════════════════════════════════════
  geneva_simple_score: {
    id: "geneva_simple_score",
    type: "score",
    title: "Simplified Revised Geneva Score",
    icon: "📋",
    items: [
      { id: "sg1", label: "Età > 65 anni", points: 1 },
      { id: "sg2", label: "TVP o PE precedente", points: 1 },
      { id: "sg3", label: "Chirurgia in anestesia generale o frattura arti inferiori nell'ultimo mese", points: 1 },
      { id: "sg4", label: "Tumore maligno attivo", points: 1 },
      { id: "sg5", label: "Dolore unilaterale all'arto inferiore", points: 1 },
      { id: "sg6", label: "Emottisi", points: 1 },
      { id: "sg7", label: "FC 75–94 bpm", points: 1 },
      { id: "sg8", label: "FC ≥ 95 bpm", points: 1 },
      { id: "sg9", label: "Dolore alla palpazione del circolo venoso profondo e edema unilaterale", points: 1 }
    ],
    interpretation: [
      { label: "Simplified Revised Geneva", rules: [
        { range: [0, 1], category: "Bassa/PE improbabile (<15%)", next: "perc_check" },
        { range: [2, 4], category: "Intermedia (15–50%)", next: "ddimer_years" },
        { range: [5, 7], category: "Alta/PE probabile (>50%)", next: "diagnostic_imaging_direct" }
      ]}
    ],
    scoreType: "geneva_simple"
  },

  // ══════════════════════════════════════════════════════
  // PERC (solo per probabilità BASSA)
  // ══════════════════════════════════════════════════════
  perc_check: {
    id: "perc_check",
    type: "score",
    title: "Criteri PERC",
    subtitle: "PE Rule Out Criteria",
    icon: "🔍",
    description: "Applicabile SOLO se probabilità clinica pre-test < 15% (es. Wells < 2).\nSe TUTTI i criteri sono soddisfatti (tutte le risposte sono NO ai fattori di rischio), la probabilità di PE è molto bassa e non sono necessari ulteriori esami.",
    items: [
      { id: "p1", label: "Età ≥ 50 anni", points: 1, negativeLabel: "Età < 50 anni (PERC OK)" },
      { id: "p2", label: "FC ≥ 100 bpm", points: 1, negativeLabel: "FC < 100 bpm (PERC OK)" },
      { id: "p3", label: "SatO₂ < 95% in aria ambiente", points: 1, negativeLabel: "SatO₂ ≥ 95% (PERC OK)" },
      { id: "p4", label: "Emottisi", points: 1, negativeLabel: "Nessuna emottisi (PERC OK)" },
      { id: "p5", label: "Uso di estrogeni", points: 1, negativeLabel: "Nessun uso di estrogeni (PERC OK)" },
      { id: "p6", label: "TVP o PE precedente", points: 1, negativeLabel: "Nessuna TVP/PE prec. (PERC OK)" },
      { id: "p7", label: "Gonfiore unilaterale alla gamba", points: 1, negativeLabel: "Nessun gonfiore (PERC OK)" },
      { id: "p8", label: "Chirurgia/trauma con ospedalizzazione nelle ultime 4 settimane", points: 1, negativeLabel: "Nessuna chirurgia/trauma (PERC OK)" }
    ],
    interpretation: [
      { label: "PERC", rules: [
        { range: [0, 0], category: "PERC NEGATIVO – Tutti i criteri soddisfatti", next: "result_very_low_prob" },
        { range: [1, 99], category: "PERC POSITIVO – Criteri NON soddisfatti", next: "ddimer_years" }
      ]}
    ],
    scoreType: "perc"
  },

  // ══════════════════════════════════════════════════════
  // D-DIMER + CRITERI YEARS (probabilità intermedia o PERC positivo)
  // ══════════════════════════════════════════════════════
  ddimer_years: {
    id: "ddimer_years",
    type: "score",
    title: "D-Dimero + Criteri YEARS",
    icon: "🧪",
    description: "Esegui dosaggio D-Dimero e valuta i criteri YEARS.\n\nI criteri YEARS determinano la soglia di cut-off da applicare.",
    cor: "COR 2a",
    cor_color: "#eab308",
    items: [
      { id: "y1", label: "Segni/sintomi clinici di TVP (trombosi venosa profonda)", points: 1 },
      { id: "y2", label: "Emottisi", points: 1 },
      { id: "y3", label: "PE è la diagnosi più probabile", points: 1 }
    ],
    ddimer_input: true,
    interpretation: [
      { label: "YEARS + D-Dimero", rules: [
        { years: 0, ddimer_op: "<", ddimer_val: 1000, category: "0 criteri YEARS e D-Dimero < 1000 ng/mL", next: "result_pe_excluded" },
        { years: ">=1", ddimer_op: "<", ddimer_val: 500, category: "≥1 criteri YEARS e D-Dimero < 500 ng/mL (o soglia age-adjusted)", next: "result_pe_excluded" },
        { years: 0, ddimer_op: ">=", ddimer_val: 1000, category: "0 criteri YEARS e D-Dimero ≥ 1000 ng/mL", next: "diagnostic_imaging" },
        { years: ">=1", ddimer_op: ">=", ddimer_val: 500, category: "≥1 criteri YEARS e D-Dimero ≥ 500 ng/mL (o soglia age-adjusted)", next: "diagnostic_imaging" }
      ]}
    ],
    scoreType: "years",
    hint_age_adjusted: "D-Dimero age-adjusted: età < 50 anni → soglia 500 µg/L; età ≥ 50 anni → soglia = età × 10 µg/L"
  },

  // ══════════════════════════════════════════════════════
  // DIAGNOSTICA PER IMMAGINI (da D-dimer/YEARS o alta probabilità)
  // ══════════════════════════════════════════════════════
  diagnostic_imaging_direct: {
    id: "diagnostic_imaging_direct",
    type: "result",
    severity: "danger",
    title: "Esegui Diagnostica per Immagini",
    subtitle: "Probabilità Clinica Alta (>50%)",
    icon: "🔬",
    cor: "COR 1",
    cor_color: "#22c55e",
    body: "La probabilità clinica pre-test è ALTA (>50%).\n\nProcedi DIRETTAMENTE con la diagnostica per immagini senza attendere il D-Dimero.",
    recommendations: [
      { text: "CTPA (Angio-TC polmonare)", primary: true, desc: "Prima scelta – ampia disponibilità, eccellente performance diagnostica" },
      { text: "V/Q scan ± SPECT", primary: false, desc: "Alternativa se CTPA controindicata (allergia mdc, insufficienza renale, gravidanza)" },
      { text: "Ecocardiografia", primary: false, desc: "NON per diagnosi di PE – utile per valutare disfunzione RV se PE confermata" }
    ],
    echo_table: true,
    next: null
  },

  diagnostic_imaging: {
    id: "diagnostic_imaging",
    type: "result",
    severity: "warning",
    title: "Esegui Diagnostica per Immagini",
    subtitle: "D-Dimero elevato / YEARS positivo",
    icon: "🔬",
    cor: "COR 1",
    cor_color: "#22c55e",
    body: "I risultati del D-Dimero e/o dei criteri YEARS indicano la necessità di diagnostica per immagini per escludere o confermare la PE.",
    recommendations: [
      { text: "CTPA (Angio-TC polmonare)", primary: true, desc: "Prima scelta – ampia disponibilità, eccellente performance diagnostica" },
      { text: "V/Q scan ± SPECT", primary: false, desc: "Alternativa se CTPA controindicata (allergia mdc, insufficienza renale, gravidanza)" },
      { text: "Ecocardiografia", primary: false, desc: "NON per diagnosi di PE – utile per valutare disfunzione RV se PE confermata" }
    ],
    echo_table: true,
    next: null
  },

  // ══════════════════════════════════════════════════════
  // RISULTATI FINALI
  // ══════════════════════════════════════════════════════
  result_very_low_prob: {
    id: "result_very_low_prob",
    type: "result",
    severity: "safe",
    title: "Probabilità Molto Bassa di PE",
    subtitle: "Nessun ulteriore test necessario",
    icon: "✅",
    body: "Tutti i criteri PERC sono soddisfatti e la probabilità clinica pre-test è < 15%.\n\nLa probabilità di PE è molto bassa. Non sono necessari ulteriori esami diagnostici.",
    note: "Continuare sorveglianza clinica e rivalutare se i sintomi si modificano o peggiorano.",
    next: null
  },

  result_pe_excluded: {
    id: "result_pe_excluded",
    type: "result",
    severity: "safe",
    title: "PE Esclusa",
    subtitle: "D-Dimero e YEARS criteri negativi",
    icon: "✅",
    body: "La combinazione D-Dimero + criteri YEARS esclude la PE con elevata sicurezza.\n\nNon è necessaria ulteriore diagnostica per immagini.",
    note: "Considerare diagnosi alternative. Rivalutare se i sintomi peggiorano.",
    next: null
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// ECHOCARDIOGRAPHY TABLE (Tabella 4 – Disfunzione RV)
// Usata nei nodi di diagnostic imaging quando PE è confermata
// ─────────────────────────────────────────────────────────────────────────────
const ECHO_RV_TABLE = [
  {
    parameter: "Dimensione RV",
    technique: "Apical 4-chamber view (EDD end-diastolico)",
    definition: "EDD > 30 mm oppure RV basal EDD > 42 mm"
  },
  {
    parameter: "Rapporto RV/LV",
    technique: "End-diastolic ratio (apicale o subcostale)",
    definition: "RV/LV > 0.9"
  },
  {
    parameter: "TAPSE",
    technique: "M-mode, piano longitudinale, apical 4-chamber",
    definition: "TAPSE < 1.6 cm = anormale"
  },
  {
    parameter: "Doppler – IPA",
    technique: "Tissue Doppler Imaging",
    definition: "Tempo di accelerazione polmonare < 90 ms oppure gradiente RV/atriale > 30 mmHg"
  },
  {
    parameter: "Velocità sistolica tricuspide",
    technique: "Apical o subcostal 4-chamber",
    definition: "Velocità sistolica > 2.6 m/sec"
  }
];

// ─────────────────────────────────────────────────────────────────────────────
// METADATA
// ─────────────────────────────────────────────────────────────────────────────
const TREE_METADATA = {
  version: "1.0.0",
  source: "AHA 2026 – Adults With Acute Pulmonary Embolism",
  author: " AD – UMG",
  lastUpdated: "2026-01-05",
  disclaimer: "Questo strumento è a supporto decisionale clinico. Non sostituisce il giudizio del medico. Utilizzare sempre in combinazione con la valutazione clinica completa del paziente."
};
