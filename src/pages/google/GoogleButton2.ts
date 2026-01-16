export class GoogleButton2Page {
  private apiUrl = 'https://script.google.com/a/macros/beau.camp/s/AKfycbwDTeI_QX3xz2z_IR4hVeapEA0xm9JXCeksLHIt-vaa333mXJfnciA8eTIz2XXqpdxx/exec?sheet=getranke';

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
    backButton.id = 'google-btn-2-back';
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
    title.textContent = 'Getränkekarte';
    title.style.cssText = `
      color: white;
      font-size: 4rem;
      margin-bottom: 3rem;
      text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
    `;

    const cardsContainer = document.createElement('div');
    cardsContainer.id = 'cards-container';
    cardsContainer.style.cssText = `
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 2rem;
      max-width: 1200px;
      width: 100%;
    `;

    wrapper.appendChild(backButton);
    wrapper.appendChild(title);
    wrapper.appendChild(cardsContainer);

    // Load data from API
    this.loadData(cardsContainer);

    return wrapper;
  }

  private loadData(container: HTMLElement): void {
    console.log('🔍 API URL:', this.apiUrl);
    fetch(this.apiUrl)
      .then(response => {
        console.log('✅ Response erhalten:', response.status);
        return response.json();
      })
      .then(data => {
        console.log('📊 Getränkekarte Data von API:', data);
        console.log('📝 Anzahl Getränke:', data.length);
        if (data.length > 0) {
          console.log('🥤 Erstes Getränk:', data[0]);
          console.log('🔑 Feldnamen:', Object.keys(data[0]));
        }
        this.renderCards(container, data);
      })
      .catch(error => {
        console.error('❌ Error loading drinks:', error);
        container.innerHTML = '<p style="color: #ff4444; padding: 20px; text-align: center; grid-column: 1/-1;">Fehler beim Laden der Getränkekarte von Google Sheets</p>';
      });
  }

  private renderCards(container: HTMLElement, data: any[]): void {
    if (!Array.isArray(data) || data.length === 0) {
      container.innerHTML = '<p style="color: #ccc; grid-column: 1/-1;">Keine Getränke vorhanden</p>';
      return;
    }

    data.forEach((drink: any) => {
      const card = document.createElement('div');
      card.style.cssText = `
        background-color: rgba(255, 255, 255, 0.1);
        backdrop-filter: blur(10px);
        border: 2px solid white;
        border-radius: 12px;
        padding: 1.5rem;
        display: flex;
        flex-direction: column;
        gap: 1rem;
        transition: transform 0.3s ease, box-shadow 0.3s ease;
        cursor: pointer;
      `;

      card.onmouseover = () => {
        card.style.transform = 'translateY(-5px)';
        card.style.boxShadow = '0 8px 20px rgba(255, 255, 255, 0.2)';
      };

      card.onmouseout = () => {
        card.style.transform = 'translateY(0)';
        card.style.boxShadow = 'none';
      };

      // Name
      const nameValue = drink.name || '';
      const name = document.createElement('h2');
      name.textContent = nameValue;
      name.style.cssText = `
        color: white;
        font-size: 1.5rem;
        margin: 0;
      `;

      // Beschreibung
      const descValue = drink.beschreibung || '';
      const description = document.createElement('p');
      description.textContent = descValue;
      description.style.cssText = `
        color: #ccc;
        font-size: 0.95rem;
        margin: 0;
        flex-grow: 1;
      `;

      // Info Row
      const infoRow = document.createElement('div');
      infoRow.style.cssText = `
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-top: 1rem;
        border-top: 1px solid rgba(255, 255, 255, 0.2);
      `;

      // Preis
      const priceValue = drink.preis || '';
      const price = document.createElement('div');
      price.style.cssText = `
        color: #4ade80;
        font-size: 1.3rem;
        font-weight: bold;
      `;
      price.textContent = priceValue ? '€ ' + priceValue.toFixed(2) : '';

      // Alkohol Badge
      const alkoholValue = drink.alkohol || false;
      const alcoholBadge = document.createElement('div');
      const isAlcoholic = alkoholValue === true || alkoholValue === 'TRUE' || alkoholValue === 'true';
      alcoholBadge.textContent = isAlcoholic ? '🍺 Mit Alkohol' : '🥤 Alkoholfrei';
      alcoholBadge.style.cssText = `
        background-color: ${isAlcoholic ? 'rgba(239, 68, 68, 0.3)' : 'rgba(59, 130, 246, 0.3)'};
        border: 1px solid ${isAlcoholic ? '#ef4444' : '#3b82f6'};
        color: ${isAlcoholic ? '#fca5a5' : '#93c5fd'};
        padding: 0.4rem 0.8rem;
        border-radius: 20px;
        font-size: 0.85rem;
        font-weight: bold;
      `;

      infoRow.appendChild(price);
      infoRow.appendChild(alcoholBadge);

      card.appendChild(name);
      card.appendChild(description);
      card.appendChild(infoRow);

      container.appendChild(card);
    });
  }
}
