//16 struk practice

//1

#include <stdio.h>
#include <string.h>
struct info
{
	char Name [20];
	char School[20];
	int Grade;
};

int main()
{
	struct info x;

	scanf("%s", x.Name);
	printf("Name : %s\n", x.Name);


	scanf("%s", x.School);
	printf("School : %s\n", x.School);

	scanf("%s", &x.Grade);
	printf("Grade : %c\n", x.Grade);
}*/


//2

#include <stdio.h>
struct data
{
	char schoolname[20];
	int grade;
} buddy;

int main()
{
	struct data self = { "Jejuelenmentary", 6 };  // 초기화 한거

	printf("%d grade in %s school\n", self.grade, self.schoolname);
	
	scanf("%d %s", &buddy.grade, buddy.schoolname);
	printf("%d grade in %s school\n", buddy.grade, buddy.schoolname);
	return 0;
}
*/


//3

#include <stdio.h>
#include <string.h>
struct score
{
	char name[20];
	int kor, eng;
};
int main()
{
	struct score a, b, avg;

	scanf("%s %d %d", a.name, &a.kor, &a.eng);
	scanf("%s %d %d", b.name, &b.kor, &b.eng);
	
	strcpy(avg.name, "avg"); 
	avg.kor = (a.kor + b.kor) / 2;
	avg.eng = (a.eng + b.eng) / 2;

	printf("%s %d %d \n", a.name, a.kor, a.eng);
	printf("%s %d %d \n", b.name, b.kor, b.eng);
	printf("%s %d %d \n", avg.name, avg.kor, avg.eng);
	return 0;
}
*/




//4 잘 모르겠어요... 그래도 품

#include <stdio.h>
#include <string.h>

struct tp
{
	double x, y;
} p1, p2, p3, p4;

struct tp center(struct tp a, struct tp b, struct tp c)
{
	struct tp d;
	d.x = (a.x + b.x + c.x) / 3.0;
	d.y = (a.y + b.y + c.y) / 3.0;
	return d;
}

void p_output(struct tp p)
{
	printf("(%.1f, %.1f)\n", p.x, p.y);
}

int main()
{
	scanf("%lf %lf %lf %lf %lf %lf", &p1.x, &p1.y, &p2.x, &p2.y, &p3.x, &p3.y);
	p4 = center(p1, p2, p3);
	p_output(p4);

	return 0;  
}*/



//5... 복붙만한..

#include <stdio.h>
struct info
{
	char name[10];
	int height;
};

struct info list[5];
int min = 0;

void input_data()
{
	int i;
	for (i = 0; i < 5; i++)	{	scanf("%s %d", list[i].name, &list[i].height);	}
}

void find_min()
{
	int i;
	for (i = 1; i < 5; i++)
	{
		if (list[i].height < list[min].height)	{	min = i;	}
	}
}

int main()
{
	input_data(); // 입력 함수 실행
	find_min();


	printf("\n");
	printf("%s %d\n\n", list[min].name, list[min].height);

	return 0;
}
*/



//6

#include <stdio.h>
#include <string.h> // ◀ strcmp 함수를 쓰기 위해 반드시 필요합니다!

struct data
{
	char name[20];
	int he;
	double we;
} stu[5];

void input()
{
	int i;
	for (i = 0; i < 5; i++) {
		scanf("%s %d %lf", stu[i].name, &stu[i].he, &stu[i].we);
	}
}

void sort_name()
{
	int i, j;
	struct data tmp;
	for (i = 0; i < 4; i++) {
		for (j = i + 1; j < 5; j++) {
			// strcmp로 이름을 비교해서 앞뒤 순서를 바꿉
			if (strcmp(stu[i].name, stu[j].name) > 0) {	
				tmp = stu[i];
				stu[i] = stu[j];
				stu[j] = tmp;
			}
		}
	}
}

void sort_weight() // 몸무게가 무거운 순(내림차순) 정렬 
{
	int i, j;
	struct data tmp;
	for (i = 0; i < 4; i++) {
		for (j = i + 1; j < 5; j++) {
			// 무거운 사람이 앞으로 오도록 부등호를 < 로 씁니다.
			if (stu[i].we < stu[j].we) {
				tmp = stu[i]; 
				stu[i] = stu[j];
				stu[j] = tmp;
			}
		}
	}
}

 
void output() //출력 함수 (기존에 2개 만드셨던 것을 하나로 통합해서 씁니다)
{
	int i;
	for (i = 0; i < 5; i++) {
		printf("%s %d %.1f\n", stu[i].name, stu[i].he, stu[i].we);
	}
}

int main()
{
	input(); // 데이터 입력 받기

	// [첫 번째 흐름] 이름순 정렬 후 출력
	sort_name();
	printf("name\n"); // 타이틀 출력
	output();

	// [두 번째 흐름] 몸무게순 정렬 후 출력
	sort_weight();
	printf("weight\n"); // 타이틀 출력
	output();

	return 0;
}

















//16 hp
//hp 1

#include <string.h>
struct data
{
	char name[100], tel[100], addr[100];
};

int main()
{
	struct data info;
	scanf("%s %s %s", info.name, info.tel, info.addr);
	printf("%s %s %s", info.name, info.tel, info.addr);

	return 0;
}




//hp 2
#include <stdio.h>
#include <string.h>
struct data
{
	char name[100], tel[100], addr[100];
};

struct data list[3];

void input()
{
	int i;
	for (i = 0; i < 3; i++)	{ scanf("%s %s %s", list[i].name, list[i].tel, list[i].addr);	}
}

void sort()
{
	struct data tmp;
	for (int i = 0; i < 2; i++)
	{
		for (int j = i + 1; j < 3; j++)
		{
			if (strcmp(list[i].name, list[j].name) > 0) //이름의 가장 첫 문자 순서대료 비교
			{
				tmp = list[i];
				list[i] = list[j];
				list[j] = tmp;
			}
		}
	}
}


int main()
{
	input();
	sort();

	printf("\n");
	printf("name : %s\n", list[0].name);
	printf("tel : %s\n", list[0].tel);
	printf("addr : %s\n", list[0].addr);
	return 0;
}*/



//3
#include<stdio.h>
struct rectangle
{
	int x, y, X, Y;
}r1, r2, R;

int main()
{
	scanf("%d %d %d %d", &r1.x, &r1.y, &r1.X, &r1.Y);
	scanf("%d %d %d %d", &r2.x, &r2.y, &r2.X, &r2.Y);

	if (r1.x < r2.x) R.x = r1.x;
	else R.x = r2.x;
	if (r1.y < r2.y) R.y = r1.y;
	else R.y = r2.y;

	if (r1.X > r2.X) R.X = r1.X;
	else R.X = r2.X;
	if (r1.Y > r2.Y) R.Y = r1.Y;
	else R.Y = r2.Y;

	printf("%d %d %d %d\n", R.x, R.y, R.X, R.Y);

	return 0;
}



//4
struct p
{
	double height, weight;
};

int main()
{
	struct p father, mother, student;
	scanf("%lf %lf", &father.height, &father.weight);
	scanf("%lf %lf", &mother.height, &mother.weight);

	student.height = (father.height + mother.height) / 2.0 + 5;
	student.weight = (father.weight + mother.weight) / 2.0 - 4.5;

	printf("height : %fcm\n", student.height);
	printf("weight : %1.fkg\n", student.weight);
	return 0;
}


//5
#include<stdio.h>
struct data
{
	char name[20];
	int k, e, m, total;
};

int main()
{
	struct data s[20];
	struct data tmp;
	int n;

	scanf("%d", &n);

	for (int i = 0; i < n; i++)
	{
		scanf("%s %d %d %d", s[i].name, &s[i].k, &s[i].e, &s[i].m);
		s[i].total = s[i].k + s[i].e + s[i].m;
	}

	for (int i = 0; i < n - 1; i++) {
		for (int j = i + 1; j < n; j++) {
			if(s[i].total < s[j].total){
				tmp = s[i];
				s[i] = s[j];
				s[j] = tmp;
			}
		}
	}

	for (int i = 0; i < n; i++) {
		printf("%s %d %d %d %d\n", s[i].name, s[i].k, s[i].e, s[i].m, s[i].total);
	}
	return 0;
}