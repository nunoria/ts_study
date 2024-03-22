/* 챕터 6 */

import axios from 'axios';

interface Post {
    userId: number;
    id: number;
    title: string;
    body: string;
}

const ch6_0 = async () => {

    try {
        const res = await axios.get<Post>('https://jsonplaceholder.typicode.com/posts/1');
        console.log(res.data.userId);

        const res2 = await axios.post<Post>('https://jsonplaceholder.typicode.com/posts', {
            title: 'foo',
            body: 'bar',
            userId: 1,
        })
        console.log(res2.data);
    } catch (e) {
        if (axios.isAxiosError<{ message: string }>(e)) {
            console.log(e.response?.data);
        }
    }
};

type  Axios  = typeof axios   


interface ZaxiosResponse<T> {
    data: T;
}
interface Zaxios  {
    <T>(config:{url:string, method:string}): ZaxiosResponse<T>; // res4
    get: <T>(url: string) => ZaxiosResponse<T>;
    post: <T, D = any>(url: string, data?: D) => ZaxiosResponse<T>;  //res2, res3
}
declare const zaxios: Zaxios;



interface ReqPost {
    tilte: string;
    body: string;
    userId: number;
}

const ch6_1 = async () => {
    try {
        // <Post>는 response.data 의 타입이므로, response 의 타입에 대하여 ZaxiosResponse 타입을 선언해주고
        // 그 안에 data 라는 속성을 가지고 있어야 한다.
        const res = await zaxios.get<Post>('https://jsonplaceholder.typicode.com/posts/1');

        // post 요청시에는 data 매개변수를 any로 두고, 실제로 전달되는 data의 타입으로 추론할수 있도록 한다.
        const res2 = await zaxios.post<Post>('https://jsonplaceholder.typicode.com/posts', {
            title: 'foo',
            body: 'bar',
            userId: 1,
        })

        //
        const res3 = await zaxios.post<Post, ReqPost>('https://jsonplaceholder.typicode.com/posts', {
            tilte: 'foo',
            body: 'bar',
            userId: 1,
        })
    } catch (error) {

    }

    const res4 = zaxios({url: 'https://jsonplaceholder.typicode.com/posts', method: 'GET'});
}

/**********************entry*****************************/
interface Funcs {
    [key: string]: () => void;
}

const chapter6: Funcs = {
    0: ch6_0,
    1: ch6_1,
};

export default chapter6;