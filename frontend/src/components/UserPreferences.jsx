// src/components/UserPreferences.jsx
import { useState, useEffect } from "react";
import { Auth } from "aws-amplify";
import { apiService } from "../services/api";

const UserPreferences = () => {
  const [preferences, setPreferences] = useState({
    keywords: [],
    portals: [],
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const availablePortals = [
    { id: "linkedin", name: "LinkedIn" },
    { id: "indeed", name: "Indeed" },
    { id: "glassdoor", name: "Glassdoor" },
    { id: "catho", name: "Catho" },
    { id: "infojobs", name: "InfoJobs" },
  ];

  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    try {
      const user = await Auth.currentAuthenticatedUser();
      const userId = user.attributes.sub;

      const data = await apiService.getPreferences(userId);

      if (data.preferences) {
        setPreferences({
          keywords: data.preferences.keywords || [],
          portals: data.preferences.portals || [],
        });
      }
    } catch (error) {
      console.error("Erro ao carregar preferências:", error);
    }
  };

  const handleKeywordsChange = (e) => {
    const keywordsArray = e.target.value
      .split(",")
      .map((keyword) => keyword.trim())
      .filter((keyword) => keyword.length > 0);

    setPreferences((prev) => ({
      ...prev,
      keywords: keywordsArray,
    }));
  };

  const handlePortalChange = (portalId, isChecked) => {
    setPreferences((prev) => {
      const newPortals = isChecked
        ? [...prev.portals, portalId]
        : prev.portals.filter((p) => p !== portalId);

      return { ...prev, portals: newPortals };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const user = await Auth.currentAuthenticatedUser();
      const userId = user.attributes.sub;

      await apiService.savePreferences(userId, preferences);
      setMessage("Preferências salvas com sucesso!");
    } catch (error) {
      setMessage("Erro ao salvar preferências: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="preferences-section">
      <h3>Suas Preferências de Vagas</h3>

      <form onSubmit={handleSubmit} className="preferences-form">
        <div className="form-group">
          <label>Palavras-chave (separadas por vírgula)</label>
          <input
            type="text"
            placeholder="javascript, react, node.js, python"
            value={preferences.keywords.join(", ")}
            onChange={handleKeywordsChange}
          />
          <small>
            Digite as tecnologias, cargos ou habilidades que procura
          </small>
        </div>

        <div className="form-group">
          <label>Portais de busca</label>
          <div className="checkboxes">
            {availablePortals.map((portal) => (
              <label key={portal.id} className="checkbox-label">
                <input
                  type="checkbox"
                  checked={preferences.portals.includes(portal.id)}
                  onChange={(e) =>
                    handlePortalChange(portal.id, e.target.checked)
                  }
                />
                {portal.name}
              </label>
            ))}
          </div>
        </div>

        {message && (
          <div
            className={`message ${message.includes("sucesso") ? "success" : "error"}`}
          >
            {message}
          </div>
        )}

        <button type="submit" className="save-btn" disabled={loading}>
          {loading ? "Salvando..." : "Salvar Preferências"}
        </button>
      </form>
    </div>
  );
};

export default UserPreferences;
