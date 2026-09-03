export default async function handler(req, res) {
  // Esportazione CSV diretta dal foglio di Google
  const CSV_URL = 'https://docs.google.com/spreadsheets/d/1cC3-Yhs2x7Ej4h7ZgYJz8yu_VW8ELc9kpzgkcvCEAc/export?format=csv';

  try {
    const response = await fetch(CSV_URL, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }

    const csvText = await response.text();

    // Separazione semplice del CSV in righe e colonne
    const lines = csvText.split('\n').map(line => line.trim()).filter(line => line.length > 0);
    if (lines.length === 0) {
      return res.status(200).json([]);
    }

    // Estrazione delle intestazioni (prima riga)
    const headers = lines[0].split(',').map(h => h.replace(/^"|"$/g, '').trim());

    // Conversione delle righe successive in oggetti JSON
    const data = lines.slice(1).map(line => {
      // Regex per gestire i valori separati da virgole che potrebbero contenere virgolette
      const values = line.match(/(".*?"|[^",]+)(?=\s*,|\s*$)/g) || [];
      const row = {};
      headers.forEach((header, index) => {
        let val = values[index] ? values[index].replace(/^"|"$/g, '').trim() : '';
        row[header] = val;
      });
      return row;
    });

    res.setHeader('Cache-Control', 'no-store, max-age=0');
    res.status(200).json(data);
  } catch (error) {
    console.error('Fetch Error:', error);
    res.status(500).json({ error: error.message || 'Errore durante la lettura del foglio' });
  }
}
