import { usePost } from "../api-methods";
import { ENDPOINTS } from "../endpoints";

const authenticate = async (requestData) => {
  try {
    return await usePost(ENDPOINTS.auth.authenticate, requestData);
  } catch (error) {
    console.error("Authentication failed:", error);
    throw error;
  }
};

export default { authenticate };
