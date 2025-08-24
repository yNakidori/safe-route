import { useState } from "react";

export default function CepSearch({ onAddressFound }) {
  const [cep, setCep] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await response.json();

      if (data.erro) {
        setError("CEP não encontrado.");
      } else {
        // manda o objeto inteiro
        onAddressFound({
          street: data.logradouro || "",
          neighborhood: data.bairro || "",
          city: data.localidade || "",
          state: data.uf || "",
        });
      }
    } catch {
      setError("Erro ao buscar CEP.");
    }
    setLoading(false);
  };

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Buscar por CEP:
      </label>
      <div className="flex gap-2">
        <input
          type="text"
          value={cep}
          onChange={(e) => setCep(e.target.value)}
          placeholder="Digite o CEP"
          className="px-14 py-2 border rounded-lg text-center"
          maxLength={8}
        />
        <button
          type="button"
          onClick={handleSearch}
          disabled={loading || cep.length !== 8}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg"
        >
          Buscar
        </button>
      </div>
      {error && <div className="text-red-500 text-sm mt-1">{error}</div>}
    </div>
  );
}
