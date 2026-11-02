const participants = [
    "Matteo", "Bibbi", "Marco", "Loretta", "Stefano", "Marina", 
    "Francesco", "Roberta", "Pilu", "Alessandro", "Bianca", "Elena", 
    "Massimo", "Manuela", "Andrea", "Laura"
];

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

function renderHistory() {
    const container = document.getElementById('history-container');
    const years = Object.keys(history).sort((a,b) => b - a);

    years.forEach(year => {
        let html = `<h3>Natale ${year}</h3><table><thead><tr><th>Chi fa il regalo</th><th>A chi lo fa</th></tr></thead><tbody>`;
        
        // Ordine alfabetico per lo storico
        const sortedHistory = Object.entries(history[year]).sort((a, b) => a[0].localeCompare(b[0]));
        
        for (const [giver, receiver] of sortedHistory) {
            html += `<tr><td>${giver}</td><td>${receiver}</td></tr>`;
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
            
            // Ordine alfabetico per i nuovi risultati
            const sortedResult = Object.entries(result).sort((a, b) => a[0].localeCompare(b[0]));
            
            for (const [giver, receiver] of sortedResult) {
                tbody.innerHTML += `<tr><td>${giver}</td><td>${receiver}</td></tr>`;
            }
            document.getElementById('results-2026').classList.remove('hidden');
            drawBtn.innerText = "Rifai Estrazione (Debug)";
            drawBtn.disabled = false;
        } else {
            alert("Impossibile trovare una combinazione valida con questi vincoli!");
            drawBtn.innerText = "Genera Estrazione 2026";
            drawBtn.disabled = false;
        }
    }, 500);
});

renderHistory();
