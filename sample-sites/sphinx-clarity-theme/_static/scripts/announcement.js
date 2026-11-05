(function () {
  const root = document.documentElement;
  const banner = document.querySelector(".announcement");

  function setAnnouncementHeight() {
    root.style.setProperty(
      "--announcement-height",
      banner ? banner.offsetHeight + "px" : "0px",
    );
  }

  setAnnouncementHeight();
  window.addEventListener("resize", setAnnouncementHeight);

  // Close button
  // const closeBtn = document.getElementById("announcement__close");
  //   if (closeBtn) {
  //     closeBtn.addEventListener("click", function () {
  //       if (banner) banner.remove();
  //       setAnnouncementHeight();
  //     });
  //   }
})();
