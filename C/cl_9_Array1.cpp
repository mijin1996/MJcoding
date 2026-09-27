//9
//1번연습
#include <stdio.h>
int main()
{
	int a[5]
		int i;

	for (i = 0; i < 5; i++) {
		scanf("%d", &a[i]);
	}
	for (i = 0; i < 5; i++) {
		printf("%d ", a[i]);
	}
	printf("\n");
	return 0;
}

//1-1번연습
#include <stdio.h>
int main()
{
	int a[5]
		int i;

	for (i = 0; i < 5; i++) {
		scanf("%d", &a[i]);
		printf("%d ", a[i]); //for문 안에 한꺼번에 scanf와 printf를 넣어도 같은 의미임
	}
	printf("\n");
	return 0;
}



//1번자가
#include <stdio.h>
int main()
{
	char carry[10];
	int i;
	for (i = 0; i < 10; i++) {
		scanf(" %c", &carry[i]);
	}
	for (i = 0; i < 10; i++) {
		printf("%c", carry[i]);
	}
	printf("\n");
	return 0;
}




//2번 연습
#include <stdio.h>
int main() {
	int i;
	char xc[26];

	for (i = 0; i < 26; i++) {
		xc[i] = 'A' + i; //방호수에 맞게 하나씩 증가하기 위해
	}
	for (i = 25; i >= 0; i--) { //역순으로 출력하기 위한 식
		printf("%c ", xc[i]);
	}
	return 0;
}

//2번 자가
#include <stdio.h>
int main() {
	int i;
	int n = 0;
	int xn[10];

	for (i = 0; i < 10; i++) {
		xn[i] = i + 1; //i가 0일 때 1, 1일 때 2... 이런 식으로 배열의 각 칸에 숫자를 채웁
		printf("%d ", xn[i]);
	}

	return 0;
}
//3번 연습
#include <stdio.h>
int main() {
	int i;
	int xn[10];

	for (i = 0; i < 10; i++) {
		scanf("%d", &xn[i]);
	}
	printf("%d %d %d", xn[2], xn[4], xn[9]);

	return 0;
}
//3번 자가
#include <stdio.h>
int main() {
	int i;
	char xc[10];

	for (i = 0; i < 10; i++) {
		scanf(" %c", &xc[i]);
	}
	printf("%c %c %c", xc[0], xc[3], xc[6]);

	return 0;
}





//🚨4번 연습
#include <stdio.h>
int main() {
	int xn[100];
	int i, cnt;

	for (i = 0;i < 100;i++) {
		scanf("%d", &xn[i]);
		if (xn[i] == 0)break;
	}
	cnt = i;
	for (i = 1; i < cnt; i += 2) { //i=0: 첫번째자리에 들어간 숫자 11부터 시작 || i=1: 두번째 '''' 25부터 시작
		printf("%d ", xn[i]);
	}
	return 0;
}
//4-1
#include <stdio.h>
int main() {
	int xn[100];
	int i, cnt;

	for (i = 0;i < 100;i++) {
		scanf("%d", &xn[i]);
		if (xn[i] == 0)break;
	}
	cnt = i;
	for (i = 0; i < cnt; i++) {
		if (i % 2 == 1) { //0을하면 0번째 부터 출력하여 11부터 출력하게된다. =>짝수번째
			printf("%d ", xn[i]);
		}
	}
	return 0;
}
//1번째이므로 홀수번째

//4번 자가
#include <stdio.h>
int main() {
	int xn[100];
	int i, cnt;

	for (i = 0;i < 100;i++) {
		scanf("%d", &xn[i]);
		if (xn[i] == 0)break;
	}
	cnt = i - 1; //-1은 원래의 갯수에서 i는 현재 0이 저장된 위치이므로, 그 바로 앞인 i-1부터 출력을 위해 작성된 것

	for (i = cnt; i >= 0; i--) { // i >= 0이렇게 해야되 그래야 0번째 숫자도 나오니까
		printf("%d ", xn[i]);
	}

	return 0;
}
---------------------------------- -
//5번 연습
//윤년구하는 식 너무 복잡해 page 177
//5번 자가
#include <stdio.h>
int main() {
	double classR[7] = { 0, 85.6, 79.5, 83.1, 80.0, 78.2, 75.0 };
	int xn;
	double sum = 0;
	int i;

	for (i = 0;i < 2; i++) {
		scanf("%d", &xn);
		sum += classR[xn];
	}
	printf("%.1f", sum);

	return 0;
}



//6번 연습
#include <stdio.h>
int main() {
	int i;
	int xn[10];
	int max = 0;

	for (i = 0; i < 10; i++) {
		scanf("%d", &xn[i]);
		if (max < xn[i]) {
			max = xn[i];
		}
	}
	printf("%d", max);
	return 0;
}
//6번 자가
#include <stdio.h>
int main() {
	int i;
	int min = 1000;
	int narry[10];

	for (i = 0; i < 10;i++) {
		scanf("%d", &narry[i]);
	}

	for (i = 0; i < 10;i++) {
		if (min > narry[i]) {
			min = narry[i];
		}
	}
	printf("%d", min);
}
//6-1
#include <stdio.h>
int main() {
	int i;
	int min = 1000;
	int narry[10];

	for (i = 0; i < 10; i++) {
		scanf("%d", &narry[i]);
		if (min > narry[i]) {
			min = narry[i];
		}
	}
	printf("%d", min);
}




//7번 연습
#include <stdio.h>
int main() {
	int i;
	int min = 10000, max = -10000;
	int narry[10];

	for (i = 0; i < 10; i++) {
		scanf("%d", &narry[i]);
	}
	for (i = 0; i < 10; i++) {
		if (narry[i] % 2 == 0) {
			if (max < narry[i]) {
				max = narry[i];
			}
		}
		else {
			if (min > narry[i]) {
				min = narry[i];
			}
		}
	}
	printf("%d %d", max, min);
}
//7-1
#include <stdio.h>
int main() {
	int i;
	int min = 10000, max = -10000;
	int narry[10];

	for (i = 0; i < 10; i++) {
		scanf("%d", &narry[i]);
	}
	for (i = 0; i < 10; i++) {
		if (narry[i] % 2 != 0) {
			if (min > narry[i]) {
				min = narry[i];
			}
		}
		else {
			if (max < narry[i]) {
				max = narry[i];
			}
		}
	}
	printf("%d %d", min, max);
}
//7번 자가
#include <stdio.h>
int main() {
	int i;
	int min = 10000, max = 1;
	int narry[10];

	for (i = 0; i < 10; i++) {
		scanf("%d", &narry[i]);
	}
	for (i = 0; i < 10; i++) {
		if (narry[i] < 100) {
			if (max < narry[i]) {
				max = narry[i];
			}
		}
		else {
			if (min > narry[i]) {
				min = narry[i];
			}
		}
	}
	if (min == 10000) min = 100;
	if (max == 1) max = 100;

	printf("%d %d", max, min);
}




//🚨8번 연습
#include <stdio.h>
int main() {
	int i;
	int xcscore[10];
	int sum = 0;
	double avg = 0;

	for (i = 0; i < 10; i++) {
		scanf("%d", &xcscore[i]);
	}
	for (i = 0; i < 10; i++) {
		sum += xcscore[i];
	}
	avg = (double)sum / 10;

	printf("총점 = %d\n", sum);
	printf("평균 = %.1f\n", avg);
	return 0;
}
//8번 자가
#include <stdio.h>
int main() {
	int i;
	int xn[10];
	int oddsum = 0, evensum = 0;
	double avg = 0;

	for (i = 0; i < 10; i++) {
		scanf("%d", &xn[i]);

		if (i % 2 == 1) {
			evensum += xn[i]; // 인덱스 짝수번째
		}
		else {
			oddsum += xn[i]; // 인덱스 홀수번째
		}

		avg = (double)oddsum / 5; //짝수와 홀수를 각각 반으로 나누기때문
	}
	printf("sum : %d\n", evensum);
	printf("avg : %.1f\n", avg);
	return 0;
}

//위 for문 재 생각
/*for (i = 0; i < 10; i += 2) {
	oddsum += xn[i];
}

for (i = 1; i < 10; i += 2) {
	evensum += xn[i];
}*/
//if문 없이 for문만을 값을 저장할 수 있음





//9번 연습
#include <stdio.h>
int main() {
	int i, j, tmp;
	int xn[5] = { 50, 75, 85, 95, 100 };

	for (i = 0; i < 4; i++) { //'확정'지을 칸의 위치를 기준으로 놓는것임
		for (j = i + 1;j < 5;j++) { //i의 확정되지 않은 뒷자리까지 확인/비교위해 j=i+1을 넣어줌
			if (xn[i] > xn[j]) { // #오름차순_출력(작숫 > 큰숫)
				tmp = xn[i];
				xn[i] = xn[j];
				xn[j] = tmp;
			}
		}
	}
	for (i = 0;i < 5;i++) {
		printf("%d ", xn[i]);
	}
	return 0;
}
//9번 자가
#include <stdio.h>
int main() {
	int xn[10] = { 95, 100, 88, 65, 76, 89, 58, 93, 77, 99 };
	int i, j, tmp;

	for (i = 0;i < 10;i++) {
		scanf("%d", &xn[i]);
	}
	for (i = 0; i < 9; i++) {
		for (j = i + 1;j < 10;j++) { //확정되지 않은 뒷자리까지 확인하기 위해 j=i+1을 넣어줌
			if (xn[i] < xn[j]) { //#내림차순_출력(큰숫 > 작숫)
				tmp = xn[i];
				xn[i] = xn[j];
				xn[j] = tmp;
			}
		}
	}
	for (i = 0;i < 10;i++) { //i++/i--이 내림차/오름차를 결정하는 것이 아닌 부등호(조건식)이 결정하는 것임
		printf("%d ", xn[i]);
	}
	return 0;
}












//[9장 형평]
//1번
#include <stdio.h>

int main() {
	char xc[10];
	int i, j;

	for (i = 0;i < 10;i++) {
		scanf(" %c", &xc[i]);
	}
	for (i = 9;i >= 0; i--) {
		printf("%c ", xc[i]);
	}
	return 0;
}
//2번
#include<stdio.h>
int main() {
	int xn[5];
	int i;
	int sum = 0;

	for (i = 0; i < 5;i++) {
		scanf("%d", &xn[i]);
	}
	sum = xn[0] + xn[2] + xn[4];

	printf("%d", sum);
}


//3번
#include <stdio.h>
int main() {
	int i;
	int even = 0, odd = 0;
	int xn[10];
	for (i = 0; i < 10; i++) {
		scanf("%d", &xn[i]);

		if (i % 2 == 0) {
			odd += xn[i]; //odd의의미는 홀수이나, 배열 인덱스로 0은 짝수|| 즉 0 2 4형식으로 출력
		}
		else {
			even += xn[i]; //even은 1번째라서 홀수임 || 1 3 5 출력
		}
	}
	printf("odd : %d\n", odd);
	printf("even : %d\n", even);
	return 0;
}
//3-1#include <stdio.h>

int main() {
	int i;
	int even = 0, odd = 0;
	int xn[10];

	for (i = 0; i < 10; i += 2) {
		scanf("%d %d", &xn[i], &xn[i + 1]);

		odd += xn[i]; // 0, 2, 4, 6, 8번 칸 (홀수 번째)
		even += xn[i + 1]; // 1, 3, 5, 7, 9번 칸 (짝수 번째)
	}

	printf("odd : %d\n", odd);
	printf("even : %d\n", even);

	return 0;
}

//🚨4번

#include <stdio.h>
int main() {
	int i, x, cnt, xn[100];

	for (i = 0; i < 100; i++) {
		scanf("%d", &xn[i]); //들어온 숫자를 담아놓을 변수 cnt가 필요
		if (xn[i] == -1)break;
	}
	cnt = i; //i가 증가함에따라 cnt(총5번째)에 담아 놓음

	x = (cnt < 3) ? 0 : cnt - 3; //cnt-3 > 5-3 > 2
	for (i = x; i < cnt; i++) { // x=2, cnt=5이므로 2번째 자리에서부터 출력하는 식이 됨
		printf("%d ", xn[i]);
	}
	return 0;

//아래 식을 어떻게 작성해야될지 물어봐도 모르겠음 > 해결!
		---------------------------------- -
//5번
#include <stdio.h>
		int main() {
		int i, cnt = 0;
		double sum = 0, avg, weight[6];

		for (i = 0; i < 6; i++) {
			scanf("%lf", &weight[i]); //들어온 숫자를 담아놓을 변수 cnt가 필요
			sum += weight[i];
			cnt++; //숫자 저장소
		}
		avg = sum / cnt;
		printf("%.1f", avg);

		return 0;
	}
	---------------------------------- -
//🚨6번

#include <stdio.h>
		int main() {
		int i;
		int findN = 0; // Q.이 변수는 어떤 역할? > 숫자를 찾았다는 의미의 변
		char xc[6] = { 'J', 'U', 'N', 'G', 'O', 'L' };
		char putC;

		scanf(" %c", &putC);
		for (i = 0; i < 6; i++) { //결과적으로 한번만 출력 BUT 그 하나를 찾기위해 6번 돌 식 필요
			if (xc[i] == putC) {
				printf("%d", i); //i는 위치가 어딘지 확인 위해/ ex)xc[i]는 문자의 값이므로 넣으면 문자가 나옴
				findN = 1;
			}
		}

		if (findN == 0) { //위에서 findN=1이지만 여기서는 0인지를 확인하는 것임
			printf("none");
		}
		return 0;
	}

//7번
#include <stdio.h>
		int main() {
		int i;
		int xn[100];
		int max = -999, min = 999;

		for (i = 0; i < 100; i++) {
			scanf("%d", &xn[i]);
			if (xn[i] == 999)break;

			if (max < xn[i]) {
				max = xn[i];
			}
			if (min > xn[i]) { //else를 쓰면 위 경우를 생각지 않고 무조건 입력숫자가 크면 max로 지정하고 작으면 무조건 min이라고 하라는 의미가 되어버리므로 else 를 쓰면 안됨// 서로 다른 경우이므로 한묶음 세트로 식을 세우면 안됨
				min = xn[i];
			}
		}
		printf("max : %d\n", max);
		printf("min : %d\n", min);

		return 0;
	}

//8번
#include <stdio.h>
		int main() {
		int i, sum = 0, cnt = 0;
		int xn[100];
		double avg = 0;

		for (i = 0; i < 100; i++) {
			scanf("%d", &xn[i]);
			if (xn[i] == 0)break;

			if (xn[i] % 5 == 0) { //5의 배우일때만 합계와 개수 계산
				sum += xn[i];
				cnt++;
			}
		}
		avg = (double)sum / cnt;

		printf("Multiples of 5 : %d\n", cnt); //5의 배수는 총몇?
		printf("sum : %d\n", sum);
		printf("avg : %.1f\n", avg);

		return 0;
	}
	---------------------------------- -
//9번

#include <stdio.h>
		int main() {
		int i, cnt = 0;
		int xn[100];

		for (i = 0; i < 100; i++) {
			scanf("%d", &xn[i]);
			if (xn[i] == 0)break;
			cnt++;
		}
		printf("%d\n", cnt);

		for (i = 0; i < cnt; i++) {
			if (xn[i] % 2 != 0) {
				printf("%d ", xn[i] * 2); //홀수 2배하기
			}
			else {
				printf("%d ", xn[i] / 2); //짝수의 경우 2로 나누기
			}
		}
		return 0;
	}
//9-1
#include <stdio.h>
		int main() {
		int i, cnt = 0;
		int xn[100];

		for (i = 0; i < 100; i++) {
			scanf("%d", &xn[i]);
			if (xn[i] == 0)break;
			cnt++;
		}
		printf("%d\n", cnt);

		for (i = 0; i < cnt; i++) {
			if (xn[i] % 2 == 0) {
				printf("%d ", xn[i] / 2); //홀수 2배하기
			}
			else {
				printf("%d ", xn[i] * 2); //짝수의 경우 2로 나누기
			}
		}
		return 0;
	}


//Q.p135
		/*짝
		if (i % 2 == 1) || i += 2
			홀
			if (i % 2 == 0) ||

				i로 짝 홀 구하는 법
				입력값으로 짝 홀 구하는 법
				배열 인덱스로 짝 홀 구하는 법
				배열에서 실게 숫자로 짝 홀 구하는 법
				==========================
				for (i = 0; i < cnt; i++) {
					printf("%d ", (xn[i] % 2 != 0) ? xn[i] * 2 : xn[i] / 2);
				}*/
//10번
#include <stdio.h>
		int main() {
		int i, j, n, tmp, score[20];

		scanf("%d", &n);
		for (i = 0;i < n;i++) { //위 n만큼 scanf를 돌리겠다는 의미
			scanf("%d", &score[i]);
		}

		for (i = 0; i < n - 1; i++) {
			for (j = i + 1; j < n; j++) { //j=i+1은 나 자신과 다음 숫자를 비교하여 큰 숫자를 확정하기 위해
				if (score[i] < score[j]) { // 내림차순: <
					tmp = score[i];
					score[i] = score[j];
					score[j] = tmp;
				}
			}
		}

		for (i = 0;i < n; i++) {
			printf("%d\n", score[i]);
		}

		return 0;
	}