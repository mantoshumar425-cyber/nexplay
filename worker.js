const GAMEPIX_API =
  "https://feeds.gamepix.com/v2/json/?order=quality&page={PAGE}&pagination=12&sid=11ANT";

function cors() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Cache-Control": "public, max-age=60"
  };
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
      ...cors()
    }
  });
}

export default {
  async fetch(request) {
    const url = new URL(request.url);

    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: cors()
      });
    }

    if (url.pathname === "/api/health") {
      return json({
        success: true,
        service: "NEXTPLAY GamePix Proxy",
        online: true
      });
    }

    if (url.pathname === "/api/games") {
      const page = Math.max(
        1,
        parseInt(url.searchParams.get("page") || "1", 10)
      );

      const target = GAMEPIX_API.replace("{PAGE}", page);

      try {
        const response = await fetch(target, {
          headers: {
            "Accept": "application/json",
            "User-Agent": "NEXTPLAY/1.0"
          },
          cf: {
            cacheTtl: 60,
            cacheEverything: true
          }
        });

        if (!response.ok) {
          return json({
            success: false,
            error: "GamePix API error",
            status: response.status
          }, 502);
        }

        const data = await response.json();

        return json({
          success: true,
          page,
          items: Array.isArray(data.items) ? data.items : [],
          next_url: data.next_url || null,
          last_page_url: data.last_page_url || null
        });

      } catch (error) {
        return json({
          success: false,
          error: "Could not connect to GamePix",
          message: error.message
        }, 502);
      }
    }

    return json({
      success: false,
      error: "NEXTPLAY endpoint not found"
    }, 404);
  }
};
