import React, { createContext, useContext, useState, ReactNode } from 'react';

// Translation data
const translations = {
  es: {
    // System
    'system.title': 'Sistema de Validaciones',
    'system.subtitle': 'Gestión Farmacéutica',
    
    // Login
    'login.title': 'Sistema de Validaciones',
    'login.email': 'Correo Electrónico',
    'login.password': 'Contraseña',
    'login.button': 'Iniciar Sesión',
    'login.loading': 'Iniciando sesión...',
    'login.success': 'Inicio de sesión exitoso',
    'login.welcome': '¡Bienvenido al sistema!',
    'login.error': 'Error de autenticación',
    'login.logout': 'Cerrar Sesión',
    'login.logoutSuccess': 'Sesión cerrada exitosamente',
    
    // Menu
    'menu.dashboard': 'Dashboard',
    'menu.validations': 'Validaciones',
    'menu.products': 'Productos',
    'menu.equipments': 'Equipos',
    'menu.users': 'Usuarios',
    'menu.settings': 'Configuraciones',
    'menu.security': 'Seguridad',
    
    // Dashboard
    'dashboard.title': 'Panel de Control',
    'dashboard.subtitle': 'Resumen general del sistema',
    'dashboard.access_restricted': 'Acceso Restringido',
    'dashboard.contact_administrator': 'Contacte al administrador para obtener acceso',
    
    // Common
    'common.search': 'Buscar',
    'common.filter': 'Filtrar',
    'common.export': 'Exportar',
    'common.import': 'Importar',
    'common.add': 'Agregar',
    'common.edit': 'Editar',
    'common.delete': 'Eliminar',
    'common.save': 'Guardar',
    'common.cancel': 'Cancelar',
    'common.actions': 'Acciones',
    'common.status': 'Estado',
    'common.date': 'Fecha',
    'common.name': 'Nombre',
    'common.type': 'Tipo',
    'common.description': 'Descripción',
    'common.observations': 'Observaciones',
    'common.all': 'Todos',
    'common.error': 'Error',
    
    // Validations
    'validations.title': 'Gestión de Validaciones',
    'validations.subtitle': 'Administrar validaciones farmacéuticas',
    'validations.list': 'Lista de Validaciones',
    'validations.manage': 'Gestionar validaciones del sistema',
    'validations.new': 'Nueva Validación',
    'validations.validation_code': 'Código de Validación',
    'validations.material_name': 'Nombre del Material',
    'validations.product_code': 'Código de Producto/MP',
    'validations.validation_type': 'Tipo de Validación',
    'validations.subcategory': 'Subcategoría',
    'validations.equipment': 'Equipo',
    'validations.validity_date': 'Fecha de Vigencia',
    'validations.expiry_date': 'Fecha de Vencimiento',
    'validations.material_type': 'Tipo de Material',
    'validations.files': 'Archivos',
    'validations.actions': 'Acciones',
    'validations.search': 'Buscar validaciones...',
    'validations.search_filters': 'Filtros de Búsqueda',
    'validations.clear_filters': 'Limpiar Filtros',
    'validations.select_type': 'Seleccionar tipo',
    'validations.select_subcategory': 'Seleccionar subcategoría',
    'validations.search_by_code': 'Buscar por código',
    'validations.select_equipment': 'Seleccionar equipo',
    'validations.select_status': 'Seleccionar estado',
    'validations.expiry_from': 'Vencimiento desde',
    'validations.expiry_to': 'Vencimiento hasta',
    'validations.no_results': 'No se encontraron resultados',
    'validations.no_validations': 'No hay validaciones registradas',
    'validations.completed': 'Validaciones completadas',
    'validations.next30days': 'Próximos 30 días',
    'validations.immediate': 'Atención inmediata',
    'validations.protocols': 'Protocolos',
    'validations.withDocumentation': 'Con documentación',
    
    // Validation Types
    'validations.processes': 'Procesos',
    'validations.cleaning': 'Limpieza',
    'validations.analytical_methods': 'Métodos Analíticos',
    'validations.computerized_systems': 'Sistemas Computarizados',
    
    // Subcategories
    'validations.manufacturing': 'Fabricación',
    'validations.packaging': 'Empaque',
    'validations.assay': 'Valoración',
    'validations.dissolution': 'Disolución',
    'validations.impurities': 'Impurezas',
    'validations.uniformity': 'Uniformidad de Unidades de Dosificación',
    'validations.identification': 'Identificación',
    'validations.traces': 'Trazas',
    'validations.not_applicable': 'No Aplica',
    'validations.initial_validation': 'Validación Inicial',
    'validations.periodic_revalidation': 'Revalidación Periódica',
    
    // Material Types
    'material_types.raw_material': 'Materia Prima',
    'material_types.packaging_material': 'Empaque o Envase',
    'material_types.finished_product': 'Producto',
    'material_types.bulk': 'Granel',
    
    // Status
    'status.validado': 'Validado',
    'status.en_validacion': 'En Validación',
    'status.proximo': 'Próximo a Vencer',
    'status.vencido': 'Vencido',
    'status.revalidacion': 'En Revalidación',
    'status.por_revalidar': 'Por Revalidar',
    'status.primera_revision': 'Primera Revisión',
    'status.segunda_revision': 'Segunda Revisión',
    'status.success': 'Exitoso',
    'status.failed': 'Fallido',
    'status.warning': 'Advertencia',
    
    // Products
    'products.title': 'Gestión de Productos',
    'products.subtitle': 'Administrar productos y materias primas',
    'products.add': 'Agregar Producto',
    'products.list': 'Lista de Productos',
    'products.validation_type': 'Tipo de Validación',
    'products.subcategory': 'Subcategoría',
    'products.observations': 'Observaciones',
    'products.expiry_date': 'Fecha de Vencimiento',
    'products.product_observations': 'Observaciones del producto',
    
    // Equipments
    'equipments.title': 'Gestión de Equipos',
    'equipments.subtitle': 'Administrar equipos de laboratorio',
    'equipments.add': 'Agregar Equipo',
    'equipments.list': 'Lista de Equipos',
    
    // Users
    'users.title': 'Gestión de Usuarios',
    'users.subtitle': 'Administrar usuarios del sistema',
    'users.list': 'Lista de Usuarios',
    'users.manage': 'Gestionar usuarios y permisos',
    'users.new': 'Nuevo Usuario',
    'users.name': 'Nombre Completo',
    'users.email': 'Correo Electrónico',
    'users.role': 'Rol',
    'users.password': 'Contraseña',
    'users.confirm.password': 'Confirmar Contraseña',
    'users.password.requirements': 'La contraseña debe tener al menos 7 caracteres, 1 mayúscula y 1 símbolo especial',
    'users.password.weak': 'La contraseña no cumple con los requisitos de seguridad',
    'users.password.mismatch': 'Las contraseñas no coinciden',
    'users.created.successfully': 'Usuario creado exitosamente',
    
    // Roles
    'roles.super_administrador': 'Super Administrador',
    'roles.administrador': 'Administrador',
    'roles.coordinador': 'Coordinador',
    'roles.analista': 'Analista',
    'roles.visualizador': 'Visualizador',
    
    // Settings
    'settings.title': 'Configuraciones del Sistema',
    'settings.subtitle': 'Personalizar configuraciones generales',
    
    // Security
    'security.title': 'Configuraciones de Seguridad',
    'security.subtitle': 'Gestionar seguridad y auditoría',
    
    // Stats
    'stats.validations': 'Validaciones',
    'stats.products': 'Productos',
    'stats.expiring': 'Por Vencer',
    'stats.expired': 'Vencidos',
    'stats.validated': 'Validados',
    'stats.total_validations': 'Total de validaciones',
    'stats.registered_products': 'Productos registrados',
    'stats.next_30_days': 'Próximos 30 días',
    
    // Analytics
    'analytics.title': 'Analíticas de Validaciones',
    'analytics.subtitle': 'Análisis detallado de validaciones'
  },
  
  en: {
    // System
    'system.title': 'Validation System',
    'system.subtitle': 'Pharmaceutical Management',
    
    // Login
    'login.title': 'Validation System',
    'login.email': 'Email Address',
    'login.password': 'Password',
    'login.button': 'Sign In',
    'login.loading': 'Signing in...',
    'login.success': 'Login successful',
    'login.welcome': 'Welcome to the system!',
    'login.error': 'Authentication error',
    'login.logout': 'Sign Out',
    'login.logoutSuccess': 'Successfully signed out',
    
    // Menu
    'menu.dashboard': 'Dashboard',
    'menu.validations': 'Validations',
    'menu.products': 'Products',
    'menu.equipments': 'Equipment',
    'menu.users': 'Users',
    'menu.settings': 'Settings',
    'menu.security': 'Security',
    
    // Dashboard
    'dashboard.title': 'Dashboard',
    'dashboard.subtitle': 'System overview',
    'dashboard.access_restricted': 'Access Restricted',
    'dashboard.contact_administrator': 'Contact administrator for access',
    
    // Common
    'common.search': 'Search',
    'common.filter': 'Filter',
    'common.export': 'Export',
    'common.import': 'Import',
    'common.add': 'Add',
    'common.edit': 'Edit',
    'common.delete': 'Delete',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.actions': 'Actions',
    'common.status': 'Status',
    'common.date': 'Date',
    'common.name': 'Name',
    'common.type': 'Type',
    'common.description': 'Description',
    'common.observations': 'Observations',
    'common.all': 'All',
    'common.error': 'Error',
    
    // Validations
    'validations.title': 'Validation Management',
    'validations.subtitle': 'Manage pharmaceutical validations',
    'validations.list': 'Validation List',
    'validations.manage': 'Manage system validations',
    'validations.new': 'New Validation',
    'validations.validation_code': 'Validation Code',
    'validations.material_name': 'Material Name',
    'validations.product_code': 'Product/RM Code',
    'validations.validation_type': 'Validation Type',
    'validations.subcategory': 'Subcategory',
    'validations.equipment': 'Equipment',
    'validations.validity_date': 'Validity Date',
    'validations.expiry_date': 'Expiry Date',
    'validations.material_type': 'Material Type',
    'validations.files': 'Files',
    'validations.actions': 'Actions',
    'validations.search': 'Search validations...',
    'validations.search_filters': 'Search Filters',
    'validations.clear_filters': 'Clear Filters',
    'validations.select_type': 'Select type',
    'validations.select_subcategory': 'Select subcategory',
    'validations.search_by_code': 'Search by code',
    'validations.select_equipment': 'Select equipment',
    'validations.select_status': 'Select status',
    'validations.expiry_from': 'Expiry from',
    'validations.expiry_to': 'Expiry to',
    'validations.no_results': 'No results found',
    'validations.no_validations': 'No validations registered',
    'validations.completed': 'Completed validations',
    'validations.next30days': 'Next 30 days',
    'validations.immediate': 'Immediate attention',
    'validations.protocols': 'Protocols',
    'validations.withDocumentation': 'With documentation',
    
    // Validation Types
    'validations.processes': 'Processes',
    'validations.cleaning': 'Cleaning',
    'validations.analytical_methods': 'Analytical Methods',
    'validations.computerized_systems': 'Computerized Systems',
    
    // Subcategories
    'validations.manufacturing': 'Manufacturing',
    'validations.packaging': 'Packaging',
    'validations.assay': 'Assay',
    'validations.dissolution': 'Dissolution',
    'validations.impurities': 'Impurities',
    'validations.uniformity': 'Uniformity of Dosage Units',
    'validations.identification': 'Identification',
    'validations.traces': 'Traces',
    'validations.not_applicable': 'Not Applicable',
    'validations.initial_validation': 'Initial Validation',
    'validations.periodic_revalidation': 'Periodic Revalidation',
    
    // Material Types
    'material_types.raw_material': 'Raw Material',
    'material_types.packaging_material': 'Packaging Material',
    'material_types.finished_product': 'Finished Product',
    'material_types.bulk': 'Bulk',
    
    // Status
    'status.validado': 'Validated',
    'status.en_validacion': 'In Validation',
    'status.proximo': 'Expiring Soon',
    'status.vencido': 'Expired',
    'status.revalidacion': 'In Revalidation',
    'status.por_revalidar': 'To Revalidate',
    'status.primera_revision': 'First Review',
    'status.segunda_revision': 'Second Review',
    'status.success': 'Success',
    'status.failed': 'Failed',
    'status.warning': 'Warning',
    
    // Products
    'products.title': 'Product Management',
    'products.subtitle': 'Manage products and raw materials',
    'products.add': 'Add Product',
    'products.list': 'Product List',
    'products.validation_type': 'Validation Type',
    'products.subcategory': 'Subcategory',
    'products.observations': 'Observations',
    'products.expiry_date': 'Expiry Date',
    'products.product_observations': 'Product observations',
    
    // Equipments
    'equipments.title': 'Equipment Management',
    'equipments.subtitle': 'Manage laboratory equipment',
    'equipments.add': 'Add Equipment',
    'equipments.list': 'Equipment List',
    
    // Users
    'users.title': 'User Management',
    'users.subtitle': 'Manage system users',
    'users.list': 'User List',
    'users.manage': 'Manage users and permissions',
    'users.new': 'New User',
    'users.name': 'Full Name',
    'users.email': 'Email Address',
    'users.role': 'Role',
    'users.password': 'Password',
    'users.confirm.password': 'Confirm Password',
    'users.password.requirements': 'Password must have at least 7 characters, 1 uppercase and 1 special symbol',
    'users.password.weak': 'Password does not meet security requirements',
    'users.password.mismatch': 'Passwords do not match',
    'users.created.successfully': 'User created successfully',
    
    // Roles
    'roles.super_administrador': 'Super Administrator',
    'roles.administrador': 'Administrator',
    'roles.coordinador': 'Coordinator',
    'roles.analista': 'Analyst',
    'roles.visualizador': 'Viewer',
    
    // Settings
    'settings.title': 'System Settings',
    'settings.subtitle': 'Customize general settings',
    
    // Security
    'security.title': 'Security Settings',
    'security.subtitle': 'Manage security and audit',
    
    // Stats
    'stats.validations': 'Validations',
    'stats.products': 'Products',
    'stats.expiring': 'Expiring',
    'stats.expired': 'Expired',
    'stats.validated': 'Validated',
    'stats.total_validations': 'Total validations',
    'stats.registered_products': 'Registered products',
    'stats.next_30_days': 'Next 30 days',
    
    // Analytics
    'analytics.title': 'System Analytics',
    'analytics.subtitle': 'Detailed validation analysis'
  },
  
  pt: {
    // System
    'system.title': 'Sistema de Validações',
    'system.subtitle': 'Gestão Farmacêutica',
    
    // Login
    'login.title': 'Sistema de Validações',
    'login.email': 'Endereço de Email',
    'login.password': 'Senha',
    'login.button': 'Entrar',
    'login.loading': 'Entrando...',
    'login.success': 'Login realizado com sucesso',
    'login.welcome': 'Bem-vindo ao sistema!',
    'login.error': 'Erro de autenticação',
    'login.logout': 'Sair',
    'login.logoutSuccess': 'Sessão encerrada com sucesso',
    
    // Menu
    'menu.dashboard': 'Painel',
    'menu.validations': 'Validações',
    'menu.products': 'Produtos',
    'menu.equipments': 'Equipamentos',
    'menu.users': 'Usuários',
    'menu.settings': 'Configurações',
    'menu.security': 'Segurança',
    
    // Dashboard
    'dashboard.title': 'Painel de Controle',
    'dashboard.subtitle': 'Visão geral do sistema',
    'dashboard.access_restricted': 'Acesso Restrito',
    'dashboard.contact_administrator': 'Entre em contato com o administrador para obter acesso',
    
    // Common
    'common.search': 'Pesquisar',
    'common.filter': 'Filtrar',
    'common.export': 'Exportar',
    'common.import': 'Importar',
    'common.add': 'Adicionar',
    'common.edit': 'Editar',
    'common.delete': 'Excluir',
    'common.save': 'Salvar',
    'common.cancel': 'Cancelar',
    'common.actions': 'Ações',
    'common.status': 'Status',
    'common.date': 'Data',
    'common.name': 'Nome',
    'common.type': 'Tipo',
    'common.description': 'Descrição',
    'common.observations': 'Observações',
    'common.all': 'Todos',
    'common.error': 'Erro',
    
    // Validations
    'validations.title': 'Gestão de Validações',
    'validations.subtitle': 'Gerenciar validações farmacêuticas',
    'validations.list': 'Lista de Validações',
    'validations.manage': 'Gerenciar validações do sistema',
    'validations.new': 'Nova Validação',
    'validations.validation_code': 'Código de Validação',
    'validations.material_name': 'Nome do Material',
    'validations.product_code': 'Código do Produto/MP',
    'validations.validation_type': 'Tipo de Validação',
    'validations.subcategory': 'Subcategoria',
    'validations.equipment': 'Equipamento',
    'validations.validity_date': 'Data de Validade',
    'validations.expiry_date': 'Data de Vencimento',
    'validations.material_type': 'Tipo de Material',
    'validations.files': 'Arquivos',
    'validations.actions': 'Ações',
    'validations.search': 'Pesquisar validações...',
    'validations.search_filters': 'Filtros de Pesquisa',
    'validations.clear_filters': 'Limpar Filtros',
    'validations.select_type': 'Selecionar tipo',
    'validations.select_subcategory': 'Selecionar subcategoria',
    'validations.search_by_code': 'Pesquisar por código',
    'validations.select_equipment': 'Selecionar equipamento',
    'validations.select_status': 'Selecionar status',
    'validations.expiry_from': 'Vencimento de',
    'validations.expiry_to': 'Vencimento até',
    'validations.no_results': 'Nenhum resultado encontrado',
    'validations.no_validations': 'Nenhuma validação registrada',
    'validations.completed': 'Validações concluídas',
    'validations.next30days': 'Próximos 30 dias',
    'validations.immediate': 'Atenção imediata',
    'validations.protocols': 'Protocolos',
    'validations.withDocumentation': 'Com documentação',
    
    // Validation Types
    'validations.processes': 'Processos',
    'validations.cleaning': 'Limpeza',
    'validations.analytical_methods': 'Métodos Analíticos',
    'validations.computerized_systems': 'Sistemas Computadorizados',
    
    // Subcategories
    'validations.manufacturing': 'Fabricação',
    'validations.packaging': 'Embalagem',
    'validations.assay': 'Valoração',
    'validations.dissolution': 'Dissolução',
    'validations.impurities': 'Impurezas',
    'validations.uniformity': 'Uniformidade de Unidades de Dosagem',
    'validations.identification': 'Identificação',
    'validations.traces': 'Traços',
    'validations.not_applicable': 'Não Aplicável',
    'validations.initial_validation': 'Validação Inicial',
    'validations.periodic_revalidation': 'Revalidação Periódica',
    
    // Material Types
    'material_types.raw_material': 'Matéria Prima',
    'material_types.packaging_material': 'Material de Embalagem',
    'material_types.finished_product': 'Produto Acabado',
    'material_types.bulk': 'Granel',
    
    // Status
    'status.validado': 'Validado',
    'status.en_validacion': 'Em Validação',
    'status.proximo': 'Próximo ao Vencimento',
    'status.vencido': 'Vencido',
    'status.revalidacion': 'Em Revalidação',
    'status.por_revalidar': 'Para Revalidar',
    'status.primera_revision': 'Primeira Revisão',
    'status.segunda_revision': 'Segunda Revisão',
    'status.success': 'Sucesso',
    'status.failed': 'Falhou',
    'status.warning': 'Aviso',
    
    // Products
    'products.title': 'Gestão de Produtos',
    'products.subtitle': 'Gerenciar produtos e matérias-primas',
    'products.add': 'Adicionar Produto',
    'products.list': 'Lista de Produtos',
    'products.validation_type': 'Tipo de Validação',
    'products.subcategory': 'Subcategoria',
    'products.observations': 'Observações',
    'products.expiry_date': 'Data de Vencimento',
    'products.product_observations': 'Observações do produto',
    
    // Equipments
    'equipments.title': 'Gestão de Equipamentos',
    'equipments.subtitle': 'Gerenciar equipamentos de laboratório',
    'equipments.add': 'Adicionar Equipamento',
    'equipments.list': 'Lista de Equipamentos',
    
    // Users
    'users.title': 'Gestão de Usuários',
    'users.subtitle': 'Gerenciar usuários do sistema',
    'users.list': 'Lista de Usuários',
    'users.manage': 'Gerenciar usuários e permissões',
    'users.new': 'Novo Usuário',
    'users.name': 'Nome Completo',
    'users.email': 'Endereço de Email',
    'users.role': 'Função',
    'users.password': 'Senha',
    'users.confirm.password': 'Confirmar Senha',
    'users.password.requirements': 'A senha deve ter pelo menos 7 caracteres, 1 maiúscula e 1 símbolo especial',
    'users.password.weak': 'A senha não atende aos requisitos de segurança',
    'users.password.mismatch': 'As senhas não coincidem',
    'users.created.successfully': 'Usuário criado com sucesso',
    
    // Roles
    'roles.super_administrador': 'Super Administrador',
    'roles.administrador': 'Administrador',
    'roles.coordinador': 'Coordenador',
    'roles.analista': 'Analista',
    'roles.visualizador': 'Visualizador',
    
    // Settings
    'settings.title': 'Configurações do Sistema',
    'settings.subtitle': 'Personalizar configurações gerais',
    
    // Security
    'security.title': 'Configurações de Segurança',
    'security.subtitle': 'Gerenciar segurança e auditoria',
    
    // Stats
    'stats.validations': 'Validações',
    'stats.products': 'Produtos',
    'stats.expiring': 'Vencendo',
    'stats.expired': 'Vencidos',
    'stats.validated': 'Validados',
    'stats.total_validations': 'Total de validações',
    'stats.registered_products': 'Produtos registrados',
    'stats.next_30_days': 'Próximos 30 dias',
    
    // Analytics
    'analytics.title': 'Análises do Sistema',
    'analytics.subtitle': 'Análise detalhada de validações'
  }
};

type Language = 'es' | 'en' | 'pt';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('es');

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations[Language]] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};