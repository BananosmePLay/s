// --- Настройки ---
const VALID_KEYS = {
  "ABC123": { user: "Bananosme_Play", expires: "2025-12-31" },
  "XYZ789": { user: "TestUser", expires: "2026-01-01" }
  // Добавляй сюда новые ключи
};

// --- Основной обработчик ---
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // Только GET-запросы
    if (request.method !== "GET") {
      return new Response(JSON.stringify({ error: "Method not allowed" }), {
        status: 405,
        headers: { "Content-Type": "application/json" }
      });
    }

    // Маршрутизация
    if (url.pathname === "/check") {
      const key = url.searchParams.get("key");
      if (!key) {
        return new Response(JSON.stringify({ valid: false, error: "Missing 'key' parameter" }), {
          status: 400,
          headers: { "Content-Type": "application/json" }
        });
      }

      const license = VALID_KEYS[key];
      if (license) {
        // Можно добавить проверку срока действия
        const today = new Date().toISOString().split("T")[0];
        if (license.expires >= today) {
          return new Response(JSON.stringify({ valid: true, user: license.user }), {
            headers: { "Content-Type": "application/json" }
          });
        }
      }

      return new Response(JSON.stringify({ valid: false, error: "Invalid or expired license key" }), {
        status: 403,
        headers: { "Content-Type": "application/json" }
      });
    }

    // 404 для других путей
    return new Response(JSON.stringify({ error: "Not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" }
    });
  }
};
