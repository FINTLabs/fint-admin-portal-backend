package no.fint.portal.model;

import lombok.Builder;
import lombok.Data;

@Data
public class PolicyStatus {
    private boolean isClientPolicyOk = false;
    private boolean isAdapterPolicyOk = false;
    private String message;
}
