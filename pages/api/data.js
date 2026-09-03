export default async function handler(req, res) {
  // Tentativo via GViz con parametro tq per scavalcare l'importrange
  const SHEET_ID = '1cC3-Yhs2x7Ej4h7ZgYJz8yu_VW8ELc9kpzgkcvCEAc';
  const GVIZ_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json`;

  try {
    const response = await fetch(GVIZ_URL, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }

    const text = await response.text();

    if (!text.includes('google.visualization.Query.setResponse')) {
      throw new Error('Risposta non valida da Google');
    }

    const jsonString = text.substring(text.indexOf('{'), text.lastIndexOf('}') + 1);
    const json = JSON.parse(jsonString);

    if (!json.table || !json.table.rows) {
      throw new Error('Tabella dati vuota');
    }

    const cols = json.table.cols.map((col) => (col && col.label) ? col.label : '');
    const rows = json.table.rows.map((row) => {
      const rowData = {};
      if (row.c) {
        row.c.forEach((cell, idx) => {
          const colName = cols[idx] || `col_${idx}`;
          // Estrae la stringa formattata (f) o il valore grezzo (v)
          rowData[colName] = cell ? (cell.f !== undefined ? cell.f : cell.v) : '';
        });
      }
      return rowData;
    });

    res.setHeader('Cache-Control', 'no-store, max-age=0');
    res.status(200).json(rows);
  } catch (error) {
    console.error('GViz Fetch Error:', error);
    res.status(500).json({ error: error.message || 'Errore durante la lettura del foglio Google' });
  }
}
