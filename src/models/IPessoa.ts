export interface IPessoa {
  nome: string;
  email: string;
  estado: string;
  cep: string;
  descricao: string;
  competencias: string[];
  exibirDados(): string;
}
 