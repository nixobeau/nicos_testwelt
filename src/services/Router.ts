export type PageType = 'home' | 'google' | 'google-button' | 'supabase' | 'supabase-button' | 'golfpost' | 'golfpost-button';

export interface RouterConfig {
  onNavigate: (page: PageType, params?: { buttonNumber?: number; buttonType?: 'google' | 'supabase' }) => void;
}

export class Router {
  private config: RouterConfig;

  constructor(config: RouterConfig) {
    this.config = config;
    this.setupEventListeners();
    this.handleInitialRoute();
  }

  private setupEventListeners(): void {
    // Handle back/forward buttons
    window.addEventListener('popstate', () => {
      this.handleRouteChange();
    });

    // Handle link clicks (delegated)
    document.addEventListener('click', (e: Event) => {
      const target = e.target as HTMLElement;
      const link = target.closest('a[data-route]');
      if (link) {
        e.preventDefault();
        const route = link.getAttribute('data-route');
        if (route) {
          this.navigate(route);
        }
      }
    });
  }

  private handleInitialRoute(): void {
    this.handleRouteChange();
  }

  private handleRouteChange(): void {
    const path = window.location.pathname;
    const route = this.parseRoute(path);
    if (route) {
      this.config.onNavigate(route.page, route.params);
    }
  }

  private parseRoute(pathname: string): { page: PageType; params?: any } | null {
    // Remove trailing slash
    const path = pathname.replace(/\/$/, '') || '/';

    if (path === '/') {
      return { page: 'home' };
    }

    if (path === '/google') {
      return { page: 'google' };
    }

    if (path.startsWith('/google/button/')) {
      const buttonNumber = parseInt(path.split('/').pop() || '0', 10);
      if (buttonNumber >= 1 && buttonNumber <= 8) {
        return { page: 'google-button', params: { buttonNumber, buttonType: 'google' } };
      }
    }

    if (path === '/supabase') {
      return { page: 'supabase' };
    }

    if (path.startsWith('/supabase/button/')) {
      const buttonNumber = parseInt(path.split('/').pop() || '0', 10);
      if (buttonNumber >= 1 && buttonNumber <= 8) {
        return { page: 'supabase-button', params: { buttonNumber, buttonType: 'supabase' } };
      }
    }

    if (path === '/golfpost') {
      return { page: 'golfpost' };
    }

    if (path.startsWith('/golfpost/button/')) {
      const buttonNumber = parseInt(path.split('/').pop() || '0', 10);
      if (buttonNumber >= 1 && buttonNumber <= 8) {
        return { page: 'golfpost-button', params: { buttonNumber, buttonType: 'golfpost' } };
      }
    }

    return null;
  }

  navigate(path: string, skipHistory: boolean = false): void {
    if (!skipHistory) {
      window.history.pushState(null, '', path);
    }
    this.handleRouteChange();
  }

  replaceState(path: string): void {
    window.history.replaceState(null, '', path);
  }

  getCurrentPath(): string {
    return window.location.pathname;
  }

  goBack(): void {
    window.history.back();
  }

  goForward(): void {
    window.history.forward();
  }
}
