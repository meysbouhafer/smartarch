import { useEffect } from "react";

export function useReveal() {
  useEffect(() => {
    const check = () =>
      document.querySelectorAll(".sa-r:not(.v)").forEach((el) => {
        if (el.getBoundingClientRect().top < window.innerHeight - 50) {
          el.classList.add("v");
        }
      });

    check();
    window.addEventListener("scroll", check, { passive: true });
    return () => window.removeEventListener("scroll", check);
  }, []);
}
