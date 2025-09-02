import { showMessage, applyColorScheme } from "./utils";

const darkModeQuery = window.matchMedia("(prefers-color-scheme: dark)");

darkModeQuery.addEventListener("change", (e) => {
  const newScheme = e.matches ? "dark" : "light";
  applyColorScheme(newScheme);
  showMessage(`Farbmodus gewechselt zu ${newScheme}!`);
});

setTimeout(() => {
  showMessage(
    `Das bevorzugte Farbschema ist ${
      darkModeQuery.matches ? "dunkel" : "hell"
    }!`,
    1000
    // "Connected with TypeScript!"
  );
}, 50);

function toggleColorScheme() {
  const currentScheme = document.body.classList.contains("dark")
    ? "dark"
    : "light";
  const newScheme = currentScheme === "dark" ? "light" : "dark";
  applyColorScheme(newScheme);
  showMessage(`Farbmodus gewechselt zu ${newScheme}!`);
}

function toggleParticles() {
  const canvas = document.getElementById("canvas") as HTMLCanvasElement;
  canvas.classList.toggle("hide");
}

document
  .getElementById("color-scheme-toggle")
  ?.addEventListener("click", toggleColorScheme);

document
  .getElementById("particleToggle")
  ?.addEventListener("click", toggleParticles);

document
  .getElementById("testButton")
  ?.addEventListener("click", () =>
    showMessage(
      "Eine sehr sehr lange Testnachricht mit einem Zeilenumbruch!",
      2000
    )
  );
