import React, { useEffect, useState, useRef, useCallback } from "react";
import styles from "./ModalCEST.module.css";
import Image from "next/image";
import { toast } from "react-toastify";
import debounce from "lodash/debounce";

interface cestData {
  id: number;
  cestCode: string;
  description: string;
}

interface ModalProps {
  isOpen: boolean;
  closeModal: () => void;
  title: string; // Tipo de input, pode ser "text" ou "number"
  onSelectUnity: (cest: string) => void;
  selectNumber: number;
}

interface ItemFilter {
  item: string;
  svg: string;
  field: string;
}

const tableFilter: ItemFilter[] = [
  {
    item: "Código",
    svg: "/icons/code-icon.svg",
    field: "id",
  },
  {
    item: "Cest",
    svg: "/icons/unity-icon.svg",
    field: "cestCode",
  },
  {
    item: "Descrição",
    svg: "/icons/description-icon.svg",
    field: "description",
  },
];


const limitItemsPerPage = 12;

const ModalUnitiesSelect: React.FC<ModalProps> = ({
  isOpen,
  closeModal,
  onSelectUnity,
  selectNumber,
}) => {
  const [data, setData] = useState<cestData[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [selected, setSelected] = useState<number>(-1);
  const [initialTotalPages, setInitialTotalPages] = useState<number>(0)
  const [initialCests, setInitialCests] = useState<cestData[]>([]);
  const [dropDownSearch, setDropDownSearch] = useState<boolean>(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");

  useEffect(() => {
    setSelected(selectNumber); // Update selected state based on selectNumber prop
  }, [selectNumber]);

  //Const useRef para verificar qual elemento o usuário está clicando
  //PAra lidar com o dropdown do filtro da barra de pesquisa
  const dropdownRef = useRef<HTMLDivElement>(null);

  //Req para puxar os dados para a tabela
  useEffect(() => {
    const fetchData = async () => {

      setSelected(-1)

      try {
        const response = await fetch(
          `http://26.56.52.76:8000/cestcode?limit=${limitItemsPerPage}&page=${currentPage + 1}
          }`
        );

        if (response.ok) {
          const data = await response.json();
          setData(data.cest);
          setInitialCests(data.cest);
          setTotalPages(data.totalPages);
          setInitialTotalPages(data.totalPages)
        }
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, [currentPage]);


  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1));
    setSelected(-1);
  };

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 0));
    setSelected(-1);
  };

  const handleSelectLine = (index: number) => {
    const novosselecteds = index;

    if (selected == index) {
      setSelected(-1);
      return;
    }

    setSelected(novosselecteds);
  };

  const handleDoubleClick = (cest: string) => {
    console.log(cest, "Nome para o campo");
    onSelectUnity(cest);
    closeModal(); // Fecha o modal após a seleção
  };

  const handleSelectLineBtn = () => {
    if (selected == -1) {
      return;
    }

    const cestSelected = data.filter((item, index) => index === selected);

    handleDoubleClick(cestSelected[0].cestCode);
  };

  //Dropdown da barra de pesquisa
  const handleDropdownToggle = () => {
    setDropDownSearch((prev) => !prev);
  };

  const handleOptionClick = (index: number) => {
    setSelectedOption(index);
    setDropDownSearch(false); // Close dropdown on selection
    setSearchTerm(""); // Limpa o campo de busca ao mudar de filtro
  };

  //clear selected option dropwdon
  const handleClearOptionClick = () => {
    setSelectedOption(null);
    setSearchTerm("");
    setData(initialCests);
    setCurrentPage(0)
    setTotalPages(initialTotalPages)


  };

  //Verifica se o clique foi fora do dropdown para fechar
  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setDropDownSearch(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Debounce da função fetchData]
  //Só chama a req de filtro depois de 500ms ou seja
  //Vai esperar 500ms para ver se outra tecla não vai ser pressionada
  //Evitando várias reqs ao db
  const debouncedFetchData = useCallback(
    debounce((value: string, field: string) => filterData(value, field), 500), // 500ms de atraso
    []
  );

  // Function onchange do input de pesquisar, caso um filtro não esteja selecionado
  //Solicita a escolha de um e reseta os estados abaixo
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (selectedOption == null) {
      toast.info("Selecione um Filtro antes de pesquisar");
      setSearchTerm("");
      setCurrentPage(0);
      return;
    }

    const fieldValue = tableFilter[selectedOption].field;
    console.log(fieldValue);
    const value = e.target.value;
    setSearchTerm(value);
    debouncedFetchData(value, fieldValue);
  };

  // Função que será chamada para realizar a requisição com base no filtro
  const filterData = async (searchTerm: string, field: string) => {
    try {
      const res = await fetch(
        //Esconder url da api futuramente
        `http://26.56.52.76:8000/cestcode?${field}=${searchTerm}&limit=${limitItemsPerPage}}`
      );
      const data = await res.json();
      setData(data.cest);
      setTotalPages(data.totalPages);
    } catch {
      console.log("Ocorreu algum erro");
    }
  };

  if (!isOpen) return null; // Não renderiza o modal se não estiver aberto

  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <h1>CESTS</h1>
        <div className={styles.containerModal}>
          <div className={styles.tableContainer}>
            <div className={styles.inputSearch}>
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                onClick={handleDropdownToggle}
              >
                <path d="M12 15L7 10H17L12 15Z" fill="black" />
              </svg>
              {selectedOption !== null && (
                <div className={styles.filterDivInput}>
                  <Image
                    src={"/icons/arrow-close-black-icon.svg"}
                    width={18}
                    height={18}
                    alt="close=icon"
                    onClick={handleClearOptionClick}
                  />
                  <p>{tableFilter[selectedOption].item}</p>
                </div> // Exibe o item selecionado
              )}
              <input
                id="Pesquisa"
                type="text"
                placeholder="Pesquisar"
                value={searchTerm}
                onChange={handleChange}
              />
            </div>
            {dropDownSearch && (
              <div className={styles.dropDownSearch} ref={dropdownRef}>
                {tableFilter.map((item, index) => (
                  <div
                    key={index}
                    className={`${styles.optionsFilter} ${
                      selectedOption === index ? styles.selected : ""
                    }`}
                    onClick={() => handleOptionClick(index)}
                    style={{
                      backgroundColor:
                        selectedOption === index ? "#cacaca" : "transparent",
                    }} // Apply background color
                  >
                    <Image
                      src={item.svg}
                      width={20}
                      height={20}
                      alt={`icon ${item.item}`}
                    />
                    <p>{item.item}</p>
                  </div>
                ))}
              </div>
            )}
            <div className={styles.divTable}>
              <table className={styles.tabela}>
                <thead>
                  <tr>
                    <th className={styles.columnCode}>Código</th>
                    <th>Ncm</th>
                    <th>Descrição</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((item, index) => (
                    <tr
                      key={item.id}
                      onClick={() => handleSelectLine(index)}
                      className={`${
                        selected === index ? styles.selecionado : ""
                      }`}
                      onDoubleClick={() => handleDoubleClick(item.cestCode)}
                    >
                      <td>{item.id}</td>
                      <td>{item.cestCode}</td>
                      <td>{item.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className={styles.paginacao}>
                <div>
                  Página {currentPage + 1} de {totalPages == 0 ? 1 : totalPages}
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
                  disabled={currentPage >= totalPages - 1}
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
            </div>
          </div>
          <div className={styles.iconsControl}>
            <Image
              src={"/icons/check-icon.svg"}
              width={30}
              height={30}
              alt="check-icon"
              onClick={handleSelectLineBtn}
              className={styles.iconBorder}
            />
            <Image
              src={"icons/arrow-back-icon.svg"}
              width={30}
              height={30}
              alt="Arrowback-icon"
              onClick={closeModal}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalUnitiesSelect;
