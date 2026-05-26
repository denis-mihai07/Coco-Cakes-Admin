document.getElementById("login-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const username = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const errorMsg = document.getElementById("error-msg");

  try {
    // 1. Trimitem cererea de login către backend-ul tău Node.js
    const response = await fetch("http://localhost:3000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Autentificare eșuată");
    }

    // 2. Salvăm token-ul primit în localStorage-ul browserului
    localStorage.setItem("adminToken", data.token);

    // 3. Ascundem login-ul și afișăm site-ul original în iframe
    document.getElementById("login-container").style.display = "none";
    const iframe = document.getElementById("site-frame");
    iframe.style.display = "block";

    // 4. Injectăm butoanele de plus peste imaginile din iframe după ce s-a încărcat
    iframe.onload = function () {
      injectAdminPowers(iframe);
    };
  } catch (err) {
    errorMsg.textContent = err.message;
    errorMsg.style.display = "block";
  }
});

// Funcția care adaugă plusurile direct în HTML-ul site-ului tău original (fără copy-paste)
function injectAdminPowers(iframe) {
  // Accesăm documentul din interiorul iframe-ului
  const iframeDocument =
    iframe.contentDocument || iframe.contentWindow.document;

  // Căutăm pozele tale (aici va trebui să pui selectorul tău CSS exact, ex: '.cake-img' sau 'section img')
  // Să presupunem că ai o clasă sau o structură fixă pentru cele 10 poze
  const cakeImages = iframeDocument.querySelectorAll(
    ".clasa-pozelor-tale-din-index",
  );

  cakeImages.forEach((img, index) => {
    const slotId = index + 1; // Sloturi de la 1 la 10

    // Punem imaginea într-un container relativ ca să putem poziționa butonul de plus peste ea
    const wrapper = iframeDocument.createElement("div");
    wrapper.style.position = "relative";
    wrapper.style.display = "inline-block";

    // Mutăm imaginea în wrapper
    img.parentNode.insertBefore(wrapper, img);
    wrapper.appendChild(img);

    // Creăm butonul de plus
    const plusBtn = iframeDocument.createElement("button");
    plusBtn.innerHTML = "➕";
    plusBtn.style.position = "absolute";
    plusBtn.style.top = "10px";
    plusBtn.style.right = "10px";
    plusBtn.style.zIndex = "999";
    plusBtn.style.background = "#ff6b81";
    plusBtn.style.border = "none";
    plusBtn.style.borderRadius = "50%";
    plusBtn.style.width = "40px";
    plusBtn.style.height = "40px";
    plusBtn.style.cursor = "pointer";
    plusBtn.style.fontSize = "20px";

    // Când adminul dă click pe plusul de pe o poză din iframe
    plusBtn.addEventListener("click", () => {
      alert(`Vrei să schimbi imaginea de pe slotul ${slotId}`);
      // Aici vom deschide fereastra de upload
    });

    wrapper.appendChild(plusBtn);
  });
}
