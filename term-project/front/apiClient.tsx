import axios, { AxiosResponse } from "axios";
// import API_BASE_URL from "../constants";

let API_BASE_URL = "http://localhost:4500"; // SERVER BASE URL
interface RequestParams {
  endpoint: string;
  method: string;
  data?: object;
}

interface RequestResult {
  data: any;
  params: object;
  error: string | null;
  message: string | null;
}

class ApiClient {
  private remoteHostUrl: string;
  private token: string | null;

  constructor(remoteHostUrl: string) {
    this.remoteHostUrl = remoteHostUrl;
    this.token = null;
  }

  // set JWT
//   setToken(token: string) {
//     this.token = token;
//   }

  /**
   * Utility method to make HTTP requests using axios (could also use fetch)
   *
   * @param {RequestParams} { endpoint, method, data = {} }
   * @returns {Promise<RequestResult>}
   */
  async request({ endpoint, method, data = {} }: RequestParams): Promise<RequestResult> {
    // construct url to given endpoint
    const url = `${API_BASE_URL}/${endpoint}`;

    // dynamic params for GET request
    const params = method === "get" ? data : {};

    const headers: Record<string, string> = { "Content-Type": "application/json" };

    if (this.token) { // for authentication
      headers["Authorization"] = `Bearer ${this.token}`;
    }

    // try {
      const res: AxiosResponse = await axios({ url, method, data, params, headers });
      console.log(`res is ${res.data}`);
      return { data: res.data, params, error: null, message: null };
    // } catch (e) {
    //   console.error("APIClient make request error", e.response);
    //   if (e.response.status === 404) return { data: null, error: "Not Found", message: null };
    //   return {
    //     data: null,
    //     error: e.response.data.error.message,
    //     message: e.response.data.message || null,
    //   };
    // }
  }

  async login(creds: object): Promise<RequestResult> {
    return await this.request({
      endpoint: `auth/login`,
      method: `POST`,
      data: creds,
    });
  }

  async register(creds: object): Promise<RequestResult> {
    return await this.request({
      endpoint: `auth/register`,
      method: `POST`,
      data: creds,
    });
  }

}

export default new ApiClient(API_BASE_URL);