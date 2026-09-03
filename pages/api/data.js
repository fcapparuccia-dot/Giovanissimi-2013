export default async function handler(req, res) {
  const SHEET_URL = 'https://docs.google.com/spreadsheets/d/1cC3-Yhs2x7Ej4h7ZgYJz8yu_VW8ELc9kpzgkcvCEAc/gviz/tq?tqx=out:csv&sheet=2013';

  try {
    const response = await fetch(SHEET_URL);
    if (!response.ok) throw new Error('Errore download Google Sheets');
    const data = await response.text();
    
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate');
    res.status(200).send(data);
  } catch (error) {
    res.status(500).json({ error: 'Impossibile recuperare i dati' });
  }
}
