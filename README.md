# Vending Machine API

## How to start development

Step 1: open terminal and install

```bash
  $ yarn
```

Step 2: start Database MySql with docker-compose

```bash
  $ docker-compose.yml
```

Step 3: make and setup .env file

- set database
- create schema `vending-machine`

Step 4: run migration for create Table 

```bash
  $ yarn dev:migrate
```

Step 5: start services container

```bash
  $ yarn dev
```