import Chart from 'chart.js/auto';
import { Candidato } from '../models/Candidato';
import { Empresa } from '../models/Empresa';

let chartInstance: Chart | null = null;
export let activeEmpresaIdx = 0;

//Toast

export function showToast(msg: string): void {
  const el = document.getElementById('toast')!;
  el.textContent = msg;
  el.classList.add('show');
  setTimeout(() => el.classList.remove('show'), 2500);
}

//Modal
export function openModal(type: 'candidato' | 'empresa'): void {
  document.getElementById(`modal-${type}`)!.classList.add('open');
}

export function closeModal(type: 'candidato' | 'empresa'): void {
  document.getElementById(`modal-${type}`)!.classList.remove('open');
  clearErrors(type);
}

export function showErrors(type: 'candidato' | 'empresa', errors: string[]): void {
  clearErrors(type);
  const modal = document.querySelector(`#modal-${type} .modal`)!;
  const ul = document.createElement('ul');
  ul.className = 'error-list';
  errors.forEach(msg => {
    const li = document.createElement('li');
    li.textContent = msg;
    ul.appendChild(li);
  });
  modal.insertBefore(ul, modal.querySelector('.modal-footer'));
}

function clearErrors(type: 'candidato' | 'empresa'): void {
  document.querySelectorAll(`#modal-${type} .error-list`).forEach(el => el.remove());
}

//Candidatos

export function renderCandidatos(
  candidatos: Candidato[],
  onDelete: (i: number) => void
): void {
  const grid = document.getElementById('grid-candidatos')!;
  document.getElementById('count-cand')!.textContent = String(candidatos.length);

  if (!candidatos.length) {
    grid.innerHTML = `<div class="empty"><div class="empty-icon">👤</div><div class="empty-text">Nenhum candidato cadastrado ainda.</div></div>`;
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
    btn.addEventListener('click', () => onDelete(Number(btn.dataset.index)));
  });
}

//Empresas

export function renderEmpresas(
  empresas: Empresa[],
  onDelete: (i: number) => void
): void {
  const grid = document.getElementById('grid-empresas')!;
  document.getElementById('count-emp')!.textContent = String(empresas.length);

  if (!empresas.length) {
    grid.innerHTML = `<div class="empty"><div class="empty-icon">🏢</div><div class="empty-text">Nenhuma empresa cadastrada ainda.</div></div>`;
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
    btn.addEventListener('click', () => onDelete(Number(btn.dataset.index)));
  });
}

// ─── Perfil Empresa ───────────────────────────────────────────────────────────

export function renderPerfilEmpresa(
  empresas: Empresa[],
  activeIdx: number,
  onChipClick: (i: number) => void
): void {
  const chipsEl = document.getElementById('empresa-chips')!;

  if (!empresas.length) {
    chipsEl.innerHTML = '';
    document.getElementById('perfil-content')!.innerHTML = `
      <div class="empty"><div class="empty-icon">🏢</div><div class="empty-text">Nenhuma empresa cadastrada.</div></div>`;
    return;
  }

  chipsEl.innerHTML = empresas.map((e, i) => `
    <button class="empresa-chip ${i === activeIdx ? 'active' : ''}" data-index="${i}">${e.nome}</button>
  `).join('');

  chipsEl.querySelectorAll<HTMLButtonElement>('.empresa-chip').forEach(btn => {
    btn.addEventListener('click', () => onChipClick(Number(btn.dataset.index)));
  });

  const emp = empresas[activeIdx];
  const compCount = emp.getCompetenciaCount();
  const labels = Object.keys(compCount);
  const values = Object.values(compCount);

  const palette = ['rgba(124,92,252,0.85)','rgba(252,92,125,0.85)','rgba(92,248,200,0.85)','rgba(248,200,92,0.85)','rgba(200,92,248,0.85)'];
  const colors = labels.map((_, i) => palette[i % palette.length]);

  const candidatosHtml = emp.candidatos.length
    ? emp.candidatos.map(c => `
        <div class="candidato-row">
          <div class="mini-avatar">${c.nome.charAt(0)}</div>
          <div>
            <div class="anon-name">Candidato Anônimo</div>
            <div style="font-size:0.7rem;color:var(--text-muted)">${c.estado} · ${c.competencias.slice(0,3).join(', ')}</div>
          </div>
        </div>`).join('')
    : '<div style="color:var(--text-muted);font-size:0.8rem;padding:10px 0">Nenhum candidato vinculado.</div>';

  document.getElementById('perfil-content')!.innerHTML = `
    <div class="empresa-profile">
      <div class="profile-card">
        <h4>Candidatos (${emp.candidatos.length})</h4>${candidatosHtml}
      </div>
      <div class="profile-card">
        <h4>Sobre a empresa</h4>
        <div style="font-size:0.82rem;color:var(--text-muted);line-height:1.7;margin-bottom:16px">${emp.descricao}</div>
        <div class="tags">${emp.competencias.map(t => `<span class="tag">${t}</span>`).join('')}</div>
        <div style="margin-top:16px;font-size:0.72rem;color:var(--text-muted)">📧 ${emp.email}</div>
        <div style="margin-top:4px;font-size:0.72rem;color:var(--text-muted)">🌎 ${emp.pais} · ${emp.estado}</div>
      </div>
    </div>
    <div class="chart-wrap">
      <h4>Competências dos Candidatos</h4>
      <canvas id="chart-canvas" height="80"></canvas>
    </div>`;

  if (chartInstance) { chartInstance.destroy(); chartInstance = null; }

  if (labels.length) {
    chartInstance = new Chart(document.getElementById('chart-canvas') as HTMLCanvasElement, {
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
            callbacks: { label: ctx => ` ${ctx.raw} candidato(s) com esta skill` },
            backgroundColor: '#1c1c28', borderColor: '#2a2a3d', borderWidth: 1,
            titleColor: '#e8e8f0', bodyColor: '#6b6b8a', padding: 12,
          },
        },
        scales: {
          x: { ticks: { color: '#6b6b8a', font: { family: 'DM Mono', size: 11 } }, grid: { color: '#1c1c28' } },
          y: { ticks: { color: '#6b6b8a', font: { family: 'DM Mono', size: 11 }, stepSize: 1 }, grid: { color: '#1c1c28' }, beginAtZero: true },
        },
      },
    });
  }
}