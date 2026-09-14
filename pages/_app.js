import { useEffect } from 'react';

export default function MyApp({ Component, pageProps }) {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((reg) => console.log('SW registrato con successo:', reg))
        .catch((err) => console.error('Errore registrazione SW:', err));
    }
  }, []);

  return <Component {...pageProps} />;
}