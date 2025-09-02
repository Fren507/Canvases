export function showMessage(message: string, time: number = 1500) {
  console.log('Showing message: "' + message + '"');

  let el = document.getElementById("message");
  let nav = document.querySelector("nav");
  let nav_left = document
    .getElementsByClassName("menu-left")
    .item(0) as HTMLElement;
  let nav_right = document
    .getElementsByClassName("menu-right")
    .item(0) as HTMLElement;

  if (!el) {
    el = document.createElement("div");
    el.id = "message";
    document.body.appendChild(el);
  }

  const audio = new Audio("/assets/sounds/pop.mp3");
  audio.volume = 1; // Lautstärke max
  audio
    .play()
    .catch((e) => console.warn("Audio konnte nicht abgespielt werden:", e));
  console.log("Sound wurde abgespielt!");

  el.textContent = message;
  el.classList.remove("hide");
  el.classList.add("show");
  setTimeout(() => {
    if (nav) {
      nav.classList.remove("menu");
      nav.classList.add("cut");

      if (nav_left && nav_right) {
        const alert_width = el.offsetWidth;
        nav_left.classList.add("menu");
        nav_right.classList.add("menu");

        nav_left.style.maxWidth = `calc(50% - ${alert_width / 2}px - 30px)`;
        nav_right.style.maxWidth = `calc(50% - ${alert_width / 2}px - 30px)`;
      }
    }
  }, 100);

  setTimeout(() => {
    el.classList.remove("show");
    el.classList.add("hide");
    el.textContent = "";

    if (nav) {
      nav.classList.remove("menu");
      nav.classList.add("menu");

      if (nav_left && nav_right) {
        nav_left.classList.remove("menu");
        nav_right.classList.remove("menu");
      }
    }
  }, time);
}

export function applyColorScheme(scheme: "light" | "dark") {
  if (scheme === "dark") {
    document.body.classList.remove("light");
    document.body.classList.add("dark");
  } else {
    document.body.classList.remove("dark");
    document.body.classList.add("light");
  }
}
