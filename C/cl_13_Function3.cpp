//13 only hp
//1 
#include<stdio.h>  
void R(int N) {
    if (N == 0) return; // if()return은 break;를 주는 것과 같은 작용 &&재귀함수 꼭 있어야 하는 조건: if()return 
    R(N / 2);           // 이 문장도 조건을 주는것과 같은 작용 
    printf("%d ", N);
}
int main() {
    int N;

    scanf("%d", &N);
    R(N);
    return 0;
}

//2 
#include<stdio.h>  
void R(int N) {
    if (N < 1) return; // 0포함 음수도 뽑지X
    R(N - 2);          // 들어오는 숫자에 따라서 이전 수가 add||even이 될 수 있음  
    printf("%d ", N);
}
int main() {
    int N;
    scanf("%d", &N);
    R(N);
    return 0;
}


//3 


//4
#include <stdio.h> 
int S(int n) {
    if (n == 1)return 1;
    if (n == 2)return 2;
    return (S(n - 1) * S(n - 2)) % 100; // 이 식이 끝난 후에 return을 int S에 넣어져서 int main들어갔을때  sum과 같은 작용 
}
int main() {
    int n;
    scanf("%d", &n);
    printf("%d", S(n));
    return 0;
}




//5 
#include<stdio.h>   
int sort(int n) {
    if (n == 1)return 0;
    if (n % 2 == 0)return sort(n / 2) + 1;
    else return sort(n / 3) + 1;                // 위 식에 대해단 반대가 else에 당연히 적용되니 return이 printf처럼보고 
}
int main() {
    int n;
    scanf("%d", &n);
    printf("%d", sort(n)); //sort(n)은 몇개 입력되었는지에 대해 저장한 숫자 
    return 0;
}




//6  xn이 나오는 부분부터 이해부족
#include<stdio.h>  
int sort(long long n) {
    int xn;
    if (n == 0) return;
    xn = n % 10;
    if (xn == 0)xn = 1;
    return sort(n / 10) * xn;
}
int main() {
    long long a, b, c;
    scanf("%lld %lld %lld", &a, &b, &c);
    printf("%d", sort(a * b * c));
    return 0;
}

