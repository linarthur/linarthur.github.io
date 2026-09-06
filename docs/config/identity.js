// config/identity.js
//
// Single source of truth for the hero's name, title-screen text, and portrait.
// Swap this whole file (or edit the fields below) to re-skin the entire game
// to an original character before any public sharing.
//
// Nothing outside this file, /config/identity.indiana.js, and engine/main.js's
// single import line should ever hard-code the hero's name.

export const identity = {
  // Shipped placeholder — safe default, no third-party IP wired into the engine.
  heroName: "Doctor Indiana Jones",
  heroShortName: "Indiana",
  heroTitle: "Professor of Archaeology, Barnett College",

  gameTitle: "Indiana Jones and the Drowned Bell of Atlantis",
  gameSubtitle: "A Doctor Indiana Jones Adventure",
  gameYear: "1939",

  // Portrait is a drawing function, not an image file, so the placeholder
  // ships with zero binary assets. Draws into a square canvas context
  // centered at (0,0) with radius 1 (caller scales/translates).
  drawPortrait(ctx) {
    ctx.save();
    // face
    ctx.fillStyle = "#d9a066";
    ctx.beginPath();
    ctx.ellipse(0, 0.05, 0.55, 0.65, 0, 0, Math.PI * 2);
    ctx.fill();
    // fedora brim
    ctx.fillStyle = "#4a3728";
    ctx.beginPath();
    ctx.ellipse(0, -0.35, 0.85, 0.22, 0, 0, Math.PI * 2);
    ctx.fill();
    // fedora crown
    ctx.fillStyle = "#5c4433";
    ctx.beginPath();
    ctx.moveTo(-0.4, -0.4);
    ctx.quadraticCurveTo(0, -0.95, 0.4, -0.4);
    ctx.closePath();
    ctx.fill();
    // hatband
    ctx.fillStyle = "#2e2118";
    ctx.fillRect(-0.42, -0.44, 0.84, 0.1);
    // jaw shadow
    ctx.strokeStyle = "rgba(0,0,0,0.25)";
    ctx.lineWidth = 0.03;
    ctx.beginPath();
    ctx.arc(0, 0.1, 0.4, 0.2, Math.PI - 0.2);
    ctx.stroke();
    ctx.restore();
  },

  // Player-facing flavour strings that mention the hero by name/title.
  // Route new ones through here so a re-skin stays a one-file edit.
  strings: {
    titleScreenPrompt: "TAP TO BEGIN\n點擊開始",
    saveSlotHeader: (n) => `Case File ${n}\n案件檔案 ${n}`,
  },

  // Shown on every visit to the title screen, and again on the credits
  // screen after the game is completed. Not part of the hero re-skin —
  // this stays true regardless of which character config is loaded.
  dedication:
    "This game is created by Austin and Lucy's father, hope you kids have lots of fun! Love from Dad.\n這個遊戲是Austin和Lucy的爸爸做的，希望孩子們玩得開心！爸爸愛你們。",
};

export default identity;
