import Papa from 'papaparse';

export default async function handler(req, res) {
  // Esportazione CSV diretta del primo foglio di calcolo
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

    const parsed = Papa.parse(csvText, {
      header: true,
      skipEmptyLines: true,
    });

    res.setHeader('Cache-Control', 'no-store, max-age=0');
    res.status(200).json(parsed.data);
  } catch (error) {
    console.error('Fetch Error:', error);
    res.status(500).json({ error: error.message || 'Errore nel caricamento' });
  }
}
