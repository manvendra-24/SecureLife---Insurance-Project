package com.insurance.service;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Random;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.insurance.entities.OtpEntity;
import com.insurance.entities.User;
import com.insurance.exceptions.ApiException;
import com.insurance.exceptions.UnauthorizedException;
import com.insurance.repository.OtpRepository;
import com.insurance.repository.UserRepository;
import com.insurance.request.OtpForgetPasswordRequest;

import org.springframework.transaction.annotation.Transactional;

@Service
public class EmailService {

    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);

    @Value("${spring.mail.username}")
    private String fromMail;

    @Autowired
    private JavaMailSender javaMailSender;

    @Autowired
    private OtpRepository otpRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public void sendEmail(String toMail, String subject, String emailBody) {
        logger.info("Sending email to: {}, subject: {}", toMail, subject);
        SimpleMailMessage mailMessage = new SimpleMailMessage();
        mailMessage.setFrom(fromMail);
        mailMessage.setTo(toMail);
        mailMessage.setSubject(subject);
        mailMessage.setText(emailBody);
        javaMailSender.send(mailMessage);
        logger.info("Email sent successfully to: {}", toMail);
    }

    public String generateOTP() {
        Random random = new Random();
        int otp = 1000 + random.nextInt(9000);
        logger.info("Generated OTP: {}", otp);
        return String.valueOf(otp);
    }

    public void sendOtpEmail(String toMail, String otp) {
        logger.info("Sending OTP email to: {}", toMail);
        String subject = "Password Reset OTP";
        String emailBody = "Your OTP for resetting the password is: " + otp;
        sendEmail(toMail, subject, emailBody);
    }

    public String sendOtpForForgetPassword(String username) {
        logger.info("Initiating OTP generation for username: {}", username);
        Optional<User> oUser = userRepository.findByUsernameOrEmail(username, username);
        if (oUser.isEmpty()) {
            throw new UnauthorizedException("User not available for username: " + username);
        }
        User user = oUser.get();
        logger.info("User found with email: {}", user.getEmail());

        String otp = generateOTP();
        LocalDateTime expirationTime = LocalDateTime.now().plusMinutes(10);
        OtpEntity otpEntity = new OtpEntity(user.getUsername(), otp, expirationTime);
        otpRepository.save(otpEntity);
        logger.info("OTP saved in database for username: {}, expiration time: {}", user.getUsername(), expirationTime);

        sendOtpEmail(user.getEmail(), otp);
        logger.info("OTP sent successfully to registered email: {}", user.getEmail());

        return "OTP sent to your registered email.";
    }

    public String verifyOtp(String otp) {
        logger.info("Verifying OTP: {}", otp);
        Optional<OtpEntity> otpEntityOptional = otpRepository.findByOtp(otp);
        if (otpEntityOptional.isEmpty()) {
            throw new ApiException("Invalid or expired OTP");
        }

        OtpEntity otpEntity = otpEntityOptional.get();
        if (otpEntity.getExpirationTime().isBefore(LocalDateTime.now())) {
            throw new ApiException("Invalid or expired OTP :" + otpEntity.getUsername());
        }
        logger.info("OTP verified successfully for username: {}", otpEntity.getUsername());
        return "OTP verified successfully";
    }

    @Transactional
    public String setNewPassword(OtpForgetPasswordRequest forgetPasswordRequest) {
        String username = forgetPasswordRequest.getUsernameOrEmail();
        logger.info("Setting new password for username: {}", username);
        Optional<User> oUser = userRepository.findByUsernameOrEmail(username, username);
        if (oUser.isEmpty()) {
            throw new UnauthorizedException("User not available for username: " + username);
        }
        User user = oUser.get();

        if (!forgetPasswordRequest.getNewPassword().equals(forgetPasswordRequest.getConfirmPassword())) {
            throw new ApiException("Confirm password does not match new password");
        }

        user.setPassword(passwordEncoder.encode(forgetPasswordRequest.getNewPassword()));
        userRepository.save(user);
        logger.info("Password updated successfully for username: {}", username);

        otpRepository.deleteByUsername(user.getUsername());
        logger.info("OTP record deleted for username: {}", username);

        return "Password updated successfully";
    }
}
