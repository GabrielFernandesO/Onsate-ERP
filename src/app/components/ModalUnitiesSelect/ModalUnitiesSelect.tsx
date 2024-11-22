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
  title: string;
  inputType: "text" | "number"; // Tipo de input, pode ser "text" ou "number"
}

const ModalUnitiesSelect: React.FC<ModalProps> = ({
  isOpen,
  closeModal,
}) => {
  const [data, setData] = useState<unityData[]>([]);
  const [addData, setAddData] = useState(false);
  const [nameUnity, setNameUnity] = useState("");
  const [descriptionUnity, setDescriptionUnity] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  //Req para puxar os dados para a tabela
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://26.56.52.76:8000/unitytype`);

        if (response.ok) {
          const data = await response.json();
          setData(data);
        }
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, []);


  const fetchUpdateTable = async () => {
    try {
      const response = await fetch(`http://26.56.52.76:8000/unitytype`);

      if (response.ok) {
        const data = await response.json();
        setData(data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  //Permite apenas Letras
  const handleInputLetters = (e: React.FormEvent<HTMLInputElement>): void => {
    const target = e.target as HTMLInputElement;
    // Substitui qualquer coisa que não seja uma letra (A-Z, a-z)
    target.value = target.value.replace(/[^A-Za-z]/g, "");
  };

  //Abre o Modal para adicionar
  const handleAddData = () => {
    setAddData(!addData);
  };

  //Post do novo data
  const handlePostData = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
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

    console.log(formData)

    try {
      const response = await fetch("http://26.56.52.76:8000/unitytype", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if(response.status === 201){
        toast.success("Unidade Adicionada")
        console.log("Enviou!");
        setAddData(false);
        fetchUpdateTable()
      }

    } catch (err) {
      toast.error("Ocorreu algum erro ao adicionar a unidade, tente novamente")
      console.log(err);
    }


  };

  if (!isOpen) return null; // Não renderiza o modal se não estiver aberto

  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <h1>Unidades</h1>
        <div className={styles.containerModal}>
          <div className={styles.tableContainer}>
            {addData && (
              <div className={styles.modalOverlay}>
                <form onSubmit={handlePostData} className={styles.form}>
                  <h3>Adicionar unidade</h3>
                  {errorMessage && (
                    <div className={styles.errorMessage}>
                      <p>{errorMessage}</p>
                    </div>
                  )}
                  <div className={styles.inputs}>
                    <label>Sigla</label>
                    <input
                      type="text"
                      maxLength={4}
                      placeholder="ex: Kg"
                      onChange={(e) => setNameUnity(e.target.value)}
                      onInput={handleInputLetters}
                    />
                    <label>Descrição</label>
                    <input
                      type="text"
                      maxLength={20}
                      placeholder="ex: Quilograma"
                      onChange={(e) => setDescriptionUnity(e.target.value)}
                      onInput={handleInputLetters}
                    />
                  </div>
                  <div className={styles.btns}>
                    <button className={styles.btnSubmit} type="submit">
                      Adicionar
                    </button>
                    <button
                      onClick={handleAddData}
                      className={styles.btnCancel}
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              </div>
            )}{" "}
            <table className={styles.tabela}>
              <thead>
                <tr>
                  <th>Código</th>
                  <th>Sigla</th>
                  <th>Descrição</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item) => (
                  <tr key={item.id}>
                    <td>{item.id}</td>
                    <td>{item.name}</td>
                    <td>{item.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className={styles.iconsControl}>
            <Image
              className={styles.iconAdd}
              src={"icons/add-icon.svg"}
              width={28}
              height={28}
              alt="add-icon"
              onClick={handleAddData}
            />
            <Image
              src={"icons/arrow-back-icon.svg"}
              width={28}
              height={28}
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
