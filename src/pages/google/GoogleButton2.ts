export class GoogleButton2Page {
  private apiUrl = 'https://script.google.com/a/macros/beau.camp/s/AKfycbxNZJPS0UIykT8LQ3CFnMioEUqqF2nx5UHIXZnpRXEHKaB2_v-gF_Sh5E170GvxkPaNcg/exec?sheet=getranke';

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

    // Load data
    this.loadData(cardsContainer);

    return wrapper;
  }

  private loadData(container: HTMLElement): void {
    fetch(this.apiUrl)
      .then(response => response.json())
      .then(data => {
        console.log('Getränkekarte Data:', data);
        this.renderCards(container, data);
      })
      .catch(error => {
        console.error('Error loading drinks:', error);
        container.innerHTML = '<p style="color: #ff4444; padding: 20px; text-align: center; grid-column: 1/-1;">Fehler beim Laden der Getränkekarte</p>';
      });
  }

  private renderCards(container: HTMLElement, data: any[]): void {
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
      const name = document.createElement('h2');
      name.textContent = drink.name || '';
      name.style.cssText = `
        color: white;
        font-size: 1.5rem;
        margin: 0;
      `;

      // Beschreibung
      const description = document.createElement('p');
      description.textContent = drink.beschreibung || '';
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
      const price = document.createElement('div');
      price.style.cssText = `
        color: #4ade80;
        font-size: 1.3rem;
        font-weight: bold;
      `;
      price.textContent = drink.preis ? '€ ' + drink.preis : '';

      // Alkohol Badge
      const alcoholBadge = document.createElement('div');
      const isAlcoholic = drink.alkohol === true || drink.alkohol === 'TRUE' || drink.alkohol === 'true';
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
