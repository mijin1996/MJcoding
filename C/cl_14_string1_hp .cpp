//14 String _hp 4&&6&&7번도 다시 한 번 보기
//only hp
//1
#include <stdio.h>
#include<stdlib.h>
int main(){
    char ch, ch2;
    scanf(" %c %c", &ch, &ch2);
   
    int minus = ch - ch2;
    int plus = ch + ch2;
    printf("%d %d ", abs(plus), abs(minus));
    return 0;
}



//2
#include <stdio.h>
int main() {
    char c[100];

    scanf("%s", &c);
    for (int i = 1; i <= 5; i++) {
        printf("%c", c[i]);
    }   
    return 0;
}



//3
#include <stdio.h>
#include <string.h>
#include <ctype.h>
int main() {
    char c[100];
    int len;

    scanf("%s", c);
    len = strlen(c);
    for (int i = 0; i < len; i++) {
        if (isalnum(c[i])) {
            printf("%c", tolower(c[i]));  //c로 바꿔주기만 했다
        }
    }
    return 0;
}



//4 notmex
/*#include <stdio.h>
#include <string.h>
int main() {
    char s[100];
    char c;
    int len;
    int alpOposition = -1;

    scanf("%s %c", s, c);
    len = strlen(s); //문자열 길이 알려주는 함수

    for (int i = 0; i < len; i++) {
        if (s[i] == c) {
            alpOposition = i; break;
        }
    }

    if (alpOposition != -1) {
        printf("%d", alpOposition);
    }
    else { printf("No"); }
    
    return 0;       
}*/


//5
#include <stdio.h>
#include <string.h>
int main() {
    char a[100], b[100];

    scanf("%s %s", a, b);
    int len = strlen(a);
    int len2 = strlen(b);

    if (len > len2) {        
        printf("%d", len);
    }
    else { printf("%d", len2); }
  

    return 0;
}


//6




//7  8연습문제와 유사한 문제라고해서 그냥 따라씀
#include <stdio.h>
#include <string.h>
int main() {
    char arr[100];
    int len;
    int count = 1;

    fgets(arr, 100, stdin);
    len = strlen(arr);

    while (arr[len - 1] == '\n' || arr[len - 1] == '\r') {
        arr[--len] = '0';
    }

    printf("%d. ", count++);

    for (int i = 0; i < len; i++) {
        if (arr[i] == ' ') {
            printf("\n%d. ", count++);
        }
        else { printf("%c", arr[i]); }
    }
    printf("\n");

    return 0;
}

