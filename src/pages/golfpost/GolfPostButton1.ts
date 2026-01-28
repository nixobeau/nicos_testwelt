import { CodeService } from '../../services/CodeService';

export class GolfPostButton1Page {
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
      background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
    `;

    const backButton = document.createElement('button');
    backButton.textContent = '← Zurück';
    backButton.id = 'golfpost-btn-1-back';
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

    backButton.addEventListener('mouseover', () => {
      backButton.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
    });
    backButton.addEventListener('mouseout', () => {
      backButton.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
    });

    // Code Card Container
    const codeCard = document.createElement('div');
    codeCard.style.cssText = `
      background: white;
      border-radius: 12px;
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3);
      padding: 2rem;
      max-width: 28rem;
      width: 100%;
    `;

    const title = document.createElement('h2');
    title.textContent = 'Hier ist dein Code';
    title.style.cssText = `
      font-size: 1.5rem;
      font-weight: bold;
      color: #111827;
      margin-bottom: 1.5rem;
      text-align: center;
    `;

    // Code Container with loading/display/error states
    const codeContainer = document.createElement('div');
    codeContainer.id = 'code-container';
    codeContainer.style.cssText = `
      margin-bottom: 1.5rem;
    `;

    // Loading state
    const codeLoading = document.createElement('div');
    codeLoading.id = 'code-loading';
    codeLoading.style.cssText = `
      text-align: center;
      padding: 1rem;
    `;

    const spinner = document.createElement('div');
    spinner.style.cssText = `
      display: inline-block;
      width: 2rem;
      height: 2rem;
      border: 4px solid #e5e7eb;
      border-top-color: #2563eb;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    `;

    const loadingText = document.createElement('p');
    loadingText.textContent = 'Code wird geladen...';
    loadingText.style.cssText = `
      color: #4b5563;
      margin-top: 0.5rem;
      font-size: 0.875rem;
    `;

    codeLoading.appendChild(spinner);
    codeLoading.appendChild(loadingText);

    // Display state
    const codeDisplay = document.createElement('div');
    codeDisplay.id = 'code-display';
    codeDisplay.style.cssText = `
      text-align: center;
      display: none;
    `;

    const codeLabel = document.createElement('p');
    codeLabel.textContent = 'Dein persönlicher Code';
    codeLabel.style.cssText = `
      font-size: 0.875rem;
      color: #4b5563;
      margin-bottom: 0.5rem;
    `;

    const codeBox = document.createElement('div');
    codeBox.style.cssText = `
      background: #eff6ff;
      border: 2px solid #2563eb;
      border-radius: 8px;
      padding: 1rem;
      margin-bottom: 1rem;
    `;

    const codeText = document.createElement('p');
    codeText.id = 'code-text';
    codeText.style.cssText = `
      font-size: 2rem;
      font-family: 'Courier New', monospace;
      font-weight: bold;
      color: #2563eb;
      margin: 0;
      letter-spacing: 0.2em;
    `;

    codeBox.appendChild(codeText);

    const copyBtn = document.createElement('button');
    copyBtn.id = 'copy-btn';
    copyBtn.textContent = 'Code kopieren';
    copyBtn.style.cssText = `
      padding: 0.75rem 1.5rem;
      background-color: #2563eb;
      color: white;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-weight: 500;
      transition: background-color 0.3s ease;
    `;

    copyBtn.addEventListener('mouseover', () => {
      copyBtn.style.backgroundColor = '#1d4ed8';
    });
    copyBtn.addEventListener('mouseout', () => {
      copyBtn.style.backgroundColor = '#2563eb';
    });

    codeDisplay.appendChild(codeLabel);
    codeDisplay.appendChild(codeBox);
    codeDisplay.appendChild(copyBtn);

    // Error state
    const codeError = document.createElement('div');
    codeError.id = 'code-error';
    codeError.style.cssText = `
      text-align: center;
      color: #dc2626;
      display: none;
    `;
    const errorText = document.createElement('p');
    errorText.textContent = 'Es ist ein Fehler aufgetreten. Bitte versuche es später erneut.';
    codeError.appendChild(errorText);

    codeContainer.appendChild(codeLoading);
    codeContainer.appendChild(codeDisplay);
    codeContainer.appendChild(codeError);

    codeCard.appendChild(title);
    codeCard.appendChild(codeContainer);

    wrapper.appendChild(backButton);
    wrapper.appendChild(codeCard);

    // Add spin animation
    const style = document.createElement('style');
    style.textContent = `
      @keyframes spin {
        to { transform: rotate(360deg); }
      }
    `;
    document.head.appendChild(style);

    // Fetch code when page loads
    this.fetchCode();

    return wrapper;
  }

  private async fetchCode(): Promise<void> {
    const codeLoading = document.getElementById('code-loading');
    const codeDisplay = document.getElementById('code-display');
    const codeError = document.getElementById('code-error');
    const codeText = document.getElementById('code-text');
    const copyBtn = document.getElementById('copy-btn');

    try {
      const ipAddress = await CodeService.getClientIpAddress();
      const result = await CodeService.getGolfCodeForIp(ipAddress);

      if (result && result.code) {
        codeLoading!.style.display = 'none';
        codeText!.textContent = result.code;
        codeDisplay!.style.display = 'block';

        // Copy button functionality
        copyBtn!.addEventListener('click', () => {
          navigator.clipboard.writeText(result.code).then(() => {
            const originalText = copyBtn!.textContent;
            copyBtn!.textContent = 'Kopiert! ✓';
            setTimeout(() => {
              copyBtn!.textContent = originalText;
            }, 2000);
          });
        });
      } else {
        this.showError();
      }
    } catch (error) {
      console.error('Error:', error);
      this.showError();
    }
  }

  private showError(): void {
    const codeLoading = document.getElementById('code-loading');
    const codeDisplay = document.getElementById('code-display');
    const codeError = document.getElementById('code-error');

    codeLoading!.style.display = 'none';
    codeDisplay!.style.display = 'none';
    codeError!.style.display = 'block';
  }
}
