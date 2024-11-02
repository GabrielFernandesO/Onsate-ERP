import TableData from "../../TableData/TableData";
import styles from "./CadastroProdutos.module.css";

interface CadastroProdutosProps {
  data: string;
  setData: React.Dispatch<React.SetStateAction<string>>;
}

export default function CadastroProdutos({}: CadastroProdutosProps) {
  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <h1>Cadastro de Produtos</h1>
        <TableData></TableData>
      </div>
    </main>
  );
}
