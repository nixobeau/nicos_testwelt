export class GoogleButton1Page {
  private apiUrl = 'https://script.google.com/macros/s/AKfycbw78LOkpMqxwwA6JOXEF3bfthU_g3mmmXAGL06BC_fv92jCWM4fanqAz3XkM0IfMs6O/exec';

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
    backButton.id = 'google-btn-1-back';
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
    title.textContent = 'Tabelle';
    title.style.cssText = `
      color: white;
      font-size: 4rem;
      margin-bottom: 3rem;
      text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
    `;

    const tableContainer = document.createElement('div');
    tableContainer.id = 'table-container';
    tableContainer.style.cssText = `
      margin-top: 2rem;
      max-width: 600px;
    `;

    wrapper.appendChild(backButton);
    wrapper.appendChild(title);
    wrapper.appendChild(tableContainer);

    // Load data
    this.loadData(tableContainer);

    return wrapper;
  }

  private loadData(container: HTMLElement): void {
    fetch(this.apiUrl)
      .then(response => response.json())
      .then(data => {
        console.log('API Response:', data);
        this.renderTable(container, data);
      })
      .catch(error => {
        console.error('Error loading data:', error);
        container.innerHTML = '<p style="color: #ff4444; padding: 20px; text-align: center;">Fehler beim Laden der Daten<br><br>Check Console für Details</p>';
      });
  }

  private renderTable(container: HTMLElement, data: any[]): void {
    const table = document.createElement('table');
    table.style.cssText = `
      width: 100%;
      border-collapse: collapse;
      background-color: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(10px);
      border: 2px solid white;
      border-radius: 8px;
      overflow: hidden;
    `;

    // Header
    const header = table.createTHead();
    const headerRow = header.insertRow();
    headerRow.style.cssText = `
      background-color: rgba(255, 255, 255, 0.2);
      border-bottom: 2px solid white;
    `;

    const headerCells = ['Name', 'Nummer'];
    headerCells.forEach(text => {
      const cell = headerRow.insertCell();
      cell.textContent = text;
      cell.style.cssText = `
        color: white;
        padding: 12px;
        text-align: left;
        font-weight: bold;
      `;
    });

    // Body
    const body = table.createTBody();
    data.forEach((row: any) => {
      const tableRow = body.insertRow();
      tableRow.style.cssText = `
        border-bottom: 1px solid rgba(255, 255, 255, 0.2);
      `;

      // Name cell
      const nameCell = tableRow.insertCell();
      nameCell.textContent = row.name || '';
      const nameColor = row.eintrag === true || row.eintrag === 'true' ? '#ff4444' : '#000000';
      nameCell.style.cssText = `
        color: ${nameColor};
        padding: 12px;
        font-weight: bold;
      `;

      // Nummer cell
      const nummerCell = tableRow.insertCell();
      nummerCell.textContent = row.nummer || '';
      nummerCell.style.cssText = `
        color: white;
        padding: 12px;
      `;
    });

    container.innerHTML = '';
    container.appendChild(table);
  }
}
