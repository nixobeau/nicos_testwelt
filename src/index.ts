class App {
  private appElement: HTMLElement;

  constructor() {
    const app = document.getElementById('app');
    if (!app) {
      throw new Error('App element not found');
    }
    this.appElement = app;
  }

  init(): void {
    this.render();
  }

  private render(): void {
    const container = document.createElement('div');
    container.className = 'button-container';

    for (let i = 1; i <= 8; i++) {
      const button = document.createElement('button');
      button.textContent = `Button ${i}`;
      button.id = `btn-${i}`;
      container.appendChild(button);
    }

    this.appElement.appendChild(container);
  }
}

const app = new App();
app.init();
