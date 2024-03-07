type User = {
  name: string;
  age: number;
  married?: boolean;
};

((chapter: string = "복습") => {
  console.log(`\n===[${chapter}]===`);

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
})();

((chapter: string = "3-1") => {
  console.log(`\n===[${chapter}]===`);

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

  let userPick: Pick<User, "name" | "age"> = {
    name: "이기범",
    age: 33,
  };

  console.log(userPick);


})();

((chapter: string = "3-2") => {
  console.log(`\n===[${chapter}]===`);

  //Exclude는 주로 유니온 타입에서 특정 타입을 제외할 때 사용됩니다.
  //Omit은 주로 객체 타입에서 특정 속성을 제외할 때 사용됩니다. Pick의 반대임

  type myExclude<T, U> = T extends U ? never : T;
  type myExtract<T, U> = T extends U ? T : never;

  const excludeUser: myExclude<User, "married"> = {
    name: "장동권",
    age: 44
  }

  const extracString: myExtract<1 | "2" | 3, string> = "2"; // 이건 되는데
  // const extractUser: myExtract<User, "name"> = { name: "이건 왜 안됨?" }; // 객체라서 안되는거임

  type myOmit<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>

  const omitUser: myOmit<User, "age"> = {
    name: "홍",
    married: true
  }


  type NonNullable<T> = T & {}; //{} 는 undefined, null 을 제외한 모든것
  type nonNull = NonNullable<string | number | null>;

})();
