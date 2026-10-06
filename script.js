const phoneCatalog = {
  Apple: ["iPhone 16 Pro Max", "iPhone 16 Pro", "iPhone 16", "iPhone 16e", "iPhone 15 Pro Max", "iPhone 15 Pro", "iPhone 15", "iPhone 14 Pro Max", "iPhone 14", "iPhone 13", "iPhone 12", "iPhone 11", "iPhone SE"],
  Samsung: ["Galaxy S25 Ultra", "Galaxy S25", "Galaxy S24 Ultra", "Galaxy S24", "Galaxy S23 FE", "Galaxy A56", "Galaxy A55", "Galaxy A36", "Galaxy A35", "Galaxy A26", "Galaxy A16", "Galaxy A15", "Galaxy A05s"],
  Motorola: ["Motorola Edge 60 Pro", "Motorola Edge 50 Pro", "Motorola Edge 50 Fusion", "Moto G85", "Moto G75", "Moto G55", "Moto G35", "Moto G34", "Moto G24", "Moto G14", "Moto E14"],
  Xiaomi: ["Redmi Note 14 Pro+", "Redmi Note 14 Pro", "Redmi Note 14", "Redmi Note 13 Pro", "Redmi Note 13", "Redmi 14C", "Redmi 13C", "POCO X7 Pro", "POCO X6", "POCO C75", "Xiaomi 14T"]
};

const state = { brand: "", model: "", service: "" };
const brandButtons = [...document.querySelectorAll(".brand-option")];
const brandStep = document.querySelector("#brand-step");
const modelStep = document.querySelector("#model-step");
const serviceStep = document.querySelector("#service-step");
const modelList = document.querySelector("#model-list");
const modelSearch = document.querySelector("#model-search");
const customModel = document.querySelector("#custom-model");
const customModelInput = document.querySelector("#custom-model-input");
const emptyResults = document.querySelector("#empty-results");
const serviceButtons = [...document.querySelectorAll(".service-option")];
const requestButton = document.querySelector("#request-quote");
const formStatus = document.querySelector("#form-status");

function normalize(value) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

function setProgress(active) {
  document.querySelectorAll(".progress-step").forEach((step) => {
    const number = Number(step.dataset.progress);
    step.classList.toggle("is-current", number === active);
    step.classList.toggle("is-done", number < active);
  });
}

function renderModels(filter = "") {
  const models = phoneCatalog[state.brand] || [];
  const query = normalize(filter.trim());
  const matches = models.filter((model) => normalize(model).includes(query));
  modelList.replaceChildren();

  matches.forEach((model) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "model-option";
    button.textContent = model;
    button.setAttribute("aria-pressed", String(state.model === model));
    button.addEventListener("click", () => chooseModel(model));
    modelList.append(button);
  });

  emptyResults.hidden = matches.length > 0 || state.brand === "Outra marca";
  document.querySelector("#popular-label").hidden = Boolean(query) || state.brand === "Outra marca";
}

function chooseBrand(brand) {
  state.brand = brand;
  state.model = "";
  state.service = "";
  brandButtons.forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.brand === brand)));
  document.querySelector("#chosen-brand").textContent = brand === "Outra marca" ? "Informe a marca e o modelo do seu aparelho." : `Marca selecionada: ${brand}`;
  customModel.hidden = brand !== "Outra marca";
  modelSearch.hidden = brand === "Outra marca";
  if (brand === "Outra marca") {
    document.querySelector(".search-box").hidden = true;
    document.querySelector("#popular-label").hidden = true;
    modelList.replaceChildren();
    emptyResults.hidden = true;
    customModelInput.value = "";
  } else {
    document.querySelector(".search-box").hidden = false;
    renderModels();
  }
  serviceStep.hidden = true;
  modelStep.hidden = false;
  formStatus.textContent = "";
  setProgress(2);
  modelStep.scrollIntoView({ behavior: "smooth", block: "nearest" });
  if (brand !== "Outra marca") modelSearch.focus({ preventScroll: true });
}

function chooseModel(model) {
  state.model = model;
  state.service = "";
  serviceButtons.forEach((button) => button.setAttribute("aria-pressed", "false"));
  document.querySelector("#selected-device").textContent = `${state.brand} · ${state.model}`;
  modelList.querySelectorAll(".model-option").forEach((button) => button.setAttribute("aria-pressed", String(button.textContent === model)));
  serviceStep.hidden = false;
  requestButton.disabled = true;
  formStatus.textContent = "";
  setProgress(3);
}

brandButtons.forEach((button) => button.addEventListener("click", () => chooseBrand(button.dataset.brand)));
modelSearch.addEventListener("input", () => renderModels(modelSearch.value));
document.querySelector("#change-brand").addEventListener("click", () => {
  state.brand = "";
  state.model = "";
  state.service = "";
  modelStep.hidden = true;
  serviceStep.hidden = true;
  brandButtons.forEach((button) => button.setAttribute("aria-pressed", "false"));
  setProgress(1);
  brandStep.scrollIntoView({ behavior: "smooth", block: "nearest" });
});
document.querySelector("#back-to-model").addEventListener("click", () => {
  serviceStep.hidden = true;
  state.service = "";
  setProgress(2);
  modelStep.scrollIntoView({ behavior: "smooth", block: "nearest" });
});

document.querySelector("#add-custom-model").addEventListener("click", () => {
  const typedModel = customModelInput.value.trim();
  if (!typedModel) {
    customModelInput.focus();
    return;
  }
  state.brand = "Outra marca";
  chooseModel(typedModel);
});
customModelInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") document.querySelector("#add-custom-model").click();
});

serviceButtons.forEach((button) => {
  button.addEventListener("click", () => {
    state.service = button.dataset.service;
    serviceButtons.forEach((item) => item.setAttribute("aria-pressed", String(item === button)));
    requestButton.disabled = false;
    formStatus.textContent = "";
  });
});

requestButton.addEventListener("click", () => {
  const number = (window.GISLANTEC_CONFIG?.whatsapp || "").replace(/\D/g, "");
  const note = document.querySelector("#problem-note").value.trim();
  const message = [
    "Olá! Quero solicitar um orçamento na Gislan Tec.",
    `Celular: ${state.brand} ${state.model}`,
    `Problema: ${state.service}`,
    note ? `Detalhes: ${note}` : ""
  ].filter(Boolean).join("\n");

  if (!number) {
    formStatus.textContent = "Seu pedido está pronto. Para abrir o WhatsApp, falta cadastrar o número comercial em config.js (as instruções estão no README).";
    return;
  }
  window.open(`https://wa.me/${number}?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
  formStatus.textContent = "Abrimos uma conversa no WhatsApp com os dados do aparelho. Confira e envie a mensagem para a assistência.";
});

document.querySelector("#current-year").textContent = String(new Date().getFullYear());

document.addEventListener("keydown", (event) => {
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k" && !modelStep.hidden && state.brand !== "Outra marca") {
    event.preventDefault();
    modelSearch.focus();
  }
  if (event.key === "Escape" && !modelStep.hidden && document.activeElement === modelSearch) {
    modelSearch.value = "";
    renderModels();
  }
});

