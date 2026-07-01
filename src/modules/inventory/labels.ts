// Labels for i18n integration (ready for vue-i18n migration)
const labels = {
  // Toolbar buttons
  new: 'Nuevo',
  delete: 'Eliminar',
  import: 'Importar',
  export: 'Exportar',

  // DataTable header and content
  manageProducts: 'Manejar Productos',
  search: 'Buscar...',
  sku: 'SKU',
  name: 'Nombre',
  category: 'Categoria',
  reorderLevel: 'Reorder Level',
  actions: '',
  productDescription: 'Descripción del Producto',

  // Pagination
  paginatorTemplate:
    'FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport',
  currentPageReportTemplate: 'Showing {first} to {last} of {totalRecords} products',

  // Dialog headers
  productDetails: 'Detalle del Producto',
  confirm: 'Confirmar',

  // Dialog buttons
  cancel: 'Cancelar',
  save: 'Guardar',
  yes: 'Si',
  no: 'No',

  // Confirmation messages
  confirmDeleteOne: 'Esta seguro que desea eliminar este producto?',
  confirmDeleteMultiple: 'Esta seguro que desea eliminar los {count} productos seleccionados?',

  // Toast messages
  successful: 'Exitoso',
  productCreated: 'Producto Creado',
  productUpdated: 'Producto Actualizado',
  productDeleted: 'Producto Eliminado',
  productsDeleted: 'Productos Eliminados',

  // ── FARMA ACTIVA UI ─────────────────────────────────────────────────
  // App shell
  appName: 'FARMACTIVA',
  appNameFarma: 'FARMA',
  appNameActiva: 'CTIVA',
  appTagline: 'Tu bienestar, nuestra prioridad.',
  navGeneral: 'General',
  navAlerts: 'Alertas',
  alertLowStock: 'Stock bajo',
  alertExpiring: 'Por vencer',
  userName: 'Admin',
  userEmail: 'admin@farmaactiva.com',

  // Sections (sidebar + header titles)
  sectionDashboard: 'Dashboard',
  sectionInventory: 'Inventario',
  sectionOrders: 'Pedidos',
  sectionCustomers: 'Clientes',
  sectionReports: 'Reportes',
  sectionSettings: 'Configuración',
  inventorySubtitle: 'Gestiona el catálogo de productos de tu farmacia',
  sectionUnderConstruction: 'Sección en construcción',
  sectionComingSoon: 'Esta sección estará disponible próximamente',

  // Header actions
  newProduct: 'Nuevo Producto',

  // Stats cards
  statTotal: 'Total Productos',
  statActive: 'En Stock',
  statLow: 'Stock Bajo',
  statOut: 'Sin Stock',

  // Filters
  searchPlaceholder: 'Buscar por nombre, SKU o código…',
  filterAllCategories: 'Todas',
  filterStatus: 'Estado',
  results: 'resultado',
  resultsPlural: 'resultados',

  // Table columns / cells
  colStock: 'Stock',
  colReorderLevel: 'Nivel Reorden',
  colFlags: 'Flags',
  colStatus: 'Estado',
  colProduct: 'Producto',
  colBrand: 'Marca',
  colLaboratory: 'Laboratorio',
  emptyProducts: 'No se encontraron productos',
  showingCount: 'Mostrando {shown} de {total} productos',
  controlledCountOne: '{count} sustancia controlada',
  controlledCountMany: '{count} sustancias controladas',

  // Status labels
  statusActive: 'Activo',
  statusLow: 'Stock bajo',
  statusOut: 'Sin stock',

  // Regulatory flags (short + long)
  flagRx: 'Requiere Rx',
  flagRxShort: 'Rx',
  flagControlled: 'Controlada',
  flagControlledShort: 'SC',

  // Product form (drawer)
  formTitle: 'Nuevo Producto',
  formEditTitle: 'Editar Producto',
  formSubtitle: 'Completa la información del producto',
  fieldSku: 'SKU',
  fieldBarCode: 'Código Barras',
  fieldProductName: 'Nombre del Producto',
  fieldDescription: 'Descripción',
  fieldCategory: 'Categoría',
  fieldBrand: 'Marca',
  fieldLaboratory: 'Laboratorio',
  fieldSanitaryRegistration: 'Registro Sanitario',
  fieldReorderLevel: 'Nivel de Reorden',
  selectCategory: 'Selecciona una categoría',
  selectLaboratory: 'Selecciona un laboratorio',
  regulatoryControl: 'Control Regulatorio',
  prescriptionRequired: 'Requiere Prescripción',
  prescriptionRequiredHint: 'Necesita receta médica',
  controlledSubstance: 'Sustancia Controlada',
  controlledSubstanceHint: 'Control especial sanitario',
  controlledWarning:
    'Las sustancias controladas requieren registro especial conforme a la normativa vigente.',
  saveProduct: 'Guardar Producto',
  required: 'Requerido',
  mustBeNumber: 'Debe ser un número',

  // Placeholders
  phSku: 'MED-001',
  phBarCode: '7501234…',
  phProductName: 'Ej. Ibuprofeno 400mg',
  phDescription: 'Presentación, dosis, indicaciones…',
  phSanitaryRegistration: 'INVIMA 2024M-…',
  phReorderLevel: 'Ej. 50',

  // Success notification
  productAddedToast: '"{name}" agregado exitosamente',
}

// Product categories (from the Figma product form)
export const CATEGORIES: readonly string[] = [
  'Analgésicos',
  'Antibióticos',
  'Antiinflamatorios',
  'Antihipertensivos',
  'Antidiabéticos',
  'Antihistamínicos',
  'Vitaminas y Suplementos',
  'Dermatología',
  'Oftalmología',
  'Gastroenterología',
  'Cardiología',
  'Neurología',
  'Oncología',
  'Material Médico',
  'Cuidado Personal',
  'Otro',
]

export const LABORATORIES: readonly string[] = [
  'ALCOS',
  'ALMAGRAM',
  'ALMOS S.A.',
  'BAGO',
  'CHILE',
  'CHINOIN',
  'COFAR',
  'CRESPAL',
  'DELTA',
  'GADOR',
  'HAHNEMANN',
  'IFA',
  'IFARBO',
  'INDUFAR',
  'INQUIBOL',
  'INTI',
  'LAFAR',
  'LAQFAGAL',
  'LCFARMA SRL',
  'LHUMAT',
  'LIOMONT',
  'LUZA',
  'MEGALABS',
  'MONTPELLIER',
  'NOVOPHARMA',
  'PROCAPS',
  'QUIMIZA',
  'QUINFA',
  'ROSARIO',
  'SAE',
  'SANAT',
  'SAVAL',
  'SAVANT',
  'SIGMA',
  'TERBOL',
  'VITA',
]

export default labels
