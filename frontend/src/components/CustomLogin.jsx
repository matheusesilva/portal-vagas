// src/components/CustomLogin.jsx
import { useState } from "react";
import { Auth } from "aws-amplify";
import "./CustomLogin.css";

const CustomLogin = ({ onLoginSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [needsConfirmation, setNeedsConfirmation] = useState(false);
  const [confirmationCode, setConfirmationCode] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // LOGIN REAL - sem redirecionamento
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const user = await Auth.signIn(formData.email, formData.password);
      console.log("Login bem-sucedido:", user);
      onLoginSuccess(user);
    } catch (error) {
      setMessage(error.message || "Erro ao fazer login");
    } finally {
      setLoading(false);
    }
  };

  // CADASTRO REAL - sem redirecionamento
  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    if (formData.password !== formData.confirmPassword) {
      setMessage("Senhas não conferem");
      setLoading(false);
      return;
    }

    try {
      const { user } = await Auth.signUp({
        username: formData.email,
        password: formData.password,
        attributes: {
          email: formData.email,
          given_name: formData.name,
        },
      });
      setMessage(
        "Cadastro realizado! Verifique seu email para o código de confirmação.",
      );
      setNeedsConfirmation(true);
    } catch (error) {
      setMessage(error.message || "Erro ao criar conta");
    } finally {
      setLoading(false);
    }
  };

  // CONFIRMAR CADASTRO
  const handleConfirmation = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await Auth.confirmSignUp(formData.email, confirmationCode);
      setMessage("Email confirmado com sucesso! Faça login.");
      setNeedsConfirmation(false);
      setIsLogin(true);
    } catch (error) {
      setMessage(error.message || "Erro ao confirmar código");
    } finally {
      setLoading(false);
    }
  };

  // Tela de confirmação de email
  if (needsConfirmation) {
    return (
      <div className="custom-login-container">
        <div className="custom-login-card">
          <div className="login-header">
            <h1>Confirmar Email</h1>
            <p>Enviamos um código para: {formData.email}</p>
          </div>

          <form onSubmit={handleConfirmation} className="login-form">
            <div className="form-group">
              <label>Código de verificação</label>
              <input
                type="text"
                value={confirmationCode}
                onChange={(e) => setConfirmationCode(e.target.value)}
                placeholder="Digite o código recebido por email"
                required
              />
            </div>

            {message && (
              <div
                className={`message ${message.includes("sucesso") ? "success" : "error"}`}
              >
                {message}
              </div>
            )}

            <button type="submit" disabled={loading} className="submit-btn">
              {loading ? "Confirmando..." : "Confirmar Email"}
            </button>
          </form>

          <div className="login-footer">
            <button
              type="button"
              className="toggle-link"
              onClick={() => setNeedsConfirmation(false)}
            >
              ← Voltar
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Tela principal de login/cadastro
  return (
    <div className="custom-login-container">
      <div className="custom-login-card">
        <div className="login-header">
          <h1>Portal de Vagas</h1>
          <p>{isLogin ? "Entre na sua conta" : "Crie sua conta"}</p>
        </div>

        <form
          onSubmit={isLogin ? handleLogin : handleSignUp}
          className="login-form"
        >
          {!isLogin && (
            <div className="form-group">
              <label>Nome completo</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Seu nome completo"
                required
              />
            </div>
          )}

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="seu@email.com"
              required
            />
          </div>

          <div className="form-group">
            <label>Senha</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Sua senha"
              required
            />
          </div>

          {!isLogin && (
            <div className="form-group">
              <label>Confirmar senha</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirme sua senha"
                required
              />
            </div>
          )}

          {message && (
            <div
              className={`message ${message.includes("sucesso") ? "success" : "error"}`}
            >
              {message}
            </div>
          )}

          <button type="submit" disabled={loading} className="submit-btn">
            {loading ? "Carregando..." : isLogin ? "Entrar" : "Cadastrar"}
          </button>
        </form>

        <div className="login-footer">
          <p>
            {isLogin ? "Não tem conta?" : "Já tem conta?"}
            <span className="toggle-link" onClick={() => setIsLogin(!isLogin)}>
              {isLogin ? " Cadastre-se" : " Fazer login"}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default CustomLogin;
