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

// ----- CREATE RECIPE ---------

export async function createRecipeApi(
  recipeData: {
    title: string;
    description: string;
    image: string;
    cookingTime: number;
    servings: number;
    difficulty: string;
    cuisine: string;
    mealType: string;
    diet: string[];
    ingredients: string[];
    instructions: string[];
  },
  token: string,
): Promise<{
  recipe: { _id: string; title: string; author: { id: string; name: string } };
}> {
  const response = await fetch("http://localhost:5000/api/recipes", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(recipeData),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Failed to create recipe");
  return data;
}

// -------- GET MY RECIPES ----------

export async function getMyRecipesApi(token: string): Promise<{
  recipes: {
    _id: string;
    title: string;
    description: string;
    image: string;
    cookingTime: number;
    servings: number;
    difficulty: string;
    cuisine: string;
    mealType: string;
    diet: string[];
    ingredients: string[];
    instructions: string[];
    likes: number;
    author: { id: string; name: string };
    createdAt: string;
  }[];
}> {
  const response = await fetch("http://localhost:5000/api/recipes/my", {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Failed to fetch recipes");
  return data;
}

// -------- GET SINGLE RECIPE BY ID ----------

export async function getRecipeByIdApi(id: string) {
  const response = await fetch(`http://localhost:5000/api/recipes/${id}`);

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch recipe");
  }

  return data;
}

// ---- UPDATE/EDIT RECIPE -------

export async function updateRecipeApi(
  recipeId: string,
  recipeData: any,
  token: string,
): Promise<{ recipe: any }> {
  const response = await fetch(
    `http://localhost:5000/api/recipes/${recipeId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(recipeData),
    },
  );
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Failed to update recipe");

  return data;
}

// ----- DELETE RECIPE -------

export async function deleteRecipeApi(
  recipeId: string,
  token: string,
): Promise<void> {
  const response = await fetch(
    `http://localhost:5000/api/recipes/${recipeId}`,
    {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    },
  );

  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Failed to delete recipe");
}

// ----------- GET NOTIFICATIONS ----------

export async function getNotificationsApi(token: string): Promise<{
  notifications: {
    _id: string;
    recipientId: string;
    actorId: string;
    actorName: string;
    type: "like" | "comment";
    recipeId: string;
    recipeTitle: string;
    message: string;
    read: boolean;
    createdAt: string;
  }[];
  unreadCount: number;
}> {
  const response = await fetch("http://localhost:5000/api/notifications", {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message);
  return data;
}

// ------ MARK ONE READ ----
export async function markNotificationReadApi(
  notificationId: string,
  token: string,
): Promise<void> {
  await fetch(
    `http://localhost:5000/api/notifications/${notificationId}/read`,
    { method: "PATCH", headers: { Authorization: `Bearer ${token}` } },
  );
}

// ----- MARK ALL READ -----------
export async function markAllNotificationsReadApi(
  token: string,
): Promise<void> {
  await fetch("http://localhost:5000/api/notifications/read-all", {
    method: "PATCH",
    headers: { Authorization: `Bearer ${token}` },
  });
}

// ----- DELETE NOTIFICATION ---
export async function deleteNotificationApi(
  notificationId: string,
  token: string,
): Promise<void> {
  await fetch(`http://localhost:5000/api/notifications/${notificationId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
}
