const questions = [
  "Parlami dei cereali in Toscana",
  "Parlami della produzione di cereali in Toscana",
  "Superficie agricola a livello regionale",
  "Precipitazioni piovose a livello nazionale",
  "Produzione di vino in Toscana",
  "Produzione di olio in Toscana",
  "Parlami dei bovini in Toscana",
  "Parlami delle piante aromatiche",
  "Parlami degli allevamenti in Toscana",
  "Produzione di latte in Toscana",
  "Parlami della produzione di ortofrutta",
  "Numero di aziende agricole",
  "Parlami del capo azienda nelle aziende agricole",
  "Parlami delle emissioni di gas serra",
  "Giornate di lavoro della manodopera",
  "Parlami della produzione di carciofi",
  "Parlami della produzione di pomodori",
  "Parlami delle piante di rosmarino",
  "Parlami della produzione di arance a livello regionale",
  "Parlami delle piante di basilico a livello nazionale"
];


const colors = ["#a5d6ecff", "#82c9dfff"];
const canvas = document.getElementById("wheel");
const ctx = canvas.getContext("2d");
let rotation = 0;

// Imposta canvas responsive
function resizeCanvas() {
  const container = document.getElementById("wheelContainer");
  canvas.width = container.clientWidth;
  canvas.height = container.clientWidth; // quadrato perfetto
  drawWheel(rotation);
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();

// Disegna la ruota
function drawWheel(rot) {
  const radius = canvas.width / 2;
  const sectorAngle = (2 * Math.PI) / questions.length;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < questions.length; i++) {
    const startAngle = i * sectorAngle + rot;
    const endAngle = startAngle + sectorAngle;

    // Evidenzia spicchio selezionato centrato sotto la freccia
    const selectedIndex = getSelectedIndex(rotation);
    ctx.fillStyle = i === selectedIndex ? "#147188ff" : colors[i % colors.length];
    

    ctx.beginPath();
    ctx.moveTo(radius, radius);
    ctx.arc(radius, radius, radius, startAngle, endAngle);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Numero su ogni spicchio
    const textAngle = startAngle + sectorAngle / 2;
    const textRadius = radius * 0.7;
    ctx.save();
    ctx.translate(radius, radius);
    ctx.rotate(textAngle);
    ctx.textAlign = "center";
    ctx.fillStyle = "#000";
    ctx.font = `${Math.floor(radius * 0.12)}px Arial`;
    ctx.fillText(i + 1, textRadius, 0);
    ctx.restore();
  }
}

// Ottieni indice spicchio selezionato dalla freccia
// Restituisce l'indice dello spicchio sotto la freccia
function getSelectedIndex(rotation) {
  const sectorAngle = (2 * Math.PI) / questions.length;
  let adjustedRotation = rotation % (2 * Math.PI);
  // Lo spicchio vincente è quello in alto (0 rad) senza freccia
  return Math.floor((questions.length - adjustedRotation / sectorAngle) % questions.length);
}


// Gestione pulsante
document.getElementById("spinButton").addEventListener("click", () => {
  const randomDegree = Math.random() * 360 + 720; // almeno 2 giri
  const randomRadian = (randomDegree * Math.PI) / 180;
  const duration = 5000;
  const startRotation = rotation;
  let startTime = null;

  function animate(timestamp) {
    if (!startTime) startTime = timestamp;
    const elapsed = timestamp - startTime;
    const progress = Math.min(elapsed / duration, 1);
    rotation = startRotation + randomRadian * easeOutCubic(progress);
    drawWheel(rotation);
    if (progress < 1) {
      requestAnimationFrame(animate);
    } else {
      const selected = getSelectedIndex(rotation);
      document.getElementById("selectedQuestion").textContent =
        `Domanda selezionata: ${questions[selected]}`;
    }
  }

  requestAnimationFrame(animate);
});

// Funzione easing per decelerazione naturale
function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}
