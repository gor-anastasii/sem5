#define _CRT_SECURE_NO_WARNINGS

#include <stdio.h>
#include <stdlib.h>
#include <windows.h>
//#include "C:\AllMine\Labs\SP\lab8\lab8\tasks\Dynamic\include\Mappingd.h"
#include "C:\AllMine\Labs\SP\lab8\lab8\tasks\Dynamic2\include\Mappingd-2.h"

typedef void (*CreateSampleFileType)(const char*);
typedef void (*OpenMappingType)(const char*);
typedef void (*AddRowType)(struct Student, int);
typedef int (*ChekPosType)(int);
typedef void (*RemRowType)(int);
typedef void (*PrintRowType)(int);
typedef void (*PrintRowsType)();
typedef void (*CloseMappingType)();
typedef int (*GetValidInputType)(const char*, int*); 

int main() {
    HMODULE hLib = LoadLibraryA("Mappingd-2.dll");
    if (!hLib) {
        printf("Failed to load dll: %lu\n", GetLastError());
        return 1;
    }

    CreateSampleFileType createSampleFile = (CreateSampleFileType)GetProcAddress(hLib, (LPCSTR)MAKEINTRESOURCE(7));
    OpenMappingType openMapping = (OpenMappingType)GetProcAddress(hLib, (LPCSTR)MAKEINTRESOURCE(3));
    AddRowType addRow = (AddRowType)GetProcAddress(hLib, "AddRow");
    ChekPosType chekPos = (ChekPosType)GetProcAddress(hLib, "ChekPos");
    RemRowType remRow = (RemRowType)GetProcAddress(hLib, "RemRow");
    PrintRowType printRow = (PrintRowType)GetProcAddress(hLib, "PrintRow");
    PrintRowsType printRows = (PrintRowsType)GetProcAddress(hLib, "PrintRows");
    CloseMappingType closeMapping = (CloseMappingType)GetProcAddress(hLib, "CloseMapping");
    GetValidInputType getValidInput = (GetValidInputType)GetProcAddress(hLib, "getValidInput"); 

    if (!createSampleFile || !openMapping || !addRow || !remRow || !printRow || !printRows || !closeMapping || !getValidInput) {
        printf("Failed to get function address from Mappingd.dll: %lu\n", GetLastError());
        FreeLibrary(hLib);
        return 1;
    }

    char filePath[260];
    int pos;
    struct Student student;
    int open = 0;

    printf("Enter a filePath: ");
    scanf("%s", filePath);

    if (strstr(filePath, ".bin") == NULL) {
        printf("Error: File path must end with .bin\n");
        return 1;
    }

    int choice;
    do {
        if (!getValidInput("1. Open file\n2. Add student\n3. Rem student\n4. Print row\n5. Print file\n6. Close file\n7. Exit\nEnter operation: ",
            &choice)) {
            continue;
        }

        switch (choice) {
        case 1: {
            if (open) {
                printf("File is already open. Close it first.\n");
                break;
            }
            createSampleFile(filePath);
            openMapping(filePath);
            open = 1;
            break;
        }
        case 2:
            if (!open) {
                printf("File is not open\n");
                break;
            }
            printf("Position: ");
            scanf("%d", &pos);
            if (!chekPos(pos)) {
                break;
            }

            do {
                printf("Name: ");
                scanf("%s", student.Name);
                int valid = 1;
                for (int i = 0; student.Name[i] != '\0'; i++) {
                    if (!isalpha(student.Name[i])) {
                        valid = 0;
                        break;
                    }
                }
                if (!valid) {
                    printf("Name must contain only letters. Try again.\n");
                }
                else {
                    break;
                }
            } while (1);

            do {
                printf("Last name: ");
                scanf("%s", student.Surname);
                int valid = 1;
                for (int i = 0; student.Surname[i] != '\0'; i++) {
                    if (!isalpha(student.Surname[i])) {
                        valid = 0;
                        break;
                    }
                }
                if (!valid) {
                    printf("Last name must contain only letters. Try again.\n");
                }
                else {
                    break;
                }
            } while (1);
            do {
                printf("Course (1-5): ");
                if (scanf("%hhu", &student.Course) == 1 && student.Course >= 1 && student.Course <= 5) {
                    break;
                }
                else {
                    printf("Course must be a number between 1 and 5. Try again.\n");
                    while (getchar() != '\n');
                }
            } while (1);

            do {
                printf("Group (1-10): ");
                if (scanf("%hhu", &student.Group) == 1 && student.Group >= 1 && student.Group <= 10) {
                    break;
                }
                else {
                    printf("Group must be a number between 1 and 10. Try again.\n");
                    while (getchar() != '\n');
                }
            } while (1);

            do {
                printf("ID (exactly 5 digits): ");
                scanf("%s", student.ID);
                int valid = 1;
                if (strlen(student.ID) == 5) {
                    for (int i = 0; i < 5; i++) {
                        if (!isdigit(student.ID[i])) {
                            valid = 0;
                            break;
                        }
                    }
                }
                else {
                    valid = 0;
                }
                if (!valid) {
                    printf("ID must contain exactly 5 digits. Try again.\n");
                }
                else {
                    break;
                }
            } while (1);
            addRow(student, pos);
            break;
        case 3:
            if (!open) {
                printf("File is not open\n");
                break;
            }
            printf("Position: ");
            scanf("%d", &pos);
            remRow(pos);
            break;
        case 4:
            if (!open) {
                printf("File is not open\n");
                break;
            }
            printf("Position: ");
            scanf("%d", &pos);
            printRow(pos);
            break;
        case 5:
            if (!open) {
                printf("File is not open\n");
                break;
            }
            printRows();
            break;
        case 6:
            if (!open) {
                printf("File is not open\n");
                break;
            }
            closeMapping();
            printf("Exiting...\n");
            break;
        case 7:
            printf("Exiting the program...\n");
            if (open) {
                closeMapping();
                printf("File closed before exiting.\n");
            }
            return 0;
        default:
            printf("Wrong option. Try again...\n");
        }
    } while (choice != 7);

    FreeLibrary(hLib);

    return 0;
}