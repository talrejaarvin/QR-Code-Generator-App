const form = document.getElementById("generate-form");
const qr = document.getElementById("qrcode");

const qrColorPalettes = new Map([
  ["classic", { backgroundColor: "#ffffff", dotsColor: "#000000" }],
  ["coolBlue", { backgroundColor: "#ffffff", dotsColor: "#1E3A8A" }],
  ["skyHigh", { backgroundColor: "#E0F7FA", dotsColor: "#0277BD" }],
  ["sunset", { backgroundColor: "#FFF3E0", dotsColor: "#FB8C00" }],
  ["lavender", { backgroundColor: "#F3E5F5", dotsColor: "#6A1B9A" }],
  ["minty", { backgroundColor: "#E8F5E9", dotsColor: "#2E7D32" }],
  ["creamNavy", { backgroundColor: "#FAF9F6", dotsColor: "#001F54" }],
  ["coolGray", { backgroundColor: "#F9FAFB", dotsColor: "#374151" }],
  ["pinkPop", { backgroundColor: "#FFE4EC", dotsColor: "#C2185B" }],
  ["aquaFresh", { backgroundColor: "#E0F2F1", dotsColor: "#00695C" }],
]);

let selectedPaletteKey = null; // Store selected palette key globally

const generatePalattes = () => {
  const container = document.getElementById("palettes");
  container.innerHTML = ""; // Clear previous buttons

  for (const [key, { dotsColor }] of qrColorPalettes) {
    const palatte = document.createElement("div");

    // Default (unselected) style
    palatte.className =
      "w-8 h-8 rounded-full opacity-50 brightness-75 hover:opacity-100 transition border-2 border-transparent cursor-pointer";
    palatte.style.backgroundColor = dotsColor;

    // Add a data attribute to identify the palette
    palatte.dataset.paletteKey = key;

    // Click handler
    palatte.addEventListener("click", () => {
      // Deselect all others
      const allPalettes = document.querySelectorAll("#palettes > div");
      allPalettes.forEach((btn) => {
        btn.classList.remove("border-black", "opacity-100", "brightness-100");
        btn.classList.add("opacity-50", "brightness-75");
      });

      // Select current
      palatte.classList.remove("opacity-50", "brightness-75");
      palatte.classList.add("opacity-100", "brightness-100", "border-black");

      // Save selected key
      selectedPaletteKey = key;
    });

    container.appendChild(palatte);
  }
};

generatePalattes();

const showError = (message) => {
  const errorBox = document.getElementById("error-box");
  errorBox.textContent = message;
  errorBox.classList.remove("hidden");
};

const hideError = () => {
  const errorBox = document.getElementById("error-box");
  errorBox.classList.add("hidden");
};

const onGenerateSubmit = (e) => {
  e.preventDefault();

  clearUI();
  hideError();

  const url = document.getElementById("url").value.trim();
  const size = document.getElementById("size").value;

  if (url === "") {
    showError("⚠️ Please enter a valid URL before generating a QR code.");
    return;
  }

  showSpinner();

  setTimeout(() => {
    hideSpinner();
    generateQRCode(url, size);
  }, 1000);
};


function getRandomPalette() {
  const palettes = Array.from(qrColorPalettes.values());
  const randomIndex = Math.floor(Math.random() * palettes.length);
  return palettes[randomIndex]; // { backgroundColor: '...', dotsColor: '...' }
}

const generateQRCode = (url, size) => {
  const palette = qrColorPalettes.get(selectedPaletteKey) || getRandomPalette(); // fallback

  const qrCode = new QRCodeStyling({
    width: size,
    height: size,
    data: url,
    dotsOptions: {
      color: palette.dotsColor,
      type: "rounded",
    },
    backgroundOptions: {
      color: palette.backgroundColor,
    },
  });

  qrCode.append(document.getElementById("qrcode"));

  setTimeout(() => {
    qrCode.getRawData("png").then((blob) => {
      const saveUrl = URL.createObjectURL(blob);
      console.log(saveUrl);
      createSaveBtn(saveUrl);
    });
  }, 50);
};

const showSpinner = () => {
  document.getElementById("spinner").style.display = "flex";
};
const hideSpinner = () => {
  document.getElementById("spinner").style.display = "none";
};

const clearUI = () => {
  qr.innerHTML = "";
  const saveLink = document.getElementById("save-link");
  if (saveLink) {
    saveLink.remove();
  }
};

const createSaveBtn = (saveUrl) => {
  const link = document.createElement("a");
  link.id = "save-link";
  link.classList =
    "bg-red-500 hover:bg-red-700 text-white font-bold py-2 rounded w-1/3 m-auto my-5";
  link.href = saveUrl;
  link.download = "QrCode";
  link.innerHTML = "Save Image";
  document.getElementById("generated").appendChild(link);
};

hideSpinner();

form.addEventListener("submit", onGenerateSubmit);
