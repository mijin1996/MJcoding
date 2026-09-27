//15 thischapter wasn't me solved usually
//prac1
#include <stdio.h>
int main()
{
	int i;
	char strarr[5][20];
	for (i = 0; i < 5; i++) {
		scanf("%s", strarr[i]);
	}
	for (i = 4; i >=0; i--) {
		printf("%s \n", strarr[i]);
	}
	return 0;
}


//prac2
#include <stdio.h>
#include <string.h>
int main()
{
	int i, len;
	int wcnt = 0, wlen = 0;
	char st[50];
	char word[25][50];
	fgets(st, 50, stdin);
	len = strlen(st);
	while (st[len - 1] == '\n' || st[len - 1] == '\r')
		st[--len] = '\0';
	for (i = 0; i < len; i++) {
		if (st[i] == ' ') {
			word[wcnt][wlen] = '\0';
			wcnt++;
			wlen = 0;
		}
		else {
			word[wcnt][wlen] = st[i];
			wlen++;
		}
	}

	word[wcnt][wlen] = '\0';
	wcnt++;
	for (i = 0; i < wcnt; i++) {
		if (i % 2 == 0)puts(word[i]); //짝수로 뽑기만 추가함
		(word[i]);
	}
	return 0;
}


//prac3
#include <stdio.h>
#include <string.h>
int main()
{
	int i, flag = 0;
	int len;
	char ch;
	char word[10][25];

	scanf(" %c", &ch);
	for (i = 0; i < 10; i++) {
		len = strlen(word[i]);
		if (word[i][len-1]==ch) {
			puts(word[i]);
			flag = 1;
		}
	}
	if (flag == 0) {
		puts("찾는 단어가 없습니다.");
	}
	return 0;
}



//prac4
#include <stdio.h>
#include <string.h>
int main()
{
	char arr[50] = "Hong Gil Dong";
	char tmp[50];

	strcpy(tmp, arr);
	
	printf("%s \n",tmp);
	return 0;
}




//prac5
#include <stdio.h>
#include <string.h>
int main()
{
	char st1[50], st2[50], emthy[100];

	scanf("%s", st1);
	strcat(st1, "fighting");

	puts(st1);
	return 0;
}

//prac6
#include <stdio.h>
#include <string.h>
int main()
{
	char st1[50], st2[50];
	scanf("%s %s", st1, st2);
	strncpy(st2, st1, 2);
	strncat(st2, st1, 2);

	puts(st2);
	return 0;
}




//prac7
#include <stdio.h>
#include <string.h>
int main(){
	char st[101];

	scanf("%s", st);
	if (strchr(st, 'c')){
		printf("Yes ");
	}
	else{
		printf("No ");}

	if (strstr(st, "ab")){
		printf("Yes");
	}
	else{
		printf("No");
	}

	return 0;
}





//prac8
#include <stdio.h>
#include <string.h>

int main()
{
	char a[21], b[21], c[21];

	scanf("%s %s %s", a, b, c);

	if (strcmp(a, b) < 0 && strcmp(a, c) < 0)
		printf("%s", a);

	else if (strcmp(b, a) < 0 && strcmp(b, c) < 0)
		printf("%s", b);

	else
		printf("%s", c);

	return 0;
} 




//prac9
#include <stdio.h>
#include <string.h>
int main()
{
	char str[5][20];
	char temp[20];

	for (int i = 0; i < 5; i++)	{
		scanf("%s", str[i]);
	}

	for (int i = 0; i < 4; i++)	{
		for (int j = i + 1; j < 5; j++){
			if (strcmp(str[i], str[j]) < 0){
				strcpy(temp, str[i]);
				strcpy(str[i], str[j]);
				strcpy(str[j], temp);
			}
		}
	}

	for (int i = 0; i < 5; i++){
		printf("%s\n", str[i]);
	}

	return 0;
}





//10 
#include <stdio.h>
#include <stdlib.h>

int main()
{
	char str[20];

	scanf("%s", str);

	int num1;
	double num2;

	num1 = atoi(str);
	num2 = atof(str);

	printf("%d\n", num1 * 2);
	printf("%.2f\n", num2);

	return 0;
}



//prac11 
#include <stdio.h>
#include <string.h>

int main()
{
	int a, b, c, d, e;
	char str[200];

	scanf("%d %d %d %d %d", &a, &b, &c, &d, &e);
	sprintf(str, "%d%d%d%d%d", a, b, c, d, e);

	int len = strlen(str); //문자열 저장

	for (int i = 0; i < len; i++)	{
		printf("%c", str[i]);
		if ((i + 1) % 3 == 0){ //3자씩 나누기
			printf("\n");
		}
	}

	return 0;
}
