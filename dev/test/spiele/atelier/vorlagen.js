// Ausmalbilder für das Atelier: eigene, einfache Umrisse (gezeichnet im Koordinatensystem 1024 × 768).
// Geschlossene Flächen, damit der Farbeimer sie füllen kann.
(function () {
  const LINIE = "#2B1A40";
  const kreis = (g, x, y, r) => { g.beginPath(); g.arc(x, y, r, 0, Math.PI * 2); g.stroke(); };
  const oval = (g, x, y, rx, ry, w = 0) => { g.beginPath(); g.ellipse(x, y, rx, ry, w, 0, Math.PI * 2); g.stroke(); };
  const pfad = (g, punkte, zu = true) => { g.beginPath(); punkte.forEach(([x, y], i) => i ? g.lineTo(x, y) : g.moveTo(x, y)); if (zu) g.closePath(); g.stroke(); };
  const VORLAGEN = [
    { id: "haus", name: "Haus mit Sonne", ru: "Дом и солнце", zeichne(g) {
      pfad(g, [[0, 640], [1024, 640]], false);
      pfad(g, [[300, 640], [300, 380], [700, 380], [700, 640]]);
      pfad(g, [[260, 390], [500, 200], [740, 390]]);
      pfad(g, [[450, 640], [450, 500], [550, 500], [550, 640]]);
      [[340, 430], [590, 430]].forEach(([x, y]) => { pfad(g, [[x, y], [x + 80, y], [x + 80, y + 70], [x, y + 70]]); pfad(g, [[x + 40, y], [x + 40, y + 70]], false); });
      pfad(g, [[600, 290], [600, 210], [650, 210], [650, 330]], false);
      kreis(g, 860, 130, 60);
      for (let i = 0; i < 10; i++) { const w = i / 10 * Math.PI * 2; pfad(g, [[860 + Math.cos(w) * 80, 130 + Math.sin(w) * 80], [860 + Math.cos(w) * 115, 130 + Math.sin(w) * 115]], false); }
      oval(g, 160, 130, 90, 40); oval(g, 230, 110, 60, 40);
      [[100, 640], [880, 640]].forEach(([x, y]) => { pfad(g, [[x - 14, y], [x - 14, y - 90], [x + 14, y - 90], [x + 14, y]], false); kreis(g, x, y - 140, 60); });
    } },
    { id: "blume", name: "Blume", ru: "Цветок", zeichne(g) {
      pfad(g, [[0, 680], [1024, 680]], false);
      for (let i = 0; i < 8; i++) { const w = i / 8 * Math.PI * 2; oval(g, 512 + Math.cos(w) * 105, 250 + Math.sin(w) * 105, 70, 40, w); }
      kreis(g, 512, 250, 62);
      pfad(g, [[500, 315], [500, 680]], false); pfad(g, [[524, 315], [524, 680]], false);
      oval(g, 420, 500, 80, 32, -0.5); oval(g, 604, 560, 80, 32, 0.5);
      [[160, 600], [860, 610]].forEach(([x, y]) => { for (let i = 0; i < 5; i++) { const w = i / 5 * Math.PI * 2; kreis(g, x + Math.cos(w) * 32, y + Math.sin(w) * 32, 22); } kreis(g, x, y, 16); });
      oval(g, 820, 160, 34, 22, 0.4); oval(g, 870, 140, 34, 22, -0.4);
    } },
    { id: "fisch", name: "Fisch im Meer", ru: "Рыбка в море", zeichne(g) {
      g.beginPath(); for (let x = 0; x <= 1024; x += 8) g.lineTo(x, 110 + Math.sin(x / 50) * 14); g.stroke();
      oval(g, 470, 380, 230, 140);
      pfad(g, [[690, 380], [880, 250], [880, 510]]);
      kreis(g, 340, 340, 30); kreis(g, 340, 340, 10);
      pfad(g, [[420, 245], [500, 160], [580, 250]], false);
      pfad(g, [[460, 420], [540, 480], [470, 500]]);
      [[400, 260, 520], [480, 245, 515], [560, 250, 510], [640, 280, 480]].forEach(([x, y1, y2]) => { g.beginPath(); g.moveTo(x, y1); g.quadraticCurveTo(x + 30, (y1 + y2) / 2, x, y2); g.stroke(); });
      kreis(g, 220, 230, 22); kreis(g, 190, 170, 15); kreis(g, 210, 125, 10);
      pfad(g, [[0, 700], [1024, 700]], false);
      [[120, 700], [880, 700]].forEach(([x, y]) => { g.beginPath(); g.moveTo(x, y); g.quadraticCurveTo(x - 40, y - 100, x + 10, y - 200); g.stroke(); g.beginPath(); g.moveTo(x + 30, y); g.quadraticCurveTo(x - 10, y - 100, x + 40, y - 200); g.stroke(); });
      oval(g, 500, 680, 60, 20);
    } },
    { id: "schmetterling", name: "Schmetterling", ru: "Бабочка", zeichne(g) {
      oval(g, 512, 400, 26, 150);
      kreis(g, 512, 225, 34);
      pfad(g, [[500, 195], [450, 110]], false); pfad(g, [[524, 195], [574, 110]], false); kreis(g, 446, 104, 12); kreis(g, 578, 104, 12);
      oval(g, 360, 320, 150, 110, -0.4); oval(g, 664, 320, 150, 110, 0.4);
      oval(g, 390, 500, 110, 90, 0.4); oval(g, 634, 500, 110, 90, -0.4);
      [[330, 300, 45], [694, 300, 45], [390, 510, 35], [634, 510, 35]].forEach(([x, y, r]) => kreis(g, x, y, r));
      [[250, 360], [774, 360]].forEach(([x, y]) => kreis(g, x, y, 18));
    } },
    { id: "mandala", name: "Mandala", ru: "Мандала", zeichne(g) {
      const X = 512, Y = 384;
      [330, 250, 150, 60].forEach(r => kreis(g, X, Y, r));
      for (let i = 0; i < 12; i++) { const w = i / 12 * Math.PI * 2; oval(g, X + Math.cos(w) * 200, Y + Math.sin(w) * 200, 48, 26, w); }
      for (let i = 0; i < 8; i++) { const w = i / 8 * Math.PI * 2 + 0.2; pfad(g, [[X + Math.cos(w) * 60, Y + Math.sin(w) * 60], [X + Math.cos(w) * 150, Y + Math.sin(w) * 150]], false); }
      for (let i = 0; i < 16; i++) { const w = i / 16 * Math.PI * 2; kreis(g, X + Math.cos(w) * 290, Y + Math.sin(w) * 290, 24); }
    } },
    { id: "rakete", name: "Rakete im Weltall", ru: "Ракета в космосе", zeichne(g) {
      g.beginPath(); g.moveTo(512, 90); g.quadraticCurveTo(640, 230, 600, 520); g.lineTo(424, 520); g.quadraticCurveTo(384, 230, 512, 90); g.closePath(); g.stroke();
      kreis(g, 512, 290, 48); kreis(g, 512, 290, 30);
      pfad(g, [[430, 400], [340, 560], [430, 520]]); pfad(g, [[594, 400], [684, 560], [594, 520]]);
      pfad(g, [[450, 520], [480, 660], [512, 580], [544, 660], [574, 520]]);
      [[160, 150], [860, 220], [230, 520], [820, 560]].forEach(([x, y]) => pfad(g, Array.from({ length: 10 }, (_, i) => { const w = i / 10 * Math.PI * 2 - Math.PI / 2, r = i % 2 ? 22 : 50; return [x + Math.cos(w) * r, y + Math.sin(w) * r]; })));
      kreis(g, 820, 400, 60); oval(g, 820, 400, 100, 22, -0.3);
    } }
  ];
  function zeichne(g, id, b = 1024, h = 768) {
    const v = VORLAGEN.find(x => x.id === id); if (!v) return;
    g.save(); g.scale(b / 1024, h / 768); g.strokeStyle = LINIE; g.lineWidth = 7; g.lineCap = "round"; g.lineJoin = "round"; v.zeichne(g); g.restore();
  }
  window.Vorlagen = { VORLAGEN, zeichne };
})();
