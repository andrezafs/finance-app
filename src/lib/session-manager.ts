const TOKEN_KEY = "@finance:token";
const MAX_MINUTES_GAP = 5;

export type Session = {
  id: string;
  email: string;
  exp: Date;
};

export type GetTokenResult = {
  token: string | null;
  isValid: boolean;
};

class SessionManager {
  private session: Session | null = null;

  constructor() {
    const { token } = this.getToken();

    if (token) {
      this.session = this.parseToken(token);
    }
  }

  authenticate(token: string) {
    this.saveToken(token);
    this.session = this.parseToken(token);
  }

  logout() {
    this.removeToken();
    this.session = null;
  }

  getSession(): Session | null {
    return this.session;
  }

  getToken(): GetTokenResult {
    const token = localStorage.getItem(TOKEN_KEY);

    if (!token) {
      return {
        token: null,
        isValid: false,
      };
    }

    const session = this.parseToken(token);
    const isValid = this.isSessionValid(session);

    return {
      token,
      isValid,
    };
  }

  private parseToken(token: string): Session {
    const parsed: any = JSON.parse(atob(token.split(".")[1]));

    return {
      id: parsed.id,
      email: parsed.email,
      exp: new Date(parsed.exp * 1000),
    };
  }

  private saveToken(token: string) {
    localStorage.setItem(TOKEN_KEY, token);
  }

  private removeToken() {
    localStorage.removeItem(TOKEN_KEY);
  }

  private isSessionValid(session: Session): boolean {
    const now = new Date();
    const diff = session.exp.getTime() - now.getTime();
    const diffInMinutes = Math.round(diff / 60000);

    return diffInMinutes > MAX_MINUTES_GAP;
  }
}

export const sessionManager = new SessionManager();
