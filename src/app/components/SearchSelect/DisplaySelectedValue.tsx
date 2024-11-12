interface DisplaySelectedValueProps {
    selectedOption: { label: string; value: string } | null;
  }
  
  const DisplaySelectedValue = ({ selectedOption }: DisplaySelectedValueProps) => {
    return (
      <div>
        <h2>Opção Selecionada:</h2>
        <p>{selectedOption ? `${selectedOption.label} (NCM: ${selectedOption.value})` : 'Nenhuma opção selecionada'}</p>
      </div>
    );
  };
  
  export default DisplaySelectedValue;
  