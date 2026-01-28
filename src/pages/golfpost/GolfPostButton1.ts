import { CodeService } from '../../services/CodeService';
import golfImage from './golf23_1600x1066.jpg';

export class GolfPostButton1Page {
  render(): HTMLElement {
    const wrapper = document.createElement('div');
    wrapper.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: url('${golfImage}');
      background-size: cover;
      background-position: center;
      background-attachment: fixed;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 20px;
      overflow: hidden;
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
      background-color: rgba(255, 255, 255, 0.15);
      color: white;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.3s ease;
      font-weight: 500;
      z-index: 10;
    `;
    backButton.onmouseover = () => {
      backButton.style.backgroundColor = 'rgba(255, 255, 255, 0.25)';
      backButton.style.borderColor = 'rgba(255, 255, 255, 0.5)';
    };
    backButton.onmouseout = () => {
      backButton.style.backgroundColor = 'rgba(255, 255, 255, 0.15)';
      backButton.style.borderColor = 'rgba(255, 255, 255, 0.3)';
    };

    const contentWrapper = document.createElement('div');
    contentWrapper.style.cssText = `
      position: relative;
      z-index: 5;
      text-align: center;
      max-width: 500px;
      width: 100%;
    `;

    const title = document.createElement('h2');
    title.textContent = 'Hier ist dein Code';
    title.style.cssText = `
      font-size: 2rem;
      font-weight: bold;
      color: #1f2937;
      margin-bottom: 1.5rem;
      margin-top: 0;
    `;

    // Code Card
    const codeCard = document.createElement('div');
    codeCard.style.cssText = `
      background: white;
      border-radius: 0.5rem;
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
      padding: 2rem;
      margin-bottom: 2rem;
    `;

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
      animation: spin 1s linear infinite;
      margin-bottom: 0.5rem;
    `;

    const style = document.createElement('style');
    style.textContent = `
      @keyframes spin {
        to { transform: rotate(360deg); }
      }
    `;
    document.head.appendChild(style);

    const loadingText = document.createElement('p');
    loadingText.textContent = 'Code wird geladen...';
    loadingText.style.cssText = `
      color: #4b5563;
      margin: 0.5rem 0 0 0;
    `;

    codeLoading.appendChild(spinner);
    codeLoading.appendChild(loadingText);

    // Display state
    const codeDisplay = document.createElement('div');
    codeDisplay.id = 'code-display';
    codeDisplay.style.cssText = `
      display: none;
      text-align: center;
    `;

    const codeLabel = document.createElement('p');
    codeLabel.textContent = 'Dein persönlicher Code';
    codeLabel.style.cssText = `
      font-size: 0.875rem;
      color: #4b5563;
      margin: 0 0 0.5rem 0;
    `;

    const codeBox = document.createElement('div');
    codeBox.style.cssText = `
      background: #e8f8f3;
      border: 2px solid #04ad79;
      border-radius: 0.5rem;
      padding: 1rem;
      margin-bottom: 1rem;
    `;

    const codeText = document.createElement('p');
    codeText.id = 'code-text';
    codeText.style.cssText = `
      font-size: 2rem;
      font-weight: bold;
      color: #04ad79;
      font-family: 'Courier New', monospace;
      margin: 0;
      letter-spacing: 2px;
    `;

    codeBox.appendChild(codeText);

    const copyBtn = document.createElement('button');
    copyBtn.id = 'copy-btn';
    copyBtn.textContent = 'Code kopieren';
    copyBtn.style.cssText = `
      padding: 0.5rem 1.5rem;
      background-color: #04ad79;
      color: white;
      border: none;
      border-radius: 0.5rem;
      cursor: pointer;
      font-weight: 500;
      transition: all 0.3s ease;
    `;
    copyBtn.onmouseover = () => {
      copyBtn.style.backgroundColor = '#038a5f';
    };
    copyBtn.onmouseout = () => {
      copyBtn.style.backgroundColor = '#04ad79';
    };

    codeDisplay.appendChild(codeLabel);
    codeDisplay.appendChild(codeBox);
    codeDisplay.appendChild(copyBtn);

    // Error state
    const codeError = document.createElement('div');
    codeError.id = 'code-error';
    codeError.style.cssText = `
      display: none;
      text-align: center;
      color: #dc2626;
    `;
    codeError.textContent = 'Es ist ein Fehler aufgetreten. Bitte versuche es später erneut.';

    codeContainer.appendChild(codeLoading);
    codeContainer.appendChild(codeDisplay);
    codeContainer.appendChild(codeError);

    codeCard.appendChild(title);
    codeCard.appendChild(codeContainer);

    contentWrapper.appendChild(codeCard);
    wrapper.appendChild(backButton);
    wrapper.appendChild(contentWrapper);

    // Load IP and get code
    this.loadCodeForUser(codeText, codeLoading, codeDisplay, codeError, copyBtn);

    return wrapper;
  }

  private async loadCodeForUser(
    codeText: HTMLElement,
    codeLoading: HTMLElement,
    codeDisplay: HTMLElement,
    codeError: HTMLElement,
    copyBtn: HTMLButtonElement
  ): Promise<void> {
    try {
      const ipAddress = await CodeService.getClientIpAddress();

      const result = await CodeService.getCodeForIp(ipAddress, 'calendar_codes');

      if (result) {
        codeText.textContent = result.code;
        
        // Hide loading, show code display
        codeLoading.style.display = 'none';
        codeDisplay.style.display = 'block';

        // Setup copy button
        copyBtn.addEventListener('click', () => {
          navigator.clipboard.writeText(result.code).then(() => {
            const originalText = copyBtn.textContent;
            copyBtn.textContent = 'Kopiert! ✓';
            setTimeout(() => {
              copyBtn.textContent = originalText;
            }, 2000);
          });
        });
      } else {
        codeLoading.style.display = 'none';
        codeError.style.display = 'block';
      }
    } catch (error) {
      console.error('Error loading code:', error);
      codeLoading.style.display = 'none';
      codeError.style.display = 'block';
    }
  }
}
