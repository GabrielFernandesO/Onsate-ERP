import styles from "./CadastroProdutos.module.css";

interface CadastroProdutosProps {
  data: string;
  setData: React.Dispatch<React.SetStateAction<string>>;
}

export default function CadastroProdutos({
  data,
  setData,
}: CadastroProdutosProps) {
  return (
    <main className={styles.main}>
      <div className={styles.container}>
        {" "}
        <h1>Cadastro de Produtos</h1>
        <input
          type="text"
          value={data}
          onChange={(e) => setData(e.target.value)}
          placeholder="Digite os dados do produto"
        />
      </div>
    </main>
  );
}
