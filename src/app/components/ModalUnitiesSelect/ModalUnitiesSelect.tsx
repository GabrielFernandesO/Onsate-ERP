import React, { useEffect, useState } from "react";
import styles from "./ModalUnitiesSelect.module.css";
import Image from "next/image";
import { toast } from "react-toastify";

interface unityData {
  id: number;
  name: string;
  description: string;
}

interface ModalProps {
  isOpen: boolean;
  closeModal: () => void;
  title: string; // Tipo de input, pode ser "text" ou "number"
  onSelectUnity: (unityId: number) => void;
  selectNumber : number
}

const limitItemsPerPage = 12;

const ModalUnitiesSelect: React.FC<ModalProps> = ({
  isOpen,
  closeModal,
  onSelectUnity,
  selectNumber
}) => {
  const [data, setData] = useState<unityData[]>([]);
  const [addData, setAddData] = useState(false);
  const [nameUnity, setNameUnity] = useState("");
  const [descriptionUnity, setDescriptionUnity] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [selected, setSelected] = useState<number>(-1);

  useEffect(() => {
    setSelected(selectNumber); // Update selected state based on selectNumber prop
  }, [selectNumber]);

  //Req para puxar os dados para a tabela
  useEffect(() => {
    console.log(selected, "valor inicial")
    const fetchData = async () => {
      try {
        const response = await fetch(
          `http://26.56.52.76:8000/unitytype?limit=${limitItemsPerPage}&page=${
            currentPage + 1
          }`
        );

        if (response.ok) {
          const data = await response.json();
          setData(data.unityTypes);
          setTotalPages(data.totalPages);
        }
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, [currentPage]);

  const fetchUpdateTable = async () => {
    try {
      const response = await fetch(
        `http://26.56.52.76:8000/unitytype?limit=12`
      );

      if (response.ok) {
        const data = await response.json();
        setData(data.unityTypes);
        setTotalPages(data.totalPages);
        setCurrentPage(0);
        setSelected(-1)
      }
    } catch (err) {
      console.log(err);
    }
  };

  //Limpa os campos de adicionar a unidade
  const clearForm = () => {
    setNameUnity("");
    setDescriptionUnity("");
  };

  //Permite apenas Letras
  const handleInputLetters = (e: React.FormEvent<HTMLInputElement>): void => {
    const target = e.target as HTMLInputElement;
    // Substitui qualquer coisa que não seja uma letra (A-Z, a-z)
    target.value = target.value.replace(/[^A-Za-záàâãäéèêíïóôõöúüç ]/g, "");
  };

  //Abre o Modal para adicionar
  const handleAddData = () => {
    setAddData(!addData);
    setErrorMessage(null);
  };

  //Post do novo data
  const handlePostData = async () => {
    let error: string | null = null;

    if (
      nameUnity == "" ||
      descriptionUnity == "" ||
      !nameUnity ||
      !descriptionUnity
    ) {
      error = "Há campos vazios!";
    }

    if (error) {
      setErrorMessage(error);
      return; // Impede o envio dos dados se houver erro
    }

    setErrorMessage(null);

    const formData = {
      name: nameUnity,
      description: descriptionUnity,
    };

    console.log(formData);

    try {
      const response = await fetch(
        "http://26.56.52.76:8000/unitytype?limit=2",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (response.status === 201) {
        toast.success("Unidade Adicionada");
        console.log("Enviou!");
        setAddData(false);
        fetchUpdateTable();
        clearForm();
        setErrorMessage(null);
      }
    } catch (err) {
      toast.error("Ocorreu algum erro ao adicionar a unidade, tente novamente");
      console.log(err);
    }
  };

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

  const handleDoubleClick = (unityId: number) => {
    console.log(unityId, "Nome para o campo");
    onSelectUnity(unityId);
    closeModal(); // Fecha o modal após a seleção
  };

  const handleSelectLineBtn = () =>{
    if(selected == -1){
      return
    }
    handleDoubleClick(selected+1)
  }

  if (!isOpen) return null; // Não renderiza o modal se não estiver aberto

  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <h1>Unidades</h1>
        <div className={styles.containerModal}>
          <div className={styles.tableContainer}>
            {addData && (
              <div className={styles.modalOverlay}>
                <form className={styles.form}>
                  <div className={styles.headerForm}>
                    <h3>Adicionar unidade</h3>
                    <div className={styles.saveChangesIcons}>
                      <Image
                        src={"/icons/disket-no-borders.svg"}
                        width={22}
                        height={22}
                        alt="save-icon"
                        onClick={handlePostData}
                      />
                      <Image
                        src={"/icons/back-no-borders.svg"}
                        width={22}
                        height={22}
                        alt="back-icon"
                        onClick={handleAddData}
                      />
                    </div>
                  </div>
                  {errorMessage && (
                    <div className={styles.errorMessage}>
                      <p>{errorMessage}</p>
                    </div>
                  )}
                  <div className={styles.inputs}>
                    <div>
                      {" "}
                      <label>Sigla</label>
                      <input
                        type="text"
                        maxLength={4}
                        placeholder="ex: Kg"
                        onChange={(e) => setNameUnity(e.target.value)}
                        onInput={handleInputLetters}
                        className={styles.sigle}
                      />
                    </div>
                    <div>
                      {" "}
                      <label>Descrição</label>
                      <input
                        type="text"
                        maxLength={20}
                        placeholder="ex: Quilograma"
                        onChange={(e) => setDescriptionUnity(e.target.value)}
                        onInput={handleInputLetters}
                        className={styles.description}
                      />
                    </div>
                  </div>
                </form>
              </div>
            )}{" "}
            <div className={styles.inputSearch}>
              <input type="text" />
            </div>
            <div className={styles.divTable}>
              <table className={styles.tabela}>
                <thead>
                  <tr>
                    <th>Código</th>
                    <th>Sigla</th>
                    <th>Descrição</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((item, index) => (
                    <tr
                      key={item.id}
                      onClick={() => handleSelectLine(index)}
                      className={`${selected === index ? styles.selecionado : ""}`}
                      onDoubleClick={() => handleDoubleClick(item.id)}
                    >
                      <td>{item.id}</td>
                      <td>{item.name}</td>
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
              src={"icons/add-icon.svg"}
              width={30}
              height={30}
              alt="add-icon"
              onClick={handleAddData}
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
