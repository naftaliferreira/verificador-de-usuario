import { useState, useEffect } from 'react';
import axios from 'axios'; // <-- Importa o Axios
import './App.css';

// Lista de plataformas para verificar
const platforms = ['GitHub', 'Twitter', 'Instagram'];

function App() {
  const [username, setUsername] = useState('');
  const [status, setStatus] = useState('idle');
  const [results, setResults] = useState({});

  // **NOVA FUNÇÃO** para verificar a disponibilidade de forma assíncrona
  const checkUsername = async (name: string) => {
    setStatus('loading');
    setResults({}); // Limpa resultados anteriores

    const newResults = {};

    // **Lógica para o GitHub (real)**
    try {
      const response = await axios.get(`https://api.github.com/users/${name}`);
      if (response.status === 200) {
        newResults['GitHub'] = 'unavailable';
      } else {
        newResults['GitHub'] = 'available';
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response && error.response.status === 404) {
        // Usuário não encontrado, ou seja, está disponível
        newResults['GitHub'] = 'available';
      } else {
        // Outro erro (rede, etc.)
        newResults['GitHub'] = 'error';
      }
    }

    // **Lógica de simulação para outras plataformas**
    for (const platform of platforms) {
      if (platform !== 'GitHub') {
        // Simula uma chamada de API para as outras plataformas
        await new Promise(resolve => setTimeout(resolve, Math.random() * 500 + 300));
        const isAvailable = name.length > 3 && !['admin', 'test', 'gabriel', 'octocat'].includes(name.toLowerCase());
        newResults[platform] = isAvailable ? 'available' : 'unavailable';
      }
    }

    setResults(newResults);
    setStatus('idle');
  };

  useEffect(() => {
    if (username.trim() === '') {
      setStatus('idle');
      setResults({});
      return;
    }

    const handler = setTimeout(() => {
      checkUsername(username);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [username]);

  const getStatusColor = (platformStatus) => {
    switch (platformStatus) {
      case 'available':
        return 'green';
      case 'unavailable':
        return 'red';
      case 'error':
        return 'gray';
      default:
        return 'gray';
    }
  };

  return (
    <div className="container">
      <h1>Verificador de Nome de Usuário</h1>
      <p>Verifique a disponibilidade do seu nome de usuário em várias plataformas.</p>

      <div className="search-box">
        <input
          type="text"
          placeholder="Digite o nome de usuário"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        {status === 'loading' && <div className="spinner"></div>}
      </div>

      <div className="results-list">
        {platforms.map(platform => (
          <div key={platform} className="result-item">
            <span className="platform-name">{platform}</span>
            <span className="platform-status" style={{ color: getStatusColor(results[platform]) }}>
              {status === 'loading' ? 'Verificando...' :
                results[platform] === 'available' ? 'Disponível' :
                  results[platform] === 'unavailable' ? 'Indisponível' : ''}
            </span>
          </div>
        ))}
      </div>

    </div>
  );
}

export default App;