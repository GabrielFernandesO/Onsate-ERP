"use client";

import React from "react";
import styles from "./TableData.module.css";
import { useState } from "react";

interface Item {
  codigo: string;
  cdBarra: string;
  descricao: string;
  unidade: string;
  precoVenda: number;
  grupo: string;
  subGrupo: string;
}

const tableData: Item[] = [
  {
    codigo: "001",
    cdBarra: "1234567890123",
    descricao: "Produto 1",
    unidade: "unidade",
    precoVenda: 100000.50,
    grupo: "Grupo A",
    subGrupo: "Subgrupo A1",
  },
  {
    codigo: "002",
    cdBarra: "1234567890124",
    descricao: "A tecnologia avança rapidamente, transformando a maneira como nos comunicamos, trabalhamos e vivemos no dia a dia.",
    unidade: "unidade",
    precoVenda: 20.0,
    grupo: "Grupo A",
    subGrupo: "Subgrupo A2",
  },
  {
    codigo: "002",
    cdBarra: "1234567890124",
    descricao: "Produto 3",
    unidade: "unidade",
    precoVenda: 20.0,
    grupo: "Grupo A",
    subGrupo: "Subgrupo A2",
  },
  {
    codigo: "002",
    cdBarra: "1234567890124",
    descricao: "Produto 4",
    unidade: "unidade",
    precoVenda: 20.0,
    grupo: "Grupo A",
    subGrupo: "Subgrupo A2",
  },
  {
    codigo: "002",
    cdBarra: "1234567890124",
    descricao: "Produto 5",
    unidade: "unidade",
    precoVenda: 20.0,
    grupo: "Grupo A",
    subGrupo: "Subgrupo A2",
  },
  {
    codigo: "002",
    cdBarra: "1234567890124",
    descricao: "Produto 6",
    unidade: "unidade",
    precoVenda: 20.0,
    grupo: "Grupo A",
    subGrupo: "Subgrupo A2",
  },

  // Adicione mais itens conforme necessário
];

const ITEMS_PER_PAGE = 3;

const TableData: React.FC = () => {
  const [selecionados, setSelecionados] = useState<boolean[]>(
    Array(tableData.length).fill(false)
  );
  const [currentPage, setCurrentPage] = useState<number>(0);

  const handleCheckboxChange = (index: number) => {
    const novosSelecionados = [...selecionados];
    novosSelecionados[index] = !novosSelecionados[index];
    setSelecionados(novosSelecionados);
  };

  const handleNextPage = () => {
    setCurrentPage((prev) =>
      Math.min(prev + 1, Math.ceil(tableData.length / ITEMS_PER_PAGE) - 1)
    );
  };

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 0));
  };

  const startIndex = currentPage * ITEMS_PER_PAGE;
  const currentItems = tableData.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <>
      <table className={styles.tabela}>
        <thead>
          <tr>
            <th className={styles.colunaSelecionar}>Selecionar</th>
            <th>Código</th>
            <th>Cd. Barra</th>
            <th>Descrição</th>
            <th>Unidade</th>
            <th>Preço Venda</th>
            <th>Grupo</th>
            <th>Sub-Grupo</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((item, index) => (
            <tr
              key={startIndex + index}
              className={`${
                (startIndex + index) % 2 === 0
                  ? styles.linhaPar
                  : styles.linhaImpar
              } ${selecionados[startIndex + index] ? styles.selecionado : ""}`}
            >
              <td className={styles.checkbox}>
                <input
                  type="checkbox"
                  checked={selecionados[startIndex + index]}
                  onChange={() => handleCheckboxChange(startIndex + index)}
                  id={`checkBox-${startIndex + index}`}
                />
              </td>
              <td>{item.codigo}</td>
              <td>{item.cdBarra}</td>
              <td className={styles.colunaDescricao}>{item.descricao}</td>
              <td className={styles.colunaUnidade}>{item.unidade}</td>
              <td className={styles.colunaPrecoVenda}>{item.precoVenda.toFixed(2)}</td>
              <td>{item.grupo}</td>
              <td>{item.subGrupo}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className={styles.paginacao}>
        <div>
          Página {currentPage + 1} de{" "}
          {Math.ceil(tableData.length / ITEMS_PER_PAGE)}
        </div>
        <button
          className={styles.btnArrowLeft}
          onClick={handlePreviousPage}
          disabled={currentPage === 0}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M7.979 10L4.1665 6.16667L5.33317 5L10.3332 10L5.33317 15L4.1665 13.8333L7.979 10ZM13.479 10L9.6665 6.16667L10.8332 5L15.8332 10L10.8332 15L9.6665 13.8333L13.479 10Z"
              fill="black"
              fillOpacity="0.8"
            />
          </svg>
        </button>
        <button
          onClick={handleNextPage}
          disabled={
            currentPage >= Math.ceil(tableData.length / ITEMS_PER_PAGE) - 1
          }
          className={styles.btnArrowRight}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M7.979 10L4.1665 6.16667L5.33317 5L10.3332 10L5.33317 15L4.1665 13.8333L7.979 10ZM13.479 10L9.6665 6.16667L10.8332 5L15.8332 10L10.8332 15L9.6665 13.8333L13.479 10Z"
              fill="black"
              fillOpacity="0.8"
            />
          </svg>
        </button>
      </div>
    </>
  );
};

export default TableData;
