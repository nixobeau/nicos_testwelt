import { GooglePage } from './pages/Google';
import { GoogleButton1Page } from './pages/google/GoogleButton1';
import { GoogleButton2Page } from './pages/google/GoogleButton2';
import { GoogleButton3Page } from './pages/google/GoogleButton3';
import { GoogleButton4Page } from './pages/google/GoogleButton4';
import { GoogleButton5Page } from './pages/google/GoogleButton5';
import { GoogleButton6Page } from './pages/google/GoogleButton6';
import { GoogleButton7Page } from './pages/google/GoogleButton7';
import { GoogleButton8Page } from './pages/google/GoogleButton8';

class App {
  private appElement: HTMLElement;
  private currentPage: 'home' | 'google' | 'google-button' = 'home';
  private currentButtonPage?: number;

  constructor() {
    const app = document.getElementById('app');
    if (!app) {
      throw new Error('App element not found');
    }
    this.appElement = app;
  }

  init(): void {
    this.renderHome();
  }

  private renderHome(): void {
    this.appElement.innerHTML = '';
    this.currentPage = 'home';
    
    const wrapper = document.createElement('div');
    wrapper.style.cssText = `
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      padding: 20px;
    `;

    const title = document.createElement('h1');
    title.textContent = "Nico's Testwelt";
    title.style.cssText = `
      color: white;
      font-size: 4rem;
      margin-bottom: 3rem;
      text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
    `;

    const container = document.createElement('div');
    container.className = 'button-container';

    // First button: Google
    const googleButton = document.createElement('button');
    googleButton.textContent = 'Google';
    googleButton.id = 'btn-1';
    googleButton.addEventListener('click', () => this.goToGoogle());
    container.appendChild(googleButton);

    // Buttons 2-8: nicht zugewiesen
    for (let i = 2; i <= 8; i++) {
      const button = document.createElement('button');
      button.textContent = 'nicht zugewiesen';
      button.id = `btn-${i}`;
      container.appendChild(button);
    }

    wrapper.appendChild(title);
    wrapper.appendChild(container);
    this.appElement.appendChild(wrapper);
  }

  private renderGoogle(): void {
    this.appElement.innerHTML = '';
    this.currentPage = 'google';

    const googlePage = new GooglePage();
    googlePage.onButtonClick = (buttonNumber: number) => this.goToGoogleButton(buttonNumber);
    const pageElement = googlePage.render();
    this.appElement.appendChild(pageElement);

    // Back button listener
    const backButton = document.getElementById('google-btn-back');
    if (backButton) {
      backButton.addEventListener('click', () => this.renderHome());
    }
  }

  private goToGoogle(): void {
    this.renderGoogle();
  }

  private goToGoogleButton(buttonNumber: number): void {
    this.appElement.innerHTML = '';
    this.currentPage = 'google-button';
    this.currentButtonPage = buttonNumber;

    const pageClasses = [
      GoogleButton1Page,
      GoogleButton2Page,
      GoogleButton3Page,
      GoogleButton4Page,
      GoogleButton5Page,
      GoogleButton6Page,
      GoogleButton7Page,
      GoogleButton8Page,
    ];

    const PageClass = pageClasses[buttonNumber - 1];
    const page = new PageClass();
    const pageElement = page.render();
    this.appElement.appendChild(pageElement);

    // Back button listener
    const backButton = document.getElementById(`google-btn-${buttonNumber}-back`);
    if (backButton) {
      backButton.addEventListener('click', () => this.renderGoogle());
    }
  }
}

const app = new App();
app.init();
