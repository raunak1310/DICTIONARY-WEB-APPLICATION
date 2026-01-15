const input = document.getElementById("wordInput");
const searchBtn = document.getElementById("searchBtn");
const resultBox = document.getElementById("resultBox");

searchBtn.addEventListener("click", () => {
  let word = input.value.trim();
  if (word === "") {
    resultBox.innerHTML = `<p class="error">⚠ Please enter a word!</p>`;
    return;
  }
  fetchWord(word);
});

async function fetchWord(word) {
  resultBox.innerHTML = `<p class="hint">⏳ Loading...</p>`;

  try {
    const response = await fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
    );

    if (!response.ok) {
      resultBox.innerHTML = `<p class="error">❌ Word not found. Try another!</p>`;
      return;
    }

    const data = await response.json();
    const wordData = data[0];

    const meaning = wordData.meanings[0].definitions[0].definition;
    const example =
      wordData.meanings[0].definitions[0].example || "No example available.";
    const phonetic = wordData.phonetic || "No phonetic found.";

    // Find audio pronunciation
    let audioUrl = "";
    if (wordData.phonetics.length > 0) {
      for (let item of wordData.phonetics) {
        if (item.audio) {
          audioUrl = item.audio;
          break;
        }
      }
    }

    resultBox.innerHTML = `
      <div class="word-title">
        <h2>${wordData.word}</h2>
        ${
          audioUrl
            ? `<button class="audio-btn" onclick="playAudio('${audioUrl}')">🔊 Audio</button>`
            : ""
        }
      </div>

      <p class="phonetic">Phonetic: ${phonetic}</p>

      <p class="meaning"><b>Meaning:</b> ${meaning}</p>

      <p class="example"><b>Example:</b> ${example}</p>
    `;
  } catch (error) {
    resultBox.innerHTML = `<p class="error">⚠ Error! Check your internet connection.</p>`;
  }
}

function playAudio(url) {
  const audio = new Audio(url);
  audio.play();
}
