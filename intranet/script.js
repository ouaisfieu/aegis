/*
 * script.js
 *
 * Core logic for the dystopian low‑tech ARG. Handles language switching,
 * interactive console commands, and dynamic content updates. Translations
 * for French, English and Lorem Ipsum are stored in a single object. The
 * language is switched by updating the inner text of DOM elements.
 *
 * The language switching approach is similar to the pattern described by
 * web tutorials: page content is updated dynamically based on the user's
 * selection using a predefined dataset of translations【800647543915747†L107-L126】.
 */

// Translation data for the different languages. Each key corresponds
// to an element's id or logical text that will be updated when the
// language changes.
const translations = {
  en: {
    siteTitle: "ARCANE AFFLICTION // The Low‑Tech Anarcho‑Geek Cult",
    tagline: "This is not a game.",
    introText: "Welcome to the infiltration terminal. Our retro‑gaming sect has one purpose: to subvert the system from within and turn it against itself. Are you ready to join?",
    startButton: "Start infiltration",
    consolePrompt: "Enter command:",
    consoleMessageWrong: "Invalid command! Keep trying.",
    successTitle: "ACCESS GRANTED",
    successClue: "Next clue revealed:",
    relicLink: "Go to relic.html"
  },
  fr: {
    siteTitle: "AFFLICTION ARCANUM // La secte anarcho‑geek low‑tech",
    tagline: "Ceci n'est pas un jeu.",
    introText: "Bienvenue sur le terminal d'infiltration. Notre secte rétro‑gaming n'a qu'un but : subvertir le système de l'intérieur et le retourner contre lui‑même. Êtes‑vous prêt·e à rejoindre la lutte ?",
    startButton: "Commencer l'infiltration",
    consolePrompt: "Entrez la commande :",
    consoleMessageWrong: "Commande invalide ! Continuez à essayer.",
    successTitle: "ACCÈS AUTORISÉ",
    successClue: "Indice suivant :",
    relicLink: "Aller à relic.html"
  },
  lorem: {
    siteTitle: "DOLOR SIT AMET // Cultus low‑tech anarcho‑geek",
    tagline: "Hoc non est ludus.",
    introText: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas secta retrogaming rationem subvertere vult intrinsecus. Paratus es ad coniungendum?",
    startButton: "Infiltrationem inchoare",
    consolePrompt: "Imperium intrare:",
    consoleMessageWrong: "Imperium non valet! Iterum tenta.",
    successTitle: "ACCESSUS DATUS",
    successClue: "Proximum indicium :",
    relicLink: "Transi ad relic.html"
  }
};

// Current language, default to French
let currentLang = 'fr';

// The secret command required to unlock the next clue. Keep this value
// consistent across languages; players are encouraged to view the page
// source to discover it.
const secretCommand = 'hacktheplanet';

// Grab DOM elements once on page load
const elements = {};
document.addEventListener('DOMContentLoaded', () => {
  elements.siteTitle = document.getElementById('siteTitle');
  elements.tagline = document.getElementById('tagline');
  elements.introText = document.getElementById('introText');
  elements.startButton = document.getElementById('startButton');
  elements.consoleSection = document.getElementById('consoleSection');
  elements.consolePrompt = document.getElementById('consolePrompt');
  elements.commandInput = document.getElementById('commandInput');
  elements.commandButton = document.getElementById('commandButton');
  elements.consoleMessage = document.getElementById('consoleMessage');
  elements.successSection = document.getElementById('successSection');
  elements.successTitle = document.getElementById('successTitle');
  elements.successClue = document.getElementById('successClue');
  elements.relicLink = document.getElementById('relicLink');

  // Set up language switch buttons
  document.querySelectorAll('.language-switcher button').forEach(btn => {
    btn.addEventListener('click', () => {
      const lang = btn.getAttribute('data-lang');
      switchLanguage(lang);
    });
  });

  // Start button reveals the console section
  elements.startButton.addEventListener('click', () => {
    elements.introText.classList.add('hidden');
    elements.startButton.classList.add('hidden');
    elements.consoleSection.classList.remove('hidden');
    elements.commandInput.focus();
  });

  // Listen for command submission via button or Enter key
  elements.commandButton.addEventListener('click', handleCommand);
  elements.commandInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleCommand();
    }
  });

  // Initialize the page with default language
  switchLanguage(currentLang);
});

// Function to switch the displayed language
function switchLanguage(lang) {
  currentLang = lang;
  const t = translations[lang];
  if (!t) return;
  elements.siteTitle.textContent = t.siteTitle;
  elements.tagline.textContent = t.tagline;
  elements.introText.textContent = t.introText;
  elements.startButton.textContent = t.startButton;
  elements.consolePrompt.textContent = t.consolePrompt;
  elements.successTitle.textContent = t.successTitle;
  elements.successClue.textContent = t.successClue;
  elements.relicLink.textContent = t.relicLink;
}

// Handle the command entered by the player
function handleCommand() {
  const value = elements.commandInput.value.trim().toLowerCase();
  if (value === secretCommand) {
    // Hide console and show success message
    elements.consoleSection.classList.add('hidden');
    elements.successSection.classList.remove('hidden');
    elements.consoleMessage.textContent = '';
    // Show link to the relic page
    elements.relicLink.classList.remove('hidden');
    // Clear input value
    elements.commandInput.value = '';
  } else {
    // Display error message in chosen language
    elements.consoleMessage.textContent = translations[currentLang].consoleMessageWrong;
  }
}