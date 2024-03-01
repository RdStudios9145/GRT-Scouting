const hide = (query) => {
  show(query, "none")
}

const show = (query, style = "inline") => {
  document.querySelectorAll(query).forEach(e => e.style.display = style);
}

const For = (query, callback) => {
  document.querySelectorAll(query).forEach(callback);
}

document.querySelector("head").append((() => { let style = document.createElement("link"); style.rel = "stylesheet"; style.href = "style.css?" + Date.now(); console.log(style); return style; })());
