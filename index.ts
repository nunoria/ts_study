// Global
type User = {
   name: string;
   age: number;
   married?: boolean;
};

const ch3_prev = () => {
   type User = {
      name: string;
      age: number;
      married?: boolean;
   };

   type UserCopy = {
      [K in keyof User]: User[K];
   };

   type UserCopy2 = keyof User;

   type UserKey = "name" | "age" | "married";

   let userCopy2: UserCopy2 = "name";
   let userKey: UserKey = "age";

   console.log("keyof User:");
};

// 3-1
const ch3_1 = () => {
   type User = {
      name: string;
      age: number;
      married?: boolean;
   };

   // 인덱스 시그니쳐를 이용한 타입 복사
   type UserCopy = {
      [K in keyof User]: User[K];
   };

   // 제너릭을 이용해서 Type를 매개변수로 받고, ?연산자로 속성을 optional로 바꿔줌
   type Partial<T> = {
      [P in keyof T]?: T[P];
   };

   let userPartial: Partial<User> = {
      name: "홍길동",
   };

   console.log(userPartial);

   type Pick<T, K extends keyof T> = {
      [P in K]: T[P];
   };

   type myPick<T, K extends keyof T> = {
      [P in K]: T[P];
   };

   let userPick: Pick<User, "name" | "age"> = {
      name: "이기범",
      age: 33,
   };

   console.log(userPick);
};

// 3-2
const ch3_2 = () => {
   //Exclude는 주로 유니온 타입에서 특정 타입을 제외할 때 사용됩니다.
   //Omit은 주로 객체 타입에서 특정 속성을 제외할 때 사용됩니다. Pick의 반대임

   type myExclude<T, U> = T extends U ? never : T;
   type myExtract<T, U> = T extends U ? T : never;

   const excludeUser: myExclude<User, "married"> = {
      name: "장동권",
      age: 44,
   };

   const extracString: myExtract<1 | "2" | 3, string> = "2"; // 이건 되는데
   // const extractUser: myExtract<User, "name"> = { name: "이건 왜 안됨?" }; // 객체라서 안되는거임

   type myOmit<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>;

   const omitUser: myOmit<User, "age"> = {
      name: "홍",
      married: true,
   };

   type NonNullable<T> = T & {}; //{} 는 undefined, null 을 제외한 모든것
   type nonNull = NonNullable<string | number | null>;

   let userPartial: Partial<User> = {};
};

// 3-5
const ch3_5 = () => {
   type Array2 = number[];

   type ArrayType = {
      [key in keyof Array2]: Array2[key];
   };

   interface Arr<T> {
      length: number;
      [x: number]: T;
      // forEach: (callback: (v: T, i: number, a: this) => void) => void;
      forEach(callback: (v: T, i: number, a: this) => void): void; // 메소드의 파라미터는 키값이 있어야 하므로 화살표 함수만 가능
   }

   let a: Arr<number | string> = [1, 2, 3, 4];
   let b: Arr<User> = [
      { name: "홍", age: 34 },
      { name: "박", age: 31, married: true },
   ];

   a.forEach((item, idx, arr) => {
      //type guard
      if (typeof item === "number") {
         item.toFixed(0);
      } else if (typeof item === "string") {
         item.slice(0);
      }
      console.log(item, arr.length);
   });

   b.forEach((item, idx, arr) => {
      console.log(item, arr.length);
   });
};

// 3-6
const ch3_6 = () => {
   interface Arr<T> {
      length: number;
      [x: number]: T;
      // forEach: (callback: (v: T, i: number, a: this) => void) => void;
      forEach(callback: (v: T, i: number, a: this) => void): void; // 메소드의 파라미터는 키값이 있어야 하므로 화살표 함수만 가능
      map<R>(callback: (v: T, i: number, a: this) => R): R[];
   }

   let a: Arr<number> = [1, 2, 3, 4];
   let b: Arr<User> = [
      { name: "홍", age: 34 },
      { name: "박", age: 31, married: true },
   ];

   let result = a.map((item) => {
      return item.toString();
   })

   // 결과는??
   console.log(result);

};

const ch3_7 = () => {
   interface Arr<T> {
      [key: number]: T;
      length: number;
      // filter(callback: (v: T, i: number, arr: this) => boolean | undefined): this;
      // filter(callback: (v: T, i: number, arr: this) => boolean | undefined): T[];
      // 아래와 같이 메서드 제너릭에 S 인자를 넣어준것은, 결과값이 T 의 subset 임을 알려두어 조건을 더 강화 하기 위함
      filter<S extends T>(callback: (v: T, i: number, arr: T[]) => boolean| undefined ): S[];
   }

   const testArr: Arr<number> = [1, 2, 3, 4, 5, 6, 7, 8, 9];
   let result = testArr.filter((item):item is number => (item % 2) === 0);

   let len = testArr.length;

   console.log("len:", len);
   console.log("result:", result);

   const testArr2: Arr<number|string> = [1,2,"3","4",5];
   let result2 = testArr2.filter((item):item is string => typeof item ==='string'); // result2 가 

   console.log("result2:", result2);

}




/**********************entry*****************************/
interface Funcs {
   [key: string]: () => void;
}

const chapterFuncs: Funcs = {
   1: ch3_1,
   2: ch3_2,
   5: ch3_5,
   6: ch3_6,
   7: ch3_7,
};

const args = process.argv.slice(2); // 첫 두 항목을 제외한 나머지가 전달된 인자입니다.
const chapterNum = args[0];

if (chapterNum in chapterFuncs) {
   console.clear();
   console.log(`====[3-${chapterNum}]====`);
   chapterFuncs[chapterNum]();
} else {
   console.log("챕터 함수 없음");
}