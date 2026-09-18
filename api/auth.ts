export type AuthUser = {
  id: string;
  name: string;
  email: string;
};

const FAKE_LATENCY_MS = 900;

function delay<T>(value: T, ms = FAKE_LATENCY_MS): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

/**
 * Mock auth backend, shaped exactly like a real one (Firebase Auth, or any
 * REST endpoint) would be: async, network-latency-shaped, can reject with a
 * real error. No account is created anywhere and no credentials leave this
 * device — swapping in a real provider later only means rewriting the
 * insides of these three functions.
 */
export async function loginRequest(email: string, password: string): Promise<AuthUser> {
  await delay(null);
  const trimmed = email.trim().toLowerCase();
  if (!trimmed.includes('@') || !trimmed.includes('.')) {
    throw new Error('Enter a valid email address.');
  }
  if (password.length < 4) {
    throw new Error('Incorrect email or password.');
  }
  return { id: 'u_' + trimmed, name: trimmed.split('@')[0], email: trimmed };
}

export async function signupRequest(
  name: string,
  email: string,
  password: string,
): Promise<AuthUser> {
  await delay(null);
  const trimmed = email.trim().toLowerCase();
  if (name.trim().length < 2) {
    throw new Error('Enter your name.');
  }
  if (!trimmed.includes('@') || !trimmed.includes('.')) {
    throw new Error('Enter a valid email address.');
  }
  if (password.length < 6) {
    throw new Error('Password must be at least 6 characters.');
  }
  return { id: 'u_' + trimmed, name: name.trim(), email: trimmed };
}

export async function requestPasswordReset(email: string): Promise<void> {
  await delay(null);
  const trimmed = email.trim().toLowerCase();
  if (!trimmed.includes('@') || !trimmed.includes('.')) {
    throw new Error('Enter a valid email address.');
  }
}
