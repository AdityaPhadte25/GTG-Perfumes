/* 
  HAMBURGER MENU
*/
const hamburger = document.getElementById("hamburger");
const nav = document.getElementById("mainNav");

hamburger.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("open");
  hamburger.setAttribute("aria-expanded", isOpen);
});

/*
  GALLERY
*/
const images = [
  "assests/images/product-1.png",
  "assests/images/product-2.jpg",
  "assests/images/bella.jpg",
  "assests/images/daisies.jpg",
  "assests/images/arose.jpg",
  "assests/images/product-2.jpg",
  "assests/images/bella.jpg",
  "assests/images/daisies.jpg"
];

let currentIndex = 0;

const mainImage = document.getElementById("mainImage");
const dotsContainer = document.getElementById("galleryDots");
const thumbs = document.querySelectorAll(".gallery-thumbnails img");

images.forEach((_, i) => {
  const dot = document.createElement("span");
  if (i === 0) dot.classList.add("active");
  dot.onclick = () => changeImage(i);
  dotsContainer.appendChild(dot);
});

const dots = dotsContainer.children;

function changeImage(index) {
  currentIndex = index;
  mainImage.src = images[index];

  [...dots].forEach(d => d.classList.remove("active"));
  dots[index].classList.add("active");

  thumbs.forEach(t => t.classList.remove("active"));
  thumbs[index].classList.add("active");
}

document.getElementById("prevBtn").onclick = () =>
  changeImage((currentIndex - 1 + images.length) % images.length);

document.getElementById("nextBtn").onclick = () =>
  changeImage((currentIndex + 1) % images.length);

thumbs.forEach((thumb, index) => {
  thumb.onclick = () => changeImage(index);
});

thumbs.forEach((img, index) => {
  img.src = img.dataset.src;
  img.dataset.index = index;
});

/*
  PURCHASE PRODUCT
*/
const purchaseRadios = document.querySelectorAll('input[name="purchaseType"]');
const addToCart = document.getElementById("addToCart");

const singleBox = document.getElementById("singleSubscription");
const doubleBox = document.getElementById("doubleSubscription");

function updatePurchase() {
  const purchaseRadio = document.querySelector(
    'input[name="purchaseType"]:checked'
  );

  if (!purchaseRadio) {
    addToCart.href = "#";
    addToCart.classList.add("disabled");
    return;
  }

  const purchase = purchaseRadio.value;

  singleBox.classList.remove("active");
doubleBox.classList.remove("active");

void singleBox.offsetHeight;
void doubleBox.offsetHeight;

if (purchase === "single") {
  singleBox.classList.add("active");
}

if (purchase === "double") {
  doubleBox.classList.add("active");
}

  let link = "/cart?type=" + purchase;
  let isValid = false;

  if (purchase === "single") {
    const fragrance = document.querySelector(
      'input[name="fragrance"]:checked'
    )?.value;

    if (fragrance) {
      link += `&fragrance=${fragrance}`;
      isValid = true;
    }
  }

  if (purchase === "double") {
    const fragrance1 = document.querySelector(
      'input[name="fragrance1"]:checked'
    )?.value;

    const fragrance2 = document.querySelector(
      'input[name="fragrance2"]:checked'
    )?.value;

    if (fragrance1 && fragrance2) {
      link += `&fragrance1=${fragrance1}&fragrance2=${fragrance2}`;
      isValid = true;
    }
  }

  addToCart.href = isValid ? link : "#";
  addToCart.classList.toggle("disabled", !isValid);
}

purchaseRadios.forEach(r => r.onchange = updatePurchase);
document.addEventListener("change", (e) => {
  if (
    e.target.matches(
      'input[name="fragrance"], input[name="fragrance1"], input[name="fragrance2"]'
    )
  ) {
    updatePurchase();
  }
});
updatePurchase();

/* 
  ACCORDION
*/
document.querySelectorAll(".accordion-header").forEach(header => {
  header.addEventListener("click", () => {
    const item = header.parentElement;
    const isOpen = item.classList.contains("open");

    document.querySelectorAll(".accordion-item").forEach(i => {
      i.classList.remove("open");
      i.querySelector(".icon").textContent = "+";
    });

    if (!isOpen) {
      item.classList.add("open");
      header.querySelector(".icon").textContent = "−";
    }
  });
});

/* 
  Counter animation
*/
const counters = document.querySelectorAll("[data-target]");
let countersTriggered = false;

function runCounters() {
  counters.forEach(c => {
    let i = 0;
    const target = Number(c.dataset.target) || 0;
    const interval = setInterval(() => {
      i++;
      c.textContent = i;
      if (i >= target) {
        c.textContent = target;
        clearInterval(interval);
      }
    }, 20);
  });
}

if ("IntersectionObserver" in window && counters.length) {

  const counterObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !countersTriggered) {
        countersTriggered = true;
        runCounters();
        counterObserver.disconnect();
      }
    });
  }, { threshold: 0.3 });

  counters.forEach(counter => counterObserver.observe(counter));

} else if (counters.length) {

  function onScroll() {
    if (countersTriggered) return;
    const first = counters[0];
    if (first.getBoundingClientRect().top < window.innerHeight) {
      countersTriggered = true;
      runCounters();
      window.removeEventListener("scroll", onScroll);
    }
  }

  window.addEventListener("scroll", onScroll);
  onScroll(); 
}

/* 
  LAZY LOAD THUMBNAILS
*/
if ("IntersectionObserver" in window) {

  const thumbObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            delete img.dataset.src;
          }
          thumbObserver.unobserve(img);
        }
      });
    },
    { rootMargin: "100px" }
  );

  thumbs.forEach(img => thumbObserver.observe(img));

} else {
  thumbs.forEach(img => {
    if (img.dataset.src) {
      img.src = img.dataset.src;
      delete img.dataset.src;
    }
  });
}

changeImage(0);
