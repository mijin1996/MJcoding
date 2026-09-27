//7
// 연습1
#include<stdio.h>
int main() {
	int i, num;
	scanf("%d", &num);
	for (i = 1; i <= num; i++)
		printf("C언어 프로그래밍\n");

	return 0;
}
//자가1

#include<stdio.h>
int main() {
	int i, num;
	scanf("%d", &num);
	for (i = 1; i <= num; i++)
		printf("A");

	return 0;
}




//연습2
#include<stdio.h>
int main() {
	char i;
	for (i = 'A'; i <= 'Z'; i++) {
		printf("%c", i);
	}

	return 0;
}
// printf("%c", i);에서 'i'라고 하지 않는다.
//자가2
#include<stdio.h>
int main() {
	int i;
	for (i = 10; i <= 20; i++) {
		printf("%d ", i);
	}

	return 0;
}
//연습3
#include<stdio.h>
int main() {
	int i;
	for (i = 1; i < 20; i++) { // for (i = 1; i < 20; i += 2)라고 써도됨
		if (i % 2 != 0) // 이 줄은 없애도 됨
			printf("%d ", i);
	}

	return 0;
}
//출력: 1 3 5 7 9 11 13 15 17 19





//연습3
#include<stdio.h>
int main() {
	int i;
	for (i = 1; i <= 20; i++) { // ?? 식: for (i = 1; i <= 20; i += 1)
		if (i % 2 == 0) // if(i%2==0)//짝수를 출력시 이 식도 필수 넣기
			printf("%d ", i);
	}

	return 0;
}


//ㄴㄴㄴㄴ홀수 출력방식
//출력 : 2 4 6 8 10 12 14 16 18 20

//자가3
#include<stdio.h>
int main() {
	int i, n;
	scanf("%d", &n);
	for (i = 1; i <= n; i++) { //for (i = 1; i <= n; i+=1) // for(1=2; 1<=n ; i++);도 가능
		if (i % 2 == 0) // if (i % 2 == 0) //짝수를 출력시 이 식도 필수 넣기 // 위 식이 있다면 이식은 필요X
			printf("%d ", i);
	}

	return 0;
}




//연습4

#include<stdio.h>
int main() {
	int i, n;
	int sum = 0;
	scanf("%d", &n);
	for (i = 1; i <= n; i += 1) {
		sum += i;
	}
	printf("%d ", sum);
	return 0;
}
//1부터 입력받은 수까지
//자가4
#include<stdio.h>
int main() {
	int i, n;
	int sum = 0;
	scanf("%d", &n);
	for (i = n; i <= 100; i += 1) {
		sum += i;
	}
	printf("%d ", sum);
	return 0;
}
//정수를 입력받아서 입력받은 수부터 100까지




//연습5
#include<stdio.h>
int main() {
	int i, n;
	int cnt = 0;
	for (i = 1; i <= 10; i += 1) {
		scanf("%d", &n);
		if (n % 2 == 0) {
			cnt++;
		}
	}
	printf("입력받은 짝수는 %d개입니다.", cnt);
	return 0;
}
//자가5
#include<stdio.h>
int main() {
	int i, n;
	int cnt1 = 0, cnt2 = 0;
	for (i = 1; i <= 10; i++) {
		scanf("%d", &n);
		if (n % 3 == 0) {
			cnt1++;
		}
		if (n % 5 == 0) {
			cnt2++;
		}
	}
	printf("Multiples of 3 : %d\n", cnt1);
	printf("Multiples of 5 : %d\n", cnt2);
	return 0;
}

//꼭 다로 할 수 밖에 없을때!!if문을 2번 써도 됨// >=이럴때는 if식에 없는 식을 추가적으로 하기 때문에 else if로 쓸수 밖에 없음 (?)또잉??? 좀 더 고민하기..




//연습6

#include <stdio.h>
int main() {
	int i, s;
	int sum = 0;
	double avg;

	for (i = 1; i <= 5; i++) {
		scanf("%d", &s);
		sum += s;
	}

	avg = (double)sum / 5;
	printf("총점 : %d \n", sum);
	printf("평균 : %.1f \n", avg);
	return 0;
}


//자가6
#include <stdio.h>
int main() {
	int i, n, s;
	int sum = 0;
	double avg;

	scanf("%d", &n);
	for (i = 1; i <= n; i++) {
		scanf("%d", &s);
		sum += s;
	}
	avg = (double)sum / n;
	printf("avg : %.1f\n", avg);
	if (avg >= 80) {
		printf("pass \n");
	}
	else if (avg <= 80) {
		printf("fail \n");
	}

	return 0;
}




//연습7
#include <stdio.h>
int main() {
	int i, j;

	for (i = 1; i <= 5; i++) {
		for (j = 1; j <= 5; j++) {
			printf("%d ", i);
		}
		printf("\n");
	}

	printf("\n");

	for (i = 1; i <= 5; i++) {
		for (j = 1; j <= 5; j++) {
			printf("%d ", j);
		}
		printf("\n");
	}
	return 0;
}
//연습7-1
#include <stdio.h>
int main() {
	int i, j;

	for (i = 1; i <= 1; i++) {
		for (j = 1; j <= 3; j++) {
			printf("%d ", i);
		}
		printf("\n");
	}

	printf("\n");

	for (i = 1; i <= 2; i++) {
		for (j = 1; j <= 4; j++) {
			printf("%d ", j);
		}
		printf("\n");
	}
	return 0;
}

//AI 활용 설정
//2중 for문
//자가7
#include <stdio.h>
int main() {
	int i, j;

	for (i = 1; i <= 5; i++) {
		for (j = 1; j <= 5; j++) {
			printf("%d ", i + j);
		}
		printf("\n");
	}
	return 0;
}




//연습8
#include <stdio.h>
int main() {
	int i, j;

	for (i = 1; i <= 9; i++) {
		for (j = 2; j <= 4; j++) {
			printf("%d * %d = %2d ", j, i, j * i);
		}
		printf("\n");
	}
	return 0;
}

//AI 활용 설정
//연습8 출력의 예
//자가8
#include <stdio.h>
int main() {
	int i, j;

	for (i = 2; i <= 4; i++) {
		for (j = 1; j <= 5; j++) {
			printf("%d * %d = %2d ", i, j, j * i);
		}
		printf("\n");
	}
	return 0;
}
//자가8 출력의 예




//7 evaluation

//형평1
#include <stdio.h>
int main() {
	int n;
	scanf("%d", &n);
	for (int i = 1; i <= n; i++) {
		printf("JUNGOL\n");
	}
	return 0;
}
//형평2
#include <stdio.h>
int main() {
	int i, a, b, min, max;
	scanf("%d %d", &a, &b);

	max = a > b ? a : b;
	min = a < b ? a : b;

	for (i = min; i <= max; i++) {
		printf("%d ", i);
	}

	return 0;
}
//min_max를_사용
//형평3
#include <stdio.h>
int main() {
	int i, n;
	int sum = 0;
	scanf("%d", &n);

	for (i = 1; i <= n; i++) {
		if (i % 5 == 0) {
			sum += i;
		}
	}
	printf("%d", sum);

	return 0;
}
//i로 나누어야한다 왜냐하면 i로 증가하기때문 / 또한 sum은 i로 더해야한다 i로 증가하기때문
//형평4

#include <stdio.h>
int main() {
	int i, a, n;
	int sum = 0;
	double avg;

	scanf("%d", &a);
	for (i = 1; i <= a; i++) {
		scanf("%d", &n);
		sum += n;
	}
	avg = (double)sum / a;
	printf("%.2f", avg);

	return 0;
}

//형평5
#include <stdio.h>
int main() {
	int i, a;
	int even = 0, odd = 0;

	for (i = 1; i <= 10; i++) {
		scanf("%d", &a);
		if (a % 2 == 0) {
			even++;
		}
		if (a % 2 != 0) {
			odd++;
		}
	}
	printf("even : %d\n", even);
	printf("odd : %d\n", odd);

	return 0;
}

//형평6
#include <stdio.h>
int main() {
	int i, a, b;
	int sum = 0, cnt = 0;
	double avg;
	int max;
	int min;

	scanf("%d %d", &a, &b);
	max = a > b ? a : b;
	min = a < b ? a : b;

	for (i = min; i <= max; i++) {
		if (i % 3 == 0 || i % 5 == 0) {
			sum += i;
			cnt++;
		}
	}
	avg = (double)sum / cnt;

	printf("sum : %d\n", sum);
	printf("avg : %.1f\n", avg);

	return 0;
}

//형평7

#include <stdio.h>
int main() {
	int i, a;
	int sum;

	scanf("%d", &a);
	for (i = 1; i <= 10; i++) {
		sum = a * i;
		printf("%d ", sum);
	}

	return 0;
}


//형평8

#include <stdio.h>
int main() {
	int i, j, a, b;

	scanf("%d %d", &a, &b);
	for (i = 1; i <= a; i++) {
		for (j = 1; j <= b; j++) {
			printf("%d ", i * j);
		}
		printf("\n");
	}
	return 0;
}
//형평9
#include <stdio.h>
int main() {
	int i, j, a;

	scanf("%d", &a);
	for (i = 1; i <= a; i++) {
		for (j = 1; j <= a; j++) {
			printf("(%d, %d)", i, j);
		}
		printf("\n");
	}
	return 0;
}
//형평10
#include <stdio.h>
int main() {
	int i, j, a, b;

	scanf("%d %d", &a, &b);

	for (i = 1; i <= 9; i++) {
		for (j = 5; j >= 3; j--) {
			printf("%d * %d = %2d ", j, i, j * i);
		}
		printf("\n");
	}
	return 0;
}
//AI 활용 설정
//사진 설명을 입력하세요.
//형평10-1
#include <stdio.h>
int main() {
	int i, j, a, b;
	int min = 0, max = 0;

	scanf("%d %d", &a, &b);
	min = a < b ? a : b;
	max = a > b ? a : b;

	for (i = 1; i <= 9; i++) {
		for (j = max; j >= min; j--) {
			printf("%d * %d = %2d ", j, i, j * i);
		}
		printf("\n");
	}
	return 0;
}
//#min_max통한 수식 방법!!!★