# 3장 : lib.es5.d.ts 분석
> 범위: 3-1~3-11 


### [3.1] Partial, Required,Readonly,Pick,Record


`사전 필수 지식`

✅ 인덱스 시그니쳐의 in keyof 사용법을 정확히 이해해야함

✅ 제네릭안에서  extends 사용
> 특정 타입의 서브타입이나 특정 조건을 충족하는 타입을 지정할 수 있음. 즉, 타입에 제한할수 있음. 일반적인 class, interface 에서 extends 는 상속 및 확장 가능의 개념인데, 제너릭에서는 subset으로 제한한다
</aside>

- Partial
    
    ```typescript
    type User = {
      name: string;
      age: number;
      married: boolean;
    };
    
    // 인덱스 시그니쳐를 이용한 타입 복사
    type UserCopy = {
      [K in keyof User] : User[K]
    }
    
    // 제너릭을 이용해서 Type를 매개변수로 받고, ?연산자로 속성을 optional로 바꿔줌
    type Partial<T> = {
        [P in keyof T]?: T[P];
    };
    
    type UserPartial = Partial<User>
    
    type UserPartial = {
      name?: string;
      age?: number;
      married?: boolean;
    };
    
    // 사용 예시
    let userPartial : Partial<User> = {
    	name:"홍길동"
    }
    
    // 문제점 아래와 같이 해도 문제가 없음 => 그래서 Pick을 쓴다
    let userPartial : Partial<User> = {};
    
    // 속성중 일부만 optional 로 하려면???
    ```
    
- Required - Partial 반대
    
    ```typescript
    // optional 만 "-" 해주면, 모든속성이 required 가 되겠다
    type Required<T> = {
        [P in keyof T]-?: T[P];
    };
    ```
    
- Readonly
    
    ```typescript
    // readonly 붙여주면 되고, -readonly 도 해볼수 있겠다.
    type Readonly<T> = {
        readonly [P in keyof T]: T[P];
    };
    ```
    
- Pick
    
     
    
    ```typescript
    // Partial 은 변수 선언이후, 어떤 속성(subset)을 사용할지 변동 가능
    // Pick 은 선언시점에 어떤 속성(subset)을 사용할지 확정
    
    type Pick<T, K extends keyof T> = {
        [P in K]: T[P];
    };

    // 조건걸고 범위를 벋어나면 never로
   type MyPick<T, K> = {
      [P in K extends keyof T ? K : never]: T[P];
   };

    ```
    
- Omit
    
    ```typescript
    type myOmit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

   const omitUser: myOmit<User, "age"> = {
      name: "홍",
      married: true,
   };
    ```
    
- Record
    
    ```typescript
  type Record<K extends keyof any, T> = {
      [P in K]: T;
   };

   type myRecord = Record<"name" | "id",string>;
    ```
### [3.2]

<aside>
✅ Exclude,Extract는 주로 유니온 타입에서 특정 타입을 제외할 때 사용됩니다.

✅ Omit은 주로 객체 타입에서 특정 속성을 제외할 때 사용됩니다. Pick의 반대임

</aside>

- Exclude
```typescript
type Exclude<T,E> = T extends E ? never : T 

type Ex = ("1" | 2 | "3");
type Ex2 = myExclude<Ex, string>;

//객체도 되네
const excludeUser: myExclude<User, "married"> = {
    name: "장동권",
    age: 44,
};


```
- Extract
```typescript
type myExtract<T, U> = T extends U ? T : never;

const extracString: myExtract<1 | "2" | 3, string> = "2"; // 이건 되는데
// const extractUser: myExtract<User, "name"> = { name: "이건 왜 안됨?" }; // 객체라서 안되는거임

```

- NonNullable
```typescript
type NonNullable<T> = T & {}; //{} 는 undefined, null 을 제외한 모든것
type nonNull = NonNullable<string | number | null>;  // string |number


```

### [3.3]

### [3.4]

### [3.5] forEach 만들기

- Array 를 interface Arr 타입으로 새로 작성
    
    ```typescript
      interface Arr<T> {
        length:number;
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
    ```
    

### [3.6] map 만들기

- map 리턴값은  배열이다. `type[]`  형태여야함
- callback 함수의 리턴값이 있다.
    - 리턴이 어떤값이 올지 예측이 가능한가???? 리턴값의 타입은 요소의 타입과 다를수 있다.ex) `return item.toString()`
- callback 의 리턴값과 map 의 리턴값은 같은 타입을 갖으므로 제너릭으로 연결

```typescript
   interface Arr<T> {
      length: number;
      [x: number]: T;
      // forEach: (callback: (v: T, i: number, a: this) => void) => void;
      forEach(callback: (v: T, i: number, a: this) => void): void; // 메소드의 파라미터는 키값이 있어야 하므로 화살표 함수만 가능
      map<R>(callback: (v: T, i: number, a: this) => R): R[];
   }
```

<aside>
📌 함수의 경우 사용시에 제너릭 인수를 요구하는데, 메서드 map 에 제너릭 <R> 은 왜 사용할때  인수를 요구하지 않는가?

gpt 답변
”주요 차이점은 **제너릭을 사용하는 대상**입니다. 함수의 경우 함수 자체에 제너릭을 적용하고, **메서드의 경우** 클래스나 인터페이스에 제너릭을 적용합니다”

</aside>

```typescript
class Container<T> {
  private value: T;

  constructor(value: T) {
    this.value = value;
  }

  // 클래스 수준에서 선언된 제너릭 타입을 메서드에서 사용
  getValue(): T {
    return this.value;
  }

  // 메서드 수준에서 추가적인 제너릭 타입도 선언 가능
  map<U>(mapper: (value: T) => U): Container<U> {
    return new Container<U>(mapper(this.value));
  }
}

const numberContainer = new Container<number>(42);
const stringValue = numberContainer.map(value => value.toString()).getValue();
```

### [3.7] filter 만들기

- filetr 는 callback 이 true 인 것만 모아서 배열만들기
    
    1) callback 리턴은 boolean 또는 리턴을 안하는경우도 있을것
    
    2) 원래 타입의 배열을 리턴 
    
    ```typescript
       interface Arr<T> {
          [key: number]: T;
          length: number;
          // filter(callback: (v: T, i: number, arr: this) => boolean | undefined): this;
           filter(callback: (v: T, i: number, arr: this) => boolean | undefined): T[];
          // 아래와 같이 메서드 제너릭에 S 인자를 넣어준것은, 결과값이 T 의 subset 임을 알려두어 조건을 더 강화 하기 위함
          //filter<S extends T>(callback: (v: T, i: number, arr: this) => boolean | undefined): S[];
       }
    
       const testArr: Arr<number> = [1, 2, 3, 4, 5, 6, 7, 8, 9];
       let result = testArr.filter((item) => (item % 2) === 0);
       
       const testArr2: Arr<number|string> = [1,2,"3","4",5];
       let result2 = testArr2.filter(item => typeof item ==='string');
       
       // result2는 (number | string)[]  => string[]로 어떻게 바꿀수 있나???
    ```
    
- 고민은, 원래 타입이 string|number union이고 filter의 결과를 대한 string 타입으로 좁히고 싶다는것
    
    **커스텀 타입가드 사용, 형식조건자 사용  ????????? 이해 못함**
    

```typescript
v is S
```

### [3.8] reduce 만들기

- inital 값이 있고 없고의 경우를 나눠서 함수 overloading 을 사용
- 초기값이 있는경우, 초기값에 의해 타입이 고정 되도록 한다.

```typescript
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

   console.log(result);  // 28
   console.log(result2);  // "1234567"
```

### [3.9] flat 분석

뇌정지!! 오늘의한줄평 저자는 변태

핵심음 depth를 어떻게 줄여나가는가를 이해하는것! 리커시브

```typescript
   type FlatArray<Arr, Depth extends number> = {
    "done": Arr,
    "recur": Arr extends ReadonlyArray<infer InnerArr>
        ? FlatArray<InnerArr, [-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][Depth]>
        : Arr
		}[Depth extends -1 ? "done" : "recur"];
   
   
   
   interface Array<T> {
      flat<A, D extends number = 1>(
         this: A,
         depth?: D
      ): FlatArray<A, D>[];
   }
   
   
   const B = [1, 2, [3,4] ];
   let result = B.flat();
```

- flat 매서드의 타입 설명
1. **`flat`** 함수는 두 개의 제너릭 타입 매개변수를 가지고 있음
    - **`A`**: 평탄화될 배열의 타입입니다.
    - **`D extends number = 1`**: 평탄화할 깊이(depth)를 나타내는 타입 매개변수입니다. **`extends number`**는 **`D`**가 반드시 숫자 타입이어야 한다는 제약을 나타내며, **`= 1`**은 기본값으로 1을 갖는다는 의미입니다.
2. **`this: A`**: 함수 내에서 **`this`** 키워드가 **`A`** 타입을 가져야 함을 명시합니다. 이는 함수가 메서드로 사용될 때 해당 객체에 대한 타입 정보를 유지하기 위한 것입니다.
3. **`depth?: D`**: 함수의 두 번째 매개변수로 깊이를 나타내는 **`D`** 타입입니다. 이 매개변수는 선택적이며, 생략될 경우 기본값으로 1을 가집니다.
4. **`FlatArray<A, D>[]`**: 함수의 반환 타입으로 **`FlatArray<A, D>`** 배열을 가집니다. 이는 **`FlatArray`**라는 타입에 대한 배열이며, 해당 타입은 평탄화된 배열을 나타냅니다.

- FlatArray 의 타입설명
1. 타입 객체 정의후 바로 접근자[] 사용시 어떻게 동작하는지 알아야 함
`type A = {name:string, age:number} ['age']` 
 ⇒ type A는 number 이다.
2.  **컨디셔널 타입**
`A extends B ? C :D` 
 ⇒ A타입이 B타입의 부분집합일때 C타입, 아니면 D타입
3.  **infer**
일반적으로 **`infer`**는 이 **컨디셔널 타입**내에서 타입을 추론하기 위해 사용됩니다.