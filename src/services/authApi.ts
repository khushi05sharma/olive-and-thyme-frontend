const API_URL = "http://localhost:5000/api/auth";

// what a user looks like when returned from backend
export interface AuthUser {
  id: string;
  name: string;
  email: string;
}

// what backend returns on signup/login
export interface AuthResponse {
  token: string;
  user: AuthUser;
}

// ----- SIGNUP --------
// calls POST /api/auth/signup
// returns token + user or throws error

export async function signupApi(
  name: string,
  email: string,
  password: string,
): Promise<AuthResponse> {
  const response = await fetch(`${API_URL}/signup`, {
    method: "POST",
    headers: {
      "content-type": "application/json", // tell backend we're sending JSON
    },
    body: JSON.stringify({ name, email, password }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to sign up");
  }

  return data; // { token, user }
}

// ----- LOGIN --------
// calls POST /api/auth/login
// returns token + user or throws error

export async function loginApi(
  email: string,
  password: string,
): Promise<AuthResponse> {
  const response = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to log in");
  }

  return data; // { token, user }
}

// ----- GET CURRENT USER -------
// calls GET /api/auth/me
// used on app load to check if saved token is still valid

export async function getMeApi(token: string): Promise<AuthUser> {
  const response = await fetch(`${API_URL}/me`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`, // send token in header
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "session expired, please log in again");
  }

  return data; // { id, name, email }
}
