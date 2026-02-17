import {
  AUTH_ERROR_CODES,
  EXPECTED_AUTH_ERRORS,
  getErrorCode,
  isAuthErrorCode,
  isExpectedError,
} from "../errors";

describe("getErrorCode", () => {
  it("should extract error code from error object with code property", () => {
    const error = {
      code: "email_not_confirmed",
      message: "Email not confirmed",
    };
    expect(getErrorCode(error)).toBe("email_not_confirmed");
  });

  it("should return 'unknown' for error object without code property", () => {
    const error = { message: "Some error" };
    expect(getErrorCode(error)).toBe("unknown");
  });

  it("should return 'unknown' for error with non-string code", () => {
    const error = { code: 123, message: "Some error" };
    expect(getErrorCode(error)).toBe("unknown");
  });

  it("should return 'unknown' for null", () => {
    expect(getErrorCode(null)).toBe("unknown");
  });

  it("should return 'unknown' for undefined", () => {
    expect(getErrorCode(undefined)).toBe("unknown");
  });

  it("should return 'unknown' for string", () => {
    expect(getErrorCode("error message")).toBe("unknown");
  });

  it("should return 'unknown' for number", () => {
    expect(getErrorCode(123)).toBe("unknown");
  });

  it("should handle Error instances without code property", () => {
    const error = new Error("Something went wrong");
    expect(getErrorCode(error)).toBe("unknown");
  });

  it("should handle Error instances with code property", () => {
    const error = new Error("Email not confirmed") as Error & { code: string };
    error.code = "email_not_confirmed";
    expect(getErrorCode(error)).toBe("email_not_confirmed");
  });

  it("should handle Supabase-like error objects", () => {
    const supabaseError = {
      message: "Email not confirmed",
      code: "email_not_confirmed",
      status: 400,
    };
    expect(getErrorCode(supabaseError)).toBe("email_not_confirmed");
  });
});

describe("isAuthErrorCode", () => {
  it("should return true for valid auth error codes", () => {
    expect(isAuthErrorCode(AUTH_ERROR_CODES.EMAIL_NOT_CONFIRMED)).toBe(true);
    expect(isAuthErrorCode(AUTH_ERROR_CODES.CONFIRMATION_REQUIRED)).toBe(true);
    expect(isAuthErrorCode(AUTH_ERROR_CODES.INVALID_CREDENTIALS)).toBe(true);
    expect(isAuthErrorCode(AUTH_ERROR_CODES.USER_ALREADY_REGISTERED)).toBe(
      true,
    );
    expect(isAuthErrorCode(AUTH_ERROR_CODES.WEAK_PASSWORD)).toBe(true);
    expect(isAuthErrorCode(AUTH_ERROR_CODES.OVER_EMAIL_SEND_RATE_LIMIT)).toBe(
      true,
    );
    expect(isAuthErrorCode(AUTH_ERROR_CODES.INVALID_EMAIL)).toBe(true);
    expect(isAuthErrorCode(AUTH_ERROR_CODES.EMAIL_NOT_FOUND)).toBe(true);
  });

  it("should return false for unknown error codes", () => {
    expect(isAuthErrorCode("unknown_error")).toBe(false);
    expect(isAuthErrorCode("random_code")).toBe(false);
    expect(isAuthErrorCode("")).toBe(false);
  });

  it("should return false for 'unknown'", () => {
    expect(isAuthErrorCode("unknown")).toBe(false);
  });
});

describe("AUTH_ERROR_CODES", () => {
  it("should have all required error codes", () => {
    expect(AUTH_ERROR_CODES.EMAIL_NOT_CONFIRMED).toBe("email_not_confirmed");
    expect(AUTH_ERROR_CODES.CONFIRMATION_REQUIRED).toBe(
      "confirmation_required",
    );
    expect(AUTH_ERROR_CODES.INVALID_CREDENTIALS).toBe("invalid_credentials");
    expect(AUTH_ERROR_CODES.USER_ALREADY_REGISTERED).toBe(
      "user_already_registered",
    );
    expect(AUTH_ERROR_CODES.WEAK_PASSWORD).toBe("weak_password");
    expect(AUTH_ERROR_CODES.OVER_EMAIL_SEND_RATE_LIMIT).toBe(
      "over_email_send_rate_limit",
    );
    expect(AUTH_ERROR_CODES.INVALID_EMAIL).toBe("invalid_email");
    expect(AUTH_ERROR_CODES.EMAIL_NOT_FOUND).toBe("email_not_found");
  });

  it("should be immutable (as const)", () => {
    // TypeScript prevents mutation at compile time with 'as const'
    // We just verify the values remain consistent
    const beforeValue = AUTH_ERROR_CODES.EMAIL_NOT_CONFIRMED;
    expect(beforeValue).toBe("email_not_confirmed");
    expect(AUTH_ERROR_CODES.EMAIL_NOT_CONFIRMED).toBe(beforeValue);
  });
});

describe("isExpectedError", () => {
  it("should return true for all expected auth error codes", () => {
    expect(isExpectedError(AUTH_ERROR_CODES.EMAIL_NOT_CONFIRMED)).toBe(true);
    expect(isExpectedError(AUTH_ERROR_CODES.CONFIRMATION_REQUIRED)).toBe(true);
    expect(isExpectedError(AUTH_ERROR_CODES.INVALID_CREDENTIALS)).toBe(true);
    expect(isExpectedError(AUTH_ERROR_CODES.USER_ALREADY_REGISTERED)).toBe(
      true,
    );
    expect(isExpectedError(AUTH_ERROR_CODES.WEAK_PASSWORD)).toBe(true);
    expect(isExpectedError(AUTH_ERROR_CODES.OVER_EMAIL_SEND_RATE_LIMIT)).toBe(
      true,
    );
    expect(isExpectedError(AUTH_ERROR_CODES.INVALID_EMAIL)).toBe(true);
    expect(isExpectedError(AUTH_ERROR_CODES.EMAIL_NOT_FOUND)).toBe(true);
  });

  it("should return false for unknown error codes", () => {
    expect(isExpectedError("unknown_error")).toBe(false);
    expect(isExpectedError("random_code")).toBe(false);
    expect(isExpectedError("system_error")).toBe(false);
  });

  it("should return false for 'unknown'", () => {
    expect(isExpectedError("unknown")).toBe(false);
  });

  it("should return false for empty string", () => {
    expect(isExpectedError("")).toBe(false);
  });
});

describe("EXPECTED_AUTH_ERRORS", () => {
  it("should contain all known auth error codes", () => {
    expect(EXPECTED_AUTH_ERRORS).toContain(
      AUTH_ERROR_CODES.EMAIL_NOT_CONFIRMED,
    );
    expect(EXPECTED_AUTH_ERRORS).toContain(
      AUTH_ERROR_CODES.CONFIRMATION_REQUIRED,
    );
    expect(EXPECTED_AUTH_ERRORS).toContain(
      AUTH_ERROR_CODES.INVALID_CREDENTIALS,
    );
    expect(EXPECTED_AUTH_ERRORS).toContain(
      AUTH_ERROR_CODES.USER_ALREADY_REGISTERED,
    );
    expect(EXPECTED_AUTH_ERRORS).toContain(AUTH_ERROR_CODES.WEAK_PASSWORD);
    expect(EXPECTED_AUTH_ERRORS).toContain(
      AUTH_ERROR_CODES.OVER_EMAIL_SEND_RATE_LIMIT,
    );
    expect(EXPECTED_AUTH_ERRORS).toContain(AUTH_ERROR_CODES.INVALID_EMAIL);
    expect(EXPECTED_AUTH_ERRORS).toContain(AUTH_ERROR_CODES.EMAIL_NOT_FOUND);
  });

  it("should have the correct length", () => {
    expect(EXPECTED_AUTH_ERRORS).toHaveLength(8);
  });
});
