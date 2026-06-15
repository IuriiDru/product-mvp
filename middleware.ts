import { NextRequest, NextResponse } from "next/server";

// Защита админки (/admin) — там видны персональные данные из заявок (имена,
// телефоны, компании), поэтому страница закрыта HTTP Basic Auth.
// Логин и пароль берутся ТОЛЬКО из переменных окружения ADMIN_USER / ADMIN_PASSWORD
// и никогда не хранятся в коде. Если переменные не заданы — доступ закрыт (fail-closed),
// а не открыт.
export const config = {
  matcher: ["/admin", "/admin/:path*"],
};

// Сравнение в постоянном времени, чтобы не давать подсказок по времени ответа.
function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

function unauthorized(): NextResponse {
  return new NextResponse("Требуется авторизация.", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Univeige Admin", charset="UTF-8"',
    },
  });
}

export function middleware(req: NextRequest): NextResponse {
  const user = process.env.ADMIN_USER;
  const pass = process.env.ADMIN_PASSWORD;

  // Админка не настроена — закрываем доступ, а не открываем его.
  if (!user || !pass) {
    return new NextResponse(
      "Админка не настроена. Задайте переменные окружения ADMIN_USER и ADMIN_PASSWORD.",
      { status: 503 },
    );
  }

  const header = req.headers.get("authorization");
  if (header && header.startsWith("Basic ")) {
    let decoded = "";
    try {
      decoded = atob(header.slice(6));
    } catch {
      decoded = "";
    }
    const sep = decoded.indexOf(":");
    if (sep >= 0) {
      const u = decoded.slice(0, sep);
      const p = decoded.slice(sep + 1);
      // Оба сравнения выполняем всегда, чтобы не ветвиться по первому несовпадению.
      const okUser = safeEqual(u, user);
      const okPass = safeEqual(p, pass);
      if (okUser && okPass) {
        return NextResponse.next();
      }
    }
  }

  return unauthorized();
}
