export default async function handler(req, res) {
  // URL dell'esportazione diretta in formato TSV/CSV del foglio di lavoro
  const SHEET_URL = 'https://docs.google.com/spreadsheets/d/1cC3-Yhs2x7Ej4h7ZgYJz8yu_VW8ELc9kpzgkcvCEAc/export?format=csv&gid=0';

  try {
    const response = await fetch(SHEET_URL, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
      }
    });

    if (!response.ok) {
      throw new Error(`Status: ${response.status}`);
    }

    const data = await response.text();
    
    // Evita il caching rigido per avere sempre i dati freschi
    res.setHeader('Cache-Control', 'no-store, max-age=0');
    res.status(200).send(data);
  } catch (error) {
    console.error('Fetch error:', error);
    res.status(500).json({ error: 'Impossibile recuperare i dati' });
  }
}
