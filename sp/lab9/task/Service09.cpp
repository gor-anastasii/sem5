﻿#pragma comment(lib, "Shlwapi.lib")
#include <windows.h>
#include <iostream>
#include <fstream>
#include <ctime>
#include <string>
#include <Shlwapi.h>
using namespace std;

#define SERVICE_NAME L"Service09"
string LOG_DIR = "C:\\AllMine\\Labs\\SP\\lab9\\task\\Logs";
string WATCH_DIR = "C:\\AllMine\\Labs\\SP\\lab9\\task\\Watch";

SERVICE_STATUS ServiceStatus;
SERVICE_STATUS_HANDLE hStatus;
ofstream srvLog;
ofstream dirLog;

void LogServiceEvent(const string& message);
void LogDirectoryEvent(const string& message);
void WINAPI ServiceMain(DWORD argc, LPWSTR* argv);
void WINAPI ServiceCtrlHandler(DWORD CtrlCode);
void WatchDirectory(LPCSTR directoryPath);

void LogServiceEvent(const string& message) {
    SYSTEMTIME st;
    GetLocalTime(&st);
    string timeStamp = "[" + to_string(st.wHour) + ":" + to_string(st.wMinute) + ":" + to_string(st.wSecond) + "] ";
    srvLog << timeStamp << message << endl;
    srvLog.flush();
    cout << timeStamp << message << endl;
}

void LogDirectoryEvent(const string& message) {
    SYSTEMTIME st;
    GetLocalTime(&st);
    string timeStamp = "[" + to_string(st.wHour) + ":" + to_string(st.wMinute) + ":" + to_string(st.wSecond) + "] ";
    dirLog << timeStamp << message << endl;
    dirLog.flush();
    cout << timeStamp << message << endl;
}

void WINAPI ServiceMain(DWORD argc, LPWSTR* argv) {
    ServiceStatus.dwServiceType = SERVICE_WIN32;
    ServiceStatus.dwCurrentState = SERVICE_START_PENDING;
    ServiceStatus.dwControlsAccepted = SERVICE_ACCEPT_STOP | SERVICE_ACCEPT_PAUSE_CONTINUE;
    ServiceStatus.dwWin32ExitCode = 0;
    ServiceStatus.dwServiceSpecificExitCode = 0;
    ServiceStatus.dwCheckPoint = 0;
    ServiceStatus.dwWaitHint = 0;

    hStatus = RegisterServiceCtrlHandler(SERVICE_NAME, (LPHANDLER_FUNCTION)ServiceCtrlHandler);
    if (hStatus == (SERVICE_STATUS_HANDLE)0) {
        return;
    }

    string srvLogPath = LOG_DIR + "\\" + to_string(time(nullptr)) + "-srv.log";
    string dirLogPath = LOG_DIR + "\\" + to_string(time(nullptr)) + "-dir.log";

    srvLog.open(srvLogPath, ios::out);
    dirLog.open(dirLogPath, ios::out);

    if (!srvLog.is_open()) {
        LogServiceEvent("Failed to open service log file.");
        ServiceStatus.dwCurrentState = SERVICE_STOPPED;
        SetServiceStatus(hStatus, &ServiceStatus);
        return;
    }

    if (!dirLog.is_open()) {
        LogServiceEvent("Failed to open directory log file.");
        ServiceStatus.dwCurrentState = SERVICE_STOPPED;
        SetServiceStatus(hStatus, &ServiceStatus);
        return;
    }
    else {
        LogServiceEvent("Directory log file opened successfully.");
    }

    LogServiceEvent("Success! Service started with parameters: " + LOG_DIR + ", " + WATCH_DIR);

    ServiceStatus.dwCurrentState = SERVICE_RUNNING;
    SetServiceStatus(hStatus, &ServiceStatus);

    WatchDirectory(WATCH_DIR.c_str());
}

void WINAPI ServiceCtrlHandler(DWORD CtrlCode) {
    switch (CtrlCode) {
    case SERVICE_CONTROL_STOP:
        LogServiceEvent("Success! Service Service09 changed state from RUNNING to STOPPED");
        ServiceStatus.dwCurrentState = SERVICE_STOPPED;
        SetServiceStatus(hStatus, &ServiceStatus);
        return;
    case SERVICE_CONTROL_PAUSE:
        LogServiceEvent("Success! Service Service09 changed state from RUNNING to PAUSED");
        ServiceStatus.dwCurrentState = SERVICE_PAUSED;
        SetServiceStatus(hStatus, &ServiceStatus);
        return;
    case SERVICE_CONTROL_CONTINUE:
        LogServiceEvent("Success! Service Service09 changed state from PAUSED to RUNNING");
        ServiceStatus.dwCurrentState = SERVICE_RUNNING;
        SetServiceStatus(hStatus, &ServiceStatus);
        return;
    default:
        break;
    }
}

void WatchDirectory(LPCSTR directoryPath) {
    HANDLE hDir = CreateFileA(
        directoryPath,
        FILE_LIST_DIRECTORY,
        FILE_SHARE_READ | FILE_SHARE_WRITE | FILE_SHARE_DELETE,
        NULL,
        OPEN_EXISTING,
        FILE_FLAG_BACKUP_SEMANTICS,
        NULL
    );

    if (hDir == INVALID_HANDLE_VALUE) {
        LogServiceEvent("Error: Failed to open directory for monitoring");
        return;
    }

    const int bufferSize = 4096;
    char buffer[bufferSize];
    DWORD bytesReturned;
    FILE_NOTIFY_INFORMATION* notifyInfo;

    std::string oldName; // Для хранения старого имени при переименовании

    while (ServiceStatus.dwCurrentState == SERVICE_RUNNING) {
        LogServiceEvent("Waiting for directory changes...");
        if (ReadDirectoryChangesW(
            hDir,
            buffer,
            sizeof(buffer),
            TRUE,
            FILE_NOTIFY_CHANGE_FILE_NAME | FILE_NOTIFY_CHANGE_DIR_NAME |
            FILE_NOTIFY_CHANGE_ATTRIBUTES | FILE_NOTIFY_CHANGE_SIZE |
            FILE_NOTIFY_CHANGE_LAST_WRITE | FILE_NOTIFY_CHANGE_CREATION,
            &bytesReturned,
            NULL,
            NULL)) {

            notifyInfo = (FILE_NOTIFY_INFORMATION*)buffer;
            do {
                wchar_t fileName[MAX_PATH];
                wcsncpy_s(fileName, notifyInfo->FileName, notifyInfo->FileNameLength / sizeof(WCHAR));
                fileName[notifyInfo->FileNameLength / sizeof(WCHAR)] = L'\0';
                char fileNameChar[MAX_PATH];
                WideCharToMultiByte(CP_ACP, 0, fileName, -1, fileNameChar, MAX_PATH, NULL, NULL);

                switch (notifyInfo->Action) {
                case FILE_ACTION_ADDED:
                    LogDirectoryEvent(string("Added: ") + fileNameChar);
                    break;
                case FILE_ACTION_REMOVED:
                    LogDirectoryEvent(string("Removed: ") + fileNameChar);
                    break;
                case FILE_ACTION_MODIFIED:
                    LogDirectoryEvent(string("Modified: ") + fileNameChar);
                    break;
                case FILE_ACTION_RENAMED_OLD_NAME:
                    oldName = fileNameChar; // Сохраняем старое имя
                    LogDirectoryEvent(string("Renamed (old name): ") + fileNameChar);
                    break;
                case FILE_ACTION_RENAMED_NEW_NAME:
                    if (!oldName.empty()) {
                        LogDirectoryEvent(string("Renamed: '") + oldName + "' -> '" + fileNameChar + "'");
                        oldName.clear(); // Очищаем старое имя после обработки
                    }
                    else {
                        LogDirectoryEvent(string("Renamed (new name): ") + fileNameChar);
                    }
                    break;
                default:
                    LogDirectoryEvent(string("Unknown action: ") + fileNameChar);
                    break;
                }
                notifyInfo = notifyInfo->NextEntryOffset
                    ? (FILE_NOTIFY_INFORMATION*)((char*)notifyInfo + notifyInfo->NextEntryOffset)
                    : nullptr;
            } while (notifyInfo);
        }
    }

    CloseHandle(hDir);
}


int wmain(int argc, wchar_t* argv[]) {
    SetConsoleOutputCP(CP_UTF8);

    if (argc > 1 && wcslen(argv[1]) > 0) {
        wstring ws(argv[1]);
        WATCH_DIR = string(ws.begin(), ws.end());
        cout << "WATCH_DIR: " << WATCH_DIR << endl;
    }

    if (!PathFileExistsA(LOG_DIR.c_str())) {
        if (CreateDirectoryA(LOG_DIR.c_str(), NULL)) {
            LogServiceEvent("Success! Service09 created directory " + LOG_DIR);
        }
        else {
            LogServiceEvent("Failed to start! Service09 could not create directory " + LOG_DIR);
            return 1;
        }
    }
    else {
        LogServiceEvent("Success! Service09 found directory " + LOG_DIR);
    }

    if (!PathFileExistsA(WATCH_DIR.c_str())) {
        LogServiceEvent("Failed to start! Service09 could not find directory " + WATCH_DIR);
        return 1;
    }

    SERVICE_TABLE_ENTRY ServiceTable[] = {
        {const_cast<LPWSTR>(SERVICE_NAME), (LPSERVICE_MAIN_FUNCTION)ServiceMain},
        {NULL, NULL}
    };

    if (!StartServiceCtrlDispatcher(ServiceTable)) {
        return 1;
    }

    return 0;
}
