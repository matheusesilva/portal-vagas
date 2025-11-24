// src/App.js
import { useState, useEffect } from "react";
import { Auth } from "aws-amplify";
import CustomLogin from "./components/CustomLogin.jsx";
import "./App.css";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Verifica se usuário está logado
  useEffect(() => {
    checkAuthState();
  }, []);

  const checkAuthState = async () => {
    try {
      const currentUser = await Auth.currentAuthenticatedUser();
      setUser(currentUser);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSuccess = (user) => {
    setUser(user);
  };

  const handleLogout = async () => {
    try {
      await Auth.signOut();
      setUser(null);
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div>Carregando...</div>
      </div>
    );
  }

  if (!user) {
    return <CustomLogin onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="dashboard">
      <header className="header">
        <h1>Portal de Vagas</h1>
        <button onClick={handleLogout} className="logout-btn">
          Sair
        </button>
      </header>

      <main className="main-content">
        <div className="user-info">
          <h2>Bem-vindo!</h2>
          <p>
            <strong>Email:</strong> {user.attributes?.email}
          </p>
          <p>
            <strong>Nome:</strong>{" "}
            {user.attributes?.given_name || "Não informado"}
          </p>
        </div>

        <div className="preferences-section">
          <h3>Suas Preferências de Vagas</h3>
          <form className="preferences-form">
            <div className="form-group">
              <label>Palavras-chave (separadas por vírgula)</label>
              <input type="text" placeholder="javascript, react, node.js" />
            </div>

            <div className="form-group">
              <label>Portais de busca</label>
              <div className="checkboxes">
                <label>
                  <input type="checkbox" /> LinkedIn
                </label>
                <label>
                  <input type="checkbox" /> Indeed
                </label>
                <label>
                  <input type="checkbox" /> Glassdoor
                </label>
              </div>
            </div>

            <button type="submit" className="save-btn">
              Salvar Preferências
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}

export default App;
