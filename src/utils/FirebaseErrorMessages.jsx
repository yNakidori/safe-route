const errorMessages = {
  "auth/invalid-credential": "As credenciais fornecidas são inválidas.",
  "auth/email-already-in-use": "Este email já está em uso.",
  "auth/invalid-email": "Email inválido.",
  "auth/user-not-found": "Usuário não encontrado.",
  "auth/wrong-password": "Senha incorreta.",
  "auth/too-many-requests": "Muitas tentativas. Tente novamente mais tarde.",
  "auth/network-request-failed": "Falha na conexão. Verifique sua internet.",
  "auth/weak-password": "A senha é muito fraca.",
  
  "auth/account-exists-with-different-credential": "Este email já está associado a outra conta. Use o método de login original ou vincule as contas.",
  "auth/popup-closed-by-user": "O login foi cancelado. A janela de autenticação foi fechada antes de completar.",
  "auth/cancelled-popup-request": "O login foi cancelado. Outra solicitação de login está em andamento.",
  "auth/popup-blocked": "O popup de autenticação foi bloqueado pelo navegador. Permita popups para este site e tente novamente.",
  "auth/unauthorized-domain": "Este domínio não está autorizado para autenticação. Entre em contato com o suporte.",
  "auth/operation-not-allowed": "Este método de login não está habilitado. Entre em contato com o suporte.",
  "auth/user-cancelled": "O login foi cancelado pelo usuário.",
  "auth/credential-already-in-use": "Esta credencial já está associada a outra conta.",
  "auth/invalid-oauth-provider": "Provedor de autenticação inválido.",
  "auth/invalid-oauth-client-id": "ID do cliente OAuth inválido.",
};

const firebaseErrorsMessages = (error) => {
  if (!error || !error.code) {
    return "Ocorreu um erro inesperado.";
  }
  return errorMessages[error.code] || "Erro desconhecido.";
};

export default firebaseErrorsMessages;
