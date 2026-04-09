const API_URL = "https://localhost:5000/api/auth";

// what a user looks like when returned from backend
export interface authUser {
  id: string;
  name: string;
  email: string;
}

// what backend returns on signup/login
export interface authResponse {
  token: string;
  user: authUser;
}

// ----- SIGNUP --------
// calls POST /api/auth/signup
// returns token + user or throws error

export async function signupApi(
  name: string,
  email: string,
  password: string,
): Promise<authResponse> {
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
): Promise<authResponse> {
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
