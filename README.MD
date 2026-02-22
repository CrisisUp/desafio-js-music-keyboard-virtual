# 🎹 Steinway Spirio - Virtual Piano

> Uma experiência premium de simulação de piano de cauda, unindo a elegância da Steinway & Sons à tecnologia moderna da Web Audio API.

![Steinway Banner](https://img.shields.io/badge/Design-Steinway%20Edition-d4af37?style=for-the-badge)
![Clean Code](https://img.shields.io/badge/Code-Clean%20Architecture-brightgreen?style=for-the-badge)
![DevOps Ready](https://img.shields.io/badge/DevOps-Ready-blue?style=for-the-badge)

## 🌟 Sobre o Projeto

Este projeto é um simulador de piano de alta fidelidade desenvolvido durante o curso de **Técnico de Redes no SENAI São Caetano**. O foco principal foi transcender um simples teclado musical, aplicando conceitos de **infraestrutura de software**, **processamento de sinais em tempo real** e **design de interface de luxo**.



## 🚀 Diferenciais Técnicos

### 🛠️ Engenharia de Áudio (Web Audio API)

Diferente de pianos virtuais comuns, este motor utiliza um pipeline de áudio profissional:

* **Audio Context & Analyser**: Processamento de frequências em tempo real.
* **Real-Time Spectrum**: O visualizador de barras douradas responde à frequência exata de cada nota (FFT - Fast Fourier Transform).
* **Audio Preload Cache**: Sistema de buffer para garantir latência zero, essencial para execução profissional no **macOS Tahoe**.

### 💎 UI/UX Premium

* **Identidade Steinway**: Paleta baseada em Preto Piano e Ouro 24k.
* **Feedback Tátil**: Simulação física de profundidade (6px de afundamento) e sombras internas nas teclas.
* **Segmentação de Escalas**: Diferenciação cromática para a segunda oitava, facilitando a usabilidade.

### 🧹 Clean Code & DevOps Mindset

* **Arquitetura Modular**: Separação clara entre Estado (`state`), Interface (`ui`) e Motor (`engine`).
* **CSS System**: Uso extensivo de variáveis (Custom Properties) para fácil manutenção e escalabilidade.



## 🎶 Repertório Spirio (Automação)

O modo **Spirio** permite a execução automática de clássicos, simulando o sistema de auto-reprodução real da Steinway:

1. **Asa Branca** (Luiz Gonzaga) - Teste de amplitude de oitavas.
2. **Batatinha quando nasce** - Teste de QoS e latência de notas rápidas.
3. **Ragtime & Saloon Classics** - Estética clássica de piano de bar.

## 🕹️ Como Executar

1. Clone o repositório:

   ```bash
   git clone https://github.com/CrisisUp/desafio-js-music-keyboard-virtual.git
   ```

2. Abra o arquivo `index.html` no seu navegador (recomendado usar a extensão Live Server no VS Code para suporte total à Web Audio API).

3. Utilize o teclado do seu computador ou clique nas teclas para tocar.

## ⌨️ Mapeamento de Teclado

* **`Teclas Brancas`:** A, S, D, F, G, H, J, K, L, ;

* **`Teclas Pretas`:** W, E, T, Y, U, O, P

## 🎨 Desenvolvido com foco em UX e Performance por Cristiano, um estudante de Redes & DevOps apaixonado por tecnologia
