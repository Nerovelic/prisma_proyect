import React from "react";

const HomePage = () => {
  const formClasses =
    "form p-5 max-w-350 border border-solid border-gray-700 rounded bg-gray-900 text-white relative";
  const titleClasses =
    "title text-2xl font-semibold relative flex items-center pl-8 text-blue-400";
  const messageClasses = "message text-base text-gray-700";
  const labelClasses = "relative";
  const inputClasses = "input";
  const spanClasses =
    "absolute top-0 left-2 text-sm text-gray-500 cursor-text transition-transform";
  const submitButtonClasses =
    "submit bg-blue-400 text-white border-none outline-none px-4 py-2 rounded transform transition-transform hover:bg-blue-500";

  return (
    <form className={formClasses}>
      <p className={titleClasses}>Formulario</p>
      <p className={messageClasses}>Formulario de registro Alumno</p>
      <div className="flex space-x-6">
        <label className={labelClasses}>
          <input
            className={inputClasses}
            type="text"
            placeholder=""
            required
          ></input>
          <span className={spanClasses}>Nombre</span>
        </label>

        <label className={labelClasses}>
          <input
            className={inputClasses}
            type="text"
            placeholder=""
            required
          ></input>
          <span className={spanClasses}>Apellido</span>
        </label>
      </div>

      <label className={labelClasses}>
        <input
          className={inputClasses}
          type="text"
          placeholder=""
          required
        ></input>
        <span className={spanClasses}>Genero</span>
      </label>
      <label className={labelClasses}>
        <input
          className={inputClasses}
          type="text"
          placeholder=""
          required
        ></input>
        <span className={spanClasses}>Carrera</span>
      </label>
      <button className={submitButtonClasses}>Submit</button>
    </form>
  );
};

export default HomePage;
