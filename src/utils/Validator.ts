const digits = (v: string) => v.replace(/\D/g, '');

export function validateEmail(v: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
}

export function validateCEP(v: string): boolean {
  return /^\d{5}-?\d{3}$/.test(v.trim());
}

export function validateTags(tags: string[]): string[] {
  const pattern = /^[\p{L}\d .#+]{2,30}$/u;
  return tags.filter(t => !pattern.test(t.trim()));
}

export function validateNome(v: string): boolean {
  return /^[\p{L} ]{3,}$/u.test(v.trim()) && /\S+\s+\S+/.test(v.trim());
}

export function validateCPF(v: string): boolean {
  const n = digits(v);
  if (n.length !== 11 || /^(\d)\1{10}$/.test(n)) return false;
  const d1 = (n.slice(0,9).split('').reduce((s,d,i) => s + +d*(10-i), 0) * 10 % 11) % 10;
  const d2 = (n.slice(0,10).split('').reduce((s,d,i) => s + +d*(11-i), 0) * 10 % 11) % 10;
  return d1 === +n[9] && d2 === +n[10];
}

export function validatePhone(v: string): boolean {
  return /^\(?\d{2}\)?[\s-]?9?\d{4}[\s-]?\d{4}$/.test(v.trim());
}

export function validateLinkedIn(v: string): boolean {
  return /^https?:\/\/(www\.)?linkedin\.com\/(in|company)\/[\w%-]+/.test(v.trim());
}

export function validateIdade(v: string): boolean {
  if (!/^\d+$/.test(v.trim())) return false;
  const n = parseInt(v, 10);
  return n >= 16 && n <= 80;
}

export function validateCNPJ(v: string): boolean {
  const n = digits(v);
  if (n.length !== 14 || /^(\d)\1{13}$/.test(n)) return false;
  const calc = (w: number[]) => {
    const r = w.reduce((s, wt, i) => s + +n[i] * wt, 0) % 11;
    return r < 2 ? 0 : 11 - r;
  };
  return calc([5,4,3,2,9,8,7,6,5,4,3,2]) === +n[12]
      && calc([6,5,4,3,2,9,8,7,6,5,4,3,2]) === +n[13];
}

export function validateNomeEmpresa(v: string): boolean {
  return /^[\p{L}\d &.'"-]{2,80}$/u.test(v.trim());
}

export function validatePais(v: string): boolean {
  return /^[\p{L} ]{2,60}$/u.test(v.trim());
}

export function validateEstado(v: string): boolean {
  return /^[A-Z]{2}$/.test(v.trim().toUpperCase());
}

export function validateDescricao(v: string): boolean {
  return /^.{10,}$/s.test(v.trim());
}