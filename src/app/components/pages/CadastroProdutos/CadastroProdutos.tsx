"use client";

import TableData from "../../TableData/TableData";
import styles from "./CadastroProdutos.module.css";
import Loading from "../../Loading/Loading";
import CadastroProdutosSheet from "../../Sheets/CadastroProdutos/CadastroProdutosSheet";

interface CadastroProdutosProps {
  data: string;
  setData: React.Dispatch<React.SetStateAction<string>>;
  activeTab: string;
  tableDataActive: boolean;
  setTableDataActive: React.Dispatch<React.SetStateAction<boolean>>;
  addProduct: boolean;
  setAddProduct: React.Dispatch<React.SetStateAction<boolean>>;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  titlePage: string;
  setTitlePage: React.Dispatch<React.SetStateAction<string>>;
}

export default function CadastroProdutos({
  tableDataActive,
  setTableDataActive,
  addProduct,
  setAddProduct,
  loading,
  setLoading,
  titlePage,
  setTitlePage,
}: CadastroProdutosProps) {
  
  const handleAddComponente = () :void => {
    setTableDataActive(false);
    setLoading(true);
    setTitlePage("");

    setTimeout(() => {
      setLoading(false);
      setTitlePage("Dados Cadastrais");
      setAddProduct(true);
    }, 1500);
  };

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <h1>{titlePage}</h1>
        {tableDataActive && (
          <TableData handleAddProduct={handleAddComponente} />
        )}
        {loading && (
          <Loading />
        )}
        {addProduct && (
          <CadastroProdutosSheet />
        )}
      </div>
    </main>
  );
}
