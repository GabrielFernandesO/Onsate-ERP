"use client";
import Footer from "./components/Footer/Footer";
import Navbar from "./components/Navbar/Navbar";
import CadastroProdutos from "./components/pages/CadastroProdutos";
import styles from "./page.module.css";
import { useState } from "react";

export default function Home() {
  const [activeTab, setActiveTab] = useState<string | null>(null);

  const handleTabChange = (tab: string | null) => {
    setActiveTab(tab);
    // Lógica adicional se necessário, como navegação ou chamadas de API
  };

  const renderContent = () => {
    switch (activeTab) {
      case "Cadastro de Produtos":
        return <CadastroProdutos/>;
      case "Cadastro de Clientes":
        return <div>Conteúdo do Cadastro de Clientes</div>;
      case "Pedido de Venda":
        return <div>Conteúdo do Pedido de Venda</div>;
      // Adicione outros casos conforme necessário
      default:
     
    }
  };

  return (
    <main>
      <Navbar onTabChange={handleTabChange} />
      <section  className={`${styles.sectionIMG} ${activeTab ? styles.noBackground : ''}`}>{renderContent()}</section>
      <Footer />
    </main>
  );
}
