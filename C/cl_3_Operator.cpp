//3
//1연
#include<stdio.h>
int main()
{
	int a, b;
	int plus = 0, minus = 0, multi = 0, div = 0, rest = 0;

	printf("두 개의 수를 입력하시오. ");
	scanf("%d %d", &a, &b);
	plus = a + b;
	minus = a - b;
	multi = a * b;
	div = a / b; //나눗셈
	rest = a % b; //나머지

	printf("%d + %d = %d\n", a, b, plus);
	printf("%d - %d = %d\n", a, b, minus);
	printf("%d * %d = %d\n", a, b, multi);
	printf("%d / %d = %d\n", a, b, div);
	printf("%d %% %d = %d\n", a, b, rest);

	return 0;
}
//1-1 자
#include<stdio.h>
int main()
{
	int a, b, c;
	int sum = 0;
	double avg = 0;

	scanf("%d %d %d", &a, &b, &c);
	sum = a + b + c;
	avg = sum / 3;
	printf("sum : %d\n", sum);
	printf("avg : %d\n", (int)avg);

	return 0;
}




//2 연
#include<stdio.h>
int main()
{
	int a, b, c, d, e;
	int plus, minus, multi, div, rest;

	scanf("%d %d %d %d %d", &a, &b, &c, &d, &e);
	plus = a + 3;
	minus = b - 3;
	multi = c * 3;
	div = d / 3;
	rest = e % 3;

	printf("%d %d %d %d %d", plus, minus, multi, div, rest);

	return 0;
}
//더 간단히 풀 수 있음
//2-1 자
#include<stdio.h>
int main()
{
	int a, b;
	int plus, rest;

	scanf("%d %d", &a, &b);
	plus = a + 100;
	rest = b % 10;

	printf("%d %d", plus, rest);

	return 0;
}



//3연
#include<stdio.h>
int main()
{
	int a = 10, b = 10;

	printf("최초값 a=%d, b=%d\n", a, b);
	printf("\n");
	printf("\n");

	printf("a++ = %d, ++b = %d\n", a++, ++b);
	printf("실행 후 a = %d, b = %d\n", a, b);
	printf("\n");
	printf("\n");

	printf("a-- = %d, --b = %d\n", a--, --b);
	printf("실행 후 a = %d, b = %d\n", a, b);

	return 0;
}
//3-1 자
#include<stdio.h>
int main()
{
	int a;

	scanf("%d", &a);
	printf("%d\n", a++);
	a++;

	printf("%d\n", a++);

	return 0;
}



//4 연
#include<stdio.h>
int main()
{
	int a, b, c = 0;

	scanf("%d %d", &a, &b);
	c = ++a + b--;
	printf("a = %d, b = %d, c = %d", a, b, c);

	return 0;
}
//4-1 자
#include<stdio.h>
int main()
{
	int a, b, multi = 0;

	scanf("%d %d", &a, &b);
	multi = a++ * --b;
	printf("%d %d %d", a, b, multi);

	return 0;
}



//5 연
#include<stdio.h>
int main()
{
	int a, b, c;
	int r1, r2, r3, r4;

	scanf("%d %d %d", &a, &b, &c);
	r1 = a == b;
	r2 = b == c;
	r3 = a != b;
	r4 = b != c;

	printf("%d %d %d %d", r1, r2, r3, r4);

	return 0;
}
//5-1 자
#include<stdio.h>
int main()
{
	int a, b;
	int r1, r2;

	scanf("%d %d", &a, &b);
	r1 = a == b;
	r2 = a != b;

	printf("%d\n", r1);
	printf("%d\n", r2);

	return 0;
}



//6 연
#include<stdio.h>
int main()
{
	int a, b, c;
	int r1, r2, r3, r4;

	scanf("%d %d %d", &a, &b, &c);
	r1 = a > b;
	r2 = b >= c;
	r3 = a <= b;
	r4 = b < c;

	printf("%d %d %d %d", r1, r2, r3, r4);

	return 0;
}
//정리해주면 좋음, 모아주질 못함
//6-1 자
#include<stdio.h>
int main()
{
	int a, b;
	int r1, r2, r3, r4;

	scanf("%d %d", &a, &b);
	r1 = (a > b);
	r2 = (a < b);
	r3 = (a >= b);
	r4 = (a <= b);

	printf("%d > %d --- %d\n", a, b, r1);
	printf("%d < %d --- %d\n", a, b, r2);
	printf("%d >= %d --- %d\n", a, b, r3);
	printf("%d >= %d --- %d\n", a, b, r4);

	return 0;
}



//7 연
#include<stdio.h>
int main()
{
	int a = 0, b = 1, c = 2;
	int r1, r2, r3, r4;

	r1 = (a && b);
	r2 = (a || b);
	r3 = (b && c);
	r4 = (!a);

	printf("%d %d %d %d", r1, r2, r3, r4);
	return 0;
}
//7-1 자
#include<stdio.h>
int main()
{
	int a, b, r1, r2;
	scanf("%d %d", &a, &b);

	r1 = (a && b);
	r2 = (a || b);

	printf("%d %d", r1, r2);
	return 0;
}



//8 연
#include<stdio.h>
int main()
{
	int a = 0, b = 1, c = 2;
	int r1 = (a != b) || (b == c);
	int r2 = (a < b) && (a <= c);
	int r3 = (a <= b) != (b <= c);
	int r4 = !a;

	printf("%d %d %d %d", r1, r2, r3, r4);
	return 0;
}
//8-1 자
#include<stdio.h>
int main()
{
	int a, b, c;
	int r1, r2;

	scanf("%d %d %d", &a, &b, &c);
	r1 = (c < b < a);
	r2 = (c == b == a);

	printf("%d %d", r1, r2);
	return 0;
}
//ㄴ> 의심적음



//3 evaluation
//1
#include<stdio.h>
int main() {
	int a, b, c, d;
	int sum = 0, avg = 0;

	scanf("%d %d %d %d", &a, &b, &c, &d);

	sum = a + b + c + d;
	avg = sum / 4;
	printf("sum %d\n", sum);
	printf("avg %d", avg);

	return 0;
}
//2
#include<stdio.h>
int main() {
	int a, b;
	int div = 0, rest = 0;

	scanf("%d %d", &a, &b);

	div = a / b;
	rest = a % b;

	printf("%d / %d = %d...%d\n", a, b, div, rest);
	return 0;
}
//3
#include<stdio.h>
int main() {
	int a, b;
	int wight = 0, length = 0, area = 0;

	scanf("%d %d", &a, &b);
	wight = a + 5;
	length = b * 2;
	area = wight * length;

	printf("wight = %d\n", wight);
	printf("length = %d\n", length);
	printf("area = %d\n", area);

	return 0;
}
//4
#include<stdio.h>
int main() {
	int mHight, mWeight, kHight, kWeight, result;

	scanf("%d %d", &mHight, &mWeight);
	scanf("%d %d", &kHight, &kWeight);

	result = (kHight < mHight) && (kWeight < mWeight);

	printf("%d", result);

	return 0;
}