//5
//연습1
#include<stdio.h>
int main() {
	int a;

	scanf("%d", &a);
	printf("%d\n", a);

	if (10 < a)
	{
		printf("10보다 큰 숫자를 입력했습니다.");
	}
	else
	{
		printf("10보다 작은 숫자를 입력했습니다.");
	}

	return 0;
}
//자진1
#include<stdio.h>
int main() {
	int a;

	scanf("%d", &a);
	printf("%d\n", a);
	if (a > 0)
	{
		printf("plus");
	}
	else
	{
		printf("minus");
	}

	return 0;
}



//연습2
#include<stdio.h>
int main()
{
	int a, b, temporaryN;

	scanf("%d %d", &a, &b);

	if (a > b) {
		temporaryN = a;
		a = b;
		b = temporaryN;
	}
	printf("입력받은 수 중 큰 수는 %d이고 작은 수는 %d입니다.", &a, &b);

	return 0;
}
//ㄴ>swap 식 / 치환식
//자진2
#include<stdio.h>
int main() {
	int hight, weight, Obesity = 0;

	scanf("%d %d", &hight, &weight);
	Obesity = weight + 100 - hight;
	printf("%d\n", Obesity);

	if (0 < Obesity)
	{
		printf("%s\n", "Obesity");
	}
	return 0;
}




//연습3
#include<stdio.h>
int main() {
	int score;

	printf("점수를 입력하세요. ");
	scanf("%d", &score);

	if (80 <= score)
	{
		printf("축하합니다. 합격입니다. \n");
	}
	else
	{
		printf("죄송합니다. 불합격입니다. \n");
	}

	return 0;
}
//자진3
#include<stdio.h>
int main() {
	int age, adult;

	scanf("%d", &age);
	adult = 20 - age;

	if (20 <= age)
	{
		printf("adult\n");
	}
	else
	{
		printf("%d years later", adult);
	}

	return 0;
}




//연습4
#include<stdio.h>
int main() {
	int score;

	scanf("%d", &score);

	if (90 <= score) {
		printf("A \n");
	}
	else if (80 <= score) {
		printf("B \n");
	}
	else if (70 <= score) {
		printf("C \n");
	}
	else if (60 <= score) {
		printf("D \n");
	}
	else {
		printf("F \n");
	}

	return 0;
}
//자진4
#include<stdio.h>
int main() {
	double weight;

	scanf("%lf", &weight);

	if (weight <= 50.80) {
		printf("Flyweight \n");
	}
	else if (weight <= 61.23) {
		printf("Lightweight \n");
	}
	else if (weight <= 72.57) {
		printf("Middleweight \n");
	}
	else if (weight <= 88.45) {
		printf("Cruiserweight \n");
	}
	else {
		printf("Heavyweight \n");
	}

	return 0;
}




//연습5
#include<stdio.h>
int main() {
	int a, b;
	printf("주사위를 던진 결과를 입력하세요. ");
	scanf("%d %d", &a, &b);

	if (a >= 4 && b >= 4) {
		printf("이겼습니다. \n");
	}
	else if (a >= 4 || b >= 4) {
		printf("비겼습니다. \n");
	}

	else {
		printf("졌습니다. \n");
	}

	return 0;
}
//자진5
#include<stdio.h>
int main()
{
	double score1, score2;

	scanf("%lf %lf", &score1, &score2);
	if (score1 >= 4.0 && score2 >= 4.0) {
		printf("A\n");
	}
	else if (score1 >= 3.0 && score2 >= 3.0) {
		printf("B\n");
	}
	else {
		printf("C\n");
	}
	return 0;
}




//연습6
#include<stdio.h>
int main()
{
	int a, b, c, max;

	printf("세 수를 입력하세요. ");
	scanf("%d %d %d", &a, &b, &c);

	if (a > b)
	{
		if (a > c)
		{
			max = a;
		}
		else
		{
			max = c;
		}
	}

	else
	{
		if (b > c)
		{
			max = b;
		}
		else
		{
			max = c;
		}
	}
	printf("입력받은 수 중 가장 큰 수는 %d입니다.", max);


	return 0;
}
//연습6-1
#include<stdio.h>
int main()
{
	int a, b, c, max, min;

	printf("세 수를 입력하세요. ");
	scanf("%d %d %d", &a, &b, &c);

	if (a > b)
	{
		if (a > c)
		{
			max = a;
		}
		else
		{
			max = c;
		}

		if (a < c)
		{
			min = a;
		}
		else { min = c; }
	}

	else
	{
		if (b > c)
		{
			max = b;
		}
		else
		{
			max = c;
		}
		if (b < c)
		{
			min = b;
		}
		else
		{
			min = c;
		}
	}
	printf("입력받은 수 중 가장 큰 수는 %d입니다. 작은 수 %d", max, min);


	return 0;
}
//자진6
#include<stdio.h>
int main()
{
	char gender;
	int age;

	scanf("%c %d", &gender, &age);

	if (gender == 'M')
		if (age < 18)
		{
			printf("BOY");
		}
		else
		{
			printf("MAN");
		}
	else if (gender == 'F')
	{
		if (age < 18)
		{
			printf("GILE");
		}
		else { printf("WOMAN"); }
	}


	return 0;
}




//연습7
#include<stdio.h>
int main()
{
	int num;

	printf("1. 삽입\n");
	printf("2. 수정\n");
	printf("3. 삭제\n");
	printf("숫자를 선택하세요.\n");
	scanf("%d", &num);

	switch (num)
	{
	case 1: printf("삽입을 선택하셨습니다. \n"); break;
	case 2: printf("수정을 선택하셨습니다. \n"); break;
	case 3: printf("삭제을 선택하셨습니다. \n"); break;
	default: printf("잘 못 누르셨습니다. \n");
	}
	return 0;
}
//자진7
#include<stdio.h>
int main()
{
	char ch;

	scanf(" %c", &ch);

	switch (ch)
	{
	case 'A': printf("Excellent"); break;
	case 'B': printf("Good"); break;
	case 'C': printf("Usually"); break;
	case 'D': printf("Effort"); break;
	case 'F': printf("Failure"); break;
	default: printf("error");
	}
	return 0;
}




//연습8
#include<stdio.h>
int main()
{
	int num;

	printf("점수를 입력하세요. ");
	scanf(" %d", &num);

	switch (num / 10)
	{
	case 10:
	case 9: printf("A"); break;
	case 8: printf("B"); break;
	case 7: printf("C"); break;
	case 6: printf("D"); break;
	default: printf("F");

	}
	return 0;
}
//자진8
#include<stdio.h>
int main() {
	double earnCredits;


	do {
		scanf_s("%lf", &earnCredits);
		if ((int)earnCredits == 0)
		{
			printf("０이　입력되어　프로그램　종료합니다．\n"); break;
		}
		if ((int)earnCredits > 4 || (int)earnCredits == 0)
		{
			printf("점수 초과이거나 미만입니다. 1~4미만의 숫자를 써주세요\n\n\n\n"); continue;
		}

		switch ((int)earnCredits)
		{
		case 2: printf("seasonal semester\n");continue;
		case 3: printf("next semester\n"); continue;
		case 4: printf("scholarship\n"); continue;
		default: printf("retake"); break;
		}

	} while (1);

	return 0;
}
//점수 초과이거나 미만일때는 continue로 잘 실행 / 초과이거나 미만일때 멈추야 하는데 조건을 생각해보기




//연습 9
#include<stdio.h>
int main()
{
	int a, b, whichOneIsmaxN;

	scanf("%d %d", &a, &b);
	whichOneIsmaxN = a > b ? a : b;

	printf("%d", whichOneIsmaxN);
	return 0;
}
//연습 9-1
#include<stdio.h>
int main()
{
	int a, b, whichOneIsmaxN;

	scanf("%d %d", &a, &b);
	if (a > b) {
		whichOneIsmaxN = a;

	}
	else {
		whichOneIsmaxN = b;
	}

	printf("%d", whichOneIsmaxN);
	return 0;
}
//자진 9
#include<stdio.h>
int main()
{
	int a, b, c, max;

	scanf("%d %d %d", &a, &b, &c);

	max = a > b ? a : b;
	max = max > c ? max : c;

	printf("%d", max);

	return 0;
}



//5 evaluation
//1 
#include<stdio.h>
int main() {
	int a, b;
	int sum = 0;

	scanf("%d %d", &a, &b);
	if (b < a)
	{
		sum = a - b;
	}
	else { sum = b - a; }

	printf("%d", sum);

	return 0;
}
//2
#include<stdio.h>
int main() {
	int a;

	scanf("%d", &a);
	if (a == 0)
	{
		printf("zero");
	}
	else if (a > 0)
	{
		printf("plus");
	}
	else
	{
		printf("minus");
	}

	return 0;
}
//3
#include<stdio.h>
int main() {
	int y;

	scanf("%d", &y);
	if (y % 400 == 0)
	{
		printf("leap year");
	}

	else if (y % 4 == 0 && y % 100 != 0)
	{
		printf("leap year");
	}

	else
	{
		printf("normal year");
	}

	return 0;
}
//4
#include<stdio.h>
int main() {
	int n;

	printf("Number?");
	scanf("%d", &n);

	switch (n)
	{
	case 1: printf("dog"); break;
	case 2: printf("cat"); break;
	case 3: printf("chick"); break;
	}

	return 0;
}
//5
#include<stdio.h>
int main() {
	int n;

	scanf("%d", &n);

	switch (n)
	{

	case 2:printf("28"); break;
	case 4:
	case 6:
	case 9:
	case 11:printf("30"); break;
	default:printf("31"); break;
	}

	return 0;
}