export function showPage(page: string, tab: HTMLButtonElement, onPerfilEmpresa: () => void): void {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
  document.getElementById(`page-${page}`)!.classList.add('active');
  tab.classList.add('active');
  
  if (page === 'perfil-empresa'){
    onPerfilEmpresa();
  } 
}