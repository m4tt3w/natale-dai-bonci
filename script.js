const participants = [
    "Matteo", "Bibbi", "Marco", "Loretta", "Stefano", "Marina", 
    "Francesco", "Roberta", "Pilu", "Alessandro", "Bianca", "Elena", 
    "Massimo", "Manuela", "Andrea", "Laura"
];

// Date di nascita nel formato YYYY-MM-DD
const birthdates = {
    "Matteo": "1988-05-20",
    "Bibbi": "1989-11-20",
    "Marco": "1953-09-02",
    "Loretta": "1954-08-01", 
    "Stefano": "1957-06-23", 
    "Marina": "1957-05-17",
    "Francesco": "1987-03-20", 
    "Roberta": "1990-08-07", 
    "Pilu": "1993-07-07", 
    "Alessandro": "1984-11-09",
    "Bianca": "", 
    "Elena": "2000-07-04", 
    "Massimo": "1961-08-26", 
    "Manuela": "1962-08-24", 
    "Andrea": "1993-05-05", 
    "Laura": "1998-05-23"
};

const exclusionGroups = [
    ["Matteo", "Bibbi"],
    ["Marco", "Loretta"],
    ["Stefano", "Marina"],
    ["Francesco", "Roberta"],
    ["Pilu", "Alessandro"],
    ["Bianca", "Elena"],
    ["Massimo", "Manuela", "Andrea", "Elena"]
];

const history = {
    2025: {"Matteo": "Andrea", "Francesco": "Bianca", "Bianca": "Massimo", "Massimo": "Bibbi", "Laura": "Matteo", "Bibbi": "Roberta", "Pilu": "Laura", "Roberta": "Loretta", "Elena": "Marco", "Marina": "Alessandro", "Marco": "Manuela", "Loretta": "Pilu", "Manuela": "Marina", "Alessandro": "Stefano", "Stefano": "Elena", "Andrea": "Francesco"},
    2024: {"Loretta": "Alessandro", "Francesco": "Manuela", "Bibbi": "Pilu", "Bianca": "Andrea", "Massimo": "Stefano", "Marina": "Elena", "Andrea": "Marco", "Roberta": "Massimo", "Stefano": "Matteo", "Laura": "Francesco", "Marco": "Laura", "Pilu": "Roberta", "Matteo": "Marina", "Alessandro": "Bianca", "Manuela": "Loretta", "Elena": "Bibbi"},
    2023: {"Manuela": "Bibbi", "Stefano": "Laura", "Massimo": "Elena", "Marco": "Francesco", "Roberta": "Matteo", "Alessandro": "Marina", "Bianca": "Pilu", "Loretta": "Andrea", "Pilu": "Manuela", "Andrea": "Stefano", "Matteo": "Massimo", "Marina": "Marco", "Laura": "Roberta", "Francesco": "Loretta", "Elena": "Alessandro", "Bibbi": "Bianca"},
    2022: {"Marina": "Elena", "Stefano": "Manuela", "Massimo": "Francesco", "Loretta": "Bianca", "Matteo": "Loretta", "Andrea": "Matteo", "Bibbi": "Pilu", "Roberta": "Andrea", "Francesco": "Marco", "Laura": "Alessandro", "Manuela": "Roberta", "Marco": "Massimo", "Pilu": "Stefano", "Alessandro": "Bibbi", "Bianca": "Marina", "Elena": "Laura"}
};

let currentUser = "";

// Inizializza la select del login
const userSelect = document.getElementById('user-select');
participants.sort().forEach(p => {
    userSelect.innerHTML += `<option value="${p}">${p}</option>`;
});

// Gestione Login
document.getElementById('login-btn').addEventListener('click', () => {
    const selectedUser = userSelect.value;
    const inputDate = document.getElementById('birthdate-input').value;
    const errorMsg = document.getElementById('login-error');

    if (!selectedUser) {
        errorMsg.innerText = "Seleziona un nome!";
        errorMsg.classList.remove('hidden');
        return;
    }

    if (birthdates[selectedUser] === "") {
        alert("La data di nascita per " + selectedUser + " non è ancora stata inserita nel sistema.");
        return;
    }

    if (inputDate === birthdates[selectedUser]) {
        currentUser = selectedUser;
        document.getElementById('login-section').classList.add('hidden');
        document.getElementById('app-section').classList.remove('hidden');
        
        renderPersonalRecap();
        renderHistory(); 
    } else {
        errorMsg.innerText = "Data di nascita errata. Riprova!";
        errorMsg.classList.remove('hidden');
    }
});

function renderPersonalRecap() {
    const tbody = document.querySelector('#recap-table tbody');
    const title = document.getElementById('recap-title');
    tbody.innerHTML = '';
    title.innerText = `🎁 Ciao ${currentUser}, ecco i tuoi regali passati! 🎁`;

    const years = Object.keys(history).sort((a,b) => b - a);

    years.forEach(year => {
        let gaveTo = history[year][currentUser] || "-";
        let receivedFrom = "-";
        
        // Cerca chi ha fatto il regalo all'utente corrente
        for (const [giver, receiver] of Object.entries(history[year])) {
            if (receiver === currentUser) {
                receivedFrom = giver;
                break;
            }
        }
        
        tbody.innerHTML += `<tr>
            <td style="font-weight: bold; color: #ffca28;">${year}</td>
            <td>${gaveTo}</td>
            <td>${receivedFrom}</td>
        </tr>`;
    });
    
    document.getElementById('personal-recap').classList.remove('hidden');
}


function renderHistory() {
    const container = document.getElementById('history-container');
    container.innerHTML = ''; 
    const years = Object.keys(history).sort((a,b) => b - a);

    years.forEach(year => {
        let html = `<h3>Natale ${year}</h3><table><thead><tr><th>Chi fa il regalo</th><th>A chi lo fa</th></tr></thead><tbody>`;
        
        const sortedHistory = Object.entries(history[year]).sort((a, b) => a[0].localeCompare(b[0]));
        
        for (const [giver, receiver] of sortedHistory) {
            const highlightClass = (giver === currentUser || receiver === currentUser) ? 'class="highlight-row"' : '';
            html += `<tr ${highlightClass}><td>${giver}</td><td>${receiver}</td></tr>`;
        }
        html += `</tbody></table>`;
        container.innerHTML += html;
    });
}

function canGive(giver, receiver) {
    if (giver === receiver) return false;

    for (let group of exclusionGroups) {
        if (group.includes(giver) && group.includes(receiver)) {
            return false;
        }
    }

    for (let year in history) {
        if (history[year][giver] === receiver) {
            return false;
        }
    }

    return true;
}

function generateDraw() {
    let result = {};
    let receiversList = [...participants];

    function backtrack(index) {
        if (index === participants.length) return true;

        let giver = participants[index];
        let candidates = [...receiversList].sort(() => Math.random() - 0.5);

        for (let receiver of candidates) {
            if (canGive(giver, receiver) && !Object.values(result).includes(receiver)) {
                result[giver] = receiver;
                
                if (backtrack(index + 1)) {
                    return true;
                }
                delete result[giver];
            }
        }
        return false;
    }

    if (backtrack(0)) {
        return result;
    } else {
        return null;
    }
}

document.getElementById('draw-btn').addEventListener('click', () => {
    const drawBtn = document.getElementById('draw-btn');
    drawBtn.innerText = "Estrazione in corso...";
    drawBtn.disabled = true;

    setTimeout(() => {
        const result = generateDraw();
        
        if (result) {
            const tbody = document.querySelector('#table-2026 tbody');
            tbody.innerHTML = '';
            
            const sortedResult = Object.entries(result).sort((a, b) => a[0].localeCompare(b[0]));
            
            for (const [giver, receiver] of sortedResult) {
                const highlightClass = (giver === currentUser || receiver === currentUser) ? 'class="highlight-row"' : '';
                tbody.innerHTML += `<tr ${highlightClass}><td>${giver}</td><td>${receiver}</td></tr>`;
            }
            document.getElementById('results-2026').classList.remove('hidden');
            drawBtn.innerText = "Rifai Estrazione (Debug)";
            drawBtn.disabled = false;
            
            // Fai scroll automatico verso i risultati
            document.getElementById('results-2026').scrollIntoView({ behavior: 'smooth' });
        } else {
            alert("Impossibile trovare una combinazione valida con questi vincoli!");
            drawBtn.innerText = "Genera Nuova Estrazione 2026";
            drawBtn.disabled = false;
        }
    }, 500);
});
