import Papa from 'papaparse';

export default async function handler(req, res) {
  // URL CSV del foglio Mirror personale pubblicato sul web
  const MY_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQDolxB07i-ArF3GhggSsXAZyl-H5-AcxoPO7KJbU1WPLY4v6tlWuK4WqGjXdAzqtg7ZQKhsHEZVBTE/pub?gid=0&single=true&output=csv';

  try {
    const response = await fetch(MY_CSV_URL);

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
    res.status(500).json({ error: 'Errore nel caricamento del foglio mirror' });
  }
}
