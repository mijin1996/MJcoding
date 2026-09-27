//17 pointer selfpractice & hp
//1

#include <stdio.h>
int main()
{
	int a ;
	int* p;
	p = &a;
	scanf("%d", &a);
	printf("%p %d\n", p, *p);
	
	return 0;
}



//2
#include <stdio.h>
int main()
{
	int a;
	int* p = &a;
	scanf("%d", &a);
	printf("%d...%d %d", (*p) / 10, (*p) % 10, *p);  //16진수 뽑는 법과, 포인터 주소값뽑는법

}


//3
#include<stdio.h>
int main()
{
	int* p = new int;
	int* p2 = new int;

	scanf("%d %d", p, p2);
	printf("%d + %d", *p, *p2, *p+*p2);
	printf("%d - %d", *p, *p2, *p-*p2);
	printf("%d * %d", *p, *p2, *p * *p2);
	printf("%d / %d", *p, *p2, *p / *p2);
	delete p;
	delete p2;
	return 0;
}


//4
#include<stdio.h>
int main()
{
		int a[5] = { 0 };
		int* p = a;

		for (int i = 0; i < 5; i++) {
			scanf("%d",&a[i]);
		}
		printf("%d %d %d", *a, *(a + 2), *(a + 4));
		//printf("%d %d %d", *p, *(p + 2), *(p + 4));
		return 0;
}




//5
#include<stdio.h>
int main()
{
	double a[5] = { 0 };
	double* p = a;

	for (int i = 0; i < 5; i++) {
		scanf("%lf", &p[i]);
		printf("%.1f ", a[i]);
	}
	return 0;
}



//6
#include <stdio.h>
int main()
{
	int n;
	double* p;
	double sum = 0;

	scanf("%d", &n);
	p = new double[n];

	for (int i = 0; i < n; i++) {
		scanf("%lf", &p[i]);
		sum += p[i];
	}
	
	double avg = sum / 4;


	for (int i = n - 1; i >= 0; i--) {
		printf("%.2f ", p[i]);
	}
	printf("\n");
	printf("hap : %.2f", sum);
	printf("avg : %.2f", avg);

	delete[]p;
	return 0;
}




//7
/* worng mine, check under the code
#include<stdio.h>
void swap(int& x, int& y)
{
	int tmp;

	tmp = x;
	x = y;
	y = tmp;
}
void sort(int arr[], int n)
{
	for (int i = 0; n - 1; i++)
	{
		for (int j = i + 1; i < n; j++)
		{
			if (arr[i] < arr[j])
			{
				swap(arr[i], arr[j]);

			}
		}
	}
}


void printfs(int arr)
{
	int n=5;
	for (int i = 0; i < 5; i++)
	{
		printf("%d", arr[i]);
	}
}

int main()
{
	int x, y, n;
	int arr[4] = { 0 };


	
	return 0;
}
*/

#include <stdio.h>
void swap(int* x, int* y)
{
	int tmp = *x;
	*x = *y;
	*y = tmp;
}

void sort(int arr[], int n)
{
	for (int i = 0; i < n - 1; i++)
	{
		for (int j = i + 1; j < n; j++)
		{
			if (arr[i] < arr[j]) { swap(&arr[i], &arr[j]); }
		}
	}
}

void print_array(int arr[], int n)
{
	for (int i = 0; i < n; i++) { printf("%d ", arr[i]); }
	printf("\n");
}

int main()
{
	int n;
	int arr[100] = { 0 };                   // 크기를 '변수' 대신 '상수(100)'로 넉넉하게 선언 (에러 해결!)

	scanf("%d", &n);                        // 첫 번째 입력: 사용할 크기 N 받아오기
	for (int i = 0; i < n; i++) { scanf("%d", &arr[i]); }              // 전체 100칸 중 입력받은 n칸만 사용함 

	sort(arr, n);                          // 실제 사용한 n개만큼만 정렬
	print_array(arr, n);                    // 실제 사용한 n개만큼만 출력

	return 0;
}


















//17 hp
//1
#include<stdio.h>
int main()
{
	double pi = 3.14;
	double* p;
	p = &pi;
	printf("0x%p\n", p);

	char ch = 'A';
	char* p2;
	p2 = &ch;

	printf("0x%p\n", &ch);
}


//2
#include<stdio.h>
int main()
{
	/*
	int arr[100];
	int n;
	scanf("%d", &n);
	for (int i = 0; i < n; i++) {printf("*");}
	*/

	int n;
	int* p = &n;

	scanf("%d", p);
	for (int i = 0; i < *p; i++) printf("*");
}



//3
#include <stdio.h>
int main()
{
	int* p = new int;
	int* pp = new int;
	int* ppp = new int;

	scanf("%d %d", p, pp);
	*ppp = *pp - *p;
	if (*ppp < 0) *ppp = -(*ppp); //누가 들어와도 절대값(양수)으로 합이 출력되

	printf("%d", *ppp);

	delete p;
	delete pp;
	delete ppp;
	return 0;
}



//4
#include <stdio.h>
int main()
{
	int arr[10];
	int* p = arr;
	int evenCnt = 0, oddCnt = 0;

	for (int i = 0; i < 10; i++)
	{
		scanf("%d", &p[i]); // ||(arr+i)로 가능
		if (p[i] % 2 != 0) oddCnt++;
		else evenCnt++;
	}
	printf("odd : %d\n", oddCnt);
	printf("even : %d\n", evenCnt);
	return 0;
}



//5  거의 어찌저찌했지만 min max부분이 헷갈렸음
#include <stdio.h>
void swap(int& x, int& y) { int tmp = x; x = y; y = tmp; }

void sort(int arr[], int n) {
	for (int i = 0; i < n - 1; i++) {
		for (int j = i + 1; j < n; j++) {
			if (arr[i] > arr[j]) {
				swap(arr[i], arr[j]);
			}
		}
	}
}

int main() {
	int n;
	int* p;

	scanf("%d", &n);
	p = new int[n];

	for (int i = 0; i < n; i++) {
		scanf("%d", &p[i]);
	}

	sort(p, n);
	printf("max : %d\n", p[n - 1]);
	printf("min : %d\n", p[0]);

	delete[]p;
	return 0;
}
