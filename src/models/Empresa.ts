import { Pessoa } from './Pessoa';
import { Candidato } from './Candidato';
import { Loggable } from '../decorators/Loggable';

export class Empresa extends Pessoa {
  cnpj: string = '';
  pais: string = '';
  candidatos: Candidato[] = [];

  constructor(data: Partial<Empresa> = {}) {
    super();
    Object.assign(this, data);
  }

  @Loggable
  exibirDados(): string {
    return `EMPRESA: ${this.nome} | CNPJ: ${this.cnpj} | ${this.email}`;
  }

  getCompetenciaCount(): Record<string, number> {
    const count: Record<string, number> = {};
    this.candidatos.forEach(c => {
      c.competencias.forEach(comp => {
        count[comp] = (count[comp] || 0) + 1;
      });
    });
    return count;
  }

  toJSON() {
    return {
      nome: this.nome,
      email: this.email,
      estado: this.estado,
      cep: this.cep,
      descricao: this.descricao,
      competencias: this.competencias,
      cnpj: this.cnpj,
      pais: this.pais,
      candidatos: this.candidatos.map(c => c.toJSON()),
    };
  }
}