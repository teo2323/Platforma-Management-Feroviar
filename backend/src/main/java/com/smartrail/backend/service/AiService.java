package com.smartrail.backend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

@Service
public class AiService {

    @Value("${gemini.api.key}")
    private String apiKey;

    public String genereazaAnaliza(String promptText) {
        try {
            String urlString = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" + apiKey.trim();

            String cleanPrompt = promptText.replace("\"", "\\\"").replace("\n", " ");

            String requestBody = "{\n" +
                    "  \"contents\": [{\n" +
                    "    \"parts\":[{\"text\": \"" + cleanPrompt + "\"}]\n" +
                    "  }]\n" +
                    "}";

            HttpClient client = HttpClient.newHttpClient();
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(urlString))
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(requestBody))
                    .build();

            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
            String responseBody = response.body();

            if (response.statusCode() != 200) {
                System.out.println("Eroare de la Google: " + responseBody);
                return "Analiză AI indisponibilă (Eroare " + response.statusCode() + ").";
            }

            String target = "\"text\": \"";
            int startIndex = responseBody.indexOf(target);

            if (startIndex != -1) {
                startIndex += target.length();
                int endIndex = responseBody.indexOf("\"", startIndex);
                String extras = responseBody.substring(startIndex, endIndex);

                return extras.replace("\\n", " ").trim();
            }

            return "Analiza a reușit, dar nu am putut izola textul.";

        } catch (Exception e) {
            System.out.println("Eroare internă AI: " + e.getMessage());
            return "Analiză AI momentan indisponibilă. Călătorie plăcută!";
        }
    }
}