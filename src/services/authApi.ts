const API_URL = "http://localhost:5000/api/auth";

// what a user looks like when returned from backend
export interface AuthUser {
  id: string;
  name: string;
  email: string;
  createdAt?: string;
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

// --- Like Recipe ---

export async function likeRecipeApi(
  recipeId: string,
  token: string,
): Promise<{ liked: boolean; likedRecipes: string[] }> {
  const response = await fetch(
    `http://localhost:5000/api/users/like/${recipeId}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Failed to like recipe");
  return data;
}

// ---- Saved Recipes ----

export async function savedRecipeApi(
  recipeId: string,
  token: string,
): Promise<{ saved: boolean; savedRecipes: string[] }> {
  const response = await fetch(
    `http://localhost:5000/api/users/save/${recipeId}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Failed to save recipe");
  return data;
}

// --- Get User Interactions --------
export async function getInteractionsApi(
  token: string,
): Promise<{ likedRecipes: string[]; savedRecipes: string[] }> {
  const response = await fetch(
    "http://localhost:5000/api/users/me/interactions",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  const data = await response.json();
  if (!response.ok) throw new Error(data.message);
  return data;
}

// ------ Post Comment -------------

export async function postCommentApi(
  recipeId: string,
  text: string,
  token: string,
): Promise<{
  comment: {
    _id: string;
    recipeId: string;
    userId: string;
    userName: string;
    text: string;
    createdAt: string;
  };
}> {
  const response = await fetch(
    `http://localhost:5000/api/comments/${recipeId}`,
    {
      method: "POST",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ text }),
    },
  );

  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Failed to post comment");
  return data;
}

// ---- GET COMMENTS FOR A RECIPE --------

export async function getCommentsApi(recipeId: string): Promise<{
  comments: {
    _id: string;
    recipeId: string;
    userId: string;
    userName: string;
    text: string;
    createdAt: string;
  }[];
}> {
  const response = await fetch(
    `http://localhost:5000/api/comments/${recipeId}`,
  );

  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Failed to fetch comments");
  return data;
}

// -------- Delete Comment -----------

export async function deleteCommentApi(
  commentId: string,
  token: string,
): Promise<{ message: string }> {
  const response = await fetch(
    `http://localhost:5000/api/comments/${commentId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Failed to delete comment");
  return data;
}
