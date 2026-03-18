import { IPessoa } from './IPessoa';
 
export abstract class Pessoa implements IPessoa {
  nome: string = '';
  email: string = '';
  estado: string = '';
  cep: string = '';
  descricao: string = '';
  competencias: string[] = [];
 
  abstract exibirDados(): string;
}
  