export class GooglePage {
  onButtonClick?: (buttonNumber: number) => void;

  render(): HTMLElement {
    const wrapper = document.createElement('div');
    wrapper.style.cssText = `
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      padding: 20px;
      position: relative;
    `;

    const backButton = document.createElement('button');
    backButton.textContent = '← Zurück';
    backButton.id = 'google-btn-back';
    backButton.style.cssText = `
      position: absolute;
      top: 20px;
      left: 20px;
      padding: 0.75rem 1.5rem;
      font-size: 1rem;
      background-color: rgba(255, 255, 255, 0.2);
      color: white;
      border: 2px solid white;
      border-radius: 8px;
      cursor: pointer;
      backdrop-filter: blur(10px);
      transition: all 0.3s ease;
      font-weight: 500;
    `;

    const title = document.createElement('h1');
    title.textContent = 'Google';
    title.style.cssText = `
      color: white;
      font-size: 4rem;
      margin-bottom: 3rem;
      text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
    `;

    const container = document.createElement('div');
    container.className = 'button-container';

    for (let i = 1; i <= 8; i++) {
      const button = document.createElement('button');
      if (i === 1) {
        button.textContent = 'Tabelle';
      } else if (i === 2) {
        button.textContent = 'Tabelle 2';
      } else {
        button.textContent = 'nicht zugewiesen';
      }
      button.id = `google-btn-${i}`;
      button.addEventListener('click', () => {
        if (this.onButtonClick) {
          this.onButtonClick(i);
        }
      });
      container.appendChild(button);
    }

    wrapper.appendChild(backButton);
    wrapper.appendChild(title);
    wrapper.appendChild(container);

    return wrapper;
  }
}
