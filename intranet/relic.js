/*
 * relic.js
 *
 * Logic for the relic puzzle page of the ARG. Provides language switching
 * similar to the index page and handles the binary decode puzzle. When
 * players enter the correct decoded message, a success message is displayed.
 */

const relicTranslations = {
  en: {
    relicTitle: "RELIC TERMINAL",
    tagline: "This is not a game.",
    relicIntro: "You have accessed the relic. Decode the binary message to prove your worth.",
    relicPuzzle: "01001000 01100001 01100011 01101011",
    relicHint: "Hint: convert from binary (ASCII) to text.",
    relicPrompt: "Decoded message:",
    relicWrong: "Incorrect, try again.",
    relicSuccess: "Excellent. The message reveals our motto: HACK. A recruiter will contact you soon.",
    backLink: "Back to Index"
  },
  fr: {
    relicTitle: "TERMINAL RELIQUE",
    tagline: "Ceci n'est pas un jeu.",
    relicIntro: "Vous avez accédé à la relique. Déchiffrez le message binaire pour prouver votre valeur.",
    relicPuzzle: "01001000 01100001 01100011 01101011",
    relicHint: "Indice : convertir du binaire (ASCII) en texte.",
    relicPrompt: "Message décodé :",
    relicWrong: "Incorrect, réessayez.",
    relicSuccess: "Excellent. Le message révèle notre devise : HACK. Un recruteur vous contactera bientôt.",
    backLink: "Retour à l'index"
  },
  lorem: {
    relicTitle: "TERMINALIS RELIQUIA",
    tagline: "Hoc non est ludus.",
    relicIntro: "Reliquiam adisti. Nuntium binarium deconde ut dignitatem tuam probes.",
    relicPuzzle: "01001000 01100001 01100011 01101011",
    relicHint: "Monitum : ex binario (ASCII) ad textum converte.",
    relicPrompt: "Nuntius decodatus:",
    relicWrong: "Falsum est, iterum tenta.",
    relicSuccess: "Optime. Nuntius nostrum motto revelat: HACK. Brevi te contingemus.",
    backLink: "Redi ad indicem"
  }
};

let relicLang = 'fr';

document.addEventListener('DOMContentLoaded', () => {
  // Grab DOM elements
  const el = {};
  el.relicTitle = document.getElementById('relicTitle');
  el.tagline = document.getElementById('tagline');
  el.relicIntro = document.getElementById('relicIntro');
  el.relicPuzzle = document.getElementById('relicPuzzle');
  el.relicHint = document.getElementById('relicHint');
  el.relicPrompt = document.getElementById('relicPrompt');
  el.decodeInput = document.getElementById('decodeInput');
  el.decodeButton = document.getElementById('decodeButton');
  el.relicMessage = document.getElementById('relicMessage');
  el.relicSuccessSection = document.getElementById('relicSuccessSection');
  el.relicSuccess = document.getElementById('relicSuccess');
  el.backLink = document.getElementById('backLink');

  // Set up language switch buttons
  document.querySelectorAll('.language-switcher button').forEach(btn => {
    btn.addEventListener('click', () => {
      const lang = btn.getAttribute('data-lang');
      relicLang = lang;
      updateRelicLanguage();
    });
  });

  // Handle puzzle submission
  el.decodeButton.addEventListener('click', () => {
    checkAnswer(el);
  });
  el.decodeInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      checkAnswer(el);
    }
  });

  // Initialize page content
  updateRelicLanguage();
});

function updateRelicLanguage() {
  const t = relicTranslations[relicLang];
  if (!t) return;
  document.getElementById('relicTitle').textContent = t.relicTitle;
  document.getElementById('tagline').textContent = t.tagline;
  document.getElementById('relicIntro').textContent = t.relicIntro;
  document.getElementById('relicPuzzle').textContent = t.relicPuzzle;
  document.getElementById('relicHint').textContent = t.relicHint;
  document.getElementById('relicPrompt').textContent = t.relicPrompt;
  document.getElementById('backLink').textContent = t.backLink;
  // Clear any messages and hide success section on language change
  document.getElementById('relicMessage').textContent = '';
  document.getElementById('relicSuccessSection').classList.add('hidden');
  document.getElementById('inputSection').classList.remove('hidden');
  document.getElementById('decodeInput').value = '';
}

function checkAnswer(el) {
  const answer = el.decodeInput.value.trim().toLowerCase();
  if (answer === 'hack') {
    // Success
    el.relicSuccess.textContent = relicTranslations[relicLang].relicSuccess;
    el.relicSuccessSection.classList.remove('hidden');
    document.getElementById('inputSection').classList.add('hidden');
    el.relicMessage.textContent = '';
  } else {
    el.relicMessage.textContent = relicTranslations[relicLang].relicWrong;
  }
}