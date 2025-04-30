// WARNING: Hardcoding the API key is insecure for production. For production,
// proxy requests through a backend server to hide the key. See documentation for details.
// The current key has been exposed publicly and should be revoked and replaced.
const GEMINI_API_KEY = "AIzaSyB2D8GAgMPTi0xV9l7s57dg9AEpxD_mxHY"; // Replace with a new key after revoking
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";
const DEFAULT_TIMEOUT = 30000;

export interface GeminiResponse {
  text: string;
  error?: string;
  statusCode?: number;
}

export const generateGeminiResponse = async (prompt: string): Promise<GeminiResponse> => {
  if (!prompt) {
    return { text: "No prompt provided.", error: "invalid_prompt" };
  }

  try {
    console.log("Initiating Gemini API call with prompt:", prompt);
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT);

    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1024,
        },
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    const data = await response.json();
    console.log("Gemini API response:", data);

    if (!response.ok || data.error) {
      const errorMessage = data.error?.message || "Unknown error";
      const statusCode = response.status;
      console.error("Gemini API error:", { statusCode, errorMessage });

      if (statusCode === 401 || statusCode === 403) {
        return { text: "Invalid Gemini API key.", error: "authentication_error", statusCode };
      } else if (statusCode === 429) {
        return { text: "Gemini rate limit exceeded. Please try again later.", error: "rate_limit_exceeded", statusCode };
      }
      return { text: "Error processing Gemini request.", error: errorMessage, statusCode };
    }

    if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
      return { text: data.candidates[0].content.parts[0].text };
    }
    return { text: "No valid response from Gemini.", error: "no_content" };
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof Error && error.name === "AbortError") {
      return { text: "Gemini request timed out.", error: "timeout" };
    }
    return { text: "Failed to connect to Gemini. Please check your network.", error: error instanceof Error ? error.message : String(error) };
  }
};