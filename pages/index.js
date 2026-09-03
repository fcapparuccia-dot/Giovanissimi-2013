import { useEffect, useState } from 'react';
import Papa from 'papaparse';

export default function Home() {
  const [impegni, setImpegni] = useState([]);
  const [loading, setLoading] = useState(true);

  const SHEET_URL = 'https://docs.google.com/spreadsheets/d/1cC3-Yhs2x7Ej4h7ZgYJz8yu_VW8ELc9kpzgkcvCEAc/gviz/tq?tqx=out:csv&sheet=2013';

  useEffect(() => {
    Papa.parse(SHEET_URL, {
      download: true,
      header: true,
      complete: (results) => {
        setImpegni(results.data);
        setLoading(false);
      },
    });
  }, []);

  if (loading) return <div style={{ padding: 20, fontFamily: 'sans-serif' }}>Caricamento impegni...</div>;

  return (
    <main style={{ padding: 15, fontFamily: 'sans-serif', maxWidth: 600, margin: '0 auto' }}>
      <h2 style={{ marginBottom: 4 }}>⚽ Giovanissimi B 2013</h2>
      <p style={{ color: '#666', fontSize: 14, marginTop: 0 }}>Atletico Cascina - Calendario Impegni</p>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 20 }}>
        {impegni.map((row, idx) => (
          row['GIORNO'] && (
            <div key={idx} style={{
              border: '1px solid #e0e0e0',
              borderRadius: 8,
              padding: 12,
              backgroundColor: row['COMPETIZIONE'] === 'RITIRO' ? '#ffebee' : 
                               row['COMPETIZIONE'] === 'AMICHEVOLE' ? '#fffde7' : '#f9f9f9'
            }}>
              <div style={{ fontWeight: 'bold', fontSize: 16, marginBottom: 6 }}>
                {row['GIORNO']} {row['ORE'] && `- ${row['ORE']}`}
              </div>
              {row['DOVE'] && <div>📍 <strong>Dove:</strong> {row['DOVE']}</div>}
              {row['SQUADRA A'] && <div>⚔️ <strong>Partita:</strong> {row['SQUADRA A']} vs {row['SQUADRA B']}</div>}
              {row['COMPETIZIONE'] && <div>🏆 <strong>Tipo:</strong> {row['COMPETIZIONE']}</div>}
              {row['NOTE'] && <div style={{ marginTop: 6, fontSize: 13, color: '#444', borderTop: '1px dashed #ccc', paddingTop: 4 }}>📌 {row['NOTE']}</div>}
            </div>
          )
        ))}
      </div>
    </main>
  );
}
