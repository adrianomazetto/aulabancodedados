// Course Management System
class CourseManager {
    constructor() {
        this.currentSection = 'home';
        this.lessons = {
            aula1: { title: 'Fundamentos de Banco de Dados', completed: false, progress: 0 },
            aula2: { title: 'Configuração do Supabase', completed: false, progress: 0 },
            aula3: { title: 'Modelagem de Dados', completed: false, progress: 0 },
            aula4: { title: 'SQL Avançado', completed: false, progress: 0 }
        };
        this.init();
    }

    init() {
        this.setupNavigation();
        this.setupMobileMenu();
        this.loadProgress();
        this.loadLessons();
    }

    setupNavigation() {
        // Navigation links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const target = link.getAttribute('href').substring(1);
                this.showSection(target);
            });
        });

        // Lesson cards
        document.querySelectorAll('.lesson-card').forEach(card => {
            card.addEventListener('click', () => {
                const lesson = card.getAttribute('data-lesson');
                this.showSection(lesson);
            });
        });
    }

    setupMobileMenu() {
        const mobileMenuBtn = document.getElementById('mobile-menu-btn');
        const mobileMenu = document.getElementById('mobile-menu');

        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
    }

    showSection(sectionId) {
        // Hide all sections
        document.querySelectorAll('.section').forEach(section => {
            section.classList.add('hidden');
            section.classList.remove('active');
        });

        // Show target section
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.classList.remove('hidden');
            targetSection.classList.add('active');
            this.currentSection = sectionId;

            // Update navigation active state
            this.updateNavigation(sectionId);

            // Load lesson content if needed
            if (sectionId.startsWith('aula')) {
                this.loadLessonContent(sectionId);
            }
        }

        // Close mobile menu
        document.getElementById('mobile-menu').classList.add('hidden');
    }

    updateNavigation(activeSection) {
        document.querySelectorAll('.nav-link').forEach(link => {
            const href = link.getAttribute('href').substring(1);
            if (href === activeSection) {
                link.classList.add('text-primary', 'font-semibold');
                link.classList.remove('text-gray-600');
            } else {
                link.classList.remove('text-primary', 'font-semibold');
                link.classList.add('text-gray-600');
            }
        });
    }

    loadProgress() {
        // Load progress from localStorage
        const savedProgress = localStorage.getItem('courseProgress');
        if (savedProgress) {
            this.lessons = { ...this.lessons, ...JSON.parse(savedProgress) };
        }
        this.updateProgressDisplay();
    }

    saveProgress() {
        localStorage.setItem('courseProgress', JSON.stringify(this.lessons));
        this.updateProgressDisplay();
    }

    updateProgressDisplay() {
        Object.keys(this.lessons).forEach(lessonId => {
            const progressBar = document.querySelector(`[data-lesson="${lessonId.slice(-1)}"]`);
            if (progressBar) {
                const progress = this.lessons[lessonId].progress;
                progressBar.style.width = `${progress}%`;
            }
        });
    }

    markSectionComplete(lessonId, sectionIndex, totalSections) {
        const progress = Math.round(((sectionIndex + 1) / totalSections) * 100);
        this.lessons[lessonId].progress = progress;
        if (progress === 100) {
            this.lessons[lessonId].completed = true;
        }
        this.saveProgress();
    }

    loadLessons() {
        // This will be called to load lesson content dynamically
        this.loadLesson1();
        this.loadLesson2();
        this.loadLesson3();
        this.loadLesson4();
    }

    loadLessonContent(lessonId) {
        const section = document.getElementById(lessonId);
        if (section && section.innerHTML.trim() === '') {
            // Content will be loaded by individual lesson methods
            switch(lessonId) {
                case 'aula1':
                    this.loadLesson1();
                    break;
                case 'aula2':
                    this.loadLesson2();
                    break;
                case 'aula3':
                    this.loadLesson3();
                    break;
                case 'aula4':
                    this.loadLesson4();
                    break;
            }
        }
    }

    createLessonTemplate(title, sections) {
        return `
            <div class="max-w-4xl mx-auto">
                <div class="bg-white rounded-lg shadow-lg p-8 mb-8">
                    <h2 class="text-3xl font-bold text-gray-800 mb-6">${title}</h2>
                    <div class="lesson-content">
                        ${sections.map((section, index) => `
                            <div class="lesson-section mb-8 p-6 border-l-4 border-primary bg-gray-50 rounded-r-lg" data-section="${index}">
                                <h3 class="text-xl font-semibold mb-4 text-primary">${section.title}</h3>
                                <div class="content">${section.content}</div>
                                ${section.practical ? `
                                    <div class="practical-section mt-6 p-4 bg-blue-50 rounded-lg">
                                        <h4 class="font-semibold text-blue-800 mb-2"><i class="fas fa-hands-helping mr-2"></i>Atividade Prática</h4>
                                        <div class="text-blue-700">${section.practical}</div>
                                    </div>
                                ` : ''}
                                <div class="mt-4">
                                    <button class="complete-section-btn bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded transition-colors" 
                                            onclick="courseManager.markSectionComplete('${this.currentSection}', ${index}, ${sections.length})">
                                        <i class="fas fa-check mr-2"></i>Marcar como Concluído
                                    </button>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
                <div class="flex justify-between mt-8">
                    <button onclick="courseManager.showSection('home')" class="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg transition-colors">
                        <i class="fas fa-home mr-2"></i>Voltar ao Início
                    </button>
                    <div class="space-x-4">
                        ${this.getPreviousButton()}
                        ${this.getNextButton()}
                    </div>
                </div>
            </div>
        `;
    }

    getPreviousButton() {
        const lessons = ['home', 'aula1', 'aula2', 'aula3', 'aula4'];
        const currentIndex = lessons.indexOf(this.currentSection);
        if (currentIndex > 1) {
            const prevLesson = lessons[currentIndex - 1];
            return `<button onclick="courseManager.showSection('${prevLesson}')" class="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition-colors">
                        <i class="fas fa-arrow-left mr-2"></i>Aula Anterior
                    </button>`;
        }
        return '';
    }

    getNextButton() {
        const lessons = ['home', 'aula1', 'aula2', 'aula3', 'aula4'];
        const currentIndex = lessons.indexOf(this.currentSection);
        if (currentIndex < lessons.length - 1 && currentIndex > 0) {
            const nextLesson = lessons[currentIndex + 1];
            return `<button onclick="courseManager.showSection('${nextLesson}')" class="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition-colors">
                        Próxima Aula<i class="fas fa-arrow-right ml-2"></i>
                    </button>`;
        }
        return '';
    }

    // Lesson 1: Fundamentos de Banco de Dados
    loadLesson1() {
        const section = document.getElementById('aula1');
        const sections = [
            {
                title: '1. Fundamentos Teóricos',
                content: `
                    <h4 class="text-lg font-semibold mb-3">O que é um Banco de Dados?</h4>
                    <ul class="list-disc list-inside space-y-2 mb-4">
                        <li>Sistema organizado para armazenar, gerenciar e recuperar informações</li>
                        <li>Estrutura que permite acesso eficiente e seguro aos dados</li>
                        <li>Base fundamental para aplicações web modernas</li>
                    </ul>
                    
                    <h4 class="text-lg font-semibold mb-3">Características dos Bancos Relacionais:</h4>
                    <ul class="list-disc list-inside space-y-2 mb-4">
                        <li>Dados organizados em tabelas (relações)</li>
                        <li>Relacionamentos entre tabelas através de chaves</li>
                        <li>Integridade referencial garantida</li>
                        <li>Linguagem SQL padronizada</li>
                        <li>Propriedades ACID (Atomicidade, Consistência, Isolamento, Durabilidade)</li>
                    </ul>
                    
                    ${createInfoBox('Os bancos relacionais são a base da maioria das aplicações web modernas devido à sua confiabilidade e flexibilidade.', 'info')}
                `,
                practical: 'Discuta em grupo: Quais aplicações você usa diariamente que provavelmente utilizam bancos de dados?'
            },
            {
                title: '2. Estrutura de Tabelas e Chaves',
                content: `
                    <h4 class="text-lg font-semibold mb-3">Componentes de uma Tabela:</h4>
                    <div class="grid md:grid-cols-2 gap-4 mb-4">
                        <div class="bg-blue-50 p-4 rounded-lg">
                            <h5 class="font-semibold text-blue-800">Tabela</h5>
                            <p class="text-blue-700">Estrutura que armazena dados em linhas e colunas</p>
                        </div>
                        <div class="bg-green-50 p-4 rounded-lg">
                            <h5 class="font-semibold text-green-800">Linha (Registro)</h5>
                            <p class="text-green-700">Conjunto de dados relacionados</p>
                        </div>
                        <div class="bg-purple-50 p-4 rounded-lg">
                            <h5 class="font-semibold text-purple-800">Coluna (Campo)</h5>
                            <p class="text-purple-700">Atributo específico dos dados</p>
                        </div>
                        <div class="bg-orange-50 p-4 rounded-lg">
                            <h5 class="font-semibold text-orange-800">Tipo de Dados</h5>
                            <p class="text-orange-700">Define o formato dos valores (TEXT, INTEGER, BOOLEAN, etc.)</p>
                        </div>
                    </div>
                    
                    <h4 class="text-lg font-semibold mb-3">Chaves Primárias:</h4>
                    <ul class="list-disc list-inside space-y-2 mb-4">
                        <li>Identificador único para cada registro</li>
                        <li>Não pode ser nula ou duplicada</li>
                        <li>Garante integridade da entidade</li>
                        <li>Exemplo: <code class="bg-gray-200 px-2 py-1 rounded">id UUID PRIMARY KEY</code></li>
                    </ul>
                `,
                practical: 'Identifique as chaves primárias que você usaria para tabelas de: usuários, produtos, pedidos.'
            },
            {
                title: '3. Comandos SQL Básicos',
                content: `
                    <h4 class="text-lg font-semibold mb-3">SELECT - Consultar Dados</h4>
                    ${createCodeBlock(`-- Sintaxe básica
SELECT coluna1, coluna2 FROM tabela WHERE condição;

-- Exemplos
SELECT * FROM produtos;
SELECT nome, preco FROM produtos WHERE preco > 10;
SELECT nome FROM produtos ORDER BY preco DESC;`)}
                    
                    <h4 class="text-lg font-semibold mb-3 mt-6">INSERT - Inserir Dados</h4>
                    ${createCodeBlock(`-- Sintaxe básica
INSERT INTO tabela (coluna1, coluna2) VALUES (valor1, valor2);

-- Exemplos
INSERT INTO produtos (nome, preco, categoria) VALUES ('Pão Francês', 0.50, 'Pães');
INSERT INTO produtos (nome, preco, categoria) VALUES 
  ('Bolo de Chocolate', 25.00, 'Bolos'),
  ('Croissant', 3.50, 'Pães');`)}
                    
                    <h4 class="text-lg font-semibold mb-3 mt-6">UPDATE e DELETE</h4>
                    ${createCodeBlock(`-- UPDATE - Atualizar dados
UPDATE produtos SET preco = 0.60 WHERE nome = 'Pão Francês';

-- DELETE - Excluir dados
DELETE FROM produtos WHERE preco < 1.00;`)}
                `,
                practical: 'Pratique escrevendo consultas SQL para: listar todos os produtos, buscar produtos por categoria, atualizar preços.'
            },
            {
                title: '4. Criando Conta no Supabase',
                content: `
                    <h4 class="text-lg font-semibold mb-3">Passo a Passo:</h4>
                    <div class="space-y-4">
                        <div class="flex items-start space-x-3">
                            <div class="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">1</div>
                            <div>
                                <h5 class="font-semibold">Registro</h5>
                                <p>Acesse <a href="https://supabase.com" target="_blank" class="text-blue-600 hover:underline">supabase.com</a> e clique em "Start your project"</p>
                            </div>
                        </div>
                        <div class="flex items-start space-x-3">
                            <div class="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">2</div>
                            <div>
                                <h5 class="font-semibold">Criar Projeto</h5>
                                <p>Configure: Nome: "Padaria Sistema", Região: South America (São Paulo)</p>
                            </div>
                        </div>
                        <div class="flex items-start space-x-3">
                            <div class="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">3</div>
                            <div>
                                <h5 class="font-semibold">Explorar Dashboard</h5>
                                <p>Familiarize-se com Table Editor, SQL Editor, Authentication e API</p>
                            </div>
                        </div>
                    </div>
                    
                    ${createInfoBox('Anote sua senha do banco de dados! Você precisará dela para conexões futuras.', 'warning')}
                `,
                practical: 'Crie sua conta no Supabase e explore as diferentes seções do dashboard. Anote as informações do seu projeto.'
            },
            {
                title: '5. Projeto Prático - Sistema de Padaria',
                content: `
                    <h4 class="text-lg font-semibold mb-3">Cenário do Negócio:</h4>
                    <p class="mb-4">A Padaria "Pão Dourado" precisa de um sistema para gerenciar produtos, controlando estoque, preços e categorias.</p>
                    
                    <h4 class="text-lg font-semibold mb-3">Estrutura da Tabela Produtos:</h4>
                    ${createCodeBlock(`CREATE TABLE produtos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome VARCHAR(100) NOT NULL,
    categoria VARCHAR(50) NOT NULL,
    preco DECIMAL(10,2) NOT NULL,
    estoque INTEGER DEFAULT 0,
    descricao TEXT,
    ativo BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);`)}
                    
                    <h4 class="text-lg font-semibold mb-3 mt-6">Inserindo Dados de Exemplo:</h4>
                    ${createCodeBlock(`INSERT INTO produtos (nome, categoria, preco, estoque, descricao) VALUES
-- Pães
('Pão Francês', 'Pães', 0.50, 100, 'Pão tradicional crocante'),
('Pão de Forma', 'Pães', 4.50, 20, 'Pão de forma integral'),
('Croissant', 'Pães', 3.50, 15, 'Croissant folhado'),

-- Bolos
('Bolo de Chocolate', 'Bolos', 25.00, 5, 'Bolo de chocolate com cobertura'),
('Bolo de Cenoura', 'Bolos', 20.00, 8, 'Bolo de cenoura com chocolate'),

-- Doces
('Brigadeiro', 'Doces', 2.50, 50, 'Brigadeiro gourmet'),
('Pudim', 'Doces', 8.00, 10, 'Pudim de leite condensado');`)}
                `,
                practical: 'Crie a tabela produtos no seu projeto Supabase usando o Table Editor ou SQL Editor. Insira os dados de exemplo e explore os resultados.'
            },
            {
                title: '6. Exercícios Práticos',
                content: `
                    <h4 class="text-lg font-semibold mb-3">Consultas para Praticar:</h4>
                    
                    <div class="space-y-4">
                        <div class="bg-gray-50 p-4 rounded-lg">
                            <h5 class="font-semibold mb-2">Exercício 1: Listar produtos por categoria</h5>
                            ${createCodeBlock(`SELECT nome, preco FROM produtos WHERE categoria = 'Pães';`)}
                        </div>
                        
                        <div class="bg-gray-50 p-4 rounded-lg">
                            <h5 class="font-semibold mb-2">Exercício 2: Produtos ordenados por preço</h5>
                            ${createCodeBlock(`SELECT nome, categoria, preco FROM produtos ORDER BY preco DESC;`)}
                        </div>
                        
                        <div class="bg-gray-50 p-4 rounded-lg">
                            <h5 class="font-semibold mb-2">Exercício 3: Produtos em estoque baixo</h5>
                            ${createCodeBlock(`SELECT nome, estoque FROM produtos WHERE estoque < 20;`)}
                        </div>
                        
                        <div class="bg-gray-50 p-4 rounded-lg">
                            <h5 class="font-semibold mb-2">Exercício 4: Contar produtos por categoria</h5>
                            ${createCodeBlock(`SELECT categoria, COUNT(*) as total 
FROM produtos 
GROUP BY categoria;`)}
                        </div>
                    </div>
                    
                    ${createInfoBox('Execute cada consulta no SQL Editor do Supabase e observe os resultados. Experimente modificar as condições!', 'success')}
                `,
                practical: 'Execute todas as consultas no seu projeto Supabase. Crie 3 consultas adicionais próprias para explorar os dados.'
            },
            {
                title: '7. Desafio Final - Relacionamentos',
                content: `
                    <h4 class="text-lg font-semibold mb-3">Expandindo o Sistema:</h4>
                    <p class="mb-4">Vamos criar uma tabela de categorias separada e estabelecer relacionamento com produtos.</p>
                    
                    <h5 class="font-semibold mb-2">Passo 1: Criar tabela categorias</h5>
                    ${createCodeBlock(`CREATE TABLE categorias (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome VARCHAR(50) UNIQUE NOT NULL,
    descricao TEXT,
    ativo BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);`)}
                    
                    <h5 class="font-semibold mb-2 mt-4">Passo 2: Inserir categorias</h5>
                    ${createCodeBlock(`INSERT INTO categorias (nome, descricao) VALUES
('Pães', 'Produtos de panificação'),
('Bolos', 'Bolos e tortas'),
('Doces', 'Doces e sobremesas'),
('Bebidas', 'Sucos e cafés');`)}
                    
                    <h5 class="font-semibold mb-2 mt-4">Passo 3: Consulta com JOIN</h5>
                    ${createCodeBlock(`SELECT 
    p.nome as produto,
    c.nome as categoria,
    p.preco,
    p.estoque
FROM produtos p
JOIN categorias c ON p.categoria_id = c.id
WHERE p.ativo = true
ORDER BY c.nome, p.nome;`)}
                    
                    ${createInfoBox('Este é um exemplo de normalização de dados - separamos as categorias em uma tabela própria para evitar redundância.', 'info')}
                `,
                practical: 'Implemente o sistema de categorias no seu projeto. Crie a tabela, insira os dados e teste a consulta com JOIN.'
            }
        ];
        
        section.innerHTML = this.createLessonTemplate('Aula 1: Fundamentos de Banco de Dados', sections);
    }

    loadLesson2() {
        const section = document.getElementById('aula2');
        const sections = [
            {
                title: '1. Dashboard do Supabase',
                content: `
                    <h4 class="text-lg font-semibold mb-3">Navegação Principal</h4>
                    <p class="mb-3">O dashboard do Supabase é organizado em seções principais:</p>
                    <ul class="space-y-2 text-gray-700 mb-4">
                        <li><strong>🏠 Home:</strong> Visão geral do projeto e métricas</li>
                        <li><strong>📊 Table Editor:</strong> Interface visual para gerenciar tabelas</li>
                        <li><strong>🔍 SQL Editor:</strong> Editor para executar comandos SQL</li>
                        <li><strong>🔐 Authentication:</strong> Gerenciamento de usuários</li>
                        <li><strong>📁 Storage:</strong> Armazenamento de arquivos</li>
                        <li><strong>⚙️ Settings:</strong> Configurações do projeto</li>
                    </ul>
                    
                    <h4 class="text-lg font-semibold mb-3">Métricas e Monitoramento</h4>
                    <div class="bg-gray-50 p-4 rounded-lg">
                        <p class="mb-3">Na página inicial você encontra:</p>
                        <ul class="space-y-2 text-gray-700">
                            <li>• <strong>Database Size:</strong> Tamanho atual do banco</li>
                            <li>• <strong>API Requests:</strong> Número de requisições</li>
                            <li>• <strong>Active Users:</strong> Usuários ativos</li>
                            <li>• <strong>Storage Used:</strong> Espaço de armazenamento usado</li>
                        </ul>
                    </div>
                `,
                practical: 'Explore o dashboard do seu projeto Supabase e identifique cada seção mencionada.'
            },
            {
                title: '2. Criação de Projeto - Sistema Lanchonete',
                content: `
                    ${createInfoBox('Vamos criar um sistema para uma lanchonete que precisa gerenciar: cadastro de clientes, cardápio de produtos, pedidos e itens, controle de status.', 'info')}
                    
                    <h4 class="text-lg font-semibold mb-3">Passo a Passo</h4>
                    <div class="space-y-4">
                        <div class="border-l-4 border-green-400 pl-4">
                            <h5 class="font-semibold">1. Criar Novo Projeto</h5>
                            <p class="text-gray-600">• Acesse o dashboard do Supabase</p>
                            <p class="text-gray-600">• Clique em "New Project"</p>
                            <p class="text-gray-600">• Nome: "Sistema Lanchonete"</p>
                            <p class="text-gray-600">• Escolha uma senha forte para o banco</p>
                        </div>
                        
                        <div class="border-l-4 border-blue-400 pl-4">
                            <h5 class="font-semibold">2. Configurar Projeto</h5>
                            <p class="text-gray-600">• Aguarde a criação (1-2 minutos)</p>
                            <p class="text-gray-600">• Anote a URL do projeto</p>
                            <p class="text-gray-600">• Anote as chaves de API</p>
                        </div>
                    </div>
                `,
                practical: 'Crie um novo projeto no Supabase chamado "Sistema Lanchonete" e anote todas as informações de configuração.'
            },
            {
                title: '3. Table Editor e SQL Editor',
                content: `
                    <h4 class="text-lg font-semibold mb-3">Criação da Tabela Clientes</h4>
                    <p class="mb-3"><strong>Via Table Editor:</strong></p>
                    <ol class="space-y-2 text-gray-700 mb-4">
                        <li>1. Acesse <strong>Table Editor</strong></li>
                        <li>2. Clique "Create a new table"</li>
                        <li>3. Nome: <code class="bg-gray-200 px-2 py-1 rounded">clientes</code></li>
                        <li>4. Habilite RLS (Row Level Security)</li>
                        <li>5. Configure as colunas: id (uuid), nome (varchar), email (varchar), telefone (varchar), endereco (text), ativo (boolean)</li>
                    </ol>
                    
                    <h4 class="text-lg font-semibold mb-3">Criação via SQL Editor</h4>
                    <p class="mb-3">Para tabelas mais complexas, use o SQL Editor:</p>
                    
                    ${createCodeBlock(`-- Criar tabela de pedidos
CREATE TABLE pedidos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cliente_id UUID NOT NULL REFERENCES clientes(id) ON DELETE CASCADE,
    data_pedido TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status VARCHAR(20) DEFAULT 'pendente' 
        CHECK (status IN ('pendente', 'preparando', 'pronto', 'entregue', 'cancelado')),
    total DECIMAL(10,2) NOT NULL DEFAULT 0,
    observacoes TEXT,
    tempo_estimado INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);`)}
                    
                    ${createInfoBox('Dica: O SQL Editor permite salvar queries, executar comandos em lote e exportar resultados.', 'success')}
                `,
                practical: 'Crie a tabela clientes usando o Table Editor e a tabela pedidos usando o SQL Editor.'
            },
            {
                title: '4. Row Level Security (RLS)',
                content: `
                    ${createInfoBox('Row Level Security é um sistema que controla quais registros cada usuário pode acessar, baseado em políticas de segurança. É essencial para proteger dados sensíveis.', 'warning')}
                    
                    <h4 class="text-lg font-semibold mb-3">Habilitando RLS</h4>
                    ${createCodeBlock(`-- Habilitar RLS em todas as tabelas
ALTER TABLE clientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE produtos ENABLE ROW LEVEL SECURITY;
ALTER TABLE pedidos ENABLE ROW LEVEL SECURITY;`)}
                    
                    <h4 class="text-lg font-semibold mb-3">Criando Políticas</h4>
                    <p class="mb-3">Exemplo: Clientes podem ver apenas seus próprios dados</p>
                    
                    ${createCodeBlock(`-- Política para clientes verem apenas seus próprios dados
CREATE POLICY "Clientes podem ver próprios dados" ON clientes
    FOR SELECT USING (auth.uid() = id);

-- Produtos visíveis para todos
CREATE POLICY "Produtos visíveis para todos" ON produtos
    FOR SELECT USING (disponivel = true);`)}
                    
                    ${createInfoBox('Benefícios do RLS: Segurança automática na API, isolamento de dados por usuário, controle granular de acesso, proteção contra vazamentos de dados.', 'success')}
                `,
                practical: 'Habilite RLS nas suas tabelas e crie políticas básicas de segurança.'
            },
            {
                title: '5. Projeto Prático - Dados da Lanchonete',
                content: `
                    <h4 class="text-lg font-semibold mb-3">Inserindo Dados de Exemplo</h4>
                    <p class="mb-3">Vamos popular o sistema com dados realistas:</p>
                    
                    ${createCodeBlock(`-- Inserir clientes
INSERT INTO clientes (nome, email, telefone, endereco) VALUES
('João Silva', 'joao@email.com', '11999999999', 'Rua A, 123'),
('Maria Santos', 'maria@email.com', '11888888888', 'Rua B, 456'),
('Pedro Costa', 'pedro@email.com', '11777777777', 'Rua C, 789');

-- Inserir produtos do cardápio
INSERT INTO produtos (nome, categoria, preco, descricao, tempo_preparo) VALUES
('X-Burger', 'Lanches', 15.90, 'Hambúrguer, queijo, alface, tomate', 20),
('X-Bacon', 'Lanches', 18.90, 'Hambúrguer, bacon, queijo, alface, tomate', 22),
('Coca-Cola', 'Bebidas', 5.50, 'Refrigerante 350ml', 2),
('Batata Frita', 'Porções', 12.90, 'Batata frita crocante', 15);`)}
                    
                    <h4 class="text-lg font-semibold mb-3">Consultas Essenciais</h4>
                    ${createCodeBlock(`-- Cardápio completo por categoria
SELECT categoria, nome, descricao, preco, tempo_preparo
FROM produtos 
WHERE disponivel = true 
ORDER BY categoria, preco;

-- Pedidos do cliente
SELECT p.id, p.data_pedido, p.status, p.total
FROM pedidos p
WHERE p.cliente_id = '[ID_DO_CLIENTE]'
ORDER BY p.data_pedido DESC;`)}
                `,
                practical: 'Insira os dados de exemplo no seu projeto e execute as consultas para verificar os resultados.'
            },
            {
                title: '6. Integração com Frontend',
                content: `
                    <h4 class="text-lg font-semibold mb-3">Configuração do Cliente JavaScript</h4>
                    ${createCodeBlock(`// Instalação
npm install @supabase/supabase-js

// Configuração
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://[project-id].supabase.co'
const supabaseKey = '[anon-key]'

const supabase = createClient(supabaseUrl, supabaseKey)`, 'javascript')}
                    
                    <h4 class="text-lg font-semibold mb-3">Exemplos de Uso</h4>
                    ${createCodeBlock(`// Listar produtos disponíveis
const { data: produtos, error } = await supabase
  .from('produtos')
  .select('*')
  .eq('disponivel', true)
  .order('categoria')

// Criar novo pedido
const { data: pedido, error } = await supabase
  .from('pedidos')
  .insert({
    cliente_id: user.id,
    total: 34.80,
    observacoes: 'Sem cebola'
  })
  .select()`, 'javascript')}
                    
                    ${createInfoBox('O Supabase gera automaticamente uma API REST completa baseada no seu esquema de banco de dados.', 'info')}
                `,
                practical: 'Configure o cliente JavaScript do Supabase e teste algumas operações básicas de CRUD.'
            }
        ];
        
        section.innerHTML = this.createLessonTemplate('Aula 2: Configuração e Uso do Supabase', sections);
    }

    loadLesson3() {
        const section = document.getElementById('aula3');
        const sections = [
            {
                title: '1. Princípios de Normalização',
                content: `
                    <div class="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
                        <h4 class="font-semibold text-red-800">⚠️ Problemas da Desnormalização</h4>
                        <ul class="text-red-700 mt-2 space-y-1">
                            <li>• <strong>Redundância:</strong> Dados duplicados em múltiplos locais</li>
                            <li>• <strong>Anomalias de Inserção:</strong> Impossibilidade de inserir dados sem outros</li>
                            <li>• <strong>Anomalias de Atualização:</strong> Necessidade de atualizar em múltiplos locais</li>
                            <li>• <strong>Anomalias de Exclusão:</strong> Perda de informações ao excluir registros</li>
                        </ul>
                    </div>

                    <h3 class="text-xl font-semibold text-gray-700 mb-3">1.1 Primeira Forma Normal (1FN)</h3>
                    <div class="bg-gray-50 p-4 rounded-lg mb-4">
                        <p class="mb-3"><strong>Regras da 1FN:</strong></p>
                        <ul class="space-y-1 text-gray-700">
                            <li>• Cada coluna deve conter valores atômicos (indivisíveis)</li>
                            <li>• Não deve haver grupos repetitivos</li>
                            <li>• Cada registro deve ser único</li>
                            <li>• Ordem dos registros não deve importar</li>
                        </ul>
                    </div>

                    <p class="mb-3"><strong>❌ Problema - Violação da 1FN:</strong></p>
                    ${createCodeBlock(`-- PROBLEMA: Múltiplos valores em uma coluna
CREATE TABLE clientes_problema (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100),
    telefones VARCHAR(255), -- "11999999999, 1188888888, 1177777777"
    enderecos TEXT -- "Rua A, 123; Rua B, 456"
);`)}

                    <p class="mb-3"><strong>✅ Solução - Aplicando 1FN:</strong></p>
                    ${createCodeBlock(`-- SOLUÇÃO: Valores atômicos
CREATE TABLE clientes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE telefones_cliente (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cliente_id UUID REFERENCES clientes(id) ON DELETE CASCADE,
    telefone VARCHAR(20) NOT NULL,
    tipo VARCHAR(20) DEFAULT 'celular' 
        CHECK (tipo IN ('celular', 'residencial', 'comercial')),
    principal BOOLEAN DEFAULT false
);`)}
                `,
                practical: 'Identifique problemas de normalização em uma tabela de funcionários que armazena múltiplos telefones em uma única coluna.'
            },
            {
                title: '2. Segunda e Terceira Forma Normal',
                content: `
                    <h3 class="text-xl font-semibold text-gray-700 mb-3">2.1 Segunda Forma Normal (2FN)</h3>
                    <div class="bg-blue-50 p-4 rounded-lg mb-4">
                        <p class="mb-3"><strong>Regras da 2FN:</strong></p>
                        <ul class="space-y-1 text-blue-700">
                            <li>• Deve estar na 1FN</li>
                            <li>• Todos os atributos não-chave devem depender completamente da chave primária</li>
                            <li>• Elimina dependências parciais</li>
                        </ul>
                    </div>

                    ${createCodeBlock(`-- PROBLEMA: Dependência parcial
CREATE TABLE itens_pedido_problema (
    pedido_id UUID,
    produto_id UUID,
    produto_nome VARCHAR(100), -- Depende apenas de produto_id
    produto_categoria VARCHAR(50), -- Depende apenas de produto_id
    quantidade INTEGER,
    preco_unitario DECIMAL(10,2),
    PRIMARY KEY (pedido_id, produto_id)
);

-- SOLUÇÃO: Separar dependências
CREATE TABLE produtos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome VARCHAR(100) NOT NULL,
    categoria VARCHAR(50) NOT NULL,
    preco DECIMAL(10,2) NOT NULL
);

CREATE TABLE itens_pedido (
    pedido_id UUID,
    produto_id UUID REFERENCES produtos(id),
    quantidade INTEGER NOT NULL,
    preco_unitario DECIMAL(10,2) NOT NULL,
    PRIMARY KEY (pedido_id, produto_id)
);`)}

                    <h3 class="text-xl font-semibold text-gray-700 mb-3">2.2 Terceira Forma Normal (3FN)</h3>
                    <div class="bg-green-50 p-4 rounded-lg mb-4">
                        <p class="mb-3"><strong>Regras da 3FN:</strong></p>
                        <ul class="space-y-1 text-green-700">
                            <li>• Deve estar na 2FN</li>
                            <li>• Não deve haver dependências transitivas</li>
                            <li>• Atributos não-chave não devem depender de outros atributos não-chave</li>
                        </ul>
                    </div>

                    ${createCodeBlock(`-- PROBLEMA: Dependência transitiva
CREATE TABLE funcionarios_problema (
    id UUID PRIMARY KEY,
    nome VARCHAR(100),
    departamento_codigo VARCHAR(10),
    departamento_nome VARCHAR(100), -- Depende de departamento_codigo
    departamento_gerente VARCHAR(100), -- Depende de departamento_codigo
    salario DECIMAL(10,2)
);

-- SOLUÇÃO: Eliminar dependências transitivas
CREATE TABLE departamentos (
    codigo VARCHAR(10) PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    gerente VARCHAR(100),
    orcamento DECIMAL(12,2)
);

CREATE TABLE funcionarios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome VARCHAR(100) NOT NULL,
    departamento_codigo VARCHAR(10) REFERENCES departamentos(codigo),
    salario DECIMAL(10,2),
    data_admissao DATE
);`)}
                `,
                practical: 'Normalize uma tabela de vendas que contém informações redundantes sobre produtos e clientes.'
            },
            {
                title: '3. Relacionamentos e Chaves Estrangeiras',
                content: `
                    <div class="grid md:grid-cols-3 gap-6 mb-6">
                        <div class="bg-blue-50 p-4 rounded-lg">
                            <h4 class="font-semibold text-blue-800 mb-2">1:1 (Um para Um)</h4>
                            <p class="text-blue-700 text-sm mb-2">Cada registro relaciona-se com no máximo um registro de outra tabela</p>
                            <p class="text-blue-600 text-xs">Ex: Usuário ↔ Perfil</p>
                        </div>
                        
                        <div class="bg-green-50 p-4 rounded-lg">
                            <h4 class="font-semibold text-green-800 mb-2">1:N (Um para Muitos)</h4>
                            <p class="text-green-700 text-sm mb-2">Um registro relaciona-se com vários de outra tabela</p>
                            <p class="text-green-600 text-xs">Ex: Cliente → Pedidos</p>
                        </div>
                        
                        <div class="bg-purple-50 p-4 rounded-lg">
                            <h4 class="font-semibold text-purple-800 mb-2">N:N (Muitos para Muitos)</h4>
                            <p class="text-purple-700 text-sm mb-2">Múltiplos registros relacionam-se com múltiplos de outra</p>
                            <p class="text-purple-600 text-xs">Ex: Produtos ↔ Categorias</p>
                        </div>
                    </div>

                    <h3 class="text-xl font-semibold text-gray-700 mb-3">Ações Referenciais</h3>
                    ${createCodeBlock(`-- CASCADE: Excluir pedidos quando cliente for excluído
CREATE TABLE pedidos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cliente_id UUID REFERENCES clientes(id) ON DELETE CASCADE,
    total DECIMAL(10,2)
);

-- RESTRICT: Impedir exclusão de categoria se houver produtos
CREATE TABLE produtos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    categoria_id UUID REFERENCES categorias(id) ON DELETE RESTRICT,
    nome VARCHAR(100)
);

-- SET NULL: Manter pedido mesmo se funcionário for excluído
CREATE TABLE pedidos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    funcionario_id UUID REFERENCES funcionarios(id) ON DELETE SET NULL,
    total DECIMAL(10,2)
);`)}
                `,
                practical: 'Implemente um relacionamento N:N entre produtos e fornecedores com tabela intermediária.'
            },
            {
                title: '4. Índices e Performance',
                content: `
                    <div class="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
                        <h4 class="font-semibold text-yellow-800">💡 O que são Índices?</h4>
                        <p class="text-yellow-700 mt-2">Estruturas de dados que aceleram consultas, funcionam como "índice de livro". Ocupam espaço adicional mas melhoram drasticamente a performance de consultas.</p>
                    </div>

                    <h3 class="text-xl font-semibold text-gray-700 mb-3">Tipos de Índices</h3>
                    ${createCodeBlock(`-- Índice simples
CREATE INDEX idx_produtos_nome ON produtos(nome);
CREATE INDEX idx_pedidos_data ON pedidos(data_pedido);

-- Índice único (garante unicidade)
CREATE UNIQUE INDEX idx_usuarios_email ON usuarios(email);

-- Índice composto (múltiplas colunas)
CREATE INDEX idx_pedidos_cliente_data ON pedidos(cliente_id, data_pedido DESC);

-- Índice parcial (apenas registros que atendem condição)
CREATE INDEX idx_pedidos_ativos ON pedidos(cliente_id) 
WHERE status IN ('pendente', 'processando');

-- Índice funcional
CREATE INDEX idx_clientes_nome_lower ON clientes(LOWER(nome));`)}

                    <h3 class="text-xl font-semibold text-gray-700 mb-3">Análise de Performance</h3>
                    ${createCodeBlock(`-- Analisar plano de execução
EXPLAIN SELECT * FROM pedidos WHERE cliente_id = 'uuid-aqui';

-- Execução real com tempos
EXPLAIN ANALYZE 
SELECT p.*, c.nome 
FROM pedidos p 
JOIN clientes c ON p.cliente_id = c.id 
WHERE p.data_pedido >= '2024-01-01';`)}
                `,
                practical: 'Crie índices apropriados para otimizar consultas frequentes no sistema de sorveteria.'
            },
            {
                title: '5. Projeto Sorveteria - Estrutura Principal',
                content: `
                    <div class="bg-gradient-to-r from-pink-100 to-purple-100 p-4 rounded-lg mb-4">
                        <h4 class="font-semibold text-purple-800 mb-2">🍦 Cenário: Sorveteria "Gelato Delícia"</h4>
                        <p class="text-purple-700 mb-2">Sistema completo para gerenciar catálogo de sabores, vendas, estoque e programa de fidelidade.</p>
                    </div>

                    <h3 class="text-xl font-semibold text-gray-700 mb-3">Tabelas Principais</h3>
                    ${createCodeBlock(`-- Tabela de Sabores
CREATE TABLE sabores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome VARCHAR(100) UNIQUE NOT NULL,
    descricao TEXT,
    categoria VARCHAR(50) NOT NULL 
        CHECK (categoria IN ('tradicional', 'premium', 'diet', 'vegano', 'sazonal')),
    cor_hex VARCHAR(7), -- #FF5733
    disponivel BOOLEAN DEFAULT true,
    custo_producao DECIMAL(8,2),
    calorias_100ml INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Tamanhos
CREATE TABLE tamanhos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome VARCHAR(50) UNIQUE NOT NULL,
    ml INTEGER NOT NULL CHECK (ml > 0),
    preco_base DECIMAL(8,2) NOT NULL CHECK (preco_base > 0),
    multiplicador DECIMAL(4,2) DEFAULT 1.0 CHECK (multiplicador > 0),
    ativo BOOLEAN DEFAULT true
);`)}

                    <h3 class="text-xl font-semibold text-gray-700 mb-3">Sistema de Vendas</h3>
                    ${createCodeBlock(`-- Tabela de Vendas
CREATE TABLE vendas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cliente_id UUID REFERENCES clientes(id) ON DELETE SET NULL,
    data_venda TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    subtotal DECIMAL(10,2) NOT NULL DEFAULT 0,
    desconto DECIMAL(10,2) DEFAULT 0 CHECK (desconto >= 0),
    total DECIMAL(10,2) GENERATED ALWAYS AS (subtotal - desconto) STORED,
    forma_pagamento VARCHAR(20) NOT NULL 
        CHECK (forma_pagamento IN ('dinheiro', 'cartao_debito', 'cartao_credito', 'pix', 'pontos')),
    status VARCHAR(20) DEFAULT 'concluida' 
        CHECK (status IN ('pendente', 'concluida', 'cancelada'))
);

-- Itens da Venda
CREATE TABLE itens_venda (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    venda_id UUID REFERENCES vendas(id) ON DELETE CASCADE,
    sabor_id UUID REFERENCES sabores(id) ON DELETE RESTRICT,
    tamanho_id UUID REFERENCES tamanhos(id) ON DELETE RESTRICT,
    quantidade INTEGER NOT NULL DEFAULT 1 CHECK (quantidade > 0),
    preco_unitario DECIMAL(8,2) NOT NULL CHECK (preco_unitario > 0),
    subtotal DECIMAL(10,2) GENERATED ALWAYS AS (quantidade * preco_unitario) STORED
);`)}
                `,
                practical: 'Implemente as tabelas da sorveteria no seu projeto Supabase e insira dados de exemplo.'
            },
            {
                title: '6. Consultas Avançadas e Views',
                content: `
                    <h3 class="text-xl font-semibold text-gray-700 mb-3">Relatórios de Vendas</h3>
                    ${createCodeBlock(`-- Vendas por Sabor
SELECT 
    s.nome as sabor,
    s.categoria,
    COUNT(iv.id) as qtd_vendida,
    SUM(iv.subtotal) as receita_total,
    AVG(iv.preco_unitario) as preco_medio
FROM itens_venda iv
JOIN sabores s ON iv.sabor_id = s.id
JOIN vendas v ON iv.venda_id = v.id
WHERE v.status = 'concluida'
    AND v.data_venda >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY s.id, s.nome, s.categoria
ORDER BY receita_total DESC;`)}

                    <h3 class="text-xl font-semibold text-gray-700 mb-3">View de Produtos Disponíveis</h3>
                    ${createCodeBlock(`-- View que combina sabores e tamanhos
CREATE VIEW produtos_disponiveis AS
SELECT 
    s.id as sabor_id,
    s.nome as sabor,
    s.categoria,
    t.id as tamanho_id,
    t.nome as tamanho,
    t.ml,
    (t.preco_base * t.multiplicador) as preco,
    s.disponivel,
    s.calorias_100ml
FROM sabores s
CROSS JOIN tamanhos t
WHERE s.disponivel = true AND t.ativo = true
ORDER BY s.categoria, s.nome, t.ml;`)}

                    <h3 class="text-xl font-semibold text-gray-700 mb-3">Análise de Lucratividade</h3>
                    ${createCodeBlock(`SELECT 
    s.nome,
    s.custo_producao,
    AVG(iv.preco_unitario) as preco_medio_venda,
    AVG(iv.preco_unitario) - s.custo_producao as margem_lucro,
    ROUND(((AVG(iv.preco_unitario) - s.custo_producao) / 
           AVG(iv.preco_unitario)) * 100, 2) as margem_percentual
FROM sabores s
JOIN itens_venda iv ON s.id = iv.sabor_id
JOIN vendas v ON iv.venda_id = v.id
WHERE v.status = 'concluida'
GROUP BY s.id, s.nome, s.custo_producao
ORDER BY margem_percentual DESC;`)}
                `,
                practical: 'Crie views úteis para o sistema da sorveteria e execute consultas de análise de vendas.'
            }
        ];
        
        section.innerHTML = this.createLessonTemplate('Aula 3: Modelagem de Dados', sections);
    }

    loadLesson4() {
        const section = document.getElementById('aula4');
        const sections = [
            {
                title: '1. Triggers - Automação de Banco de Dados',
                content: `
                    <div class="bg-blue-50 border-l-4 border-blue-400 p-4 mb-4">
                        <h4 class="font-semibold text-blue-800">💡 O que são Triggers?</h4>
                        <p class="text-blue-700 mt-2">Triggers são procedimentos especiais que executam automaticamente em resposta a eventos específicos no banco de dados (INSERT, UPDATE, DELETE). São ideais para manter integridade, auditoria e automação.</p>
                    </div>

                    <h3 class="text-xl font-semibold text-gray-700 mb-3">Tipos de Triggers</h3>
                    <div class="grid md:grid-cols-2 gap-4 mb-4">
                        <div class="bg-gray-50 p-4 rounded-lg">
                            <h4 class="font-semibold text-gray-800 mb-2">BEFORE Triggers</h4>
                            <ul class="text-gray-700 text-sm space-y-1">
                                <li>• Executam antes da operação</li>
                                <li>• Podem modificar dados antes da inserção</li>
                                <li>• Úteis para validação e formatação</li>
                            </ul>
                        </div>
                        <div class="bg-gray-50 p-4 rounded-lg">
                            <h4 class="font-semibold text-gray-800 mb-2">AFTER Triggers</h4>
                            <ul class="text-gray-700 text-sm space-y-1">
                                <li>• Executam após a operação</li>
                                <li>• Ideais para auditoria e logs</li>
                                <li>• Podem acionar outras operações</li>
                            </ul>
                        </div>
                    </div>

                    <h3 class="text-xl font-semibold text-gray-700 mb-3">Trigger para Auditoria</h3>
                    ${createCodeBlock(`-- Tabela de auditoria
CREATE TABLE auditoria_produtos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    produto_id UUID NOT NULL,
    operacao VARCHAR(10) NOT NULL, -- INSERT, UPDATE, DELETE
    dados_antigos JSONB,
    dados_novos JSONB,
    usuario VARCHAR(100) DEFAULT current_user,
    timestamp_operacao TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Função do trigger
CREATE OR REPLACE FUNCTION fn_auditoria_produtos()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'DELETE' THEN
        INSERT INTO auditoria_produtos (produto_id, operacao, dados_antigos)
        VALUES (OLD.id, 'DELETE', row_to_json(OLD));
        RETURN OLD;
    ELSIF TG_OP = 'UPDATE' THEN
        INSERT INTO auditoria_produtos (produto_id, operacao, dados_antigos, dados_novos)
        VALUES (NEW.id, 'UPDATE', row_to_json(OLD), row_to_json(NEW));
        RETURN NEW;
    ELSIF TG_OP = 'INSERT' THEN
        INSERT INTO auditoria_produtos (produto_id, operacao, dados_novos)
        VALUES (NEW.id, 'INSERT', row_to_json(NEW));
        RETURN NEW;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Criar o trigger
CREATE TRIGGER trigger_auditoria_produtos
    AFTER INSERT OR UPDATE OR DELETE ON produtos
    FOR EACH ROW EXECUTE FUNCTION fn_auditoria_produtos();`)}
                `,
                practical: 'Implemente um trigger de auditoria para a tabela de clientes do seu projeto.'
            },
            {
                title: '2. Funções Personalizadas',
                content: `
                    <div class="bg-green-50 border-l-4 border-green-400 p-4 mb-4">
                        <h4 class="font-semibold text-green-800">🔧 Vantagens das Funções</h4>
                        <ul class="text-green-700 mt-2 space-y-1">
                            <li>• Reutilização de código complexo</li>
                            <li>• Encapsulamento de lógica de negócio</li>
                            <li>• Melhor performance para operações repetitivas</li>
                            <li>• Facilita manutenção e padronização</li>
                        </ul>
                    </div>

                    <h3 class="text-xl font-semibold text-gray-700 mb-3">Função para Cálculo de Desconto</h3>
                    ${createCodeBlock(`-- Função para calcular desconto baseado no valor total
CREATE OR REPLACE FUNCTION calcular_desconto(
    valor_total DECIMAL(10,2),
    tipo_cliente VARCHAR(20) DEFAULT 'regular'
)
RETURNS DECIMAL(10,2) AS $$
DECLARE
    percentual_desconto DECIMAL(5,2) := 0;
BEGIN
    -- Desconto por valor
    IF valor_total >= 1000 THEN
        percentual_desconto := 15;
    ELSIF valor_total >= 500 THEN
        percentual_desconto := 10;
    ELSIF valor_total >= 200 THEN
        percentual_desconto := 5;
    END IF;
    
    -- Desconto adicional por tipo de cliente
    CASE tipo_cliente
        WHEN 'vip' THEN
            percentual_desconto := percentual_desconto + 5;
        WHEN 'funcionario' THEN
            percentual_desconto := percentual_desconto + 10;
        ELSE
            -- Cliente regular, sem desconto adicional
    END CASE;
    
    -- Limitar desconto máximo a 25%
    IF percentual_desconto > 25 THEN
        percentual_desconto := 25;
    END IF;
    
    RETURN ROUND(valor_total * percentual_desconto / 100, 2);
END;
$$ LANGUAGE plpgsql;

-- Exemplo de uso
SELECT calcular_desconto(750.00, 'vip') as desconto; -- Retorna 112.50`)}

                    <h3 class="text-xl font-semibold text-gray-700 mb-3">Função para Relatório de Vendas</h3>
                    ${createCodeBlock(`-- Função que retorna relatório de vendas por período
CREATE OR REPLACE FUNCTION relatorio_vendas(
    data_inicio DATE,
    data_fim DATE
)
RETURNS TABLE (
    produto_nome VARCHAR(100),
    categoria VARCHAR(50),
    quantidade_vendida BIGINT,
    receita_total DECIMAL(12,2),
    ticket_medio DECIMAL(10,2)
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.nome,
        p.categoria,
        SUM(iv.quantidade)::BIGINT,
        SUM(iv.subtotal),
        AVG(iv.preco_unitario)
    FROM itens_venda iv
    JOIN produtos p ON iv.produto_id = p.id
    JOIN vendas v ON iv.venda_id = v.id
    WHERE v.data_venda::DATE BETWEEN data_inicio AND data_fim
        AND v.status = 'concluida'
    GROUP BY p.id, p.nome, p.categoria
    ORDER BY SUM(iv.subtotal) DESC;
END;
$$ LANGUAGE plpgsql;

-- Exemplo de uso
SELECT * FROM relatorio_vendas('2024-01-01', '2024-01-31');`)}
                `,
                practical: 'Crie uma função que calcule o ticket médio de vendas por cliente em um período específico.'
            },
            {
                title: '3. Views Materializadas',
                content: `
                    <div class="bg-purple-50 border-l-4 border-purple-400 p-4 mb-4">
                        <h4 class="font-semibold text-purple-800">⚡ Views Materializadas vs Views Normais</h4>
                        <div class="grid md:grid-cols-2 gap-4 mt-3">
                            <div>
                                <p class="font-semibold text-purple-700 mb-1">Views Normais:</p>
                                <ul class="text-purple-600 text-sm space-y-1">
                                    <li>• Executam query a cada consulta</li>
                                    <li>• Sempre dados atualizados</li>
                                    <li>• Podem ser lentas para consultas complexas</li>
                                </ul>
                            </div>
                            <div>
                                <p class="font-semibold text-purple-700 mb-1">Views Materializadas:</p>
                                <ul class="text-purple-600 text-sm space-y-1">
                                    <li>• Armazenam resultado fisicamente</li>
                                    <li>• Consultas muito rápidas</li>
                                    <li>• Precisam ser atualizadas manualmente</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <h3 class="text-xl font-semibold text-gray-700 mb-3">Dashboard de Vendas</h3>
                    ${createCodeBlock(`-- View materializada para dashboard de vendas
CREATE MATERIALIZED VIEW mv_dashboard_vendas AS
SELECT 
    DATE_TRUNC('day', v.data_venda) as data,
    COUNT(DISTINCT v.id) as total_vendas,
    COUNT(DISTINCT v.cliente_id) as clientes_unicos,
    SUM(v.total) as receita_total,
    AVG(v.total) as ticket_medio,
    SUM(iv.quantidade) as itens_vendidos
FROM vendas v
JOIN itens_venda iv ON v.id = iv.venda_id
WHERE v.status = 'concluida'
    AND v.data_venda >= CURRENT_DATE - INTERVAL '90 days'
GROUP BY DATE_TRUNC('day', v.data_venda)
ORDER BY data DESC;

-- Criar índice para melhor performance
CREATE UNIQUE INDEX idx_mv_dashboard_vendas_data ON mv_dashboard_vendas(data);

-- Atualizar a view materializada
REFRESH MATERIALIZED VIEW mv_dashboard_vendas;`)}

                    <h3 class="text-xl font-semibold text-gray-700 mb-3">Ranking de Produtos</h3>
                    ${createCodeBlock(`-- View materializada para ranking de produtos
CREATE MATERIALIZED VIEW mv_ranking_produtos AS
SELECT 
    p.id,
    p.nome,
    p.categoria,
    COUNT(iv.id) as vezes_vendido,
    SUM(iv.quantidade) as quantidade_total,
    SUM(iv.subtotal) as receita_total,
    AVG(iv.preco_unitario) as preco_medio,
    RANK() OVER (ORDER BY SUM(iv.subtotal) DESC) as ranking_receita,
    RANK() OVER (ORDER BY SUM(iv.quantidade) DESC) as ranking_quantidade
FROM produtos p
LEFT JOIN itens_venda iv ON p.id = iv.produto_id
LEFT JOIN vendas v ON iv.venda_id = v.id AND v.status = 'concluida'
WHERE v.data_venda >= CURRENT_DATE - INTERVAL '30 days' OR v.data_venda IS NULL
GROUP BY p.id, p.nome, p.categoria
ORDER BY receita_total DESC NULLS LAST;`)}
                `,
                practical: 'Crie uma view materializada que mostre os produtos mais vendidos por categoria nos últimos 30 dias.'
            },
            {
                title: '4. Projeto Papelaria - Estrutura Completa',
                content: `
                    <div class="bg-gradient-to-r from-orange-100 to-red-100 p-4 rounded-lg mb-4">
                        <h4 class="font-semibold text-red-800 mb-2">📚 Cenário: Papelaria "Papel & Cia"</h4>
                        <p class="text-red-700 mb-2">Sistema completo para gerenciar produtos escolares e de escritório, com controle de estoque, vendas e relatórios automatizados.</p>
                    </div>

                    <h3 class="text-xl font-semibold text-gray-700 mb-3">Estrutura Principal</h3>
                    ${createCodeBlock(`-- Tabela de Categorias
CREATE TABLE categorias (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome VARCHAR(100) UNIQUE NOT NULL,
    descricao TEXT,
    margem_lucro_padrao DECIMAL(5,2) DEFAULT 30.00,
    ativo BOOLEAN DEFAULT true
);

-- Tabela de Fornecedores
CREATE TABLE fornecedores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome VARCHAR(200) NOT NULL,
    cnpj VARCHAR(18) UNIQUE,
    email VARCHAR(255),
    telefone VARCHAR(20),
    endereco JSONB,
    prazo_entrega_dias INTEGER DEFAULT 7,
    ativo BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Produtos
CREATE TABLE produtos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    codigo_barras VARCHAR(50) UNIQUE,
    nome VARCHAR(200) NOT NULL,
    descricao TEXT,
    categoria_id UUID REFERENCES categorias(id),
    fornecedor_id UUID REFERENCES fornecedores(id),
    custo_compra DECIMAL(10,2) NOT NULL CHECK (custo_compra > 0),
    preco_venda DECIMAL(10,2) NOT NULL CHECK (preco_venda > 0),
    estoque_atual INTEGER DEFAULT 0 CHECK (estoque_atual >= 0),
    estoque_minimo INTEGER DEFAULT 5,
    estoque_maximo INTEGER DEFAULT 100,
    data_validade DATE,
    ativo BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);`)}

                    <h3 class="text-xl font-semibold text-gray-700 mb-3">Sistema de Vendas</h3>
                    ${createCodeBlock(`-- Tabela de Vendas
CREATE TABLE vendas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    numero_venda SERIAL UNIQUE,
    cliente_id UUID REFERENCES clientes(id),
    funcionario_id UUID REFERENCES funcionarios(id),
    data_venda TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    subtotal DECIMAL(12,2) NOT NULL DEFAULT 0,
    desconto_percentual DECIMAL(5,2) DEFAULT 0 CHECK (desconto_percentual >= 0 AND desconto_percentual <= 100),
    desconto_valor DECIMAL(10,2) GENERATED ALWAYS AS (subtotal * desconto_percentual / 100) STORED,
    total DECIMAL(12,2) GENERATED ALWAYS AS (subtotal - (subtotal * desconto_percentual / 100)) STORED,
    forma_pagamento VARCHAR(30) NOT NULL CHECK (forma_pagamento IN ('dinheiro', 'cartao_debito', 'cartao_credito', 'pix', 'boleto', 'crediario')),
    parcelas INTEGER DEFAULT 1 CHECK (parcelas > 0),
    status VARCHAR(20) DEFAULT 'concluida' CHECK (status IN ('pendente', 'concluida', 'cancelada', 'devolvida')),
    observacoes TEXT
);

-- Tabela de Itens da Venda
CREATE TABLE itens_venda (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    venda_id UUID REFERENCES vendas(id) ON DELETE CASCADE,
    produto_id UUID REFERENCES produtos(id),
    quantidade INTEGER NOT NULL CHECK (quantidade > 0),
    preco_unitario DECIMAL(10,2) NOT NULL CHECK (preco_unitario > 0),
    desconto_item DECIMAL(5,2) DEFAULT 0 CHECK (desconto_item >= 0 AND desconto_item <= 100),
    subtotal DECIMAL(12,2) GENERATED ALWAYS AS (quantidade * preco_unitario * (1 - desconto_item / 100)) STORED
);`)}
                `,
                practical: 'Implemente as tabelas da papelaria no seu projeto Supabase e crie triggers para controle automático de estoque.'
            },
            {
                title: '5. Relatórios Avançados e Análises',
                content: `
                    <h3 class="text-xl font-semibold text-gray-700 mb-3">Análise ABC de Produtos</h3>
                    ${createCodeBlock(`-- Classificação ABC por receita
WITH vendas_produto AS (
    SELECT 
        p.id,
        p.nome,
        SUM(iv.subtotal) as receita_total,
        SUM(iv.quantidade) as qtd_vendida
    FROM produtos p
    JOIN itens_venda iv ON p.id = iv.produto_id
    JOIN vendas v ON iv.venda_id = v.id
    WHERE v.status = 'concluida'
        AND v.data_venda >= CURRENT_DATE - INTERVAL '90 days'
    GROUP BY p.id, p.nome
),
percentuais AS (
    SELECT *,
        receita_total / SUM(receita_total) OVER() * 100 as perc_receita,
        SUM(receita_total) OVER(ORDER BY receita_total DESC) / 
        SUM(receita_total) OVER() * 100 as perc_acumulado
    FROM vendas_produto
)
SELECT 
    nome,
    receita_total,
    ROUND(perc_receita, 2) as perc_receita,
    ROUND(perc_acumulado, 2) as perc_acumulado,
    CASE 
        WHEN perc_acumulado <= 80 THEN 'A'
        WHEN perc_acumulado <= 95 THEN 'B'
        ELSE 'C'
    END as classificacao_abc
FROM percentuais
ORDER BY receita_total DESC;`)}

                    <h3 class="text-xl font-semibold text-gray-700 mb-3">Análise de Lucratividade</h3>
                    ${createCodeBlock(`-- Margem de lucro por categoria
SELECT 
    c.nome as categoria,
    COUNT(DISTINCT p.id) as total_produtos,
    AVG(p.preco_venda - p.custo_compra) as margem_media,
    AVG((p.preco_venda - p.custo_compra) / p.preco_venda * 100) as margem_percentual,
    SUM(CASE WHEN iv.id IS NOT NULL THEN iv.subtotal ELSE 0 END) as receita_periodo,
    SUM(CASE WHEN iv.id IS NOT NULL THEN iv.quantidade * p.custo_compra ELSE 0 END) as custo_periodo
FROM categorias c
LEFT JOIN produtos p ON c.id = p.categoria_id
LEFT JOIN itens_venda iv ON p.id = iv.produto_id
LEFT JOIN vendas v ON iv.venda_id = v.id 
    AND v.status = 'concluida'
    AND v.data_venda >= CURRENT_DATE - INTERVAL '30 days'
WHERE c.ativo = true
GROUP BY c.id, c.nome
ORDER BY margem_percentual DESC;`)}

                    <h3 class="text-xl font-semibold text-gray-700 mb-3">Sistema de Alertas</h3>
                    ${createCodeBlock(`-- View para alertas do sistema
CREATE VIEW alertas_inteligentes AS
SELECT 
    'PRODUTO_VENCENDO' as tipo,
    format('Produto %s vence em %s dias', p.nome, 
           DATE_PART('day', p.data_validade - CURRENT_DATE)) as mensagem,
    p.id as produto_id,
    'ALTA' as prioridade
FROM produtos p
WHERE p.data_validade IS NOT NULL
    AND p.data_validade BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '30 days'
    AND p.ativo = true

UNION ALL

SELECT 
    'ESTOQUE_CRITICO' as tipo,
    format('Produto %s com estoque crítico: %s unidades', p.nome, p.estoque_atual) as mensagem,
    p.id as produto_id,
    'ALTA' as prioridade
FROM produtos p
WHERE p.estoque_atual <= p.estoque_minimo
    AND p.ativo = true;`)}
                `,
                practical: 'Implemente o sistema completo da papelaria e crie relatórios personalizados para análise de vendas e estoque.'
            },
            {
                title: '6. Otimização e Performance',
                content: `
                    <div class="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
                        <h4 class="font-semibold text-yellow-800">🚀 Técnicas de Otimização</h4>
                        <ul class="text-yellow-700 mt-2 space-y-1">
                            <li>• Índices estratégicos para consultas frequentes</li>
                            <li>• Views materializadas para relatórios complexos</li>
                            <li>• Particionamento de tabelas grandes</li>
                            <li>• Análise de planos de execução</li>
                        </ul>
                    </div>

                    <h3 class="text-xl font-semibold text-gray-700 mb-3">Índices Estratégicos</h3>
                    ${createCodeBlock(`-- Índices para melhorar performance
CREATE INDEX idx_vendas_data_status ON vendas(data_venda, status);
CREATE INDEX idx_produtos_categoria_ativo ON produtos(categoria_id, ativo);
CREATE INDEX idx_itens_venda_produto ON itens_venda(produto_id, venda_id);
CREATE INDEX idx_produtos_estoque_minimo ON produtos(estoque_atual, estoque_minimo) WHERE ativo = true;

-- Índice para busca de texto
CREATE INDEX idx_produtos_nome_gin ON produtos USING gin(to_tsvector('portuguese', nome));`)}

                    <h3 class="text-xl font-semibold text-gray-700 mb-3">Análise de Performance</h3>
                    ${createCodeBlock(`-- Analisar plano de execução
EXPLAIN ANALYZE 
SELECT p.nome, SUM(iv.subtotal) as total_vendas
FROM produtos p
JOIN itens_venda iv ON p.id = iv.produto_id
JOIN vendas v ON iv.venda_id = v.id
WHERE v.data_venda >= CURRENT_DATE - INTERVAL '30 days'
    AND v.status = 'concluida'
GROUP BY p.id, p.nome
ORDER BY total_vendas DESC
LIMIT 10;`)}

                    ${createInfoBox('Parabéns! Você concluiu o curso de Banco de Dados com Supabase. Agora você domina desde conceitos básicos até técnicas avançadas de SQL, automação e otimização.', 'success')}
                `,
                practical: 'Analise a performance das consultas do seu projeto e implemente otimizações usando índices e views materializadas.'
            }
        ];
        
        section.innerHTML = this.createLessonTemplate('Aula 4: SQL Avançado', sections);
    }
}

// Utility functions
function createCodeBlock(code, language = 'sql') {
    return `
        <div class="code-block bg-gray-900 text-green-400 p-4 rounded-lg my-4 overflow-x-auto">
            <div class="flex items-center justify-between mb-2">
                <span class="text-xs text-gray-400 uppercase">${language}</span>
                <button onclick="copyCode(this)" class="text-xs text-gray-400 hover:text-white transition-colors">
                    <i class="fas fa-copy mr-1"></i>Copiar
                </button>
            </div>
            <pre><code>${code}</code></pre>
        </div>
    `;
}

function copyCode(button) {
    const codeBlock = button.closest('.code-block').querySelector('code');
    const text = codeBlock.textContent;
    navigator.clipboard.writeText(text).then(() => {
        button.innerHTML = '<i class="fas fa-check mr-1"></i>Copiado!';
        setTimeout(() => {
            button.innerHTML = '<i class="fas fa-copy mr-1"></i>Copiar';
        }, 2000);
    });
}

function createInfoBox(content, type = 'info') {
    const colors = {
        info: 'bg-blue-50 border-blue-200 text-blue-800',
        warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
        success: 'bg-green-50 border-green-200 text-green-800',
        error: 'bg-red-50 border-red-200 text-red-800'
    };
    
    const icons = {
        info: 'fas fa-info-circle',
        warning: 'fas fa-exclamation-triangle',
        success: 'fas fa-check-circle',
        error: 'fas fa-times-circle'
    };

    return `
        <div class="${colors[type]} border-l-4 p-4 my-4 rounded-r-lg">
            <div class="flex items-start">
                <i class="${icons[type]} mt-1 mr-3"></i>
                <div>${content}</div>
            </div>
        </div>
    `;
}

// Initialize the course manager when the page loads
document.addEventListener('DOMContentLoaded', () => {
    window.courseManager = new CourseManager();
    
    // Initialize search functionality
    initializeSearch();
    
    // Initialize progress tracking
    initializeProgressTracking();
});

// Search functionality
function initializeSearch() {
    const searchInputs = document.querySelectorAll('#search-input, #mobile-search-input');
    
    searchInputs.forEach(input => {
        input.addEventListener('input', (e) => {
            performSearch(e.target.value);
        });
    });
}

function performSearch(query) {
    clearSearchHighlights();
    
    if (query.length < 2) return;
    
    const regex = new RegExp(query, 'gi');
    const contentElements = document.querySelectorAll('.lesson-content p, .lesson-content h1, .lesson-content h2, .lesson-content h3, .lesson-content li, .lesson-content td');
    
    let foundResults = false;
    
    contentElements.forEach(element => {
        const originalText = element.textContent;
        if (regex.test(originalText)) {
            foundResults = true;
            const highlightedHTML = originalText.replace(regex, '<span class="highlight">$&</span>');
            element.innerHTML = highlightedHTML;
            
            // Scroll to first result
            if (!foundResults) {
                element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    });
    
    // Show search results indicator
    showSearchResults(foundResults, query);
}

function clearSearchHighlights() {
    const highlights = document.querySelectorAll('.highlight');
    highlights.forEach(highlight => {
        const parent = highlight.parentNode;
        parent.replaceChild(document.createTextNode(highlight.textContent), highlight);
        parent.normalize();
    });
    
    // Hide search results indicator
    hideSearchResults();
}

function showSearchResults(found, query) {
    let indicator = document.getElementById('search-results-indicator');
    if (!indicator) {
        indicator = document.createElement('div');
        indicator.id = 'search-results-indicator';
        indicator.className = 'fixed top-20 right-4 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg z-50';
        document.body.appendChild(indicator);
    }
    
    if (found) {
        indicator.innerHTML = `<i class="fas fa-search mr-2"></i>Resultados encontrados para "${query}"`;
        indicator.classList.remove('bg-red-500');
        indicator.classList.add('bg-blue-500');
    } else {
        indicator.innerHTML = `<i class="fas fa-exclamation-triangle mr-2"></i>Nenhum resultado para "${query}"`;
        indicator.classList.remove('bg-blue-500');
        indicator.classList.add('bg-red-500');
    }
    
    indicator.style.display = 'block';
    
    // Auto-hide after 3 seconds
    setTimeout(() => {
        hideSearchResults();
    }, 3000);
}

function hideSearchResults() {
    const indicator = document.getElementById('search-results-indicator');
    if (indicator) {
        indicator.style.display = 'none';
    }
}

// Progress tracking functionality
function initializeProgressTracking() {
    updateGlobalProgress();
    
    // Add completion tracking to existing buttons
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('complete-section-btn')) {
            const sectionElement = e.target.closest('.lesson-section');
            if (sectionElement) {
                markSectionAsCompleted(sectionElement, e.target);
            }
        }
    });
}

function markSectionAsCompleted(sectionElement, button) {
    // Add visual completion indicator
    sectionElement.classList.add('completed-section');
    
    // Update button
    button.innerHTML = '<i class="fas fa-check completion-indicator mr-2"></i>Concluído';
    button.classList.remove('bg-green-500', 'hover:bg-green-600');
    button.classList.add('bg-gray-400', 'cursor-not-allowed');
    button.disabled = true;
    
    // Save completion to localStorage
    saveCompletionProgress(sectionElement.dataset.section);
    
    // Update global progress
    updateGlobalProgress();
    
    // Show completion animation
    showCompletionAnimation(sectionElement);
}

function saveCompletionProgress(sectionId) {
    let completedSections = JSON.parse(localStorage.getItem('completedSections') || '[]');
    if (!completedSections.includes(sectionId)) {
        completedSections.push(sectionId);
        localStorage.setItem('completedSections', JSON.stringify(completedSections));
    }
}

function loadCompletionProgress() {
    const completedSections = JSON.parse(localStorage.getItem('completedSections') || '[]');
    
    completedSections.forEach(sectionId => {
        const sectionElement = document.querySelector(`[data-section="${sectionId}"]`);
        const button = sectionElement?.querySelector('.complete-section-btn');
        
        if (sectionElement && button) {
            markSectionAsCompleted(sectionElement, button);
        }
    });
}

function updateGlobalProgress() {
    const totalSections = document.querySelectorAll('.lesson-section').length;
    const completedSections = JSON.parse(localStorage.getItem('completedSections') || '[]').length;
    const progressPercentage = totalSections > 0 ? (completedSections / totalSections) * 100 : 0;
    
    // Update progress bar
    const progressBar = document.getElementById('progress-bar');
    const progressText = document.getElementById('progress-text');
    
    if (progressBar) {
        progressBar.style.width = `${progressPercentage}%`;
    }
    
    if (progressText) {
        progressText.textContent = `${completedSections}/${totalSections} seções concluídas (${Math.round(progressPercentage)}%)`;
    }
}

function showCompletionAnimation(element) {
    // Create celebration effect
    const celebration = document.createElement('div');
    celebration.innerHTML = '🎉';
    celebration.className = 'fixed text-4xl animate-bounce z-50';
    celebration.style.left = '50%';
    celebration.style.top = '50%';
    celebration.style.transform = 'translate(-50%, -50%)';
    
    document.body.appendChild(celebration);
    
    setTimeout(() => {
        document.body.removeChild(celebration);
    }, 2000);
}

// Collapsible sections functionality
function initializeCollapsibleSections() {
    document.querySelectorAll('.toggle-section').forEach(toggle => {
        toggle.addEventListener('click', () => {
            const content = toggle.nextElementSibling;
            const icon = toggle.querySelector('.toggle-icon');
            
            if (content.style.display === 'none' || content.style.display === '') {
                content.style.display = 'block';
                icon.style.transform = 'rotate(90deg)';
            } else {
                content.style.display = 'none';
                icon.style.transform = 'rotate(0deg)';
            }
        });
    });
}

// Initialize all features when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Load completion progress
    setTimeout(() => {
        loadCompletionProgress();
        updateGlobalProgress();
    }, 1000);
    
    // Initialize collapsible sections
    initializeCollapsibleSections();
});