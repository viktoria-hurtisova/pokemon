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

  /**
   * Per-slot stats for lists where some cards are "expensive": they do not count
   * toward total / owned / on the way / not yet until marked owned or on the way.
   * @param {Record<string, unknown>} map progress keyed by card id
   * @param {Array<string | { id: string, expensive?: boolean }>} slots ordered card ids
   */
  function countFromCardSlots(map, slots) {
    if (!slots || !slots.length) {
      return { owned: 0, ontheway: 0, missing: 0, total: 0 };
    }
    const m = map || {};
    let owned = 0;
    let ontheway = 0;
    let total = 0;
    for (let i = 0; i < slots.length; i++) {
      const slot = slots[i];
      const id = typeof slot === "string" ? slot : slot.id;
      const expensive = typeof slot === "object" && slot && slot.expensive;
      const s = normalizeState(m[id]);
      if (expensive) {
        if (s === "owned") {
          owned++;
          total++;
        } else if (s === "ontheway") {
          ontheway++;
          total++;
        }
      } else {
        total++;
        if (s === "owned") owned++;
        else if (s === "ontheway") ontheway++;
      }
    }
    const missing = Math.max(0, total - owned - ontheway);
    return { owned, ontheway, missing, total };
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
    countFromCardSlots,
    loadListProgress,
    saveListProgress,
  };
})(window);
