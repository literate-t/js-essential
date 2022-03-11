export function get(selector: string) {
  return document.querySelector(selector);
}

export function getAll(selector: string) {
  return document.querySelectorAll(selector);
}