import { Candidato } from './models/Candidato';
import { Empresa } from './models/Empresa';
import { StorageService } from './service/StorageService';
import Chart from 'chart.js/auto';

//STATE

let candidatos: Candidato[] = StorageService.loadCandidatos();
let empresas: Empresa[] = StorageService.loadEmpresas();
let activeEmpresaIdx: number = 0;
let chartInstance: Chart | null = null;

//RENDER CANDIDATOS

function renderCandidatos(): void {
  const grid = document.getElementById('grid-candidatos')!;
  const countEl = document.getElementById('count-cand')!;
  countEl.textContent = String(candidatos.length);

  if (!candidatos.length) {
    grid.innerHTML = `
      <div class="empty">
        <div class="empty-icon">👤</div>
        <div class="empty-text">Nenhum candidato cadastrado ainda.</div>
      </div>`;
    return;
  }

  grid.innerHTML = candidatos.map((c, i) => `
    <div class="card">
      <div class="card-anon">${c.nome.charAt(0)}</div>
      <div class="card-title">${c.nome}</div>
      <div class="card-sub">${c.idade} anos · ${c.estado} · ${c.cep}</div>
      <div class="card-desc">${c.descricao}</div>
      <div class="tags">${c.competencias.map(t => `<span class="tag">${t}</span>`).join('')}</div>
      <div class="card-actions">
        <button class="btn-delete" data-index="${i}" data-type="candidato">Remover</button>
      </div>
    </div>
  `).join('');

  grid.querySelectorAll<HTMLButtonElement>('[data-type="candidato"]').forEach(btn => {
    btn.addEventListener('click', () => deleteCandidato(Number(btn.dataset.index)));
  });
}

//RENDER EMPRESAS

function renderEmpresas(): void {
  const grid = document.getElementById('grid-empresas')!;
  const countEl = document.getElementById('count-emp')!;
  countEl.textContent = String(empresas.length);

  if (!empresas.length) {
    grid.innerHTML = `
      <div class="empty">
        <div class="empty-icon">🏢</div>
        <div class="empty-text">Nenhuma empresa cadastrada ainda.</div>
      </div>`;
    return;
  }

  grid.innerHTML = empresas.map((e, i) => `
    <div class="card">
      <div class="card-anon" style="background:linear-gradient(135deg,#fc5c7d,#7c5cfc)">${e.nome.charAt(0)}</div>
      <div class="card-title">${e.nome}</div>
      <div class="card-sub">${e.pais} · ${e.estado} · CNPJ: ${e.cnpj}</div>
      <div class="card-desc">${e.descricao}</div>
      <div class="tags">${e.competencias.map(t => `<span class="tag">${t}</span>`).join('')}</div>
      <div class="card-actions">
        <button class="btn-delete" data-index="${i}" data-type="empresa">Remover</button>
      </div>
    </div>
  `).join('');

  grid.querySelectorAll<HTMLButtonElement>('[data-type="empresa"]').forEach(btn => {
    btn.addEventListener('click', () => deleteEmpresa(Number(btn.dataset.index)));
  });
}

//ENDER PERFIL EMPRESA

function renderPerfilEmpresa(): void {
  const chipsEl = document.getElementById('empresa-chips')!;

  if (!empresas.length) {
    chipsEl.innerHTML = '';
    document.getElementById('perfil-content')!.innerHTML = `
      <div class="empty">
        <div class="empty-icon">🏢</div>
        <div class="empty-text">Nenhuma empresa cadastrada.</div>
      </div>`;
    return;
  }

  chipsEl.innerHTML = empresas.map((e, i) => `
    <button class="empresa-chip ${i === activeEmpresaIdx ? 'active' : ''}" data-index="${i}">${e.nome}</button>
  `).join('');

  chipsEl.querySelectorAll<HTMLButtonElement>('.empresa-chip').forEach(btn => {
    btn.addEventListener('click', () => {
      activeEmpresaIdx = Number(btn.dataset.index);
      renderPerfilEmpresa();
    });
  });

  const emp = empresas[activeEmpresaIdx];
  const compCount = emp.getCompetenciaCount();
  const labels = Object.keys(compCount);
  const values = Object.values(compCount);

  const palettes: string[][] = [
    ['rgba(124,92,252,0.85)', 'rgba(252,92,125,0.85)', 'rgba(92,248,200,0.85)', 'rgba(248,200,92,0.85)', 'rgba(200,92,248,0.85)'],
    ['rgba(252,92,125,0.85)', 'rgba(92,248,200,0.85)', 'rgba(124,92,252,0.85)', 'rgba(248,180,92,0.85)', 'rgba(92,180,248,0.85)'],
  ];
  const palette = palettes[activeEmpresaIdx % palettes.length];
  const colors = labels.map((_, i) => palette[i % palette.length]);

  const candidatosHtml = emp.candidatos.length
    ? emp.candidatos.map(c => `
        <div class="candidato-row">
          <div class="mini-avatar">${c.nome.charAt(0)}</div>
          <div>
            <div class="anon-name">Candidato Anônimo</div>
            <div style="font-size:0.7rem;color:var(--text-muted)">${c.estado} · ${c.competencias.slice(0, 3).join(', ')}</div>
          </div>
          <div class="tooltip">
            <div class="tooltip-detail">📍 ${c.estado} · ${c.cep}</div>
            <div class="tooltip-detail">🎂 ${c.idade} anos</div>
            <div class="tooltip-detail" style="margin-top:6px">
              ${c.competencias.map(t => `<span class="tag">${t}</span>`).join(' ')}
            </div>
          </div>
        </div>
      `).join('')
    : '<div style="color:var(--text-muted);font-size:0.8rem;padding:10px 0">Nenhum candidato vinculado.</div>';

  document.getElementById('perfil-content')!.innerHTML = `
    <div class="empresa-profile">
      <div class="profile-card">
        <h4>Candidatos (${emp.candidatos.length})</h4>
        ${candidatosHtml}
      </div>
      <div class="profile-card">
        <h4>Sobre a empresa</h4>
        <div style="font-size:0.82rem;color:var(--text-muted);line-height:1.7;margin-bottom:16px">${emp.descricao}</div>
        <div style="font-size:0.72rem;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.8px;margin-bottom:8px">Skills desejadas</div>
        <div class="tags">${emp.competencias.map(t => `<span class="tag">${t}</span>`).join('')}</div>
        <div style="margin-top:16px;font-size:0.72rem;color:var(--text-muted)">📧 ${emp.email}</div>
        <div style="margin-top:4px;font-size:0.72rem;color:var(--text-muted)">🌎 ${emp.pais} · ${emp.estado}</div>
      </div>
    </div>
    <div class="chart-wrap">
      <h4>Competências dos Candidatos</h4>
      <canvas id="chart-canvas" height="80"></canvas>
    </div>
  `;

  if (chartInstance) {
    chartInstance.destroy();
    chartInstance = null;
  }

  if (labels.length) {
    const canvas = document.getElementById('chart-canvas') as HTMLCanvasElement;
    chartInstance = new Chart(canvas, {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: 'Candidatos',
          data: values,
          backgroundColor: colors,
          borderColor: colors.map(c => c.replace('0.85', '1')),
          borderWidth: 1,
          borderRadius: 6,
        }],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: ctx => ` ${ctx.raw} candidato(s) com esta skill`,
            },
            backgroundColor: '#1c1c28',
            borderColor: '#2a2a3d',
            borderWidth: 1,
            titleColor: '#e8e8f0',
            bodyColor: '#6b6b8a',
            padding: 12,
          },
        },
        scales: {
          x: {
            ticks: { color: '#6b6b8a', font: { family: 'DM Mono', size: 11 } },
            grid: { color: '#1c1c28' },
          },
          y: {
            ticks: { color: '#6b6b8a', font: { family: 'DM Mono', size: 11 }, stepSize: 1 },
            grid: { color: '#1c1c28' },
            beginAtZero: true,
          },
        },
      },
    });
  }
}

//NAVIGATION
function showPage(page: string, tab: HTMLButtonElement): void {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
  document.getElementById(`page-${page}`)!.classList.add('active');
  tab.classList.add('active');
  if (page === 'perfil-empresa') renderPerfilEmpresa();
}

//MODAL

function openModal(type: 'candidato' | 'empresa'): void {
  document.getElementById(`modal-${type}`)!.classList.add('open');
}

function closeModal(type: 'candidato' | 'empresa'): void {
  document.getElementById(`modal-${type}`)!.classList.remove('open');
}

//SAVE

function saveCandidato(): void {
  const get = (id: string) => (document.getElementById(id) as HTMLInputElement).value.trim();

  const nome = get('c-nome');
  const email = get('c-email');
  if (!nome || !email) { showToast('⚠️ Nome e email são obrigatórios'); return; }

  const c = new Candidato({
    nome,
    email,
    idade: parseInt(get('c-idade')) || 0,
    cpf: get('c-cpf'),
    estado: get('c-estado'),
    cep: get('c-cep'),
    descricao: get('c-descricao'),
    competencias: get('c-competencias').split(',').map(s => s.trim()).filter(Boolean),
  });

  candidatos.push(c);
  StorageService.saveCandidatos(candidatos);
  renderCandidatos();
  closeModal('candidato');
  ['c-nome','c-idade','c-email','c-cpf','c-estado','c-cep','c-descricao','c-competencias']
    .forEach(id => { (document.getElementById(id) as HTMLInputElement).value = ''; });
  showToast('✅ Candidato salvo!');
}

function saveEmpresa(): void {
  const get = (id: string) => (document.getElementById(id) as HTMLInputElement).value.trim();

  const nome = get('e-nome');
  const email = get('e-email');
  if (!nome || !email) { showToast('⚠️ Nome e email são obrigatórios'); return; }

  const e = new Empresa({
    nome,
    email,
    cnpj: get('e-cnpj'),
    pais: get('e-pais'),
    estado: get('e-estado'),
    cep: get('e-cep'),
    descricao: get('e-descricao'),
    competencias: get('e-competencias').split(',').map(s => s.trim()).filter(Boolean),
  });

  empresas.push(e);
  StorageService.saveEmpresas(empresas);
  renderEmpresas();
  closeModal('empresa');
  ['e-nome','e-cnpj','e-email','e-pais','e-estado','e-cep','e-descricao','e-competencias']
    .forEach(id => { (document.getElementById(id) as HTMLInputElement).value = ''; });
  showToast('✅ Empresa salva!');
}

//DELETE

function deleteCandidato(idx: number): void {
  candidatos.splice(idx, 1);
  StorageService.saveCandidatos(candidatos);
  renderCandidatos();
  showToast('🗑️ Candidato removido');
}

function deleteEmpresa(idx: number): void {
  empresas.splice(idx, 1);
  if (activeEmpresaIdx >= empresas.length) activeEmpresaIdx = Math.max(0, empresas.length - 1);
  StorageService.saveEmpresas(empresas);
  renderEmpresas();
  showToast('🗑️ Empresa removida');
}

//TOAST
function showToast(msg: string): void {
  const el = document.getElementById('toast')!;
  el.textContent = msg;
  el.classList.add('show');
  setTimeout(() => el.classList.remove('show'), 2500);
}

//INIT

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll<HTMLButtonElement>('.nav-tab').forEach(tab => {
    tab.addEventListener('click', () => showPage(tab.dataset.page!, tab));
  });

  document.getElementById('btn-add-candidato')!.addEventListener('click', () => openModal('candidato'));
  document.getElementById('btn-add-empresa')!.addEventListener('click', () => openModal('empresa'));

  document.getElementById('btn-save-candidato')!.addEventListener('click', saveCandidato);
  document.getElementById('btn-save-empresa')!.addEventListener('click', saveEmpresa);

  document.getElementById('btn-cancel-candidato')!.addEventListener('click', () => closeModal('candidato'));
  document.getElementById('btn-cancel-empresa')!.addEventListener('click', () => closeModal('empresa'));

  document.querySelectorAll('.modal-overlay').forEach(el => {
    el.addEventListener('click', e => {
      if (e.target === el) (el as HTMLElement).classList.remove('open');
    });
  });

  renderCandidatos();
  renderEmpresas();
});