//hp 2
//1
#include<stdio.h>
int main() {
	int n = 10;
	char a = 'A';

	printf("%d\n", n);
	printf("%c\n", a);

	return 0;
}



//2
#include<stdio.h>
int main() {
	int a = 20, b = 10;

	printf("%d %d", a, b);

	return 0;
}



//3
#include<stdio.h>
int main() {
	int a, b;

	a = 10;
	b = 20;

	printf("%d + %d = %d\n", a, b, a + b);

	a = 30;
	b = 40;
	printf("%d + %d = %d\n", a, b, a + b);

	return 0;
}
//3-1
#include<stdio.h>
int main() {
	int a, b;

	a = 55;
	b = 10;

	printf("%d - %d = %d\n", a, b, a - b);

	a = 2008;
	b = 1999;
	printf("%d - %d = %d\n", a, b, a - b);

	return 0;
}



//4
#include<stdio.h>
int main() {
	int a = 5, b;
	double c = 3.14;

	b = 2;
	printf("원주 = %d * %d * %8.6f = %8.6f\n", a, b, c, a * b * c);

	b = 5;
	printf("넓이 = %d * %d * %8.6f = %8.6f\n", a, b, c, a * b * c);

	return 0;
}



//5
#include<stdio.h>
int main() {
	double a = 1.234;
	double b = 10.3459;

	printf("전체 7자리로 맞추고 소수 4자리까지 출력\n");
	printf("x = %7.4f\n", a);
	printf("y = %7.4f\n", b);
	printf("\n");
	printf("\n");
	printf("소수 2자리까지 출력(반올림)\n");
	printf("x = %.2f\n", a);
	printf("y = %.2f\n", b);

	return 0;
}
//5-1
#include<stdio.h>
int main() {
	double yd = 2.1;
	double in = 10.5;

	printf("%4.1fyd = %5.1fcm\n", yd, yd * 91.44);
	printf("%4.1fin = %5.1fcm\n", in, in * 2.54);

	return 0;
}



//6
#include<stdio.h>
int main() {
	int age;

	printf("당신의 나이는 몇 살입니까? ");
	scanf("%d", &age);
	printf("당신의 나이는 %d살 이군요", age);

	return 0;
}
//6-1
#include<stdio.h>
int main() {
	int cm;

	printf("height = ");
	scanf("%d", &cm);

	printf("Your height is %dcm", cm);

	return 0;
}



//7
#include<stdio.h>
int main() {
	int a, b, sum = 0, sum2 = 0;

	printf("두 수를 입력하시오. ");
	scanf("%d %d", &a, &b);

	sum = a + b;
	sum2 = a * b;

	printf("%d + %d = %d\n", a, b, sum);
	printf("%d * %d = %d\n", a, b, sum2);

	return 0;
}
//7-1
#include<stdio.h>
int main() {
	int a, b, sum = 0, sum2 = 0;

	scanf("%d %d", &a, &b);

	sum = a * b;
	sum2 = a / b;

	printf("%d + %d = %d\n", a, b, sum);
	printf("%d / %d = %d\n", a, b, sum2);

	return 0;
}



//8
#include<stdio.h>
int main() {
	int cm;
	double weight;
	char name;

	printf("키를 입력하세요. ");
	scanf("%d", &cm);

	printf("몸무게를 입력하세요. ");
	scanf("%lf", &weight);

	printf("이름을 입력하세요. ");
	scanf(" %c", &name);

	printf("키 = %d\n", cm);
	printf("몸무게 = %.1f\n", weight);
	printf("이름 = %c\n", name);

	return 0;
}
//8-1
#include<stdio.h>
int main() {
	double a, b;
	char ch;

	scanf("%lf", &a);
	scanf("%lf", &b);
	scanf(" %c", &ch);

	printf("%5.2f\n", a);
	printf("%6.2f\n", b);
	printf("%c", ch);

	return 0;
}
//9
#include<stdio.h>
int main() {
	double x, y;

	printf("두 개의 실수를 입력하시오.\n");
	scanf("%lf\n", &x);
	scanf("%lf", &y);

	printf("x = %4.2f\n", x);
	printf("y = %6.2f", y);

	return 0;
}
//ㄴ>수정 필요
//9-1
#include<stdio.h>
int main() {
	double x, y, z;

	scanf("%lf\n", &x);
	scanf("%lf\n", &y);
	scanf("%lf", &z);

	printf("%.3f\n", x);
	printf("%.3f\n", y);
	printf("%.3f", z);

	return 0;
}

//2 evaluation
//1
#include<stdio.h>
int main() {
	int x = 10, y = 20;

	printf("%d + %d = %d\n", x, y, x + y);

	return 0;
}
//2
#include<stdio.h>
int main() {
	double x = 80.50, y = 22.34;

	printf("%10.2f %10.2f %10.2f", x, y, x + y);

	return 0;
}
//3
#include<stdio.h>
int main() {
	double x = 100.12;
	int y = 50;

	printf("%.2f * %d = %.f", x, y, x * (double)y);

	return 0;
}
//4
#include<stdio.h>
int main() {
	int x, y, z;
	int sum = 0;

	scanf("%d %d %d", &x, &y, &z);
	sum = x + y + z;

	printf("sum = %d", sum);

	return 0;
}
//5
#include<stdio.h>
int main() {
	double yard = 91.44, sum = 0;


	printf("yard? ");
	scanf("%f", &yard);

	sum = yard * 10.1;

	printf("10.1yard = %.1fcm", sum);

	return 0;
}
//6
#include<stdio.h>
int main() {
	double yard;
	double sum = 0;

	printf("yard? ");
	scanf("%lf", &yard);

	sum = yard * 91.44;
	printf("%.1fyard = %.1fcm", yard, sum);

	return 0;
}
