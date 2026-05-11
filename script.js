const koukokuImages = [
  "ig_0d5743337ded92db016a002f4cf4f08191a73c2a82276c348d.png",
  "ig_0d5743337ded92db016a002fe428148191a23005c07513ba07.png",
  "ig_0d5743337ded92db016a0030287c6481918308c798ed190955.png",
  "ig_0d5743337ded92db016a003068efe881919202c38ef22b335c.png",
  "ig_0d5743337ded92db016a0030fba1a48191922ff5f34624d7ff.png",
  "ig_0d5743337ded92db016a00321480e88191b40694d65df1ef26.png",
  "ig_0d5743337ded92db016a00325c023081918be8bc2dc26f6dfe.png",
  "ig_0d5743337ded92db016a0032a040a48191a9f7beee74720894.png",
  "ig_0d5743337ded92db016a0032ed72f88191ac9dbfb1276a7c5e.png",
  "ig_0d5743337ded92db016a00332f0e10819196aecc3dfe1f63c6.png",
  "ig_0d5743337ded92db016a0033f80bdc8191a174c2ba53ce959f.png",
  "ig_0d5743337ded92db016a00343e4f9c819184739fb3a895d1d2.png",
  "ig_0d5743337ded92db016a00348577ac8191a903c62980adc75f.png",
];

const lpImages = [
  "ig_050a05ff53af9361016a000884c1e0819188cb75395ee7e7de.png",
  "ig_0f8c415dc22c32fc016a00a6bdfb388191b7cfc2b1a0fc7fb9.png",
  "musicjam-lp3-2.png",
  "ig_0abc31912799f35a016a0021dfa0c0819185303f0a3d6d8813.png",
  "ig_0abc31912799f35a016a002615a3d88191a7a2d46e6caacbc0.png",
];

const slideImages = [
  "slide-01.png",
  "slide-02.png",
  "slide-03.png",
  "slide-04.png",
  "slide-05.png",
  "slide-06.png",
  "slide-07.png",
];

const lightbox = document.querySelector("#lightbox");
const lightboxImage = document.querySelector("#lightboxImage");
const lightboxCaption = document.querySelector("#lightboxCaption");
const closeLightbox = document.querySelector("#closeLightbox");

function openLightbox(src, caption) {
  lightboxImage.src = src;
  lightboxImage.alt = caption;
  lightboxCaption.textContent = caption;
  lightbox.showModal();
}

function createPreviewCard({ src, title, meta }) {
  const card = document.createElement("article");
  card.className = "preview-card";

  const button = document.createElement("button");
  button.className = "preview-button";
  button.type = "button";
  button.addEventListener("click", () => openLightbox(src, title));

  const image = document.createElement("img");
  image.src = src;
  image.alt = title;
  image.loading = "lazy";

  const caption = document.createElement("div");
  caption.className = "card-caption";
  caption.innerHTML = `<span>${title}</span><span>${meta}</span>`;

  button.append(image, caption);
  card.append(button);
  return card;
}

function renderAds() {
  const grid = document.querySelector("#adGrid");
  koukokuImages.forEach((name, index) => {
    grid.append(
      createPreviewCard({
        src: `./Koukoku/${name}`,
        title: `広告ビジュアル ${String(index + 1).padStart(2, "0")}`,
        meta: "16:9",
      }),
    );
  });
}

function renderLpList() {
  const list = document.querySelector("#lpList");
  const preview = document.querySelector("#lpPreview");
  const lpName = document.querySelector("#lpName");

  function selectLp(index) {
    const src = `./LPImage/${lpImages[index]}`;
    preview.src = src;
    preview.alt = `LPデザイン ${index + 1}`;
    lpName.textContent = `LP Design ${String(index + 1).padStart(2, "0")}`;
    list.querySelectorAll(".lp-choice").forEach((button, buttonIndex) => {
      button.classList.toggle("is-active", buttonIndex === index);
    });
  }

  lpImages.forEach((name, index) => {
    const button = document.createElement("button");
    button.className = "lp-choice";
    button.type = "button";
    button.innerHTML = `
      <img src="./LPImage/${name}" alt="" loading="lazy">
      <span>
        <strong>LP Design ${String(index + 1).padStart(2, "0")}</strong>
        <span>縦長ページ案</span>
      </span>
    `;
    button.addEventListener("click", () => selectLp(index));
    list.append(button);
  });

  preview.addEventListener("click", () => {
    openLightbox(preview.src, lpName.textContent);
  });

  selectLp(0);
}

function renderSlides() {
  const rail = document.querySelector("#slideRail");
  slideImages.forEach((name, index) => {
    rail.append(
      createPreviewCard({
        src: `./Slide/image2-sample-style/${name}`,
        title: `提案スライド ${String(index + 1).padStart(2, "0")}`,
        meta: "16:9",
      }),
    );
  });
}

closeLightbox.addEventListener("click", () => lightbox.close());
lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) {
    lightbox.close();
  }
});

renderAds();
renderLpList();
renderSlides();
