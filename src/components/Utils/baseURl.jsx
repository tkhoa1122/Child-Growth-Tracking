import api from "./Axios";

//example of how to use the api
api.get('/children')
.then((res) => {
    console.log(res);
})
.catch((err) => {
    console.log(err);
});
