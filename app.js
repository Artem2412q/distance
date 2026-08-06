(() => {
  'use strict';

  const STORAGE_KEY = 'magnit-dp-workspace-v26';
  const LEGACY_KEYS = ['magnit-dp-manual-v21', 'magnit-dp-manual-v20', 'magnit-dp-manual-v19', 'magnit-dp-manual-v18', 'magnit-dp-manual-v17', 'magnit-dp-state-v14', 'magnit-dp-state-v13', 'magnit-dp-state-v12'];
  const MAX_SKU = 5;
  const MAX_CHECKLISTS = 5;
  const MAX_DEFECTS = 6;
  const AUTH_SESSION_KEY = 'magnit-dp-auth-v26';
  const AUTH_USER_B64 = 'bWFnbml0X2Rw';
  const AUTH_PASS_B64 = 'MTUwMjkxODQ=';

  const STEP_GROUPS = [
    { id: 0, title: 'Замер ВПТ', short: 'ВПТ', description: 'Фиксация фотографии и внутриплодной температуры.' },
    { id: 1, title: 'Подготовка', short: 'Подготовка', description: 'Проверка заявки и размещения категорий.' },
    { id: 2, title: 'Выкладка тарных единиц', short: 'Тара', description: 'Контроль расположения выборки относительно камеры.' },
    { id: 3, title: 'Проверка весов', short: 'Весы', description: 'Исправность и обнуление весов.' },
    { id: 4, title: 'Контрольное взвешивание выборки', short: 'Взвешивание', description: 'Подтверждение контрольного взвешивания.' },
    { id: 5, title: 'Выкладка выборки на стол', short: 'Выкладка', description: 'Взвешивание тары и раскладка товара в один слой.' },
    { id: 6, title: 'Определение сорта / цветности', short: 'Цветность', description: 'Выполняется только при включённом контроле цветности.' },
    { id: 7, title: 'Сортировка на категории', short: 'Категории', description: 'Осмотр, распределение по категориям и контроль ошибок.' },
    { id: 8, title: 'Разрушающий контроль и измерения', short: 'Измерения', description: 'Разрушающий контроль выполняется всегда. Плотность и Brix включаются вручную.' },
    { id: 9, title: 'Контрольное взвешивание категорий', short: 'Категории', description: 'Взвешивание тары и каждой категории товара.' },
    { id: 10, title: 'Очистка рабочего пространства', short: 'Завершение', description: 'Освобождение стола после завершения контроля.' },
  ];

  const QUESTIONS = [
    { code: '0.1', row: 18, step: 0, text: 'Есть фото замера ВПТ', type: 'yesno' },
    { code: '1.1', row: 21, step: 1, text: 'Акт ТМЦ расположен на столе', type: 'yesno' },
    { code: '1.2', row: 22, step: 1, text: 'Таблички категорий разложены на столе', type: 'yesno' },
    { code: '2.1', row: 24, step: 2, text: 'Выборка расположена к камере скотчем', type: 'yesno' },
    { code: '2.2', row: 25, step: 2, text: 'Скотч виден на каждой тарной единице', type: 'yesno' },
    { code: '3.1', row: 26, step: 3, text: 'Весы исправны, включены и работают', type: 'yesno' },
    { code: '3.3', row: 27, step: 3, text: 'Сделано обнуление прибора', type: 'yesno' },
    { code: '4.1', row: 28, step: 4, text: 'Контрольное взвешивание произведено', type: 'yesno' },
    { code: '5.1', row: 29, step: 5, text: 'Пустая тара из выборки взвешена', type: 'yesno' },
    { code: '5.2', row: 30, step: 5, text: 'Каждая единица товара разложена на стол в один слой', type: 'yesno' },
    { code: '5.3', row: 31, step: 5, text: 'Сколько раз выборка была выложена на стол в один слой', type: 'number', min: 0, unit: 'раз' },
    { code: '6.1', row: 32, step: 6, text: 'Проверен веером цветности', type: 'yesno', feature: 'requiresColor' },
    { code: '6.2', row: 33, step: 6, text: 'Веер цветности расположен по центру стола и не закрывает товарные единицы', type: 'yesno', feature: 'requiresColor' },
    { code: '7.1', row: 34, step: 7, text: 'Каждая товарная единица осмотрена со всех сторон', type: 'yesno' },
    { code: '7.2', row: 35, step: 7, text: 'Единицы товара разложены по ячейкам с табличками в один слой', type: 'yesno' },
    { code: '7.3', row: 36, step: 7, text: 'Единицы товара в ячейках соответствуют категории / табличке', type: 'yesno' },
    { code: '7.4', row: 37, step: 7, text: 'Количество ошибок на качество', type: 'number', min: 0, unit: 'ошибок' },
    { code: '7.5', row: 38, step: 7, text: 'Замер лимитирующих дефектов / калибра сделан корректно на камеру', type: 'yesno' },
    { code: '8.1', row: 39, step: 8, text: 'Разрушающий контроль выполнен корректно — не менее 2% от общей выборки категории качества', type: 'yesno' },
    { code: '8.4', row: 40, step: 8, text: 'Измерение плотности сделано корректно по инструкции и бизнес-процессу', type: 'yesno', feature: 'requiresDensity' },
    { code: '8.5', row: 41, step: 8, text: 'Прибор плотности расположен на столе с единицей товара', type: 'yesno', feature: 'requiresDensity' },
    { code: '8.7', row: 42, step: 8, text: 'Замер сахара Brix сделан корректно по инструкции и бизнес-процессу', type: 'yesno', feature: 'requiresBrix' },
    { code: '8.8', row: 43, step: 8, text: 'Прибор Brix расположен на столе с единицей товара', type: 'yesno', feature: 'requiresBrix' },
    { code: '9.1', row: 45, step: 9, text: 'Весы исправны, включены и работают', type: 'yesno' },
    { code: '9.4', row: 46, step: 9, text: 'Взвешана тара, сделано обнуление весов', type: 'yesno' },
    { code: '9.6', row: 47, step: 9, text: 'Взвешена каждая категория товара в таре: брак, нестандарт, некалибр, осыпь', type: 'yesno' },
    { code: '10.1', row: 48, step: 10, text: 'Стол очищен от выборки', type: 'yesno' },
  ];

  const QUESTION_HINTS = {
    '0.1': 'Покажите на камеру товар и дисплей термометра одновременно. Значение должно читаться без приближения и перекрытий.',
    '1.1': 'Разместите акт ТМЦ в рабочей зоне так, чтобы были видны номер поставки и товарная позиция.',
    '1.2': 'Разложите таблички заранее и оставьте между категориями визуальные границы, чтобы исключить смешение товара.',
    '2.1': 'Поверните тарные единицы скотчем к камере. Сотрудник ДП должен видеть маркировку без смены ракурса.',
    '2.2': 'Проверьте каждую единицу тары по очереди. Если скотч не виден, попросите развернуть тару до начала выборки.',
    '3.1': 'До взвешивания убедитесь, что дисплей весов стабилен, питание включено, а платформа не касается посторонних предметов.',
    '3.3': 'На камере должно быть видно значение 0.000 после установки пустой тары или перед началом взвешивания.',
    '4.1': 'Сверьте массу выборки с заявленной. При расхождении зафиксируйте комментарий и повторное взвешивание.',
    '5.1': 'Сначала взвесьте пустую тару, затем выполните обнуление. Это исключит включение массы тары в результат.',
    '5.2': 'Товар не должен перекрывать соседние единицы. Для крупной выборки выполняйте выкладку несколькими партиями.',
    '5.3': 'Укажите фактическое количество полных выкладок выборки. Время появится автоматически после ввода значения.',
    '6.1': 'Сопоставляйте цветность при нейтральном освещении. Веер и поверхность товара должны находиться в одном кадре.',
    '6.2': 'Веер не должен закрывать дефекты и товарные единицы. Центрируйте его относительно рабочей зоны.',
    '7.1': 'Попросите поворачивать каждую единицу минимум на один полный оборот, включая основание и зону плодоножки.',
    '7.2': 'Категории раскладываются отдельно и в один слой. Не допускайте наложения товара и выхода за границы ячеек.',
    '7.3': 'Перед подтверждением последовательно сравните содержимое каждой ячейки с её табличкой.',
    '7.4': 'Считайте только подтверждённые ошибки классификации. При значении больше нуля добавьте краткое пояснение.',
    '7.5': 'Линейка, шаблон или измерительный инструмент и точка замера должны одновременно находиться в кадре.',
    '8.1': 'Объём разрушающего контроля — не менее 2% выборки категории качества. Зафиксируйте округление в большую сторону.',
    '8.4': 'Контролируйте подготовку прибора, точку измерения и стабильность показания. Отклонения укажите в комментарии.',
    '8.5': 'Прибор и измеряемая единица товара должны быть видны в одном кадре до фиксации результата.',
    '8.7': 'Проверьте подготовку образца, чистоту призмы и корректность считывания значения Brix.',
    '8.8': 'Рефрактометр и единица товара должны оставаться на столе в зоне видимости камеры.',
    '9.1': 'Повторно проверьте работоспособность весов перед взвешиванием категорий — после длительной работы возможен уход нуля.',
    '9.4': 'Для каждой новой тары выполните отдельное обнуление. Не переносите тару между категориями без повторной проверки.',
    '9.6': 'Взвешивайте категории поочерёдно и сразу записывайте массу, чтобы исключить перестановку значений.',
    '10.1': 'После завершения в кадре должны остаться чистый стол, весы и таблички без товара и отходов.',
  };

  const PAGE_META = {
    shipment: ['Этап 1 из 5', 'Приёмка'],
    products: ['Этап 2 из 5', 'Товары'],
    checklist: ['Этап 3 из 5', 'Пошаговый чек-лист'],
    defects: ['Этап 4 из 5', 'Дефекты и некалибр'],
    summary: ['Этап 5 из 5', 'Итоги и выгрузка'],
  };
  const PAGE_ORDER = Object.keys(PAGE_META);
  const RC_OPTIONS = [{"name":"РЦ Славянск-на-Кубани","timeZone":"Europe/Moscow","mskOffset":0},{"name":"РЦ Тула","timeZone":"Europe/Moscow","mskOffset":0},{"name":"РЦ Челябинск BTR","timeZone":"Asia/Yekaterinburg","mskOffset":2},{"name":"РЦ Ярославль","timeZone":"Europe/Moscow","mskOffset":0},{"name":"РЦ Астрахань Тинаки","timeZone":"Europe/Astrakhan","mskOffset":1},{"name":"РЦ Ижевск","timeZone":"Europe/Samara","mskOffset":1},{"name":"РЦ Тольятти (новый)","timeZone":"Europe/Samara","mskOffset":1},{"name":"РЦ Ростов-на-Дону","timeZone":"Europe/Moscow","mskOffset":0},{"name":"РЦ Воронеж","timeZone":"Europe/Moscow","mskOffset":0},{"name":"РЦ Шушары (а)","timeZone":"Europe/Moscow","mskOffset":0},{"name":"РЦ Кропоткин","timeZone":"Europe/Moscow","mskOffset":0},{"name":"РЦ Дзержинск","timeZone":"Europe/Moscow","mskOffset":0},{"name":"РЦ Краснодар Индустриальный","timeZone":"Europe/Moscow","mskOffset":0},{"name":"РЦ Орел (Хардиково)","timeZone":"Europe/Moscow","mskOffset":0},{"name":"РЦ Омск","timeZone":"Asia/Omsk","mskOffset":3},{"name":"РЦ Сургут","timeZone":"Asia/Yekaterinburg","mskOffset":2},{"name":"РЦ Тамбов","timeZone":"Europe/Moscow","mskOffset":0},{"name":"РЦ Кемерово","timeZone":"Asia/Novokuznetsk","mskOffset":4},{"name":"РЦ Новосибирск Садовый (новый)","timeZone":"Asia/Novosibirsk","mskOffset":4},{"name":"РЦ Пермь","timeZone":"Asia/Yekaterinburg","mskOffset":2},{"name":"РЦ Оренбург Ленина","timeZone":"Asia/Yekaterinburg","mskOffset":2},{"name":"РЦ Тюмень","timeZone":"Asia/Yekaterinburg","mskOffset":2},{"name":"РЦ Смоленск","timeZone":"Europe/Moscow","mskOffset":0},{"name":"РЦ Ерзовка","timeZone":"Europe/Volgograd","mskOffset":0},{"name":"РЦ Мурманск","timeZone":"Europe/Moscow","mskOffset":0},{"name":"РЦ Киров","timeZone":"Europe/Kirov","mskOffset":0},{"name":"РЦ Иваново","timeZone":"Europe/Moscow","mskOffset":0},{"name":"РЦ Лермонтов","timeZone":"Europe/Moscow","mskOffset":0},{"name":"РЦ Москва Восток BTR","timeZone":"Europe/Moscow","mskOffset":0},{"name":"РЦ Первоуральск","timeZone":"Asia/Yekaterinburg","mskOffset":2},{"name":"РЦ Пенза","timeZone":"Europe/Moscow","mskOffset":0},{"name":"РЦ Стерлитамак","timeZone":"Asia/Yekaterinburg","mskOffset":2},{"name":"РЦ Колпино","timeZone":"Europe/Moscow","mskOffset":0},{"name":"РЦ Шахты","timeZone":"Europe/Moscow","mskOffset":0},{"name":"РЦ Энгельс","timeZone":"Europe/Saratov","mskOffset":1},{"name":"РЦ Великий Новгород","timeZone":"Europe/Moscow","mskOffset":0},{"name":"РЦ Дмитров","timeZone":"Europe/Moscow","mskOffset":0},{"name":"РЦ Зеленодольск","timeZone":"Europe/Moscow","mskOffset":0},{"name":"РЦ Коломна","timeZone":"Europe/Moscow","mskOffset":0}];
  RC_OPTIONS.sort((a, b) => a.name.localeCompare(b.name, 'ru', { sensitivity: 'base' }));
  const DEFAULT_RC_TIME_ZONE = 'Europe/Moscow';
  const SIDEBAR_COLLAPSED_KEY = 'magnit-dp-sidebar-collapsed-v1';
  let transitionSerial = 0;
  let stickyLayoutFrame = 0;
  let ambientLayoutFrame = 0;

  function updateStickyLayout() {
    stickyLayoutFrame = 0;
    const root = document.documentElement;
    const appShell = document.querySelector('.app-shell');
    if (!appShell || appShell.hidden) return;
    const topbar = document.querySelector('.topbar');
    const workspaceBar = document.getElementById('workspaceBar');
    const topbarHeight = Math.ceil(topbar?.getBoundingClientRect().height || 0);
    const workspaceHeight = Math.ceil(workspaceBar?.getBoundingClientRect().height || 0);
    if (topbarHeight) root.style.setProperty('--topbar-live', `${topbarHeight}px`);
    root.style.setProperty('--workspace-live', '0px');
  }

  function queueStickyLayoutUpdate() {
    if (stickyLayoutFrame) cancelAnimationFrame(stickyLayoutFrame);
    stickyLayoutFrame = requestAnimationFrame(updateStickyLayout);
  }

  function initStickyLayout() {
    const topbar = document.querySelector('.topbar');
    const workspaceBar = document.getElementById('workspaceBar');
    if (typeof ResizeObserver === 'function') {
      const observer = new ResizeObserver(queueStickyLayoutUpdate);
      if (topbar) observer.observe(topbar);
      if (workspaceBar) observer.observe(workspaceBar);
    }
    window.addEventListener('resize', queueStickyLayoutUpdate, { passive: true });
    queueStickyLayoutUpdate();
  }

  function positionAmbientBrand(item) {
    if (!item) return;
    const ambient = document.getElementById('brandAmbient');
    const ambientRect = ambient?.getBoundingClientRect();
    const workRect = pageContent?.getBoundingClientRect();
    item.classList.remove('ambient-no-room');
    if (!ambientRect?.width || !ambientRect?.height || !workRect?.width) {
      item.classList.add('ambient-no-room');
      return;
    }

    const safeGap = 18;
    const leftEnd = Math.max(0, workRect.left - ambientRect.left - safeGap);
    const rightStart = Math.min(ambientRect.width, workRect.right - ambientRect.left + safeGap);
    const lanes = [
      { side: 'left', start: 0, end: leftEnd },
      { side: 'right', start: rightStart, end: ambientRect.width },
    ].map(lane => ({ ...lane, width: lane.end - lane.start })).filter(lane => lane.width >= 210);

    if (!lanes.length) {
      item.classList.add('ambient-no-room');
      return;
    }

    const lane = lanes[Math.floor(Math.random() * lanes.length)];
    const width = Math.min(360, Math.max(190, (lane.width - 32) * .92));
    const halfWidth = width / 2;
    const xMin = lane.start + halfWidth + 10;
    const xMax = lane.end - halfWidth - 10;
    const x = xMax > xMin ? xMin + Math.random() * (xMax - xMin) : lane.start + lane.width / 2;
    const itemHeight = width;
    const yMin = Math.max(128, itemHeight / 2 + 24);
    const yMax = Math.max(yMin, ambientRect.height - itemHeight / 2 - 40);
    const y = yMin + Math.random() * Math.max(0, yMax - yMin);
    const rotation = -4 + Math.random() * 8;
    item.dataset.ambientSide = lane.side;
    item.style.setProperty('--ambient-width', `${width.toFixed(2)}px`);
    item.style.setProperty('--ambient-x', `${x.toFixed(2)}px`);
    item.style.setProperty('--ambient-y', `${y.toFixed(2)}px`);
    item.style.setProperty('--ambient-rotation', `${rotation.toFixed(2)}deg`);
  }

  function scheduleAmbientBrandPosition() {
    if (ambientLayoutFrame) cancelAnimationFrame(ambientLayoutFrame);
    ambientLayoutFrame = requestAnimationFrame(() => {
      ambientLayoutFrame = 0;
      document.querySelectorAll('[data-brand-ambient-item]').forEach(positionAmbientBrand);
    });
  }

  function initAmbientBrand() {
    const items = [...document.querySelectorAll('[data-brand-ambient-item]')];
    if (!items.length) return;
    items.forEach(item => {
      item.addEventListener('animationiteration', event => {
        if (event.target === item && event.animationName === 'ambientStageDrift') positionAmbientBrand(item);
      });
    });
    window.addEventListener('resize', scheduleAmbientBrandPosition, { passive: true });
    scheduleAmbientBrandPosition();
  }

  function runAdaptiveTransition(update, { direction = 'forward', mode = 'page' } = {}) {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (typeof document.startViewTransition !== 'function' || reducedMotion) {
      update();
      return;
    }
    const root = document.documentElement;
    const serial = ++transitionSerial;
    root.dataset.navDirection = direction;
    root.dataset.transitionMode = mode;
    const transition = document.startViewTransition(update);
    transition.finished.finally(() => {
      if (serial !== transitionSerial) return;
      delete root.dataset.navDirection;
      delete root.dataset.transitionMode;
    });
  }

  const FEATURE_LABELS = {
    requiresColor: ['Цветность', 'Добавляет контроль веером цветности в чек-лист'],
    requiresDensity: ['Плотность / пенетрация', 'Добавляет контроль измерения плотности в чек-лист'],
    requiresBrix: ['Brix', 'Добавляет контроль сахара Brix в чек-лист'],
  };

  const QUESTIONS_WITHOUT_TIME = new Set(['2.1', '3.1', '5.1', '5.2', '6.1', '7.1', '7.2', '7.3', '8.4', '8.7', '9.1', '9.4']);
  const EXCEL_STEP_ONE_TIME_CODES = new Set(['1.1', '1.2']);
  const EXCEL_STEP_ONE_TIME_ROW = 23;

  const defaultSku = () => ({
    id: globalThis.crypto?.randomUUID?.() || `sku-${Date.now()}-${Math.random()}`,
    code: '', name: '', vpt: '', sampleMass: '', defectMass: '', nonstandardMass: '', debrisMass: '', caliberMass: '',
    brixValues: '', wasteLimit: '', apmError: 'no', comment: '', requiresColor: false, requiresDensity: false, requiresBrix: false,
    checklist: {}, defects: [],
  });

  const defaultState = () => ({
    id: globalThis.crypto?.randomUUID?.() || `checklist-${Date.now()}-${Math.random()}`,
    version: 25,
    shipment: {
      id: '', rc: '', date: todayInput(), supplier: '', format: 'Онлайн', mokk: '', dpId: '',
      connectionTime: '', acceptanceStart: '', acceptanceEnd: '', reportEnd: '',
    },
    skus: [defaultSku()],
    notes: '',
    ui: {
      page: 'shipment', currentSku: 0, checkStep: 0, defectSearch: '', defectSeverity: 'all',
      notesOpen: false, notesPinned: true, notesMinimized: false, notesPosition: null,
    },
    updatedAt: new Date().toISOString(),
  });

  let workspace = loadWorkspace();
  let state = workspace.checklists.find(item => item.id === workspace.activeChecklistId) || workspace.checklists[0];
  workspace.activeChecklistId = state.id;
  let saveTimer = null;
  let dragState = null;
  let activeExportAbortController = null;
  let exportCancelled = false;

  const appShell = document.querySelector('.app-shell');
  const mobileNav = document.querySelector('.mobile-nav');
  const loginOverlay = document.getElementById('loginOverlay');
  const pageContent = document.getElementById('pageContent');
  const notesPanel = document.getElementById('notesPanel');
  const notesTextarea = document.getElementById('notesTextarea');
  const modalBackdrop = document.getElementById('modalBackdrop');
  const loadingOverlay = document.getElementById('loadingOverlay');
  let authenticated = sessionStorage.getItem(AUTH_SESSION_KEY) === '1';

  function decodeBase64(value) {
    try { return atob(value); } catch (_) { return ''; }
  }

  function setAuthenticated(isAuth) {
    authenticated = Boolean(isAuth);
    sessionStorage.setItem(AUTH_SESSION_KEY, authenticated ? '1' : '0');
    document.body.classList.toggle('auth-locked', !authenticated);
    loginOverlay.hidden = authenticated;
    appShell.hidden = !authenticated;
    if (mobileNav) mobileNav.hidden = !authenticated;
    if (!authenticated) {
      notesPanel.classList.remove('open');
      modalBackdrop.hidden = true;
      loadingOverlay.hidden = true;
    }
    if (authenticated) {
      render();
      updateNotesPanel();
      scheduleAmbientBrandPosition();
    }
  }

  function handleLoginSubmit(event) {
    event.preventDefault();
    const userInput = document.getElementById('loginUsername');
    const passInput = document.getElementById('loginPassword');
    const errorEl = document.getElementById('loginError');
    const login = (userInput?.value || '').trim();
    const password = passInput?.value || '';
    const loginOk = login === decodeBase64(AUTH_USER_B64);
    const passOk = password === decodeBase64(AUTH_PASS_B64);
    if (!loginOk || !passOk) {
      if (errorEl) errorEl.textContent = 'Неверный логин или пароль.';
      passInput?.focus();
      passInput?.select?.();
      return;
    }
    if (errorEl) errorEl.textContent = '';
    if (userInput) userInput.value = '';
    if (passInput) passInput.value = '';
    setAuthenticated(true);
    toast('Авторизация выполнена.', 'success');
  }

  function logout() {
    if (!authenticated) return;
    if (!confirm('Выйти из системы?')) return;
    setAuthenticated(false);
    const errorEl = document.getElementById('loginError');
    if (errorEl) errorEl.textContent = '';
    document.getElementById('loginForm')?.reset();
    document.getElementById('loginUsername')?.focus();
  }

  function initAuth() {
    document.getElementById('loginForm')?.addEventListener('submit', handleLoginSubmit);
    document.getElementById('togglePassword')?.addEventListener('click', () => {
      const input = document.getElementById('loginPassword');
      const btn = document.getElementById('togglePassword');
      if (!input || !btn) return;
      const show = input.type === 'password';
      input.type = show ? 'text' : 'password';
      btn.textContent = show ? 'Скрыть' : 'Показать';
      btn.setAttribute('aria-label', show ? 'Скрыть пароль' : 'Показать пароль');
    });
    ['logoutButton'].forEach(id => document.getElementById(id)?.addEventListener('click', logout));
    document.body.classList.toggle('auth-locked', !authenticated);
    loginOverlay.hidden = authenticated;
    appShell.hidden = !authenticated;
    if (mobileNav) mobileNav.hidden = !authenticated;
    if (!authenticated) setTimeout(() => document.getElementById('loginUsername')?.focus(), 60);
  }

  function todayInput() {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }

  function normalizeRcSearch(value) {
    return String(value || '').trim().toLocaleLowerCase('ru-RU').replace(/ё/g, 'е').replace(/\s+/g, ' ');
  }

  function getRcConfig(name = state.shipment.rc) {
    const query = normalizeRcSearch(name);
    if (!query) return null;
    return RC_OPTIONS.find(item => normalizeRcSearch(item.name) === query) || null;
  }

  function findBestRcMatch(value) {
    const query = normalizeRcSearch(value);
    if (!query) return null;
    const exact = getRcConfig(value);
    if (exact) return exact;
    const candidates = RC_OPTIONS.filter(item => {
      const name = normalizeRcSearch(item.name);
      return name.includes(query) || query.includes(name.replace(/^рц\s+/, ''));
    });
    return candidates.length === 1 ? candidates[0] : null;
  }

  function formatMskOffset(offset = 0) {
    if (!offset) return 'МСК';
    return `МСК${offset > 0 ? '+' : ''}${offset}`;
  }

  function zonedNowParts(timeZone = getRcConfig()?.timeZone || DEFAULT_RC_TIME_ZONE) {
    try {
      const parts = new Intl.DateTimeFormat('en-CA', {
        timeZone, year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23',
      }).formatToParts(new Date());
      const values = Object.fromEntries(parts.filter(part => part.type !== 'literal').map(part => [part.type, part.value]));
      return { date: `${values.year}-${values.month}-${values.day}`, time: `${values.hour}:${values.minute}`, seconds: `${values.hour}:${values.minute}:${values.second}` };
    } catch (error) {
      console.warn('Не удалось определить время РЦ:', error);
      const date = new Date(); const pad = value => String(value).padStart(2, '0');
      return { date: `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`, time: `${pad(date.getHours())}:${pad(date.getMinutes())}`, seconds: `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}` };
    }
  }

  function currentRcTimeMeta() {
    const config = getRcConfig();
    return config
      ? { ...config, label: `${formatMskOffset(config.mskOffset)} · ${config.timeZone}` }
      : { name: 'РЦ не выбран', timeZone: DEFAULT_RC_TIME_ZONE, mskOffset: 0, label: 'МСК · выберите РЦ' };
  }

  function nowLocalInput() {
    const parts = zonedNowParts(currentRcTimeMeta().timeZone);
    return `${state.shipment.date || parts.date}T${parts.time}`;
  }

  function nowOperatorInput() {
    const date = new Date();
    const pad = value => String(value).padStart(2, '0');
    const localDate = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
    const localTime = `${pad(date.getHours())}:${pad(date.getMinutes())}`;
    return `${state.shipment.date || localDate}T${localTime}`;
  }

  function updateLiveRcClock() {
    const clock = document.getElementById('liveClock');
    const zone = document.getElementById('liveClockZone');
    const meta = currentRcTimeMeta();
    if (clock) clock.textContent = zonedNowParts(meta.timeZone).time;
    if (zone) zone.textContent = meta.name === 'РЦ не выбран' ? 'Выберите РЦ — пока используется московское время' : `${meta.name} · ${formatMskOffset(meta.mskOffset)}`;
  }

  function normalizeTimeText(value) {
    const raw = String(value ?? '').trim();
    if (!raw) return { value: '', valid: true };
    const cleaned = raw.replace(/[.\s;]+/g, ':');
    let parts;
    if (cleaned.includes(':')) {
      parts = cleaned.split(':').filter(Boolean);
      if (parts.length < 2 || parts.length > 3 || parts.some(part => !/^\d{1,2}$/.test(part))) return { value: '', valid: false };
    } else {
      const digits = cleaned.replace(/\D/g, '');
      if (digits.length === 3) parts = [digits.slice(0, 1), digits.slice(1, 3)];
      else if (digits.length === 4) parts = [digits.slice(0, 2), digits.slice(2, 4)];
      else if (digits.length === 5) parts = [digits.slice(0, 1), digits.slice(1, 3), digits.slice(3, 5)];
      else if (digits.length === 6) parts = [digits.slice(0, 2), digits.slice(2, 4), digits.slice(4, 6)];
      else return { value: '', valid: false };
    }
    const [hourRaw, minuteRaw] = parts;
    const hour = Number(hourRaw); const minute = Number(minuteRaw);
    if (!Number.isInteger(hour) || !Number.isInteger(minute) || hour < 0 || hour > 23 || minute < 0 || minute > 59) return { value: '', valid: false };
    const pad = n => String(n).padStart(2, '0');
    return { value: `${pad(hour)}:${pad(minute)}`, valid: true };
  }

  function checklistDateTimeFromTime(value, date = state.shipment.date || todayInput()) {
    const normalized = normalizeTimeText(value);
    return normalized.valid && normalized.value ? `${date}T${normalized.value}` : '';
  }

  function timeOnly(value) {
    if (!value) return '';
    const match = String(value).match(/(?:T|^)(\d{1,2}:\d{2}(?::\d{2})?)/);
    if (match) return normalizeTimeText(match[1]).value;
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return '';
    const pad = n => String(n).padStart(2, '0');
    return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
  }

  function rebaseDateTime(value, date) {
    const time = timeOnly(value);
    return time && date ? `${date}T${time}` : '';
  }

  function synchronizeAllTimesToDate(date) {
    if (!date) return;
    ['connectionTime', 'acceptanceStart', 'acceptanceEnd', 'reportEnd'].forEach(key => {
      if (state.shipment[key]) state.shipment[key] = rebaseDateTime(state.shipment[key], date);
    });
    state.skus.forEach(sku => Object.values(sku.checklist || {}).forEach(answer => {
      if (answer?.time) answer.time = rebaseDateTime(answer.time, date);
    }));
  }

  function escapeHtml(value) {
    return String(value ?? '').replace(/[&<>'"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[c]));
  }
  const escapeAttr = escapeHtml;
  function numeric(value) {
    if (value === '' || value === null || value === undefined) return 0;
    const n = Number(String(value).replace(',', '.'));
    return Number.isFinite(n) ? n : 0;
  }
  function hasNumber(value) { return value !== '' && value !== null && value !== undefined && Number.isFinite(Number(String(value).replace(',', '.'))); }
  function displayNumber(value, digits = 2) {
    return hasNumber(value) ? new Intl.NumberFormat('ru-RU', { maximumFractionDigits: digits }).format(numeric(value)) : '—';
  }
  function percent(part, total) { return numeric(total) > 0 ? numeric(part) / numeric(total) * 100 : 0; }
  function formatPercent(value) { return `${new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2 }).format(Number(value) || 0)}%`; }
  function formatDateTime(value) {
    if (!value) return 'Не указано';
    const d = new Date(value);
    return Number.isNaN(d.getTime()) ? 'Не указано' : new Intl.DateTimeFormat('ru-RU', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' }).format(d);
  }
  function durationDaysFromInputs(start, end) {
    const startSerial = excelSerialFromInput(start);
    let endSerial = excelSerialFromInput(end);
    if (startSerial === null || endSerial === null) return null;
    while (endSerial < startSerial) endSerial += 1;
    return Math.max(0, endSerial - startSerial);
  }

  function formatDuration(start, end) {
    const days = durationDaysFromInputs(start, end);
    if (days === null) return '00:00';
    const minutes = Math.round(days * 24 * 60);
    return `${String(Math.floor(minutes / 60)).padStart(2, '0')}:${String(minutes % 60).padStart(2, '0')}`;
  }

  function normalizeBrixValues(value, complete = false) {
    let text = String(value ?? '')
      .replace(/,/g, '.')
      .replace(/[\/|;]+/g, '\\')
      .replace(/\s+/g, '\\')
      .replace(/[^0-9.\\]/g, '')
      .replace(/\\{2,}/g, '\\');
    const parts = text.split('\\').map(part => {
      const dot = part.indexOf('.');
      let clean = dot < 0 ? part : `${part.slice(0, dot + 1)}${part.slice(dot + 1).replace(/\./g, '')}`;
      if (complete) clean = clean.replace(/^\./, '0.').replace(/\.$/, '');
      return clean;
    });
    if (complete) return parts.filter(Boolean).join('\\');
    return parts.join('\\');
  }

  function isValidBrixValues(value) {
    const normalized = normalizeBrixValues(value, true);
    return Boolean(normalized) && /^\d+(?:\.\d+)?(?:\\\d+(?:\.\d+)?)*$/.test(normalized);
  }

  function brixValuesForExport(sku) {
    return sku?.requiresBrix && isValidBrixValues(sku.brixValues) ? normalizeBrixValues(sku.brixValues, true) : '';
  }

  function updateDurationDisplays() {
    const shipment = state.shipment;
    const values = {
      total: formatDuration(shipment.connectionTime || shipment.acceptanceStart, shipment.reportEnd),
      acceptance: formatDuration(shipment.acceptanceStart || shipment.connectionTime, shipment.acceptanceEnd),
      report: formatDuration(shipment.acceptanceEnd, shipment.reportEnd),
    };
    Object.entries(values).forEach(([key, value]) => {
      const element = document.querySelector(`[data-duration-display="${key}"]`);
      if (element) element.textContent = value;
    });
  }

  function migrateSku(raw = {}) {
    return {
      ...defaultSku(),
      code: raw.code || '', name: raw.name || '', vpt: raw.vpt || '', sampleMass: raw.sampleMass ?? '',
      defectMass: raw.defectMass ?? '', nonstandardMass: raw.nonstandardMass ?? '', debrisMass: raw.debrisMass ?? '',
      caliberMass: raw.caliberMass ?? '', brixValues: normalizeBrixValues(raw.brixValues ?? '', true), wasteLimit: raw.wasteLimit ?? '', apmError: raw.apmError || 'no', comment: raw.comment || '',
      requiresColor: Boolean(raw.requiresColor), requiresDensity: Boolean(raw.requiresDensity), requiresBrix: Boolean(raw.requiresBrix),
      checklist: raw.checklist && typeof raw.checklist === 'object' ? raw.checklist : {},
      defects: Array.isArray(raw.defects) ? raw.defects.slice(0, MAX_DEFECTS).map(d => {
        const savedCategory = d?.severity;
        const severity = ['defect', 'nonstandard', 'caliber'].includes(savedCategory)
          ? savedCategory
          : ['noncaliber', 'uncalibrated', 'calibre'].includes(savedCategory)
            ? 'caliber'
            : savedCategory === 'critical' ? 'defect' : 'nonstandard';
        const rawVisual = String(d?.visual ?? '').trim();
        const visual = rawVisual === 'yes' ? 'Видно' : rawVisual === 'no' ? 'Невидно' : rawVisual;
        return { type: '', visual, count: '', severity, comment: '', ...d, visual, severity };
      }) : [],
    };
  }

  function migrateState(raw = {}) {
    const base = defaultState();
    return {
      ...base,
      ...raw,
      id: raw.id || base.id,
      version: 25,
      shipment: { ...base.shipment, ...(raw.shipment || {}), format: ['Онлайн', 'Архив'].includes(raw.shipment?.format) ? raw.shipment.format : 'Онлайн' },
      skus: Array.isArray(raw.skus) && raw.skus.length ? raw.skus.slice(0, MAX_SKU).map(migrateSku) : [defaultSku()],
      ui: (() => { const { theme: _legacyTheme, ...savedUi } = raw.ui || {}; return { ...base.ui, ...savedUi, page: PAGE_META[raw.ui?.page] ? raw.ui.page : 'shipment' }; })(),
    };
  }

  function loadWorkspace() {
    try {
      const currentRaw = localStorage.getItem(STORAGE_KEY);
      if (currentRaw) {
        const parsed = JSON.parse(currentRaw);
        if (Array.isArray(parsed?.checklists) && parsed.checklists.length) {
          const checklists = parsed.checklists.slice(0, MAX_CHECKLISTS).map(migrateState);
          const activeChecklistId = checklists.some(item => item.id === parsed.activeChecklistId) ? parsed.activeChecklistId : checklists[0].id;
          return { version: 25, activeChecklistId, checklists, updatedAt: parsed.updatedAt || new Date().toISOString() };
        }
      }
      for (const key of LEGACY_KEYS) {
        const raw = localStorage.getItem(key);
        if (!raw) continue;
        const legacy = migrateState(JSON.parse(raw));
        return { version: 25, activeChecklistId: legacy.id, checklists: [legacy], updatedAt: new Date().toISOString() };
      }
    } catch (error) {
      console.warn('Не удалось прочитать сохранение', error);
    }
    const first = defaultState();
    return { version: 25, activeChecklistId: first.id, checklists: [first], updatedAt: new Date().toISOString() };
  }

  function persistWorkspace() {
    workspace.version = 25;
    workspace.activeChecklistId = state.id;
    workspace.updatedAt = new Date().toISOString();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(workspace));
  }

  function scheduleSave() {
    state.updatedAt = new Date().toISOString();
    workspace.updatedAt = state.updatedAt;
    const el = document.getElementById('saveState');
    el?.classList.add('saving');
    if (el?.querySelector('b')) el.querySelector('b').textContent = 'Сохраняем…';
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => {
      persistWorkspace();
      el?.classList.remove('saving');
      if (el?.querySelector('b')) el.querySelector('b').textContent = 'Сохранено';
      updateGlobalProgress();
      updateWorkspaceTabStatus();
    }, 220);
  }
  function saveNow() { persistWorkspace(); }


  function getSkuLabel(sku, index) { return sku.name || sku.code || `Товар ${index + 1}`; }
  function isDefectRowComplete(row = {}) {
    const countReady = row.count !== '' && row.count !== null && row.count !== undefined && numeric(row.count) >= 0;
    return Boolean(String(row.type || '').trim() && String(row.visual || '').trim() && row.severity && countReady);
  }
  function getSkuStatus(sku, index = 0) {
    const applicable = QUESTIONS.filter(question => isApplicable(sku, question));
    const answered = applicable.filter(question => isAnswered(sku, question));
    const negativeAnswers = applicable.filter(question => getAnswer(sku, question.code).status === 'no');
    const qualityErrors = numeric(getAnswer(sku, '7.4').value);
    const defectRows = Array.isArray(sku.defects) ? sku.defects : [];
    const completedDefectRows = defectRows.filter(isDefectRowComplete).length;
    const hasDefectUnits = defectRows.some(row => numeric(row.count) > 0);
    const categoryMass = numeric(sku.defectMass) + numeric(sku.nonstandardMass) + numeric(sku.debrisMass) + numeric(sku.caliberMass);
    const sampleMass = numeric(sku.sampleMass);
    const identityDone = Number(Boolean(String(sku.code || '').trim())) + Number(Boolean(String(sku.name || '').trim()));
    const brixRequired = Boolean(sku.requiresBrix);
    const brixDone = !brixRequired || isValidBrixValues(sku.brixValues);
    const summaryDone = Number(Boolean(String(sku.vpt || '').trim())) + Number(sampleMass > 0) + Number(brixDone);
    const total = 2 + applicable.length + 3 + defectRows.length;
    const done = identityDone + answered.length + summaryDone + completedDefectRows;
    const progress = total ? Math.min(100, Math.round(done / total * 100)) : 0;
    const hasActivity = Boolean(
      String(sku.code || '').trim() || String(sku.name || '').trim() || String(sku.vpt || '').trim() ||
      String(sku.sampleMass || '').trim() || String(sku.comment || '').trim() || sku.apmError === 'yes' ||
      sku.requiresColor || sku.requiresDensity || sku.requiresBrix || answered.length || defectRows.length || categoryMass > 0
    );
    const blockers = [];
    if (!String(sku.code || '').trim()) blockers.push('не указан код');
    if (!String(sku.name || '').trim()) blockers.push('не указано название');
    if (answered.length < applicable.length) blockers.push(`чек-лист ${answered.length}/${applicable.length}`);
    if (!String(sku.vpt || '').trim()) blockers.push('не указана ВПТ');
    if (sampleMass <= 0) blockers.push('нет массы выборки');
    if (sampleMass > 0 && categoryMass > sampleMass + 0.0001) blockers.push('массы категорий превышают выборку');
    if (!brixDone) blockers.push('не заполнен Brix');
    if (completedDefectRows < defectRows.length) blockers.push('есть незавершённые записи дефектов');
    const issueCount = negativeAnswers.length + Number(qualityErrors > 0) + Number(hasDefectUnits) + Number(sku.apmError === 'yes');
    if (!hasActivity) return { key: 'not-started', label: 'Не начата', detail: 'Позиция ещё не заполнялась', progress: 0, issueCount, blockers };
    if (!blockers.length && issueCount > 0) return { key: 'ready-warning', label: 'Готова с замечаниями', detail: `${issueCount} сигнал${issueCount === 1 ? '' : issueCount < 5 ? 'а' : 'ов'} для проверки`, progress: 100, issueCount, blockers };
    if (!blockers.length) return { key: 'ready', label: 'Готова', detail: 'Все обязательные данные заполнены', progress: 100, issueCount, blockers };
    if (issueCount > 0) return { key: 'attention', label: 'Есть нарушения', detail: `${blockers.length} незавершённых блоков · ${issueCount} замечаний`, progress, issueCount, blockers };
    return { key: 'in-progress', label: 'В работе', detail: blockers.slice(0, 2).join(' · '), progress, issueCount, blockers };
  }
  function skuStatusBadge(sku, index, compact = false) {
    const status = getSkuStatus(sku, index);
    return `<span class="sku-status-badge status-${status.key}${compact ? ' is-compact' : ''}" data-sku-status-badge="${index}"><i></i><span data-sku-status-label>${escapeHtml(status.label)}</span><small data-sku-status-progress>${status.progress}%</small></span>`;
  }
  function isApplicable(sku, question) { return !question.feature || Boolean(sku[question.feature]); }
  function getAnswer(sku, code) { return { status: '', value: '', time: '', comment: '', ...(sku.checklist?.[code] || {}) }; }
  function questionShowsTimeControl(question) { return Boolean(question) && !QUESTIONS_WITHOUT_TIME.has(question.code); }
  function questionAllowsTimeValue(question, answer = {}) { return questionShowsTimeControl(question) && !(question.code === '7.4' && numeric(answer.value) <= 0); }
  function isAnswered(sku, question) {
    if (!isApplicable(sku, question)) return true;
    const a = getAnswer(sku, question.code);
    return question.type === 'number' ? a.value !== '' : Boolean(a.status);
  }
  function questionsForStep(sku, stepId) { return QUESTIONS.filter(q => q.step === stepId && isApplicable(sku, q)); }
  function getStepState(sku, stepId) {
    const qs = questionsForStep(sku, stepId);
    if (!qs.length) return 'skipped';
    const done = qs.filter(q => isAnswered(sku, q)).length;
    return done === qs.length ? 'done' : done ? 'partial' : 'empty';
  }
  function getChecklistStats(targetState = state) {
    let total = 0; let done = 0;
    targetState.skus.forEach(sku => QUESTIONS.forEach(q => {
      if (!isApplicable(sku, q)) return;
      total += 1;
      if (isAnswered(sku, q)) done += 1;
    }));
    return { total, done, percent: total ? Math.round(done / total * 100) : 0 };
  }
  function getShipmentRequiredFields(targetState = state) {
    const shipment = targetState.shipment || {};
    return [
      { key: 'id', label: 'Номер заявки / поставки', value: shipment.id, selector: '[data-field="shipment.id"]' },
      { key: 'rc', label: 'РЦ', value: shipment.rc, selector: '[data-field="shipment.rc"]' },
      { key: 'date', label: 'Дата приёмки', value: shipment.date, selector: '[data-field="shipment.date"]' },
      { key: 'supplier', label: 'Поставщик', value: shipment.supplier, selector: '[data-field="shipment.supplier"]' },
      { key: 'format', label: 'Формат приёмки', value: shipment.format, selector: '[data-field="shipment.format"]' },
      { key: 'mokk', label: 'МОКК', value: shipment.mokk, selector: '[data-field="shipment.mokk"]' },
      { key: 'dpId', label: 'ДП (ID)', value: shipment.dpId, selector: '[data-field="shipment.dpId"]' },
      { key: 'connectionTime', label: 'Время подключения', value: shipment.connectionTime, selector: '[data-time-text][data-time-shipment-key="connectionTime"]' },
      { key: 'acceptanceStart', label: 'Начало приёмки', value: shipment.acceptanceStart, selector: '[data-time-text][data-time-shipment-key="acceptanceStart"]' },
    ];
  }

  function getMissingShipmentFields(targetState = state) {
    return getShipmentRequiredFields(targetState).filter(field => !String(field.value || '').trim());
  }

  function getSectionProgress(targetState = state) {
    const shipment = targetState.shipment || {};
    const shipmentFields = getShipmentRequiredFields(targetState);
    const shipmentDone = shipmentFields.length - getMissingShipmentFields(targetState).length;

    const productTotal = Math.max(2, targetState.skus.length * 2);
    const productDone = targetState.skus.reduce((sum, sku) => sum + Number(Boolean(String(sku.code || '').trim())) + Number(Boolean(String(sku.name || '').trim())), 0);

    const checklistStats = getChecklistStats(targetState);
    const checklistTotal = Math.max(1, checklistStats.total);
    const checklistDone = checklistStats.total ? checklistStats.done : 1;

    let defectsTotal = 0;
    let defectsDone = 0;
    targetState.skus.forEach(sku => {
      const rows = Array.isArray(sku.defects) ? sku.defects : [];
      const applicableQuestions = QUESTIONS.filter(question => isApplicable(sku, question));
      const skuChecklistComplete = applicableQuestions.length > 0 && applicableQuestions.every(question => isAnswered(sku, question));
      if (!rows.length) {
        defectsTotal += 1;
        if (skuChecklistComplete) defectsDone += 1;
        return;
      }
      rows.forEach(row => {
        defectsTotal += 1;
        const countReady = row.count !== '' && row.count !== null && row.count !== undefined && numeric(row.count) >= 0;
        if (skuChecklistComplete && String(row.type || '').trim() && row.visual && row.severity && countReady) defectsDone += 1;
      });
    });
    defectsTotal = Math.max(1, defectsTotal);

    const brixSkus = targetState.skus.filter(sku => sku.requiresBrix);
    const summaryTotal = 2 + Math.max(1, targetState.skus.length) + brixSkus.length;
    const summaryDone = Number(Boolean(shipment.acceptanceEnd)) + Number(Boolean(shipment.reportEnd))
      + targetState.skus.filter(sku => numeric(sku.sampleMass) > 0).length
      + brixSkus.filter(sku => isValidBrixValues(sku.brixValues)).length;

    const make = (done, total) => ({
      done,
      total,
      percent: total ? Math.round(done / total * 100) : 100,
      complete: total ? done >= total : true,
    });

    return {
      shipment: make(shipmentDone, shipmentFields.length),
      products: make(productDone, productTotal),
      checklist: make(checklistDone, checklistTotal),
      defects: make(defectsDone, defectsTotal),
      summary: make(summaryDone, summaryTotal),
    };
  }
  function getCompletion(targetState = state) {
    const sections = getSectionProgress(targetState);
    const values = Object.values(sections);
    const total = values.reduce((sum, item) => sum + item.total, 0);
    const done = values.reduce((sum, item) => sum + item.done, 0);
    const sectionsDone = values.filter(item => item.complete).length;
    return {
      total,
      done,
      percent: total ? Math.round(done / total * 100) : 0,
      sectionsDone,
      sectionTotal: values.length,
      sections,
    };
  }
  function getValidation() {
    const errors = []; const warnings = [];
    const s = state.shipment;
    const shipmentErrors = getMissingShipmentFields();
    shipmentErrors.forEach(field => errors.push(`Приёмка: заполните поле «${field.label}».`));
    state.skus.forEach((sku, index) => {
      const label = `Товар ${index + 1}`;
      if (!sku.code.trim()) errors.push(`${label}: не указан код товара.`);
      if (!sku.name.trim()) errors.push(`${label}: не указано название.`);
      if (numeric(sku.sampleMass) <= 0) errors.push(`${getSkuLabel(sku, index)}: масса выборки должна быть больше нуля.`);
      const categoryMass = numeric(sku.defectMass) + numeric(sku.nonstandardMass) + numeric(sku.debrisMass) + numeric(sku.caliberMass);
      if (numeric(sku.sampleMass) > 0 && categoryMass > numeric(sku.sampleMass) + 0.0001) errors.push(`${getSkuLabel(sku, index)}: сумма масс категорий превышает массу выборки.`);
      if (sku.requiresBrix && !String(sku.brixValues || '').trim()) errors.push(`${getSkuLabel(sku, index)}: включён замер Brix, но значения не указаны.`);
      else if (sku.requiresBrix && !isValidBrixValues(sku.brixValues)) errors.push(`${getSkuLabel(sku, index)}: значения Brix должны быть записаны через \\, например 9.9\\8.9\\10.6.`);
      const incomplete = QUESTIONS.filter(q => isApplicable(sku, q) && !isAnswered(sku, q));
      if (incomplete.length) warnings.push(`${getSkuLabel(sku, index)}: не заполнено пунктов чек-листа — ${incomplete.length}.`);
    });
    if (!s.acceptanceEnd) warnings.push('Не зафиксировано окончание приёмки.');
    if (!s.reportEnd) warnings.push('Не зафиксировано окончание заполнения отчёта.');
    // Переход через полночь допустим: последовательность этапов нормализуется
    // при расчёте продолжительности и при формировании Excel.
    return { errors, warnings, shipmentErrors };
  }

  function setNavCheck(name, progress) {
    const stateEl = document.getElementById(`navCheck${name}`);
    const metricEl = document.getElementById(`navMetric${name}`);
    const fillEl = document.getElementById(`navProgress${name}`);
    const mobileEl = document.getElementById(`mobileProgress${name}`);
    if (stateEl) {
      stateEl.textContent = progress.complete ? '✓' : `${progress.percent}%`;
      stateEl.classList.toggle('complete', progress.complete);
    }
    if (metricEl) metricEl.textContent = `${progress.done}/${progress.total}`;
    if (fillEl) fillEl.style.width = `${progress.percent}%`;
    if (mobileEl) {
      mobileEl.style.setProperty('--section-progress', `${progress.percent}%`);
      mobileEl.classList.toggle('complete', progress.complete);
      mobileEl.classList.toggle('partial', !progress.complete && progress.percent > 0);
    }
  }
  function updateGlobalProgress() {
    const c = getCompletion();
    const names = { shipment: 'Приёмка', products: 'Товары', checklist: 'Чек-лист', defects: 'Дефекты', summary: 'Итоги' };
    const nextEntry = Object.entries(c.sections).find(([, value]) => !value.complete);
    const nextLabel = nextEntry ? names[nextEntry[0]] : 'Все разделы завершены';
    const rcIndex = Math.max(0, workspace.checklists.findIndex(item => item.id === state.id));
    const rcName = checklistTabTitle(state, rcIndex);
    const rcMeta = checklistTabSubtitle(state);

    const progressText = document.getElementById('sidebarProgressText');
    const progressFill = document.getElementById('sidebarProgressFill');
    const progressHint = document.getElementById('sidebarProgressHint');
    const progressRing = document.getElementById('sidebarProgressRing');
    if (progressText) progressText.textContent = `${c.percent}%`;
    if (progressFill) progressFill.style.width = `${c.percent}%`;
    if (progressRing) progressRing.style.setProperty('--progress', String(c.percent));
    if (progressHint) progressHint.textContent = c.percent === 100 ? 'РЦ готов к выгрузке Excel' : `${c.sectionsDone} из ${c.sectionTotal} разделов · далее: ${nextLabel}`;

    const sidebarRcName = document.getElementById('sidebarRcName');
    const sidebarRcMeta = document.getElementById('sidebarRcMeta');
    const topbarRcName = document.getElementById('topbarRcName');
    const topbarRcProgress = document.getElementById('topbarRcProgress');
    const topbarProgressFill = document.getElementById('topbarProgressFill');
    if (sidebarRcName) sidebarRcName.textContent = rcName;
    if (sidebarRcMeta) sidebarRcMeta.textContent = rcMeta;
    if (topbarRcName) topbarRcName.textContent = rcName;
    if (topbarRcProgress) topbarRcProgress.textContent = `${c.percent}%`;
    if (topbarProgressFill) topbarProgressFill.style.width = `${c.percent}%`;

    setNavCheck('Shipment', c.sections.shipment);
    setNavCheck('Products', c.sections.products);
    setNavCheck('Checklist', c.sections.checklist);
    setNavCheck('Defects', c.sections.defects);
    setNavCheck('Summary', c.sections.summary);
  }

  function checklistTabTitle(item, index) {
    const rc = String(item.shipment?.rc || '').trim();
    return rc || `РЦ ${index + 1}`;
  }
  function checklistTabSubtitle(item) {
    return String(item.shipment?.id || '').trim() || 'Новый чек-лист';
  }
  function workspaceStateLabel(progress) {
    if (progress.percent === 100) return 'Готов к выгрузке';
    if (progress.percent === 0) return 'Не начат';
    return 'В работе';
  }
  function closeWorkspacePanel() {
    const panel = document.getElementById('workspaceBar');
    const toggle = document.getElementById('workspaceToggle');
    panel?.classList.remove('open');
    toggle?.setAttribute('aria-expanded', 'false');
    queueStickyLayoutUpdate();
  }
  function renderWorkspaceBar() {
    const bar = document.getElementById('workspaceBar');
    if (!bar) return;
    const previousScroll = bar.querySelector('.workspace-compact-list')?.scrollTop || 0;
    bar.innerHTML = `<div class="workspace-panel">
      <div class="workspace-panel-head">
        <div><span class="workspace-kicker">Рабочие пространства</span><strong>${workspace.checklists.length} из ${MAX_CHECKLISTS} РЦ</strong><small>Переключение не смешивает данные и Excel-файлы</small></div>
        <button type="button" class="button button-primary button-small" data-action="add-checklist" ${workspace.checklists.length >= MAX_CHECKLISTS ? 'disabled' : ''}>＋ Добавить РЦ</button>
      </div>
      <div class="workspace-compact-list">${workspace.checklists.map((item, index) => {
        const progress = getCompletion(item);
        const active = item.id === state.id;
        return `<article class="workspace-compact-item ${active ? 'active' : ''}">
          <button type="button" class="workspace-compact-main" data-action="select-checklist" data-checklist-id="${escapeAttr(item.id)}">
            <span class="workspace-compact-index">${index + 1}</span>
            <span class="workspace-compact-copy"><strong>${escapeHtml(checklistTabTitle(item, index))}</strong><small>${escapeHtml(checklistTabSubtitle(item))}</small><em>${workspaceStateLabel(progress)} · ${progress.sectionsDone}/${progress.sectionTotal} разделов</em></span>
            <span class="workspace-compact-progress" style="--progress:${progress.percent}"><b>${progress.percent}%</b></span>
          </button>
          <button type="button" class="workspace-compact-close" data-action="remove-checklist" data-checklist-id="${escapeAttr(item.id)}" ${workspace.checklists.length <= 1 ? 'disabled' : ''} aria-label="Закрыть чек-лист ${index + 1}">×</button>
        </article>`;
      }).join('')}</div>
    </div>`;
    requestAnimationFrame(() => { const list = bar.querySelector('.workspace-compact-list'); if (list) list.scrollTop = previousScroll; });
  }
  function updateWorkspaceTabStatus() {
    renderWorkspaceBar();
  }
  function switchChecklist(id) {
    closeWorkspacePanel();
    if (!id || id === state.id) return;
    const next = workspace.checklists.find(item => item.id === id);
    if (!next) return;
    saveNow();
    state = next;
    workspace.activeChecklistId = next.id;
    persistWorkspace();
    render();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  function addChecklist() {
    closeWorkspacePanel();
    if (workspace.checklists.length >= MAX_CHECKLISTS) { toast('Одновременно можно вести не более 5 чек-листов.', 'error'); return; }
    const next = defaultState();
    next.ui.notesPinned = state.ui.notesPinned;
    next.ui.notesPosition = state.ui.notesPosition;
    workspace.checklists.push(next);
    state = next;
    workspace.activeChecklistId = next.id;
    persistWorkspace();
    render();
    toast(`Открыта страница ${workspace.checklists.length} из ${MAX_CHECKLISTS}.`, 'success');
  }
  function removeChecklist(id) {
    closeWorkspacePanel();
    if (workspace.checklists.length <= 1) return;
    const index = workspace.checklists.findIndex(item => item.id === id);
    if (index < 0) return;
    const item = workspace.checklists[index];
    if (!confirm(`Закрыть чек-лист «${checklistTabTitle(item, index)}»? Данные этой страницы будут удалены.`)) return;
    workspace.checklists.splice(index, 1);
    if (state.id === id) state = workspace.checklists[Math.min(index, workspace.checklists.length - 1)];
    workspace.activeChecklistId = state.id;
    persistWorkspace();
    render();
    toast('Страница чек-листа закрыта.', 'success');
  }

  function setPage(page) {
    if (!PAGE_META[page]) return;
    const previousPage = state.ui.page;
    const pageChanged = previousPage !== page;
    const direction = PAGE_ORDER.indexOf(page) >= PAGE_ORDER.indexOf(previousPage) ? 'forward' : 'back';
    document.getElementById('sidebar')?.classList.remove('open');
    document.getElementById('sidebarBackdrop')?.classList.remove('open');
    document.getElementById('menuToggle')?.setAttribute('aria-expanded', 'false');
    closeWorkspacePanel();
    const updatePage = () => {
      state.ui.page = page;
      scheduleSave();
      render();
    };
    if (pageChanged) runAdaptiveTransition(updatePage, { direction, mode: 'page' });
    else updatePage();
    window.scrollTo({
      top: 0,
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
    });
  }

  function render() {
    const [stage, title] = PAGE_META[state.ui.page];
    const activeIndex = Math.max(0, workspace.checklists.findIndex(item => item.id === state.id));
    const workspaceScope = workspace.checklists.length === 1
      ? checklistTabTitle(state, activeIndex)
      : `${checklistTabTitle(state, activeIndex)} · ${activeIndex + 1} из ${workspace.checklists.length}`;
    document.getElementById('pageEyebrow').textContent = `${workspaceScope} · ${stage}`;
    document.getElementById('pageTitle').textContent = title;
    document.querySelectorAll('[data-page]').forEach(el => {
      const isActive = el.dataset.page === state.ui.page;
      el.classList.toggle('active', isActive);
      if (isActive) el.setAttribute('aria-current', 'step');
      else el.removeAttribute('aria-current');
    });
    window.ThemeStudio?.applyCurrent?.();
    renderWorkspaceBar();
    const renderer = { shipment: renderShipment, products: renderProducts, checklist: renderChecklist, defects: renderDefects, summary: renderSummary }[state.ui.page];
    const nextMarkup = renderer();
    if (pageContent.innerHTML !== nextMarkup) pageContent.innerHTML = nextMarkup;
    updateGlobalProgress();
    updateNotesPanel();
    queueStickyLayoutUpdate();
  }

  function pageHeading(title, description, actions = '') {
    return `<div class="page-heading"><div><h2>${escapeHtml(title)}</h2><p>${escapeHtml(description)}</p></div><div class="page-heading-actions">${actions}</div></div>`;
  }
  function field(label, path, value, type = 'text', options = {}) {
    const required = options.required ? '<span class="required">*</span>' : '';
    const suffix = options.suffix ? `<span class="input-suffix">${escapeHtml(options.suffix)}</span>` : '';
    return `<div class="field"><label>${escapeHtml(label)} ${required}</label><div class="${suffix ? 'input-group' : ''}"><input class="input" type="${type}" data-field="${escapeAttr(path)}" value="${escapeAttr(value ?? '')}" ${options.placeholder ? `placeholder="${escapeAttr(options.placeholder)}"` : ''} ${options.min !== undefined ? `min="${options.min}"` : ''} ${options.step ? `step="${options.step}"` : ''} />${suffix}</div>${options.hint ? `<span class="field-hint">${escapeHtml(options.hint)}</span>` : ''}</div>`;
  }
  function selectField(label, path, value, options, required = false) {
    return `<div class="field"><label>${escapeHtml(label)} ${required ? '<span class="required">*</span>' : ''}</label><select class="select" data-field="${escapeAttr(path)}">${options.map(o => `<option value="${escapeAttr(o.value)}" ${o.value === value ? 'selected' : ''}>${escapeHtml(o.label)}</option>`).join('')}</select></div>`;
  }

  function rcSelectField(value) {
    const options = RC_OPTIONS.map(item => `<option value="${escapeAttr(item.name)}"></option>`).join('');
    const meta = getRcConfig(value);
    const hint = meta
      ? `${formatMskOffset(meta.mskOffset)} · автоматическое время по зоне ${meta.timeZone}`
      : (String(value || '').trim() ? 'РЦ введён вручную. Выберите подходящий вариант из подсказок, чтобы применить его часовой пояс.' : 'Начните вводить название или выберите РЦ из списка.');
    return `<div class="field rc-select-field"><label>РЦ <span class="required">*</span></label><input class="input rc-combobox" type="text" list="rcOptionsList" autocomplete="off" data-field="shipment.rc" data-rc-combobox value="${escapeAttr(value || '')}" placeholder="Введите или выберите РЦ"><datalist id="rcOptionsList">${options}</datalist><span class="field-hint" id="rcTimezoneHint">${escapeHtml(hint)}</span></div>`;
  }
  function timeControl(value, target = {}, options = {}) {
    const time = timeOnly(value);
    const targetAttrs = target.shipmentKey
      ? `data-time-shipment-key="${escapeAttr(target.shipmentKey)}"`
      : `data-time-sku="${Number(target.skuIndex)}" data-time-code="${escapeAttr(target.code)}"`;
    const disabled = options.disabled ? 'disabled' : '';
    const compact = options.compact ? ' compact' : '';
    const meta = currentRcTimeMeta();
    return `<div class="time-control${compact} ${options.disabled ? 'is-disabled' : ''}">
      <input class="time-text" type="text" inputmode="numeric" autocomplete="off" maxlength="5" placeholder="чч:мм" aria-label="${escapeAttr(options.label || 'Время')}" value="${escapeAttr(time)}" data-time-text ${targetAttrs} ${disabled}/>
      <input class="time-native" type="time" value="${escapeAttr(time)}" data-time-picker ${targetAttrs} ${disabled} aria-label="Выбрать время мышью"/>
      <button class="time-now-button" type="button" data-action="${escapeAttr(options.nowAction || 'set-current-rc-time')}" ${targetAttrs} aria-label="${escapeAttr(options.nowLabel || 'Поставить текущее время выбранного РЦ')}" title="${escapeAttr(options.nowTitle || `Сейчас в ${meta.name} · ${formatMskOffset(meta.mskOffset)}`)}" ${disabled}>◷</button>
      <button class="time-picker-button" type="button" data-action="open-time-picker" aria-label="Открыть ручной выбор времени" title="Выбрать время мышью" ${disabled}>⌄</button>
    </div>`;
  }

  function timerCard(label, key, hint, options = {}) {
    const value = state.shipment[key];
    const meta = currentRcTimeMeta();
    const required = options.required ? ' <span class="required">*</span>' : '';
    return `<div class="timer-card"><div class="timer-card-head"><span>${escapeHtml(label)}${required}</span><strong class="timer-value" data-time-display="${key}">${escapeHtml(value ? timeOnly(value) : '—:—')}</strong></div><div class="timer-actions">${timeControl(value, { shipmentKey: key }, { label, nowAction: 'set-current-operator-time', nowLabel: 'Поставить текущее время оператора', nowTitle: 'Текущее время на вашем устройстве' })}<button class="button button-ghost button-small" data-action="set-time" data-time-key="${key}" title="Поставить текущее время выбранного РЦ">Время на РЦ</button></div><small class="field-hint">${escapeHtml(hint)} ◷ — ваше локальное время; «Время на РЦ» — ${escapeHtml(meta.name)} (${escapeHtml(formatMskOffset(meta.mskOffset))}).</small></div>`;
  }

  function productAssistantMarkup(sku) {
    const issues = [];
    if (!String(sku.code || '').trim()) issues.push('Укажите код SKU точно как в заявке.');
    if (!String(sku.name || '').trim()) issues.push('Заполните полное наименование без сокращений.');
    if (sku.apmError === 'yes' && !String(sku.comment || '').trim()) issues.push('Для ошибки АРМ добавьте пояснение в комментарий к товару.');
    if (!sku.requiresColor && !sku.requiresDensity && !sku.requiresBrix) issues.push('Проверьте, нужны ли дополнительные контроли: цветность, плотность или Brix.');
    const ready = !issues.length;
    const items = ready
      ? ['Основные данные позиции заполнены. ВПТ, массы и категории внесите на финальном этапе «Итоги».']
      : [...issues.slice(0, 3), 'ВПТ, массы и категории заполняются в конце, на странице итогов.'];
    return `<div class="acceptance-helper ${ready ? 'is-ready' : ''}" data-product-helper>
      <div class="acceptance-helper-title"><span>${ready ? '✓' : 'i'}</span><strong>${ready ? 'Позиция готова' : 'Подсказки по позиции'}</strong></div>
      <ul>${items.map(item => `<li>${escapeHtml(item)}</li>`).join('')}</ul>
    </div>`;
  }

  function renderShipment() {
    const s = state.shipment;
    return `${pageHeading('Данные поставки', 'Заполните реквизиты поставки. Время хранится с точностью до минуты и синхронизируется с датой приёмки.', '<button class="button button-primary" data-page="products">К товарам →</button>')}
      <div class="content-stack">
        <div class="notice notice-strong"><strong>Быстрый порядок:</strong> реквизиты → товары → чек-лист → дефекты → Excel. Поля сохраняются автоматически.</div>
        <section class="card card-pad">
          <div class="section-head"><div><h3 class="card-title">Основные сведения</h3><p class="card-subtitle">Данные попадут в итоговый файл Excel.</p></div></div>
          <div class="grid grid-3">
            ${field('Номер заявки / поставки', 'shipment.id', s.id, 'text', { required: true, placeholder: 'Например: 828389Y8827878' })}
            ${rcSelectField(s.rc)}
            ${field('Дата приёмки', 'shipment.date', s.date, 'date', { required: true })}
            ${field('Поставщик', 'shipment.supplier', s.supplier, 'text', { required: true, placeholder: 'Полное наименование' })}
            ${selectField('Формат приёмки', 'shipment.format', s.format, [{ value: 'Онлайн', label: 'Онлайн' }, { value: 'Архив', label: 'Архив' }], true)}
            ${field('МОКК', 'shipment.mokk', s.mokk, 'text', { required: true, placeholder: 'ФИО или идентификатор' })}
            ${field('ДП (ID)', 'shipment.dpId', s.dpId, 'text', { required: true, placeholder: 'ФИО / ID сотрудника' })}
          </div>
        </section>
        <section class="card card-pad">
          <div class="section-head"><div><h3 class="card-title">Начало работы</h3><p class="card-subtitle">Окончание приёмки и отчёта фиксируется на странице итогов.</p></div></div>
          <div class="timer-grid shipment-timer-grid">
            ${timerCard('Время подключения', 'connectionTime', 'Переносится в верхнюю часть Excel.', { required: true })}
            ${timerCard('Начало приёмки', 'acceptanceStart', 'Можно зафиксировать отдельно от подключения.', { required: true })}
          </div>
        </section>
      </div>`;
  }

  function skuField(label, index, key, value, type = 'text', options = {}) {
    const suffix = options.suffix ? `<span class="input-suffix">${escapeHtml(options.suffix)}</span>` : '';
    return `<div class="field"><label>${escapeHtml(label)} ${options.required ? '<span class="required">*</span>' : ''}</label><div class="${suffix ? 'input-group' : ''}"><input class="input" type="${type}" data-sku="${index}" data-sku-field="${key}" value="${escapeAttr(value ?? '')}" ${options.placeholder ? `placeholder="${escapeAttr(options.placeholder)}"` : ''} ${options.min !== undefined ? `min="${options.min}"` : ''} ${options.step ? `step="${options.step}"` : ''}/>${suffix}</div>${options.hint ? `<span class="field-hint">${escapeHtml(options.hint)}</span>` : ''}</div>`;
  }
  function featureSwitch(index, key, active) {
    const [label, hint] = FEATURE_LABELS[key];
    return `<button type="button" class="control-switch ${active ? 'active' : ''}" data-action="toggle-feature" data-sku="${index}" data-feature="${key}" aria-pressed="${active}"><span class="control-copy"><strong>${escapeHtml(label)}</strong><small>${escapeHtml(hint)}</small></span><span class="switch" aria-hidden="true"></span></button>`;
  }
  function measureCard(label, index, key, value, options = {}) {
    const suffix = options.suffix || 'кг';
    const step = options.step || '0.001';
    const placeholder = options.placeholder || '';
    return `<div class="measure-card"><label>${escapeHtml(label)}</label><div class="input-group"><input class="input" inputmode="decimal" type="number" min="0" step="${escapeAttr(step)}" data-sku="${index}" data-sku-field="${key}" value="${escapeAttr(value ?? '')}" ${placeholder ? `placeholder="${escapeAttr(placeholder)}"` : ''}/><span class="input-suffix">${escapeHtml(suffix)}</span></div></div>`;
  }

  function renderProductCard(sku, index) {
    const status = getSkuStatus(sku, index);
    return `<article class="card product-card sku-status-${status.key}" data-product-card="${index}">
      <div class="product-card-head">
        <div class="product-title"><span class="product-number">${index + 1}</span><div><strong>${escapeHtml(getSkuLabel(sku, index))}</strong><span>${escapeHtml(sku.code ? `Код ${sku.code}` : 'Код не указан')}</span></div></div>
        <div class="product-head-actions">${skuStatusBadge(sku, index)}<div class="button-row">
          <button class="button button-ghost button-small" data-action="move-sku" data-sku="${index}" data-delta="-1" ${index === 0 ? 'disabled' : ''}>↑</button>
          <button class="button button-ghost button-small" data-action="move-sku" data-sku="${index}" data-delta="1" ${index === state.skus.length - 1 ? 'disabled' : ''}>↓</button>
          <button class="button button-danger button-small" data-action="remove-sku" data-sku="${index}" ${state.skus.length === 1 ? 'disabled' : ''}>Удалить</button>
        </div></div>
      </div>
      <div class="product-card-body">
        <div class="subsection">
          <div class="subsection-title">Товарная позиция</div>
          <div class="grid grid-3">
            ${skuField('Код товара / SKU', index, 'code', sku.code, 'text', { required: true, placeholder: 'Введите код вручную' })}
            ${skuField('Название товара', index, 'name', sku.name, 'text', { required: true, placeholder: 'Полное название позиции' })}
            <div class="field"><label>Ошибки в АРМ ДП</label><select class="select" data-sku="${index}" data-sku-field="apmError"><option value="no" ${sku.apmError !== 'yes' ? 'selected' : ''}>Нет</option><option value="yes" ${sku.apmError === 'yes' ? 'selected' : ''}>Да</option></select></div>
          </div>
        </div>
        ${productAssistantMarkup(sku)}
        <div class="subsection">
          <div class="subsection-title">Контроли чек-листа</div>
          <div class="control-switches">${featureSwitch(index, 'requiresColor', sku.requiresColor)}${featureSwitch(index, 'requiresDensity', sku.requiresDensity)}${featureSwitch(index, 'requiresBrix', sku.requiresBrix)}</div>
          <div class="notice">Включённый контроль добавляет соответствующие пункты в чек-лист. Значения Brix вводятся на странице «Итоги»; для плотности фиксируются выполнение, время и комментарий.</div>
        </div>
        <div class="subsection">
          <div class="subsection-title">Комментарий к товару</div>
          <textarea class="textarea" data-sku="${index}" data-sku-field="comment" placeholder="Комментарий, который должен попасть в верхнюю таблицу Excel…">${escapeHtml(sku.comment || '')}</textarea>
        </div>
      </div>
    </article>`;
  }

  function renderProductStatusBoard() {
    const statuses = state.skus.map((sku, index) => ({ sku, index, status: getSkuStatus(sku, index) }));
    const ready = statuses.filter(item => ['ready', 'ready-warning'].includes(item.status.key)).length;
    const attention = statuses.filter(item => ['attention', 'ready-warning'].includes(item.status.key)).length;
    const active = statuses.filter(item => item.status.key === 'in-progress').length;
    return `<section class="product-status-board">
      <div class="product-status-board-head"><div><span class="eyebrow">Статусы позиций</span><h3>Картина приёмки по товарам</h3><p>Статус рассчитывается по реквизитам, чек-листу, дефектам, ВПТ и итоговым массам.</p></div><div class="product-status-counters"><span><b>${ready}</b> готово</span><span><b>${active}</b> в работе</span><span class="has-attention"><b>${attention}</b> с замечаниями</span></div></div>
      <div class="product-status-list">${statuses.map(({ sku, index, status }) => `<button type="button" class="product-status-item status-${status.key}" data-action="focus-product" data-sku="${index}"><span class="product-status-index">${index + 1}</span><span class="product-status-copy"><strong>${escapeHtml(getSkuLabel(sku, index))}</strong><small>${escapeHtml(status.detail)}</small></span><span class="product-status-value"><b>${escapeHtml(status.label)}</b><small>${status.progress}%</small></span><i><em style="width:${status.progress}%"></em></i></button>`).join('')}</div>
    </section>`;
  }

  function renderProducts() {
    return `${pageHeading('Товары и основные параметры', 'Добавьте до пяти товарных позиций. Статус каждой позиции обновляется автоматически по мере прохождения всей приёмки.', `<button class="button button-primary" data-action="add-sku" ${state.skus.length >= MAX_SKU ? 'disabled' : ''}>+ Добавить товар</button>`)}
      <div class="content-stack">
        ${renderProductStatusBoard()}
        <div class="product-toolbar"><div class="notice">Статус «Готова» появится после заполнения реквизитов, чек-листа, ВПТ и итоговых масс.</div><span class="field-hint">${state.skus.length} из ${MAX_SKU} товаров</span></div>
        <div class="product-list">${state.skus.map(renderProductCard).join('')}</div>
        <div class="button-row"><button class="button button-ghost" data-page="shipment">← К приёмке</button><button class="button button-primary" data-page="checklist">К чек-листу →</button></div>
      </div>`;
  }

  function renderSkuTabs() {
    return `<div class="sku-tabs">${state.skus.map((sku, index) => {
      const applicable = QUESTIONS.filter(question => isApplicable(sku, question));
      const done = applicable.filter(question => isAnswered(sku, question)).length;
      const status = getSkuStatus(sku, index);
      return `<button class="sku-tab sku-status-${status.key} ${state.ui.currentSku === index ? 'active' : ''}" data-action="select-sku" data-sku="${index}"><span class="sku-tab-index">${index + 1}</span><span class="sku-tab-copy"><b>${escapeHtml(getSkuLabel(sku, index))}</b><small>${done}/${applicable.length} пунктов · ${escapeHtml(status.label)}</small></span><span class="sku-tab-percent">${status.progress}%</span><i><em style="width:${status.progress}%"></em></i></button>`;
    }).join('')}</div>`;
  }

  function renderQuestion(sku, skuIndex, question) {
    const answer = getAnswer(sku, question.code);
    const showTimeControl = questionShowsTimeControl(question);
    if (question.type === 'number') {
      const timeDisabled = question.code === '7.4' && numeric(answer.value) <= 0;
      const detailsClass = `number-answer${showTimeControl ? '' : ' no-time'}`;
      return `<article class="question-card ${answer.value !== '' ? 'is-complete' : ''}">
        <div class="question-top"><span class="question-code">${question.code}</span><div class="question-text">${escapeHtml(question.text)}</div></div>
        <div class="${detailsClass}">
          <div class="input-group"><input class="input" type="number" min="${question.min ?? 0}" step="1" data-answer-value data-sku="${skuIndex}" data-code="${question.code}" value="${escapeAttr(answer.value ?? '')}" placeholder="Введите значение"/><span class="input-suffix">${escapeHtml(question.unit || '')}</span></div>
          ${showTimeControl ? timeControl(answer.time, { skuIndex, code: question.code }, { label: `Время пункта ${question.code}`, disabled: timeDisabled, compact: true }) : ''}
          <input class="input" type="text" data-answer-comment data-sku="${skuIndex}" data-code="${question.code}" value="${escapeAttr(answer.comment || '')}" placeholder="Комментарий"/>
        </div>
        ${question.code === '7.4' ? '<span class="field-hint">При значении 0 время очищается. При значении 1 и выше ставится автоматически.</span>' : ''}
        <details class="question-tip"><summary>Подсказка по приёмке</summary><p>${escapeHtml(QUESTION_HINTS[question.code] || 'Проверьте, чтобы действие и результат были однозначно видны по камере.')}</p></details>
      </article>`;
    }
    const detailsClass = `answer-details${showTimeControl ? '' : ' no-time'}`;
    return `<article class="question-card ${answer.status ? `is-${answer.status}` : ''}">
      <div class="question-top"><span class="question-code">${question.code}</span><div class="question-text">${escapeHtml(question.text)}</div></div>
      <div class="answer-grid">
        <button class="answer-button yes ${answer.status === 'yes' ? 'active' : ''}" data-action="answer-status" data-status="yes" data-sku="${skuIndex}" data-code="${question.code}">✓ Выполнено</button>
        <button class="answer-button no ${answer.status === 'no' ? 'active' : ''}" data-action="answer-status" data-status="no" data-sku="${skuIndex}" data-code="${question.code}">× Не выполнено</button>
        <button class="answer-button na ${answer.status === 'na' ? 'active' : ''}" data-action="answer-status" data-status="na" data-sku="${skuIndex}" data-code="${question.code}">— Не контролируется</button>
      </div>
      <div class="${detailsClass}">
        ${showTimeControl ? timeControl(answer.time, { skuIndex, code: question.code }, { label: `Время пункта ${question.code}`, disabled: answer.status === 'na', compact: true }) : ''}
        <input class="input" type="text" data-answer-comment data-sku="${skuIndex}" data-code="${question.code}" value="${escapeAttr(answer.comment || '')}" placeholder="Комментарий к пункту" ${answer.status === 'na' ? 'disabled' : ''}/>
      </div>
      <details class="question-tip"><summary>Подсказка по приёмке</summary><p>${escapeHtml(QUESTION_HINTS[question.code] || 'Проверьте, чтобы действие и результат были однозначно видны по камере.')}</p></details>
    </article>`;
  }

  function renderChecklist() {
    state.ui.currentSku = Math.min(state.ui.currentSku, state.skus.length - 1);
    const skuIndex = state.ui.currentSku;
    const sku = state.skus[skuIndex];
    const step = STEP_GROUPS[state.ui.checkStep] || STEP_GROUPS[0];
    const questions = questionsForStep(sku, step.id);
    const stats = getChecklistStats();
    const stepDone = questions.filter(question => isAnswered(sku, question)).length;
    const stepPercent = questions.length ? Math.round(stepDone / questions.length * 100) : 100;
    return `${pageHeading('Пошаговый чек-лист', 'Работайте по этапам: система сохраняет ответы, время и прогресс отдельно для каждого РЦ и каждой товарной позиции.', `${skuStatusBadge(sku, skuIndex, true)}<span class="button button-ghost checklist-progress-chip" data-checklist-progress>${stats.done} / ${stats.total} · ${stats.percent}%</span>`)}
      <div class="content-stack checklist-workspace">
        ${renderSkuTabs()}
        <div class="check-layout">
          <aside class="step-list"><div class="step-list-head"><span>Этапы контроля</span><strong>${stats.percent}%</strong></div>${STEP_GROUPS.map((item, index) => {
            const stepQuestions = questionsForStep(sku, item.id);
            const done = stepQuestions.filter(question => isAnswered(sku, question)).length;
            const percent = stepQuestions.length ? Math.round(done / stepQuestions.length * 100) : 100;
            const status = getStepState(sku, item.id);
            return `<button class="step-button ${index === state.ui.checkStep ? 'active' : ''} ${status}" data-action="select-step" data-step="${index}"><span class="step-number">${index + 1}</span><span class="step-copy"><span class="step-label">${escapeHtml(item.short)}</span><small>${done} из ${stepQuestions.length}</small></span><span class="step-status ${status === 'done' ? 'done' : ''}">${status === 'done' ? '✓' : `${percent}%`}</span><i><b style="width:${percent}%"></b></i></button>`;
          }).join('')}</aside>
          <div class="check-main">
            <div class="step-head"><div class="step-head-row"><div><span class="eyebrow">Шаг ${step.id + 1} из ${STEP_GROUPS.length}</span><h3>${escapeHtml(step.title)}</h3><p>${escapeHtml(step.description)}</p></div><div class="step-counter"><strong>${stepPercent}%</strong><small>${stepDone} из ${questions.length} · ${escapeHtml(getSkuLabel(sku, skuIndex))}</small></div></div><div class="step-progress-track"><i style="width:${stepPercent}%"></i></div><div class="step-quick-actions"><button class="button button-ghost button-small" data-action="complete-step">✓ Выполнить пункты шага</button><button class="button button-ghost button-small" data-action="go-unanswered">Найти незаполненное</button></div></div>
            <div class="question-list">${questions.length ? questions.map(q => renderQuestion(sku, skuIndex, q)).join('') : '<div class="card empty-state"><strong>Контроль выключен</strong>Для этой товарной позиции на шаге нет активных пунктов.</div>'}</div>
            <div class="step-nav"><button class="button button-ghost" data-action="previous-step" ${state.ui.checkStep === 0 ? 'disabled' : ''}>← Предыдущий шаг</button><button class="button button-primary" data-action="next-step">${state.ui.checkStep === STEP_GROUPS.length - 1 ? 'К реестру дефектов →' : 'Следующий шаг →'}</button></div>
          </div>
        </div>
      </div>`;
  }

  function severityLabel(value) { return ({ defect: 'Брак', nonstandard: 'Нестандарт', caliber: 'Некалибр' })[value] || 'Брак'; }
  function filteredDefects(sku) {
    const query = state.ui.defectSearch.trim().toLowerCase();
    return sku.defects.map((d, index) => ({ d, index })).filter(({ d }) => {
      const searchOk = !query || `${d.type} ${d.visual} ${d.comment}`.toLowerCase().includes(query);
      const severityOk = state.ui.defectSeverity === 'all' || d.severity === state.ui.defectSeverity;
      return searchOk && severityOk;
    });
  }

  function renderDefects() {
    state.ui.currentSku = Math.min(state.ui.currentSku, state.skus.length - 1);
    const skuIndex = state.ui.currentSku;
    const sku = state.skus[skuIndex];
    const rows = filteredDefects(sku);
    const total = sku.defects.reduce((sum, d) => sum + numeric(d.count), 0);
    const categoryTotals = sku.defects.reduce((acc, d) => {
      const category = ['defect', 'nonstandard', 'caliber'].includes(d.severity) ? d.severity : 'defect';
      acc[category] += numeric(d.count);
      return acc;
    }, { defect: 0, nonstandard: 0, caliber: 0 });
    return `${pageHeading('Реестр дефектов и некалибра', 'Укажите тип дефекта, текстовую визуальную оценку, количество единиц, категорию и комментарий. Процентная доля не используется.', `${skuStatusBadge(sku, skuIndex, true)}<button class="button button-primary" data-action="add-defect" ${sku.defects.length >= MAX_DEFECTS ? 'disabled' : ''}>+ Добавить запись</button>`)}
      <div class="content-stack">
        ${renderSkuTabs()}
        <div class="kpi-grid">
          <div class="kpi"><span>Записей</span><strong>${sku.defects.length}</strong><small>максимум ${MAX_DEFECTS}</small></div>
          <div class="kpi"><span>Единиц в реестре</span><strong>${displayNumber(total, 0)}</strong><small>Брак ${displayNumber(categoryTotals.defect, 0)} · Нестандарт ${displayNumber(categoryTotals.nonstandard, 0)} · Некалибр ${displayNumber(categoryTotals.caliber, 0)}</small></div>
          <div class="kpi"><span>Ошибки на качество</span><strong>${displayNumber(getAnswer(sku, '7.4').value, 0)}</strong><small>отдельный пункт чек-листа</small></div>
          <div class="kpi"><span>Товар</span><strong style="font-size:16px">${escapeHtml(getSkuLabel(sku, skuIndex))}</strong><small>${escapeHtml(sku.code || 'код не указан')}</small></div>
        </div>
        <section class="card table-shell">
          <div class="table-toolbar">
            <input class="input" type="search" data-ui-field="defectSearch" value="${escapeAttr(state.ui.defectSearch)}" placeholder="Поиск по дефекту, визуальной оценке или комментарию"/>
            <select class="select" data-ui-field="defectSeverity"><option value="all">Все категории</option><option value="defect" ${state.ui.defectSeverity === 'defect' ? 'selected' : ''}>Брак</option><option value="nonstandard" ${state.ui.defectSeverity === 'nonstandard' ? 'selected' : ''}>Нестандарт</option><option value="caliber" ${state.ui.defectSeverity === 'caliber' ? 'selected' : ''}>Некалибр</option></select>
            <button class="button button-ghost" data-action="clear-defect-filters">Сбросить</button>
          </div>
          <div class="table-scroll">
            ${rows.length ? `<table class="data-table"><thead><tr><th>Тип дефекта</th><th>Визуальная оценка</th><th>Кол-во единиц</th><th>Категория</th><th>Комментарий ДП</th><th></th></tr></thead><tbody>${rows.map(({ d, index }) => `<tr>
              <td data-label="Тип дефекта"><input class="input" data-defect-field="type" data-defect="${index}" data-sku="${skuIndex}" value="${escapeAttr(d.type || '')}" placeholder="Название дефекта"/></td>
              <td data-label="Визуальная оценка"><div class="defect-visual-control"><input class="input" type="text" maxlength="240" data-defect-field="visual" data-defect="${index}" data-sku="${skuIndex}" value="${escapeAttr(d.visual || '')}" placeholder="Напишите оценку или скопируйте тип дефекта"/><button class="defect-copy-button" type="button" data-action="copy-defect-type-to-visual" data-defect="${index}" data-sku="${skuIndex}" title="Скопировать из поля «Тип дефекта»" aria-label="Скопировать тип дефекта в визуальную оценку"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 8V5.75A2.75 2.75 0 0 1 10.75 3h7.5A2.75 2.75 0 0 1 21 5.75v7.5A2.75 2.75 0 0 1 18.25 16H16v2.25A2.75 2.75 0 0 1 13.25 21h-7.5A2.75 2.75 0 0 1 3 18.25v-7.5A2.75 2.75 0 0 1 5.75 8H8Zm2 0h3.25A2.75 2.75 0 0 1 16 10.75V14h2.25c.414 0 .75-.336.75-.75v-7.5a.75.75 0 0 0-.75-.75h-7.5a.75.75 0 0 0-.75.75V8Zm3.25 2h-7.5a.75.75 0 0 0-.75.75v7.5c0 .414.336.75.75.75h7.5a.75.75 0 0 0 .75-.75v-7.5a.75.75 0 0 0-.75-.75Z"/></svg></button></div></td>
              <td data-label="Количество"><input class="input" type="number" min="0" step="1" data-defect-field="count" data-defect="${index}" data-sku="${skuIndex}" value="${escapeAttr(d.count ?? '')}" placeholder="0"/></td>
              <td data-label="Категория"><select class="select" data-defect-field="severity" data-defect="${index}" data-sku="${skuIndex}"><option value="defect" ${d.severity === 'defect' ? 'selected' : ''}>Брак</option><option value="nonstandard" ${d.severity === 'nonstandard' ? 'selected' : ''}>Нестандарт</option><option value="caliber" ${d.severity === 'caliber' ? 'selected' : ''}>Некалибр</option></select></td>
              <td data-label="Комментарий"><input class="input" data-defect-field="comment" data-defect="${index}" data-sku="${skuIndex}" value="${escapeAttr(d.comment || '')}" placeholder="Комментарий"/></td>
              <td data-label="Действия"><div class="row-actions"><button class="button button-danger button-small" data-action="remove-defect" data-defect="${index}" data-sku="${skuIndex}">Удалить</button></div></td>
            </tr>`).join('')}</tbody></table>` : '<div class="empty-state"><strong>Нет записей по выбранным фильтрам</strong>Добавьте дефект или измените фильтры.</div>'}
          </div>
        </section>
        <div class="button-row"><button class="button button-ghost" data-page="checklist">← К чек-листу</button><button class="button button-primary" data-page="summary">К итогам →</button></div>
      </div>`;
  }

  function massAssistantMarkup(sku, index) {
    const sample = numeric(sku.sampleMass);
    const categories = numeric(sku.defectMass) + numeric(sku.nonstandardMass) + numeric(sku.debrisMass) + numeric(sku.caliberMass);
    const issues = [];
    if (!String(sku.vpt || '').trim()) issues.push('Заполните ВПТ перед выгрузкой Excel.');
    if (sample <= 0) issues.push('Укажите итоговую массу выборки — она обязательна для Excel.');
    if (sample > 0 && categories > sample + 0.0001) issues.push('Сумма категорий превышает массу выборки. Перепроверьте взвешивание.');
    if (sample > 0 && categories === 0) issues.push('Категории пока нулевые. Подтвердите, что брак, нестандарт, осыпь и некалибр отсутствуют.');
    if (sku.requiresBrix && !String(sku.brixValues || '').trim()) issues.push('Введите результаты замера Brix, например 9.9\\8.9\\10.6.');
    else if (sku.requiresBrix && !isValidBrixValues(sku.brixValues)) issues.push('Исправьте формат Brix: только числа, разделённые обратной косой чертой.');
    const ready = sample > 0 && categories <= sample + 0.0001 && (!sku.requiresBrix || isValidBrixValues(sku.brixValues));
    return `<div class="acceptance-helper ${ready ? 'is-ready' : ''}" data-mass-helper="${index}"><div class="acceptance-helper-title"><span>${ready ? '✓' : 'i'}</span><strong>${ready ? 'Итог по массам готов' : 'Проверка итоговых масс'}</strong></div><ul>${(issues.length ? issues : ['Значения согласованы. Остаток категории качества рассчитан автоматически.']).map(item => `<li>${escapeHtml(item)}</li>`).join('')}</ul></div>`;
  }

  function renderFinalMasses() {
    const index = Math.min(state.ui.currentSku || 0, state.skus.length - 1);
    const sku = state.skus[index];
    const total = numeric(sku.defectMass) + numeric(sku.nonstandardMass) + numeric(sku.debrisMass) + numeric(sku.caliberMass);
    const quality = Math.max(0, numeric(sku.sampleMass) - total);
    return `<section class="card card-pad final-mass-section">
      <div class="section-head"><div><span class="eyebrow">Финальный этап</span><h3 class="card-title">Итоговые массы и категории</h3><p class="card-subtitle">Заполните после завершения контроля. Показана одна товарная позиция — длинный список листать не нужно.</p></div><span class="viz-badge">${index + 1} / ${state.skus.length}</span></div>
      <div class="final-mass-tabs" role="tablist">${state.skus.map((item, i) => `<button type="button" class="sku-tab ${i === index ? 'active' : ''}" data-action="select-summary-sku" data-sku="${i}"><span>${i + 1}</span>${escapeHtml(getSkuLabel(item, i))}</button>`).join('')}</div>
      <div class="final-mass-card" data-final-mass-card="${index}">
        <div class="final-mass-product"><div><strong>${escapeHtml(getSkuLabel(sku, index))}</strong><small>${escapeHtml(sku.code ? `Код ${sku.code}` : 'Код не указан')}</small></div><div class="final-mass-total"><span>ВПТ</span><strong>${hasNumber(sku.vpt) ? `${displayNumber(sku.vpt, 1)} °C` : 'Не указана'}</strong></div></div>
        <div class="measure-grid final-measure-grid">
          ${measureCard('ВПТ', index, 'vpt', sku.vpt, { suffix: '°C', step: '0.1', placeholder: '0,0' })}
          ${measureCard('Масса выборки', index, 'sampleMass', sku.sampleMass)}
          ${measureCard('Брак', index, 'defectMass', sku.defectMass)}
          ${measureCard('Нестандарт', index, 'nonstandardMass', sku.nonstandardMass)}
          ${measureCard('Осыпь / листья / земля', index, 'debrisMass', sku.debrisMass)}
          ${measureCard('Некалибр', index, 'caliberMass', sku.caliberMass)}
        </div>
        ${sku.requiresBrix ? `<div class="brix-entry-row">
          <div class="brix-entry-copy"><span class="eyebrow">Активный замер</span><strong>Значения Brix</strong><small>Введите результаты подряд через обратную косую черту. Также можно использовать «/», пробел или «;» — разделитель преобразуется автоматически.</small></div>
          <div class="brix-entry-control"><input class="input brix-values-input" type="text" inputmode="text" autocomplete="off" spellcheck="false" data-sku="${index}" data-sku-field="brixValues" data-brix-values value="${escapeAttr(sku.brixValues || '')}" placeholder="9.9\\8.9\\10.6" aria-label="Значения Brix"/><span>Brix</span></div>
        </div>` : ''}
        <div class="kpi-grid final-mass-kpis">
          <div class="kpi"><span>Брак</span><strong data-percent-output="defectMass">${formatPercent(percent(sku.defectMass, sku.sampleMass))}</strong><small>от выборки</small></div>
          <div class="kpi"><span>Нестандарт</span><strong data-percent-output="nonstandardMass">${formatPercent(percent(sku.nonstandardMass, sku.sampleMass))}</strong><small>от выборки</small></div>
          <div class="kpi"><span>Осыпь</span><strong data-percent-output="debrisMass">${formatPercent(percent(sku.debrisMass, sku.sampleMass))}</strong><small>от выборки</small></div>
          <div class="kpi"><span>Некалибр</span><strong data-percent-output="caliberMass">${formatPercent(percent(sku.caliberMass, sku.sampleMass))}</strong><small>от выборки</small></div>
          <div class="kpi"><span>Категории всего</span><strong data-mass-total>${displayNumber(total, 3)} кг</strong><small>${formatPercent(percent(total, sku.sampleMass))}</small></div>
          <div class="kpi"><span>Категория качества</span><strong data-quality-mass>${displayNumber(quality, 3)} кг</strong><small>остаток выборки</small></div>
        </div>
        ${massAssistantMarkup(sku, index)}
      </div>
    </section>`;
  }

  function kpi(label, value, hint, cls = '') { return `<div class="kpi"><span>${escapeHtml(label)}</span><strong class="${cls}">${escapeHtml(value)}</strong><small>${escapeHtml(hint)}</small></div>`; }
  function renderSummary() {
    const c = getCompletion();
    const stats = getChecklistStats();
    const defectTotal = state.skus.reduce((sum, sku) => sum + sku.defects.reduce((s, d) => s + numeric(d.count), 0), 0);
    const s = state.shipment;
    return `${pageHeading('Итоги и выгрузка', 'Внесите ВПТ и итоговые массы, зафиксируйте окончание приёмки и сформируйте Excel для открытого РЦ.', '')}
      <div class="content-stack">
        ${renderFinalMasses()}
        <div class="kpi-grid">
          ${kpi('Готовность', `${c.percent}%`, `${c.sectionsDone} из ${c.sectionTotal} разделов`, c.percent === 100 ? 'status-good' : 'status-warn')}
          ${kpi('Товаров', String(state.skus.length), `максимум ${MAX_SKU}`)}
          ${kpi('Чек-лист', `${stats.done}/${stats.total}`, `${stats.percent}% заполнено`, stats.percent === 100 ? 'status-good' : 'status-warn')}
          ${kpi('Дефектных единиц', displayNumber(defectTotal, 0), `${state.skus.reduce((sum, sku) => sum + sku.defects.length, 0)} записей`)}
        </div>
        <section class="card card-pad">
          <div class="section-head"><div><h3 class="card-title">Завершение приёмки</h3><p class="card-subtitle">Эти значения переносятся в расчёт времени итоговой таблицы.</p></div></div>
          <div class="timer-grid">
            ${timerCard('Окончание приёмки', 'acceptanceEnd', 'Время завершения контроля по поставке.')}
            ${timerCard('Отчёт заполнен', 'reportEnd', 'Время завершения заполнения отчёта.')}
            <div class="timer-card"><span>Продолжительность</span><strong class="timer-value" data-duration-display="total">${formatDuration(s.connectionTime || s.acceptanceStart, s.reportEnd)}</strong><div class="summary-list"><div class="summary-row"><span>Приёмка</span><strong data-duration-display="acceptance">${formatDuration(s.acceptanceStart || s.connectionTime, s.acceptanceEnd)}</strong></div><div class="summary-row"><span>Заполнение отчёта</span><strong data-duration-display="report">${formatDuration(s.acceptanceEnd, s.reportEnd)}</strong></div></div></div>
          </div>
        </section>
        <div class="summary-grid">
          <section class="card card-pad">
            <div class="section-head"><div><h3 class="card-title">Сводка</h3><p class="card-subtitle">Основные реквизиты и заполненность товаров.</p></div></div>
            <div class="summary-list">
              <div class="summary-row"><span>Поставщик</span><strong>${escapeHtml(s.supplier || 'Не указан')}</strong></div>
              <div class="summary-row"><span>Номер заявки</span><strong>${escapeHtml(s.id || 'Не указан')}</strong></div>
              <div class="summary-row"><span>РЦ</span><strong>${escapeHtml(s.rc || 'Не указан')}</strong></div>
              <div class="summary-row"><span>Формат</span><strong>${escapeHtml(s.format)}</strong></div>
              ${state.skus.map((sku, index) => `<div class="summary-row"><span>${index + 1}. ${escapeHtml(getSkuLabel(sku, index))}</span><strong>${QUESTIONS.filter(q => isApplicable(sku, q) && isAnswered(sku, q)).length}/${QUESTIONS.filter(q => isApplicable(sku, q)).length}</strong></div>`).join('')}
            </div>
            <div class="button-row" style="margin-top:18px;justify-content:flex-start"><button class="button button-ghost" data-action="download-backup">Скачать резервную копию</button><label class="button button-ghost" style="cursor:pointer">Восстановить JSON<input type="file" accept="application/json" data-action="import-backup" hidden/></label><button class="button button-danger" data-action="new-acceptance">Очистить эту страницу</button></div>
          </section>
          <section class="card card-pad export-panel">
            <div class="section-head"><div><h3 class="card-title">Выгрузить Excel</h3><p class="card-subtitle">Выгружается только открытая страница — данные других РЦ не смешиваются.</p></div></div>
            <div class="export-choice export-choice-single">
              <button class="export-button" data-action="request-export" data-export-type="old"><span><strong>Выгрузить Excel</strong><span>Проверенный рабочий шаблон для открытого РЦ</span></span><b class="export-arrow">→</b></button>
            </div>
            <div class="notice" style="margin-top:14px">Имя файла: <strong>${escapeHtml(buildChecklistFilename(s))}</strong></div>
          </section>
        </div>
      </div>`;
  }

  function setPath(path, value) {
    const parts = path.split('.'); let target = state;
    while (parts.length > 1) target = target[parts.shift()];
    target[parts[0]] = value;
  }
  function updateAnswer(skuIndex, code, patch) {
    const sku = state.skus[skuIndex];
    if (!sku) return;
    sku.checklist[code] = { status: '', value: '', time: '', comment: '', ...(sku.checklist[code] || {}), ...patch };
    scheduleSave();
  }

  function updateMassPercentages(skuIndex) {
    const sku = state.skus[skuIndex];
    if (!sku) return;
    const roots = document.querySelectorAll(`[data-product-card="${skuIndex}"], [data-final-mass-card="${skuIndex}"]`);
    const massFields = ['defectMass', 'nonstandardMass', 'debrisMass', 'caliberMass'];
    const total = massFields.reduce((sum, field) => sum + numeric(sku[field]), 0);
    const quality = Math.max(0, numeric(sku.sampleMass) - total);
    roots.forEach(root => {
      massFields.forEach(field => root.querySelectorAll(`[data-percent-output="${field}"]`).forEach(output => { output.textContent = formatPercent(percent(sku[field], sku.sampleMass)); }));
      root.querySelectorAll('[data-mass-total]').forEach(output => { output.textContent = `${displayNumber(total, 3)} кг`; });
      root.querySelectorAll('[data-quality-mass]').forEach(output => { output.textContent = `${displayNumber(quality, 3)} кг`; });
      const helper = root.querySelector('[data-mass-helper]');
      if (helper) helper.outerHTML = massAssistantMarkup(sku, skuIndex);
    });
  }

  function updateProductAssistant(skuIndex) {
    const productCard = document.querySelector(`[data-product-card="${skuIndex}"]`);
    const finalCard = document.querySelector(`[data-final-mass-card="${skuIndex}"]`);
    const sku = state.skus[skuIndex];
    const helper = productCard?.querySelector('[data-product-helper]');
    if (helper && sku) helper.outerHTML = productAssistantMarkup(sku);
    const massHelper = finalCard?.querySelector('[data-mass-helper]');
    if (massHelper && sku) massHelper.outerHTML = massAssistantMarkup(sku, skuIndex);
  }

  function resolveTimeTarget(element) {
    if (element.dataset.timeShipmentKey) return { kind: 'shipment', key: element.dataset.timeShipmentKey };
    if (element.dataset.timeSku !== undefined && element.dataset.timeCode) return { kind: 'answer', skuIndex: Number(element.dataset.timeSku), code: element.dataset.timeCode };
    return null;
  }

  function writeTimeTarget(target, time) {
    const datetime = time ? checklistDateTimeFromTime(time) : '';
    if (target?.kind === 'shipment') {
      state.shipment[target.key] = datetime;
      scheduleSave(); updateGlobalProgress(); updateDurationDisplays(); return datetime;
    }
    if (target?.kind === 'answer') {
      updateAnswer(target.skuIndex, target.code, { time: datetime }); return datetime;
    }
    return '';
  }

  function syncTimeControl(element, time) {
    const control = element.closest('.time-control');
    if (!control) return;
    const text = control.querySelector('[data-time-text]');
    const picker = control.querySelector('[data-time-picker]');
    if (text) { text.value = time; text.classList.remove('is-invalid', 'shipment-validation-error'); text.setAttribute('aria-invalid', 'false'); }
    if (picker) picker.value = time;
    const target = resolveTimeTarget(element);
    if (target?.kind === 'shipment') {
      const display = document.querySelector(`[data-time-display="${target.key}"]`);
      if (display) display.textContent = time || '—:—';
    }
  }

  function commitTimeInput(element, rawValue, showError = true) {
    const normalized = normalizeTimeText(rawValue);
    if (!normalized.valid) {
      element.classList.add('is-invalid'); element.setAttribute('aria-invalid', 'true');
      if (showError) toast('Введите время в формате ЧЧ:ММ, например 09:35.', 'error', 5000);
      return false;
    }
    writeTimeTarget(resolveTimeTarget(element), normalized.value);
    syncTimeControl(element, normalized.value); refreshChecklistChrome(); return true;
  }

  function handleInput(event) {
    if (!authenticated) return;
    const el = event.target;
    if (el.classList?.contains('shipment-validation-error')) {
      el.classList.remove('shipment-validation-error');
      if (!el.classList.contains('is-invalid')) el.setAttribute('aria-invalid', 'false');
    }
    if (el.dataset.field) { setPath(el.dataset.field, el.value); if (el.dataset.field === 'shipment.date') synchronizeAllTimesToDate(el.value); scheduleSave(); if (el.dataset.field.startsWith('shipment.')) { updateGlobalProgress(); updateWorkspaceTabStatus(); } if (el.dataset.field === 'shipment.rc') updateLiveRcClock(); return; }
    if (el.dataset.skuField !== undefined) {
      const skuIndex = Number(el.dataset.sku);
      const sku = state.skus[skuIndex]; if (!sku) return;
      if (el.dataset.brixValues !== undefined) {
        const normalized = normalizeBrixValues(el.value, false);
        if (el.value !== normalized) el.value = normalized;
        sku.brixValues = normalized;
        el.classList.toggle('is-invalid', Boolean(normalized) && !isValidBrixValues(normalized));
      } else sku[el.dataset.skuField] = el.value;
      if (['sampleMass', 'defectMass', 'nonstandardMass', 'debrisMass', 'caliberMass'].includes(el.dataset.skuField)) {
        updateMassPercentages(skuIndex);
      }
      scheduleSave();
      updateProductAssistant(skuIndex);
      updateSkuStatusChrome(skuIndex);
      updateGlobalProgress();
      return;
    }
    if (el.dataset.answerValue !== undefined) {
      const skuIndex = Number(el.dataset.sku); const code = el.dataset.code; const value = el.value; const answer = getAnswer(state.skus[skuIndex], code);
      const shouldTime = value !== '' && (code !== '7.4' || numeric(value) > 0);
      const nextTime = shouldTime ? (answer.time || nowLocalInput()) : '';
      updateAnswer(skuIndex, code, { value, time: nextTime });
      const timeInput = el.closest('.question-card')?.querySelector('[data-time-text]');
      if (timeInput) {
        const disabled = code === '7.4' && numeric(value) <= 0;
        const control = timeInput.closest('.time-control');
        control?.classList.toggle('is-disabled', disabled);
        control?.querySelectorAll('input,button').forEach(controlEl => { controlEl.disabled = disabled; });
        syncTimeControl(timeInput, disabled ? '' : timeOnly(nextTime));
      }
      const card = el.closest('.question-card');
      if (card) card.classList.toggle('is-complete', value !== '');
      refreshChecklistChrome();
      return;
    }
    if (el.dataset.answerComment !== undefined) { updateAnswer(Number(el.dataset.sku), el.dataset.code, { comment: el.value }); return; }
    if (el.dataset.defectField) {
      const sku = state.skus[Number(el.dataset.sku)]; const defect = sku?.defects?.[Number(el.dataset.defect)]; if (!defect) return;
      defect[el.dataset.defectField] = el.value; scheduleSave(); updateSkuStatusChrome(Number(el.dataset.sku)); updateGlobalProgress(); return;
    }
    if (el.dataset.uiField) { state.ui[el.dataset.uiField] = el.value; scheduleSave(); return; }
    if (el === notesTextarea) { state.notes = el.value; scheduleSave(); }
  }

  let renderTimer = null;
  function debounceRender() { clearTimeout(renderTimer); renderTimer = setTimeout(render, 180); }

  function handleChange(event) {
    if (!authenticated) return;
    const el = event.target;
    if (el.classList?.contains('shipment-validation-error')) {
      el.classList.remove('shipment-validation-error');
      if (!el.classList.contains('is-invalid')) el.setAttribute('aria-invalid', 'false');
    }
    if (el.dataset.timeText !== undefined) { commitTimeInput(el, el.value); return; }
    if (el.dataset.timePicker !== undefined) { commitTimeInput(el, el.value); return; }
    if (el.dataset.rcCombobox !== undefined) {
      const bestMatch = findBestRcMatch(el.value);
      if (bestMatch) el.value = bestMatch.name;
      setPath('shipment.rc', el.value.trim());
      scheduleSave(); updateGlobalProgress(); updateWorkspaceTabStatus(); render(); updateLiveRcClock();
      return;
    }
    if (el.dataset.field) { setPath(el.dataset.field, el.value); if (el.dataset.field === 'shipment.date') synchronizeAllTimesToDate(el.value); scheduleSave(); updateGlobalProgress(); updateWorkspaceTabStatus(); if (el.dataset.field === 'shipment.rc') { render(); updateLiveRcClock(); } return; }
    if (el.dataset.skuField !== undefined) {
      const skuIndex = Number(el.dataset.sku);
      const sku = state.skus[skuIndex];
      if (sku) {
        if (el.dataset.brixValues !== undefined) {
          const normalized = normalizeBrixValues(el.value, true);
          el.value = normalized;
          sku.brixValues = normalized;
          el.classList.toggle('is-invalid', Boolean(normalized) && !isValidBrixValues(normalized));
        } else sku[el.dataset.skuField] = el.value;
        if (['sampleMass', 'defectMass', 'nonstandardMass', 'debrisMass', 'caliberMass'].includes(el.dataset.skuField)) {
          updateMassPercentages(skuIndex);
        }
      }
      scheduleSave();
      updateGlobalProgress();
      updateProductAssistant(skuIndex);
      updateSkuStatusChrome(skuIndex);
      return;
    }
    if (el.dataset.defectField) {
      const d = state.skus[Number(el.dataset.sku)]?.defects?.[Number(el.dataset.defect)];
      if (d) d[el.dataset.defectField] = el.value;
      scheduleSave();
      updateSkuStatusChrome(Number(el.dataset.sku));
      updateGlobalProgress();
      return;
    }
    if (el.dataset.uiField) { state.ui[el.dataset.uiField] = el.value; scheduleSave(); render(); return; }
    if (el.matches('input[data-action="import-backup"]') && el.files?.[0]) importBackup(el.files[0]);
  }

  function updateSkuStatusChrome(index) {
    const sku = state.skus[index];
    if (!sku) return;
    const status = getSkuStatus(sku, index);
    const card = document.querySelector(`[data-product-card="${index}"]`);
    if (card) {
      [...card.classList].filter(cls => cls.startsWith('sku-status-')).forEach(cls => card.classList.remove(cls));
      card.classList.add(`sku-status-${status.key}`);
    }
    document.querySelectorAll(`[data-sku-status-badge="${index}"]`).forEach(badge => {
      [...badge.classList].filter(cls => cls.startsWith('status-')).forEach(cls => badge.classList.remove(cls));
      badge.classList.add(`status-${status.key}`);
      const label = badge.querySelector('[data-sku-status-label]');
      const progress = badge.querySelector('[data-sku-status-progress]');
      if (label) label.textContent = status.label;
      if (progress) progress.textContent = `${status.progress}%`;
    });
    if (state.ui.page === 'products') {
      const boardItem = document.querySelector(`.product-status-item[data-sku="${index}"]`);
      if (boardItem) {
        [...boardItem.classList].filter(cls => cls.startsWith('status-')).forEach(cls => boardItem.classList.remove(cls));
        boardItem.classList.add(`status-${status.key}`);
        const detail = boardItem.querySelector('.product-status-copy small');
        const label = boardItem.querySelector('.product-status-value b');
        const progress = boardItem.querySelector('.product-status-value small');
        const fill = boardItem.querySelector(':scope > i > em');
        if (detail) detail.textContent = status.detail;
        if (label) label.textContent = status.label;
        if (progress) progress.textContent = `${status.progress}%`;
        if (fill) fill.style.width = `${status.progress}%`;
      }
      const counters = document.querySelector('.product-status-counters');
      if (counters) {
        const statuses = state.skus.map((item, i) => getSkuStatus(item, i));
        const ready = statuses.filter(item => ['ready', 'ready-warning'].includes(item.key)).length;
        const active = statuses.filter(item => item.key === 'in-progress').length;
        const attention = statuses.filter(item => ['attention', 'ready-warning'].includes(item.key)).length;
        const values = counters.querySelectorAll('b');
        if (values[0]) values[0].textContent = ready;
        if (values[1]) values[1].textContent = active;
        if (values[2]) values[2].textContent = attention;
      }
    }
  }

  function refreshChecklistChrome() {
    if (state.ui.page !== 'checklist') return;
    const sku = state.skus[state.ui.currentSku];
    if (!sku) return;
    document.querySelectorAll('.step-button[data-step]').forEach(stepButton => {
      const stepId = Number(stepButton.dataset.step);
      const questions = questionsForStep(sku, stepId);
      const done = questions.filter(question => isAnswered(sku, question)).length;
      const percent = questions.length ? Math.round(done / questions.length * 100) : 100;
      const status = getStepState(sku, stepId);
      stepButton.classList.remove('done', 'partial', 'empty', 'skipped');
      stepButton.classList.add(status);
      const statusEl = stepButton.querySelector('.step-status');
      if (statusEl) {
        statusEl.classList.toggle('done', status === 'done');
        statusEl.textContent = status === 'done' ? '✓' : status === 'skipped' ? '—' : `${percent}%`;
      }
      const countEl = stepButton.querySelector('.step-copy small');
      if (countEl) countEl.textContent = `${done} из ${questions.length}`;
      const fillEl = stepButton.querySelector(':scope > i > b');
      if (fillEl) fillEl.style.width = `${percent}%`;
      if (stepId === state.ui.checkStep) {
        const counterStrong = document.querySelector('.step-counter strong');
        const counterSmall = document.querySelector('.step-counter small');
        const headFill = document.querySelector('.step-progress-track i');
        if (counterStrong) counterStrong.textContent = `${percent}%`;
        if (counterSmall) counterSmall.textContent = `${done} из ${questions.length} · ${getSkuLabel(sku, state.ui.currentSku)}`;
        if (headFill) headFill.style.width = `${percent}%`;
      }
    });
    const stats = getChecklistStats();
    const progressEl = document.querySelector('[data-checklist-progress]');
    const listProgress = document.querySelector('.step-list-head strong');
    if (progressEl) progressEl.textContent = `${stats.done} / ${stats.total} · ${stats.percent}%`;
    if (listProgress) listProgress.textContent = `${stats.percent}%`;

    const skuTab = document.querySelector(`.sku-tab[data-sku="${state.ui.currentSku}"]`);
    if (skuTab) {
      const applicable = QUESTIONS.filter(question => isApplicable(sku, question));
      const done = applicable.filter(question => isAnswered(sku, question)).length;
      const status = getSkuStatus(sku, state.ui.currentSku);
      const count = skuTab.querySelector('.sku-tab-copy small');
      const value = skuTab.querySelector('.sku-tab-percent');
      const fill = skuTab.querySelector(':scope > i > em');
      if (count) count.textContent = `${done}/${applicable.length} пунктов · ${status.label}`;
      if (value) value.textContent = `${status.progress}%`;
      if (fill) fill.style.width = `${status.progress}%`;
      [...skuTab.classList].filter(cls => cls.startsWith('sku-status-')).forEach(cls => skuTab.classList.remove(cls));
      skuTab.classList.add(`sku-status-${status.key}`);
      updateSkuStatusChrome(state.ui.currentSku);
    }
    updateGlobalProgress();
  }

  function applyAnswerStatusWithoutRender(button, skuIndex, code, status, time, comment) {
    const card = button.closest('.question-card');
    if (!card) return;
    card.classList.remove('is-yes', 'is-no', 'is-na');
    if (status) card.classList.add(`is-${status}`);
    card.querySelectorAll('.answer-button').forEach(answerButton => {
      const active = answerButton.dataset.status === status;
      answerButton.classList.toggle('active', active);
    });
    const timeInput = card.querySelector('[data-time-text]');
    const commentInput = card.querySelector('[data-answer-comment]');
    const disabled = status === 'na';
    if (timeInput) { const control = timeInput.closest('.time-control'); control?.classList.toggle('is-disabled', disabled); control?.querySelectorAll('input,button').forEach(el => { el.disabled = disabled; }); syncTimeControl(timeInput, disabled ? '' : timeOnly(time)); }
    if (commentInput) { commentInput.disabled = disabled; if (disabled) commentInput.value = ''; else if (commentInput.value !== (comment || '')) commentInput.value = comment || ''; }
    refreshChecklistChrome();
  }

  async function handleClick(event) {
    if (!authenticated) return;
    const workspacePanel = document.getElementById('workspaceBar');
    if (workspacePanel?.classList.contains('open') && !event.target.closest('#workspaceBar') && !event.target.closest('#workspaceToggle')) closeWorkspacePanel();
    if (event.target.closest('.topbar-menu-item')) document.querySelector('.topbar-more')?.removeAttribute('open');
    const pageButton = event.target.closest('[data-page]');
    if (pageButton) { setPage(pageButton.dataset.page); return; }
    const button = event.target.closest('[data-action]');
    if (!button) return;
    const action = button.dataset.action;
    if (action === 'toggle-workspace') {
      const panel = document.getElementById('workspaceBar');
      const open = !panel?.classList.contains('open');
      panel?.classList.toggle('open', open);
      button.setAttribute('aria-expanded', String(open));
      queueStickyLayoutUpdate();
      return;
    }
    if (action === 'focus-product') {
      const index = Number(button.dataset.sku);
      const card = document.querySelector(`[data-product-card="${index}"]`);
      card?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      card?.classList.add('is-highlighted');
      setTimeout(() => card?.classList.remove('is-highlighted'), 1100);
      return;
    }
    if (action === 'select-checklist') { switchChecklist(button.dataset.checklistId); return; }
    if (action === 'add-checklist') { addChecklist(); return; }
    if (action === 'remove-checklist') { removeChecklist(button.dataset.checklistId); return; }
    if (action === 'select-summary-sku') {
      const nextSku = Number(button.dataset.sku);
      const direction = nextSku >= state.ui.currentSku ? 'forward' : 'back';
      runAdaptiveTransition(() => { state.ui.currentSku = nextSku; scheduleSave(); render(); }, { direction, mode: 'swap' });
      return;
    }
    if (action === 'add-sku') { if (state.skus.length < MAX_SKU) { state.skus.push(defaultSku()); state.ui.currentSku = state.skus.length - 1; scheduleSave(); render(); } }
    if (action === 'remove-sku') { const i = Number(button.dataset.sku); if (state.skus.length > 1 && confirm(`Удалить ${getSkuLabel(state.skus[i], i)}?`)) { state.skus.splice(i, 1); state.ui.currentSku = Math.min(state.ui.currentSku, state.skus.length - 1); scheduleSave(); render(); } }
    if (action === 'move-sku') { moveSku(Number(button.dataset.sku), Number(button.dataset.delta)); }
    if (action === 'toggle-feature') { const skuIndex = Number(button.dataset.sku); const sku = state.skus[skuIndex]; const key = button.dataset.feature; if (sku && key in FEATURE_LABELS) { sku[key] = !sku[key]; if (!sku[key]) QUESTIONS.filter(q => q.feature === key).forEach(q => { delete sku.checklist[q.code]; }); scheduleSave(); button.classList.toggle('active', sku[key]); button.setAttribute('aria-pressed', String(sku[key])); updateProductAssistant(skuIndex); updateSkuStatusChrome(skuIndex); updateGlobalProgress(); } }
    if (action === 'select-sku') {
      const nextSku = Number(button.dataset.sku);
      const direction = nextSku >= state.ui.currentSku ? 'forward' : 'back';
      runAdaptiveTransition(() => { state.ui.currentSku = nextSku; scheduleSave(); render(); }, { direction, mode: 'swap' });
    }
    if (action === 'select-step') {
      const nextStep = Number(button.dataset.step);
      const direction = nextStep >= state.ui.checkStep ? 'forward' : 'back';
      runAdaptiveTransition(() => { state.ui.checkStep = nextStep; scheduleSave(); render(); }, { direction, mode: 'step' });
    }
    if (action === 'previous-step') {
      runAdaptiveTransition(() => {
        state.ui.checkStep = Math.max(0, state.ui.checkStep - 1);
        scheduleSave();
        render();
      }, { direction: 'back', mode: 'step' });
    }
    if (action === 'next-step') {
      if (state.ui.checkStep >= STEP_GROUPS.length - 1) setPage('defects');
      else {
        runAdaptiveTransition(() => {
          state.ui.checkStep += 1;
          scheduleSave();
          render();
        }, { direction: 'forward', mode: 'step' });
      }
    }
    if (action === 'set-current-operator-time') {
      const target = resolveTimeTarget(button);
      if (!target) return;
      const currentTime = timeOnly(nowOperatorInput());
      writeTimeTarget(target, currentTime);
      const input = button.closest('.time-control')?.querySelector('[data-time-text]');
      if (input) syncTimeControl(input, currentTime);
      refreshChecklistChrome(); updateDurationDisplays();
      return;
    }
    if (action === 'set-current-rc-time') {
      const target = resolveTimeTarget(button);
      if (!target) return;
      const currentTime = timeOnly(nowLocalInput());
      writeTimeTarget(target, currentTime);
      const input = button.closest('.time-control')?.querySelector('[data-time-text]');
      if (input) syncTimeControl(input, currentTime);
      refreshChecklistChrome(); updateLiveRcClock();
      return;
    }
    if (action === 'open-time-picker') {
      const control = button.closest('.time-control');
      const picker = control?.querySelector('[data-time-picker]');
      if (!picker || picker.disabled) return;
      try { if (typeof picker.showPicker === 'function') picker.showPicker(); else { picker.focus(); picker.click(); } } catch (_) { picker.focus(); picker.click(); }
      return;
    }
    if (action === 'complete-step') {
      const sku = state.skus[state.ui.currentSku];
      const questions = questionsForStep(sku, STEP_GROUPS[state.ui.checkStep]?.id);
      const now = nowLocalInput(); let changed = 0;
      questions.forEach(question => {
        if (question.type !== 'yesno') return;
        const current = getAnswer(sku, question.code);
        sku.checklist[question.code] = { ...current, status: 'yes', time: current.time || now, comment: current.comment || '' };
        changed += 1;
      });
      scheduleSave(); render();
      toast(changed ? `Отмечено пунктов: ${changed}.` : 'На этом шаге нет пунктов для массовой отметки.', changed ? 'success' : '');
      return;
    }
    if (action === 'go-unanswered') {
      const sku = state.skus[state.ui.currentSku];
      const nextIndex = STEP_GROUPS.findIndex(group => questionsForStep(sku, group.id).some(question => !isAnswered(sku, question)));
      if (nextIndex < 0) { toast('Все активные пункты товара заполнены.', 'success'); return; }
      state.ui.checkStep = nextIndex; scheduleSave(); render();
      setTimeout(() => document.querySelector('.question-card:not(.is-yes):not(.is-no):not(.is-na):not(.is-complete)')?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 30);
      return;
    }
    if (action === 'answer-status') {
      const skuIndex = Number(button.dataset.sku); const code = button.dataset.code; const status = button.dataset.status; const current = getAnswer(state.skus[skuIndex], code);
      const time = status === 'na' ? '' : (current.time || nowLocalInput());
      const comment = status === 'na' ? '' : current.comment;
      updateAnswer(skuIndex, code, { status, time, comment });
      applyAnswerStatusWithoutRender(button, skuIndex, code, status, time, comment);
    }
    if (action === 'copy-defect-type-to-visual') {
      const skuIndex = Number(button.dataset.sku);
      const defectIndex = Number(button.dataset.defect);
      const defect = state.skus[skuIndex]?.defects?.[defectIndex];
      if (!defect) return;
      const sourceInput = document.querySelector(`[data-defect-field="type"][data-sku="${skuIndex}"][data-defect="${defectIndex}"]`);
      const visualInput = document.querySelector(`[data-defect-field="visual"][data-sku="${skuIndex}"][data-defect="${defectIndex}"]`);
      const typeText = String(sourceInput?.value ?? defect.type ?? '').trim();
      if (!typeText) {
        toast('Сначала заполните поле «Тип дефекта».', 'error', 4500);
        sourceInput?.focus();
        return;
      }
      defect.type = typeText;
      defect.visual = typeText;
      if (visualInput) {
        visualInput.value = typeText;
        visualInput.focus();
        visualInput.setSelectionRange(typeText.length, typeText.length);
      }
      scheduleSave();
      updateGlobalProgress();
      button.classList.remove('is-copied');
      void button.offsetWidth;
      button.classList.add('is-copied');
      setTimeout(() => button.classList.remove('is-copied'), 650);
      toast('Тип дефекта скопирован в визуальную оценку.', 'success', 2800);
      return;
    }
    if (action === 'add-defect') { const sku = state.skus[state.ui.currentSku]; if (sku && sku.defects.length < MAX_DEFECTS) { sku.defects.push({ type: '', visual: '', count: '', severity: 'defect', comment: '' }); scheduleSave(); render(); } }
    if (action === 'remove-defect') { const sku = state.skus[Number(button.dataset.sku)]; const index = Number(button.dataset.defect); if (sku && confirm('Удалить запись о дефекте?')) { sku.defects.splice(index, 1); scheduleSave(); render(); } }
    if (action === 'clear-defect-filters') { state.ui.defectSearch = ''; state.ui.defectSeverity = 'all'; scheduleSave(); render(); }
    if (action === 'set-time') { const key = button.dataset.timeKey; state.shipment[key] = nowLocalInput(); scheduleSave(); const input = button.closest('.timer-card')?.querySelector('[data-time-text]'); if (input) syncTimeControl(input, timeOnly(state.shipment[key])); updateGlobalProgress(); updateDurationDisplays(); }
    if (action === 'request-export') requestExport(button.dataset.exportType || 'old');
    if (action === 'download-backup') downloadBackup();
    if (action === 'new-acceptance') newAcceptance();
  }

  function moveSku(index, delta) {
    const target = index + delta;
    if (target < 0 || target >= state.skus.length) return;
    [state.skus[index], state.skus[target]] = [state.skus[target], state.skus[index]];
    state.ui.currentSku = target; scheduleSave(); render();
  }

  function downloadBackup() {
    saveNow();
    downloadBlob(new Blob([JSON.stringify(workspace, null, 2)], { type: 'application/json;charset=utf-8' }), `резервная_копия_5_РЦ_${new Date().toISOString().slice(0, 10)}.json`);
    toast('Резервная копия всех открытых чек-листов сохранена.', 'success');
  }
  async function importBackup(file) {
    try {
      const parsed = JSON.parse(await file.text());
      if (Array.isArray(parsed?.checklists) && parsed.checklists.length) {
        const checklists = parsed.checklists.slice(0, MAX_CHECKLISTS).map(migrateState);
        workspace = { version: 25, checklists, activeChecklistId: checklists.some(item => item.id === parsed.activeChecklistId) ? parsed.activeChecklistId : checklists[0].id, updatedAt: new Date().toISOString() };
        state = workspace.checklists.find(item => item.id === workspace.activeChecklistId) || workspace.checklists[0];
      } else if (parsed?.shipment && Array.isArray(parsed?.skus)) {
        const restored = migrateState(parsed);
        workspace = { version: 25, checklists: [restored], activeChecklistId: restored.id, updatedAt: new Date().toISOString() };
        state = restored;
      } else throw new Error('Неверная структура');
      saveNow(); render(); toast('Данные восстановлены.', 'success');
    } catch (error) { console.error(error); toast('Не удалось восстановить резервную копию.', 'error'); }
  }
  function newAcceptance() {
    if (!confirm('Очистить только открытую страницу? Остальные чек-листы РЦ сохранятся.')) return;
    const pos = state.ui.notesPosition; const pin = state.ui.notesPinned;
    const index = workspace.checklists.findIndex(item => item.id === state.id);
    const fresh = defaultState(); fresh.ui.notesPosition = pos; fresh.ui.notesPinned = pin;
    workspace.checklists[index] = fresh; state = fresh; workspace.activeChecklistId = fresh.id;
    saveNow(); render(); toast('Открытая страница очищена. Другие РЦ не изменены.', 'success');
  }

  function buildExportState() {
    return {
      ...state,
      shipment: Object.fromEntries(Object.entries(state.shipment).map(([key, value]) => [key, ['connectionTime','acceptanceStart','acceptanceEnd','reportEnd'].includes(key) && value ? rebaseDateTime(value, state.shipment.date || todayInput()) : value])),
      skus: state.skus.map(sku => ({
        ...sku,
        checklist: Object.fromEntries(Object.entries(sku.checklist || {}).map(([code, answer]) => {
          const question = QUESTIONS.find(q => q.code === code);
          const applicable = !question || isApplicable(sku, question);
          if (!applicable || answer.status === 'na') return [code, { ...answer, status: '', time: '', comment: '' }];
          if (code === '7.4' && numeric(answer.value) <= 0) return [code, { ...answer, time: '' }];
          return [code, { ...answer, time: answer.time ? rebaseDateTime(answer.time, state.shipment.date || todayInput()) : '' }];
        })),
        defects: (sku.defects || []).slice(0, MAX_DEFECTS).map(d => ({ ...d })),
      })),
    };
  }

  function clearShipmentValidationMarks() {
    document.querySelectorAll('.shipment-validation-error').forEach(element => {
      element.classList.remove('shipment-validation-error');
      if (!element.classList.contains('is-invalid')) element.setAttribute('aria-invalid', 'false');
    });
  }

  function focusMissingShipmentFields() {
    const missing = getMissingShipmentFields();
    if (!missing.length) return;
    const reveal = () => {
      clearShipmentValidationMarks();
      missing.forEach(field => {
        const element = document.querySelector(field.selector);
        if (!element) return;
        element.classList.add('shipment-validation-error');
        element.setAttribute('aria-invalid', 'true');
      });
      const first = document.querySelector(missing[0].selector);
      first?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'center' });
      setTimeout(() => first?.focus(), 180);
    };
    if (state.ui.page !== 'shipment') {
      setPage('shipment');
      setTimeout(reveal, 260);
    } else reveal();
  }

  function requestExport(exportType = 'new') {
    const validation = getValidation();
    if (!validation.errors.length && !validation.warnings.length) { exportExcel(exportType); return; }
    document.getElementById('modalTitle').textContent = validation.errors.length ? 'Выгрузка Excel недоступна' : 'Перед выгрузкой';
    document.getElementById('modalBody').innerHTML = `<div class="issue-list">${validation.errors.map(x => `<div class="issue error">${escapeHtml(x)}</div>`).join('')}${validation.warnings.map(x => `<div class="issue">${escapeHtml(x)}</div>`).join('')}</div>`;
    const footer = document.getElementById('modalFooter');
    const shipmentButton = validation.shipmentErrors?.length ? '<button class="button button-primary" id="validationGoShipment">Перейти к приёмке</button>' : '';
    footer.innerHTML = `<button class="button button-ghost" id="validationCancel">Вернуться</button>${shipmentButton}${validation.errors.length ? '' : `<button class="button button-primary" id="validationExport">Выгрузить с предупреждениями</button>`}`;
    modalBackdrop.hidden = false;
    document.getElementById('validationCancel').onclick = closeModal;
    const goShipment = document.getElementById('validationGoShipment');
    if (goShipment) goShipment.onclick = () => { closeModal(); focusMissingShipmentFields(); };
    if (!validation.errors.length) document.getElementById('validationExport').onclick = () => { closeModal(); exportExcel(exportType); };
  }
  function closeModal() { modalBackdrop.hidden = true; }

  function localizedStatus(status) { return ({ yes: 'да', no: 'нет' })[status] || ''; }
  function localizedVisual(value) {
    const text = String(value ?? '').trim();
    if (text === 'yes') return 'Видно';
    if (text === 'no') return 'Невидно';
    return text;
  }
  function defectTypeForExport(defect) {
    if (!defect) return '';
    const type = String(defect.type || '').trim();
    if (defect.severity !== 'caliber') return type;
    return type ? `Некалибр — ${type}` : 'Некалибр';
  }
  function base64ToArrayBuffer(base64) { const binary = atob(base64); const bytes = new Uint8Array(binary.length); for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i); return bytes.buffer; }
  function dateFromInput(value) {
    if (!value) return null;
    const [datePart, timePart = '00:00'] = String(value).split('T');
    const [year, month, day] = datePart.split('-').map(Number);
    const normalized = normalizeTimeText(timePart);
    if (!year || !month || !day || !normalized.valid) return null;
    const [hour, minute] = normalized.value.split(':').map(Number);
    return new Date(year, month - 1, day, hour, minute, 0);
  }

  function excelSerialFromInput(value) {
    if (!value) return null;
    const [datePart, timePart = '00:00'] = String(value).split('T');
    const [year, month, day] = datePart.split('-').map(Number);
    const normalized = normalizeTimeText(timePart);
    if (!year || !month || !day || !normalized.valid) return null;
    const [hour, minute] = normalized.value.split(':').map(Number);
    return Date.UTC(year, month - 1, day, hour, minute, 0) / 86400000 + 25569;
  }
  function numberOrBlank(value) { if (value === '' || value === null || value === undefined) return ''; const n = Number(String(value).replace(',', '.')); return Number.isFinite(n) ? n : ''; }
  function setExportLoading(show, status = 'Подготавливаем шаблон…', percent = 10, title = '') {
    loadingOverlay.hidden = !show;
    document.getElementById('loadingStatus').textContent = status;
    document.getElementById('loadingTitle').textContent = title || 'Формируем Excel';
    document.getElementById('loadingProgressBar').style.width = `${Math.max(4, Math.min(100, Number(percent) || 0))}%`;
  }
  function cancelExport() { exportCancelled = true; activeExportAbortController?.abort(); activeExportAbortController = null; setExportLoading(false); toast('Формирование Excel отменено.', 'error'); }

  async function exportExcel(exportType = 'new') {
    const normalizedType = exportType === 'old' ? 'old' : 'new';
    const validation = getValidation();
    if (validation.errors.length) { requestExport(normalizedType); return; }
    const label = normalizedType === 'old' ? 'старую форму' : 'новую форму';
    exportCancelled = false; saveNow(); const exportState = buildExportState();
    setExportLoading(true, `Проверяем способ формирования: ${label}…`, 8, `Формируем ${label}`);
    let serverError = null;
    if (location.protocol !== 'file:') {
      const controller = new AbortController(); activeExportAbortController = controller; const timer = setTimeout(() => controller.abort(), 25000);
      try {
        setExportLoading(true, `Заполняем ${label}…`, 38, `Формируем ${label}`);
        const response = await fetch('./api/export', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ state: exportState, exportType: normalizedType }), signal: controller.signal, cache: 'no-store' });
        if (!response.ok) { let message = `Ошибка сервера ${response.status}`; try { message = (await response.json()).error || message; } catch (_) {} throw new Error(message); }
        const blob = await response.blob(); if (exportCancelled) return; if (blob.size < 1000) throw new Error('Сервер вернул пустой файл');
        setExportLoading(true, 'Файл готов. Начинаем скачивание…', 96, `Формируем ${label}`);
        downloadBlob(blob, buildChecklistFilename(state.shipment));
        setExportLoading(false); toast('Excel сформирован.', 'success', 5000); return;
      } catch (error) { serverError = error; console.warn('Серверный экспорт недоступен', error); }
      finally { clearTimeout(timer); if (activeExportAbortController === controller) activeExportAbortController = null; }
    }
    if (exportCancelled) return;
    try {
      setExportLoading(true, `Создаём ${label} в браузере…`, 20, `Формируем ${label}`);
      await exportExcelSafeBrowser(exportState, normalizedType);
      setExportLoading(false); toast(`Excel сформирован.${serverError ? ' Использован резервный режим.' : ''}`, 'success', 6000);
    } catch (error) { setExportLoading(false); console.error(error); toast(`Не удалось сформировать Excel: ${error?.message || error}`, 'error', 9000); }
  }

  function fillExactTemplateWorkbook(workbook, exportState) {
    const ws = workbook.getWorksheet('Чек лист_ДП_Отчет') || workbook.worksheets[0];
    if (!ws) throw new Error('Не найден основной лист шаблона.');
    // Нейтральные значения защищают резервный экспорт, если очистка ZIP-метаданных недоступна.
    workbook.creator = 'Дистанционная Приёмка';
    workbook.lastModifiedBy = 'Дистанционная Приёмка';
    workbook.lastPrinted = undefined;
    workbook.modified = new Date();
    workbook.calcProperties.fullCalcOnLoad = true; workbook.calcProperties.forceFullCalc = true; workbook.calcProperties.calcMode = 'auto';
    const s = exportState.shipment || {};
    const connectionStart = excelSerialFromInput(s.connectionTime || s.acceptanceStart);
    let acceptanceStart = excelSerialFromInput(s.acceptanceStart || s.connectionTime);
    let acceptanceEnd = excelSerialFromInput(s.acceptanceEnd);
    let reportEnd = excelSerialFromInput(s.reportEnd);
    if (connectionStart !== null && acceptanceStart !== null) while (acceptanceStart < connectionStart) acceptanceStart += 1;
    if (acceptanceStart !== null && acceptanceEnd !== null) while (acceptanceEnd < acceptanceStart) acceptanceEnd += 1;
    const reportAnchor = acceptanceEnd ?? acceptanceStart ?? connectionStart;
    if (reportAnchor !== null && reportEnd !== null) while (reportEnd < reportAnchor) reportEnd += 1;
    ws.getCell('D2').value = connectionStart ?? null; if (connectionStart !== null) ws.getCell('D2').numFmt = 'hh:mm';
    ws.getCell('K70').value = reportEnd ?? null; if (reportEnd !== null) ws.getCell('K70').numFmt = 'hh:mm';
    const summaryColumns = ['C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','X','AA','AB'];
    const statusCols = ['J','Q','X','AE','AL']; const timeCols = ['K','R','Y','AF','AM']; const commentCols = ['L','S','Z','AG','AN'];
    const defectCols = [{ type: 'J', visual: 'L', count: 'N', comment: 'O' }, { type: 'Q', visual: 'S', count: 'U', comment: 'V' }, { type: 'X', visual: 'Z', count: 'AB', comment: 'AC' }, { type: 'AE', visual: 'AG', count: 'AI', comment: 'AJ' }, { type: 'AL', visual: 'AN', count: 'AP', comment: 'AQ' }];
    const characteristicRanges = ['J61:K66','Q61:R66','X61:Y66','AE61:AF66','AL61:AM66'];
    const allChecklistTimes = [];
    for (let i = 0; i < MAX_SKU; i++) {
      const row = 5 + i; const sku = exportState.skus?.[i];
      const values = sku ? [s.id || '', s.rc || '', s.date ? new Date(`${s.date}T00:00:00`) : null, s.supplier || '', sku.code || '', sku.name || '', s.format || '', s.mokk || '', s.dpId || '', sku.vpt || '', numberOrBlank(sku.sampleMass), numberOrBlank(sku.defectMass), numberOrBlank(sku.nonstandardMass), numberOrBlank(sku.debrisMass), numberOrBlank(sku.caliberMass), brixValuesForExport(sku) || null, sku.apmError === 'yes' ? 'да' : 'нет', sku.comment || ''] : Array(summaryColumns.length).fill(null);
      summaryColumns.forEach((col, idx) => { const cell = ws.getCell(`${col}${row}`); const value = values[idx]; cell.value = value === '' ? null : value; if (col === 'E' && value) cell.numFmt = 'dd.mm.yyyy'; });
      ws.getCell(`R${row}`).value = null;
      ws.getCell(`${['J','Q','X','AE','AL'][i]}16`).value = { formula: `H${row}`, result: sku?.name || '' };
      const stepOneTimes = [];
      const skuTimes = [];
      let lastSkuTime = acceptanceStart ?? connectionStart;
      QUESTIONS.forEach(q => {
        const statusCell = ws.getCell(`${statusCols[i]}${q.row}`); const timeCell = ws.getCell(`${timeCols[i]}${q.row}`); const commentCell = ws.getCell(`${commentCols[i]}${q.row}`);
        if (!sku) { statusCell.value = null; timeCell.value = null; commentCell.value = null; return; }
        const answer = sku.checklist?.[q.code] || {}; const applicable = isApplicable(sku, q); const skipped = !applicable || answer.status === 'na';
        statusCell.value = q.type === 'number' ? (numberOrBlank(answer.value) === '' ? null : numberOrBlank(answer.value)) : (skipped ? null : localizedStatus(answer.status));
        const allowTime = applicable && !skipped && questionAllowsTimeValue(q, answer);
        let dt = allowTime ? excelSerialFromInput(answer.time) : null;
        if (dt !== null) {
          while (lastSkuTime !== null && dt < lastSkuTime) dt += 1;
          lastSkuTime = dt;
        }
        const isStepOneTime = EXCEL_STEP_ONE_TIME_CODES.has(q.code);
        timeCell.value = isStepOneTime ? null : (dt ?? null);
        if (dt !== null && !isStepOneTime) timeCell.numFmt = 'hh:mm';
        if (dt !== null) { skuTimes.push(dt); allChecklistTimes.push(dt); }
        if (dt !== null && isStepOneTime) stepOneTimes.push(dt);
        commentCell.value = applicable && !skipped ? (answer.comment || null) : null;
      });
      const stepOneTimeCell = ws.getCell(`${timeCols[i]}${EXCEL_STEP_ONE_TIME_ROW}`);
      const stepOneTime = stepOneTimes.length ? Math.max(...stepOneTimes) : null;
      stepOneTimeCell.value = stepOneTime;
      if (stepOneTime !== null) stepOneTimeCell.numFmt = 'hh:mm';
      if (skuTimes.length) {
        const minTime = Math.min(...skuTimes);
        let maxTime = Math.max(...skuTimes);
        while (maxTime < minTime) maxTime += 1;
        const minCell = ws.getCell(`${timeCols[i]}51`);
        const maxCell = ws.getCell(`${timeCols[i]}52`);
        const durationCell = ws.getCell(`${timeCols[i]}53`);
        minCell.value = { formula: `IF(${statusCols[i]}$50>0,MIN(${timeCols[i]}$18:${timeCols[i]}$49),"")`, result: minTime };
        maxCell.value = { formula: `IF(${statusCols[i]}$50>0,MAX(${timeCols[i]}$18:${timeCols[i]}$49),"")`, result: maxTime };
        durationCell.value = { formula: `IFERROR(${timeCols[i]}52-${timeCols[i]}51,"")`, result: maxTime - minTime };
      }
      const cols = defectCols[i];
      for (let d = 0; d < MAX_DEFECTS; d++) {
        const target = 61 + d; const defect = sku?.defects?.[d];
        ws.getCell(`${cols.type}${target}`).value = defectTypeForExport(defect) || null;
        ws.getCell(`${cols.visual}${target}`).value = localizedVisual(defect?.visual) || null;
        const count = defect ? numberOrBlank(defect.count) : '';
        ws.getCell(`${cols.count}${target}`).value = count === '' ? null : count;
        ws.getCell(`${cols.comment}${target}`).value = defect?.comment || null;
      }
      const characteristicText = (sku?.defects || []).slice(0, MAX_DEFECTS).map(defectTypeForExport).filter(Boolean).join(', ');
      ws.getCell(`Y${row}`).value = sku ? { formula: `_xlfn.TEXTJOIN(", ",TRUE,${characteristicRanges[i]})`, result: characteristicText } : null;
    }

    const checklistStart = allChecklistTimes.length ? Math.min(...allChecklistTimes) : null;
    const checklistEnd = allChecklistTimes.length ? Math.max(...allChecklistTimes) : null;
    acceptanceStart = acceptanceStart ?? checklistStart ?? connectionStart;
    acceptanceEnd = acceptanceEnd ?? checklistEnd;
    if (acceptanceStart !== null && acceptanceEnd !== null) while (acceptanceEnd < acceptanceStart) acceptanceEnd += 1;
    if (acceptanceEnd !== null && reportEnd !== null) while (reportEnd < acceptanceEnd) reportEnd += 1;
    const acceptanceDuration = acceptanceStart !== null && acceptanceEnd !== null ? acceptanceEnd - acceptanceStart : null;
    const reportDuration = acceptanceEnd !== null && reportEnd !== null ? reportEnd - acceptanceEnd : null;
    const totalDuration = connectionStart !== null && reportEnd !== null ? reportEnd - connectionStart : null;

    const acceptanceEndCell = ws.getCell('K54'); acceptanceEndCell.value = acceptanceEnd; acceptanceEndCell.numFmt = 'hh:mm';
    const acceptanceStartCell = ws.getCell('K55'); acceptanceStartCell.value = acceptanceStart; acceptanceStartCell.numFmt = 'hh:mm';
    const acceptanceDurationCell = ws.getCell('K56'); acceptanceDurationCell.value = acceptanceDuration; acceptanceDurationCell.numFmt = '[h]:mm';
    ws.getCell('B71').value = 'Время заполнения отчёта';
    const reportDurationCell = ws.getCell('K71'); reportDurationCell.value = reportDuration; reportDurationCell.numFmt = '[h]:mm';
    const totalDurationCell = ws.getCell('K72'); totalDurationCell.value = totalDuration; totalDurationCell.numFmt = '[h]:mm';
    for (let i = 0; i < MAX_SKU; i++) {
      const reportCell = ws.getCell(`AI${5 + i}`);
      reportCell.value = exportState.skus?.[i] && reportDuration !== null ? reportDuration : null;
      reportCell.numFmt = '[h]:mm';
    }
  }

  function promiseWithTimeout(promise, ms, message) { let timer; const timeout = new Promise((_, reject) => { timer = setTimeout(() => reject(new Error(message)), ms); }); return Promise.race([promise, timeout]).finally(() => clearTimeout(timer)); }

  function removeExcelPersonalProperties(xml) {
    return String(xml || '')
      .replace(/<dc:creator(?:\s[^>]*)?>[\s\S]*?<\/dc:creator>/gi, '')
      .replace(/<cp:lastModifiedBy(?:\s[^>]*)?>[\s\S]*?<\/cp:lastModifiedBy>/gi, '')
      .replace(/<cp:lastPrinted(?:\s[^>]*)?>[\s\S]*?<\/cp:lastPrinted>/gi, '');
  }

  async function stripPersonalExcelMetadata(buffer) {
    if (!window.JSZip) return buffer;
    const archive = await window.JSZip.loadAsync(buffer);
    const coreFile = archive.file('docProps/core.xml');
    if (!coreFile) return buffer;
    const coreXml = await coreFile.async('string');
    archive.file('docProps/core.xml', removeExcelPersonalProperties(coreXml));
    return archive.generateAsync({ type: 'arraybuffer', compression: 'DEFLATE', compressionOptions: { level: 6 } });
  }

  async function exportExcelSafeBrowser(exportState, exportType = 'new') {
    if (!window.ExcelJS) throw new Error('Не загрузился модуль ExcelJS.');
    const templateBase64 = exportType === 'old' ? globalThis.OLD_TEMPLATE_XLSX_BASE64 : globalThis.TEMPLATE_XLSX_BASE64;
    if (!templateBase64) throw new Error('Не загрузился Excel-шаблон.');
    const workbook = new ExcelJS.Workbook();
    setExportLoading(true, 'Открываем Excel-шаблон…', 30);
    await promiseWithTimeout(workbook.xlsx.load(base64ToArrayBuffer(templateBase64)), 18000, 'Не удалось открыть Excel-шаблон.');
    if (exportCancelled) return;
    setExportLoading(true, 'Заполняем данные, чек-лист и дефекты…', 62);
    fillExactTemplateWorkbook(workbook, exportState);
    setExportLoading(true, 'Сохраняем таблицу…', 84);
    const out = await promiseWithTimeout(workbook.xlsx.writeBuffer(), 25000, 'Превышено время сохранения Excel.');
    if (exportCancelled) return;
    setExportLoading(true, 'Удаляем сведения об авторе файла…', 92);
    const cleanedOut = await promiseWithTimeout(stripPersonalExcelMetadata(out), 15000, 'Не удалось очистить свойства Excel.');
    if (exportCancelled) return;
    downloadBlob(new Blob([cleanedOut], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }), buildChecklistFilename(state.shipment));
  }

  function sanitizeFilename(value) { return String(value || '').replace(/[\\/:*?"<>|]+/g, '_').replace(/\s+/g, '_').slice(0, 80) || 'файл'; }
  function sanitizeFilenamePart(value) { return String(value || '').replace(/[\\/:*?"<>|]+/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 120); }
  function buildChecklistFilename(shipment = {}) {
    const base = [sanitizeFilenamePart(shipment.supplier), sanitizeFilenamePart(shipment.id)].filter(Boolean).join(' ') || 'Чек-лист';
    return `${base}.xlsx`;
  }
  function downloadBlob(blob, filename) { const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = filename; document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(url), 1600); }
  function toast(message, type = '', duration = 3500) { const container = document.getElementById('toastContainer'); while (container.children.length >= 2) container.firstElementChild?.remove(); const el = document.createElement('div'); el.className = `toast ${type}`; el.textContent = message; container.appendChild(el); setTimeout(() => el.remove(), duration); }

  function openNotes() { state.ui.notesOpen = true; scheduleSave(); updateNotesPanel(); setTimeout(() => notesTextarea.focus(), 0); }
  function updateNotesPanel() {
    notesPanel.classList.toggle('open', state.ui.notesOpen); notesPanel.classList.toggle('minimized', state.ui.notesMinimized);
    document.getElementById('notesPin').classList.toggle('active', state.ui.notesPinned);
    document.getElementById('notesPinStatus').textContent = state.ui.notesPinned ? 'Закреплены' : 'Не закреплены';
    if (document.activeElement !== notesTextarea) notesTextarea.value = state.notes || '';
    if (state.ui.notesPosition && window.innerWidth > 820) { notesPanel.style.left = `${state.ui.notesPosition.x}px`; notesPanel.style.top = `${state.ui.notesPosition.y}px`; notesPanel.style.right = 'auto'; notesPanel.style.bottom = 'auto'; }
  }
  function initNotesDragging() {
    const handle = document.getElementById('notesDragHandle');
    handle.addEventListener('pointerdown', event => { if (event.target.closest('button') || window.innerWidth <= 820 || !state.ui.notesPinned) return; const rect = notesPanel.getBoundingClientRect(); dragState = { x: event.clientX - rect.left, y: event.clientY - rect.top }; handle.setPointerCapture(event.pointerId); });
    handle.addEventListener('pointermove', event => { if (!dragState) return; const x = Math.max(8, Math.min(window.innerWidth - notesPanel.offsetWidth - 8, event.clientX - dragState.x)); const y = Math.max(8, Math.min(window.innerHeight - 56, event.clientY - dragState.y)); notesPanel.style.left = `${x}px`; notesPanel.style.top = `${y}px`; notesPanel.style.right = 'auto'; notesPanel.style.bottom = 'auto'; state.ui.notesPosition = { x, y }; });
    handle.addEventListener('pointerup', event => { if (!dragState) return; dragState = null; try { handle.releasePointerCapture(event.pointerId); } catch (_) {} scheduleSave(); });
  }

  function handleKeydown(event) {
    const el = event.target;
    if (event.key === 'Escape') {
      const workspacePanel = document.getElementById('workspaceBar');
      if (workspacePanel?.classList.contains('open')) { closeWorkspacePanel(); document.getElementById('workspaceToggle')?.focus(); return; }
      const sidebar = document.getElementById('sidebar');
      if (!modalBackdrop.hidden) {
        closeModal();
        return;
      }
      if (sidebar?.classList.contains('open')) {
        sidebar.classList.remove('open');
        document.getElementById('sidebarBackdrop')?.classList.remove('open');
        document.getElementById('menuToggle')?.setAttribute('aria-expanded', 'false');
        document.getElementById('menuToggle')?.focus();
        return;
      }
      if (state.ui.notesOpen) {
        state.ui.notesOpen = false;
        scheduleSave();
        updateNotesPanel();
        return;
      }
    }
    if (el?.dataset?.timeText !== undefined && event.key === 'Enter') {
      event.preventDefault();
      if (commitTimeInput(el, el.value)) el.blur();
    }
  }

  function loadSidebarCollapsed() {
    try { return localStorage.getItem(SIDEBAR_COLLAPSED_KEY) === '1'; } catch (_) { return false; }
  }

  function setSidebarCollapsed(collapsed, persist = true) {
    const value = Boolean(collapsed);
    appShell.classList.toggle('sidebar-collapsed', value);
    const button = document.getElementById('sidebarToggleDesktop');
    if (button) {
      button.setAttribute('aria-expanded', String(!value));
      button.setAttribute('aria-label', value ? 'Показать боковую навигацию' : 'Скрыть боковую навигацию');
      button.title = value ? 'Показать навигацию' : 'Скрыть навигацию';
      button.textContent = value ? '☰' : '⇤';
    }
    if (persist) {
      try { localStorage.setItem(SIDEBAR_COLLAPSED_KEY, value ? '1' : '0'); } catch (_) {}
    }
    queueStickyLayoutUpdate(); scheduleAmbientBrandPosition();
  }

  function bindStaticEvents() {
    document.addEventListener('click', handleClick);
    document.addEventListener('input', handleInput);
    document.addEventListener('change', handleChange);
    document.addEventListener('keydown', handleKeydown);
    ['openNotesTop'].forEach(id => document.getElementById(id)?.addEventListener('click', openNotes));
    document.getElementById('notesClose').addEventListener('click', () => { state.ui.notesOpen = false; scheduleSave(); updateNotesPanel(); });
    document.getElementById('notesMinimize').addEventListener('click', () => { state.ui.notesMinimized = !state.ui.notesMinimized; scheduleSave(); updateNotesPanel(); });
    document.getElementById('notesPin').addEventListener('click', () => { state.ui.notesPinned = !state.ui.notesPinned; scheduleSave(); updateNotesPanel(); });
    document.getElementById('notesTimestamp').addEventListener('click', () => { const stamp = `[${new Date().toLocaleString('ru-RU')}] `; state.notes = `${state.notes || ''}${state.notes ? '\n' : ''}${stamp}`; scheduleSave(); updateNotesPanel(); notesTextarea.focus(); });
    document.getElementById('clearNotes').addEventListener('click', () => { if (confirm('Очистить заметки?')) { state.notes = ''; scheduleSave(); updateNotesPanel(); } });
    document.getElementById('modalClose').addEventListener('click', closeModal);
    modalBackdrop.addEventListener('click', e => { if (e.target === modalBackdrop) closeModal(); });
    document.getElementById('loadingCancel').addEventListener('click', cancelExport);
    ['exportOldTop'].forEach(id => document.getElementById(id)?.addEventListener('click', () => requestExport('old')));
    window.addEventListener('resize', () => { if (window.innerWidth <= 820) { notesPanel.style.left = ''; notesPanel.style.top = ''; notesPanel.style.right = ''; notesPanel.style.bottom = ''; } });
    initNotesDragging();
    setInterval(updateLiveRcClock, 1000);
  }

  bindStaticEvents();
  initAmbientBrand();
  initAuth();
  initStickyLayout();
  if (authenticated) {
    render();
    updateLiveRcClock();
    scheduleAmbientBrandPosition();
  }
})();
