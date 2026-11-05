/**
 * Show/hide "Scroll to top" button.
 *
 * In your layout.html:
 *
 * 1. Mark container with button with `id="scroll-to-top"`.
 * 2. Add before the closing </body> tag:
 *    ````html
 *    <script defer src="{{ pathto('_static/scripts/scroll-to-top.js', 1) }}"></script>
 *    ````
 *
 *    (`defer` downloads script in parallel but executes it in order after HTML parsing, before DOMContentReady. Perfect for scripts that need to access the DOM)
 */
document.addEventListener("DOMContentLoaded", function () {
  const scrollToTopButton = document.getElementById("scroll-to-top");
  const rootElement = document.documentElement;
  window.addEventListener("scroll", function () {
    // Show button if scrolled down more than one viewport height
    if (rootElement.scrollTop > rootElement.clientHeight) {
      scrollToTopButton.classList.remove("hidden");
    } else {
      scrollToTopButton.classList.add("hidden");
    }
  });
});
