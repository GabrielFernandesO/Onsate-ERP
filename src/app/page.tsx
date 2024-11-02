"use client";

import { useState } from "react";
import styles from './page.module.css';
import Navbar from "./components/Navbar/Navbar";
import CadastroProdutos from "./components/pages/CadastroProdutos/CadastroProdutos";
import CadastroClientes from "./components/pages/CadastroClientes/CadastroClientes";
import Footer from "./components/Footer/Footer";

const Home = () => {
  const [produtosData, setProdutosData] = useState("");
  const [clientesData, setClientesData] = useState("");
  const [activeTab, setActiveTab] = useState<string | null>(null);

  const handleTabChange = (tab: string | null) => {
    setActiveTab(tab);
  };

  return (
    <>
      <main>
        <Navbar
          onTabChange={handleTabChange}
          setProdutosData={setProdutosData}
          setClientesData={setClientesData}
        />
        <section className={`${styles.sectionIMG} ${activeTab ? styles.noBackground : ''}`}>
          {activeTab === "Cadastro de Produtos" && (
            <CadastroProdutos data={produtosData} setData={setProdutosData} />
          )}
          {activeTab === "Cadastro de Clientes" && (
            <CadastroClientes data={clientesData} setData={setClientesData} />
          )}
        </section>
        <Footer />
      </main>
    </>
  );
};

export default Home;
