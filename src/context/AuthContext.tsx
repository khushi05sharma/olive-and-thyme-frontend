import {
  createContext,
  useContext,
  useState,
  useEffect,
  type FC,
  type ReactNode,
} from "react";
import {
  type AuthUser,
  getMeApi,
  getInteractionsApi,
} from "../services/authApi";

export interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  likedRecipes: string[];
  savedRecipes: string[];
  login: (token: string, user: AuthUser) => void;
  logout: () => void;
  setLikedRecipes: (ids: string[]) => void;
  setSavedRecipes: (ids: string[]) => void;
}

// what we store in context about the user here undefined until we log in or restore login
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ----- AUTH PROVIDER ------
// this wraps whole app in main.tsx
// everything inside it can access AuthContext
export interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [likedRecipes, setLikedRecipes] = useState<string[]>([]);
  const [savedRecipes, setSavedRecipes] = useState<string[]>([]);

  // ---- ON APP LOAD ---
  // when app starts, check if user was previously logged in
  // if token exists in localStorage - verify it's still valid
  // This keeps user logged in after page refresh

  useEffect(() => {
    const checkSavedLogin = async () => {
      const savedToken = localStorage.getItem("olive_token");

      if (!savedToken) {
        setIsLoading(false);
        return;
      }
      try {
        // verify token with backend — checks it's not expired
        const savedUser = await getMeApi(savedToken);
        setUser(savedUser);
        setToken(savedToken);
        const interactions = await getInteractionsApi(savedToken);
        setLikedRecipes(interactions.likedRecipes);
        setSavedRecipes(interactions.savedRecipes);
        console.log(`[Auth] restored login for ${savedUser.email}`);
      } catch (error) {
        localStorage.removeItem("olive_token");
        console.error("[Auth] Saved token invalid-cleared");
      } finally {
        setIsLoading(false);
      }
    };
    checkSavedLogin();
  }, []); // runs once when app first loads

  //loginApi() = ask backend to log in
  // login() = save that successful login in frontend

  const login = (newToken: string, newUser: AuthUser) => {
    localStorage.setItem("olive_token", newToken);
    setToken(newToken);
    setUser(newUser);
    console.log(`[Auth] logged in as ${newUser.email}`);
  };

  const logout = () => {
    localStorage.removeItem("olive_token");
    setToken(null);
    setUser(null);
    setLikedRecipes([]);
    setSavedRecipes([]);
    console.log("[AUTH] Logged out");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoggedIn: !!user, // !! converts user object to true, null to false
        isLoading,
        likedRecipes,
        savedRecipes,
        login,
        logout,
        setLikedRecipes,
        setSavedRecipes,
      }}
    >
      {/* while checking saved login - show nothing to avoid flash */}
      {isLoading ? (
        <div className="flex items-center justify-center min-h-screen">
          <div className="w-10 h-10 border-4 rounded-full border-primary border-t-transparent animate-spin" />
        </div>
      ) : (
        children // render whole app once we know login state
      )}
    </AuthContext.Provider>
  );
};

// ----------- CUSTOM HOOK -----------
// instead of writing useContext(AuthContext) everywhere
// components just write: const { user, isLoggedIn, login, logout } = useAuth()
// also throws error if used outside AuthProvider — catches mistakes early
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
};
