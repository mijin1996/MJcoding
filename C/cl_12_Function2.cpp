//12
//1
#include<stdio.h>
int main() {
	int i, j, n;
	int a[15];
	int tmp;

	scanf("%d", &n);
	for (int i = 0;i < n;i++) { scanf("%d", &a[i]); }

	for (i = 0;i < n - 1;i++) {
		for (j = i + 1;j < n;j++) {
			if (a[i] < a[j]) {
				tmp = a[i];
				a[i] = a[j];
				a[j] = tmp;
			}
		}
	}

	for (i = 0; i < n; i++) { printf("%d ", a[i]); }
	return 0;
}

//ㄴ>1-1 정답
#include<stdio.h>
void put(int a[], int n) {
	for (int i = 0;i < n;i++)
	{
		scanf("%d", &a[i]);
	}
}

void sort(int a[], int n) {
	int tmp;
	for (int i = 0;i < n - 1;i++) {
		for (int j = i + 1;j < n;j++) {
			if (a[i] < a[j]) {
				tmp = a[i];
				a[i] = a[j];
				a[j] = tmp;
			}
		}
	}
}

void out(int a[], int n) {
	for (int i = 0; i < n; i++)
	{
		printf("%d ", a[i]);
	}
}

int main() {
	int n;
	int arr[15];
	scanf("%d", &n);
	put(arr, n);
	sort(arr, n);
	out(arr, n);

	return 0;
}





//2 X
#include<stdio.h>
#include<math.h>
int main() {
	double a, b;
	int A, B, tmp;

	scanf("%d %d", &a, &b);

	A = sqrt(a);
	B = sqrt(b);

	if (A > B) { //두 수를 포함, 그 사이에 존재하는 정수의 개수 출력위한?...
		tmp = A;
		A = B;
		B = tmp;
	}
//그 아래식을 어떻게 써야할지 고민중
//ㄴ>2번 다시 풀어봄
#include<stdio.h>
#include<math.h>
	int main() {
		double bign, smalln, n1, n2;
		int BIGN, SMALLN;

		scanf("%lf %lf", &bign, &smalln); //12.0, 34.789

		n1 = sqrt(bign); //sqrt(12.0) = 3.464...
		n2 = sqrt(smalln); //sqrt(34.789) = 5.898...

		if (n1 > n2) {
			double tmp = n1;
			n1 = n2;
			n2 = tmp;
		}

		BIGN = (int)floor(n2); // ceill(3.464)... = 4
		SMALLN = (int)ceil(n1); // floor(5.898...) = 5

		printf("%d", BIGN - SMALLN + 1); //큰 수 - 작은 수 + (빼지는 숫자도 개수에 포함해야하므로 +1)

		return 0;
	}



//3
#include<stdio.h>
#include<stdlib.h>
int main() {
	int sum = 0;
	int n;
	for (int i = 0; i < 5;i++) {
		scanf("%d", &n);
		sum += abs(n);
	}
	printf("%d", sum);

	return 0;
}




//4
#include<stdio.h>
#include<math.h>
int main() {
	int n;

	scanf("%d", &n);
	printf("%d", (int)pow(2, n));

	return 0;
}



//5
#include<stdio.h> 
#include<math.h> 
int main() {
	double a, b, c;
	double sum = 0, avg = 0;
	double sum2 = 0, avg2 = 0;

	scanf("%lf %lf %lf", &a, &b, &c);
	sum += a + b + c;
	avg = (int)sum / 3.0;
	printf("%d\n", (int)round(avg));

	sum2 += round(a) + round(b) + round(c);
	avg2 = (int)sum2 / 3.0;
	printf("%d\n", (int)round(avg2));

	return 0;
}


//6번 (7번참고)
#include <stdio.h> 
#define N 7 
#define SWAP(x, y) {int tmp = x; x = y; y = tmp;} 
void input(int a[]) {
	int i;

	for (i = 0; i < N; i++) {
		scanf("%d", &a[i]);
	}
}

void sort(int a[]) {
	int i, j;

	for (i = 1; i < N; i++) {
		for (j = 0; j < N - i; j++) {
			if (a[j] > a[j + 1]) {
				SWAP(a[j], a[j + 1]);
			}
		}
	}
}

void output(int a[]) {
	int i;

	for (i = 0; i < N; i++) {
		printf("%d ", a[i]);
	}
}

int main() {
	int arr[N];

	input(arr);
	sort(arr);
	output(arr);
	return 0;
}



//7번 X 
#include<stdio.h>
#include<math.h>
#define PI 3.141592;
#define SIK(radius) (radius)*(radius)*PI
int main()
{
	double radius;
	double result;

	printf("radius: \n");
	scanf("%lf", &radius);

	//식
	result = SIK(radius);
	printf("are = %.3f", );
}