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

   type UserPartial = Partial<User>;

   let userPartial: Partial<User> = {
      name: "홍길동",
   };

   let userPartialEmpty: Partial<User> = {};

   // 속성중 일부만 optional 로 하려면???
   // type SelectPartial<T, S> = {
   //    "selected":[K]?: T[K],
   //    "unselected":string
   // }[ k in keyof T extends S ? "selected": "unselected"];

   // type Test = SelectPartial<User, 'name'>;


   type Required<T> = {
      [k in keyof T]-?: T[k];
   };

   type UserRequired = Required<UserPartial>;

   // 이건 T가 가지고 있지 않는 속성을 넣는 경우 에러가 남
   type Pick<T, K extends keyof T> = {
      [P in K]: T[P];
   };

   // 조건걸고 범위를 벋어나면 never로
   type MyPick<T, K> = {
      [P in K extends keyof T ? K : never]: T[P];
   };

   // 범위에 없는것을 넣어도 에러 발생하지 않고, 마스킹 됨
   let userPick: MyPick<User, "name" | "age" | "sex"> = {
      name: "이기범",
      age: 33,
   };

   console.log(userPick);


   type Record<K extends keyof any, T> = {
      [P in K]: T;
   };

   type myRecord = Record<"name" | "id", string>;
};

// 3-2
const ch3_2 = () => {
   //Exclude는 주로 유니온 타입에서 특정 타입을 제외할 때 사용됩니다.
   //Omit은 주로 객체 타입에서 특정 속성을 제외할 때 사용됩니다. Pick의 반대임

   type myExclude<T, U> = T extends U ? never : T;
   type myExtract<T, U> = T extends U ? T : never;

   type Ex = ("1" | 2 | "3");
   type Ex2 = myExclude<Ex, string>;

   const excludeUser: myExclude<User, "married"> = {
      name: "장동권",
      age: 44,
   };

   const extracString: myExtract<1 | "2" | 3, string> = "2"; // 이건 되는데
   // const extractUser: myExtract<User, "name"> = { name: "이건 왜 안됨?" }; // 객체라서 안되는거임

   type myOmit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

   const omitUser: myOmit<User, "age"> = {
      name: "홍",
      married: true,
   };

   type NonNullable<T> = T & {}; //{} 는 undefined, null 을 제외한 모든것
   type nonNull = NonNullable<string | number | null>;

   // 속성중 일부만 optional 로 하려면???
   type selcetPartail<T, S extends keyof T> = Partial<Pick<T, S>> & Omit<T, S>;
   // Partial<Pick<T,S>>

   type MyPick<T, S extends keyof T> = {
      [P in S]?: T[P]
   }

   // type selcetPartailDetail<T, S extends keyof T>  = {
   //    [P in (keyof T extends S? never:key of T)]: T[P]
   // } & {
   //    [P in S]?: T[P]
   // }

   // type myExclude<T, U> = T extends U ? never : T;

   type myExclude2<T, S> = T extends S ? never : S

   type MyPartial2<T> = {
      [K in keyof T]?: T[K]
   }


};

declare function declareFunc(a: string, b: number, c: boolean): { r: string };

// 3-3 Parameters
const ch3_3 = () => {
   type AllFuncs = (...args: any) => any;
   type AllConstructorFuncs = abstract new (...args: any) => any;

   type Parmameters<T extends AllFuncs> = T extends (...args: infer P) => any ? P : never;
   type ReturnTypes<T extends AllFuncs> = T extends (...args: any) => infer R ? R : never;

   const testFunc = (a: string, b: number, c: boolean): { r: string } => {
      return { r: "안녕" };
   }

   type params = Parmameters<typeof testFunc>;
   type params2 = ReturnTypes<typeof declareFunc>;

   type ConstructorPameters<T extends AllConstructorFuncs> =
      T extends abstract new (...args: infer P) => any ? P : never;

   type InstanceType<T extends AllConstructorFuncs> =
      T extends abstract new (...args: any) => infer R ? R : never;

   class TestClass {
      public id: number = 1;
      constructor(private a:number, private b:string) {
      }
      
   }

   type Param3 = ConstructorPameters<typeof TestClass>;
   type Instacne = InstanceType<typeof TestClass>;

}

// 3-5 foreach
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

// 3-6 map
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

// 3-7 filter
const ch3_7 = () => {
   interface Arr<T> {
      [key: number]: T;
      length: number;
      // filter(callback: (v: T, i: number, arr: this) => boolean | undefined): this;
      filter(callback: (v: T, i: number, arr: this) => boolean | undefined): T[];
      // 아래와 같이 메서드 제너릭에 S 인자를 넣어준것은, 결과값이 T 의 subset 임을 알려두어 조건을 더 강화 하기 위함
      //  filter<S extends T>(callback: (v: T, i: number, arr: T[]) => boolean | undefined): S[];
   }

   const testArr: Arr<number> = [1, 2, 3, 4, 5, 6, 7, 8, 9];
   let result = testArr.filter((item): item is number => (item % 2) === 0);

   console.log("result:", result); // [2,4,6,8]

   const testArr2: Arr<number | string> = [1, 2, "3", "4", 5];
   let result2 = testArr2.filter((item): item is string => typeof item === 'string'); // result2 가 

   console.log("result2:", result2);

}

// 3-8 reduce
const ch3_8 = () => {
   interface Arr<T> {
      [key: number]: T;
      length: number;
      reduce(callbcak: (r: T, v: T, i: number, arr: this) => T): T;   //result
      // reduce(callbcak: (r: any, v: T, i: number, arr: this) => any, init: any): any;     // result2
      reduce<R>(callbcak: (r: R, v: T, i: number, arr: this) => R, init: R): R;     // result2
   }

   const a: Arr<number> = [1, 2, 3, 4, 5, 6, 7];
   const b = [1, 2, 3, 4, 5, 6, 7];

   const result = a.reduce((sum, item) => sum + item);
   // const result = a.reduce((sum, item) => sum + item, 7);
   const result2: string = a.reduce((sum, item) => sum + item.toString(), "");

   console.log(result);
   console.log(result2);

}

// 3-9 flat
const ch3_9 = () => {

   type FlatArray<Arr, Depth extends number> = {
      "done": Arr,
      "recur": Arr extends ReadonlyArray<infer InnerArr>
      ? FlatArray<InnerArr, [-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][Depth]>
      : Arr
   }[Depth extends -1 ? "done" : "recur"];


   interface Arr<T> {
      [key: number]: T;
      length: number;
      flat<A, D extends number = 1>(
         this: A,
         depth?: D
      ): FlatArray<A, D>[];
   }

   const A: Arr<number | (number | number[])[]> = [1, [2, 3], [4, [5, 6]], 7];
   const B = [1, [2, 3], [4, [5, 6]], 7];
   let result = B.flat(2);

   // FlatArray< (number| (number | number[])[])[], 2>
   // FlatArray< number | (number | number[])[], 1>
   // FlatArray< number | number[], 0>
   // FlatArray< number, -1>   ==> 최종 도달하는 위치이고, flat 매서드 리턴에[] 가 있으므로 number[] 

   console.log(result);

   type GetInner<Arr> = Arr extends ReadonlyArray<infer Inner> ? Inner : never;

   type innerArrayType = GetInner<typeof B>;
   type innerArrayType2 = GetInner<innerArrayType>;
   type innerArrayType3 = GetInner<innerArrayType2>;
}

const ch3_10 = () => {
}

interface Funcs {
   [key: string]: () => void;
}

const chapter3: Funcs = {
   1: ch3_1,
   2: ch3_2,
   3: ch3_3,
   5: ch3_5,
   6: ch3_6,
   7: ch3_7,
   8: ch3_8,
   9: ch3_9,
   10: ch3_10,
};

export default chapter3;


