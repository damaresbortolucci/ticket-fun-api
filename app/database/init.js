import mongoose from "mongoose";
import config from "../config/index.js";

const init = () => {
  mongoose.connect(`mongodb://${config.HOST}:${config.PORT}/${config.DB}`, {});

  mongoose.connection.on("error", () => console.log("deu ruuuim :("));

  mongoose.connection.once("open", () =>
    console.log("aeee abriu conexão com o banco!!!")
  );
};

export default init;
