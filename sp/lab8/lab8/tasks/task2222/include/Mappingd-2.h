#pragma once
#include <windows.h>
#include "C:\AllMine\Labs\SP\lab8\lab8\tasks\task2222\include\str.h"


__declspec(dllexport) void createSampleFile(const char* filePath);
__declspec(dllexport) void OpenMapping(const char* filePath);
__declspec(dllexport) void AddRow(struct Student row, int pos);
__declspec(dllexport) int ChekPos(int pos);
__declspec(dllexport) void RemRow(int pos);
__declspec(dllexport) void PrintRow(int pos);
__declspec(dllexport) void PrintRows();
__declspec(dllexport) void CloseMapping();
__declspec(dllexport) int getValidInput(const char* prompt, int* value);
__declspec(dllexport) void SetSharedStudents(struct Student* sharedStudents);

//__declspec(dllexport) struct Student* GetStudentsPointer() {
//    return pStudents;
//}