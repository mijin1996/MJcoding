//15 struck hp
// strncpy(a=b(n), strncat(a+=b(n), strcmp(관계연산자)
 

// 1

#include <stdio.h>
int main()
{
	int i;
	char strarr[3][10];
	for (i = 0; i < 3; i++) {
		scanf("%s", strarr[i]);
	}
	for (i = 3; i > 0; i--) {
		printf("%s \n", strarr[i]);
	}
	return 0;
}



//2

#include <stdio.h>
#include <string.h>
int main()
{
	char words[5][10] = { "flower", "rose", "lily", "daffodil", "azalea" };
	char ch;
	int cnt = 0;

	scanf(" %c", &ch);
	for (int i = 0; i < 5; i++)
	{
		if (words[i][1] == ch || words[i][2] == ch)
		{
			printf("%s\n", words[i]); // 조건에 맞으면 단어 출력
			cnt++;                  // 개수 증가
		}
	}
	
	return 0;
}




//3

#include <stdio.h>
#include <string.h>  //strcmp
int main()
{
	char words[50][110];
	int cnt = 0;

	while (1)
	{
		scanf("%d, words[cnt]");
		if (strcmp(words[cnt], "0") == 0) break;
		cnt++;
	}
	
	for (int i = 0; i < cnt; i += 2) // 홀수 번째 입력받은 단어들만 출력 (인덱스 0, 2, 4...)
	{
		printf("%s\n", words[i]);
	}
	printf("%d", cnt);

	return 0;
}




//4
#include <stdio.h>
#include <string.h>  //strcmp
int main()
{
	char words[50][110];
	char tmp[110];
	int n;

	scanf("%d", &n);

	for (int i = 0; i < n; i++) scanf("%d", s[i]);

	for (int i = 0; i < n - 1; i++)
		for (int j = i + 1; j < n; j++) {
			if (strcmp(words[i], words[j]) > 0)
			{
				strcpy(tmp, words[i]);
				strcpy(words[i], words[j]);
				strcpy(words[j], tmp);
			}
		}
}

for (int i = 0; i < n; i++) {
	printf("%s", s[i]);
}
return 0;
}



//5
#include <stdio.h>
#include <string.h>  //strncpy(a=b(n), strncat(a+=b(n), strcmp(관계연산자)
int main()
{
	char words[6][101];
	char searchC[101];
	char searchS[101];
	int cnt = 0;

	for (int i = 0; i < 5; i++) {
		scanf("%s", words[i]);
	}
	scanf("%s", searchC); //이미 입력된 문자에 대해 또 입력해서 지금 입력된 것과 해당되는 문자를 찾기위해
	scanf("%s", searchS); // 위와 같음(단 문자열 찾기)

	for (int i = 0; i < 5; i++) {
		if (strstr(words[i], searchC) != NULL || strstr(words[i], searchS) != NULL)  //strstr(A, B) 함수는 A 단어 안에 B 글자가 '포함'되어 있으면 NULL이 아닌 값을 반환
		{
			printf("%s\n", words[i]);
			cnt++;
		}
	}
	if (cnt == 0) printf("none");

	//창닫힘 방지코드
	//fflush(stdin); // 또는 rewind(stdin);
	//getchar();
	return 0;
}

//6
#include <stdio.h>
#include <string.h>
int main()
{
	char ch[51], ch2[51], ch3[51];
	int n;

	scanf("%s %s %d", ch, ch2, &n);

	strcpy(ch3, ch);
	strcat(ch3, ch2);
	printf("%s\n", ch3);
	printf("%s\n", strncpy(ch2, ch, n));

	return 0;
}

//7
#include <stdio.h>
#include <stdlib.h>
int main()
{
	char ch[100], ch2[100];
	int a, b;
	scanf("%s %s", ch, ch2);

	a = atoi(ch);
	b = atoi(ch2);
	printf("%d", a * b);

	return 0;
}

//8
#include <stdio.h>
#include <string.h>
int main()
{
	char s[101][21];
	int i, j, len, cnt = 0;

	for (i = 0; i < 100; i++) {
		scanf("%s", s[i]);
		if (strcmp(s[i], "END") == 0) break;
	}
	cnt = i;


	for (i = 0; i < cnt; i++) {
		len = strlen(s[i]);
		for (j = len - 1; j >= 0; j--) {
			printf("%c", s[i][j]);
		}
		printf("\n");
	}

	return 0;
}




//9
#include <stdio.h>
#include <string.h>
int main()
{
	int n;
	double f;
	char ch[31];
	char x[50];

	scanf("%d %lf %s", &n, &f, ch);
	sprintf(x, "%d%.3f%s", n, f, ch);  //여러개를 합치는
	int len = strlen(x);
	int mid = len / 2;

	for (int i = 0; i < mid; i++) { //처음부터 중간까지 뽑기
		printf("%c", x[i]);
	}printf("\n");
	for (int i = mid; i < len; i++) { //중간부터 끝까지 뽑기
		printf("%c", x[i]);
	}

	return 0;
}