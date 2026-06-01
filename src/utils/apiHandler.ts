export const handleApiError = (error: any) => {
  if (error.message === "Failed to fetch") {
    return "❌ COMMAND CENTER OFFLINE: Python engine is down.";
  }
  return "❌ SYSTEM ERROR: Unauthorized or Request failed.";
};