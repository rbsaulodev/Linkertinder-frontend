import { Candidato } from './models/Candidato';
import { Empresa } from './models/Empresa';
import { StorageService } from './service/StorageService';
import { saveCandidato, saveEmpresa } from './service/SaveService';
import { deleteCandidato, deleteEmpresa } from './service/DeleteService';
import { closeModal, openModal, renderCandidatos, renderEmpresas, renderPerfilEmpresa } from './utils/UI';
import { showPage } from './utils/Navigation';

//Estado

let candidatos: Candidato[] = StorageService.loadCandidatos();
let empresas: Empresa[]     = StorageService.loadEmpresas();
let activeEmpresaIdx        = 0;

//Helpers de render com estado atual

const refreshCandidatos = () =>
  renderCandidatos(candidatos, idx =>
    deleteCandidato(candidatos, idx, updated => {
      candidatos = updated;
      refreshCandidatos();
    })
  );

const refreshEmpresas = () =>
  renderEmpresas(empresas, idx =>
    deleteEmpresa(empresas, idx, activeEmpresaIdx, (updated, newIdx) => {
      empresas = updated;
      activeEmpresaIdx = newIdx;
      refreshEmpresas();
    })
  );

const refreshPerfil = () =>
  renderPerfilEmpresa(empresas, activeEmpresaIdx, idx => {
    activeEmpresaIdx = idx;
    refreshPerfil();
  });

//Init 

document.addEventListener('DOMContentLoaded', () => {
  // Navegação
  document.querySelectorAll<HTMLButtonElement>('.nav-tab').forEach(tab => {
    tab.addEventListener('click', () => showPage(tab.dataset.page!, tab, refreshPerfil));
  });

  // Abrir modais
  document.getElementById('btn-add-candidato')!.addEventListener('click', () => openModal('candidato'));
  document.getElementById('btn-add-empresa')!.addEventListener('click', () => openModal('empresa'));

  // Fechar modais
  document.getElementById('btn-cancel-candidato')!.addEventListener('click', () => closeModal('candidato'));
  document.getElementById('btn-cancel-empresa')!.addEventListener('click', () => closeModal('empresa'));
  document.querySelectorAll('.modal-overlay').forEach(el => {
    el.addEventListener('click', e => { if (e.target === el) (el as HTMLElement).classList.remove('open'); });
  });

  // Salvar
  document.getElementById('btn-save-candidato')!.addEventListener('click', () =>
    saveCandidato(candidatos, updated => { candidatos = updated; refreshCandidatos(); })
  );
  document.getElementById('btn-save-empresa')!.addEventListener('click', () =>
    saveEmpresa(empresas, updated => { empresas = updated; refreshEmpresas(); })
  );

  // Render inicial
  refreshCandidatos();
  refreshEmpresas();
});