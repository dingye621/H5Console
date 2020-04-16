const token='';
var config = {
    authority: "http://10.109.75.229:9000",
    client_id: "gis_test",
    redirect_uri: "http://localhost:8089/callback.html",
    response_type: "code",
    scope:"openid profile api1",
    post_logout_redirect_uri: "http://localhost:8089/index.html",
};
var mgr = new Oidc.UserManager(config);


// async function getToken()
// {
//     await mgr.getUser().then(function (user) {
//         console.log('user',user);
//         if (user) {
//             token=user.access_token;
//         }
//         else {
//             mgr.signinRedirect();
//             //await getToken();
//         }
//     });
// }
// getToken();

 axios.interceptors.request.use(
        config => {

        mgr.getUser().then(function (user) {
            console.log('user',user);
            if (user) {
                token=user.access_token;

                console.log('token..',token)
                        if (token) {
                            config.headers.Authorization = `bearer ${token}`;
                        }
                //         if (process.env.NODE_ENV !== 'production') {
                //             console.log(config);
                //         }
                return config;


            }
            else {
                mgr.signinRedirect();
             
            }
        });

       
    
    //          var token = window.localStorage.getItem(TOKEN)
    //                 if (token) {
    //                     config.headers.Authorization = `bearer ${token}`;
    //                 }
    //                 if (process.env.NODE_ENV !== 'production') {
    //                     console.log(config);
    //                 }
    //         return config;
        },
        err => {
            return Promise.reject(err);
        }
    );
    
    axios.interceptors.response.use(
        response => {
            return response;
        },
        error => {
            console.error(error);
            console.error(error.response);
            var resp = error.response;
            if (resp) {
                const status = resp.status;
                switch (status) {
                    case 400:
                        if (resp.data) {
                            const errs = resp.data.errors;
                            if (errs !== undefined) {
                                let error = '';
                                for (let item in errs) {
                                    error += `${errs[item]}\n`
                                }
                                message.error(error);
                            }
                        }
                        break;
                    case 401:
                      //  window.localStorage.removeItem(TOKEN);
                       // window.location.href = LOGIN;
    mgr.signinRedirect();
                        break;
                    case 403:
                        message.error('没有权限！');
                        break;
                    case 451:
                        message.error('未激活License！');
                        break;
                    case 500:
                    case 501:
                        if (resp.data) {
                            message.error(resp.data.message);
                        }
                        break;
                    default:
                        //console.error(error.response);
                        break;
                }
            }
    
            return Promise.reject(error)
        }
    );


