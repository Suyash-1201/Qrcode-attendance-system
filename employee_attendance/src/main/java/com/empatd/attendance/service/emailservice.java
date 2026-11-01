package com.empatd.attendance.service;

import com.resend.Resend;
import com.resend.core.exception.ResendException;
import com.resend.services.emails.model.Attachment;
import com.resend.services.emails.model.CreateEmailOptions;
import com.resend.services.emails.model.CreateEmailResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Base64;

@Service
public class emailservice {

    private final Resend resend;

    public emailservice(@Value("${resend.api.key}") String apiKey) {
        // Initialize the Resend SDK using the API key from application.properties / environment
        this.resend = new Resend(apiKey);
    }

    public void sendqrcode(String to, String name, byte[] qrImageBytes) {
    	
        try {
            // Convert QR code byte array into a Base64-encoded string for the attachment
            String base64Image = Base64.getEncoder().encodeToString(qrImageBytes);
            

            Attachment attachment = Attachment.builder()
                    .fileName("qrcode.png")
                    .content(base64Image)
                    .build();

            String htmlContent = "<p>Hello <b>" + name + "</b>,</p>" +
                                 "<p>Your QR code for attendance has been generated successfully. Please find it attached below.</p>";

            CreateEmailOptions params = CreateEmailOptions.builder()
                    // IMPORTANT: On the free tier, 'from' must be onboarding@resend.dev until you verify your domain
                    .from("onboarding@resend.dev")
                    .to(to)
                    .subject("Your QR Code Attendance Pass")
                    .html(htmlContent)
                    .attachments(attachment)
                    .build();

            CreateEmailResponse response = resend.emails().send(params);
            System.out.println("QR Email sent successfully! ID: " + response.getId());

        } catch (ResendException e) {
            System.err.println("Resend API Error during QR send: " + e.getMessage());
            throw new RuntimeException("Failed to send QR email via Resend", e);
        }
    }
}