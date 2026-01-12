export function getApiErrorMessage(error: any): string {
  if (!error) {
    return "An unexpected error occurred. Please try again.";
  }

  const errorMessage = error.message || "";

  if (errorMessage.includes("JSON") || errorMessage.includes("parse")) {
    return "Unable to process server response. Please try again.";
  }

  if (
    errorMessage.includes("network") ||
    errorMessage.includes("timeout") ||
    errorMessage.includes("Network request failed")
  ) {
    return "Network error. Please check your connection and try again.";
  }

  if (errorMessage.includes("401") || errorMessage.includes("unauthorized")) {
    return "Session expired. Please log in again.";
  }

  if (errorMessage.includes("403") || errorMessage.includes("forbidden")) {
    return "Access denied. Please contact support.";
  }

  if (errorMessage.includes("404") || errorMessage.includes("not found")) {
    return "Requested data not found. Please try again.";
  }

  if (errorMessage.includes("500") || errorMessage.includes("server error")) {
    return "Server error. Please try again later.";
  }

  if (errorMessage.includes("authenticated")) {
    return "Please log in to continue.";
  }

  return errorMessage || "Something went wrong. Please try again.";
}

export function parseApiResponse<T>(dataString: any, fallback: T): T {
  if (!dataString) {
    throw new Error("Invalid response from server. Please try again.");
  }

  if (typeof dataString !== "string") {
    return dataString as T;
  }

  try {
    const parsed = JSON.parse(dataString);
    return parsed as T;
  } catch (error) {
    console.error("JSON parse error:", error);
    throw new Error("Unable to process server response. Please try again.");
  }
}

export function handleApiError(error: any, context: string): never {
  console.error(`${context} error:`, error);

  const userMessage = getApiErrorMessage(error);
  throw new Error(userMessage);
}
