# Regali Natale 2026 - Generatore Secret Santa 🎅🎁

Un'applicazione web statica (HTML, CSS, JS) per generare l'estrazione dei regali di Natale della famiglia, tenendo conto delle regole di esclusione tra coppie/famigliari e dello storico degli ultimi 4 anni.

## 🚀 Come usarlo

1. Estrai il contenuto di questo file `.zip`.
2. Troverai 3 file principali:
   - `index.html` (struttura della pagina)
   - `style.css` (tema natalizio)
   - `script.js` (algoritmo di backtracking e dati)
3. Apri il file `index.html` in un qualsiasi browser web (Chrome, Firefox, Safari) per visualizzare l'app e generare la nuova estrazione.

## ⚙️ Logica dell'Algoritmo

Il file `script.js` utilizza un algoritmo di **backtracking ricorsivo**. 
Questo assicura che venga esplorato l'albero delle combinazioni per trovare un'estrazione valida in cui:
- Nessuno fa il regalo a se stesso.
- Nessuno fa il regalo a un partner o a una persona nel proprio gruppo di esclusione.
- Nessuno fa il regalo a qualcuno a cui l'ha già fatto dal 2022 al 2025.

L'algoritmo mescola dinamicamente i candidati (`Math.random()`) prima di testarli, così ogni click genera una configurazione valida diversa.

## 🌐 Deploy su GitHub Pages

Questo progetto non richiede alcun backend (nè Node.js nè Python), il che lo rende perfetto per essere pubblicato in due click.

1. Crea un nuovo repository su GitHub chiamato `natale-dai-bonci`.
2. Carica i file di questa cartella direttamente nella branch `main`.
3. Vai nei **Settings** del repository su GitHub -> **Pages**.
4. Sotto *Build and deployment*, scegli "Deploy from a branch", seleziona la branch `main` e premi **Save**.
5. In pochi minuti, l'app sarà live e accessibile tramite il link generato da GitHub Pages, perfetto da condividere nel gruppo WhatsApp o Telegram di famiglia!
