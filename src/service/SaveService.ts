import { StorageService } from './StorageService';
import { showToast, showErrors, closeModal } from '../utils/UI';
import {
  validateNome, validateEmail, validateCPF, validatePhone, validateLinkedIn, validateIdade, validateCEP,
  validateNomeEmpresa, validateCNPJ, validatePais, validateEstado, validateDescricao, validateTags
} from '../utils/Validator';
import { Candidato } from '../models/Candidato';
import { Empresa } from '../models/Empresa';

const get = (id: string) => (document.getElementById(id) as HTMLInputElement).value.trim();

const clearFields = (ids: string[]) =>
  ids.forEach(id => { (document.getElementById(id) as HTMLInputElement).value = ''; });

//Candidato
export function saveCandidato(
  candidatos: Candidato[],
  onSaved: (updated: Candidato[]) => void
): void {
  const errors: string[] = [];

  const nome = get('c-nome');
  const email = get('c-email');
  const cpf = get('c-cpf');
  const numbero = get('c-numbero');
  const linkedin = get('c-linkedin');
  const cep = get('c-cep');
  const idadeStr = get('c-idade');
  const tags = get('c-tags').split(',').map(s => s.trim()).filter(Boolean);

  if (!validateNome(nome)){
    errors.push('Nome completo inválido. Informe nome e sobrenome.');}
  if (!validateEmail(email)){
    errors.push('E-mail inválido. Ex: joao@email.com');
  }
  if (!validateCPF(cpf)){
    errors.push('CPF inválido. Ex: 123.456.789-09');
  }
  if (!validatePhone(numbero)){
    errors.push('Telefone inválido. Ex: (11) 91234-5678');
  }
  if (!validateLinkedIn(linkedin)){
    errors.push('LinkedIn inválido. Ex: https://linkedin.com/in/usuario');
  }
  if (!validateIdade(idadeStr)){
    errors.push('Idade inválida. Deve ser entre 16 e 80 anos.');
  }
  if (cep && !validateCEP(cep))    errors.push('CEP inválido. Ex: 01310-100');

  const tagsInvalidas = validateTags(tags);
  if (tagsInvalidas.length) errors.push(`Tags inválidas: "${tagsInvalidas.join('", "')}". Use letras, números, espaços, # ou +.`);

  if (errors.length) {
    showErrors('candidato', errors);
    showToast(`${errors[0]}`);
    return;
  }

  candidatos.push(new Candidato({
    nome, email, cpf, numbero, linkedin, cep, tags,
    idade:        parseInt(idadeStr, 10),
    estado:       get('c-estado'),
    descricao:    get('c-descricao'),
    competencias: get('c-competencias').split(',').map(s => s.trim()).filter(Boolean),
  }));

  StorageService.saveCandidatos(candidatos);
  closeModal('candidato');
  clearFields(['c-nome','c-idade','c-email','c-cpf','c-estado','c-cep',
               'c-descricao','c-competencias','c-numbero','c-linkedin','c-tags']);
  showToast('Candidato salvo!');
  onSaved(candidatos);
}

//Empresa 
export function saveEmpresa(
  empresas: Empresa[],
  onSaved: (updated: Empresa[]) => void
): void {
  const errors: string[] = [];

  const nome    = get('e-nome');
  const email   = get('e-email');
  const cnpj    = get('e-cnpj');
  const cep     = get('e-cep');
  const pais    = get('e-pais');
  const estado  = get('e-estado');
  const descricao = get('e-descricao');
  const tags    = get('e-tags').split(',').map(s => s.trim()).filter(Boolean);

  if (!validateNomeEmpresa(nome)){
    errors.push('Nome da empresa inválido.');
  }
  if (!validateEmail(email)){
           errors.push('E-mail inválido. Ex: rh@empresa.com');
  }
  if (!validateCNPJ(cnpj)){
    errors.push('CNPJ inválido. Ex: 11.222.333/0001-81');
  }
  if (!validateCEP(cep)){
    errors.push('CEP inválido. Ex: 01310-100');
  }
  if (pais && !validatePais(pais)){
    errors.push('País inválido. Use apenas letras. Ex: Brasil');
  }
  if (estado && !validateEstado(estado)){
    errors.push('Estado inválido. Use a sigla de 2 letras. Ex: SP');
  }
  if (descricao && !validateDescricao(descricao)){
    errors.push('Descrição muito curta. Mínimo 10 caracteres.');
  }

  const tagsInvalidas = validateTags(tags);
  if (tagsInvalidas.length) errors.push(`Tags inválidas: "${tagsInvalidas.join('", "')}". Use letras, números, espaços, # ou +.`);

  if (errors.length) {
    showErrors('empresa', errors);
    showToast(`${errors[0]}`);
    return;
  }

  empresas.push(new Empresa({
    nome, email, cnpj, cep, pais, estado, descricao, tags,
    competencias: get('e-competencias').split(',').map(s => s.trim()).filter(Boolean),
  }));

  StorageService.saveEmpresas(empresas);
  closeModal('empresa');
  clearFields(['e-nome','e-cnpj','e-email','e-pais','e-estado','e-cep','e-descricao','e-competencias','e-tags']);
  showToast('Empresa salva!');
  onSaved(empresas);
}