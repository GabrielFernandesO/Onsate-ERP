import React from "react";
import styles from "./ModalUnitiesSelect.module.css";
import Image from "next/image";

interface ModalProps {
  isOpen: boolean;
  closeModal: () => void;
  title: string;
  inputType: "text" | "number"; // Tipo de input, pode ser "text" ou "number"
}

const ModalUnitiesSelect: React.FC<ModalProps> = ({
  isOpen,
  closeModal,
  title,
  inputType,
}) => {

    //Fzr req para puxar os dados

/*     useEffect(() =>{
        const response = fetch(`http://26.56.52.76:8000`)
    }, []) */
    

  if (!isOpen) return null; // Não renderiza o modal se não estiver aberto

  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <h1>Cadastrar Unidade</h1>
        <div className={styles.containerModal}>
          <div className={styles.tableContainer}>
            {" "}
            <table className={styles.tabela}>
              <thead>
                <tr>
                  <th>Código</th>
                  <th>Sigla</th>
                  <th>Descrição</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1</td>
                  <td>TN</td>
                  <td>TONELADA</td>
                </tr>
                <tr>
                  <td>1</td>
                  <td>TN</td>
                  <td>TONELADA</td>
                </tr>
                <tr>
                  <td>1</td>
                  <td>TN</td>
                  <td>TONELADA</td>
                </tr>
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

        <form>
          <label>
            {title}
            <input
              type={inputType}
              placeholder={`Digite o valor para ${title}`}
            />
          </label>
        </form>
      </div>
    </div>
  );
};

export default ModalUnitiesSelect;
