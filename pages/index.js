import { useEffect, useState } from 'react';
import Papa from 'papaparse';

export default function Home() {
  const [impegni, setImpegni] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch('/api/data')
      .then((res) => {
        if (!res.ok) throw new Error('Errore risposta API');
        return res.text();
      })
      .then((csvText) => {
        Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            setImpegni(results.data);
            setLoading(false);
          },
          error: () => setError(true),
        });
      })
      .catch((err) => {
        console.error(err);
        setError(true);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div style={{ padding: 30, fontFamily: 'sans-serif', textAlign: 'center' }}>
        ⏳ Caricamento impegni in corso...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: 30, fontFamily: 'sans-serif', textAlign: 'center', color: 'red' }}>
        ⚠️ Impossibile caricare i dati dal foglio. Riprova tra qualche secondo.
      </div>
    );
  }

  return (
    <main style={{ padding: 15, fontFamily: 'sans-serif', maxWidth: 600, margin: '0 auto' }}>
      <h2 style={{ marginBottom: 4 }}>⚽ Giovanissimi B 2013</h2>
      <p style={{ color: '#666', fontSize: 14, marginTop: 0 }}>Atletico Cascina - Calendario Impegni</p>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 20 }}>
        {impegni.map((row, idx) => {
          const giorno = row['GIORNO'] || row['giorno'] || Object.values(row)[0];
          const dove = row['DOVE'] || row['dove'] || '';
          const ore = row['ORE'] || row['ore'] || '';
          const comp = row['COMPETIZIONE'] || row['competizione'] || '';
          const sqA = row['SQUADRA A'] || row['squadra a'] || '';
          const sqB = row['SQUADRA B'] || row['squadra b'] || '';
          const note = row['NOTE'] || row['note'] || '';

          if (!giorno || giorno.trim() === '' || giorno.includes('GIORNO')) return null;

          return (
            <div key={idx} style={{
              border: '1px solid #e0e0e0',
              borderRadius: 8,
              padding: 12,
              backgroundColor: comp.includes('RITIRO') ? '#ffebee' : 
                               comp.includes('AMICHEVOLE') ? '#fffde7' : '#f9f9f9'
            }}>
              <div style={{ fontWeight: 'bold', fontSize: 16, marginBottom: 6 }}>
                📅 {giorno} {ore && `- 🕒 ${ore}`}
              </div>
              {dove && <div>📍 <strong>Dove:</strong> {dove}</div>}
              {sqA && <div>⚔️ <strong>Partita:</strong> {sqA} vs {sqB}</div>}
              {comp && <div>🏆 <strong>Tipo:</strong> {comp}</div>}
              {note && <div style={{ marginTop: 6, fontSize: 13, color: '#444', borderTop: '1px dashed #ccc', paddingTop: 4 }}>📌 {note}</div>}
            </div>
          );
        })}
      </div>
    </main>
  );
}
