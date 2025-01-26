cmake_minimum_required(VERSION 3.10)

set(CMAKE_CXX_STANDARD 11)
set(CMAKE_CXX_COMPILER clang++)
set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -DUNICODE -D_UNICODE")
project(Lab9)

add_executable(Service09 Service09.cpp)
add_executable(ServiceCtl ServiceCtl.cpp)