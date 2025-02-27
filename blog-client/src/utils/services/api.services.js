import axios from "axios";
import {
  host,
  signUpurl,
  loginurl,
  createblogurl,
  getblogurl,
  getblogbyuserurl,
  updateblogurl,
} from "../contants/apiroute";

export const api = axios.create({
  baseURL: `${host}`,
  headers: {
    "Content-type": "application/json",
  },
});

// Add a request interceptor
api.interceptors.request.use(
  (config) => {
    const url = config.url;
    if (
      url.includes("auth") ||
      url.includes("otp") ||
      url.includes("reviews")
    ) {
      return config;
    } else {
      const user = JSON.parse(localStorage.getItem("user"));
      const token = user.access;

      if (token != null) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    }
  },
  (error) => Promise.reject(error)
);
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const user = JSON.parse(localStorage.getItem("user"));
        const refresh = user?.refresh;

        if (!refresh) {
          localStorage.removeItem("user");
          window.location.href = "/";
          return Promise.reject(error);
        }

        const response = await api.post("/auth/refresh/", { refresh });
        const newAccessToken = response.data.access;

        localStorage.setItem(
          "user",
          JSON.stringify({ access: newAccessToken, refresh })
        );
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;

        return api(originalRequest);
      } catch {
        localStorage.removeItem("user");
        window.location.href = "/";
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

export const signUp = async (name, email, password) => {
  try {
    const response = await api.post(signUpurl, {
      username: name,
      email: email,
      password: password,
    });

    return response.data;
  } catch (error) {
    throw new Error(`Error: ${error.message}`);
  }
};
export const signIn = async (email, password) => {
  try {
    const response = await api.post(loginurl, {
      email: email,
      password: password,
    });
    if (response.status === 200) {
      const tokensString = response.data.tokens.replace(/'/g, '"');
      const tokensObject = JSON.parse(tokensString);
      localStorage.setItem("user", JSON.stringify(tokensObject));
    }
  } catch (error) {
    throw new Error(`${error.response.data.msg}`);
  }
};

export const fetchBlogs = async (page) => {
  try {
    console.log("inside fetch blogs");
    const params = new URLSearchParams({
      page: page,
    });

    const response = await api.get(`${getblogurl}?${params.toString()}`);

    return response.data;
  } catch (error) {
    throw new Error(`${error.response.data.msg}`);
  }
};

export const fetchBlogsByUser = async (page) => {
  try {
    const params = new URLSearchParams({
      page: page,
    });
    const response = await api.get(`${getblogbyuserurl}?${params.toString()}`);
    return response.data;
  } catch (error) {
    throw new Error(`${error.response.data.msg}`);
  }
};

export const createBlog = async (title, content) => {
  try {
    const response = await api.post(createblogurl, {
      title: title,
      content: content,
    });

    return response.data;
  } catch (error) {
    throw new Error(`${error.response.data.msg}`);
  }
};

export const updateBlog = async (id, title, content) => {
  try {
    const url = updateblogurl + id + "/";
    const response = await api.put(url, {
      title: title,
      content: content,
    });
    return await response.data;
  } catch (error) {
    throw new Error(`${error.response.data.msg}`);
  }
};

export const deleteblog = async (id) => {
  try {
    const url = updateblogurl + id + "/";
    const response = api.delete(url);
    return response.data;
  } catch (error) {
    throw new Error(`${error.response.data.msg}`);
  }
};

const apiService = {
  signUp,
  signIn,
  fetchBlogsByUser,
  fetchBlogs,
  createBlog,
  updateBlog,
  deleteblog,
};

export default apiService;
