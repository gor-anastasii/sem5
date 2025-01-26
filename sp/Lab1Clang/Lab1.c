#define _CRT_SECURE_NO_WARNINGS

#include <stdio.h>
#include <string.h>

void DeleteArr(char* s, int n, int l) {
    int length = strlen(s);
    if (n < 0 || n >= length || l < 0) {
        printf("Error in DeleteArr with parameters (n=%d, l=%d, str='%s')\n", n, l, s);
        return;
    }
    if (n + l > length) {
        l = length - n;
    }

    for (int i = n; i + l < length; i++) {
        s[i] = s[i + l];
    }
    s[length - l] = '\0';
}

void DeletePointer(char* s, int n, int l) {
    int length = strlen(s);
    if (n < 0 || n >= length || l < 0) {
        printf("Error in DeletePointer with parameters (n=%d, l=%d, str='%s')\n", n, l, s);
        return;
    }
    if (n + l > length) {
        l = length - n;
    }

    char* src = s + n + l;
    char* dst = s + n;

    while (*src) {
        *dst++ = *src++;
    }
    *dst = '\0';
}

void testDeleteArr() {
    char str[100];
    char expected[100];

    strcpy(str, "Hello, World!");
    strcpy(expected, "Hello, !");
    DeleteArr(str, 7, 5);
    printf("(Hello World!, 7, 5) -> Expected: '%s', Output: '%s'\n", expected, str);

    strcpy(str, "Hello, World!");
    strcpy(expected, "Hel, World!");
    DeleteArr(str, 3, 2);
    printf("(Hello World!, 3, 2) -> Expected: '%s', Output: '%s'\n", expected, str);

    strcpy(str, "Hello, World!");
    strcpy(expected, ", World!");
    DeleteArr(str, 0, 5);
    printf("(Hello World!, 0, 5) -> Expected: '%s', Output: '%s'\n", expected, str);

    strcpy(str, "Hello, World!");
    strcpy(expected, "Hello, World");
    DeleteArr(str, 12, 1);
    printf("(Hello World!, 12, 1) -> Expected: '%s', Output: '%s'\n", expected, str);

    strcpy(str, "Hello, World!");
    DeleteArr(str, -1, 5); 
    DeleteArr(str, 5, -1); 
    DeleteArr(str, 20, 5);
}

void testDeletePointer() {
    char str[100];
    char expected[100];

    strcpy(str, "Hello, World!");
    strcpy(expected, "Hello, !");
    DeletePointer(str, 7, 5);
    printf("(Hello World!, 7, 5) -> Expected: '%s', Output: '%s'\n", expected, str);

    strcpy(str, "Hello, World!");
    strcpy(expected, "Hel, World!");
    DeletePointer(str, 3, 2);
    printf("(Hello World!, 3, 2) -> Expected: '%s', Output: '%s'\n", expected, str);

    strcpy(str, "Hello, World!");
    strcpy(expected, ", World!");
    DeletePointer(str, 0, 5);
    printf("(Hello World!, 0, 5) -> Expected: '%s', Output: '%s'\n", expected, str);

    strcpy(str, "Hello, World!");
    strcpy(expected, "Hello, World");
    DeletePointer(str, 12, 1);
    printf("(Hello World!, 12, 1) -> Expected: '%s', Output: '%s'\n", expected, str);

    strcpy(str, "Hello, World!");
    DeletePointer(str, -1, 5);
    DeletePointer(str, 5, -1); 
    DeletePointer(str, 20, 5); 
}

int main() {
    printf("Testing DeleteArr:\n");
    testDeleteArr();

    printf("\nTesting DeletePointer:\n");
    testDeletePointer();

    return 0;
}