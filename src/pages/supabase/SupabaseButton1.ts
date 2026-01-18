import { CodeService } from '../../services/CodeService';

export class SupabaseButton1Page {
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
    backButton.id = 'supabase-btn-1-back';
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
    title.textContent = 'Passwort Generator';
    title.style.cssText = `
      color: white;
      font-size: 3rem;
      margin-bottom: 2rem;
      text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
    `;

    const container = document.createElement('div');
    container.style.cssText = `
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 2rem;
      background: rgba(255, 255, 255, 0.1);
      padding: 2rem;
      border-radius: 12px;
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      min-width: 300px;
    `;

    const statusText = document.createElement('p');
    statusText.textContent = 'Laden...';
    statusText.style.cssText = `
      color: #ccc;
      font-size: 1rem;
      margin: 0;
    `;

    const codeDisplay = document.createElement('div');
    codeDisplay.style.cssText = `
      background: rgba(0, 0, 0, 0.3);
      padding: 1.5rem;
      border-radius: 8px;
      text-align: center;
      min-width: 100%;
    `;

    const codeLabel = document.createElement('p');
    codeLabel.textContent = 'Dein Code:';
    codeLabel.style.cssText = `
      color: #aaa;
      font-size: 0.9rem;
      margin: 0 0 0.5rem 0;
      text-transform: uppercase;
      letter-spacing: 2px;
    `;

    const codeText = document.createElement('p');
    codeText.style.cssText = `
      color: #4ade80;
      font-size: 2.5rem;
      font-weight: bold;
      margin: 0;
      font-family: 'Courier New', monospace;
      letter-spacing: 3px;
    `;

    const infoText = document.createElement('p');
    infoText.style.cssText = `
      color: #999;
      font-size: 0.85rem;
      margin: 1rem 0 0 0;
      line-height: 1.4;
    `;

    codeDisplay.appendChild(codeLabel);
    codeDisplay.appendChild(codeText);
    codeDisplay.appendChild(infoText);

    container.appendChild(statusText);
    container.appendChild(codeDisplay);

    wrapper.appendChild(backButton);
    wrapper.appendChild(title);
    wrapper.appendChild(container);

    // Load IP and get code
    this.loadCodeForUser(codeText, statusText, infoText);

    return wrapper;
  }

  private async loadCodeForUser(
    codeText: HTMLElement,
    statusText: HTMLElement,
    infoText: HTMLElement
  ): Promise<void> {
    try {
      statusText.textContent = 'IP-Adresse wird ermittelt...';

      const ipAddress = await CodeService.getClientIpAddress();
      statusText.textContent = `IP: ${ipAddress}`;

      const result = await CodeService.getCodeForIp(ipAddress);

      if (result) {
        codeText.textContent = result.code;
        const availableCount = await CodeService.getAvailableCodeCount();

        if (result.isNew) {
          infoText.innerHTML = `
            <strong>✓ Neuer Code generiert</strong><br>
            Verfügbare Codes: ${availableCount}
          `;
        } else {
          infoText.innerHTML = `
            <strong>⚙ Du hast bereits einen Code</strong><br>
            Verfügbare Codes: ${availableCount}
          `;
        }
      } else {
        codeText.textContent = 'KEINE';
        codeText.style.color = '#ef4444';
        infoText.textContent =
          'Leider sind alle Codes vergeben. Bitte versuchen Sie später erneut.';
        infoText.style.color = '#ef4444';
      }
    } catch (error) {
      console.error('Error loading code:', error);
      codeText.textContent = 'FEHLER';
      codeText.style.color = '#ef4444';
      infoText.textContent = 'Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.';
      infoText.style.color = '#ef4444';
      statusText.textContent = 'Fehler beim Laden der IP-Adresse';
    }
  }
}
