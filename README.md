# PE Decision Tool – AHA 2026 + ESC 2019

Strumento di supporto decisionale clinico per la valutazione di pazienti con **sospetta Embolia Polmonare Acuta**, basato su due set di linee guida selezionabili dall'utente:
- **AHA 2026** (*Adults With Acute Pulmonary Embolism*) — Wells/Geneva/Geneva Semplificato, PERC, D-Dimero+YEARS, scelta CTPA con controindicazioni
- **ESC 2019** (*European Society of Cardiology Guidelines for the diagnosis and management of acute pulmonary embolism*) — triage instabilità emodinamica (Tabella 4), Geneva Score originale ESC (Tabella 5), D-Dimero, algoritmi Figura 4/5

> **⚠ Disclaimer** — Questo tool è esclusivamente a supporto del ragionamento clinico. Non sostituisce la valutazione del medico né costituisce indicazione terapeutica.

---

## Struttura dei file

```
pe-decision-tool/
├── index.html          # Interfaccia utente (HTML + CSS + JS logica di rendering)
├── decision_tree.js    # Albero decisionale (dati, punteggi, rami) ← modificare qui
└── README.md           # Questa documentazione
```

> **Regola principale**: per modificare la logica clinica o i criteri diagnostici, intervenire **solo su `decision_tree.js`**. L'interfaccia si adatta automaticamente.
>
> Il file `decision_tree.js` contiene **entrambi i rami** (AHA 2026 e ESC 2019) in un unico albero — la scelta tra i due avviene a runtime nel nodo `choose_guideline`. Sono moduli indipendenti: modificare un ramo non impatta l'altro.

---

## Come eseguire

Aprire `index.html` in qualsiasi browser moderno — nessun server, nessuna dipendenza esterna da installare.

Compatibile con:
- **Desktop**: Chrome, Firefox, Safari, Edge
- **Tablet / Mobile**: iOS Safari, Android Chrome
- Qualsiasi dispositivo con schermo ≥ 320px

---

## Flusso decisionale implementato

L'app permette di scegliere tra due percorsi linee-guida fin dalla seconda schermata (`choose_guideline`).

### Ramo AHA 2026

```
Sintomi sospetti PE
        │
        ▼
    Esegui H&P  [COR 1]
        │
        ▼
  Scegli score clinico
   ┌────┼────┐
Wells  Geneva  Geneva Sempl.
        │
        ▼
  ┌─────────────────────┐
  │   Probabilità?      │
  └─────────────────────┘
   <15% (Bassa)  15-50% (Interm.)  >50% (Alta)
      │                │                │
      ▼                │                ▼
   PERC           D-Dimero +    → Imaging diretto
  Tutti OK?       YEARS [COR 2a]
   │    │               │
  Sì   No         ┌─────┴─────┐
   │    │      Esclusa     Imaging
   ▼    │
PE       └──→ D-Dimero+YEARS
esclusa
        │
        ▼
  ┌─────────────────────┐
  │ Scelta modalità     │
  │ imaging – CTPA?     │
  └─────────────────────┘
  ✔ "Nessuna controindicazione presente" → CTPA (raccomandata)
  ✔ CI assoluta selezionata               → Eco multiorgano
  ✔ CI relativa selezionata               → Scintigrafia V/Q / SPECT
  (le due tipologie di selezione sono mutuamente esclusive)
```

### Ramo ESC 2019

```
Sintomi sospetti PE
        │
        ▼
  Instabilità emodinamica?  [Tabella 4]
  (arresto cardiaco / shock ostruttivo / ipotensione persistente)
        │
   ┌────┴────┐
  Sì         No
   │          │
   ▼          ▼
 ┌─────────────────────┐    Geneva Score ESC [Tabella 5]
 │ FIGURA 4 — Instabile│           │
 └─────────────────────┘     ┌─────┴──────┐
   TTE bedside              Bassa/Interm.   Alta/PE-likely
        │                  (o PE-unlikely)       │
   Disfunzione RV?               │                ▼
   ┌────┴────┐                   ▼         Scelta Modalità Imaging
  No         Sì              D-Dimero      (controindicazioni CTPA)
   │          │              < soglia?              │
   ▼          ▼              ┌───┴───┐        ┌──────┼──────┐
 Altre   Scelta Modalità    Sì       No     CTPA    V/Q    Eco
 cause   Imaging (contro-    │        │      │       │      │
         indicazioni CTPA)   ▼        ▼      ▼       ▼      ▼
        ┌──────┼──────┐   PE esclusa  Scelta  Esito  Esito  Esito
       CTPA   V/Q    Eco              Modalità (PE+/  (PE+/  (PE+/
        │      │      │               Imaging  PE-/   PE-/   non
        ▼      ▼      ▼               (come a  discr.) indet.) diagn.)
      Esito  Esito  Esito             sinistra)
     (PE+/  (PE+/  (PE+/
     PE-)   non    non
            diagn.) diagn.)
```

> Le due schermate "Scelta Modalità Imaging" (una per il D-Dimero positivo, una per l'alta probabilità) usano la stessa interfaccia a controindicazioni assolute/relative del nodo AHA `ctpa_check` e del nodo ESC instabile `esc_ctpa_feasible` — vedi sezione dedicata più avanti.

---

## Tipi di nodi (`decision_tree.js`)

| Tipo         | Descrizione                                                  |
|--------------|--------------------------------------------------------------|
| `"info"`     | Schermata informativa con testo e bottone Continua           |
| `"question"` | Scelta multipla senza calcolo (es. selezione dello score, scelta linee guida) |
| `"score"`    | Checklist con punteggio + interpretazione a range            |
| `"result"`   | Esito intermedio — mostra testo e naviga al nodo `next`      |
| `"ctpa_check"` | Selezione controindicazioni CTPA + alternative raccomandate |

---

## Scores implementati

### Wells Score
| Criterio | Punti |
|---|---|
| Sintomi clinici di TVP | 3 |
| PE più probabile di diagnosi alternativa | 3 |
| FC > 100 bpm | 1.5 |
| Immobilizzazione ≥3gg o chirurgia nelle ultime 4 settimane | 1.5 |
| TVP o PE precedente | 1.5 |
| Emottisi | 1 |
| Tumore maligno attivo | 1 |

Interpretazione **Standard**: Bassa <2 · Intermedia 2–6 · Alta >6  
Interpretazione **Modified** (dicotomica): PE improbabile ≤4 · PE probabile >4

### Revised Geneva Score
| Criterio | Punti |
|---|---|
| Età > 65 anni | 1 |
| TVP o PE precedente | 3 |
| Chirurgia in AG o frattura arto inf. nell'ultimo mese | 2 |
| Tumore maligno attivo | 2 |
| Dolore unilaterale arto inferiore | 3 |
| Emottisi | 2 |
| FC 75–94 bpm | 3 |
| FC ≥ 95 bpm | 5 |
| Dolore palpazione circolo venoso profondo + edema unilaterale | 4 |

Interpretazione: Bassa 0–3 · Intermedia 4–10 · Alta ≥11

### Simplified Revised Geneva Score
Stessi criteri del Geneva, 1 punto ciascuno.  
Interpretazione: Bassa/Improbabile 0–1 · Intermedia 2–4 · Alta/Probabile 5–7

### PERC – PE Rule Out Criteria
Applicabile **solo** se probabilità pre-test < 15%.  
8 criteri; se punteggio = 0 (nessun criterio presente) → PE esclusa senza ulteriori test.

| Criterio |
|---|
| Età ≥ 50 anni |
| FC ≥ 100 bpm |
| SatO₂ < 95% in aria ambiente |
| Emottisi |
| Uso di estrogeni |
| TVP o PE precedente |
| Gonfiore unilaterale alla gamba |
| Chirurgia/trauma con ospedalizzazione nelle ultime 4 settimane |

### D-Dimero + Criteri YEARS [COR 2a]
3 criteri YEARS (TVP, emottisi, PE diagnosi più probabile).  
Soglia D-Dimero determinata dal numero di criteri:

| YEARS | D-Dimero | Esito |
|---|---|---|
| 0 | < 1000 ng/mL | PE esclusa |
| ≥1 | < 500 ng/mL (o soglia age-adj.) | PE esclusa |
| 0 | ≥ 1000 ng/mL | → Imaging |
| ≥1 | ≥ 500 ng/mL (o soglia age-adj.) | → Imaging |

**D-Dimero age-adjusted**: età < 50 anni → 500 µg/L; età ≥ 50 anni → età × 10 µg/L

---

## Score e criteri ESC 2019 

### Instabilità Emodinamica —  ESC (ref. Tabella 4)
Definisce la PE ad alto rischio. **Basta UNA** delle tre condizioni:

| Condizione | Criterio |
|---|---|
| Arresto cardiaco | Necessità di rianimazione cardiopolmonare |
| Shock ostruttivo | PA sistolica < 90 mmHg (o vasopressori per PA ≥ 90 mmHg) **+** ipoperfusione d'organo |
| Ipotensione persistente | PA sistolica < 90 mmHg o calo ≥ 40 mmHg per > 15 min, non da aritmia/ipovolemia/sepsi |

Se presente almeno una condizione → ramo "instabile" (Figura 4 ESC, vedi sopra).  
Se nessuna condizione → ramo "stabile", si procede con il Geneva Score ESC.

### Revised Geneva Score — ESC (versione originale, ref. Tabella 5)
Diversa dalla versione AHA: punteggi e soglie differenti.

| Criterio | Punti |
|---|---|
| TVP o PE precedente | 3 |
| FC 75–94 bpm | 3 |
| FC ≥ 95 bpm | 5 |
| Chirurgia o frattura nel mese precedente | 2 |
| Emottisi | 2 |
| Tumore maligno attivo | 2 |
| Dolore unilaterale arto inferiore | 3 |
| Dolore palpazione venosa profonda + edema unilaterale | 4 |
| Età > 65 anni | 1 |

Due possibili interpretazioni, selezionabili nell'interfaccia tramite tab:
- **Schema a 3 livelli**: Bassa 0–3 · Intermedia 4–10 · Alta ≥11
- **Schema a 2 livelli**: PE improbabile 0–5 · PE probabile ≥6

### D-Dimero — ESC (ref. Figura 5)
Per probabilità bassa/intermedia (o PE-unlikely): soglia fissa standard 500 ng/mL (con possibilità di applicare soglia age-adjusted). Se negativo → PE esclusa; se positivo → si procede alla **scelta della modalità di imaging**.  
Per probabilità alta (o PE-likely): il D-Dimero **non è indicato** (basso valore predittivo negativo in questa fascia) → si procede direttamente alla **scelta della modalità di imaging**.

### Scelta della Modalità di Imaging — dopo D-Dimero positivo o probabilità alta
In entrambi i casi (D-Dimero positivo con probabilità bassa/intermedia, oppure probabilità alta/PE-likely che salta il D-Dimero), prima di eseguire l'imaging viene mostrata la stessa schermata di **controindicazioni CTPA** usata nel ramo AHA e nel ramo ESC instabile (`esc_ctpa_low_intermediate` e `esc_ctpa_no_dimer`, entrambi di tipo `ctpa_check`):

| Controindicazione selezionata | Modalità alternativa proposta |
|---|---|
| Nessuna | CTPA |
| Relativa (gravidanza, insufficienza renale) o allergia al mdc | Scintigrafia V/Q planare o SPECT |
| Assoluta (TC non disponibile, shock grave) | Ecografia Multiorgano |

A seconda della modalità scelta, l'esito viene raccolto da una schermata dedicata:

| Modalità eseguita | Esiti possibili |
|---|---|
| CTPA | PE confermata → trattamento; CTPA normale → PE esclusa (o discrepanza se probabilità era alta) |
| Scintigrafia V/Q | Alta probabilità → PE confermata; Normale → PE esclusa (o discrepanza se probabilità era alta); Non diagnostica → imaging non diagnostico |
| Ecografia Multiorgano | Segni compatibili con PE → PE confermata; Nessun segno → imaging non diagnostico |

**Imaging non diagnostico**: quando V/Q o ecografia non danno un risultato conclusivo, l'app segnala la necessità di ulteriori accertamenti (ripetizione del test, CTPA quando la controindicazione lo consenta, V/Q SPECT, CUS) senza forzare una conclusione diagnostica.

### Esito CTPA / Scintigrafia / Ecografia — quadro riassuntivo ESC (ref. Figura 5)
| Scenario | Esito |
|---|---|
| Probabilità bassa/interm. + D-Dimero positivo + imaging negativo | PE esclusa, nessun trattamento |
| Probabilità bassa/interm. + D-Dimero positivo + imaging positivo | PE confermata, trattamento indicato |
| Probabilità alta + imaging negativo | Discrepanza clinico-radiologica: considerare ulteriori test |
| Probabilità alta + imaging positivo | PE confermata, trattamento indicato |
| Qualsiasi scenario + imaging non diagnostico (solo V/Q o ecografia) | Necessari ulteriori accertamenti |

### Algoritmo Instabilità Emodinamica — ESC (ref. Figura 4)
Percorso parallelo per il paziente instabile (`esc_bedside_tte` → `esc_treatment_indicated`):

1. **TTE bedside** — primo step rapido per cercare disfunzione del ventricolo destro (RV)
2. **RV normale** → PE praticamente esclusa come causa dell'instabilità → ricerca altre cause di shock
3. **RV disfunzionante** → verificare se CTPA è fattibile tramite lo stesso schermo di **controindicazioni assolute/relative** usato nel ramo AHA (nodo `esc_ctpa_feasible`, vedi sezione successiva):
   - **Nessuna controindicazione** → eseguire CTPA: positiva → trattamento PE alto rischio; negativa → ricerca altre cause
   - **Controindicazione assoluta** (TC non disponibile, shock troppo grave per il trasferimento) → i reperti ecocardiografici già rilevati confermano la PE ad alto rischio → trattamento di riperfusione emergente senza attendere la CTPA
   - **Controindicazione relativa** (gravidanza, insufficienza renale) o allergia al mdc → si segnalano scintigrafia planare/SPECT come opzioni teoriche, ma nella pratica di un paziente instabile i tempi sono raramente compatibili → si procede comunque al trattamento bedside in base ai reperti ecocardiografici già disponibili

---

## Scelta della modalità di imaging 

L'app usa **quattro istanze** dello stesso tipo di nodo `ctpa_check`, con interfaccia identica (checkbox controindicazioni assolute/relative + opzione "nessuna controindicazione" + alternative consigliate):

| Nodo | Contesto | Comportamento delle alternative |
|---|---|---|
| `ctpa_check` (ramo AHA) | Probabilità clinica intermedia/alta, D-Dimero positivo | Le card alternative sono informative; non c'è prosecuzione del percorso (fine valutazione) |
| `esc_ctpa_feasible` (ramo ESC, paziente instabile) | RV disfunzionante alla TTE bedside | Le card alternative sono **cliccabili** e navigano verso l'esito appropriato (CTPA di conferma oppure trattamento bedside immediato) |
| `esc_ctpa_low_intermediate` (ramo ESC, paziente stabile) | Probabilità bassa/intermedia con D-Dimero positivo | Le card alternative sono **cliccabili** e navigano verso una schermata di esito dedicata alla modalità scelta (CTPA / V/Q / Ecografia) |
| `esc_ctpa_no_dimer` (ramo ESC, paziente stabile) | Probabilità clinica alta / PE-likely | Stesso comportamento di `esc_ctpa_low_intermediate`, con schermate di esito specifiche per il contesto "alta probabilità" |

Gli ID delle checkbox sono namespaced per ciascun nodo (`ci_abs1`, `ci_abs1_esc`, `ci_abs1_esc_li`, `ci_abs1_esc_nd`, ecc.) per evitare conflitti di stato, pur condividendo lo stesso codice di rendering (`buildCtpaHtml`, `toggleCi`, `toggleNoneCi` in `index.html`).

Lo schermo presenta tre gruppi di checkbox, **mutuamente esclusivi tra loro**:
1. Controindicazioni assolute
2. Controindicazioni relative
3. **"Nessuna delle controindicazioni sopra è presente"** — checkbox dedicata che, se selezionata, deseleziona automaticamente tutte le altre e conferma CTPA come esito raccomandato. Selezionare una qualsiasi controindicazione, viceversa, deseleziona questa opzione.

### CTPA – Prima scelta [COR 1]
Ampia disponibilità, eccellente performance diagnostica, bassa dose radiante rispetto alle tecniche storiche. Mostrata come card "Consigliata" quando viene confermata l'assenza di controindicazioni.

### Controindicazioni Assolute → **Ecografia Multiorgano**
| ID | Controindicazione |
|---|---|
| `ci_abs1` | Indisponibilità della TC |
| `ci_abs2` | Shock emodinamico grave (paziente non trasferibile) |
| `ci_abs3` | Allergia grave/documentata al mezzo di contrasto iodato |

**Ecografia Multiorgano** (point-of-care integrata):
- **Ecocardiografia**: dilatazione/disfunzione RV, segno D setto, TAPSE, ipertensione polmonare
- **Ecografia polmonare**: consolidamenti subpleurici, versamento pleurico
- **Eco-Doppler venoso**: TVP prossimale agli arti inferiori

#### Parametri ecocardiografici disfunzione RV (Tabella 4 AHA)
| Parametro | Tecnica | Soglia |
|---|---|---|
| Dimensione RV | Apical 4-chamber (EDD) | EDD > 30 mm o RV basal EDD > 42 mm |
| Rapporto RV/LV | End-diastolic ratio apicale/subcostale | > 0.9 |
| TAPSE | M-mode, piano longitudinale | < 1.6 cm = anormale |
| Doppler IP. Acceleration | Tissue Doppler Imaging | Tempo acc. < 90 ms o gradiente RV/atr. > 30 mmHg |
| Velocità sistolica tricuspide | Apical/subcostal 4-chamber | > 2.6 m/sec |

### Controindicazioni Relative → **Scintigrafia V/Q planare o SPECT**
| ID | Controindicazione |
|---|---|
| `ci_rel1` | Gravidanza |
| `ci_rel2` | Insufficienza renale (rischio nefropatia da contrasto) |

- **V/Q planare**: bassa dose fetale (gravidanza), no contrasto iodato
- **V/Q SPECT (± CT low-dose)**: prima scelta quando disponibile — maggiore sensibilità/specificità, minore tasso di indeterminato

---

### Metadati
```js
const TREE_METADATA = {
  version:     "3.2",      
  lastUpdated: "2026-06-24",  
  ...
};
```

---

*Fonte: AHA 2026 – Adults With Acute Pulmonary Embolism · © 2026 American Heart Association, Inc. and American College of Cardiology Foundation*  

