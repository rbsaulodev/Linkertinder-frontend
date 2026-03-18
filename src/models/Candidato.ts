import { Pessoa } from './Pessoa';
import { Loggable } from '../decorators/Loggable';

export class Candidato extends Pessoa {
  cpf: string = '';
  idade: number = 0;

  constructor(data: Partial<Candidato> = {}) {
    super();
    Object.assign(this, data);
  }

  @Loggable
  exibirDados(): string {
    return `CANDIDATO: ${this.nome} (${this.idade} anos) | CPF: ${this.cpf} | ${this.email}`;
  }

  toJSON() {
    return {
      nome: this.nome,
      email: this.email,
      estado: this.estado,
      cep: this.cep,
      descricao: this.descricao,
      competencias: this.competencias,
      cpf: this.cpf,
      idade: this.idade,
    };
  }
}