# Agregador de Vagas de Emprego

Este projeto implementa uma arquitetura serverless para identificar e estruturar vagas de emprego publicadas em portais de vagas. O pipeline utiliza AWS Lambda, DynamoDB, SQS, API Groq e um portal web hospedado no Elastic Beanstalk. O objetivo é automatizar a coleta diária de posts, identificar possíveis vagas com base em palavras-chave definidas pelo usuário e disponibilizar informações estruturadas em um painel acessível.

## Live view

http://portal-jobs-env-1.eba-yestrddp.us-east-1.elasticbeanstalk.com/

**Usuário e senha demo:**
- demo@demo.com
- Demo-1234

## Arquitetura Geral

1. **Scraper de LinkedIn (Lambda + Playwright em Docker/ECR)**  
   - Executado 1x por dia.  
   - Acessa o portal de vagas, coleta posts recentes e extrai conteúdo bruto. 
   - Envia posts para uma fila SQS.  
   - Empacotado como container Docker hospedado no Amazon ECR.

2. **Lambda de Enriquecimento com IA (Groq API)**  
   - Consome mensagens da fila no SQS.  
   - Envia o conteúdo para a API Groq, que extrai dados estruturados da vaga.  
   - Os dados são enviados para outra lista SQS.

3. **Lambda de Persistência**  
   - Consome da lista com os dados extraídos pela IA.  
   - Armazena os dados da vaga em uma tabela DynamoDB.

4. **Autenticação e Preferências do Usuário (Cognito + DynamoDB)**  
   - Usuários podem criar conta via AWS Cognito.  
   - Cada usuário define suas palavras-chave preferidas.  
   - As preferências são salvas em uma tabela do DynamoDB.

5. **Portal Web (AWS Elastic Beanstalk)**  
   - Interface onde usuários fazem login e acessam suas preferências.  
   - Exibe também as vagas extraídas do DynamoDB.  
   - Já implementado:  
     - Página de login (Cognito).  
     - Página inicial com visualização e edição de preferências.  

---

## Status do Projeto

### ✔️ Concluído
- Página de login integrada ao Cognito.  
- Página inicial da aplicação.  
- Persistência das preferências do usuário em DynamoDB.  
- Configuração das tabelas principais.  

### 🔄 Em andamento
- Deploy das Lambdas com Playwright dentro de container Docker hospedado no ECR.  
- Pipeline de scraping + classificação + IA + persistência.

### 🔜 Próximos Passos
- Criar Dockerfile do scraper.  
- Subir imagem para o ECR.  
- Criar Lambda baseada em container.  
- Integrar com SQS e IAM roles.  
- Implementar as demais Lambdas da pipeline.  
- Finalizar exibição das vagas no portal.

---

## Tecnologias Utilizadas

- **AWS Lambda (serverless compute)**
- **AWS SQS (filas de processamento)**
- **AWS DynamoDB (persistência NoSQL)**
- **AWS Cognito (autenticação de usuários)**
- **AWS Elastic Beanstalk (portal web)**
- **Amazon ECR + Docker + Playwright (scraper)**
- **Groq API (extração inteligente de dados)**
- **Node.js / JavaScript**
- **React (frontend)**

---

## Fluxo de Dados

```mermaid
flowchart TD

A[Scraper Lambda<br>Playwright + Docker] -->|posts suspeitos| B[SQS<br>queue_raw_posts]
B --> C[Lambda de Enriquecimento<br>Groq API]
C -->|vaga confirmada| D[SQS<br>queue_validated_jobs]
D --> E[Lambda de Persistência]
E --> F[DynamoDB<br>jobs_table]
G[Cognito] --> H[Portal Web<br>Elastic Beanstalk]
H --> I[DynamoDB<br>user_preferences_table]
F --> H
