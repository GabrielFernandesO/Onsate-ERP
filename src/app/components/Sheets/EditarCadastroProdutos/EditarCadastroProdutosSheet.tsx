"use client";

import React from "react";
import styles from "./EditarCadastroProdutosSheet.module.css";
import { useAtom } from "jotai";
import { useState, useEffect } from "react";
import Image from "next/image";
import { toast } from "react-toastify";
import { idEditAtom } from "../../TableData/TableData";
import SearchSelectNcm from "../../SearchSelect/SearchSelectNCM";
import SearchSelectCest from "../../SearchSelect/SearchSelectCest";

interface EditarCadastroProdutosSheetProps {
  clearFormFlag: boolean;
  addProductFlag: boolean;
  resetFlags: () => void; // Função para resetar os flags
  handleAddProduct: () => void; // Função para adicionar o produto
  handleClearForm: () => void; // Função para limpar o formulário
}

interface GroupOrSubgroup {
  name: string;
}

interface GetProductID {
  id: number;
  description: string;
  price: number;
  bar_code: string;
  ex_ncm: number;
  reserved_stock: number;
  gross_weight: number;
  liquid_weight: number;
  stock: number;
  ncmId: string;
  unityTypeId: string;
  group: number;
  cestId: string;
  sub_group: number;
  createdAt: string;
  updatedAt: string;
  Group: GroupOrSubgroup;
  SubGroup: GroupOrSubgroup;
}

interface selectType {
  id: number;
  name: string;
}

const EditarCadastroProdutosSheet: React.FC<
  EditarCadastroProdutosSheetProps
> = ({
  clearFormFlag,
  addProductFlag,
  resetFlags,
  handleAddProduct,
  handleClearForm,
}) => {
  // Usando os átomos com useAtom para obter e definir o estado
  const [dataGetProduct, setDataGetProduct] = useState<GetProductID[]>([]);
  const [description, setDescription] = useState<string>("");
  const [unityType, setUnityType] = useState<string>("");
  const [barCode, setBarCode] = useState<string>("");
  const [ncm, setNcm] = useState<string>("");
  const [exNcm, setExNcm] = useState<string>("");
  const [cestId, setCestId] = useState<string>("");
  const [price, setPrice] = useState<string>("");
  const [groupId, setGroupId] = useState<string>("");
  const [subGroupId, setSubGroupId] = useState<string>("");
  const [reservedStock, setReservedStock] = useState<string>("");
  const [stock, setStock] = useState<string>("");
  const [grossWeight, setGrossWeight] = useState<string>("");
  const [liquidWeight, setLiquidWeight] = useState<string>("");
  // Estado de mensagens de erro
  const [errorMessage, setErrorMessage] = useState<string | null>("");
  //ID Edit Cadastro
  const [idForEdit] = useAtom(idEditAtom);

  //Variaveis para lidar com o Button de Habilitar Edição
  const [editionButtonText, setEditionButtonText] =
    useState<string>("Habilitar Edição");
  const [ableForEdit, setAbleForEdit] = useState<boolean>(true);

  //Variaveis para os selects com options no db
  const [unitySelect, setUnitySelect] = useState<selectType[]>([]);
  const [groupSelect, setGroupSelect] = useState<selectType[]>([]);
  const [subGroupSelect, setSubGroupSelect] = useState<selectType[]>([]);

  //Select que filtra dados no backend
  const [, setInputValueNcm] = useState<string>("");
  const [, setSelectedOptionNcm] = useState<string | null>(null);
  const [, setSelectedOptionCest] = useState<string | null>(null);

  useEffect(() => {
    // Função para buscar os dados
    const fetchData = async () => {
      try {
        // Realiza as três requisições em paralelo usando Promise.all
        const [responseUnity, responseGroups, responseProductEdit] =
          await Promise.all([
            fetch("http://26.56.52.76:8000/unitytype"),
            fetch("http://26.56.52.76:8000/group"),
            fetch(
              `http://26.56.52.76:8000/product?limit=1&page=1&id=${idForEdit}`
            ),
          ]);

        // Verifica se as respostas foram bem-sucedidas
        if (
          !responseUnity.ok ||
          !responseGroups.ok ||
          !responseProductEdit.ok
        ) {
          throw new Error("Erro ao buscar dados");
        }

        // Converte as respostas para JSON
        const dataUnity = await responseUnity.json();
        const dataGroup = await responseGroups.json();
        const dataProduct = await responseProductEdit.json();

        // Atualiza os estados com os dados recebidos
        setUnitySelect(dataUnity);
        setGroupSelect(dataGroup);
        setDataGetProduct(dataProduct.products);

        //Encurtar sintaxe do set das propriedades abaixo
        const product = dataProduct.products[0];

        //Inicia as variaveis com os valores encontrados do produto
        setDescription(product.description || "");
        setUnityType(product.unityTypeId || "");
        setBarCode(product.bar_code || "");
        setNcm(product.ncmId || "");
        setExNcm(product.ex_ncm || "");
        setCestId(product.cestId || "");
        setPrice(product.price || "");
        setGroupId(product.groupId || "");
        setSubGroupId(product.subGroupId || "");
        setReservedStock(product.reserved_stock || "");
        setStock(product.stock || "");
        setGrossWeight(product.gross_weight || "");
        setLiquidWeight(product.liquid_weight || "");

        console.log("Product edit", dataProduct.products);

        console.log(dataGroup, "Aqui");
      } catch (error) {
        console.error("Erro na requisição:", error);
      }
    };

    fetchData(); // Chama a função de busca de dados
  }, []);

  //Function para resetar os valores quando o form é enviado
  const resetForm = () => {
    setDescription("");
    setUnityType("");
    setBarCode("");
    setNcm("");
    setExNcm("");
    setCestId("");
    setPrice("");
    setGroupId("");
    setSubGroupId("");
    setReservedStock("");
    setStock("");
    setGrossWeight("");
    setLiquidWeight("");
    setInputValueNcm("");
  };

  //Function para enviar os dados para o backend
  const handleSubmit = async () => {
    console.log(unityType);
    console.log(description);

    /* 
    let error: string | null = null; */

    // Verificando se os campos estão vazios
    /*     if (!description || description.trim() === "") {
      error = "O campo descrição não pode estar vazio.";
    } else if (!unityType || unityType.trim() === "") {
      error = "O campo unidade não pode estar vazio.";
    } else if (!ncm || ncm.trim() === "") {
      error = "O campo NCM não pode estar vazio.";
    } else if (!price || price.trim() === "") {
      error = "O campo preço de venda não pode estar vazio.";
    } */

    /*    // Se algum erro foi encontrado, define o erro e não envia os dados
    if (error) {
      setErrorMessage(error);
      return; // Impede o envio dos dados se houver erro
    } */

    // Se não houver erro, limpa a mensagem de erro
    setErrorMessage(null);

    /*     // Dados do formulário
    const dataForm = {
      description,
      unity_type: unityType,
      bar_code: parseInt(barCode || ""),
      ncm: ncm,
      ex_ncm: parseInt(exNcm || ""),
      cestId: cestId,
      price: parseFloat(price || ""),
      groupId,
      subGroupId,
      reserved_stock: parseInt(reservedStock || ""),
      stock: parseInt(stock || ""),
      gross_weight: parseFloat(grossWeight || ""),
      liquid_weight: parseFloat(liquidWeight || ""),
    }; */

    // Fazer REQ da API

    /* 
    try {
      const response = await fetch('http://26.56.52.76:4001/postproducts', {
        method: 'POST',  // Usando POST para enviar dados
        headers: {
          'Content-Type': 'application/json',  // Especifica que os dados estão em formato JSON
          'Authorization': 'Bearer seu_token_aqui'  // Se precisar de autenticação
        },
        body: JSON.stringify(dataForm)  // Converte o objeto para JSON
      });
  
      // Verifica se a resposta foi bem-sucedida
      if (!response.ok) {
        toast.error("Ocorreu um erro de requisição, tente novamente!");
      }
  
      // Converte a resposta para JSON
      const data = await response.json();
      console.log('Produto postado com sucesso:', data);
      toast.success("Produto adicionado com sucesso!");
  
    } catch (error) {
      console.log(error)
      toast.error('Erro ao postar o produto');
    } */

    // Resetar o formulário após o envio
    resetForm();
  };

  // Função para limpar a mensagem de erro quando o usuário começar a digitar (Input)
  const handleInputChange = (
    setter: React.Dispatch<React.SetStateAction<string>>
  ) => {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      setter(e.target.value); // Atualiza o valor ou atribui null caso esteja vazio
      setErrorMessage(null); // Limpa a mensagem de erro ao digitar
    };
  };

  //Function para somente permitir números em um input detexto
  const handleInputNumber = (e: React.FormEvent<HTMLInputElement>): void => {
    const target = e.target as HTMLInputElement;
    target.value = target.value.replace(/\D/g, ""); // Remove qualquer coisa que não seja número
  };

  // Função para limpar a mensagem de erro quando o usuário começar a digitar (Select)
  const handleSelectChange = (
    setter: React.Dispatch<React.SetStateAction<string>>
  ) => {
    return (e: React.ChangeEvent<HTMLSelectElement>) => {
      setter(e.target.value); // Atualiza o valor ou atribui null caso esteja vazio
      setErrorMessage(null); // Limpa a mensagem de erro ao selecionar
    };
  };

  //Function para puxar o relacional do Grupo com seus grupos
  const handleSubGroups = async (id: number) => {
    try {
      const response = await fetch(
        `http://26.56.52.76:8000/subgroup?groupsId=${id}`
      );

      const data = await response.json();

      setSubGroupSelect(data);
      console.log(data);

      if (!response.ok) {
        console.log("Erro na chamada");
        toast.error("O Grupo procurado não tem Sub-Grupos");
      }
    } catch (err) {
      console.error(err);
      toast.error("Erro na requisição");
    }
  };

  const handleSelectChangeGroup = (
    setter: React.Dispatch<React.SetStateAction<string>>
  ) => {
    return (e: React.ChangeEvent<HTMLSelectElement>) => {
      setter(e.target.value); // Atualiza o valor ou atribui null caso esteja vazio
      setErrorMessage(null); // Limpa a mensagem de erro ao selecionar
      handleSubGroups(parseInt(e.target.value));
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

  const handleEditionButton = () => {
    setAbleForEdit(!ableForEdit);

    if (ableForEdit == true) {
      setEditionButtonText("Desabilitar Edição");
    } else {
      setEditionButtonText("Habilitar Edição");
    }
  };


    // Função para lidar com a mudança no input de busca ncm
    const handleInputChangeNcm = (value: string) => {
      setNcm(value); // Atualiza o valor de busca no componente pai
    };
  
    // Função para lidar com a seleção do NCM
    // Função chamada quando uma opção é selecionada
    const handleSelectChangeNcm = (
      selected: { label: string; value: string } | null
    ) => {
      if (selected) {
        setSelectedOptionNcm(selected.value);
      }
  
      if (!selected) {
        setNcm("");
        setSelectedOptionNcm(""); // Limpa o valor do input quando a seleção for desfeita
      }
    };
  
     // Função para lidar com a mudança no input de busca cest
     const handleInputChangeCEST = (value: string) => {
      setCestId(value); // Atualiza o valor de busca no componente pai
    };
  
    // Função para lidar com a seleção do CEST
    // Função chamada quando uma opção é selecionada
    const handleSelectChangeCEST = (
      selected: { label: string; value: string } | null
    ) => {
      if (selected) {
        setSelectedOptionCest(selected.value);
      }
  
      if (!selected) {
        setCestId("");
        setSelectedOptionCest(""); // Limpa o valor do input quando a seleção for desfeita
      }
    };
  

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
            <div className={styles.idInput}>
              <label>Código</label>
              <input disabled={true} value={idForEdit || ""} />
            </div>
            <div className={styles.descriptionInput}>
              <label>
                Descrição<span style={{ color: "red" }}>*</span>
              </label>
              <input
                type="text"
                value={description}
                onChange={handleInputChange(setDescription)}
                maxLength={100}
                disabled={ableForEdit}
              />
            </div>
          </div>

          <div className={styles.secondLineInputs}>
            <div className={styles.inputWrapContainer}>
              <label>
                Unidade<span style={{ color: "red" }}>*</span>
              </label>
              <div className={styles.divInputIcon}>
                <select
                  value={unityType}
                  onChange={handleSelectChange(setUnityType)}
                  className={styles.unityInput}
                  disabled={ableForEdit}
                >
                  <option
                    value={unityType || dataGetProduct?.[0]?.unityTypeId || ""}
                  >
                    {unityType || dataGetProduct?.[0]?.unityTypeId || ""}
                  </option>
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
                value={barCode}
                onChange={(e) => setBarCode(e.target.value)}
                maxLength={13}
                onInput={handleInputNumber}
                className={styles.barCodeInput}
                disabled={ableForEdit}
              />
            </div>

            <div className={styles.inputWrapContainer}>
              <label>
                NCM<span style={{ color: "red" }}>*</span>
              </label>
              <div className={styles.divInputIcon}>
              <div>
                  <SearchSelectNcm
                    inputValue={ncm} // Usar ncm diretamente em vez de inputValue
                    onInputChange={handleInputChangeNcm}
                    onSelectChange={handleSelectChangeNcm}
                    disabled={ableForEdit}
                  />
                </div>
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
                value={exNcm}
                onChange={(e) => setExNcm(e.target.value)}
                maxLength={4}
                onInput={handleInputNumber}
                className={styles.ex_ncmInput}
                disabled={ableForEdit}
              />
            </div>

            <div className={styles.inputWrapContainer}>
              <label>Código CEST</label>
              <div className={styles.divInputIcon}>
              <div className={styles.divSpecialSelect}>
                  <SearchSelectCest
                    inputValue={cestId} // Usar ncm diretamente em vez de inputValue
                    onInputChange={handleInputChangeCEST}
                    onSelectChange={handleSelectChangeCEST}
                    disabled={ableForEdit}
                  />
                </div>
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
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="ex: 250"
                onInput={handleInputNumber}
                className={styles.priceInput}
                disabled={ableForEdit}
              />
            </div>
          </div>

          <div className={styles.thirdLineInputs}>
            <div className={styles.inputWrapContainer}>
              <label>Grupo</label>
              <div className={styles.divInputIcon}>
                {" "}
                <select
                  value={groupId}
                  onChange={handleSelectChangeGroup(setGroupId)}
                  disabled={ableForEdit}
                  className={styles.groupInput}
                >
                  <option value={dataGetProduct?.[0]?.Group?.name || ""}>
                    {dataGetProduct?.[0]?.Group?.name || "Selecione"}
                  </option>
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
                  value={subGroupId}
                  onChange={handleSelectChangeGroup(setSubGroupId)}
                  disabled={ableForEdit}
                  className={styles.subGroupInput}
                >
                  <option value={dataGetProduct?.[0]?.SubGroup?.name || ""}>
                    {dataGetProduct?.[0]?.SubGroup?.name || "Selecione"}
                  </option>
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
                value={reservedStock}
                onChange={(e) => setReservedStock(e.target.value)}
                onInput={handleInputNumber}
                disabled={ableForEdit}
              />
            </div>

            <div className={styles.inputWrapContainer}>
              <label>Estoque</label>
              <input
                type="text"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                disabled={ableForEdit}
                onInput={handleInputNumber}
              />
            </div>

            <div className={styles.inputWrapContainer}>
              <label>Peso Bruto</label>
              <input
                type="text"
                value={grossWeight}
                onChange={(e) => setGrossWeight(e.target.value)}
                disabled={ableForEdit}
                onInput={handleInputNumber}
              />
            </div>

            <div className={styles.inputWrapContainer}>
              <label>Peso Líquido</label>
              <input
                type="text"
                value={liquidWeight}
                onChange={(e) => setLiquidWeight(e.target.value)}
                disabled={ableForEdit}
                onInput={handleInputNumber}
              />
            </div>
            <div className={styles.adjustSpace}></div>
          </div>
        </form>
        <div className={styles.editionButtonDiv}>
          <button onClick={handleEditionButton}>{editionButtonText}</button>
        </div>
      </div>
    </main>
  );
};

export default EditarCadastroProdutosSheet;
