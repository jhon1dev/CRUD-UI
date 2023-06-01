import database from './db.js';
import Sequelize from 'sequelize';

const Aluno = database.define('aluno', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  nome: Sequelize.STRING,
  dataNascimento: {
    type: Sequelize.DATE,
    get() {
      const date = this.getDataValue('dataNascimento');
      return date.toLocaleDateString('pt-BR');
    }
  },
  matricula: Sequelize.STRING,
  status: Sequelize.STRING,
  email: Sequelize.STRING
});

export default Aluno;