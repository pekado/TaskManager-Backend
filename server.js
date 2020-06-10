const express = require("express");
const connectDB = require("./config/db");
const cors = require('cors');

//crear servidor
const app = express();
//conectar db
connectDB();

app.use(cors())

//habilitar express.json
app.use(express.json({ extended: true }));
//puerto de la app
const PORT = process.env.PORT || 4000;

//importar rutas
app.use("/api/users", require("./routes/users"));
app.use("/api/auth", require("./routes/auth"));
app.use("/api/projects", require("./routes/projects"));
app.use("/api/tasks", require("./routes/tasks"));

//DEFinir pag principal
app.get("/", (req, res) => {
  res.send("HOLA MUNDO");
});

//arrancar servidior
app.listen(PORT, () => {
  console.log(`El servidor está vivo en el puerto ${PORT}`);
});
