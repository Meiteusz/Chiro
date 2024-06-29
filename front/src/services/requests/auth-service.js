import { usePost } from "@/services/api-client";
import { ENDPOINTS } from "@/services/endpoints";

const authenticate = async (requestData) => {
  try {
    return await usePost(ENDPOINTS.auth.authenticate, requestData);
  } catch (error) {
    console.error("Authentication failed:", error);
    throw error;
  }
};

export default { authenticate };
