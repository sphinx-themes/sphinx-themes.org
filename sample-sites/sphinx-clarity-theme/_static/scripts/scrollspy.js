/**
 * Scrollspy functionality using IntersectionObserver API
 * Highlights the current section in the Table of Contents (ToC)
 * as the user scrolls through the document.
 *
 * Configuration options HAVE TO be set via `window.clarityScrollspyConfig`.
 *
 * Example usage in layout.html:
 *
 * <script>
 *    window.ScrollspyConfig = {
 *      rootMargin: "-150px 0px -50% 0px", // Adjust based on header height
 *    };
 *  </script>
 *  <script
 *    defer
 *    src="{{ pathto('_static/scripts/scrollspy.js', 1) }}"
 *  ></script>
 */

document.addEventListener("DOMContentLoaded", () => {
  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      const id = entry.target.getAttribute("id");
      const tocLink = document.querySelector(`.local-toc a[href="#${id}"]`);

      if (entry.isIntersecting) {
        // Remove active from all toc links
        document
          .querySelectorAll(".local-toc a")
          .forEach((link) => link.classList.remove("active"));
        // Add active to the current one
        if (tocLink) {
          tocLink.classList.add("active");
        }
      }
    }
  }, window.clarityScrollspyConfig);

  // Track all sections that have an `id` applied
  document.querySelectorAll("section[id]").forEach((section) => {
    observer.observe(section);
  });
});
