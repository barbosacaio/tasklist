# 📋 Tasklist
*Start Date: 2025-12-04*  

---

## 📌 Overview
This is a tasklist API that works by running full **CRUD** functions through **HTTP methods** and manage a list of tasks saved into a **JSON  file**.

## 📖 What to learn
- HTTP methods (GET, POST, PUT, and DELETE)
- Receive and validate JSON
- Separate controllers, services, and routes

## ✅ Practical Tasks
- ``POST`` method to add new tasks
- ``GET`` method to return list of tasks from JSON file
- ``PUT`` to update a specific task based on its unique ID
- ``DELETE`` to delete a specific task based on its unique ID
- Separate each function in controller/service

## ❔ How to use
1. Install **Express**: you can use ``npm install express`` or choose ``npm install express --no-save`` to make it temporary instead of a required dependency
2. Run ``node src/app.js`` to execute the script

## 🎲 Functions
- ``/``: Default route to check if API is running as expected
- ``/add``: ``POST`` route to add a new task into the JSON file
- ``/tasks``: ``GET`` route to list all existing tasks from JSON file