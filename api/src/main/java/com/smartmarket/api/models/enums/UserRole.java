package com.smartmarket.api.models.enums;

import lombok.AllArgsConstructor;

@AllArgsConstructor
public enum UserRole {
    ADMIN("admin"),
    USER("user");

    private final String role;

    public String getRole() {
        return "ROLE_" + role.toUpperCase();
    }

}