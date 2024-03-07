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

((chapter: string = "3-1") => {
  console.log(`\n===[${chapter}]===`);
})();
