"use client";

import { useState } from "react";
import styles from './page.module.css'
import Navbar from "./components/Navbar/Navbar";
import CadastroProdutos from "./components/pages/CadastroProdutos/CadastroProdutos";
import CadastroClientes from "./components/pages/CadastroClientes/CadastroClientes";
import Footer from "./components/Footer/Footer";

//Página principal estática

const Home = () => {

  //States
  const [produtosData, setProdutosData] = useState("");
  const [clientesData, setClientesData] = useState("");
  const [activeTab, setActiveTab] = useState<string | null>(null);


  //Função que define qual aba está ativa
  //Essa function vem da navbar para ca atraves do ontabChange
  const handleTabChange = (tab: string | null) => {
    setActiveTab(tab);
  };

  //Funçãoq ue renderiza as "pages" que no caso aqui são componentes
  //Componentes esses que recebem os states que armazenam seus dados, caso a aba seja fechada
  //Essa logica de limpar encontra-se na navbar

  const renderTabContent = () => {
    switch (activeTab) {
      case "Cadastro de Produtos":
        return (
          <CadastroProdutos data={produtosData} setData={setProdutosData} />
        );
      case "Cadastro de Clientes":
        return (
          <CadastroClientes data={clientesData} setData={setClientesData} />
        );
      default:
        return null;
    }
  };

  return (
    <>
      <main>
        <Navbar
          onTabChange={handleTabChange}
          setProdutosData={setProdutosData}
          setClientesData={setClientesData}
        />
        <section className={`${styles.sectionIMG} ${activeTab ? styles.noBackground : ''}`}>{renderTabContent()}</section>
        <Footer/>
      </main>
    </>
  );
};

export default Home;
