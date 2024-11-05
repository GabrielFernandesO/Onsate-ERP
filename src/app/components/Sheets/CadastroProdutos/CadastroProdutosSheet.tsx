import React from "react";
import styles from "./CadastroProdutosSheet.module.css";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as yup from "yup";

const validationSchema = yup.object({
  description: yup.string().required("O campo descrição é obrigatório."),
  unity_type: yup.string().required("O campo unidade é obrigatório."),
  bar_code: yup
    .string()
    .matches(/^\d{1,13}$/, "O número deve ter no máximo 13 dígitos")
    .required("O número é obrigatório"),
  ncm: yup.string().required("O campo NCM é obrigatório."),
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
          initialValues={{ description: "", email: "" }}
          validationSchema={validationSchema}
          onSubmit={(values) => {
            console.log(values);
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
              />
              {" "}
              <ErrorMessage
                name="ncm"
                component="div"
                className={styles.errorMessage}
              />
            </div>
            <div className={styles.secondLineInputs}>
              <div>
                <label>
                  Unidade<span style={{ color: "red" }}>*</span>
                </label>
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
              </div>
              <div>
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
              <div>
                <label>
                  NCM<span style={{ color: "red" }}>*</span>
                </label>
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
              </div>
            </div>

            <button type="submit">Enviar</button>
          </Form>
        </Formik>
      </div>
    </main>
  );
};

export default CadastroProdutosSheet;
