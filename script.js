const input = document.getElementById("wordInput");
const resultDiv = document.getElementById("result");

// Search on Enter key
input.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
        searchWord();
    }
});

function searchWord() {
    const word = input.value.trim();

    if (word === "") {
        alert("Please enter a word");
        return;
    }

    resultDiv.innerHTML = "Loading...";

    fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
        .then(response => {
            if (!response.ok) {
                throw new Error("Word not found");
            }
            return response.json();
        })
        .then(data => {
            const entry = data[0];
            const meaning = entry.meanings[0];
            const definition = meaning.definitions[0];

            const phonetic = entry.phonetic || "Not available";
            const example = definition.example || "Example not available";

            let audio = "";
            if (entry.phonetics[0] && entry.phonetics[0].audio) {
                audio = `
                    <audio controls>
                        <source src="${entry.phonetics[0].audio}">
                    </audio>
                `;
            }

            resultDiv.innerHTML = `
                <p><strong>Word:</strong> ${entry.word}</p>
                <p><strong>Part of Speech:</strong> ${meaning.partOfSpeech}</p>
                <p><strong>Meaning:</strong> ${definition.definition}</p>
                <p><strong>Example:</strong> ${example}</p>
                <p><strong>Phonetic:</strong> ${phonetic}</p>
                ${audio}
            `;
        })
        .catch(() => {
            resultDiv.innerHTML =
                `<p class="error">Word not found. Please try another word.</p>`;
        });
}
