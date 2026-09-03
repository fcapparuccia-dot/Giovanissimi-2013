export default async function handler(req, res) {
  // Endpoint GViz che restituisce direttamente un oggetto JSON
  const GVIZ_URL = 'https://docs.google.com/spreadsheets/d/1cC3-Yhs2x7Ej4h7ZgYJz8yu_VW8ELc9kpzgkcvCEAc/gviz/tq?sheet=2013&tqx=out:json';

  try {
    const response = await fetch(GVIZ_URL);
    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }

    const text = await response.text();
    
    // Google restituisce "/*O_o*/\ngoogle.visualization.Query.setResponse({...});"
    // Rimuoviamo il wrapper per estrarre solo il JSON valido
    const jsonString = text.substring(text.indexOf('{'), text.lastIndexOf('}') + 1);
    const json = JSON.parse(jsonString);

    const cols = json.table.cols.map((col) => col.label || col.id);
    const rows = json.table.rows.map((row) => {
      const rowData = {};
      row.c.forEach((cell, idx) => {
        const colName = cols[idx] || `col_${idx}`;
        rowData[colName] = cell ? cell.v : '';
      });
      return rowData;
    });

    res.setHeader('Cache-Control', 'no-store, max-age=0');
    res.status(200).json(rows);
  } catch (error) {
    console.error('GViz Fetch Error:', error);
    res.status(500).json({ error: 'Errore durante la lettura del foglio Google' });
  }
}
