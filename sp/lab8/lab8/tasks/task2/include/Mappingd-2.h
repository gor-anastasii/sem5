#pragma once

#ifdef LIB
#define LIB __declspec(dllexport)  // Экспорт для сборки DLL
#else
#define LIB __declspec(dllimport)  // Импорт для использования в других проектах
#endif

#include <windows.h>
#include "Students.h"

// Объявление экспортируемых функций
LIB void createSampleFile(const char* filePath);
LIB void OpenMapping(const char* filePath);
LIB void AddRow(struct Student row, int pos);
LIB int ChekPos(int pos);
LIB void RemRow(int pos);
LIB void PrintRow(int pos);
LIB void PrintRows();
LIB void CloseMapping();
LIB int getValidInput(const char* prompt, int* value);

// #ifndef MAPPINGD_2_H
// #define MAPPINGD_2_H

// #include <windows.h>
// #define MAX_STUDENTS 100

// struct Student {
//     char Name[64];
//     char Surname[128];
//     unsigned char Course;
//     unsigned char Group;
//     char ID[8];
// };


// __declspec(dllexport) void createSampleFile(const char* filePath);
// __declspec(dllexport) void OpenMapping(const char* filePath);
// __declspec(dllexport) void AddRow(struct Student row, int pos);
// __declspec(dllexport) int ChekPos(int pos);
// __declspec(dllexport) void RemRow(int pos);
// __declspec(dllexport) void PrintRow(int pos);
// __declspec(dllexport) void PrintRows();
// __declspec(dllexport) void CloseMapping();
// __declspec(dllexport) int getValidInput(const char* prompt, int* value);
// #endif