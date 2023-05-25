const express = require("express");
const app = express();
const ejs = require("ejs");

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

let alunos = [
  {
    id: 1,
    nome: "João",
    dataNascimento: "1990-01-01",
    matricula: "2021001",
    status: "Ativo",
    email: "joao@example.com",
  },
  {
    id: 2,
    nome: "Maria",
    dataNascimento: "1992-02-02",
    matricula: "2021002",
    status: "Inativo",
    email: "maria@example.com",
  },
];

app.get("/", (req, res) => {
  res.render("listagem", { alunos });
});

app.get("/editar/:id", (req, res) => {
  const aluno = alunos.find((a) => a.id === parseInt(req.params.id));
  if (aluno) {
    res.render("cadastro", { aluno });
  } else {
    res.redirect("/");
  }
});

app.get("/excluir/:id", (req, res) => {
  alunos = alunos.filter((a) => a.id !== parseInt(req.params.id));
  res.redirect("/");
});

app.get("/novo", (req, res) => {
  res.render("cadastro", { aluno: null });
});

app.post("/salvar", (req, res) => {
  const { id, nome, dataNascimento, matricula, status, email } = req.body;

  const matriculaExistente = alunos.find(aluno => aluno.matricula === matricula);
  if (matriculaExistente && (!id || matriculaExistente.id !== parseInt(id))) {
    res.send('Já existe um aluno com essa matrícula.');
    return;
  }

  if (id) {
    const index = alunos.findIndex((a) => a.id === parseInt(id));
    if (index !== -1) {
      alunos[index] = {
        id: parseInt(id),
        nome,
        dataNascimento,
        matricula,
        status,
        email,
      };
    }
  } else {
    const novoAluno = {
      id: alunos.length + 1,
      nome,
      dataNascimento,
      matricula,
      status,
      email,
    };
    alunos.push(novoAluno);
  }

  res.redirect("/");
});

app.listen(7777, () => {
  console.log("Porta do server: 7777.");
});
