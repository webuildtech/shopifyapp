import { register } from "@shopify/web-pixels-extension";

register(async ({ configuration, analytics, browser, settings }) => {
  let sessionId = await browser.sessionStorage.getItem("sessionId");

  // if session id is not set, set it
  if (!sessionId) {
    // random string
    const newSessionId =
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15);
    await browser.sessionStorage.setItem("sessionId", newSessionId);
    sessionId = newSessionId;
  } else {
    // if session id is set, get it
    sessionId = await browser.sessionStorage.getItem("sessionId");
  }


  console.log(sessionId);

  console.log("AI Upsello - Pixel Initialized");
  // subscribe to events
  analytics.subscribe("all_events", async (event) => {
    try {
      event.sessionId = sessionId;
      const response = await fetch(
        `${settings.host}/api/analytics?shop=${settings.shop}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "text/plain",
          },
          body: JSON.stringify(event),
        }
      );
    } catch (e) {
      console.log(e);
    }
  });
});
