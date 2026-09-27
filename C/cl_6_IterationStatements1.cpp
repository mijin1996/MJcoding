//6
//연습1
#include<stdio.h>
int main()
{
	char alp = 'A';

	while (alp <= 'Z') {
		printf("%c", alp++);
	}

	return 0;
}
//연습1-1
#include<stdio.h>
int main(){
char alp;

scanf("%c", &alp);
while (alp < 'Z') {
	printf("%c", alp++);	//해당 alp값도 포함 Z값은 제외
	return 0;
}
//자진1
#include<stdio.h>
int main();{
		int n = 1;

		while (n <= 15) {
			printf("%d ", n++);
		}

		return 0;
	}

//연습2
#include<stdio.h>
	int main()
	{
		int num = 1;
		int sum = 0, cnt = 0, avg = 0;

		while (num <= 10) {
			sum += num;
			num++;
		}

		printf("1부터 10까지의 합 = %d\n", sum);
		printf("while문이 끝난 후의 num의 값 = %d", num);

		return 0;
	}
//자진2
#include<stdio.h>
	int main() {
		int num;
		int a = 1, sum = 0;

		scanf("%d", &num);
		while (a <= num) {
			sum += a;
			a++;
		}

		printf("%d\n", sum);

		return 0;
	}



//연습3
#include<stdio.h>
	int main() {
		int num;

		while (1) {
			printf("점수를 입력하세요. \n");
			scanf("%d", &num);

			if (num < 0 || num >100) break;
			if (num <= 90) {
				printf("축하합니다. 합격입니다. \n");
			}
			else {
				printf("죄송합니다. 불합격입니다. \n");
			}
		}
		return 0;
	}




	/ 자진3
#include<stdio.h>
		int main() {
		int num;

		while (1) {
			printf("Number? ");
			scanf("%d", &num);

			if (num == 0) break;
			if (num > 0) {
				printf("positive integer\n");
			}
			else {
				printf("nevative number\n");
			}
		}
		return 0;
	}




//연습4
#include<stdio.h>
	int main() {
		int num;
		int sum = 0, cnt = 0;
		double avg;

		while (1) {
			scanf("%d", &num);
			if (num == 0) break;
			sum += num;
			cnt++;
		}
		avg = (double)sum / cnt;

		printf("입력된 자료의 개수 = %d\n", cnt);
		printf("입력된 자료의 합계 = %d\n", sum);
		printf("입력된 자료의 평균 = %.2f\n", avg);

		return 0;
	}




//자진4
#include<stdio.h>
	int main() {
		int num;
		int sum = 0, cnt = 0;
		double avg;

		while (1) {
			scanf("%d", &num);
			sum += num;
			num++;
			if (num > 100) break;
		}
		avg = (double)sum / num;
		printf("입력된 자료의 합계 = %d\n", sum);
		printf("입력된 자료의 평균 = %.1f\n", avg);

		return 0;
	}



//연습5
#include <stdio.h>
	int main()
	{
		int num, avg;
		int sum = 0, cnt = 0;

		while (1) {
			scanf("%d", &num);
			if (num == 0) break;
			if (num % 2 == 0)continue;
			sum += num;
			cnt++;
		}
		avg = sum / cnt;
		printf("홀수의 합 = %d \n", sum);
		printf("홀수의 평균 = %d \n", avg);
		return 0;
	}

	//if (num % 2 == 0)continue;이 부분에는 꼭 이게 들어가야 정답이 나옴
	//if (num % 2 != 0) & if (num % 3==0)들어가면 답이 다름
	//do while 문에서는 if (num % 2 == 1) 만 써도 답이 제대로 나옴


//자진5
#include <stdio.h>
	int main()
	{
		int num;

		while (1) {
			scanf("%d", &num);
			if (num == -1) break;
			if (num % 3 != 0)continue;
			if (num % 3 == 0) {
				printf("%d\n", num / 3);
			}
		}
		return 0;
	}
	// 나누게되는 수는 항상 뒤에 놓기! num/3이런 식으로




//연습6
#include <stdio.h>
	int main() {
		int num;

		do
		{
			printf("1. 입력하기\n");
			printf("2. 출력하기\n");
			printf("3. 삭제하기\n");
			printf("4. 끝내기\n");
			printf("작업할 번호를 선택하세요. ");
			scanf("%d", &num);

			switch (num) {
			case 1: printf("\n입력하기를 선택하셨습니다. \n\n"); break;
			case 2: printf("\n출력하기를 선택하셨습니다. \n\n"); break;
			case 3: printf("\n삭제하기를 선택하셨습니다. \n\n"); break;
			case 4: printf("\n끝내기를 선택하셨습니다. \n\n"); break;
			default: printf("\n잘못 선택했습니다.\n\n");
			}
		} while (num != 4);
	}



//자진6
#include <stdio.h>
	int main() {
		int num;

		do
		{
			printf("1. Korea\n");
			printf("2. USA\n");
			printf("3. Japan\n");
			printf("4. China\n");
			printf("Number?");
			scanf(" %d", &num);

			switch (num) {
			case 1: printf("\n Seoul \n\n"); break;
			case 2: printf("\nWashington \n\n"); break;
			case 3: printf("\nTokyo \n\n"); break;
			case 4: printf("\nBeijing \n\n"); break;
			default: printf("\nnone \n\n");
			}
		} while (num != 4);
	}



//6 evaluation
//형평1
#include <stdio.h>
	int main() {
		int num;
		int a = 1;

		scanf("%d", &num);

		while (a <= num) {
			printf("%d ", a++);
		}
		return 0;
	}

//형평2
#include <stdio.h>
	int main() {
		int num;
		int odd = 0, even = 0;

		while (1) {
			scanf("%d", &num);
			if (num == 0) break;
			if (num % 2 == 0) {
				even++;
			}
			if (num % 2 != 0) {
				odd++;
			}
		}
		printf("odd : %d\n", odd);
		printf("even : %d\n", even);
		return 0;
	}

	//형평 3
#include <stdio.h>
	int main() {
		int num;
		int sum = 0, cnt = 0;
		double avg;

		while (1) {
			scanf("%d", &num);
			if (num < 0 || num > 100) break;
			if (num >= 0 || num <= 100)
				sum += num;
			cnt++;
		}
		avg = (double)sum / cnt;
		printf("sum : %d\n", sum);
		printf("avg : %.1f\n", avg);

		return 0;
	}

	//형평4

#include <stdio.h>
	int main() {
		int num;
		int cnt = 0;
		while (1) {
			scanf("%d", &num);
			if (num == 0) break;
			if (num % 3 == 0 || num % 5 == 0) continue;
			cnt++;
		}
		printf("%d", cnt);
		return 0;
	}
	//형평 4-1

#include <stdio.h>
	int main() {
		int num, cnt = 0;
		do {
			scanf("%d", &num);
			if (num % 3 == 0 || num % 5 == 0) continue;
			cnt++;
		} while (num != 0);
		printf("%d", cnt);
		return 0;
	}

	//형평5
#include <stdio.h>
	int main() {

		int Base, Height;
		double Triangle = 0;
		char ch;

		do {
			printf("Base = ");
			scanf("%d", &Base);
			printf("Height = ");
			scanf("%d", &Height);
			Triangle = (double)Base * Height / 2;
			printf("Triangle width = %.1f\n", Triangle);

			printf("Continue? ");
			scanf(" %c", &ch);
		} while (ch == 'Y' && ch != 'N');
	}

	//Triangle = (double)Base * Height/2;에서의 혹시라도 저 식을 사용하지 않고 27.5라고 입력한다면 점을 다음칸으로 넘기는 기능을 한다.