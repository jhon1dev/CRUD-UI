import express from "express";
import database from "./db.js";
import ejs from "ejs";
import Aluno from "./aluno.js";
import { Op } from "sequelize";

const app = express();

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

app.get("/", async (req, res) => {
  try {
    const { pesquisar } = req.query; // adição do parâmetro "pesquisar" para pesquisar o nome de um aluno específico na tabela.

    let alunos;
    if (pesquisar) {
      alunos = await Aluno.findAll({
        where: {
          nome: {
            [Op.like]: `${pesquisar}%`,
          },
        },
      });
    } else {
      alunos = await Aluno.findAll();
    }
    res.render("listagem", { alunos, pesquisar });
  } catch (error) {
    console.error(error);
    res.status(500).send("Erro ao carregar os alunos.");
  }
});

app.get("/editar/:id", async (req, res) => {
  const alunoId = parseInt(req.params.id);
  try {
    const aluno = await Aluno.findByPk(alunoId);
    if (aluno) {
      res.render("cadastro", { aluno });
    } else {
      res.redirect("/");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Erro ao carregar o aluno.");
  }
});

app.get("/excluir/:id", async (req, res) => {
  const alunoId = parseInt(req.params.id);
  try {
    await Aluno.destroy({ where: { id: alunoId } });
    res.redirect("/");
  } catch (error) {
    console.error(error);
    res.status(500).send("Erro ao excluir o aluno.");
  }
});

app.get("/novo", (req, res) => {
  res.render("cadastro", { aluno: null });
});

app.post("/salvar", async (req, res) => {
  const { id, nome, dataNascimento, matricula, status, email } = req.body;

  try {
    let aluno;

    if (id) {
      aluno = await Aluno.findByPk(parseInt(id));
      if (aluno) {
        await aluno.update({
          nome,
          dataNascimento,
          matricula,
          status,
          email,
        });
      }
    } else {
      aluno = await Aluno.create({
        nome,
        dataNascimento,
        matricula,
        status,
        email,
      });
    }

    res.redirect("/");
  } catch (error) {
    console.error(error);
    res.status(500).send("Erro ao salvar o aluno.");
  }
});

app.listen(3000, async () => {
  try {
    await database.sync();
    console.log("Conexão com o banco de dados estabelecida.");
    console.log("Porta do server: 3000");
  } catch (error) {
    console.error("Erro ao conectar-se ao banco de dados:", error);
  }
});
