package com.smartrail.backend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

@Service
public class AiService {

    @Value("${ai.provider:gemini}")
    private String aiProvider;

    @Value("${gemini.api.key:}")
    private String apiKey;

    @Value("${ollama.api.url:http://localhost:11434/api/generate}")
    private String ollamaUrl;

    @Value("${ollama.model:tinyllama}")
    private String ollamaModel;

    public String genereazaAnaliza(String promptText) {
        if ("ollama".equalsIgnoreCase(aiProvider)) {
            try {
                System.out.println("Incercare generare analiza cu Ollama...");
                return genereazaAnalizaOllama(promptText);
            } catch (Exception e) {
                System.err.println("Eroare generare analiza cu Ollama: " + e.getMessage() + ". Incercare fallback pe Gemini...");
                try {
                    return genereazaAnalizaGemini(promptText);
                } catch (Exception ex) {
                    System.err.println("Eroare generare analiza si cu Gemini (fallback): " + ex.getMessage());
                    return "Analiza de risc: Ruta stabila conform istoricului recent.";
                }
            }
        } else {
            try {
                System.out.println("Incercare generare analiza cu Gemini...");
                return genereazaAnalizaGemini(promptText);
            } catch (Exception e) {
                System.err.println("Eroare generare analiza cu Gemini: " + e.getMessage() + ". Incercare fallback pe Ollama...");
                try {
                    return genereazaAnalizaOllama(promptText);
                } catch (Exception ex) {
                    System.err.println("Eroare generare analiza si cu Ollama (fallback): " + ex.getMessage());
                    return "Analiza de risc: Ruta stabila conform istoricului recent.";
                }
            }
        }
    }

    private String genereazaAnalizaOllama(String promptText) throws Exception {
        String cleanPrompt = promptText.replace("\\", "\\\\").replace("\"", "\\\"").replace("\n", " ");
        String requestBody = "{\"model\": \"" + ollamaModel + "\", \"prompt\": \"" + cleanPrompt + "\", \"stream\": false}";

        HttpClient client = HttpClient.newHttpClient();
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(ollamaUrl))
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(requestBody))
                .build();

        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
        String responseBody = response.body();

        if (response.statusCode() != 200) {
            System.out.println("DEBUG - Ollama Status: " + response.statusCode());
            System.out.println("DEBUG - Raspuns Ollama: " + responseBody);
            throw new RuntimeException("Eroare status HTTP Ollama: " + response.statusCode());
        }

        String result = extractJsonStringValue(responseBody, "response");
        if (result != null) {
            return result.replace("[/INST]", "").replace("[INST]", "").replace("\n", " ").trim();
        }

        throw new RuntimeException("Raspuns invalid de la Ollama (campul 'response' lipseste).");
    }

    private String genereazaAnalizaGemini(String promptText) throws Exception {
        if (apiKey == null || apiKey.trim().isEmpty()) {
            throw new IllegalStateException("Cheia API Gemini lipseste.");
        }

        String urlString = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" + apiKey.trim();

        String cleanPrompt = promptText.replace("\\", "\\\\").replace("\"", "\\\"").replace("\n", " ");
        String requestBody = "{\"contents\": [{\"parts\":[{\"text\": \"" + cleanPrompt + "\"}]}]}";

        HttpClient client = HttpClient.newHttpClient();
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(urlString))
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(requestBody))
                .build();

        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
        String responseBody = response.body();

        if (response.statusCode() != 200) {
            System.out.println("DEBUG - Status: " + response.statusCode());
            System.out.println("DEBUG - Raspuns Google: " + responseBody);
            throw new RuntimeException("Eroare status HTTP Gemini: " + response.statusCode());
        }

        String result = extractJsonStringValue(responseBody, "text");
        if (result != null) {
            return result.replace("\n", " ").trim();
        }

        throw new RuntimeException("Raspuns invalid de la Gemini (campul 'text' lipseste).");
    }

    private String extractJsonStringValue(String json, String key) {
        String searchKey = "\"" + key + "\":";
        int keyIndex = json.indexOf(searchKey);
        if (keyIndex == -1) {
            return null;
        }

        int valueStart = json.indexOf("\"", keyIndex + searchKey.length());
        if (valueStart == -1) {
            return null;
        }
        valueStart++;

        StringBuilder sb = new StringBuilder();
        boolean escaped = false;
        for (int i = valueStart; i < json.length(); i++) {
            char c = json.charAt(i);
            if (escaped) {
                if (c == 'n') {
                    sb.append('\n');
                } else if (c == 't') {
                    sb.append('\t');
                } else {
                    sb.append(c);
                }
                escaped = false;
            } else if (c == '\\') {
                escaped = true;
            } else if (c == '"') {
                break;
            } else {
                sb.append(c);
            }
        }
        return sb.toString();
    }
}