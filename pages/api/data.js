import Papa from 'papaparse';

export default async function handler(req, res) {
  // URL dell'esportazione CSV diretta dalla scheda '2013'
  const CSV_URL = 'https://docs.google.com/spreadsheets/d/1cC3-Yhs2x7Ej4h7ZgYJz8yu_VW8ELc9kpzgkcvCEAc/gviz/tq?tqx=out:csv&sheet=2013';

  try {
    const response = await fetch(CSV_URL);
    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }

    const csvText = await response.text();

    // Convertiamo il CSV in JSON direttamente sul server
    const parsed = Papa.parse(csvText, {
      header: true,
      skipEmptyLines: true,
    });

    // Impostiamo l'intestazione per evitare la cache del browser
    res.setHeader('Cache-Control', 'no-store, max-age=0');
    res.status(200).json(parsed.data);
  } catch (err) {
    console.error('API Error:', err);
    res.status(500).json({ error: 'Errore nel caricamento dei dati da Google Sheets' });
  }
}
