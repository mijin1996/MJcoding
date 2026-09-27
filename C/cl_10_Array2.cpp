//10﻿
//연습1
#include<stdio.h>
int main() {
	int arr[11] = { 0 };
	int i, n;

	while (1)
	{
		scanf("%d", &n);
		if (n < 1 || 10 < n) break;
		arr[n]++;
	}

	for (i = 10;i >= 1;i--) {
		if (0 < arr[i])
		{
			printf("%d : %d개\n", i, arr[i]);
		}
	}

	return 0;
}
//1자가-1
#include<stdio.h>
int main() {
	int arr[27] = { 0 };
	int i;
	char n;

	while (1)
	{
		scanf(" %c", &n);
		if (n < 'A' || 'Z' < n) break;
		arr[n]++; //들어온 숫자 저장
	}

	for (i = 0;i < 27;i++) { //배열자리에 들어오는 숫자(순서)
		if (0 < arr[i])
		{
			printf("%c : %d\n", i+'A', arr[i]);
		}
	}

	return 0;
}

//2자가-1 정체불명의 문제, 어디 문제일까??
#include<stdio.h>
int main() {
	int arr[100] = { 0 };
	int arr2[100] = { 0 };
	int i, n;

	while (1)
	{
		scanf("%d", &n);
		if (n < 1 || 100 < n) break;
		if (n == 0) break;
		arr[n/10]++;
		arr2[n % 10]++;
	}

	for (i = 0;i <= 10; i++) {
		if (0 < arr[i])
		{
			printf("10의자리 %d : %d \n", i, arr[i]);
			printf("1의자리 %d : %d \n", i, arr2[i]);
		}
	}

	return 0;
}

//4자가-1
#include<stdio.h>
int main() {
	int arr[101] = { 0, 100 };
	int n;

	scanf("%d", &n);
	arr[2] = n;

	for (int i = 3; i <= 100;i++)
	{
		arr[i] = arr[i - 2] - arr[i-1];
	}

	for (int i = 1;i <= 100;i++)
	{
		printf("%d ",arr[i]);
			if (arr[i] < 0) break;
	}
}

//5자가-1
#include<stdio.h>
int main()
{
	int i, j;
	int arr[2][4], arr2[2][4];

	printf("first array\n");
	for(i=0;i<2;i++)
	{
		for (j = 0;j <4; j++)
		{
			scanf("%d", &arr[i][j]);
		}
	}

	printf("second array\n");
	for (i = 0;i < 2;i++)
	{
		for (j = 0;j < 4; j++)
		{
			scanf("%d", &arr2[i][j]);
		}
	}

	for (i = 0;i < 2;i++)
	{
		for (j = 0;j < 4; j++)
		{
			printf("%d ", arr[i][j] * arr2[i][j]);
		}
		printf("\n");
	}
}


//6자가-1
#include<stdio.h>
int main() {
	int  arr[5][5] = { 0 };
	int i, j;
	double avg;
	int cnt = 0;
	for (i = 0;i < 5;i++)
	{
		for (j = 0;j < 4;j++)
		{
			scanf("%d", &arr[i][j]);
			arr[i][4] += arr[i][j];
		}
	}
	for (i = 0;i < 5;i++)
	{
		avg = (double)arr[i][4] / 4;
		if (80 <= avg)
		{
			printf("pass\n");
			cnt++;
		}
		else
			{
				printf("fail\n");
			}
	}

			printf("succesfull : %d", cnt);
	return 0;
}*/

//7자가-1
#include<stdio.h>
int main() {
	int  arr[6][6] = {0};
	int i, j;

	arr[0][1] = 1;

	for (i = 1;i < 6;i++) {
		for (j = 1;j < 6;j++) {
			arr[i][j] = arr[i ][j - 1] + arr[i - 1][j];
			printf("%d ", arr[i][j]);
		}
		printf("\n");
	}
	return 0;
} 