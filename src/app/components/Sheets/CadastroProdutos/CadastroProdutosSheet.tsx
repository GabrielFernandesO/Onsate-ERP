"use client";

import React from "react";
import styles from "./CadastroProdutosSheet.module.css";
import { atom, useAtom } from "jotai";
import { useState, useEffect } from "react";
import Image from "next/image";
import { toast } from "react-toastify";


//Interfaces

interface CadastroProdutosSheetProps {
  clearFormFlag: boolean;
  addProductFlag: boolean;
  resetFlags: () => void; // Função para resetar os flags
  handleAddProduct: () => void; // Função para adicionar o produto
  handleClearForm: () => void; // Função para limpar o formulário
}

interface selectType {
  id: number;
  name: string;
}

// Definindo átomos para cada campo de input
//Irão inicializar os valores nos inputs
export const descriptionAtom = atom<string | null>(null);
export const unityTypeAtom = atom<string | null>(null);
export const barCodeAtom = atom<string | null>(null);
export const ncmAtom = atom<string | null>(null);
export const exNcmAtom = atom<string | null>(null);
export const cestIdAtom = atom<string | null>(null);
export const priceAtom = atom<string | null>(null);
export const groupIdAtom = atom<string | null>(null);
export const subGroupIdAtom = atom<string | null>(null);
export const reservedStockAtom = atom<string | null>(null);
export const stockAtom = atom<string | null>(null);
export const grossWeightAtom = atom<string | null>(null);
export const liquidWeightAtom = atom<string | null>(null);

const CadastroProdutosSheet: React.FC<CadastroProdutosSheetProps> = ({
  clearFormFlag,
  addProductFlag,
  resetFlags,
  handleAddProduct,
  handleClearForm,
}) => {
  // Usando os átomos com useAtom para obter e definir o estado
  const [description, setDescription] = useAtom(descriptionAtom);
  const [unityType, setUnityType] = useAtom(unityTypeAtom);
  const [barCode, setBarCode] = useAtom(barCodeAtom);
  const [ncm, setNcm] = useAtom(ncmAtom);
  const [exNcm, setExNcm] = useAtom(exNcmAtom);
  const [cestId, setCestId] = useAtom(cestIdAtom);
  const [price, setPrice] = useAtom(priceAtom);
  const [groupId, setGroupId] = useAtom(groupIdAtom);
  const [subGroupId, setSubGroupId] = useAtom(subGroupIdAtom);
  const [reservedStock, setReservedStock] = useAtom(reservedStockAtom);
  const [stock, setStock] = useAtom(stockAtom);
  const [grossWeight, setGrossWeight] = useAtom(grossWeightAtom);
  const [liquidWeight, setLiquidWeight] = useAtom(liquidWeightAtom);
  // Estado de mensagens de erro
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  //Data para selects
  const [unitySelect, setUnitySelect] = useState<selectType[]>([]);
  const [groupSelect, setGroupSelect] = useState<selectType[]>([]);
  const [subGroupSelect, setSubGroupSelect] = useState<selectType[]>([]);

  //DAdos para preencher o select que vem do banco
  useEffect(() => {
    // Função para buscar os dados
    const fetchData = async () => {
      try {
        // Realiza as três requisições em paralelo usando Promise.all
        const [responseUnity, responseGroups] = await Promise.all([
          fetch("http://26.56.52.76:8000/getunitytypes"),
          fetch("http://26.56.52.76:8000/getgroups"),
          //fetch("http://api.exemplo3.com/data"),
        ]);

        // Verifica se as respostas foram bem-sucedidas
        if (!responseUnity.ok || !responseGroups.ok) {
          throw new Error("Erro ao buscar dados");
        }

        // Converte as respostas para JSON
        const dataUnity = await responseUnity.json();
        const dataGroup = await responseGroups.json();

        // Atualiza os estados com os dados recebidos
        setUnitySelect(dataUnity);
        setGroupSelect(dataGroup);

        console.log(dataGroup, "Aqui");
      } catch (error) {
        console.error("Erro na requisição:", error);
      }
    };

    fetchData(); // Chama a função de busca de dados
  }, []);

  //Function para puxar o relacional do Grupo com seus grupos
  const handleSubGroups = async (id: number) =>{
    try{
      const response = await fetch(`http://26.56.52.76:8000/getsubgroups?groupsId=${id}`)

      const data = await response.json()

      setSubGroupSelect(data);
      console.log(data);

      if(!response.ok){
        console.log("Erro na chamada");
        toast.error("O Grupo procurado não tem Sub-Grupos")
      }




    }catch(err){
      console.error(err)
      toast.error("Erro na requisição")
    }
  }

  //Function para resetar os valores quando o form é enviado
  const resetForm = () => {
    setDescription("");
    setUnityType("");
    setBarCode(null);
    setNcm("");
    setExNcm(null);
    setCestId("");
    setPrice(null);
    setGroupId(null);
    setSubGroupId(null);
    setReservedStock(null);
    setStock(null);
    setGrossWeight(null);
    setLiquidWeight(null);
  };

  //Function para enviar os dados para o backend
  const handleSubmit = async () => {
    let error: string | null = null;

    // Verificando se os campos estão vazios
    if (!description || description.trim() === "") {
      error = "O campo descrição não pode estar vazio.";
    } else if (!unityType || unityType.trim() === "") {
      error = "O campo unidade não pode estar vazio.";
    } else if (!ncm || ncm.trim() === "") {
      error = "O campo NCM não pode estar vazio.";
    } else if (!price || price.trim() === "") {
      error = "O campo preço de venda não pode estar vazio.";
    }

    // Se algum erro foi encontrado, define o erro e não envia os dados
    if (error) {
      setErrorMessage(error);
      return; // Impede o envio dos dados se houver erro
    }

    // Se não houver erro, limpa a mensagem de erro
    setErrorMessage(null);

    // Dados do formulário
    const dataForm = {
      description: description,
      unity_type: unityType,
      ...(barCode && { bar_code: parseInt(barCode) }),
      ncm: ncm,
      ...(exNcm && { ex_ncm: parseInt(exNcm) }),
      ...(cestId && { cestId: parseInt(cestId) }),
      ...(price && { price: parseFloat(price) }),
      ...(groupId && { group: parseInt(groupId) }),
      ...(subGroupId && { sub_group: parseInt(subGroupId) }),
      ...(reservedStock && { reserved_stock: parseInt(reservedStock) }),
      ...(stock && { stock: parseInt(stock) }),
      ...(grossWeight && { gross_weight: parseFloat(grossWeight) }),
      ...(liquidWeight && { liquid_weight: parseFloat(liquidWeight) }),
    };

    // Fazer REQ da API
    console.log("Formulário enviado com sucesso!", dataForm);

    try {
      const response = await fetch("http://26.56.52.76:8000/postproducts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataForm), // Converte o objeto para JSON
      });

      // Verifica se a resposta foi bem-sucedida
      if (!response.ok) {
        toast.error("Ocorreu um erro de requisição, tente novamente!");
        return;
      }

      if (response.status === 201) {
        //Api não retorna json, então não fazer nada com response

        console.log("Produto postado com sucesso:");
        toast.success("Produto adicionado com sucesso!");
      }
    } catch (error) {
      console.log(error);
      toast.error("Erro ao postar o produto");
    }

    // Resetar o formulário após o envio
    resetForm();
  };

  // Função para limpar a mensagem de erro quando o usuário começar a digitar (Input)
  const handleInputChange = (
    setter: React.Dispatch<React.SetStateAction<string | null>>
  ) => {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      setter(e.target.value || null); // Atualiza o valor ou atribui null caso esteja vazio
      setErrorMessage(null); // Limpa a mensagem de erro ao digitar
    };
  };

  //Function para somente permitir números em um input detexto
  const handleInputNumber = (e: React.FormEvent<HTMLInputElement>): void => {
    const target = e.target as HTMLInputElement;
    target.value = target.value.replace(/\D/g, ""); // Remove qualquer coisa que não seja número
  };

  const handleInputNumberFloat = (
    e: React.FormEvent<HTMLInputElement>
  ): void => {
    const target = e.target as HTMLInputElement;

    // Permite apenas números, vírgulas e pontos como caracteres válidos
    target.value = target.value.replace(/[^0-9,\.]/g, "");

    // Permite apenas um ponto ou uma vírgula
    // Caso a vírgula seja encontrada, converte para ponto para evitar duplicidade
    if (target.value.indexOf(",") !== -1) {
      target.value = target.value.replace(",", ".");
    }

    // Limita para que apenas um ponto seja inserido
    const pointCount = target.value.split(".").length - 1;
    if (pointCount > 1) {
      target.value = target.value.substring(0, target.value.lastIndexOf("."));
    }
  };

  // Função para limpar a mensagem de erro quando o usuário começar a digitar (Select)
  const handleSelectChange = (
    setter: React.Dispatch<React.SetStateAction<string | null>>
  ) => {
    return (e: React.ChangeEvent<HTMLSelectElement>) => {
      setter(e.target.value || null); // Atualiza o valor ou atribui null caso esteja vazio
      setErrorMessage(null); // Limpa a mensagem de erro ao selecionar
    };
  };

  const handleSelectChangeGroup = (
    setter: React.Dispatch<React.SetStateAction<string | null>>
  ) => {
    return (e: React.ChangeEvent<HTMLSelectElement>) => {
      setter(e.target.value || null); // Atualiza o valor ou atribui null caso esteja vazio
      setErrorMessage(null); // Limpa a mensagem de erro ao selecionar
      handleSubGroups(parseInt(e.target.value))
    };
  };

  // Funções para tratar as flags de controle
  useEffect(() => {
    if (clearFormFlag) {
      resetForm();
      handleClearForm();
      resetFlags(); // Reseta os flags no pai
    }
  }, [clearFormFlag, resetFlags]);

  useEffect(() => {
    if (addProductFlag) {
      handleAddProduct();
      handleSubmit(); // Passando um objeto vazio como evento
      resetFlags(); // Reseta os flags no pai
    }
  }, [addProductFlag, resetFlags, handleAddProduct]);

  return (
    <main className={styles.main}>
      <div className={styles.formContainer}>
        <form onSubmit={handleSubmit}>
          {errorMessage && (
            <div className={styles.errorMessage}>
              <p>{errorMessage}</p>
            </div>
          )}
          <div className={styles.firstLineInput}>
            <label>
              Descrição<span style={{ color: "red" }}>*</span>
            </label>
            <input
              type="text"
              value={description || ""}
              onChange={handleInputChange(setDescription)}
              maxLength={100}
              placeholder="ex: papel grafite"
            />
          </div>

          <div className={styles.secondLineInputs}>
            <div className={styles.inputWrapContainer}>
              <label>
                Unidade<span style={{ color: "red" }}>*</span>
              </label>
              <div className={styles.divInputIcon}>
                <select
                  value={unityType || ""}
                  onChange={handleSelectChange(setUnityType)}
                  className={styles.unityInput}
                >
                  <option value="">Selecione</option>
                  {unitySelect.map((unity) => (
                    <option key={unity.name} value={unity.name}>
                      {unity.name}
                    </option>
                  ))}
                </select>
                <Image
                  src={"icons/search-input-icon.svg"}
                  width={20}
                  height={20}
                  alt="searchIcon"
                />
              </div>
            </div>

            <div className={styles.inputWrapContainer}>
              <label>Código de barras</label>
              <input
                type="text"
                value={barCode || 0}
                onChange={(e) => setBarCode(e.target.value)}
                maxLength={13}
                placeholder="ex: 1698189354175"
                onInput={handleInputNumber}
                className={styles.barCodeInput}
              />
            </div>

            <div className={styles.inputWrapContainer}>
              <label>
                NCM<span style={{ color: "red" }}>*</span>
              </label>
              <div className={styles.divInputIcon}>
                <select
                  value={ncm || ""}
                  onChange={handleSelectChange(setNcm)}
                  className={styles.ncmInput}
                >
                  <option value="">Selecione</option>
                  <option value="01">01</option>
                  <option value="01.01">01.01</option>
                  <option value="0101.2">0101.2</option>
                </select>
                <Image
                  src={"icons/search-input-icon.svg"}
                  width={20}
                  height={20}
                  alt="searchIcon"
                />
              </div>
            </div>

            <div className={styles.inputWrapContainer}>
              <label>EX NCM</label>
              <input
                type="text"
                value={exNcm || ""}
                onChange={(e) => setExNcm(e.target.value)}
                placeholder="ex: 1698"
                maxLength={4}
                onInput={handleInputNumber}
                className={styles.ex_ncmInput}
              />
            </div>

            <div className={styles.inputWrapContainer}>
              <label>Código CEST</label>
              <div className={styles.divInputIcon}>
                <select
                  value={cestId || ""}
                  onChange={(e) => setCestId(e.target.value)}
                  className={styles.cestIdInput}
                >
                  <option value="">Selecione</option>
                  <option value="1232145">1232145</option>
                  <option value="1235214">1235214</option>
                  <option value="6523145">6523145</option>
                </select>
                <Image
                  src={"icons/search-input-icon.svg"}
                  width={20}
                  height={20}
                  alt="searchIcon"
                />
              </div>
            </div>

            <div className={styles.inputWrapContainer}>
              <label>
                Preço de venda R$<span style={{ color: "red" }}>*</span>
              </label>
              <input
                type="text"
                value={price || ""}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="ex: 250"
                onInput={handleInputNumberFloat}
                className={styles.priceInput}
              />
            </div>
          </div>

          <div className={styles.thirdLineInputs}>
            <div className={styles.inputWrapContainer}>
              <label>Grupo</label>
              <div className={styles.divInputIcon}>
                {" "}
                <select
                  value={groupId || ""}
                  onChange={handleSelectChangeGroup(setGroupId)}
                  className={styles.groupInput}
                >
                  <option value="">Selecione</option>
                  {groupSelect.map((group) => (
                    <option key={group.id} value={group.id}>
                      {group.name}
                    </option>
                  ))}
                </select>
                <Image
                  src={"icons/search-input-icon.svg"}
                  width={20}
                  height={20}
                  alt="searchIcon"
                />
              </div>
            </div>

            <div className={styles.inputWrapContainer}>
              <label>Sub grupo</label>
              <div className={styles.divInputIcon}>
              <select
                  value={subGroupId || ""}
                  onChange={handleSelectChange(setSubGroupId)}
                  className={styles.subGroupInput}
                >
                  <option value="">Selecione</option>
                  {subGroupSelect.map((subroup) => (
                    <option key={subroup.id} value={subroup.id}>
                      {subroup.name}
                    </option>
                  ))}
                </select>
                <Image
                  src={"icons/search-input-icon.svg"}
                  width={20}
                  height={20}
                  alt="searchIcon"
                />
              </div>
            </div>

            <div className={styles.inputWrapContainer}>
              <label>Estoque reservado</label>
              <input
                type="text"
                value={reservedStock || ""}
                onChange={(e) => setReservedStock(e.target.value)}
                placeholder="ex: 5"
                onInput={handleInputNumber}
              />
            </div>

            <div className={styles.inputWrapContainer}>
              <label>Peso Bruto</label>
              <input
                type="text"
                value={grossWeight || ""}
                onChange={(e) => setGrossWeight(e.target.value)}
                placeholder="ex: 100"
                onInput={handleInputNumberFloat}
              />
            </div>

            <div className={styles.inputWrapContainer}>
              <label>Peso Líquido</label>
              <input
                type="text"
                value={liquidWeight || ""}
                onChange={(e) => setLiquidWeight(e.target.value)}
                placeholder="ex: 80"
                onInput={handleInputNumberFloat}
              />
            </div>
            <div className={styles.adjustSpace}></div>
          </div>
        </form>
      </div>
    </main>
  );
};

export default CadastroProdutosSheet;
