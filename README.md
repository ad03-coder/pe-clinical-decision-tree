# 🫁 PE Clinical Decision Tree  
### Clinical Decision Support Tool for Suspected Acute Pulmonary Embolism  
*(Based on 2026 AHA/ACC Clinical Practice Guidelines)*

---

## 📌 Overview

**PE Clinical Decision Tree** è una webapp interattiva sviluppata in **HTML + JavaScript**, progettata per supportare il clinico nella valutazione diagnostica iniziale di pazienti con sospetta **embolia polmonare acuta (PE)**.

L’app implementa in maniera strutturata l’algoritmo riportato nelle **AHA/ACC Guidelines 2026 – Clinical Evaluation of Patients With Suspected Acute PE**, trasformando il workflow decisionale in un percorso guidato step-by-step.

La logica integra:

- valutazione clinica iniziale (History & Physical Examination)
- stratificazione della probabilità pre-test
- score validati:
  - **Wells Score**
  - **Revised Geneva Score**
  - **Simplified Revised Geneva Score**
- criteri **PERC**
- algoritmo **YEARS**
- interpretazione del **D-Dimero**
- soglie **age-adjusted**
- indicazioni alla diagnostica per immagini
- parametri ecocardiografici di disfunzione ventricolare destra (RV)

L’obiettivo del progetto è fornire uno strumento rapido, chiaro e riproducibile per:

- standardizzare il processo diagnostico
- ridurre esami inutili
- migliorare l’aderenza alle linee guida
- supportare il decision-making clinico in PS, medicina d’urgenza e area critica

---

# 🧠 Clinical Logic

La struttura decisionale implementa fedelmente la:

> **Figure 1 – Clinical Evaluation of Patients With Suspected Acute PE**  
> *(AHA/ACC 2026)*

Tutti gli algoritmi, i criteri clinici e le soglie decisionali riprodotti in questa applicazione derivano dal documento PDF originale delle linee guida AHA/ACC 2026 disponibile nel repository.

---

## 🔹 Step 1 — Clinical Assessment

Ogni paziente con sospetta PE viene inizialmente sottoposto a:

- anamnesi mirata
- esame obiettivo completo
- valutazione dei fattori di rischio
- esclusione di diagnosi alternative

Secondo le linee guida:

> “Perform history and physical examination to assess pretest probability of acute PE.”  
> *(Class I Recommendation)*

---

## 🔹 Step 2 — Clinical Probability Scores

Il tool consente di scegliere tra tre score validati:

### ✅ Wells Score

Include:

- segni di TVP
- tachicardia
- immobilizzazione/chirurgia recente
- emottisi
- neoplasia
- PE come diagnosi più probabile

Classificazione:

- Low probability
- Intermediate probability
- High probability

Supporta anche la versione:

- **Modified Wells (PE likely / unlikely)**

---

### ✅ Revised Geneva Score

Score completamente oggettivo basato su:

- età
- frequenza cardiaca
- storia di TVP/PE
- chirurgia recente
- dolore unilaterale
- emottisi
- neoplasia

---

### ✅ Simplified Geneva Score

Versione semplificata del Revised Geneva:

- ogni criterio = 1 punto
- interpretazione immediata

---

## 🔹 Step 3 — PERC Rule

Se la probabilità clinica pre-test è **bassa (<15%)**, il tool applica automaticamente i criteri:

### PERC (Pulmonary Embolism Rule-Out Criteria)

Se tutti i criteri sono negativi:

> “No further testing is required.”

Questo consente di evitare:

- D-Dimero
- imaging non necessario
- overtesting

---

## 🔹 Step 4 — YEARS Algorithm + D-Dimer

Nei pazienti:

- PERC positivi
- probabilità intermedia

viene applicato l’algoritmo **YEARS**.

### YEARS items:

- segni clinici di TVP
- emottisi
- PE diagnosi più probabile

### Soglie D-Dimero implementate

| YEARS | Cutoff D-Dimero |
|---|---|
| 0 criteri | < 1000 ng/mL |
| ≥1 criterio | < 500 ng/mL |

Supportata anche la strategia:

### Age-Adjusted D-Dimer

- età < 50 → cutoff 500 µg/L
- età ≥ 50 → età × 10 µg/L

---

## 🔹 Step 5 — Diagnostic Imaging

Nei pazienti con:

- alta probabilità clinica
- D-Dimero positivo
- YEARS positivo

il tool raccomanda:

### Imaging di prima linea

- **CTPA (Computed Tomography Pulmonary Angiography)**

### Alternative

- V/Q scan ± SPECT
- ecocardiografia (valutazione RV)

---

## 🔹 Right Ventricular Dysfunction Assessment

Il tool include anche la tabella ecocardiografica derivata dalle linee guida:

| Parametro | Definizione |
|---|---|
| RV dilation | RV basal diameter > 42 mm |
| RV/LV ratio | > 0.9 |
| TAPSE | < 1.6 cm |
| Pulmonary acceleration time | < 90 ms |
| Tricuspid systolic velocity | > 2.6 m/s |

---

# 🏗️ Project Structure

```bash
/PE-CLINICAL-DECISION-TREE
│
├── index.html
│   # Main UI and application rendering
│
├── decision_tree.js
│   # Clinical decision tree logic
│   # Scores, branching, algorithms and navigation
│
├── AHA_2026_PE_Guidelines.pdf
│   # Guideline document used as clinical reference
│
└── README.md
```

---

# ⚙️ Architecture

La logica del progetto è basata su una struttura JavaScript object-driven.

Ogni nodo del decision tree possiede:

```js
{
  id,
  type,
  title,
  body,
  next,
  interpretation,
  recommendations
}
```

Tipologie di nodo supportate:

| Type | Descrizione |
|---|---|
| `info` | Step informativo |
| `question` | Domanda binaria/multipla |
| `score` | Calcolo score clinico |
| `result` | Outcome finale |

Questo approccio rende il sistema:

- modulare
- facilmente estendibile
- facilmente aggiornabile con nuove linee guida
- framework-agnostic

---

# 🚀 Live Demo

## 🔗 Web App

https://ad03-coder.github.io/PE-CLINICAL-DECISION-TREE/

---

# 💻 How to Use

1. Apri la webapp
2. Avvia la valutazione clinica
3. Seleziona lo score desiderato
4. Inserisci i criteri clinici richiesti
5. Segui il percorso guidato
6. Ottieni:
   - probabilità clinica
   - raccomandazione diagnostica
   - eventuale necessità di imaging

---

# 📚 Clinical References

### Primary Source

- **AHA/ACC 2026 – Adults With Acute Pulmonary Embolism**

### Algorithms Included

- Wells Score
- Revised Geneva Score
- Simplified Revised Geneva Score
- PERC Rule
- YEARS Algorithm
- Age-Adjusted D-Dimer Strategy

Tutti i contenuti clinici implementati nel progetto sono stati riprodotti e adattati a partire dal documento PDF originale disponibile nel repository.

---

# 🧪 Intended Use

Questo progetto è pensato per:

- formazione medica
- supporto decisionale clinico
- simulazione di workflow diagnostici
- emergency medicine
- internal medicine
- critical care
- medical education

---

# ⚠️ Disclaimer

Questo software:

- NON sostituisce il giudizio clinico
- NON è un dispositivo medico certificato
- NON fornisce diagnosi automatiche
- deve essere utilizzato esclusivamente come supporto decisionale ed educativo

Le decisioni cliniche finali rimangono responsabilità del medico curante.

Le logiche implementate riflettono le evidenze e le linee guida disponibili al 2026.

---

# 👨‍⚕️ Author

**AD – UMG**

Clinical Decision Support / Emergency Medicine Projects

---

# 📄 License

Free to use, modify and distribute for educational and non-commercial purposes.


