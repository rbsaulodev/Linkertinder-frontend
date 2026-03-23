import { Candidato } from '../models/Candidato';
import { Empresa } from '../models/Empresa';
import { StorageService } from './StorageService';
import { showToast } from '../utils/UI';


export function deleteCandidato(
  candidatos: Candidato[],
  idx: number,
  onDeleted: (updated: Candidato[]) => void
): void {
  candidatos.splice(idx, 1);
  StorageService.saveCandidatos(candidatos);
  showToast('🗑️ Candidato removido');
  onDeleted(candidatos);
}

export function deleteEmpresa(
  empresas: Empresa[],
  idx: number,
  activeEmpresaIdx: number,
  onDeleted: (updated: Empresa[], newActiveIdx: number) => void
): void {
  empresas.splice(idx, 1);
  const newIdx = Math.min(activeEmpresaIdx, Math.max(0, empresas.length - 1));
  StorageService.saveEmpresas(empresas);
  showToast('🗑️ Empresa removida');
  onDeleted(empresas, newIdx);
}