const hide = (query) => {
  show(query, "none")
}

const show = (query, style = "inline") => {
  document.querySelectorAll(query).forEach(e => e.style.display = style);
}
