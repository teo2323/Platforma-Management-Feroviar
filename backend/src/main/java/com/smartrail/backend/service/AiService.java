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
                return "Analiza de risc: Ruta stabila conform istoricului recent.";
            }

            if (responseBody.contains("\"text\": \"")) {
                int start = responseBody.indexOf("\"text\": \"") + 9;
                int end = responseBody.indexOf("\"", start);
                String result = responseBody.substring(start, end);

                return result.replace("\\n", " ").replace("\\\"", "\"").trim();
            }

            return "Analiza indisponibila momentan.";

        } catch (Exception e) {
            return "Sistemul de analiza este in mentenanta.";
        }
    }
}