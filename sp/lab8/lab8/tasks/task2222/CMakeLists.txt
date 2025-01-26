cmake_minimum_required(VERSION 3.10)

project(Lab-08b)

# Указываем директории для заголовочных файлов
include_directories(include)

# Указываем файлы исходного кода для первой библиотеки
set(MAPPINGD_SOURCES src/dllmain.c src/Mappingd.def)

# Указываем файлы исходного кода для второй библиотеки
set(MAPPINGD2_SOURCES src/dllmain-2.c)

# Создаем первую библиотеку
add_library(Mappingd SHARED ${MAPPINGD_SOURCES})

# Создаем вторую библиотеку
add_library(Mappingd2 SHARED ${MAPPINGD2_SOURCES})

# Создаем исполняемый файл
add_executable(Lab-08b src/Lab-08b.c)

# Связываем исполняемый файл с обеими библиотеками
target_link_libraries(Lab-08b Mappingd Mappingd2)