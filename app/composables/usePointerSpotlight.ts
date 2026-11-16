import { onBeforeUnmount, onMounted } from "vue";

// Writes the cursor position onto whichever [data-spotlight] element is under it,
// so the shared CSS can draw a soft glow that follows the pointer.
export function usePointerSpotlight() {
  const onMove = (event: PointerEvent) => {
    const target = (event.target as HTMLElement | null)?.closest?.<HTMLElement>("[data-spotlight]");
    if (!target) return;
    const rect = target.getBoundingClientRect();
    target.style.setProperty("--mx", `${event.clientX - rect.left}px`);
    target.style.setProperty("--my", `${event.clientY - rect.top}px`);
  };

  let bound = false;

  onMounted(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    document.addEventListener("pointermove", onMove, { passive: true });
    bound = true;
  });

  onBeforeUnmount(() => {
    if (bound) document.removeEventListener("pointermove", onMove);
  });
}
