const generateBtn = document.getElementById("generate-btn");
const preview = document.getElementById("preview");
const outputAll = document.getElementById("generated-all");
const imagesInput = document.getElementById("images");

let imageDataUrls = [];

// Read uploaded images as data URLs
imagesInput.addEventListener("change", async (e) => {
  const files = Array.from(e.target.files);
  imageDataUrls = [];
  for (const file of files) {
    const url = await fileToDataURL(file);
    imageDataUrls.push(url);
  }
});

function fileToDataURL(file) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.readAsDataURL(file);
  });
}

generateBtn.addEventListener("click", () => {
  const name = document.getElementById("site-name").value.trim() || "My Website";
  const pagesInput = document.getElementById("pages").value.trim() || "Home, About, Contact";
  const description = document.getElementById("description").value.trim() || "A modern website.";
  const theme = document.getElementById("theme").value;
  const onlineOrdering = document.getElementById("online-ordering").checked;

  const pages = pagesInput.split(",").map(p => p.trim()).filter(Boolean);
  if (!pages.length) {
    alert("Please specify at least one page.");
    return;
  }

  const files = {};
  pages.forEach((page, index) => {
    const filename = index === 0 ? "index.html" : `${slugify(page)}.html`;
    files[filename] = buildPageHTML({
      siteName: name,
      pageName: page,
      pages,
      description,
      theme,
      onlineOrdering
    });
  });

  // Preview homepage
  preview.srcdoc = files["index.html"];

  // Combine all files into one textarea with comments
  let combined = "";
  for (const [filename, content] of Object.entries(files)) {
    combined += `/* ${filename} */\n${content}\n\n`;
  }
  outputAll.value = combined;
});

function slugify(str) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "page";
}

function buildPageHTML({ siteName, pageName, pages, description, theme, onlineOrdering }) {
  const themeClass =
    theme === "dark" ? "theme-dark" :
    theme === "colorful" ? "theme-colorful" :
    "theme-light";

  const navLinks = pages.map((p, i) => {
    const fname = i === 0 ? "index.html" : `${slugify(p)}.html`;
    return `<a href="${fname}">${p}</a>`;
  }).join("");

  const hero = `
  <header class="hero">
    <h1>${siteName} – ${pageName}</h1>
    <p>${description}</p>
  </header>`;

  const imagesHTML = imageDataUrls.map(url => `
    <img src="${url}" alt="Image for ${siteName}">
  `).join("");

  const imageSection = imagesHTML
    ? `<section class="card">
         <h2>Gallery</h2>
         ${imagesHTML}
       </section>`
    : "";

  const orderingSection = onlineOrdering ? `
  <section class="order-section">
    <h2>Online Ordering</h2>
    <p>Customers can place orders online. Replace this text with your real ordering link or integration.</p>
    <button onclick="alert('Connect this button to your ordering system URL.')">
      Order Now
    </button>
  </section>` : "";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>${siteName} – ${pageName}</title>
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <link rel="stylesheet" href="style.css" />
</head>
<body class="${themeClass}">
  <nav>
    ${navLinks}
  </nav>
  <main>
    ${hero}
    <section class="card">
      <h2>About This Page</h2>
      <p>${description}</p>
    </section>
    ${imageSection}
    ${orderingSection}
  </main>
</body>
</html>`;
}
