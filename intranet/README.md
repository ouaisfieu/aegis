Parfait — voici un **README.md complet, pédagogique, multilingue (FR / EN / Lorem)**, pensé **grand public débutant**, pour **comprendre, se réapproprier, modifier et forker proprement** le projet ARG.

Tu peux **copier-coller tel quel** ce fichier dans `README.md`.

---

# 🖥️ ARG dystopique rétro — *Infiltration Terminal*

> **Ceci n’est pas un jeu.**
> Ou peut-être que si.
> À toi d’en décider.

---

## 🌍 Languages / Langues / Linguae

* 🇫🇷 [Français](#-français)
* 🇬🇧 [English](#-english)
* 🧪 [Lorem Ipsum](#-lorem-ipsum)

---

## 🇫🇷 Français

### 🎯 Qu’est-ce que ce projet ?

Ce projet est un **ARG (Alternate Reality Game)** jouable **dans un navigateur web**, inspiré par :

* les **terminaux rétro** (années 80–90),
* la culture **hacker / anarcho-geek**,
* le **rétro-gaming low-tech**,
* les récits dystopiques réalistes,
* et les jeux qui brouillent la frontière entre fiction et réalité.

L’univers met en scène une **secte low-tech anarcho-geek** qui infiltre les systèmes existants pour les retourner contre eux-mêmes.
Le joueur progresse par **observation, curiosité et déduction**, pas par des mécaniques de jeu classiques.

👉 **Aucune compétence technique n’est requise pour jouer.**
👉 **Des compétences très basiques suffisent pour modifier le projet.**

---

### 🧩 C’est quoi un ARG ?

Un **ARG** est un jeu narratif interactif qui repose sur l’idée :

> *“This Is Not A Game”* (TINAG)

Concrètement :

* il n’y a pas de score,
* pas de tutoriel explicite,
* pas de règles clairement affichées,
* le joueur doit **explorer**, **essayer**, **fouiller**, **réfléchir**.

Dans ce projet :

* certaines réponses sont **dans le code source**,
* d’autres sont **dans les textes**,
* d’autres encore sont **culturelles** (références hacker, ASCII, binaire…).

---

### 🗂️ Contenu du dossier

```text
anarcho-arg/
├── index.html     # Page principale (terminal d’infiltration)
├── relic.html     # Deuxième étape : la relique / énigme
├── style.css      # Style rétro CRT (scanlines, couleurs néon)
├── script.js      # Logique principale (langues, commandes)
├── relic.js       # Logique de l’énigme binaire
└── README.md      # Ce fichier
```

---

### ▶️ Comment jouer (pour le public)

1. Ouvre `index.html` dans un navigateur (Chrome, Firefox, Edge…)
2. Lis attentivement le texte
3. Clique sur **Commencer l’infiltration**
4. Observe l’interface
5. Essaie des commandes
6. Si tu bloques :

   * relis les textes,
   * regarde le **code source HTML** (clic droit → *Afficher le code source*),
   * explore.

💡 *Les ARG récompensent la curiosité, pas la vitesse.*

---

### 🛠️ Comment modifier le projet (débutants)

Tu peux tout faire avec :

* un **éditeur de texte** (Notepad++, VS Code, même le Bloc-notes),
* un **navigateur web**.

#### ✏️ Modifier les textes

Dans `script.js` et `relic.js`, tu trouveras des objets comme :

```js
const translations = {
  fr: { ... },
  en: { ... },
  lorem: { ... }
};
```

👉 Modifie simplement les phrases entre guillemets.

---

#### 🌐 Ajouter une langue

1. Copie une section (`fr`, `en`, ou `lorem`)
2. Renomme-la (`es`, `de`, `it`, etc.)
3. Ajoute un bouton HTML
4. Le système est déjà prêt à gérer plusieurs langues

---

#### 🧠 Changer les énigmes

* La commande secrète est définie dans `script.js`
* La solution binaire est définie dans `relic.js`

👉 Tu peux :

* changer la commande,
* changer le message binaire,
* ajouter une troisième page,
* transformer l’ARG en **outil pédagogique**, **manifeste**, **recrutement**, **fiction politique**, etc.

---

### 🚀 Publier sur itch.io

1. Zippe le dossier (`index.html` doit être à la racine)
2. Va sur [https://itch.io](https://itch.io)
3. *Create new project*
4. Type : **HTML**
5. Upload le `.zip`
6. Coche *“This file will be played in the browser”*

🎉 Ton ARG est en ligne.

---

### 🔓 Philosophie & licence

* Pas de dépendances
* Pas de tracking
* Pas de backend
* 100% modifiable
* Forkable
* Détournable

👉 Fais-en ce que tu veux.
👉 Le système est fait pour être retourné.

---

## 🇬🇧 English

### 🎯 What is this project?

This project is a **browser-based Alternate Reality Game (ARG)** built with **pure HTML, CSS and JavaScript**.

It mixes:

* retro terminal aesthetics,
* low-tech hacker culture,
* dystopian realism,
* narrative exploration.

There is no score.
There is no tutorial.
There is no “win” screen.

The player advances by **thinking**, **observing**, and **questioning**.

---

### ▶️ How to play

1. Open `index.html` in a browser
2. Read carefully
3. Start the infiltration
4. Try commands
5. Inspect the source code if needed

> If you are lost, you are probably playing correctly.

---

### 🛠️ How to fork & modify

This project is beginner-friendly:

* open files
* edit text
* refresh browser

Everything is intentionally simple and readable.

You are encouraged to:

* remix it,
* politicize it,
* fictionalize it,
* weaponize it (narratively),
* teach with it.

---

## 🧪 Lorem Ipsum

### 📜 Manifestum

Hoc documentum continet **ludum narrativum asynchronum** in specie terminalis vetustae.

* Nulla regula manifesta
* Nulla victoria declarata
* Curiositas sola clavis est

> *Hoc non est ludus.*

Systema ipsum contra se ipsum vertitur.

---

## 🧠 Dernier mot

Ce projet est :

* un **prototype**,
* un **outil**,
* un **cadre narratif**,
* une **invitation à bifurquer**.

Si tu le forks,
alors le jeu continue.

🟢 **Bonne infiltration.**
