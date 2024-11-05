'use client'

import React from "react";
import styles from "./CadastroProdutosSheet.module.css";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as yup from "yup";
import Image from "next/image";

const validationSchema = yup.object({
  description: yup.string().required("O campo descrição é obrigatório."),
  unity_type: yup.string().required("O campo unidade é obrigatório."),
  bar_code: yup
    .string()
    .matches(/^\d{1,13}$/, "O campo deve ter no máximo 13 dígitos"),
  ncm: yup.string().required("O campo NCM é obrigatório."),
  ex_ncm: yup
    .string()
    .matches(/^\d{1,4}$/, "O campo deve ter no máximo 4 dígitos"),
  cestId: yup
    .string(),
  price: yup.string().required("O campo preço de venda é obrigatório."),
  groupId: yup.number(),
  subGroupId: yup.number(),
  reserved_stock: yup.string(),
  stock: yup.string().matches(/^\d{1,20}$/, "O campo deve ter no máximo 20 dígitos"),
  gross_weight: yup.string().matches(/^\d{1,20}$/, "O campo deve ter no máximo 20 dígitos"),
  liquid_weight: yup.string().matches(/^\d{1,20}$/, "O campo deve ter no máximo 20 dígitos")


});

const CadastroProdutosSheet: React.FC = () => {
  const handleInputNumber = (e: React.FormEvent<HTMLInputElement>): void => {
    const target = e.target as HTMLInputElement;
    // Remove qualquer coisa que não seja número
    target.value = target.value.replace(/\D/g, "");
  };



  return (
    <main className={styles.main}>
      <div className={styles.formContainer}>
        <Formik
          initialValues={{
            description: "",
            unity_type: "",
            bar_code: "",
            ncm: "",
            ex_ncm: "",
            cestId: "",
            price: "",
            groupId:"",
            subGroupId:"",
            reserved_stock: "",
            stock:"",
            gross_weight: "",
            liquid_weight: ""

          }}
          validationSchema={validationSchema}
          onSubmit={(values) => {
            const formattedValues = {
              ...values,
              price: parseFloat(values.price),
              bar_code: parseInt(values.bar_code),
              ex_ncm: parseInt(values.ex_ncm),
              reserved_stock: parseInt(values.reserved_stock),
              stock: parseInt(values.stock),
              gross_weight: parseInt(values.gross_weight),
              liquid_weight: parseInt(values.liquid_weight),
              cestId: parseInt(values.cestId || ""),  // Converte cestId para número (0 caso esteja vazio)
              groupId: parseInt(values.groupId || ""),  // Converte groupId para número
              subGroupId: parseInt(values.subGroupId || "")  // Converte subGroupId para número
            };
            console.log(formattedValues);
          }}
        >
          <Form>
            <div className={styles.firstLineInput}>
              <ErrorMessage
                name="description"
                component="div"
                className={styles.errorMessage}
              />
              <label>
                Descrição<span style={{ color: "red" }}>*</span>
              </label>
              <Field
                type="text"
                name="description"
                className={styles.descriptionInput}
                maxLength={100}
                placeholder="ex: papel grafite"
              />
            </div>
            <div className={styles.errorDivSecondLine}>
              {" "}
              <ErrorMessage
                name="unity_type"
                component="div"
                className={styles.errorMessage}
              />{" "}
              <ErrorMessage
                name="ncm"
                component="div"
                className={styles.errorMessage}
              />
              <ErrorMessage
                name="price"
                component="div"
                className={styles.errorMessage}
              />
            </div>
            <div className={styles.secondLineInputs}>
              <div className={styles.inputWrapContainer}>
                <label>
                  Unidade<span style={{ color: "red" }}>*</span>
                </label>
                <div className={styles.divInputIcon}>
                  <Field
                    as="select"
                    name="unity_type"
                    id="unity_type"
                    className={styles.unityInput}
                  >
                    <option value=""></option>
                    <option value="L">L</option>
                    <option value="G">G</option>
                    <option value="KG">KG</option>
                  </Field>
                  <Image
                    src="/icons/search-input-icon.svg"
                    width={20}
                    height={20}
                    alt="searchIcon"
                  />
                </div>
              </div>
              <div className={styles.inputWrapContainer}>
                <label>Código de barras</label>
                <Field
                  type="text"
                  name="bar_code"
                  className={styles.barCodeInput}
                  maxLength={13}
                  pattern="\d*"
                  placeholder="ex: 1698189354175"
                  onInput={handleInputNumber}
                />
              </div>
              <div className={styles.inputWrapContainer}>
                <label>
                  NCM<span style={{ color: "red" }}>*</span>
                </label>
                <div className={styles.divInputIcon}>
                  <Field
                    as="select"
                    name="ncm"
                    id="ncm"
                    className={styles.ncmInput}
                  >
                    <option value=""></option>
                    <option value="1235678">1235678</option>
                    <option value="09825673">09825673</option>
                    <option value="10756497G">10756497</option>
                  </Field>
                  <Image
                    src="/icons/search-input-icon.svg"
                    width={20}
                    height={20}
                    alt="searchIcon"
                  />
                </div>
              </div>
              <div className={styles.inputWrapContainer}>
                <label>EX NCM</label>
                <Field
                  type="text"
                  name="ex_ncm"
                  className={styles.ex_ncm}
                  maxLength={4}
                  pattern="\d*"
                  placeholder="ex: 1698"
                  onInput={handleInputNumber}
                />
              </div>
              <div className={styles.inputWrapContainer}>
                <label>Código CEST</label>
                <div className={styles.divInputIcon}>
                  <Field
                    as="select"
                    name="cestId"
                    id="cestId"
                    className={styles.cestId}
                  >
                    <option value=""></option>
                    <option value="1232145">1232145</option>
                    <option value="1235214">1235214</option>
                    <option value="6523145">6523145</option>
                  </Field>
                  <Image
                    src="/icons/search-input-icon.svg"
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
                <div className={styles.divInputIcon}>
                  <Field
                    type="text"
                    name="price"
                    id="price"
                    className={styles.priceInput}
                    placeholder="250"
                  >
                  </Field>
                </div>
              </div>
            </div>
            <div className={styles.thirdLineInputs}>
            <div className={styles.inputWrapContainer}>
                <label>
                  Grupo
                </label>
                <div className={styles.divInputIcon}>
                  <Field
                    as="select"
                    name="groupId"
                    id="groupId"
                    className={styles.groupInput}
                  >
                    <option value={""}></option>
                    <option value={1}>Camisas</option>
                    <option value={2}>Futebol</option>
                    <option value={3}>Calças</option>
                  </Field>
                  <Image
                    src="/icons/search-input-icon.svg"
                    width={20}
                    height={20}
                    alt="searchIcon"
                  />
                </div>
              </div>
              <div className={styles.inputWrapContainer}>
                <label>
                  Sub grupo
                </label>
                <div className={styles.divInputIcon}>
                  <Field
                    as="select"
                    name="subGroupId"
                    id="subGroupId"
                    className={styles.subGroupInput}
                  >
                    <option value=""></option>
                    <option value={1}>Tamanho P</option>
                    <option value={2}>Bola de Futebol</option>
                    <option value={3}>Tamanho 42</option>
                  </Field>
                  <Image
                    src="/icons/search-input-icon.svg"
                    width={20}
                    height={20}
                    alt="searchIcon"
                  />
                </div>
              </div>
              <div className={styles.inputWrapContainer}>
                <label>Estoque reservado</label>
                <Field
                  type="text"
                  name="reserved_stock"
                  className={styles.reserved_stockInput}
                  maxLength={20}
                  pattern="\d*"
                  placeholder="ex: 5"
                  onInput={handleInputNumber}
                />
              </div>
              <div className={styles.inputWrapContainer}>
                <label>Estoque</label>
                <Field
                  type="text"
                  name="stock"
                  className={styles.stockInput}
                  maxLength={20}
                  pattern="\d*"
                  placeholder="ex: 20"
                  onInput={handleInputNumber}
                />
              </div>
              <div className={styles.inputWrapContainer}>
                <label>Peso Bruto</label>
                <Field
                  type="text"
                  name="gross_weight"
                  className={styles.gross_weightInput}
                  maxLength={20}
                  pattern="\d*"
                  placeholder="ex: 30"
                  onInput={handleInputNumber}
                />
              </div>
              <div className={styles.inputWrapContainer}>
                <label>Peso Líquido</label>
                <Field
                  type="text"
                  name="liquid_weight"
                  className={styles.liquid_weightInput}
                  maxLength={20}
                  pattern="\d*"
                  placeholder="ex: 100"
                  onInput={handleInputNumber}
                />
              </div>
              <div className={styles.adjustSpace}></div>
            </div>

            <button type="submit">Enviar</button>
          </Form>
        </Formik>
      </div>
    </main>
  );
};

export default CadastroProdutosSheet;
