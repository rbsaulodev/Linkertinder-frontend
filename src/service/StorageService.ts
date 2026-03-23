import { Candidato } from '../models/Candidato';
import { Empresa } from '../models/Empresa';
import { getDefaultCandidatos, getDefaultEmpresas } from '../data/data';
import { Loggable } from '../utils/Loggable';

export class StorageService {
  private static readonly CANDIDATOS_KEY = 'linketinder_candidatos';
  private static readonly EMPRESAS_KEY = 'linketinder_empresas';

  @Loggable
  static saveCandidatos(list: Candidato[]): void {
    localStorage.setItem(this.CANDIDATOS_KEY, JSON.stringify(list.map(c => c.toJSON())));
  }

  @Loggable
  static loadCandidatos(): Candidato[] {
    const raw = localStorage.getItem(this.CANDIDATOS_KEY);
    if (!raw) return getDefaultCandidatos();
    const parsed = JSON.parse(raw);
    return parsed.map((d: any) => new Candidato(d));
  }

  @Loggable
  static saveEmpresas(list: Empresa[]): void {
    localStorage.setItem(this.EMPRESAS_KEY, JSON.stringify(list.map(e => e.toJSON())));
  }

  @Loggable
  static loadEmpresas(): Empresa[] {
    const raw = localStorage.getItem(this.EMPRESAS_KEY);
    if (!raw) return getDefaultEmpresas();
    const parsed = JSON.parse(raw);
    return parsed.map((d: any) => {
      const e = new Empresa(d);
      e.candidatos = (d.candidatos || []).map((c: any) => new Candidato(c));
      return e;
    });
  }
}