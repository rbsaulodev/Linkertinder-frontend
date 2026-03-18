import { Candidato } from '../models/Candidato';
import { Empresa } from '../models/Empresa';

export function getDefaultCandidatos(): Candidato[] {
  return [
    new Candidato({ nome: 'Ana Silva', email: 'ana@email.com', estado: 'SP', cep: '01310-100', descricao: 'Dev fullstack apaixonada por UX', cpf: '123.456.789-00', idade: 27, competencias: ['TypeScript', 'React', 'Node.js', 'Python'] }),
    new Candidato({ nome: 'Bruno Costa', email: 'bruno@email.com', estado: 'RJ', cep: '22041-001', descricao: 'Backend engineer com foco em performance', cpf: '234.567.890-11', idade: 32, competencias: ['Java', 'Spring', 'Python', 'Docker'] }),
    new Candidato({ nome: 'Carla Mendes', email: 'carla@email.com', estado: 'MG', cep: '30130-110', descricao: 'Data scientist com experiência em ML', cpf: '345.678.901-22', idade: 29, competencias: ['Python', 'TensorFlow', 'SQL', 'R'] }),
    new Candidato({ nome: 'Diego Rocha', email: 'diego@email.com', estado: 'RS', cep: '90040-060', descricao: 'DevOps engineer certificado AWS', cpf: '456.789.012-33', idade: 34, competencias: ['Docker', 'Kubernetes', 'AWS', 'Terraform'] }),
    new Candidato({ nome: 'Elena Farias', email: 'elena@email.com', estado: 'PR', cep: '80010-020', descricao: 'Frontend specialist em Vue e React', cpf: '567.890.123-44', idade: 26, competencias: ['React', 'Vue', 'TypeScript', 'CSS'] }),
  ];
}

export function getDefaultEmpresas(): Empresa[] {
  const candidatos = getDefaultCandidatos();

  const emp1 = new Empresa({
    nome: 'TechBrasil Ltda', email: 'rh@techbrasil.com', estado: 'SP',
    cep: '01310-100', descricao: 'Startup de tecnologia focada em inovação',
    cnpj: '12.345.678/0001-90', pais: 'Brasil',
    competencias: ['TypeScript', 'React', 'Python', 'Docker'],
  });
  emp1.candidatos = [candidatos[0], candidatos[1], candidatos[4]];

  const emp2 = new Empresa({
    nome: 'DataFlow Systems', email: 'jobs@dataflow.com', estado: 'RJ',
    cep: '20040-020', descricao: 'Especialistas em big data e inteligência artificial',
    cnpj: '98.765.432/0001-10', pais: 'Brasil',
    competencias: ['Python', 'SQL', 'TensorFlow', 'AWS'],
  });
  emp2.candidatos = [candidatos[1], candidatos[2], candidatos[3]];

  return [emp1, emp2];
}