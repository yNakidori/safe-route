const errorMessages = {
  "auth/invalid-credential": "As credenciais fornecidas são inválidas.",
  "auth/email-already-in-use": "Este email já está em uso.",
  "auth/invalid-email": "Email inválido.",
  "auth/user-not-found": "Usuário não encontrado.",
  "auth/wrong-password": "Senha incorreta.",
  "auth/too-many-requests": "Muitas tentativas. Tente novamente mais tarde.",
  "auth/network-request-failed": "Falha na conexão. Verifique sua internet.",
  "auth/weak-password": "A senha é muito fraca.",
};

const firebaseErrorsMessages = (error) => {
  if (!error || !error.code) {
    return "Ocorreu um erro inesperado.";
  }
  return errorMessages[error.code] || "Erro desconhecido.";
};

export default firebaseErrorsMessages;
