// Mock endpoints based on reference structure (replace with real endpoints later)

export async function mockLogin({ email, password }) {
  await delay(300);
  if (email === 'test@example.com' && password === 'Password1') {
    return { token: 'mock-token-123', user: { id: '1', email } };
  }
  const error = new Error('Invalid credentials');
  error.code = 'INVALID_CREDENTIALS';
  throw error;
}

export async function mockRegister({ email, password, accountType }) {
  await delay(300);
  return { id: String(Date.now()), email, accountType };
}

export async function mockRequestPasswordReset(email) {
  await delay(300);
  return { ok: true, resetToken: 'mock-reset-token' };
}

export async function mockResetPassword({ resetToken, newPassword }) {
  await delay(300);
  if (resetToken !== 'mock-reset-token') {
    const error = new Error('Invalid or expired reset token');
    error.code = 'INVALID_TOKEN';
    throw error;
  }
  return { ok: true };
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}


