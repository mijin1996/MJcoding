//8
// [잠깐정리timee]

/*無입력값
whenVariableIncreas > i(? ? ? ? ? i + 1)
whenVariableReduce > -i(? ? ? ? ? i - 1)

無입력값 없이 증감
i * 2
i * 2 - 1

입력값 有
byInputValueIncreas > n - i + 1
byInputValueReduce > n - i - 1

입력값 有 홀 / 짝
oddnum(n - i) * 2 + 1
evennum(n - i + 1) * 2*/



//연습1
#include <stdio.h>
int main() {
	int i, Z;
	int sum = 0;

	scanf("%d", &Z);

	for (i = 1; ; i++) {
		sum += i;
		if (sum > Z)break;
	}
	printf("%d %d", i, sum);

	return 0;
}
//AI 활용 설정
//사진 설명을 입력하세요.

//자가1
#include <stdio.h>
int main() {
	int i, IterationControlStatement;
	int sum = 0, cnt = 0;

	scanf("%d", IterationControlStatement);

	for (i = 1; ; i += 2) {
		if (sum >= IterationControlStatement;)break;
		sum += i;
		cnt++;
	}
	printf("%d %d", cnt, sum);

	return 0;
}




//연습2
#include <stdio.h>
int main() {
	int i, j;

	for (i = 1; i <= 3; i++) {
		for (j = 1; j <= i; j++) {
			printf("*");
		}printf("\n");
	}
	return 0;
}
//자가2
#include <stdio.h>
int main() {
	int i, j, n;

	scanf("%d", &n);
	for (i = 1; i <= n; i++) {
		for (j = 1; j <= i; j++) {
			printf("*");
		}printf("\n");
	}
	return 0;
}
//연습3
#include <stdio.h>
int main() {
	int i, j;


	for (i = 1; i <= 3; i++) {
		for (j = 1; j <= i; j++) {
			printf("*");
		}printf(" \n");
	}
	for (i = 1; i <= 3; i++) {
		for (j = 1; j <= 3 - i + 1; j++) {
			printf("*");
		}printf(" \n");
	}
	return 0;
}
//자가3
#include <stdio.h>
int main() {
	int i, j, n;

	scanf("%d", &n);
	for (i = 1; i <= n; i++) {
		for (j = 1; j <= n - i + 1; j++) {
			printf("*");
		}printf(" \n");
	}
	for (i = 1; i <= n; i++) {
		for (j = 1; j <= i; j++) {
			printf("*");
		}printf(" \n");
	}
	return 0;
}




//연습4
#include <stdio.h>
int main() {
	int i, j, k, n;

	scanf("%d", &n);
	for (i = 1; i <= n; i++) {
		for (j = 1; j <= n - i; j++) {
			printf(" ");
		}
		for (k = 1; k <= i; k++) {
			printf("*");
		}
		printf("\n");
	}
	return 0;
}
//자가4-1
#include <stdio.h>
int main() {
	int i, j, k, n;

	scanf("%d", &n);
	for (i = 1; i <= n; i++) {
		for (j = 1; j <= i; j++) {
			printf(" ");
		}
		for (k = 1; k <= n - i + 1; k++) {
			printf("*");
		}
		printf("\n");
	}
	return 0;
}
//자가4-2 정올정답
#include <stdio.h>
int main() {
	int i, j, k, n;
	scanf("%d", &n);
	for (i = 1; i <= n; i++) {
		for (j = 1; j <= i - 1; j++) {
			printf(" ");
		}
		for (k = 1; k <= n - i + 1; k++) {
			printf("*");
		}
		printf("\n");
	}
}




//연습5
#include <stdio.h>
int main() {
	int i, j, k;

	for (i = 1; i <= 5; i++) {
		for (j = 1; j <= 5 - i; j++) {
			printf(" ");
		}
		for (k = 1; k <= i * 2 - 1; k++) {
			printf("*");
		}
		printf("\n");
	}
}
//자가5
#include <stdio.h>
int main() {
	int i, j, k, n;
	scanf("%d", &n);
	for (i = 1; i <= n; i++) {
		for (j = 1; j <= i - 1; j++) {
			printf(" ");
		}
		for (k = 1; k <= (n - i) * 2 + 1; k++) {
			printf("*");
		}
		printf("\n");
	}
}




//연습6

#include <stdio.h>
int main() {
	int i, j, n;
	int xnt = 1;
	scanf("%d", &n);
	for (i = 1; i <= n; i++) {
		for (j = 1; j <= i; j++) {
			printf("%d ", xnt++);
		}
		printf("\n");
	}
}
//자가6
#include <stdio.h>
int main() {
	int i, j, n;
	char xch = 'A';
	scanf("%d", &n);
	for (i = 1; i <= n; i++) {
		for (j = 1; j <= n - i + 1; j++) {
			printf("%c", xch++);
		}
		printf("\n");
	}
}



//연습7
#include<stdio.h>
int main() {
	int i, j, k;
	char ch = 'a';
	int xn = 1;

	for (i = 1;i <= 4;i++) {
		for (j = 1;j <= i; j++) {
			printf("%c ", ch++);
		}
		for (k = 1;k <= 4 - i + 1; k++) {
			printf("%d ", xn++);
		}
		printf("\n");
	}
	return 0;
}




//중요!!5 - i는 가낭하나 i - 5로 작성시 디버깅이 안됨!!
//자가7
#include<stdio.h>
int main() {
	int i, j, k, n;
	char ch = 'A';
	int xn = 1;

	scanf("%d", &n);
	for (i = 1; i <= n; i++) {
		for (j = 1; j <= n - i + 1; j++) {
			printf("%d ", xn++);
		}
		for (k = 1; k <= i; k++) {
			printf("%c ", ch++);
		}
		printf("\n");
	}
	return 0;
}





//8 evaluation
//형평1
#include <stdio.h>
int main() {
	int i;
	int xn, avg;
	int cnt = 0, sum = 0;

	for (i = 1; ; i++) {
		scanf("%d", &xn);
		if (xn == 0)continue;
		sum += xn;
		cnt++;
	}
	avg = sum / cnt;
	printf("%d %d", sum, avg);
}
//xxxx

//형평2
#include<stdio.h>
int main() {
	int i, n;
	int sum = 0;

	scanf("%d", &n);
	for (i = 1; ;i++) {
		sum = i * n;
		printf("%d ", sum);
		if (n >= 100)break;
		if (sum % 10 == 0) break;
	}
	return 0;
}
//숫자 100 초과하여 나옴 다시 보기!!!

//형평3

#include<stdio.h>
int main() {
	int i, j, n;

	scanf("%d", &n);
	for (i = 1;i <= n;i++) {
		for (j = 1;j <= i;j++) {
			printf("*");
		}
		printf("\n");
	}

	for (i = 1;i <= n - 1;i++) {
		for (j = 1;j <= n - i;j++) {
			printf("*");
		}
		printf("\n");
	}
	return 0;
}
//형평4
#include<stdio.h>
int main() {
	int i, j, k, n;

	scanf("%d", &n);
	for (i = 1;i <= n;i++) {
		for (j = 1;j <= i;j++) {
			printf(" ");
		}
		for (k = 1;k <= (n - i) * 2 + 1;k++) {
			printf("*");
		}
		printf("\n");
	}

	for (i = 1;i <= n - 1;i++) {
		for (j = 1;j <= n - i;j++) {
			printf(" ");
		}
		for (k = 1;k <= i * 2 + 1;k++) {
			printf("*");
		}
		printf("\n");
	}
	return 0;
}


//형평5
#include<stdio.h>
int main() {
	int i, j, k, n;

	scanf("%d", &n);
	for (i = 1;i <= n;i++) {
		for (j = 1;j <= (n - i) * 2;j++) {
			printf(" ");
		}
		for (k = 1;k <= i * 2 - 1;k++) {
			printf("*");
		}
		printf("\n");
	}
	return 0;
}

//형평6
#include<stdio.h>
int main() {
	int i, j, k, n;

	scanf("%d", &n);
	for (i = 1;i <= n;i++) {
		for (j = 1;j <= n - i;j++) {
			printf(" ");
		}
		for (k = 1;k <= i;k++) {
			printf("%d ", k);
		}
		printf("\n");
	}
	return 0;
}

//형평7
#include<stdio.h>
int main() {
	int i, j, k, n;
	int xn = 0;
	char xch = 'A';

	scanf("%d", &n);
	for (i = 1;i <= n;i++) {
		for (j = 1;j <= n - i + 1;j++) {
			printf("%c ", xch++);
		}
		for (k = 1;k <= i - 1;k++) {
			printf("%d ", xn++);
		}
		printf("\n");
	}
	return 0;
}

// for (k = 1;k <= i - 1;k++) //에는 i - 1이 들어가야한다

//형평8
#include<stdio.h>
int main() {
	int i, j, k, n;
	int xn = 1;

	scanf("%d", &n);
	for (i = 1;i <= n;i++) {
		for (j = 1;j <= i;j++) {
			printf(" ");
		}
		for (k = 1;k <= n - i + 1;k++) {
			printf("%d ", xn++);
		}
		printf("\n");
	}
	return 0;
}
//형평8-1 xxxxxxxgimina
#include<stdio.h>
int main() {
	int i, j, k, n;
	int xn = 1;

	scanf("%d", &n);

	for (i = 1; i <= n; i++) {

		// 공백 (2칸씩 증가)
		for (j = 1; j <= 2 * (i - 1); j++) {
			printf(" ");
		}

		// 숫자
		for (k = 1; k <= n - i + 1; k++) {
			printf("%d ", xn++);
		}

		printf("\n");
	}

	return 0;
}
//형평9
#include<stdio.h>
int main() {
	int i, j, k, n;

	scanf("%d", &n);
	for (i = 1;i <= n;i++) {
		for (j = 1;j <= i;j++) {
			printf("# ");
		}
		printf("\n");
	}
	for (i = 1;i <= n - 1;i++) {
		for (j = 1;j <= i;j++) {
			printf(" ");
		}
		for (k = 1;k <= n - i;k++) {
			printf("# ");
		}
		printf("\n");
	}
	return 0;
}


//형평10
#include<stdio.h>
int main() {
	int i, j, n;
	int xn = 1;

	scanf("%d", &n);
	for (i = 1;i <= n;i++) {
		for (j = 1;j <= n;j++) {
			printf("%d ", xn);
			xn = (xn + 2) % 10;
		}
		printf("\n");
	}
	return 0;
}