/* open the archetype named in the URL hash */
(function () {
  function openHash() {
    var id = location.hash.slice(1); if (!id) return;
    var el = document.getElementById(id);
    if (el && el.tagName === "DETAILS") { el.open = true; setTimeout(function () { el.scrollIntoView({ block: "start" }); }, 60); }
  }
  openHash(); window.addEventListener("hashchange", openHash);
})();
