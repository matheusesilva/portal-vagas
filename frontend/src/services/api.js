// src/services/api.js
const API_URL =
  process.env.REACT_APP_API_URL ||
  "https://mnm2crc1wi.execute-api.us-east-1.amazonaws.com/prod";

export const apiService = {
  async getPreferences(userId) {
    const response = await fetch(
      `${API_URL}/preferences?userId=${encodeURIComponent(userId)}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.ok) {
      throw new Error("Erro ao buscar preferências");
    }

    return await response.json();
  },

  async savePreferences(userId, preferences) {
    const response = await fetch(`${API_URL}/preferences`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId,
        keywords: preferences.keywords,
        portals: preferences.portals,
      }),
    });

    if (!response.ok) {
      throw new Error("Erro ao salvar preferências");
    }

    return await response.json();
  },
};
