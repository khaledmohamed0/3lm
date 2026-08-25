
import axios from "axios";


const api = axios.create({
    baseURL: "http://127.0.0.1:8000/api",
});


/*
|----------------------------------------------------------------------
| Request Interceptor
|----------------------------------------------------------------------
*/

api.interceptors.request.use(

    (config) => {

        const accessToken =
            localStorage.getItem("access_token");


        if (accessToken) {

            config.headers.Authorization =
                `Bearer ${accessToken}`;

        }


        /*
        | IMPORTANT
        |
        | Do NOT set Content-Type manually.
        |
        | For FormData, Axios/browser will automatically
        | set:
        |
        | multipart/form-data; boundary=...
        |
        | For normal JSON requests Axios handles it normally.
        */

        return config;

    },

    (error) => {

        return Promise.reject(error);

    }

);


/*
|----------------------------------------------------------------------
| Refresh Token Logic
|----------------------------------------------------------------------
*/

let isRefreshing = false;

let failedQueue = [];


const processQueue = (
    error,
    token = null
) => {

    failedQueue.forEach(
        ({ resolve, reject }) => {

            if (error) {

                reject(error);

            } else {

                resolve(token);

            }

        }
    );


    failedQueue = [];

};


/*
|----------------------------------------------------------------------
| Response Interceptor
|----------------------------------------------------------------------
*/

api.interceptors.response.use(

    (response) => {

        return response;

    },


    async (error) => {

        const originalRequest =
            error.config;


        /*
        | Only handle 401
        */

        if (
            error.response?.status !== 401 ||
            originalRequest?._retry
        ) {

            return Promise.reject(error);

        }


        /*
        | Never refresh login request
        */

        if (
            originalRequest?.url?.includes(
                "/auth/login/"
            )
        ) {

            return Promise.reject(error);

        }


        /*
        | Get refresh token
        */

        const refreshToken =
            localStorage.getItem(
                "refresh_token"
            );


        /*
        | No refresh token
        */

        if (!refreshToken) {

            localStorage.removeItem(
                "access_token"
            );

            localStorage.removeItem(
                "refresh_token"
            );


            window.location.href =
                "/login";


            return Promise.reject(error);

        }


        /*
        | Another request is already refreshing
        */

        if (isRefreshing) {

            return new Promise(
                (resolve, reject) => {

                    failedQueue.push({
                        resolve,
                        reject,
                    });

                }
            )
                .then((token) => {

                    originalRequest
                        .headers
                        .Authorization =
                        `Bearer ${token}`;


                    return api(
                        originalRequest
                    );

                });

        }


        originalRequest._retry = true;

        isRefreshing = true;


        try {

            /*
            | Refresh access token
            */

            const response =
                await axios.post(

                    "http://127.0.0.1:8000/api/auth/token/refresh/",

                    {
                        refresh:
                            refreshToken,
                    }

                );


            const newAccessToken =
                response.data.access;


            /*
            | Save new access token
            */

            localStorage.setItem(
                "access_token",
                newAccessToken
            );


            /*
            | Resolve queued requests
            */

            processQueue(
                null,
                newAccessToken
            );


            /*
            | Retry original request
            */

            originalRequest
                .headers
                .Authorization =
                `Bearer ${newAccessToken}`;


            return api(
                originalRequest
            );


        } catch (refreshError) {

            /*
            | Refresh failed
            */

            processQueue(
                refreshError,
                null
            );


            localStorage.removeItem(
                "access_token"
            );

            localStorage.removeItem(
                "refresh_token"
            );


            window.location.href =
                "/login";


            return Promise.reject(
                refreshError
            );


        } finally {

            isRefreshing = false;

        }

    }

);


export default api;

