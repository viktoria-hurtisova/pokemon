(function (global) {
  "use strict";

  function normalizeState(v) {
    if (v === true || v === "owned") return "owned";
    if (v === "ontheway") return "ontheway";
    return "";
  }

  function countFromMap(map, totalCards) {
    let owned = 0;
    let ontheway = 0;
    for (const v of Object.values(map || {})) {
      const s = normalizeState(v);
      if (s === "owned") owned++;
      else if (s === "ontheway") ontheway++;
    }
    const missing = Math.max(0, totalCards - owned - ontheway);
    return { owned, ontheway, missing, total: totalCards };
  }

  async function loadListProgress(listId) {
    const url = "./progress/" + listId + ".json";
    try {
      const res = await fetch(url, { cache: "no-store" });
      if (!res.ok) return {};
      const data = await res.json();
      if (data && typeof data === "object" && !Array.isArray(data)) return data;
    } catch (_) {}
    return {};
  }

  async function saveListProgress(listId, map) {
    try {
      const res = await fetch("./api/progress/" + encodeURIComponent(listId), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(map),
      });
      return res.ok;
    } catch (_) {
      return false;
    }
  }

  global.PokeProgress = {
    normalizeState,
    countFromMap,
    loadListProgress,
    saveListProgress,
  };
})(window);
