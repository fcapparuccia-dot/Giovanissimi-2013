export default async function handler(req, res) {
  // Indirizzo della vista Web HTML pubblica del Google Sheet
  const HTML_URL = 'https://docs.google.com/spreadsheets/d/1cC3-Yhs2x7Ej4h7ZgYJz8yu_VW8ELc9kpzgkcvCEAc/htmlview';

  try {
    const response = await fetch(HTML_URL, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept-Language': 'it-IT,it;q=0.9,en-US;q=0.8,en;q=0.7'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }

    const html = await response.text();

    // Estrazione semplice delle celle dalle tabelle HTML
    const rowRegex = /<tr[^>]*>(.*?)<\/tr>/gs;
    const cellRegex = /<td[^>]*>(.*?)<\/td>/gs;

    const rows = [];
    let matchRow;

    while ((matchRow = rowRegex.exec(html)) !== null) {
      const rowContent = matchRow[1];
      const cells = [];
      let matchCell;

      while ((matchCell = cellRegex.exec(rowContent)) !== null) {
        // Pulisce il testo dai tag HTML residui
        let cellText = matchCell[1].replace(/<[^>]+>/g, '').trim();
        cells.push(cellText);
      }

      if (cells.length > 0) {
        rows.push(cells);
      }
    }

    if (rows.length === 0) {
      return res.status(200).json([]);
    }

    // Trova la riga delle intestazioni (GIORNO, ORE, ecc.)
    let headerIndex = rows.findIndex(r => r.some(c => c.toUpperCase().includes('GIORNO')));
    if (headerIndex === -1) headerIndex = 0;

    const headers = rows[headerIndex].map((h, i) => h || `col_${i}`);
    const dataRows = rows.slice(headerIndex + 1);

    const formattedData = dataRows.map(row => {
      const rowObj = {};
      headers.forEach((header, i) => {
        rowObj[header] = row[i] || '';
      });
      return rowObj;
    });

    res.setHeader('Cache-Control', 'no-store, max-age=0');
    res.status(200).json(formattedData);
  } catch (error) {
    console.error('HTML Parsing Error:', error);
    res.status(500).json({ error: 'Impossibile leggere la pagina del foglio' });
  }
}
