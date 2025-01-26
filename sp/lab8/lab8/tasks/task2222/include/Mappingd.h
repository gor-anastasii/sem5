#pragma once
#include "C:\AllMine\Labs\SP\lab8\lab8\tasks\task2222\include\str.h"



void createSampleFile(const char* filePath);
void OpenMapping(const char* filePath);

void AddRow(struct Student row, int pos);
int ChekPos(int pos);
void RemRow(int pos);
void PrintRow(int pos);
void PrintRows();
void CloseMapping();
int getValidInput(const char* prompt, int* value);
struct Student* GetPStudents();


