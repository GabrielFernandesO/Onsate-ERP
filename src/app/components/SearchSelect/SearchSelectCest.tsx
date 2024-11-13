import { useState, useCallback } from 'react';
import Select from 'react-select';
import debounce from 'lodash/debounce';
import styles from './SearchSelect.module.css'

// Tipando as opções do select
interface Option {
  label: string;
  value: string;
}

interface SearchSelectProps {
  inputValue: string;
  onInputChange: (value: string) => void;
  onSelectChange: (selected: { label: string; value: string } | null) => void; // Função para passar a opção selecionada
}

const SearchSelectCest = ({  onInputChange, onSelectChange }: SearchSelectProps) => {
  const [options, setOptions] = useState<Option[]>([]); // Opções de busca
  const [loading, setLoading] = useState<boolean>(false); // Estado de carregamento
  const [selectedOption, setSelectedOption] = useState<Option | null>(null); // Estado para a opção selecionada


  // Função para carregar as opções com debounce
  const loadOptions = async (query: string) => {
    if (!query.trim()) {
      setOptions([]);
      return;
    }

    setLoading(true);
    try {
      // Requisição de dados ao backend
      const response = await fetch(`http://26.56.52.76:8000/cestcode?cestfilter=${query}`);
      if (!response.ok) {
        throw new Error('Erro ao buscar as opções');
      }

      const data = await response.json();
      const formattedOptions = data.map((item: { id: string }) => ({
        label: `Cest: ${item}`,
        value: item,
      }));

      setOptions(formattedOptions);
    } catch (error) {
      console.error('Erro ao buscar as opções:', error);
    } finally {
      setLoading(false);
    }
  };



  // Debounced search
  const debouncedSearch = useCallback(
    debounce((query: string) => {
      loadOptions(query);
    }, 500), // 500ms de debounce
    []
  );

  // Função que é chamada toda vez que o usuário digita
  const handleInputChange = (newValue: string) => {
    onInputChange(newValue);  // Atualizando o estado no componente pai
    debouncedSearch(newValue); // Chama a versão debounced
  };

  // Função que é chamada quando o usuário seleciona uma opção
  const handleSelectChange = (selectedOption: Option | null) => {
    setSelectedOption(selectedOption); // Atualiza o estado local do select
    onSelectChange(selectedOption); // Passa a opção selecionada para o componente pai
  };

  return (
    <div className={styles.divSelect}>
      <Select
        options={options}
        value={selectedOption} // Sincronizando o valor selecionado com o estado local
        onChange={handleSelectChange} // Passando a função de onChange para capturar a seleção
        onInputChange={handleInputChange} // Chama o handleInputChange para realizar a busca
        isLoading={loading}
        isClearable={true}
        placeholder="CEST"
        className="basic-single"
        classNamePrefix="select"
      />
    </div>
  );
};

export default SearchSelectCest;
