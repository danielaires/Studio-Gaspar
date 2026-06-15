// src/services/avaliacaoService.js

// URL base para o endpoint de avaliações no seu Java
const BASE_URL = 'http://localhost:8080/avaliacoes'; 

export function salvarAvaliacao(avaliacao) {
    return fetch(BASE_URL, {
        method: 'POST', // Método HTTP para criar novos registros
        headers: {
            'Content-Type': 'application/json', // Avisa o Java que estamos enviando um JSON
        },
        body: JSON.stringify(avaliacao) // Transforma o objeto do React em texto JSON
    })
    .then(resposta => {
        if (!resposta.ok) {
            // Se o Java devolver um erro (como 400 ou 500), o código cai aqui
            throw new Error('Erro ao salvar a avaliação física no servidor.');
        }
        
        // Verifica se o servidor retornou algum conteúdo antes de tentar ler como JSON
        // (Alguns métodos de salvar no Spring Boot retornam apenas o status 201 Created vazio)
        return resposta.text().then(text => text ? JSON.parse(text) : {});
    });
}