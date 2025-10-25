# Trade Link - PIT

## Resumo do Projeto
O **Trade Link** é uma plataforma digital que conecta **empresas e fornecedores**, automatizando e simplificando o processo de criação de contratos comerciais. Nosso objetivo é reduzir a burocracia e otimizar o fluxo de negociações, oferecendo uma interface intuitiva e segura para ambas as partes.

## Objetivos
- **Facilitar** a comunicação e negociação entre empresas e fornecedores.
- **Automatizar** a criação de contratos comerciais.
- **Garantir segurança** e confiabilidade nas transações.
- **Oferecer transparência** no processo de negociação.
- **Reduzir tempo** e custos operacionais.

## Funcionamento Geral
1. **Cadastro de Usuários**: Empresas e fornecedores criam contas na plataforma.
2. **Publicação de Necessidades/Ofertas**: Empresas divulgam demandas e fornecedores apresentam propostas.
3. **Negociação e Ajustes**: As partes ajustam detalhes de prazos, valores e condições.
4. **Geração de Contrato Automática**: O sistema cria contratos personalizados com base nas informações acordadas.
5. **Assinatura Digital**: Contratos são assinados eletronicamente, garantindo validade jurídica.
6. **Gestão e Histórico**: A plataforma mantém um histórico de negociações e documentos para fácil acesso.

---

# Requisitos Funcionais

- [x] **RF01** – O sistema deve permitir o cadastro de fornecedores.  
- [x] **RF02** – O sistema deve permitir o cadastro de empreendedores.  
- [x] **RF03** – O usuário deve poder realizar login e autenticação segura.  
- [x] **RF04** – O sistema deve permitir que fornecedores cadastrem seus produtos e serviços.  
- [ ] **RF05** – O sistema deve permitir que empreendedores pesquisem fornecedores por categoria.  
- [ ] **RF06** – O sistema deve ter um mecanismo de busca eficiente.  
- [x] **RF07** – Os usuários devem poder conversar com uma ia.  
- [x] **RF08** – O sistema deve permitir que fornecedores personalizem seus perfis.  
- [x] **RF09** – O usuário deve poder redefinir a senha em caso de esquecimento.  
- [-] **RF10** – O sistema deve enviar notificações sobre mensagens e negociações pendentes.  
- [x] **RF11** – O usuário deve conseguir visualizar um histórico de negociações.  
- [-] **RF12** – O sistema deve permitir integração com gateways de pagamento para transações diretas.  
- [ ] **RF13** – O sistema deve permitir avaliações e comentários sobre fornecedores.  
- [x] **RF14** – O sistema deve permitir a exportação de relatórios sobre compras e negociações.  
- [x] **RF15** – Deve haver um dashboard com métricas de uso para fornecedores.  
- [-] **RF16** – O sistema deve permitir a filtragem de fornecedores por localização.  
- [-] **RF17** – O sistema deve permitir integração com redes sociais para login.  
- [-] **RF18** – O sistema deve ter um sistema de recomendação de fornecedores baseado em buscas anteriores.  
- [-] **RF19** – O usuário deve poder favoritar fornecedores para contato futuro.  
- [ ] **RF20** – O sistema deve permitir que fornecedores criem promoções e descontos.  
- [-] **RF21** – O sistema deve oferecer suporte a múltiplos idiomas.  
- [ ] **RF22** – O sistema deve permitir que fornecedores e empreendedores enviem documentos e contratos.  
- [ ] **RF23** – O sistema deve permitir o agendamento de reuniões online entre fornecedores e clientes.  
- [x] **RF24** – O sistema deve oferecer um chat em tempo real para suporte técnico.  
- [ ] **RF25** – O sistema deve gerar alertas sobre prazos e entregas.  
- [-] **RF26** – O sistema deve permitir integração com serviços logísticos parceiros.  
- [ ] **RF27** – O sistema deve oferecer um modo "catálogo" para fornecedores exibirem seus produtos de forma organizada.  
- [-] **RF28** – O sistema deve permitir a criação de listas de compras e pedidos recorrentes.  
- [-] **RF29** – O sistema deve contar com autenticação em dois fatores para maior segurança.  
- [-] **RF30** – O sistema deve permitir um modo premium para fornecedores que desejam maior visibilidade.  

---

## Como executar

para executar o projeto vc deve baixar todas as depedencia do node, 
o mysql server e o workbench, 
além de ter nossa base de dados, depois que esses requisitos forem atendidos apenas use o comando

```bash

node app.js

```

---

## Base de dados 

create database pit;
use pit;

CREATE TABLE empresas (
    id_empresa INT PRIMARY KEY AUTO_INCREMENT,
    nome_fantasia VARCHAR(150) NOT NULL,
    razao_social VARCHAR(150),
    cnpj CHAR(14) UNIQUE NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    senha_hash VARCHAR(255) NOT NULL,
    telefone VARCHAR(20),
    endereco TEXT,
    email_verificado BOOLEAN DEFAULT FALSE,
    token_validacao VARCHAR(255),
    validade_token TIMESTAMP NULL,
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- Novos campos de configurações
    localizacao VARCHAR(255) DEFAULT 'não definido',
    visibility ENUM('public','friends','private') DEFAULT 'public',
    data_sharing BOOLEAN DEFAULT FALSE,
    show_activity BOOLEAN DEFAULT FALSE,
    search_visibility BOOLEAN DEFAULT FALSE,
    notify_messages BOOLEAN DEFAULT FALSE,
    notify_mentions BOOLEAN DEFAULT FALSE,
    notify_updates BOOLEAN DEFAULT FALSE,
    notify_comments BOOLEAN DEFAULT FALSE,
    important_only BOOLEAN DEFAULT FALSE,
    email_notifications BOOLEAN DEFAULT FALSE,
    push_notifications BOOLEAN DEFAULT FALSE,
    language VARCHAR(10) DEFAULT 'pt-br',
    datetime_format ENUM('24h','12h') DEFAULT '24h',
    timezone VARCHAR(10) DEFAULT '-3',
    descricao text
);

CREATE TABLE fornecedores (
    id_fornecedor INT PRIMARY KEY AUTO_INCREMENT,
    nome_fantasia VARCHAR(150) NOT NULL,
    razao_social VARCHAR(150) ,
    cpf CHAR(14) UNIQUE NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    senha_hash VARCHAR(255) NOT NULL,
    telefone VARCHAR(20),
    endereco TEXT,
    email_verificado BOOLEAN DEFAULT FALSE,
    token_validacao VARCHAR(255),
    validade_token TIMESTAMP NULL,
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
     descricao text,
    
    -- Novos campos de configurações
    localizacao VARCHAR(255) DEFAULT 'não definido',
    visibility ENUM('public','friends','private') DEFAULT 'public',
    data_sharing BOOLEAN DEFAULT FALSE,
    show_activity BOOLEAN DEFAULT FALSE,
    search_visibility BOOLEAN DEFAULT FALSE,
    notify_messages BOOLEAN DEFAULT FALSE,
    notify_mentions BOOLEAN DEFAULT FALSE,
    notify_updates BOOLEAN DEFAULT FALSE,
    notify_comments BOOLEAN DEFAULT FALSE,
    important_only BOOLEAN DEFAULT FALSE,
    email_notifications BOOLEAN DEFAULT FALSE,
    push_notifications BOOLEAN DEFAULT FALSE,
    language VARCHAR(10) DEFAULT 'pt-br',
    datetime_format ENUM('24h','12h') DEFAULT '24h',
    timezone VARCHAR(10) DEFAULT '-3'
   
);


CREATE TABLE produtos (
    id_produto INT PRIMARY KEY AUTO_INCREMENT,
    id_fornecedor INT NOT NULL,
    nome_produto VARCHAR(150) NOT NULL,
    descricao TEXT,
    preco DECIMAL(10,2) NOT NULL,
    disponivel BOOLEAN DEFAULT TRUE,
    categoria varchar(50),
    FOREIGN KEY (id_fornecedor) REFERENCES fornecedores(id_fornecedor) ON DELETE CASCADE
);

CREATE TABLE usuarios (
    id_usuario INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(150) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    senha_hash VARCHAR(255) NOT NULL,
    tipo ENUM('empresa', 'fornecedor', 'admin') NOT NULL,
    id_empresa INT,
    id_fornecedor INT,
    email_verificado BOOLEAN DEFAULT FALSE,
    token_validacao VARCHAR(255),
    validade_token TIMESTAMP NULL,
    ultimo_login TIMESTAMP NULL,
    FOREIGN KEY (id_empresa) REFERENCES empresas(id_empresa) ON DELETE CASCADE,
    FOREIGN KEY (id_fornecedor) REFERENCES fornecedores(id_fornecedor) ON DELETE CASCADE
);

CREATE TABLE notificacoes (
    id_notificacao INT PRIMARY KEY AUTO_INCREMENT,
    id_usuario INT NOT NULL,
    titulo VARCHAR(150) NOT NULL,
    mensagem TEXT NOT NULL,
    tipo ENUM('info', 'alerta', 'aviso', 'contrato', 'compra') DEFAULT 'info',
    lida BOOLEAN DEFAULT FALSE,
    data_envio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE
);

CREATE TABLE contratos (
    id_contrato INT PRIMARY KEY AUTO_INCREMENT,
    id_empresa INT NOT NULL,
    id_fornecedor INT NOT NULL,
    data_inicio DATE NOT NULL,
    data_fim DATE,
    valor_total DECIMAL(10,2) NOT NULL,
    status ENUM('ativo', 'encerrado', 'pendente') DEFAULT 'pendente',
    arquivo_pdf VARCHAR(255),
    FOREIGN KEY (id_empresa) REFERENCES empresas(id_empresa) ON DELETE CASCADE,
    FOREIGN KEY (id_fornecedor) REFERENCES fornecedores(id_fornecedor) ON DELETE CASCADE
);

CREATE TABLE contrato_produtos (
    id_contrato INT NOT NULL,
    id_produto INT NOT NULL,
    quantidade INT NOT NULL DEFAULT 1,
    preco_unitario DECIMAL(10,2) NOT NULL,
    PRIMARY KEY (id_contrato, id_produto),
    FOREIGN KEY (id_contrato) REFERENCES contratos(id_contrato) ON DELETE CASCADE,
    FOREIGN KEY (id_produto) REFERENCES produtos(id_produto) ON DELETE CASCADE
);

CREATE TABLE historico_contratos (
    id_historico INT PRIMARY KEY AUTO_INCREMENT,
    id_contrato INT NOT NULL,
    data_modificacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    acao ENUM('criado', 'atualizado', 'encerrado') NOT NULL,
    descricao TEXT,
    FOREIGN KEY (id_contrato) REFERENCES contratos(id_contrato) ON DELETE CASCADE
);

CREATE TABLE compras (
    id_compra INT PRIMARY KEY AUTO_INCREMENT,
    id_empresa INT NOT NULL,
    id_fornecedor INT NOT NULL,
    data_compra TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    valor_total DECIMAL(10,2) NOT NULL,
    status ENUM('pendente', 'aprovada', 'enviada', 'concluída', 'cancelada') DEFAULT 'pendente',
    FOREIGN KEY (id_empresa) REFERENCES empresas(id_empresa) ON DELETE CASCADE,
    FOREIGN KEY (id_fornecedor) REFERENCES fornecedores(id_fornecedor) ON DELETE CASCADE
);

CREATE TABLE compra_produtos (
    id_compra INT NOT NULL,
    id_produto INT NOT NULL,
    quantidade INT NOT NULL DEFAULT 1,
    preco_unitario DECIMAL(10,2) NOT NULL,
    PRIMARY KEY (id_compra, id_produto),
    FOREIGN KEY (id_compra) REFERENCES compras(id_compra) ON DELETE CASCADE,
    FOREIGN KEY (id_produto) REFERENCES produtos(id_produto) ON DELETE CASCADE
);

CREATE TABLE historico_compras (
    id_historico INT PRIMARY KEY AUTO_INCREMENT,
    id_compra INT NOT NULL,
    data_modificacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    acao ENUM('criado', 'pago', 'enviado', 'recebido', 'cancelado') NOT NULL,
    descricao TEXT,
    FOREIGN KEY (id_compra) REFERENCES compras(id_compra) ON DELETE CASCADE
);

CREATE TABLE log_atividades (
    id_log INT PRIMARY KEY AUTO_INCREMENT,
    id_usuario INT NOT NULL,
    acao VARCHAR(255) NOT NULL,
    ip_usuario VARCHAR(45),
    data_acao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE
);

---

## Grupo:
- **Henrique Souza** – PO / Líder Técnico matric: 22301658
- **Iago Teles** – Front-end  matric: 22301941
- **Wadley Deotti** – Front-end  matric: 22300120
- **Ítalo Vilarino** – Banco de Dados  matric: 22301844
- **Guilherme Pires** – Back-end  martric: 22300724
- **Gustavo Guerra** – Back-end  matric: 22402322
